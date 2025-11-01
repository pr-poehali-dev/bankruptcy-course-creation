import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ProgramSection() {
  const modules = [
    { 
      title: "Модуль 1: Основы банкротства",
      description: "Когда нужно банкротство, правовые основы, последствия"
    },
    {
      title: "Модуль 2: Подготовка документов",
      description: "Полный список документов, как их собрать и оформить"
    },
    {
      title: "Модуль 3: Подача заявления в суд",
      description: "Пошаговая инструкция по подаче, оплата госпошлины"
    },
    {
      title: "Модуль 4: Судебные заседания",
      description: "Как вести себя в суде, что говорить, типичные вопросы"
    },
    {
      title: "Модуль 5: Работа с финансовым управляющим",
      description: "Ваши права и обязанности, взаимодействие с управляющим"
    },
    {
      title: "Модуль 6: Реализация имущества",
      description: "Что могут забрать, как защитить свое имущество"
    },
    {
      title: "Модуль 7: Завершение процедуры",
      description: "Получение решения суда, снятие ограничений, новая жизнь"
    }
  ];

  return (
    <section id="program" className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-16">
          <Badge className="mb-4">Программа</Badge>
          <h3 className="text-4xl md:text-5xl font-bold mb-6">Содержание курса</h3>
          <p className="text-xl text-muted-foreground">
            7 модулей для полного понимания процедуры
          </p>
        </div>

        <div className="space-y-4">
          {modules.map((module, index) => (
            <Card key={index} className="border-2 hover:border-accent transition-all">
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-bold text-lg">{index + 1}</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">{module.title}</h4>
                    <p className="text-muted-foreground">{module.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
