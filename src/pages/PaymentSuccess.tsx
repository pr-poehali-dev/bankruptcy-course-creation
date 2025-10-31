import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { payment } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [verifying, setVerifying] = useState(true);
  const [verified, setVerified] = useState(false);

  const paymentId = searchParams.get('payment_id');

  useEffect(() => {
    if (paymentId) {
      verifyPayment(paymentId);
    } else {
      setVerifying(false);
    }
  }, [paymentId]);

  const verifyPayment = async (id: string) => {
    try {
      const result = await payment.checkStatus(id);
      setVerified(result.paid === true);
    } catch (error) {
      console.error('Error verifying payment:', error);
    } finally {
      setVerifying(false);
    }
  };

  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
            <h3 className="text-xl font-bold mb-2">Проверка оплаты</h3>
            <p className="text-muted-foreground">Подождите несколько секунд...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          {verified ? (
            <>
              <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <Icon name="CheckCircle" className="text-green-600" size={32} />
              </div>
              <CardTitle className="text-2xl">Оплата успешна!</CardTitle>
            </>
          ) : (
            <>
              <div className="mx-auto mb-4 w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
                <Icon name="Clock" className="text-yellow-600" size={32} />
              </div>
              <CardTitle className="text-2xl">Ожидание подтверждения</CardTitle>
            </>
          )}
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          {verified ? (
            <>
              <p className="text-muted-foreground">
                Поздравляем! Ваша оплата успешно обработана. Доступ к курсу "Банкротство физических лиц" открыт.
              </p>
              <div className="bg-accent/10 p-4 rounded-lg">
                <p className="text-sm font-medium mb-2">Что дальше?</p>
                <ul className="text-sm text-left space-y-1 text-muted-foreground">
                  <li className="flex gap-2">
                    <Icon name="Check" size={16} className="text-accent flex-shrink-0 mt-0.5" />
                    <span>Перейдите в личный кабинет</span>
                  </li>
                  <li className="flex gap-2">
                    <Icon name="Check" size={16} className="text-accent flex-shrink-0 mt-0.5" />
                    <span>Начните обучение с первого модуля</span>
                  </li>
                  <li className="flex gap-2">
                    <Icon name="Check" size={16} className="text-accent flex-shrink-0 mt-0.5" />
                    <span>Скачайте все материалы курса</span>
                  </li>
                </ul>
              </div>
              <Button
                onClick={() => navigate('/dashboard')}
                className="w-full bg-accent hover:bg-accent/90 text-primary"
                size="lg"
              >
                <Icon name="BookOpen" size={20} className="mr-2" />
                Перейти к обучению
              </Button>
            </>
          ) : (
            <>
              <p className="text-muted-foreground">
                Ваш платеж обрабатывается. Это может занять несколько минут. 
                Обновите страницу через минуту или проверьте доступ в личном кабинете.
              </p>
              <div className="flex gap-2">
                <Button
                  onClick={() => window.location.reload()}
                  variant="outline"
                  className="flex-1"
                >
                  <Icon name="RefreshCw" size={16} className="mr-2" />
                  Обновить
                </Button>
                <Button
                  onClick={() => navigate('/dashboard')}
                  className="flex-1"
                >
                  <Icon name="Home" size={16} className="mr-2" />
                  В кабинет
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;
