import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";

export default function ReviewsSection() {
  const reviews = [
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
  ];

  return (
    <section id="reviews" className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <Badge className="mb-4">Отзывы</Badge>
          <h3 className="text-4xl md:text-5xl font-bold mb-6">Что говорят клиенты, которые приобрели курс</h3>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {reviews.map((review, index) => (
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
  );
}
