import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

interface HeroSectionProps {
  user: any;
  scrollToSection: (id: string) => void;
}

export default function HeroSection({ user, scrollToSection }: HeroSectionProps) {
  const navigate = useNavigate();

  return (
    <section className="pt-32 pb-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <Badge className="mb-4 bg-accent/20 text-accent-foreground border-accent">Эксклюзивный курс</Badge>
            <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Банкротство физического лица
              <span className="block text-accent mt-2">без юристов</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Пошаговая инструкция по самостоятельной подаче на банкротство. Выберите формат самостоятельного банкротства за 2 999 рублей или с личным юристом на каждом этапе +999 рублей.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={() => user ? navigate('/dashboard') : scrollToSection('price')} size="lg" className="bg-accent hover:bg-accent/90 text-primary font-semibold text-lg px-8 py-6">
                {user ? 'Перейти к курсу' : 'Выбрать услугу'}
              </Button>
              <Button onClick={() => scrollToSection("program")} variant="outline" size="lg" className="text-lg px-8 py-6">
                Узнать больше
              </Button>
            </div>
            <div className="flex gap-8 mt-8">
              <div>
                <div className="text-3xl font-bold text-primary">10+</div>
                <div className="text-sm text-muted-foreground">лет опыта</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">500+</div>
                <div className="text-sm text-muted-foreground">успешных дел</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">100%</div>
                <div className="text-sm text-muted-foreground">легально</div>
              </div>
            </div>
          </div>
          <div className="animate-scale-in">
            <img 
              src="https://cdn.poehali.dev/files/bddaed2a-cd53-40bc-8c52-c6467fafdab8.png"
              alt="Голосова Валентина - арбитражный управляющий"
              className="rounded-2xl shadow-2xl w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
