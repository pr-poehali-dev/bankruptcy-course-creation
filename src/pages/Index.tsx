import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Icon from "@/components/ui/icon";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export default function Index() {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-muted/30">
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">Голосова Валентина</h1>
          <div className="hidden md:flex gap-6">
            <button onClick={() => scrollToSection("about")} className="hover:text-accent transition">О курсе</button>
            <button onClick={() => scrollToSection("program")} className="hover:text-accent transition">Программа</button>
            <button onClick={() => scrollToSection("author")} className="hover:text-accent transition">Об авторе</button>
            <button onClick={() => scrollToSection("reviews")} className="hover:text-accent transition">Отзывы</button>
            <button onClick={() => scrollToSection("price")} className="hover:text-accent transition">Стоимость</button>
          </div>
          <Button onClick={() => scrollToSection("price")} className="bg-accent hover:bg-accent/90 text-primary font-semibold">
            Купить курс
          </Button>
        </nav>
      </header>

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
                Пошаговая инструкция по самостоятельной подаче на банкротство. Все документы, шаблоны и видеоуроки от арбитражного управляющего с опытом 10+ лет.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={() => scrollToSection("price")} size="lg" className="bg-accent hover:bg-accent/90 text-primary font-semibold text-lg px-8 py-6">
                  Получить курс за 2 999 ₽
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
                src="https://cdn.poehali.dev/files/e186dd27-a565-441d-84b4-5de4ae30e95f.jpg"
                alt="Голосова Валентина - арбитражный управляющий"
                className="rounded-2xl shadow-2xl w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-muted/20">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <Badge className="mb-4">Промо видео</Badge>
            <h3 className="text-4xl md:text-5xl font-bold mb-6">Узнайте больше о курсе</h3>
          </div>
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black">
            <iframe
              className="w-full h-full"
              src=""
              title="Промо видео курса"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <p className="text-center text-muted-foreground mt-6">
            Посмотрите короткое видео о том, как курс поможет вам пройти процедуру банкротства
          </p>
        </div>
      </section>

      <section id="about" className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <Badge className="mb-4">О курсе</Badge>
            <h3 className="text-4xl md:text-5xl font-bold mb-6">Что вы получите</h3>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Полный комплект знаний и документов для самостоятельного банкротства
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-accent transition-all hover:shadow-lg">
              <CardContent className="pt-8">
                <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mb-6">
                  <Icon name="Video" className="text-accent" size={32} />
                </div>
                <h4 className="text-2xl font-bold mb-4">Видеоуроки</h4>
                <p className="text-muted-foreground">
                  Пошаговые видеоинструкции по каждому этапу процедуры банкротства
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-accent transition-all hover:shadow-lg">
              <CardContent className="pt-8">
                <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mb-6">
                  <Icon name="FileText" className="text-accent" size={32} />
                </div>
                <h4 className="text-2xl font-bold mb-4">Шаблоны документов</h4>
                <p className="text-muted-foreground">
                  Готовые шаблоны всех необходимых заявлений и документов для суда
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-accent transition-all hover:shadow-lg">
              <CardContent className="pt-8">
                <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mb-6">
                  <Icon name="BookOpen" className="text-accent" size={32} />
                </div>
                <h4 className="text-2xl font-bold mb-4">Инструкции</h4>
                <p className="text-muted-foreground">
                  Детальные письменные инструкции с примерами и объяснениями
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

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
            {[
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
            ].map((module, index) => (
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

      <section id="author" className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <img 
              src="https://cdn.poehali.dev/files/e77a1df8-8af8-4d21-b8bc-ed9cd6482e64.JPEG"
              alt="Голосова Валентина"
              className="rounded-2xl shadow-xl"
            />
            <div>
              <Badge className="mb-4">Об авторе</Badge>
              <h3 className="text-4xl font-bold mb-6">Голосова Валентина</h3>
              <p className="text-xl mb-6">Арбитражный управляющий с опытом более 10 лет</p>
              
              <div className="space-y-4 mb-8">
                <div className="flex gap-3">
                  <Icon name="CheckCircle2" className="text-accent flex-shrink-0 mt-1" size={24} />
                  <p className="text-muted-foreground">Более 500 успешно завершенных процедур по банкротству</p>
                </div>
                <div className="flex gap-3">
                  <Icon name="CheckCircle2" className="text-accent flex-shrink-0 mt-1" size={24} />
                  <p className="text-muted-foreground">Член Ассоциации арбитражных управляющих</p>
                </div>
                <div className="flex gap-3">
                  <Icon name="CheckCircle2" className="text-accent flex-shrink-0 mt-1" size={24} />
                  <p className="text-muted-foreground">Высшее юридическое образование</p>
                </div>
                <div className="flex gap-3">
                  <Icon name="CheckCircle2" className="text-accent flex-shrink-0 mt-1" size={24} />
                  <p className="text-muted-foreground">Член НПС СОПАУ "Альянс Управляющих"</p>
                </div>
                <div className="flex gap-3">
                  <Icon name="CheckCircle2" className="text-accent flex-shrink-0 mt-1" size={24} />
                  <p className="text-muted-foreground">Автор публикаций по вопросам банкротства</p>
                </div>
              </div>

              <p className="text-lg text-muted-foreground italic border-l-4 border-accent pl-6">
                "Я создала этот курс, потому что вижу, как многие люди оказываются в безвыходной ситуации из-за долгов, но не имеют финансовой возможности обратиться к профессионалам.
                <br /><br />
                Моя цель - сделать процедуру банкротства доступной для каждого, кто в ней действительно нуждается."
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="reviews" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <Badge className="mb-4">Отзывы</Badge>
            <h3 className="text-4xl md:text-5xl font-bold mb-6">Что говорят клиенты, которые приобрели курс</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Анна М.",
                text: "Благодаря курсу смогла самостоятельно подать на банкротство. Все понятно объяснено, шаблоны очень помогли!",
                rating: 5
              },
              {
                name: "Дмитрий К.",
                text: "Сэкономил более 100 000 рублей на услугах юристов. Курс окупился в 30 раз! Валентина - настоящий профессионал.",
                rating: 5
              },
              {
                name: "Елена С.",
                text: "Очень подробные видео, все разложено по полочкам. Боялась идти в суд, но после курса все страхи ушли.",
                rating: 5
              }
            ].map((review, index) => (
              <Card key={index} className="border-2">
                <CardContent className="pt-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <Icon key={i} name="Star" className="text-accent fill-accent" size={20} />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">"{review.text}"</p>
                  <p className="font-semibold">{review.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="price" className="py-20 px-4 bg-gradient-to-b from-primary to-primary/90 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <Badge className="mb-4 bg-accent text-primary">Специальное предложение</Badge>
          <h3 className="text-4xl md:text-5xl font-bold mb-6">Инвестиция в ваше будущее</h3>
          <p className="text-xl mb-12 opacity-90">
            Стоимость услуг юриста по банкротству - от 50 000 до 150 000 рублей
          </p>

          <Card className="max-w-lg mx-auto border-4 border-accent">
            <CardContent className="pt-12 pb-12">
              <div className="mb-8">
                <div className="text-5xl font-bold mb-2">2 999 ₽</div>
                <p className="text-muted-foreground">Полный доступ навсегда</p>
              </div>

              <Separator className="mb-8" />

              <div className="space-y-3 text-left mb-8">
                <div className="flex gap-3">
                  <Icon name="Check" className="text-accent flex-shrink-0 mt-1" size={24} />
                  <span>7 подробных видеомодулей</span>
                </div>
                <div className="flex gap-3">
                  <Icon name="Check" className="text-accent flex-shrink-0 mt-1" size={24} />
                  <span>Все шаблоны документов</span>
                </div>
                <div className="flex gap-3">
                  <Icon name="Check" className="text-accent flex-shrink-0 mt-1" size={24} />
                  <span>Пошаговые инструкции</span>
                </div>
                <div className="flex gap-3">
                  <Icon name="Check" className="text-accent flex-shrink-0 mt-1" size={24} />
                  <span>Доступ без ограничений по времени</span>
                </div>
                <div className="flex gap-3">
                  <Icon name="Check" className="text-accent flex-shrink-0 mt-1" size={24} />
                  <span>Обновления материалов бесплатно</span>
                </div>
                <div className="flex gap-3">
                  <Icon name="Check" className="text-accent flex-shrink-0 mt-1" size={24} />
                  <span>Чат с автором курса и другими участниками</span>
                </div>
              </div>

              <Button 
                size="lg" 
                className="w-full bg-accent hover:bg-accent/90 text-primary font-bold text-lg py-6"
                onClick={() => window.location.href = '/payment'}
              >
                Купить курс за 2 999 ₽
              </Button>

              <p className="text-sm text-muted-foreground mt-6">
                Безопасная оплата • Мгновенный доступ
              </p>
            </CardContent>
          </Card>

          <div className="mt-12 max-w-2xl mx-auto">
            <p className="text-lg opacity-90">
              💡 Экономия более 50 000 рублей на услугах юристов
            </p>
          </div>
        </div>
      </section>

      <section id="contact" className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-4xl text-center">
          <Badge className="mb-4">Контакты</Badge>
          <h3 className="text-4xl font-bold mb-6">Остались вопросы?</h3>
          <p className="text-xl text-muted-foreground mb-8">
            Свяжитесь со мной любым удобным способом
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="outline" size="lg" className="gap-2">
              <Icon name="Mail" size={20} />
              HELP@банкрот.shop
            </Button>
            <Button variant="outline" size="lg" className="gap-2">
              <Icon name="Phone" size={20} />
              +7 966 165 56 08
            </Button>
            <Button variant="outline" size="lg" className="gap-2">
              <Icon name="MessageCircle" size={20} />
              Telegram
            </Button>
          </div>
        </div>
      </section>

      <footer className="bg-primary text-white py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="font-bold text-xl mb-4">Голосова Валентина</h4>
              <p className="opacity-80">Арбитражный управляющий с опытом более 10 лет</p>
            </div>
            <div>
              <h4 className="font-bold text-xl mb-4">Навигация</h4>
              <div className="space-y-2 opacity-80">
                <div className="cursor-pointer hover:text-accent transition" onClick={() => scrollToSection("about")}>О курсе</div>
                <div className="cursor-pointer hover:text-accent transition" onClick={() => scrollToSection("program")}>Программа</div>
                <div className="cursor-pointer hover:text-accent transition" onClick={() => scrollToSection("author")}>Об авторе</div>
                <div className="cursor-pointer hover:text-accent transition" onClick={() => scrollToSection("reviews")}>Отзывы</div>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-xl mb-4">Контакты</h4>
              <div className="space-y-2 opacity-80">
                <div>HELP@банкрот.shop</div>
                <div>+7 966 165 56 08</div>
              </div>
            </div>
          </div>
          <Separator className="mb-8 opacity-20" />
          <div className="text-center space-y-4">
            <div className="opacity-80">
              <h5 className="font-semibold mb-2">Юридическая информация</h5>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <a href="/oferta" className="hover:text-accent transition underline">Договор оферты</a>
                <span className="opacity-40">•</span>
                <a href="/privacy" className="hover:text-accent transition underline">Политика конфиденциальности</a>
                <span className="opacity-40">•</span>
                <a href="/requisites" className="hover:text-accent transition underline">Реквизиты</a>
              </div>
            </div>
            <div className="opacity-60">
              <p>© 2024 Голосова Валентина. Все права защищены.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}