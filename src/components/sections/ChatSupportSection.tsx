import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { useNavigate } from "react-router-dom";

interface ChatSupportSectionProps {
  user: any;
}

export default function ChatSupportSection({ user }: ChatSupportSectionProps) {
  const navigate = useNavigate();

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-accent/10 to-primary/5">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-accent/20 text-accent-foreground">Дополнительная поддержка</Badge>
          <h3 className="text-4xl md:text-5xl font-bold mb-6">Чат с юристами</h3>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Если ваш случай сложнее и нужна профессиональная консультация — получите личного юриста
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="border-2 border-accent/30">
            <CardContent className="pt-8">
              <Icon name="MessageSquare" className="text-accent mb-4" size={48} />
              <h4 className="text-2xl font-bold mb-4">Групповой чат</h4>
              <p className="text-muted-foreground mb-6">
                Общение с опытными юристами и другими участниками курса. Получайте ответы на вопросы и делитесь опытом.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-3">
                  <Icon name="Check" className="text-accent mt-1 flex-shrink-0" size={20} />
                  <span className="text-muted-foreground">Доступ на 1 месяц</span>
                </li>
                <li className="flex items-start gap-3">
                  <Icon name="Check" className="text-accent mt-1 flex-shrink-0" size={20} />
                  <span className="text-muted-foreground">Ответы юристов в течение 24 часов</span>
                </li>
                <li className="flex items-start gap-3">
                  <Icon name="Check" className="text-accent mt-1 flex-shrink-0" size={20} />
                  <span className="text-muted-foreground">Общение с другими участниками</span>
                </li>
              </ul>
              <div className="text-3xl font-bold text-primary mb-2">999 ₽</div>
              <p className="text-sm text-muted-foreground mb-4">за месяц доступа</p>
              {user ? (
                <Button onClick={() => navigate('/chat-access')} className="w-full bg-accent hover:bg-accent/90 text-primary">
                  Купить доступ
                </Button>
              ) : (
                <Button onClick={() => navigate('/login')} className="w-full bg-accent hover:bg-accent/90 text-primary">
                  Войти и купить
                </Button>
              )}
            </CardContent>
          </Card>

          <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-white">
            <CardContent className="pt-8">
              <Icon name="UserCheck" className="text-primary mb-4" size={48} />
              <h4 className="text-2xl font-bold mb-4">Индивидуальное сопровождение</h4>
              <p className="text-muted-foreground mb-6">
                Полное сопровождение процедуры банкротства личным юристом от начала до конца.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-3">
                  <Icon name="Check" className="text-primary mt-1 flex-shrink-0" size={20} />
                  <span className="text-muted-foreground">Проверка всех документов</span>
                </li>
                <li className="flex items-start gap-3">
                  <Icon name="Check" className="text-primary mt-1 flex-shrink-0" size={20} />
                  <span className="text-muted-foreground">Помощь в подготовке заявлений</span>
                </li>
                <li className="flex items-start gap-3">
                  <Icon name="Check" className="text-primary mt-1 flex-shrink-0" size={20} />
                  <span className="text-muted-foreground">Консультации на всех этапах</span>
                </li>
                <li className="flex items-start gap-3">
                  <Icon name="Check" className="text-primary mt-1 flex-shrink-0" size={20} />
                  <span className="text-muted-foreground">Поддержка до закрытия дела</span>
                </li>
              </ul>
              <div className="text-sm text-muted-foreground mb-4">
                Стоимость обсуждается индивидуально
              </div>
              <Button 
                variant="outline" 
                className="w-full border-primary text-primary hover:bg-primary hover:text-white"
                onClick={() => window.open('https://t.me/crashbusiness', '_blank')}
              >
                Связаться с нами
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}