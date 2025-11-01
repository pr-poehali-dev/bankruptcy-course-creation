import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
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
      <Header user={user} scrollToSection={scrollToSection} handleGetCourse={handleGetCourse} />
      <HeroSection user={user} scrollToSection={scrollToSection} />
      <VideoSection />
      <FeaturesSection scrollToSection={scrollToSection} />
      <ResultSection />
      <ChatSupportSection user={user} />
      <ProgramSection />
      <AuthorSection />
      <ReviewsSection />
      <FAQSection />
      <PricingSection />
      <ContactSection />
    </div>
  );
}
