import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export type Slide = {
  image_url: string;
  title?: string | null;
  subtitle?: string | null;
  cta_text?: string | null;
  cta_link?: string | null;
};

// Fallback slides using public image URLs
const fallbackSlides: Slide[] = [
  {
    image_url: 'https://picsum.photos/1200/600?random=1',
    title: 'Recanto Moriah',
    subtitle: 'O lugar perfeito para seu retiro ou casamento dos sonhos',
    cta_text: 'Solicitar Orçamento',
  },
  {
    image_url: 'https://picsum.photos/1200/600?random=2',
    title: 'Cerimônias Inesquecíveis',
    subtitle: 'Natureza, conforto e estrutura completa para receber seu evento especial',
    cta_text: 'Solicitar Orçamento',
  },
  {
    image_url: 'https://picsum.photos/1200/600?random=3',
    title: 'Acomodações Premium',
    subtitle: 'Conforto e tranquilidade para você e seus convidados',
    cta_text: 'Solicitar Orçamento',
  },
];

interface HeroCarouselProps {
  slides?: Slide[];
  onContactClick?: () => void;
}

const HeroCarousel = ({ slides = [], onContactClick }: HeroCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const slidesToUse: Slide[] = slides.length ? slides : fallbackSlides;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slidesToUse.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slidesToUse.length]);

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slidesToUse.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + slidesToUse.length) % slidesToUse.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Image Carousel */}
      <div className="relative h-full">
        {slidesToUse.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={slide.image_url}
              alt={slide.title ?? 'Hero slide'}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-hero" />
          </div>
        ))}
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white max-w-4xl px-6">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            {slidesToUse[currentIndex].title ?? ''}
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 animate-fade-in">
            {slidesToUse[currentIndex].subtitle ?? ''}
          </p>
          <Button
            onClick={() => {
              const link = slidesToUse[currentIndex]?.cta_link;
              if (link) {
                window.open(link, '_blank', 'noopener,noreferrer');
              } else {
                onContactClick?.();
              }
            }}
            className="btn-hero animate-scale-in"
          >
            {slidesToUse[currentIndex].cta_text ?? 'Solicitar Orçamento'}
          </Button>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-nature"
        aria-label="Imagem anterior"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-nature"
        aria-label="Próxima imagem"
      >
        <ChevronRight size={24} />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3">
        {slidesToUse.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-nature ${
              index === currentIndex ? 'bg-white' : 'bg-white/50'
            }`}
            aria-label={`Ir para slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroCarousel;