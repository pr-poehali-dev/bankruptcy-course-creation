import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start gap-3">
            <img src="https://cdn.poehali.dev/files/63deadff-30a2-40b7-88fb-4646bfaa9557.PNG" alt="Валентина Голосова" className="h-16 w-auto" />
            <div className="text-sm text-muted-foreground text-center md:text-left">
              © {new Date().getFullYear()} Курс по банкротству. Все права защищены.
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link 
              to="/oferta" 
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Публичная оферта
            </Link>
            <Link 
              to="/privacy" 
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Политика конфиденциальности
            </Link>
            <Link 
              to="/requisites" 
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Реквизиты
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}