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

interface ModulesTabProps {
  modules: Module[];
  newModule: Module;
  editingModule: Module | null;
  onNewModuleChange: (module: Module) => void;
  onEditingModuleChange: (module: Module | null) => void;
  onCreateModule: (e: React.FormEvent) => void;
  onUpdateModule: (e: React.FormEvent) => void;
}

export default function ModulesTab({
  modules,
  newModule,
  editingModule,
  onNewModuleChange,
  onEditingModuleChange,
  onCreateModule,
  onUpdateModule,
}: ModulesTabProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Создать новый модуль</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onCreateModule} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="module-title">Название модуля</Label>
              <Input
                id="module-title"
                value={newModule.title}
                onChange={(e) => onNewModuleChange({ ...newModule, title: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="module-description">Описание</Label>
              <Textarea
                id="module-description"
                value={newModule.description}
                onChange={(e) => onNewModuleChange({ ...newModule, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="module-order">Порядковый номер</Label>
              <Input
                id="module-order"
                type="number"
                value={newModule.sort_order}
                onChange={(e) => onNewModuleChange({ ...newModule, sort_order: parseInt(e.target.value) })}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="module-published"
                checked={newModule.is_published}
                onCheckedChange={(checked) => onNewModuleChange({ ...newModule, is_published: checked })}
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
            <form onSubmit={onUpdateModule} className="space-y-4 p-4 border rounded-lg bg-muted/50">
              <div className="space-y-2">
                <Label htmlFor="edit-module-title">Название модуля</Label>
                <Input
                  id="edit-module-title"
                  value={editingModule.title}
                  onChange={(e) => onEditingModuleChange({ ...editingModule, title: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-module-description">Описание</Label>
                <Textarea
                  id="edit-module-description"
                  value={editingModule.description}
                  onChange={(e) => onEditingModuleChange({ ...editingModule, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-module-order">Порядковый номер</Label>
                <Input
                  id="edit-module-order"
                  type="number"
                  value={editingModule.sort_order}
                  onChange={(e) => onEditingModuleChange({ ...editingModule, sort_order: parseInt(e.target.value) })}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-module-published"
                  checked={editingModule.is_published}
                  onCheckedChange={(checked) => onEditingModuleChange({ ...editingModule, is_published: checked })}
                />
                <Label htmlFor="edit-module-published">Опубликовать модуль</Label>
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">Сохранить</Button>
                <Button type="button" variant="outline" onClick={() => onEditingModuleChange(null)}>Отмена</Button>
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
                  <Button variant="outline" size="sm" onClick={() => onEditingModuleChange(module)}>
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
    </div>
  );
}
