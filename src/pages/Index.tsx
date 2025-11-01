import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Icon from "@/components/ui/icon";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function Index() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const handleGetCourse = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
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
            <button onClick={() => scrollToSection("faq")} className="hover:text-accent transition">Вопросы</button>
            <button onClick={() => scrollToSection("reviews")} className="hover:text-accent transition">Отзывы</button>
            <button onClick={() => scrollToSection("price")} className="hover:text-accent transition">Стоимость</button>
          </div>
          {user ? (
            <Button onClick={() => navigate('/dashboard')} className="bg-accent hover:bg-accent/90 text-primary font-semibold">
              Мой курс
            </Button>
          ) : (
            <Button onClick={handleGetCourse} className="bg-accent hover:bg-accent/90 text-primary font-semibold">
              Войти
            </Button>
          )}
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
                Пошаговая инструкция по самостоятельной подаче на банкротство. Выберите обучение без поддержки или с личным юристом на каждом этапе.
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

      <section className="py-20 px-4 bg-gradient-to-br from-accent/10 to-primary/5">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-accent/20 text-accent-foreground">Дополнительная поддержка</Badge>
            <h3 className="text-4xl md:text-5xl font-bold mb-6">Чат с юристами</h3>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Если ваш случай сложнее и нужна профессиональная консультация — получите личного юриста
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon name="MessageCircle" className="text-accent" size={24} />
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2">Неограниченные вопросы</h4>
                  <p className="text-muted-foreground">
                    Задавайте сколько угодно вопросов в течение недели доступа
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon name="Clock" className="text-accent" size={24} />
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2">Быстрые ответы</h4>
                  <p className="text-muted-foreground">
                    Квалифицированные юристы отвечают в течение дня
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon name="RefreshCw" className="text-accent" size={24} />
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2">Гибкая покупка</h4>
                  <p className="text-muted-foreground">
                    Покупайте доступ когда нужно — на любом этапе процедуры
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon name="Shield" className="text-accent" size={24} />
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2">Сопровождение эксперта</h4>
                  <p className="text-muted-foreground">
                    Личный юрист проведет вас через все сложные моменты
                  </p>
                </div>
              </div>
            </div>

            <Card className="border-2 border-accent">
              <CardContent className="pt-8">
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold mb-2">999 ₽</div>
                  <p className="text-muted-foreground">За неделю доступа</p>
                </div>
                <p className="text-sm text-muted-foreground mb-6 text-center">
                  Идеально подходит для сложных случаев, когда нужна профессиональная помощь на определенном этапе
                </p>
                <Button 
                  size="lg" 
                  className="w-full bg-accent hover:bg-accent/90 text-primary font-bold"
                  onClick={() => navigate('/payment?type=chat')}
                >
                  Получить доступ к чату
                </Button>
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
              src="https://cdn.poehali.dev/files/c4d81d00-b8ed-4563-a70d-fb71c0287993.png"
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

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: "Анна М.",
                text: "Благодаря курсу смогла самостоятельно подать на банкротство. Все понятно объяснено, шаблоны очень помогли!",
                rating: 5,
                avatar: "https://cdn.poehali.dev/files/6501e5e4-be60-4295-a498-be64002d8f4c.jpg"
              },
              {
                name: "Дмитрий К.",
                text: "Сэкономил более 100 000 рублей на услугах юристов. Курс окупился в 30 раз! Валентина - настоящий профессионал.",
                rating: 5,
                avatar: "https://cdn.poehali.dev/files/1659f6e8-5891-4e52-b265-48b2d9874cec.jpg"
              },
              {
                name: "Елена С.",
                text: "Очень подробные видео, все разложено по полочкам. Боялась идти в суд, но после курса все страхи ушли.",
                rating: 5,
                avatar: "https://cdn.poehali.dev/files/5401a266-6070-43e4-805e-f2f1abe515b5.jpg"
              },
              {
                name: "Наталья П.",
                text: "Это просто фантастика! Я без юридического образования и вообще в этом ничего не понимаю, и моё заявление приняли в суде с первого раза. Большое спасибо вам за курс!",
                rating: 5,
                avatar: "https://cdn.poehali.dev/files/613a3f47-7fb1-46ad-a222-ba746980e971.jpg"
              }
            ].map((review, index) => (
              <Card key={index} className="border-2">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4 mb-4">
                    <img 
                      src={review.avatar} 
                      alt={review.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-accent/20"
                    />
                    <div>
                      <p className="font-semibold text-lg">{review.name}</p>
                      <div className="flex gap-1">
                        {[...Array(review.rating)].map((_, i) => (
                          <Icon key={i} name="Star" className="text-accent fill-accent" size={16} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-muted-foreground italic">"{review.text}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <Badge className="mb-4">Частые вопросы</Badge>
            <h3 className="text-4xl md:text-5xl font-bold mb-6">Ответы на ваши вопросы</h3>
            <p className="text-xl text-muted-foreground">
              Всё, что нужно знать о процедуре банкротства
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="item-1" className="border rounded-lg px-6">
              <AccordionTrigger className="text-lg font-semibold hover:text-accent">
                Кто может объявить себя банкротом?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Любой гражданин РФ, чья задолженность превышает 500 000 рублей и просрочка платежей составляет более 3 месяцев. Также банкротство возможно при меньшей задолженности, если вы не можете платить по долгам.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border rounded-lg px-6">
              <AccordionTrigger className="text-lg font-semibold hover:text-accent">
                Сколько времени занимает процедура банкротства?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                В среднем 6-12 месяцев с момента подачи заявления в суд до получения финального решения. Конкретные сроки зависят от сложности вашей ситуации и загруженности суда.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border rounded-lg px-6">
              <AccordionTrigger className="text-lg font-semibold hover:text-accent">
                Какие долги списываются при банкротстве?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Списываются: кредиты, займы, задолженности по ЖКХ, долги перед физлицами. НЕ списываются: алименты, возмещение вреда здоровью, заработная плата сотрудникам, субсидиарная ответственность.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="border rounded-lg px-6">
              <AccordionTrigger className="text-lg font-semibold hover:text-accent">
                Заберут ли моё единственное жильё?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Нет, единственное жильё защищено законом и не может быть отобрано. Исключение — ипотечная квартира, но и здесь есть варианты защиты, о которых я рассказываю в курсе.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="border rounded-lg px-6">
              <AccordionTrigger className="text-lg font-semibold hover:text-accent">
                Смогу ли я брать кредиты после банкротства?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Да, сможете. В течение 5 лет нужно сообщать банкам о своём банкротстве. Но после процедуры вы получаете чистую кредитную историю и можете начать всё заново.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6" className="border rounded-lg px-6">
              <AccordionTrigger className="text-lg font-semibold hover:text-accent">
                Можно ли обанкротиться без юриста?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Да, закон позволяет гражданам проходить процедуру самостоятельно. Мой курс создан специально для этого — вы получите все необходимые знания, шаблоны и пошаговые инструкции.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-7" className="border rounded-lg px-6">
              <AccordionTrigger className="text-lg font-semibold hover:text-accent">
                Сколько стоит банкротство через юриста?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Услуги юриста стоят от 50 000 до 150 000 рублей + 25 000 рублей госпошлина и вознаграждение финансовому управляющему. Самостоятельное банкротство с курсом обойдется в 30-40 тысяч рублей.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-8" className="border rounded-lg px-6">
              <AccordionTrigger className="text-lg font-semibold hover:text-accent">
                Узнают ли на работе о моём банкротстве?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Информация о банкротстве публикуется в ЕФРСБ (открытый реестр), но на практике работодатели редко проверяют эти данные. Если вы не руководитель или не занимаете финансовую должность, это не повлияет на работу.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

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
                    <span className="text-sm">Всё из курса + личный юрист</span>
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