import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Icon from "@/components/ui/icon";

export default function PricingSection() {
  return (
    <section id="price" className="py-20 px-4 bg-gradient-to-b from-primary to-primary/90 text-white">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-accent text-primary">Выберите подходящий вариант</Badge>
          <h3 className="text-4xl md:text-5xl font-bold mb-6">Наши услуги</h3>
          <p className="text-xl opacity-90">
            Самостоятельное прохождение или с поддержкой юристов
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <Card className="border-2 hover:border-accent transition-all hover:shadow-2xl">
            <CardContent className="pt-12 pb-12">
              <div className="text-center mb-8">
                <Badge className="mb-4 bg-primary/10 text-primary">Самостоятельно</Badge>
                <div className="text-5xl font-bold mb-2 text-primary">2 999 ₽</div>
                <p className="text-muted-foreground">Доступ навсегда</p>
              </div>

              <Separator className="mb-8" />

              <div className="space-y-3 mb-8">
                <div className="flex gap-3">
                  <Icon name="Check" className="text-accent flex-shrink-0 mt-1" size={20} />
                  <span className="text-sm">7 подробных видеомодулей</span>
                </div>
                <div className="flex gap-3">
                  <Icon name="Check" className="text-accent flex-shrink-0 mt-1" size={20} />
                  <span className="text-sm">Все шаблоны документов</span>
                </div>
                <div className="flex gap-3">
                  <Icon name="Check" className="text-accent flex-shrink-0 mt-1" size={20} />
                  <span className="text-sm">Пошаговые инструкции</span>
                </div>
                <div className="flex gap-3">
                  <Icon name="Check" className="text-accent flex-shrink-0 mt-1" size={20} />
                  <span className="text-sm">Авторские лайфхаки по банкротству</span>
                </div>
                <div className="flex gap-3">
                  <Icon name="Check" className="text-accent flex-shrink-0 mt-1" size={20} />
                  <span className="text-sm">Доступ без ограничений по времени</span>
                </div>
                <div className="flex gap-3">
                  <Icon name="Check" className="text-accent flex-shrink-0 mt-1" size={20} />
                  <span className="text-sm">Обновления материалов бесплатно</span>
                </div>
              </div>

              <Button 
                size="lg" 
                className="w-full bg-accent hover:bg-accent/90 text-primary font-bold py-6"
                onClick={() => window.location.href = '/payment'}
              >
                Купить курс
              </Button>

              <p className="text-sm text-muted-foreground text-center mt-4">
                Для простых случаев банкротства
              </p>
            </CardContent>
          </Card>

          <Card className="border-4 border-accent hover:shadow-2xl transition-all relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <Badge className="bg-accent text-primary font-bold px-6 py-1">Популярный выбор</Badge>
            </div>
            <CardContent className="pt-12 pb-12">
              <div className="text-center mb-8">
                <Badge className="mb-4 bg-accent/20 text-accent border-accent">С юристом</Badge>
                <div className="text-5xl font-bold mb-2 text-primary">999 ₽</div>
                <p className="text-muted-foreground">Доступ на 1 неделю</p>
              </div>

              <Separator className="mb-8" />

              <div className="space-y-3 mb-8">
                <div className="flex gap-3">
                  <Icon name="Check" className="text-accent flex-shrink-0 mt-1" size={20} />
                  <span className="text-sm">Ваш личный юрист</span>
                </div>
                <div className="flex gap-3">
                  <Icon name="Check" className="text-accent flex-shrink-0 mt-1" size={20} />
                  <span className="text-sm">Чат с квалифицированными юристами</span>
                </div>
                <div className="flex gap-3">
                  <Icon name="Check" className="text-accent flex-shrink-0 mt-1" size={20} />
                  <span className="text-sm">Неограниченное количество вопросов</span>
                </div>
                <div className="flex gap-3">
                  <Icon name="Check" className="text-accent flex-shrink-0 mt-1" size={20} />
                  <span className="text-sm">Ответы в течение дня</span>
                </div>
                <div className="flex gap-3">
                  <Icon name="Check" className="text-accent flex-shrink-0 mt-1" size={20} />
                  <span className="text-sm">Сопровождение на каждом этапе</span>
                </div>
                <div className="flex gap-3">
                  <Icon name="Check" className="text-accent flex-shrink-0 mt-1" size={20} />
                  <span className="text-sm">Можно продлить в любой момент</span>
                </div>
              </div>

              <Button 
                size="lg" 
                className="w-full bg-accent hover:bg-accent/90 text-primary font-bold py-6"
                onClick={() => window.location.href = '/payment?type=chat'}
              >
                Купить доступ к чату
              </Button>

              <p className="text-sm text-muted-foreground text-center mt-4">
                Для сложных случаев с юридической поддержкой
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center max-w-3xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
            <Icon name="Info" className="mx-auto mb-4 text-accent" size={32} />
            <p className="text-lg opacity-90 mb-2">
              💡 Доступ к чату с юристами можно приобретать многократно
            </p>
            <p className="text-sm opacity-75">
              Если вопросы возникнут через месяц или на другом этапе — просто купите новый недельный доступ за 999 ₽
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
