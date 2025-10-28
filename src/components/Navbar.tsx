import { useEffect, useState } from 'react';
import { usePublicPage } from '@/hooks/usePublicPage';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { data } = usePublicPage();
  const logoUrl = data?.site_settings?.logo_url;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80; // Altura do navbar
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-background/70 backdrop-blur-md shadow-sm' 
          : 'bg-background/30 backdrop-blur-sm'
      }`}
      style={{ height: '10vh', minHeight: '60px', maxHeight: '80px' }}
    >
      <div className="container mx-auto h-full px-4 flex items-center justify-between">
        {/* Logo e Nome */}
        <div className="flex items-center gap-3">
          {logoUrl && (
            <img 
              src={logoUrl} 
              alt="Logo Recanto Moriah" 
              className="h-10 w-10 object-contain"
            />
          )}
          <span className="text-xl md:text-2xl font-semibold text-primary">
            Recanto Moriah
          </span>
        </div>

        {/* Menu de Navegação */}
        <div className="hidden md:flex items-center gap-6">
          <button
            onClick={() => scrollToSection('hero')}
            className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
          >
            Início
          </button>
          <button
            onClick={() => scrollToSection('benefits')}
            className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
          >
            Benefícios
          </button>
          <button
            onClick={() => scrollToSection('gallery')}
            className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
          >
            Galeria
          </button>
          <button
            onClick={() => scrollToSection('testimonials')}
            className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
          >
            Depoimentos
          </button>
          <button
            onClick={() => scrollToSection('contact')}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Contato
          </button>
        </div>

        {/* Menu Mobile - CTA apenas */}
        <div className="md:hidden">
          <button
            onClick={() => scrollToSection('contact')}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Contato
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
