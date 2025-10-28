import { MapPin, Phone, Mail, MessageCircle, Instagram, Facebook, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePublicPage } from '@/hooks/usePublicPage';

interface FooterLinkData {
  id: string;
  label: string | null;
  url: string | null;
  category: string | null;
  order: number;
}

interface FooterProps {
  links?: FooterLinkData[];
}

const Footer = ({ links = [] }: FooterProps) => {
  const currentYear = new Date().getFullYear();
  const { data } = usePublicPage();
  const contactInfo = (data as any)?.contact_info;

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Brand and Description */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">{contactInfo?.footer_brand_title || 'Recanto Moriah'}</h3>
            <p className="text-primary-foreground/80 leading-relaxed">
              {contactInfo?.footer_brand_description || 'O lugar perfeito para seus momentos especiais. Natureza, conforto e estrutura completa para casamentos, retiros e eventos inesquecíveis.'}
            </p>
            <div className="flex space-x-4">
              {contactInfo?.instagram && (
                <a
                  href={contactInfo.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-primary-foreground/10 rounded-full hover:bg-primary-foreground/20 transition-nature"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              )}
              {contactInfo?.facebook && (
                <a
                  href={contactInfo.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-primary-foreground/10 rounded-full hover:bg-primary-foreground/20 transition-nature"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Contato</h4>
            <div className="space-y-3">
              <a 
                href={`tel:${contactInfo?.phone?.replace(/\D/g, '') || '11999999999'}`}
                className="flex items-center space-x-3 hover:text-primary-foreground transition-colors cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                <span className="text-primary-foreground/80 hover:text-primary-foreground">{contactInfo?.phone || '(11) 99999-9999'}</span>
              </a>
              <a 
                href={`https://wa.me/${contactInfo?.whatsapp?.replace(/\D/g, '') || '11999999999'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 hover:text-primary-foreground transition-colors cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="text-primary-foreground/80 hover:text-primary-foreground">{contactInfo?.whatsapp || contactInfo?.phone || '(11) 99999-9999'}</span>
              </a>
              <a 
                href={`mailto:${contactInfo?.email || 'contato@recantomoriah.com.br'}`}
                className="flex items-center space-x-3 hover:text-primary-foreground transition-colors cursor-pointer"
              >
                <Mail className="w-4 h-4" />
                <span className="text-primary-foreground/80 hover:text-primary-foreground">{contactInfo?.email || 'contato@recantomoriah.com.br'}</span>
              </a>
            </div>
          </div>

          {/* Address and Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Localização</h4>
            <a 
              href={contactInfo?.gps_coordinates || 'https://maps.app.goo.gl/b4SGxZPn7MkpBNzg9'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start space-x-3 hover:text-primary-foreground transition-colors cursor-pointer"
            >
              <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
              <div className="text-primary-foreground/80 hover:text-primary-foreground">
                <p>{contactInfo?.address || 'Estrada Rural KM 15'}</p>
                {contactInfo?.address_complement && <p>{contactInfo.address_complement}</p>}
              </div>
            </a>
            
            {links.length > 0 && (
              <div className="pt-4">
                <h5 className="font-medium mb-2">Navegação Rápida</h5>
                <div className="space-y-1 text-primary-foreground/80 text-sm">
                  {links.map((link) => (
                    <p key={link.id}>• {link.label || 'Link'}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/20">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-6">
              <Link 
                to="/admin" 
                className="flex items-center space-x-1 opacity-30 hover:opacity-60 transition-all duration-300"
                aria-label="Área administrativa"
              >
                <Settings className="w-3 h-3" />
              </Link>
              <p className="text-primary-foreground/60 text-sm">
                © {currentYear} {contactInfo?.footer_copyright_text || 'Recanto Moriah. Todos os direitos reservados.'}
              </p>
            </div>
            <div className="flex items-center space-x-6 text-primary-foreground/60 text-sm">
              <a href="#" className="hover:text-primary-foreground transition-nature">
                {contactInfo?.footer_privacy_policy_text || 'Política de Privacidade'}
              </a>
              <a href="#" className="hover:text-primary-foreground transition-nature">
                {contactInfo?.footer_terms_of_use_text || 'Termos de Uso'}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;