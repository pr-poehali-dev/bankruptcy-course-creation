import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

const RESET_PASSWORD_URL = 'https://functions.poehali.dev/cd285edd-2086-4c61-b70f-7a672e010afc';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(RESET_PASSWORD_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'request',
          email: email.trim().toLowerCase(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        toast({
          title: 'Письмо отправлено!',
          description: 'Проверьте вашу почту для восстановления пароля',
        });
      } else {
        toast({
          title: 'Ошибка',
          description: data.error || 'Не удалось отправить письмо',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Ошибка',
        description: error.message || 'Что-то пошло не так',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold flex items-center justify-center gap-2 text-green-600">
              <Icon name="Mail" size={32} />
              Письмо отправлено!
            </CardTitle>
            <CardDescription className="text-base mt-4">
              Мы отправили инструкции по восстановлению пароля на адрес <strong>{email}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-900">
              <p className="text-sm text-muted-foreground">
                <Icon name="Info" size={16} className="inline mr-2" />
                Не видите письмо? Проверьте папку "Спам"
              </p>
            </div>
            <Link to="/login">
              <Button variant="outline" className="w-full">
                Вернуться ко входу
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Забыли пароль?</CardTitle>
          <CardDescription>
            Введите ваш email, и мы отправим инструкции по восстановлению
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Отправка...' : 'Отправить инструкции'}
            </Button>

            <div className="text-center">
              <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground">
                ← Вернуться ко входу
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;
