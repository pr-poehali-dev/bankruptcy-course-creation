import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const TestEmail = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const sendTestEmail = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://functions.poehali.dev/44b67bea-4c0b-4f2d-833a-f5adc60d9567', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'melni-v@yandex.ru',
          name: 'Владимир',
          password: '123456'
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Письмо отправлено!',
          description: 'Проверьте почту melni-v@yandex.ru',
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Ошибка',
          description: data.error || 'Не удалось отправить письмо',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: 'Произошла ошибка при отправке',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4">Тестовое письмо</h1>
        <p className="text-gray-600 mb-6">
          Нажмите кнопку чтобы отправить тестовое письмо на почту melni-v@yandex.ru с паролем 123456
        </p>
        <Button 
          onClick={sendTestEmail} 
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Отправка...' : 'Отправить письмо'}
        </Button>
      </div>
    </div>
  );
};

export default TestEmail;
