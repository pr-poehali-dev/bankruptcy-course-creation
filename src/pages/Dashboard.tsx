import { useEffect, useState } from 'react';
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
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  uploadedAt: string;
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
}

const Dashboard = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [modules, setModules] = useState<Module[]>([]);
  const [files, setFiles] = useState<CourseFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p>Загрузка...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Доступ к курсу</CardTitle>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Личный кабинет</h1>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-semibold">{user?.full_name}</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
            {user?.is_admin && (
              <Button variant="outline" onClick={() => navigate('/admin')}>
                <Icon name="Settings" size={16} className="mr-2" />
                Админ-панель
              </Button>
            )}
            <Button variant="outline" onClick={logout}>
              <Icon name="LogOut" size={16} className="mr-2" />
              Выйти
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Прогресс обучения</CardTitle>
            <CardDescription>
              Ваш прогресс по курсу "Банкротство физических лиц"
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Завершено уроков</span>
                <span className="font-semibold">{Math.round(calculateProgress())}%</span>
              </div>
              <Progress value={calculateProgress()} className="h-3" />
            </div>
          </CardContent>
        </Card>

        {files.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="FileText" size={24} />
                Материалы курса
              </CardTitle>
              <CardDescription>
                Скачайте дополнительные материалы и документы
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {files.map((file) => (
                  <a
                    key={file.id}
                    href={file.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <Icon name="FileText" size={20} className="text-primary mt-1" />
                    <div className="flex-1">
                      <p className="font-semibold">{file.title}</p>
                      {file.description && (
                        <p className="text-sm text-muted-foreground mt-1">{file.description}</p>
                      )}
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span>{file.fileName}</span>
                        <span>•</span>
                        <span>{(file.fileSize / 1024 / 1024).toFixed(2)} MB</span>
                      </div>
                    </div>
                    <Icon name="Download" size={18} className="text-muted-foreground" />
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-6">
          {modules.map((module) => (
            <Card key={module.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="BookOpen" size={24} />
                  {module.title}
                </CardTitle>
                <CardDescription>{module.description}</CardDescription>
              </CardHeader>
              <CardContent>
                {module.materials.length > 0 && (
                  <div className="mb-4 p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Icon name="FileText" size={18} />
                      Материалы модуля
                    </h4>
                    <div className="space-y-2">
                      {module.materials.map((material) => (
                        <a
                          key={material.id}
                          href={material.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm hover:text-accent"
                        >
                          <Icon name="Download" size={14} />
                          {material.title}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                <Accordion type="single" collapsible className="space-y-2">
                  {module.lessons.map((lesson, index) => (
                    <AccordionItem key={lesson.id} value={`lesson-${lesson.id}`} className="border rounded-lg px-4">
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-3 flex-1 text-left">
                          <div className="flex-shrink-0">
                            {lesson.progress?.completed ? (
                              <Badge className="bg-green-500">
                                <Icon name="CheckCircle" size={14} className="mr-1" />
                                Завершено
                              </Badge>
                            ) : (
                              <Badge variant="outline">Урок {index + 1}</Badge>
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold">{lesson.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {lesson.duration_minutes} мин
                            </p>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-4 pt-4">
                        <p className="text-muted-foreground">{lesson.description}</p>
                        
                        {lesson.video_url && (
                          <div className="aspect-video rounded-lg overflow-hidden bg-black">
                            <video
                              src={lesson.video_url}
                              controls
                              className="w-full h-full"
                              controlsList="nodownload"
                            />
                          </div>
                        )}

                        {lesson.materials.length > 0 && (
                          <div className="p-4 bg-muted/50 rounded-lg">
                            <h5 className="font-semibold mb-2 flex items-center gap-2">
                              <Icon name="Paperclip" size={16} />
                              Материалы к уроку
                            </h5>
                            <div className="space-y-2">
                              {lesson.materials.map((material) => (
                                <a
                                  key={material.id}
                                  href={material.file_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 text-sm hover:text-accent"
                                >
                                  <Icon name="Download" size={14} />
                                  {material.title}
                                </a>
                              ))}
                            </div>
                          </div>
                        )}

                        {lesson.files && lesson.files.length > 0 && (
                          <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                            <h5 className="font-semibold mb-3 flex items-center gap-2">
                              <Icon name="FileText" size={18} className="text-primary" />
                              Файлы к уроку
                            </h5>
                            <div className="space-y-2">
                              {lesson.files.map((file: any) => (
                                <button
                                  key={file.id}
                                  onClick={() => {
                                    try {
                                      const fileUrl = file.file_url || file.fileUrl;
                                      const fileName = file.file_name || file.fileName || 'file.pdf';
                                      
                                      if (fileUrl.startsWith('data:')) {
                                        const byteString = atob(fileUrl.split(',')[1]);
                                        const mimeString = fileUrl.split(',')[0].split(':')[1].split(';')[0];
                                        const ab = new ArrayBuffer(byteString.length);
                                        const ia = new Uint8Array(ab);
                                        for (let i = 0; i < byteString.length; i++) {
                                          ia[i] = byteString.charCodeAt(i);
                                        }
                                        const blob = new Blob([ab], { type: mimeString });
                                        const blobUrl = URL.createObjectURL(blob);
                                        
                                        const link = document.createElement('a');
                                        link.href = blobUrl;
                                        link.download = fileName;
                                        document.body.appendChild(link);
                                        link.click();
                                        document.body.removeChild(link);
                                        
                                        setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
                                      } else {
                                        const link = document.createElement('a');
                                        link.href = fileUrl;
                                        link.download = fileName;
                                        link.target = '_blank';
                                        document.body.appendChild(link);
                                        link.click();
                                        document.body.removeChild(link);
                                      }
                                    } catch (error) {
                                      console.error('Ошибка при скачивании файла:', error);
                                      alert('Не удалось скачать файл. Попробуйте еще раз.');
                                    }
                                  }}
                                  className="flex items-start gap-3 p-3 bg-background rounded-md hover:bg-muted/50 transition-colors w-full text-left"
                                >
                                  <Icon name="FileText" size={18} className="text-primary mt-0.5" />
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium text-sm">{file.title}</p>
                                    {file.description && (
                                      <p className="text-xs text-muted-foreground mt-1">{file.description}</p>
                                    )}
                                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                                      <span>{file.file_name || file.fileName}</span>
                                      <span>•</span>
                                      <span>{((file.file_size || file.fileSize) / 1024 / 1024).toFixed(2)} MB</span>
                                    </div>
                                  </div>
                                  <Icon name="Download" size={16} className="text-primary" />
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {!lesson.progress?.completed && (
                          <Button
                            onClick={() => markLessonComplete(lesson.id)}
                            className="w-full"
                          >
                            <Icon name="CheckCircle" size={16} className="mr-2" />
                            Отметить как завершенное
                          </Button>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;