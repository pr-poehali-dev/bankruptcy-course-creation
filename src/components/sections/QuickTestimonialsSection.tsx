import { Card, CardContent } from "@/components/ui/card";
import Icon from "@/components/ui/icon";

export default function QuickTestimonialsSection() {
  return (
    <section className="py-12 px-4 bg-gradient-to-b from-muted/30 to-white">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="border-2 border-accent/20 hover:border-accent/40 transition-all">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3 mb-4">
                <img 
                  src="https://ui-avatars.com/api/?name=Анна+К&background=FFC107&color=1a1f2e&size=48" 
                  alt="Анна К."
                  className="rounded-full w-12 h-12"
                />
                <div>
                  <p className="font-semibold">Анна К.</p>
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(i => <Icon key={i} name="Star" size={14} className="text-accent fill-accent" />)}
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                "Прошла банкротство сама по этому курсу. Все четко и понятно, сэкономила более 100 тысяч!"
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-accent/20 hover:border-accent/40 transition-all">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3 mb-4">
                <img 
                  src="https://ui-avatars.com/api/?name=Дмитрий+М&background=FFC107&color=1a1f2e&size=48" 
                  alt="Дмитрий М."
                  className="rounded-full w-12 h-12"
                />
                <div>
                  <p className="font-semibold">Дмитрий М.</p>
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(i => <Icon key={i} name="Star" size={14} className="text-accent fill-accent" />)}
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                "Юрист в чате помог разобраться со сложными моментами. Очень доволен результатом!"
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-accent/20 hover:border-accent/40 transition-all">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3 mb-4">
                <img 
                  src="https://ui-avatars.com/api/?name=Елена+С&background=FFC107&color=1a1f2e&size=48" 
                  alt="Елена С."
                  className="rounded-full w-12 h-12"
                />
                <div>
                  <p className="font-semibold">Елена С.</p>
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(i => <Icon key={i} name="Star" size={14} className="text-accent fill-accent" />)}
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                "Курс окупился за первую же консультацию. Валентина объясняет все простым языком."
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
