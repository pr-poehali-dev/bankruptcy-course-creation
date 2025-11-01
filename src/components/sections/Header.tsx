import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  user: any;
  scrollToSection: (id: string) => void;
  handleGetCourse: () => void;
}

export default function Header({ user, scrollToSection, handleGetCourse }: HeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img src="https://cdn.poehali.dev/files/63deadff-30a2-40b7-88fb-4646bfaa9557.PNG" alt="Валентина Голосова" className="h-12 w-auto" />
          <h1 className="text-xl font-bold text-primary hidden sm:block">Голосова Валентина</h1>
        </div>
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
  );
}