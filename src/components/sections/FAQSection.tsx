import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQSection() {
  return (
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
              Услуги юриста стоят от 50 000 до 150 000 рублей + 25 000 рублей госпошлина и вознаграждение финансовому управляющему. Самостоятельное банкротство с курсом обойдется в 30-50 тысяч рублей.
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
  );
}