import { Badge } from "@/components/ui/badge";

export default function VideoSection() {
  return (
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
  );
}
