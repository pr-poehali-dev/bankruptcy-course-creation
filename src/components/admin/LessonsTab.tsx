import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

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

interface LessonsTabProps {
  modules: Module[];
  lessons: Lesson[];
  newLesson: Lesson;
  editingLesson: Lesson | null;
  onNewLessonChange: (lesson: Lesson) => void;
  onEditingLessonChange: (lesson: Lesson | null) => void;
  onCreateLesson: (e: React.FormEvent) => void;
  onUpdateLesson: (e: React.FormEvent) => void;
}

export default function LessonsTab({
  modules,
  lessons,
  newLesson,
  editingLesson,
  onNewLessonChange,
  onEditingLessonChange,
  onCreateLesson,
  onUpdateLesson,
}: LessonsTabProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Создать новый урок</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onCreateLesson} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="lesson-module">Выберите модуль</Label>
              <select
                id="lesson-module"
                className="w-full px-3 py-2 border rounded-md"
                value={newLesson.module_id}
                onChange={(e) => onNewLessonChange({ ...newLesson, module_id: parseInt(e.target.value) })}
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
                onChange={(e) => onNewLessonChange({ ...newLesson, title: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lesson-description">Описание</Label>
              <Textarea
                id="lesson-description"
                value={newLesson.description}
                onChange={(e) => onNewLessonChange({ ...newLesson, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lesson-video">Ссылка на видео</Label>
              <Input
                id="lesson-video"
                type="url"
                value={newLesson.video_url}
                onChange={(e) => onNewLessonChange({ ...newLesson, video_url: e.target.value })}
                placeholder="https://..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lesson-duration">Длительность (минуты)</Label>
              <Input
                id="lesson-duration"
                type="number"
                value={newLesson.duration_minutes}
                onChange={(e) => onNewLessonChange({ ...newLesson, duration_minutes: parseInt(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lesson-order">Порядковый номер</Label>
              <Input
                id="lesson-order"
                type="number"
                value={newLesson.sort_order}
                onChange={(e) => onNewLessonChange({ ...newLesson, sort_order: parseInt(e.target.value) })}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="lesson-published"
                checked={newLesson.is_published}
                onCheckedChange={(checked) => onNewLessonChange({ ...newLesson, is_published: checked })}
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
            <form onSubmit={onUpdateLesson} className="space-y-4 p-4 border rounded-lg bg-muted/50">
              <div className="space-y-2">
                <Label htmlFor="edit-lesson-module">Модуль</Label>
                <select
                  id="edit-lesson-module"
                  className="w-full px-3 py-2 border rounded-md"
                  value={editingLesson.module_id}
                  onChange={(e) => onEditingLessonChange({ ...editingLesson, module_id: parseInt(e.target.value) })}
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
                  onChange={(e) => onEditingLessonChange({ ...editingLesson, title: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-lesson-description">Описание</Label>
                <Textarea
                  id="edit-lesson-description"
                  value={editingLesson.description}
                  onChange={(e) => onEditingLessonChange({ ...editingLesson, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-lesson-video">Ссылка на видео</Label>
                <Input
                  id="edit-lesson-video"
                  type="url"
                  value={editingLesson.video_url}
                  onChange={(e) => onEditingLessonChange({ ...editingLesson, video_url: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-lesson-duration">Длительность (мин)</Label>
                  <Input
                    id="edit-lesson-duration"
                    type="number"
                    value={editingLesson.duration_minutes}
                    onChange={(e) => onEditingLessonChange({ ...editingLesson, duration_minutes: parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-lesson-order">Порядок</Label>
                  <Input
                    id="edit-lesson-order"
                    type="number"
                    value={editingLesson.sort_order}
                    onChange={(e) => onEditingLessonChange({ ...editingLesson, sort_order: parseInt(e.target.value) })}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-lesson-published"
                  checked={editingLesson.is_published}
                  onCheckedChange={(checked) => onEditingLessonChange({ ...editingLesson, is_published: checked })}
                />
                <Label htmlFor="edit-lesson-published">Опубликовать урок</Label>
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">Сохранить</Button>
                <Button type="button" variant="outline" onClick={() => onEditingLessonChange(null)}>Отмена</Button>
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
                    <Button variant="outline" size="sm" onClick={() => onEditingLessonChange(lesson)}>
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
    </div>
  );
}
