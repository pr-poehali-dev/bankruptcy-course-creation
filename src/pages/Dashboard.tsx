import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { course, getFiles } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface Material {
  id: number;
  title: string;
  file_url: string;
  file_type: string;
}

interface CourseFile {
  id: number;
  title: string;
  description: string;
  file_name: string;
  file_url: string;
  file_type: string;
  file_size: number;
  uploaded_at?: string;
  module_id?: number;
  lesson_id?: number;
  is_welcome_video?: boolean;
}

interface Lesson {
  id: number;
  title: string;
  description: string;
  video_url: string;
  duration_minutes: number;
  progress: {
    completed: boolean;
    watch_time_seconds: number;
  };
  materials: Material[];
  files?: CourseFile[];
}

interface Module {
  id: number;
  title: string;
  description: string;
  lessons: Lesson[];
  materials: Material[];
  files?: CourseFile[];
}

export const Dashboard = () => {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [files, setFiles] = useState<any[]>([]);
  const videoRefs = useRef<{ [key: number]: HTMLVideoElement | null }>({});
  const progressIntervals = useRef<{ [key: number]: NodeJS.Timeout }>({});

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    
    loadCourseContent();
    loadCourseFiles();
  }, [token, navigate]);

  const loadCourseContent = async () => {
    try {
      const data = await course.getContent(token!);
      if (data.error) {
        setError(data.error);
      } else {
        console.log('Course modules data:', data);
        // Log files for debugging
        data.forEach((module: Module) => {
          if (module.files && module.files.length > 0) {
            console.log(`Module "${module.title}" files:`, module.files);
          }
          module.lessons.forEach((lesson: Lesson) => {
            if (lesson.files && lesson.files.length > 0) {
              console.log(`Lesson "${lesson.title}" files:`, lesson.files);
            }
          });
        });
        setModules(data);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateProgress = () => {
    let total = 0;
    let completed = 0;
    modules.forEach(module => {
      module.lessons.forEach(lesson => {
        total++;
        if (lesson.progress?.completed) completed++;
      });
    });
    return total > 0 ? (completed / total) * 100 : 0;
  };

  const markLessonComplete = async (lessonId: number) => {
    try {
      await course.updateProgress(token!, lessonId, true, 0);
      loadCourseContent();
    } catch (err) {
      console.error('Error updating progress:', err);
    }
  };

  const handleVideoPlay = (lessonId: number) => {
    // Отправляем прогресс каждые 5 секунд
    if (progressIntervals.current[lessonId]) {
      clearInterval(progressIntervals.current[lessonId]);
    }
    
    progressIntervals.current[lessonId] = setInterval(async () => {
      const video = videoRefs.current[lessonId];
      if (video && !video.paused) {
        const watchTime = Math.floor(video.currentTime);
        const duration = Math.floor(video.duration);
        const completed = watchTime >= duration * 0.9; // 90% просмотра = завершено
        
        try {
          await course.updateProgress(token!, lessonId, completed, watchTime);
          if (completed) {
            clearInterval(progressIntervals.current[lessonId]);
            loadCourseContent(); // Обновляем данные при завершении
          }
        } catch (err) {
          console.error('Error updating progress:', err);
        }
      }
    }, 5000);
  };

  const handleVideoPause = (lessonId: number) => {
    if (progressIntervals.current[lessonId]) {
      clearInterval(progressIntervals.current[lessonId]);
    }
    
    // Сохраняем прогресс при паузе
    const video = videoRefs.current[lessonId];
    if (video) {
      const watchTime = Math.floor(video.currentTime);
      const duration = Math.floor(video.duration);
      const completed = watchTime >= duration * 0.9;
      
      course.updateProgress(token!, lessonId, completed, watchTime).catch(err => {
        console.error('Error saving progress on pause:', err);
      });
    }
  };

  const handleVideoEnded = async (lessonId: number) => {
    if (progressIntervals.current[lessonId]) {
      clearInterval(progressIntervals.current[lessonId]);
    }
    
    const video = videoRefs.current[lessonId];
    if (video) {
      const watchTime = Math.floor(video.duration);
      try {
        await course.updateProgress(token!, lessonId, true, watchTime);
        loadCourseContent();
      } catch (err) {
        console.error('Error marking as completed:', err);
      }
    }
  };

  // Очистка интервалов при размонтировании
  useEffect(() => {
    return () => {
      Object.values(progressIntervals.current).forEach(interval => {
        clearInterval(interval);
      });
    };
  }, []);

  const loadCourseFiles = async () => {
    try {
      const data = await getFiles(token!);
      if (!data.error) {
        setFiles(data.files || []);
      }
    } catch (err) {
      console.error('Error loading files:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-primary/5 to-accent/10">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-lg font-medium">Загрузка курса...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-primary/5 to-accent/10">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <Icon name="AlertCircle" size={24} />
              Доступ ограничен
            </CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Чтобы получить доступ к материалам курса, необходимо его приобрести.
            </p>
            <Button onClick={() => navigate('/')} className="w-full">
              Перейти к покупке курса
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalLessons = modules.reduce((acc, mod) => acc + mod.lessons.length, 0);
  const completedLessons = modules.reduce((acc, mod) => 
    acc + mod.lessons.filter(l => l.progress?.completed).length, 0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 dark:bg-slate-950/80 backdrop-blur-lg shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold">
                {user?.full_name?.charAt(0) || 'У'}
              </div>
              <div>
                <h1 className="text-xl font-bold">Личный кабинет</h1>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {user?.is_admin && (
                <Button variant="outline" size="sm" onClick={() => navigate('/admin')}>
                  <Icon name="Settings" size={16} className="mr-2" />
                  Админка
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={logout}>
                <Icon name="LogOut" size={16} className="mr-2" />
                Выйти
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Progress Card */}
        <Card className="mb-8 border-0 shadow-lg bg-gradient-to-br from-primary via-primary to-accent text-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold mb-1">Ваш прогресс</h2>
                <p className="text-white/80">Курс "Банкротство физических лиц"</p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold">{Math.round(calculateProgress())}%</div>
                <p className="text-white/80 text-sm">{completedLessons} из {totalLessons} уроков</p>
              </div>
            </div>
            <Progress value={calculateProgress()} className="h-3 bg-white/20" />
          </CardContent>
        </Card>

        {/* Welcome Video */}
        {files.filter(f => f.isWelcomeVideo).length > 0 && (
          <Card className="mb-8 border-0 shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-accent/20 to-primary/20 p-6 border-b">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center">
                  <Icon name="Play" size={24} className="text-accent" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Добро пожаловать!</h3>
                  <p className="text-muted-foreground">Начните с приветственного видео</p>
                </div>
              </div>
            </div>
            <CardContent className="p-6">
              {files.filter(f => f.isWelcomeVideo).map((file) => (
                <div key={file.id} className="space-y-4">
                  <div className="aspect-video bg-slate-950 rounded-xl overflow-hidden shadow-xl">
                    <video 
                      controls 
                      className="w-full h-full"
                    >
                      <source src={file.fileUrl} type={file.fileType} />
                      Ваш браузер не поддерживает видео.
                    </video>
                  </div>
                  {file.description && (
                    <p className="text-muted-foreground">{file.description}</p>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Course Modules */}
        <div className="space-y-6">
          {modules.map((module, moduleIndex) => {
            const moduleLessonsTotal = module.lessons.length;
            const moduleLessonsCompleted = module.lessons.filter(l => l.progress?.completed).length;
            const moduleProgress = moduleLessonsTotal > 0 ? (moduleLessonsCompleted / moduleLessonsTotal) * 100 : 0;

            return (
              <Card key={module.id} className="border-0 shadow-lg overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border-b">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-xl font-bold text-primary">{moduleIndex + 1}</span>
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">{module.title}</CardTitle>
                        <CardDescription className="text-base">{module.description}</CardDescription>
                        <div className="mt-3 flex items-center gap-4">
                          <Badge variant="secondary" className="gap-1">
                            <Icon name="Video" size={14} />
                            {moduleLessonsTotal} {moduleLessonsTotal === 1 ? 'урок' : moduleLessonsTotal < 5 ? 'урока' : 'уроков'}
                          </Badge>
                          <div className="flex items-center gap-2 text-sm">
                            <Progress value={moduleProgress} className="w-24 h-2" />
                            <span className="text-muted-foreground">{Math.round(moduleProgress)}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-6">
                  {/* Module Materials */}
                  {(module.materials.length > 0 || (module.files && module.files.length > 0)) && (
                    <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-900">
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Icon name="Paperclip" size={18} className="text-amber-600" />
                        <span>Материалы модуля</span>
                      </h4>
                      <div className="grid gap-2">
                        {module.materials.map((material) => (
                          <a
                            key={material.id}
                            href={material.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-amber-900 dark:text-amber-100 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                          >
                            <Icon name="Download" size={14} />
                            {material.title}
                          </a>
                        ))}
                        {module.files && module.files.map((file) => (
                          <div key={file.id} className="flex items-center gap-3 p-3 bg-white dark:bg-slate-900 rounded-lg border">
                            <Icon name="FileText" size={18} className="text-primary" />
                            <div className="flex-1 min-w-0">
                              <a
                                href={file.file_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium text-sm hover:text-primary transition-colors"
                              >
                                {file.title}
                              </a>
                              {file.description && (
                                <p className="text-xs text-muted-foreground mt-0.5">{file.description}</p>
                              )}
                            </div>
                            <a
                              href={file.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-shrink-0 p-2 rounded-lg hover:bg-primary/10 transition-colors"
                            >
                              <Icon name="ExternalLink" size={16} className="text-primary" />
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Lessons Accordion */}
                  <Accordion type="single" collapsible className="space-y-3">
                    {module.lessons.map((lesson, lessonIndex) => (
                      <AccordionItem 
                        key={lesson.id} 
                        value={`lesson-${lesson.id}`} 
                        className="border rounded-xl overflow-hidden bg-white dark:bg-slate-900 shadow-sm"
                      >
                        <AccordionTrigger className="hover:no-underline px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                          <div className="flex items-center gap-4 flex-1 text-left">
                            <div className="flex-shrink-0">
                              {lesson.progress?.completed ? (
                                <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center">
                                  <Icon name="CheckCircle" size={20} className="text-green-600 dark:text-green-400" />
                                </div>
                              ) : (
                                <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-600 dark:text-slate-400">
                                  {lessonIndex + 1}
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-base mb-1">{lesson.title}</p>
                              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Icon name="Clock" size={14} />
                                  {lesson.duration_minutes} мин
                                </span>
                                {lesson.files && lesson.files.length > 0 && (
                                  <span className="flex items-center gap-1">
                                    <Icon name="Paperclip" size={14} />
                                    {lesson.files.length} {lesson.files.length === 1 ? 'файл' : 'файла'}
                                  </span>
                                )}
                              </div>
                            </div>
                            {lesson.progress?.completed && (
                              <Badge className="bg-green-500 hover:bg-green-600">
                                Завершено
                              </Badge>
                            )}
                          </div>
                        </AccordionTrigger>
                        
                        <AccordionContent className="px-5 pb-5 pt-2">
                          <div className="space-y-4">
                            <p className="text-muted-foreground leading-relaxed">{lesson.description}</p>
                            
                            {lesson.video_url && (
                              <div className="space-y-3">
                                <div className="aspect-video rounded-xl overflow-hidden bg-slate-950 shadow-xl">
                                  <video
                                    ref={(el) => (videoRefs.current[lesson.id] = el)}
                                    src={lesson.video_url}
                                    controls
                                    className="w-full h-full"
                                    controlsList="nodownload"
                                    onPlay={() => handleVideoPlay(lesson.id)}
                                    onPause={() => handleVideoPause(lesson.id)}
                                    onEnded={() => handleVideoEnded(lesson.id)}
                                  />
                                </div>
                                {lesson.progress?.watch_time_seconds > 0 && (
                                  <div className="flex items-center gap-2">
                                    <Progress 
                                      value={(lesson.progress.watch_time_seconds / (lesson.duration_minutes * 60)) * 100} 
                                      className="flex-1 h-2" 
                                    />
                                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                                      {Math.floor(lesson.progress.watch_time_seconds / 60)}:{String(lesson.progress.watch_time_seconds % 60).padStart(2, '0')} / {lesson.duration_minutes}:00
                                    </span>
                                  </div>
                                )}
                              </div>
                            )}

                            {lesson.materials.length > 0 && (
                              <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-900">
                                <h5 className="font-semibold mb-3 flex items-center gap-2">
                                  <Icon name="Download" size={16} className="text-blue-600" />
                                  Материалы к уроку
                                </h5>
                                <div className="grid gap-2">
                                  {lesson.materials.map((material) => (
                                    <a
                                      key={material.id}
                                      href={material.file_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-2 text-sm text-blue-900 dark:text-blue-100 hover:text-blue-600 dark:hover:text-blue-400"
                                    >
                                      <Icon name="FileDown" size={14} />
                                      {material.title}
                                    </a>
                                  ))}
                                </div>
                              </div>
                            )}

                            {lesson.files && lesson.files.length > 0 && (
                              <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-900">
                                <h5 className="font-semibold mb-3 flex items-center gap-2">
                                  <Icon name="FileText" size={16} className="text-purple-600" />
                                  Дополнительные файлы
                                </h5>
                                <div className="grid gap-2">
                                  {lesson.files.map((file: any) => (
                                    <div key={file.id} className="flex items-center gap-3 p-3 bg-white dark:bg-slate-900 rounded-lg border">
                                      <Icon name="FileText" size={18} className="text-purple-600" />
                                      <div className="flex-1 min-w-0">
                                        <a
                                          href={file.file_url || file.fileUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="font-medium text-sm hover:text-purple-600 transition-colors"
                                        >
                                          {file.title}
                                        </a>
                                        {file.description && (
                                          <p className="text-xs text-muted-foreground mt-1">{file.description}</p>
                                        )}
                                      </div>
                                      <a
                                        href={file.file_url || file.fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-shrink-0 p-2 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-950 transition-colors"
                                      >
                                        <Icon name="ExternalLink" size={16} className="text-purple-600" />
                                      </a>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {!lesson.progress?.completed && (
                              <Button
                                onClick={() => markLessonComplete(lesson.id)}
                                className="w-full"
                                size="lg"
                              >
                                <Icon name="CheckCircle" size={18} className="mr-2" />
                                Отметить урок завершенным
                              </Button>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;