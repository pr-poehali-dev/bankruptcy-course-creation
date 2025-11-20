import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface Module {
  id?: number;
  title: string;
}

interface Lesson {
  id?: number;
  module_id: number;
  title: string;
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
  isWelcomeVideo?: boolean;
}

interface FilesTabProps {
  modules: Module[];
  lessons: Lesson[];
  files: CourseFile[];
  uploading: boolean;
  selectedModule?: number;
  selectedLesson?: number;
  welcomeVideoUrl: string;
  welcomeVideoTitle: string;
  welcomeVideoDescription: string;
  moduleFileUrl: string;
  moduleFileTitle: string;
  moduleFileDescription: string;
  onSelectedModuleChange: (moduleId?: number) => void;
  onSelectedLessonChange: (lessonId?: number) => void;
  onWelcomeVideoUrlChange: (url: string) => void;
  onWelcomeVideoTitleChange: (title: string) => void;
  onWelcomeVideoDescriptionChange: (description: string) => void;
  onModuleFileUrlChange: (url: string) => void;
  onModuleFileTitleChange: (title: string) => void;
  onModuleFileDescriptionChange: (description: string) => void;
  onSaveWelcomeVideo: (e: React.FormEvent) => void;
  onSaveModuleFile: (e: React.FormEvent) => void;
  onDeleteFile: (fileId: number) => void;
}

export default function FilesTab({
  modules,
  lessons,
  files,
  uploading,
  selectedModule,
  selectedLesson,
  welcomeVideoUrl,
  welcomeVideoTitle,
  welcomeVideoDescription,
  moduleFileUrl,
  moduleFileTitle,
  moduleFileDescription,
  onSelectedModuleChange,
  onSelectedLessonChange,
  onWelcomeVideoUrlChange,
  onWelcomeVideoTitleChange,
  onWelcomeVideoDescriptionChange,
  onModuleFileUrlChange,
  onModuleFileTitleChange,
  onModuleFileDescriptionChange,
  onSaveWelcomeVideo,
  onSaveModuleFile,
  onDeleteFile,
}: FilesTabProps) {
  return (
    <div className="space-y-6">
      <Card className="border-accent bg-accent/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="Video" size={24} />
            Видео-приветствие
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSaveWelcomeVideo} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="welcome-video-url">Ссылка на видео</Label>
              <Input
                id="welcome-video-url"
                type="url"
                placeholder="https://example.com/video.mp4"
                value={welcomeVideoUrl}
                onChange={(e) => onWelcomeVideoUrlChange(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Вставьте прямую ссылку на видео из вашего облачного хранилища
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="welcome-video-title">Название (опционально)</Label>
              <Input
                id="welcome-video-title"
                type="text"
                placeholder="Видео-приветствие"
                value={welcomeVideoTitle}
                onChange={(e) => onWelcomeVideoTitleChange(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="welcome-video-description">Описание (опционально)</Label>
              <Textarea
                id="welcome-video-description"
                placeholder="Краткое описание видео..."
                value={welcomeVideoDescription}
                onChange={(e) => onWelcomeVideoDescriptionChange(e.target.value)}
                rows={2}
              />
            </div>

            <Button type="submit" className="w-full" disabled={uploading}>
              <Icon name="Save" size={16} className="mr-2" />
              {uploading ? 'Сохранение...' : 'Сохранить видео-приветствие'}
            </Button>

            {files.filter(f => f.isWelcomeVideo).length > 0 && (
              <div className="mt-6 p-4 border border-accent rounded-lg bg-background">
                <h4 className="font-semibold mb-3">Текущее видео-приветствие:</h4>
                {files.filter(f => f.isWelcomeVideo).map(file => (
                  <div key={file.id} className="space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <p className="font-medium">{file.title}</p>
                        {file.description && (
                          <p className="text-sm text-muted-foreground mt-1">{file.description}</p>
                        )}
                        <a 
                          href={file.fileUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs text-accent hover:underline mt-1 inline-block"
                        >
                          {file.fileUrl}
                        </a>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDeleteFile(file.id)}
                      >
                        <Icon name="Trash2" size={16} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Загрузить файл к модулю/уроку</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSaveModuleFile} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="file-module">Прикрепить к модулю (опционально)</Label>
                <select
                  id="file-module"
                  className="w-full p-2 border rounded-md"
                  value={selectedModule || ''}
                  onChange={(e) => {
                    onSelectedModuleChange(e.target.value ? parseInt(e.target.value) : undefined);
                    onSelectedLessonChange(undefined);
                  }}
                >
                  <option value="">Общие материалы</option>
                  {modules.map((mod) => (
                    <option key={mod.id} value={mod.id}>{mod.title}</option>
                  ))}
                </select>
              </div>
              
              {selectedModule && (
                <div className="space-y-2">
                  <Label htmlFor="file-lesson">Прикрепить к уроку (опционально)</Label>
                  <select
                    id="file-lesson"
                    className="w-full p-2 border rounded-md"
                    value={selectedLesson || ''}
                    onChange={(e) => onSelectedLessonChange(e.target.value ? parseInt(e.target.value) : undefined)}
                  >
                    <option value="">Ко всему модулю</option>
                    {lessons
                      .filter((lesson) => lesson.module_id === selectedModule)
                      .map((lesson) => (
                        <option key={lesson.id} value={lesson.id}>{lesson.title}</option>
                      ))}
                  </select>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="module-file-url">Ссылка на файл (PDF, видео)</Label>
              <Input
                id="module-file-url"
                type="url"
                placeholder="https://example.com/file.pdf"
                value={moduleFileUrl}
                onChange={(e) => onModuleFileUrlChange(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Вставьте прямую ссылку на PDF или видео из облачного хранилища
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="module-file-title">Название</Label>
              <Input
                id="module-file-title"
                type="text"
                placeholder="Название файла"
                value={moduleFileTitle}
                onChange={(e) => onModuleFileTitleChange(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="module-file-description">Описание (опционально)</Label>
              <Textarea
                id="module-file-description"
                placeholder="Краткое описание..."
                value={moduleFileDescription}
                onChange={(e) => onModuleFileDescriptionChange(e.target.value)}
                rows={2}
              />
            </div>

            <Button type="submit" className="w-full" disabled={uploading}>
              <Icon name="Save" size={16} className="mr-2" />
              {uploading ? 'Сохранение...' : 'Добавить файл'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Загруженные файлы ({files.filter(f => !f.isWelcomeVideo).length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {files.filter(f => !f.isWelcomeVideo).map((file) => (
              <div key={file.id} className="p-4 border rounded-lg flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name="FileText" size={20} className="text-primary" />
                    <h3 className="font-semibold">{file.title}</h3>
                  </div>
                  {file.description && (
                    <p className="text-sm text-muted-foreground mb-2">{file.description}</p>
                  )}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{file.fileName}</span>
                    <span>{(file.fileSize / 1024 / 1024).toFixed(2)} MB</span>
                    <span>{new Date(file.uploadedAt).toLocaleDateString('ru-RU')}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(file.fileUrl, '_blank')}
                  >
                    <Icon name="Download" size={16} />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDeleteFile(file.id)}
                  >
                    <Icon name="Trash2" size={16} />
                  </Button>
                </div>
              </div>
            ))}
            {files.length === 0 && (
              <p className="text-center text-muted-foreground py-8">Файлов пока нет</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
