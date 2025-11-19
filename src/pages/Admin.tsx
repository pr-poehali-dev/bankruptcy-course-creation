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
  isWelcomeVideo?: boolean;
}

const Admin = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [modules, setModules] = useState<Module[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [files, setFiles] = useState<CourseFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<number | undefined>();
  const [selectedModule, setSelectedModule] = useState<number | undefined>();
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [welcomeVideoUrl, setWelcomeVideoUrl] = useState('');
  const [welcomeVideoTitle, setWelcomeVideoTitle] = useState('');
  const [welcomeVideoDescription, setWelcomeVideoDescription] = useState('');
  const [moduleFileUrl, setModuleFileUrl] = useState('');
  const [moduleFileTitle, setModuleFileTitle] = useState('');
  const [moduleFileDescription, setModuleFileDescription] = useState('');
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

  const handleUpdateModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingModule) return;
    try {
      const data = await admin.updateModule(token!, editingModule);
      if (data.error) {
        toast({ title: 'Ошибка', description: data.error, variant: 'destructive' });
      } else {
        toast({ title: 'Успех', description: 'Модуль обновлён' });
        setEditingModule(null);
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

  const handleUpdateLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLesson) return;
    try {
      const data = await admin.updateLesson(token!, editingLesson);
      if (data.error) {
        toast({ title: 'Ошибка', description: data.error, variant: 'destructive' });
      } else {
        toast({ title: 'Успех', description: 'Урок обновлён' });
        setEditingLesson(null);
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isWelcomeVideo = false) => {
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
          lessonId: selectedLesson,
          moduleId: selectedModule,
          isWelcomeVideo,
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

  const handleSaveWelcomeVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!welcomeVideoUrl.trim()) {
      toast({ title: 'Ошибка', description: 'Введите ссылку на видео', variant: 'destructive' });
      return;
    }

    setUploading(true);
    try {
      const data = await uploadFile(token!, {
        title: welcomeVideoTitle || 'Видео-приветствие',
        description: welcomeVideoDescription,
        fileType: 'video/mp4',
        externalUrl: welcomeVideoUrl,
        isWelcomeVideo: true,
      });

      if (data.error) {
        toast({ title: 'Ошибка', description: data.error, variant: 'destructive' });
      } else {
        toast({ title: 'Успех', description: 'Видео-приветствие сохранено' });
        setWelcomeVideoUrl('');
        setWelcomeVideoTitle('');
        setWelcomeVideoDescription('');
        loadFiles();
      }
    } catch (err: any) {
      toast({ title: 'Ошибка', description: err.message, variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const handleSaveModuleFile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!moduleFileUrl.trim()) {
      toast({ title: 'Ошибка', description: 'Введите ссылку на файл', variant: 'destructive' });
      return;
    }

    setUploading(true);
    try {
      const data = await uploadFile(token!, {
        title: moduleFileTitle || 'Файл модуля',
        description: moduleFileDescription,
        fileType: 'application/pdf',
        externalUrl: moduleFileUrl,
        moduleId: selectedModule,
        lessonId: selectedLesson,
      });

      if (data.error) {
        toast({ title: 'Ошибка', description: data.error, variant: 'destructive' });
      } else {
        toast({ title: 'Успех', description: 'Файл сохранен' });
        setModuleFileUrl('');
        setModuleFileTitle('');
        setModuleFileDescription('');
        loadFiles();
      }
    } catch (err: any) {
      toast({ title: 'Ошибка', description: err.message, variant: 'destructive' });
    } finally {
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

  const [sendingTestEmail, setSendingTestEmail] = useState(false);
  const sendTestEmail = async () => {
    setSendingTestEmail(true);
    try {
      const response = await fetch('https://functions.poehali.dev/44b67bea-4c0b-4f2d-833a-f5adc60d9567', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'melni-v@yandex.ru',
          name: 'Владимир',
          password: '12341234'
        })
      });
      const data = await response.json();
      if (response.ok) {
        toast({ title: 'Письмо отправлено!', description: 'Проверьте почту melni-v@yandex.ru' });
      } else {
        toast({ title: 'Ошибка', description: data.error || 'Не удалось отправить', variant: 'destructive' });
      }
    } catch (err: any) {
      toast({ title: 'Ошибка', description: err.message, variant: 'destructive' });
    } finally {
      setSendingTestEmail(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10">
      <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Админ-панель</h1>
          <div className="flex items-center gap-4">
            <Button 
              variant="secondary" 
              onClick={sendTestEmail}
              disabled={sendingTestEmail}
            >
              <Icon name="Mail" size={16} className="mr-2" />
              {sendingTestEmail ? 'Отправка...' : 'Тест письма'}
            </Button>
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
                {editingModule ? (
                  <form onSubmit={handleUpdateModule} className="space-y-4 p-4 border rounded-lg bg-muted/50">
                    <div className="space-y-2">
                      <Label htmlFor="edit-module-title">Название модуля</Label>
                      <Input
                        id="edit-module-title"
                        value={editingModule.title}
                        onChange={(e) => setEditingModule({ ...editingModule, title: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-module-description">Описание</Label>
                      <Textarea
                        id="edit-module-description"
                        value={editingModule.description}
                        onChange={(e) => setEditingModule({ ...editingModule, description: e.target.value })}
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-module-order">Порядковый номер</Label>
                      <Input
                        id="edit-module-order"
                        type="number"
                        value={editingModule.sort_order}
                        onChange={(e) => setEditingModule({ ...editingModule, sort_order: parseInt(e.target.value) })}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="edit-module-published"
                        checked={editingModule.is_published}
                        onCheckedChange={(checked) => setEditingModule({ ...editingModule, is_published: checked })}
                      />
                      <Label htmlFor="edit-module-published">Опубликовать модуль</Label>
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" className="flex-1">Сохранить</Button>
                      <Button type="button" variant="outline" onClick={() => setEditingModule(null)}>Отмена</Button>
                    </div>
                  </form>
                ) : (
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
                        <Button variant="outline" size="sm" onClick={() => setEditingModule(module)}>
                          <Icon name="Edit" size={16} />
                        </Button>
                      </div>
                    ))}
                    {modules.length === 0 && (
                      <p className="text-center text-muted-foreground py-8">Модулей пока нет</p>
                    )}
                  </div>
                )}
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
                {editingLesson ? (
                  <form onSubmit={handleUpdateLesson} className="space-y-4 p-4 border rounded-lg bg-muted/50">
                    <div className="space-y-2">
                      <Label htmlFor="edit-lesson-module">Модуль</Label>
                      <select
                        id="edit-lesson-module"
                        className="w-full px-3 py-2 border rounded-md"
                        value={editingLesson.module_id}
                        onChange={(e) => setEditingLesson({ ...editingLesson, module_id: parseInt(e.target.value) })}
                        required
                      >
                        {modules.map((module) => (
                          <option key={module.id} value={module.id}>
                            {module.title}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-lesson-title">Название урока</Label>
                      <Input
                        id="edit-lesson-title"
                        value={editingLesson.title}
                        onChange={(e) => setEditingLesson({ ...editingLesson, title: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-lesson-description">Описание</Label>
                      <Textarea
                        id="edit-lesson-description"
                        value={editingLesson.description}
                        onChange={(e) => setEditingLesson({ ...editingLesson, description: e.target.value })}
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-lesson-video">Ссылка на видео</Label>
                      <Input
                        id="edit-lesson-video"
                        type="url"
                        value={editingLesson.video_url}
                        onChange={(e) => setEditingLesson({ ...editingLesson, video_url: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-lesson-duration">Длительность (мин)</Label>
                        <Input
                          id="edit-lesson-duration"
                          type="number"
                          value={editingLesson.duration_minutes}
                          onChange={(e) => setEditingLesson({ ...editingLesson, duration_minutes: parseInt(e.target.value) })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-lesson-order">Порядок</Label>
                        <Input
                          id="edit-lesson-order"
                          type="number"
                          value={editingLesson.sort_order}
                          onChange={(e) => setEditingLesson({ ...editingLesson, sort_order: parseInt(e.target.value) })}
                        />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="edit-lesson-published"
                        checked={editingLesson.is_published}
                        onCheckedChange={(checked) => setEditingLesson({ ...editingLesson, is_published: checked })}
                      />
                      <Label htmlFor="edit-lesson-published">Опубликовать урок</Label>
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" className="flex-1">Сохранить</Button>
                      <Button type="button" variant="outline" onClick={() => setEditingLesson(null)}>Отмена</Button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-2">
                    {lessons.map((lesson) => {
                      const moduleName = modules.find(m => m.id === lesson.module_id)?.title || 'Неизвестный модуль';
                      return (
                        <div key={lesson.id} className="p-4 border rounded-lg flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{lesson.title}</h3>
                            <p className="text-sm text-muted-foreground">{lesson.description}</p>
                            <div className="flex gap-4 text-xs text-muted-foreground mt-2">
                              <span>Модуль: {moduleName}</span>
                              <span>Длительность: {lesson.duration_minutes} мин</span>
                              <span>Порядок: {lesson.sort_order}</span>
                              <span>{lesson.is_published ? '✅ Опубликован' : '❌ Скрыт'}</span>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" onClick={() => setEditingLesson(lesson)}>
                            <Icon name="Edit" size={16} />
                          </Button>
                        </div>
                      );
                    })}
                    {lessons.length === 0 && (
                      <p className="text-center text-muted-foreground py-8">Уроков пока нет</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="files" className="space-y-6">
            <Card className="border-accent bg-accent/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Video" size={24} />
                  Видео-приветствие
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSaveWelcomeVideo} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="welcome-video-url">Ссылка на видео</Label>
                    <Input
                      id="welcome-video-url"
                      type="url"
                      placeholder="https://example.com/video.mp4"
                      value={welcomeVideoUrl}
                      onChange={(e) => setWelcomeVideoUrl(e.target.value)}
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
                      onChange={(e) => setWelcomeVideoTitle(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="welcome-video-description">Описание (опционально)</Label>
                    <Textarea
                      id="welcome-video-description"
                      placeholder="Краткое описание видео..."
                      value={welcomeVideoDescription}
                      onChange={(e) => setWelcomeVideoDescription(e.target.value)}
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
                              onClick={() => handleDeleteFile(file.id)}
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
                <form onSubmit={handleSaveModuleFile} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="file-module">Прикрепить к модулю (опционально)</Label>
                      <select
                        id="file-module"
                        className="w-full p-2 border rounded-md"
                        value={selectedModule || ''}
                        onChange={(e) => {
                          setSelectedModule(e.target.value ? parseInt(e.target.value) : undefined);
                          setSelectedLesson(undefined);
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
                          onChange={(e) => setSelectedLesson(e.target.value ? parseInt(e.target.value) : undefined)}
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
                      onChange={(e) => setModuleFileUrl(e.target.value)}
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
                      onChange={(e) => setModuleFileTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="module-file-description">Описание (опционально)</Label>
                    <Textarea
                      id="module-file-description"
                      placeholder="Краткое описание..."
                      value={moduleFileDescription}
                      onChange={(e) => setModuleFileDescription(e.target.value)}
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