import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';

export default function Payment() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    phone: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          amount: 2999,
          description: 'Курс "Банкротство физических лиц - самостоятельно"'
        }),
      });

      const data = await response.json();
      
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        throw new Error('Не удалось получить ссылку на оплату');
      }
    } catch (error) {
      console.error('Ошибка при создании платежа:', error);
      alert('Произошла ошибка. Пожалуйста, попробуйте позже или свяжитесь с нами.');
      setIsProcessing(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <Button 
          variant="ghost" 
          className="mb-6 gap-2"
          onClick={() => navigate('/')}
        >
          <Icon name="ArrowLeft" size={20} />
          Назад на главную
        </Button>

        <div className="text-center mb-8">
          <Badge className="mb-4">Оформление заказа</Badge>
          <h1 className="text-4xl font-bold mb-4">Оплата курса</h1>
          <p className="text-xl text-muted-foreground">
            Заполните форму для безопасной оплаты через Robokassa
          </p>
        </div>

        <Card className="border-2">
          <CardContent className="pt-6">
            <div className="bg-muted/30 rounded-lg p-6 mb-8">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold mb-2">
                    Курс "Банкротство физических лиц - самостоятельно"
                  </h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex gap-2">
                      <Icon name="Check" className="text-accent flex-shrink-0 mt-0.5" size={16} />
                      <span>7 видеомодулей</span>
                    </div>
                    <div className="flex gap-2">
                      <Icon name="Check" className="text-accent flex-shrink-0 mt-0.5" size={16} />
                      <span>Все шаблоны документов</span>
                    </div>
                    <div className="flex gap-2">
                      <Icon name="Check" className="text-accent flex-shrink-0 mt-0.5" size={16} />
                      <span>Доступ навсегда</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary">2 999 ₽</div>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email для доступа к курсу *
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="example@mail.ru"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  На этот email придет доступ к курсу
                </p>
              </div>

              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Ваше имя *
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Иван Иванов"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-2">
                  Телефон
                </label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+7 (___) ___-__-__"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Необязательно, но поможет связаться при проблемах
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
                <div className="flex gap-3">
                  <Icon name="Shield" className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
                  <div>
                    <p className="font-medium text-blue-900 mb-1">Безопасная оплата</p>
                    <p className="text-blue-700">
                      Оплата происходит через защищенную платежную систему Robokassa. 
                      Мы не храним данные вашей карты.
                    </p>
                  </div>
                </div>
              </div>

              <Button 
                type="submit" 
                size="lg" 
                className="w-full bg-accent hover:bg-accent/90 text-primary font-bold text-lg py-6"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Icon name="Loader2" className="animate-spin mr-2" size={20} />
                    Подготовка к оплате...
                  </>
                ) : (
                  <>
                    <Icon name="CreditCard" className="mr-2" size={20} />
                    Перейти к оплате 2 999 ₽
                  </>
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                Нажимая кнопку, вы соглашаетесь с{' '}
                <a href="/oferta" className="underline hover:text-primary">договором оферты</a>
                {' '}и{' '}
                <a href="/privacy" className="underline hover:text-primary">политикой конфиденциальности</a>
              </p>
            </form>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground mb-4">Принимаем к оплате:</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Badge variant="outline" className="gap-2">
              <Icon name="CreditCard" size={16} />
              Банковские карты
            </Badge>
            <Badge variant="outline" className="gap-2">
              <Icon name="Smartphone" size={16} />
              СБП
            </Badge>
            <Badge variant="outline" className="gap-2">
              <Icon name="Wallet" size={16} />
              Электронные кошельки
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
