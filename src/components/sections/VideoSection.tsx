import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Icon from "@/components/ui/icon";

export default function VideoSection() {
  return (
    <section className="py-20 px-4 bg-muted/20">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <Badge className="mb-4">Как это работает</Badge>
            <h3 className="text-4xl md:text-5xl font-bold mb-6">Узнайте о курсе за 60 секунд</h3>
            <p className="text-lg text-muted-foreground mb-8">
              Короткое видео о том, как наш курс поможет вам пройти банкротство самостоятельно и сэкономить до 150 000 ₽
            </p>
            
            <div className="space-y-4">
              <Card className="border-l-4 border-l-accent">
                <CardContent className="p-4 flex items-start gap-3">
                  <Icon name="Play" className="text-accent mt-1" size={20} />
                  <div>
                    <p className="font-semibold">7 видеомодулей</p>
                    <p className="text-sm text-muted-foreground">Пошаговые инструкции на каждый этап</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-l-4 border-l-accent">
                <CardContent className="p-4 flex items-start gap-3">
                  <Icon name="FileText" className="text-accent mt-1" size={20} />
                  <div>
                    <p className="font-semibold">Готовые шаблоны</p>
                    <p className="text-sm text-muted-foreground">Все документы для суда и кредиторов</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-l-4 border-l-accent">
                <CardContent className="p-4 flex items-start gap-3">
                  <Icon name="Users" className="text-accent mt-1" size={20} />
                  <div>
                    <p className="font-semibold">Поддержка юристов</p>
                    <p className="text-sm text-muted-foreground">Опционально: чат с профессионалами</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-primary/20 to-accent/20">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <Icon name="PlayCircle" size={80} className="mx-auto mb-4 text-accent" />
                <p className="text-lg font-semibold">Видео будет добавлено</p>
                <p className="text-sm opacity-75">Промо-ролик о курсе</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}