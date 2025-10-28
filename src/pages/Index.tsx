import { useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import HeroCarousel from '@/components/HeroCarousel';
import Benefits from '@/components/Benefits';
import Gallery from '@/components/Gallery';
import Testimonials from '@/components/Testimonials';
import PracticalInfo from '@/components/PracticalInfo';
import ContactForm from '@/components/ContactForm';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { usePublicPage } from '@/hooks/usePublicPage';
import { updateGlobalTheme } from '@/lib/globalData';

const Index = () => {
  const contactRef = useRef<HTMLDivElement>(null);
  const { data, isLoading } = usePublicPage();

  const scrollToContact = () => {
    contactRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const s = data?.site_settings;
    if (s) {
      // Convert possibly nulls to defaults already used in theme
      updateGlobalTheme({
        primary: s.primary_color ?? '#4a5d23',
        secondary: s.secondary_color ?? '#f4f1e8',
        accent: s.accent_color ?? '#e8e0d0',
        background: s.background_color ?? '#fefcf7',
        fontFamily: s.font_family ?? 'Inter',
      });
    }
  }, [data?.site_settings]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <WhatsAppButton />
      {isLoading ? (
        <section className="h-screen flex items-center justify-center text-muted-foreground">
          Carregando...
        </section>
      ) : (
        <>
          <div id="hero">
            <HeroCarousel slides={(data as any)?.hero_slides ?? []} onContactClick={scrollToContact} />
          </div>
          <div id="benefits">
            <Benefits items={(data as any)?.benefit_cards ?? []} />
          </div>
          <div id="gallery">
            <Gallery 
              albums={(data as any)?.gallery_albums ?? []} 
              images={(data as any)?.gallery_images ?? []}
            />
          </div>
          <div id="testimonials">
            <Testimonials items={(data as any)?.testimonials ?? []} />
          </div>
          <PracticalInfo 
            infoCards={(data as any)?.info_cards ?? []} 
            schedules={(data as any)?.schedules ?? []}
          />
          <div id="contact" ref={contactRef}>
            <ContactForm />
          </div>
          <Footer links={(data as any)?.footer_links ?? []} />
        </>
      )}
    </div>
  );
};

export default Index;