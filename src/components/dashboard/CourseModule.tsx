import { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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

interface CourseModuleProps {
  module: Module;
  moduleIndex: number;
  videoRefs: React.MutableRefObject<{ [key: number]: HTMLVideoElement | null }>;
  onVideoPlay: (lessonId: number) => void;
  onVideoPause: (lessonId: number) => void;
  onVideoEnded: (lessonId: number) => void;
  onMarkComplete: (lessonId: number) => void;
}

export default function CourseModule({
  module,
  moduleIndex,
  videoRefs,
  onVideoPlay,
  onVideoPause,
  onVideoEnded,
  onMarkComplete,
}: CourseModuleProps) {
  const moduleLessonsTotal = module.lessons.length;
  const moduleLessonsCompleted = module.lessons.filter(l => l.progress?.completed).length;
  const moduleProgress = moduleLessonsTotal > 0 ? (moduleLessonsCompleted / moduleLessonsTotal) * 100 : 0;

  return (
    <Card className="border-0 shadow-lg overflow-hidden">
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
                          onPlay={() => onVideoPlay(lesson.id)}
                          onPause={() => onVideoPause(lesson.id)}
                          onEnded={() => onVideoEnded(lesson.id)}
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
                      onClick={() => onMarkComplete(lesson.id)}
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
}
