import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/sections/Header";
import HeroSection from "@/components/sections/HeroSection";
import VideoSection from "@/components/sections/VideoSection";
import FeaturesSection from "@/components/sections/FeaturesSection";
import ResultSection from "@/components/sections/ResultSection";
import ChatSupportSection from "@/components/sections/ChatSupportSection";
import ProgramSection from "@/components/sections/ProgramSection";
import AuthorSection from "@/components/sections/AuthorSection";
import ReviewsSection from "@/components/sections/ReviewsSection";
import FAQSection from "@/components/sections/FAQSection";
import PricingSection from "@/components/sections/PricingSection";
import ContactSection from "@/components/sections/ContactSection";
import Footer from "@/components/sections/Footer";
import QuickTestimonialsSection from "@/components/sections/QuickTestimonialsSection";

export default function Index() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [sendingEmail, setSendingEmail] = useState(false);
  
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

  const sendTestEmail = async () => {
    setSendingEmail(true);
    try {
      const response = await fetch('https://functions.poehali.dev/44b67bea-4c0b-4f2d-833a-f5adc60d9567', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'melni-v@yandex.ru',
          name: 'Владимир',
          password: '123456'
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: '✅ Письмо отправлено!',
          description: 'Проверьте почту melni-v@yandex.ru',
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Ошибка',
          description: data.error || 'Не удалось отправить письмо',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: 'Произошла ошибка при отправке',
      });
    } finally {
      setSendingEmail(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-muted/30">
      <Button 
        onClick={sendTestEmail}
        disabled={sendingEmail}
        className="fixed top-4 right-4 z-50 bg-purple-600 hover:bg-purple-700"
      >
        {sendingEmail ? 'Отправка...' : '📧 Тест письма'}
      </Button>
      <Header user={user} scrollToSection={scrollToSection} handleGetCourse={handleGetCourse} />
      <HeroSection user={user} scrollToSection={scrollToSection} />
      <QuickTestimonialsSection />
      <VideoSection />
      <FeaturesSection scrollToSection={scrollToSection} />
      <ResultSection />
      <ProgramSection />
      <PricingSection />
      <ChatSupportSection user={user} />
      <AuthorSection />
      <ReviewsSection />
      <FAQSection />
      <ContactSection />
      <Footer />
    </div>
  );
}