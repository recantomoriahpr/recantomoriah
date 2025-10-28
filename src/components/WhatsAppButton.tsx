import { MessageCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { usePublicPage } from '@/hooks/usePublicPage';

const WhatsAppButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { data } = usePublicPage();
  
  const whatsappNumber = (data as any)?.contact_info?.whatsapp?.replace(/\D/g, '') || '';
  const defaultMessage = encodeURIComponent('Olá! Gostaria de saber mais sobre o Recanto Moriah.');

  // Mostrar botão após scroll de 300px
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!whatsappNumber) {
    return null; // Não mostrar se não tiver WhatsApp cadastrado
  }

  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${defaultMessage}`;

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
      }`}
      title="Fale conosco pelo WhatsApp"
      aria-label="WhatsApp"
    >
      <MessageCircle className="w-7 h-7" />
      
      {/* Pulse animation */}
      <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-20"></span>
    </a>
  );
};

export default WhatsAppButton;
