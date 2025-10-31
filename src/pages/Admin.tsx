import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { admin } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { uploadFile, getFiles, deleteFile } from '@/lib/api';

interface Module {
  id?: number;
  title: string;
  description: string;
  sort_order: number;
  is_published: boolean;
}

interface Lesson {
  id?: number;
  module_id: number;
  title: string;
  description: string;
  video_url: string;
  duration_minutes: number;
  sort_order: number;
  is_published: boolean;
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

const Admin = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [modules, setModules] = useState<Module[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [files, setFiles] = useState<CourseFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [newModule, setNewModule] = useState<Module>({
    title: '',
    description: '',
    sort_order: 0,
    is_published: false,
  });
  const [newLesson, setNewLesson] = useState<Lesson>({
    module_id: 0,
    title: '',
    description: '',
    video_url: '',
    duration_minutes: 0,
    sort_order: 0,
    is_published: false,
  });

  useEffect(() => {
    if (!token || !user?.is_admin) {
      navigate('/login');
      return;
    }
    loadModules();
    loadLessons();
    loadFiles();
  }, [token, user, navigate]);

  const loadModules = async () => {
    try {
      const data = await admin.getModules(token!);
      if (!data.error) {
        setModules(data);
      }
    } catch (err) {
      console.error('Error loading modules:', err);
    }
  };

  const loadLessons = async () => {
    try {
      const data = await admin.getLessons(token!);
      if (!data.error) {
        setLessons(data);
      }
    } catch (err) {
      console.error('Error loading lessons:', err);
    }
  };

  const handleCreateModule = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await admin.createModule(token!, newModule);
      if (data.error) {
        toast({ title: 'Ошибка', description: data.error, variant: 'destructive' });
      } else {
        toast({ title: 'Успех', description: 'Модуль создан' });
        setNewModule({ title: '', description: '', sort_order: 0, is_published: false });
        loadModules();
      }
    } catch (err: any) {
      toast({ title: 'Ошибка', description: err.message, variant: 'destructive' });
    }
  };

  const handleCreateLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await admin.createLesson(token!, newLesson);
      if (data.error) {
        toast({ title: 'Ошибка', description: data.error, variant: 'destructive' });
      } else {
        toast({ title: 'Успех', description: 'Урок создан' });
        setNewLesson({
          module_id: 0,
          title: '',
          description: '',
          video_url: '',
          duration_minutes: 0,
          sort_order: 0,
          is_published: false,
        });
        loadLessons();
      }
    } catch (err: any) {
      toast({ title: 'Ошибка', description: err.message, variant: 'destructive' });
    }
  };

  const loadFiles = async () => {
    try {
      const data = await getFiles(token!);
      if (!data.error) {
        setFiles(data.files || []);
      }
    } catch (err) {
      console.error('Error loading files:', err);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const title = prompt('Название файла:', file.name);
    if (!title) return;

    const description = prompt('Описание файла (опционально):', '');

    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64 = event.target?.result as string;
        const fileContent = base64.split(',')[1];

        const data = await uploadFile(token!, {
          fileName: file.name,
          fileContent,
          fileType: file.type,
          title,
          description: description || '',
        });

        if (data.error) {
          toast({ title: 'Ошибка', description: data.error, variant: 'destructive' });
        } else {
          toast({ title: 'Успех', description: 'Файл загружен' });
          loadFiles();
        }
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      toast({ title: 'Ошибка', description: err.message, variant: 'destructive' });
      setUploading(false);
    }
  };

  const handleDeleteFile = async (fileId: number) => {
    if (!confirm('Удалить этот файл?')) return;

    try {
      const data = await deleteFile(token!, fileId);
      if (data.error) {
        toast({ title: 'Ошибка', description: data.error, variant: 'destructive' });
      } else {
        toast({ title: 'Успех', description: 'Файл удален' });
        loadFiles();
      }
    } catch (err: any) {
      toast({ title: 'Ошибка', description: err.message, variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10">
      <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Админ-панель</h1>
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              <Icon name="ArrowLeft" size={16} className="mr-2" />
              К курсам
            </Button>
            <Button variant="outline" onClick={logout}>
              <Icon name="LogOut" size={16} className="mr-2" />
              Выйти
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="modules" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="modules">Модули</TabsTrigger>
            <TabsTrigger value="lessons">Уроки</TabsTrigger>
            <TabsTrigger value="files">Файлы</TabsTrigger>
          </TabsList>

          <TabsContent value="modules" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Создать новый модуль</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateModule} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="module-title">Название модуля</Label>
                    <Input
                      id="module-title"
                      value={newModule.title}
                      onChange={(e) => setNewModule({ ...newModule, title: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="module-description">Описание</Label>
                    <Textarea
                      id="module-description"
                      value={newModule.description}
                      onChange={(e) => setNewModule({ ...newModule, description: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="module-order">Порядковый номер</Label>
                    <Input
                      id="module-order"
                      type="number"
                      value={newModule.sort_order}
                      onChange={(e) => setNewModule({ ...newModule, sort_order: parseInt(e.target.value) })}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="module-published"
                      checked={newModule.is_published}
                      onCheckedChange={(checked) => setNewModule({ ...newModule, is_published: checked })}
                    />
                    <Label htmlFor="module-published">Опубликовать модуль</Label>
                  </div>

                  <Button type="submit" className="w-full">
                    <Icon name="Plus" size={16} className="mr-2" />
                    Создать модуль
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Список модулей</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {modules.map((module) => (
                    <div key={module.id} className="p-4 border rounded-lg flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">{module.title}</h3>
                        <p className="text-sm text-muted-foreground">{module.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Порядок: {module.sort_order} | {module.is_published ? '✅ Опубликован' : '❌ Скрыт'}
                        </p>
                      </div>
                    </div>
                  ))}
                  {modules.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">Модулей пока нет</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="lessons" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Создать новый урок</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateLesson} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="lesson-module">Выберите модуль</Label>
                    <select
                      id="lesson-module"
                      className="w-full px-3 py-2 border rounded-md"
                      value={newLesson.module_id}
                      onChange={(e) => setNewLesson({ ...newLesson, module_id: parseInt(e.target.value) })}
                      required
                    >
                      <option value={0}>Выберите модуль</option>
                      {modules.map((module) => (
                        <option key={module.id} value={module.id}>
                          {module.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lesson-title">Название урока</Label>
                    <Input
                      id="lesson-title"
                      value={newLesson.title}
                      onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lesson-description">Описание</Label>
                    <Textarea
                      id="lesson-description"
                      value={newLesson.description}
                      onChange={(e) => setNewLesson({ ...newLesson, description: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lesson-video">Ссылка на видео</Label>
                    <Input
                      id="lesson-video"
                      type="url"
                      value={newLesson.video_url}
                      onChange={(e) => setNewLesson({ ...newLesson, video_url: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lesson-duration">Длительность (минуты)</Label>
                    <Input
                      id="lesson-duration"
                      type="number"
                      value={newLesson.duration_minutes}
                      onChange={(e) => setNewLesson({ ...newLesson, duration_minutes: parseInt(e.target.value) })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lesson-order">Порядковый номер</Label>
                    <Input
                      id="lesson-order"
                      type="number"
                      value={newLesson.sort_order}
                      onChange={(e) => setNewLesson({ ...newLesson, sort_order: parseInt(e.target.value) })}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="lesson-published"
                      checked={newLesson.is_published}
                      onCheckedChange={(checked) => setNewLesson({ ...newLesson, is_published: checked })}
                    />
                    <Label htmlFor="lesson-published">Опубликовать урок</Label>
                  </div>

                  <Button type="submit" className="w-full">
                    <Icon name="Plus" size={16} className="mr-2" />
                    Создать урок
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Список уроков</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {lessons.map((lesson) => {
                    const moduleName = modules.find(m => m.id === lesson.module_id)?.title || 'Неизвестный модуль';
                    return (
                      <div key={lesson.id} className="p-4 border rounded-lg">
                        <h3 className="font-semibold">{lesson.title}</h3>
                        <p className="text-sm text-muted-foreground">{lesson.description}</p>
                        <div className="flex gap-4 text-xs text-muted-foreground mt-2">
                          <span>Модуль: {moduleName}</span>
                          <span>Длительность: {lesson.duration_minutes} мин</span>
                          <span>Порядок: {lesson.sort_order}</span>
                          <span>{lesson.is_published ? '✅ Опубликован' : '❌ Скрыт'}</span>
                        </div>
                      </div>
                    );
                  })}
                  {lessons.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">Уроков пока нет</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="files" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Загрузить файл</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-2 border-dashed rounded-lg p-8 text-center">
                    <input
                      type="file"
                      id="file-upload"
                      className="hidden"
                      onChange={handleFileUpload}
                      accept=".pdf,.doc,.docx,.mp4,.mov,.avi"
                      disabled={uploading}
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <Icon name="Upload" size={48} className="mx-auto mb-4 text-muted-foreground" />
                      <p className="text-lg font-medium mb-2">
                        {uploading ? 'Загрузка...' : 'Нажмите для загрузки файла'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        PDF, DOC, DOCX, MP4, MOV, AVI
                      </p>
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Загруженные файлы ({files.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {files.map((file) => (
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
                          onClick={() => handleDeleteFile(file.id)}
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;