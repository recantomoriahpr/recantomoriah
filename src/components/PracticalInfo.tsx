import { MapPin, Users, Calendar, Clock } from 'lucide-react';
import { usePublicPage } from '@/hooks/usePublicPage';

interface InfoCardData {
  id: string;
  icon_key: string | null;
  title: string | null;
  description: string | null;
  order: number;
}

interface ScheduleData {
  id: string;
  day_of_week: string | null;
  opening_time: string | null;
  closing_time: string | null;
  is_closed: boolean | null;
  order: number;
}

interface PracticalInfoProps {
  infoCards?: InfoCardData[];
  schedules?: ScheduleData[];
}

const infos = [
  {
    icon: MapPin,
    title: 'Localização',
    description: 'Zona Rural - Natureza preservada',
    detail: 'Fácil acesso pela rodovia principal'
  },
  {
    icon: Users,
    title: 'Capacidade',
    description: 'Até 150 pessoas no salão',
    detail: '80 pessoas nas acomodações'
  },
  {
    icon: Calendar,
    title: 'Tipos de Eventos',
    description: 'Casamentos, Retiros, Aniversários',
    detail: 'Confraternizações e eventos corporativos'
  },
  {
    icon: Clock,
    title: 'Disponibilidade',
    description: 'Finais de semana e feriados',
    detail: 'Pacotes de 1 a 3 dias'
  }
];

const PracticalInfo = ({ infoCards = [], schedules = [] }: PracticalInfoProps) => {
  const { data } = usePublicPage();
  const contactInfo = (data as any)?.contact_info;

  // Map icon keys to components
  const iconMap: Record<string, any> = {
    MapPin, Users, Calendar, Clock
  };

  // Use API data or fallback to mock
  const displayCards = infoCards.length > 0 ? infoCards.map(card => ({
    icon: iconMap[card.icon_key || 'MapPin'] || MapPin,
    title: card.title || 'Informação',
    description: card.description || '',
    detail: ''
  })) : infos;

  // Coordenadas do Google Maps
  const mapUrl = contactInfo?.gps_coordinates || 'https://maps.app.goo.gl/b4SGxZPn7MkpBNzg9';
  const embedUrl = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3604.8285717773684!2d-49.33298602495!3d-25.718482277371!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjXCsDQzJzA2LjUiUyA0OcKwMTknNTAuOSJX!5e0!3m2!1spt-BR!2sbr!4v1635000000000!5m2!1spt-BR!2sbr';

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            Informações Práticas
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Tudo que você precisa saber para planejar seu evento conosco
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Info Cards */}
          <div className="grid sm:grid-cols-2 gap-6">
            {displayCards.map((info, index) => (
              <div
                key={index}
                className="bg-card p-6 rounded-xl shadow-nature hover:shadow-nature-medium transition-nature"
              >
                <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
                  <info.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-card-foreground mb-2">
                  {info.title}
                </h3>
                <p className="text-primary font-medium mb-1">
                  {info.description}
                </p>
                <p className="text-muted-foreground text-sm">
                  {info.detail}
                </p>
              </div>
            ))}
          </div>

          {/* Map Container */}
          <div className="bg-card rounded-xl shadow-nature p-6">
            <h3 className="text-xl font-semibold text-card-foreground mb-4">
              Como Chegar
            </h3>
            <div className="aspect-video bg-muted rounded-lg overflow-hidden">
              <iframe
                src={embedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Localização do Recanto Moriah"
              />
            </div>
            <div className="mt-4 p-4 bg-secondary rounded-lg">
              <p className="text-sm text-secondary-foreground">
                <strong>Endereço:</strong> {contactInfo?.address || 'Estrada Rural KM 15'}{contactInfo?.address_complement ? `, ${contactInfo.address_complement}` : ''}<br />
                {contactInfo?.address_reference && (
                  <><strong>Referência:</strong> {contactInfo.address_reference}<br /></>
                )}
                <strong>GPS:</strong> -25.71848227599143, -49.330801957670026
              </p>
              <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                <MapPin className="w-4 h-4" />
                Abrir no Google Maps
              </a>
            </div>
          </div>
        </div>

        {/* Event Types */}
        <div className="mt-16 bg-gradient-hero rounded-xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">
            Eventos que Realizamos
          </h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-2">💒</div>
              <h4 className="font-semibold">Casamentos</h4>
              <p className="text-sm opacity-90">Cerimônias inesquecíveis</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🙏</div>
              <h4 className="font-semibold">Retiros</h4>
              <p className="text-sm opacity-90">Espirituais e corporativos</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🎉</div>
              <h4 className="font-semibold">Aniversários</h4>
              <p className="text-sm opacity-90">Celebrações especiais</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🤝</div>
              <h4 className="font-semibold">Corporativos</h4>
              <p className="text-sm opacity-90">Confraternizações</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PracticalInfo;