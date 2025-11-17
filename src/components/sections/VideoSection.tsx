import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Icon from "@/components/ui/icon";
import { useEffect, useRef } from "react";

export default function VideoSection() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            videoRef.current?.play();
          } else {
            videoRef.current?.pause();
          }
        });
      },
      { threshold: 0.5 }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-20 px-4 bg-muted/20">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <Badge className="mb-4">Как это работает</Badge>
            <h3 className="text-4xl md:text-5xl font-bold mb-6">Узнайте о курсе подробнее</h3>
            <p className="text-lg text-muted-foreground mb-8">
              Видео о том, как наш курс поможет вам пройти банкротство самостоятельно и сэкономить до 150 000 ₽
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
          
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl">
            <video 
              ref={videoRef}
              className="w-full h-full object-cover"
              controls
              preload="metadata"
              muted
            >
              <source src="https://storage.yandexcloud.net/poehalidev-user-files/copy_46B4D96E-25E4-491B-81D1-4486E8F5D8FD.MOV" type="video/quicktime" />
              Ваш браузер не поддерживает видео.
            </video>
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-black/20 via-transparent to-black/20"></div>
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/20 via-transparent to-black/20"></div>
          </div>
        </div>
      </div>
    </section>
  );
}