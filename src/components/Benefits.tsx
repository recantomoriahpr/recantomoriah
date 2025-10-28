import { Trees, Users, Home, Car, Heart, Utensils, Star, Zap, Shield, Award } from 'lucide-react';

const iconMap: Record<string, any> = {
  Trees,
  Users,
  Home,
  Car,
  Heart,
  Utensils,
  Star,
  Zap,
  Shield,
  Award,
};

interface BenefitCardData {
  id: string;
  icon_key: string | null;
  title: string | null;
  description: string | null;
  order: number;
}

interface BenefitsProps {
  items?: BenefitCardData[];
}

const Benefits = ({ items = [] }: BenefitsProps) => {
  // Se não houver dados da API, usa fallback mockado
  const benefits = items.length > 0 ? items.map(item => ({
    icon: iconMap[item.icon_key || 'Star'] || Star,
    title: item.title || 'Benefício',
    description: item.description || '',
  })) : [
    {
      icon: Trees,
      title: 'Natureza Exuberante',
      description: 'Espaço amplo e tranquilo em meio à natureza, perfeito para momentos especiais'
    },
    {
      icon: Users,
      title: 'Acomodações Confortáveis',
      description: 'Quartos aconchegantes para grupos e famílias, garantindo descanso e conforto'
    },
    {
      icon: Home,
      title: 'Salão de Festas',
      description: 'Auditório elegante para celebrações, cerimônias e eventos corporativos'
    },
  ];
  return (
    <section className="py-20 bg-gradient-nature">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            Por que escolher o Recanto Moriah?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Um espaço único que combina a tranquilidade da natureza com toda a estrutura necessária para tornar seu evento inesquecível
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-card p-8 rounded-xl shadow-nature hover:shadow-nature-medium transition-nature group"
            >
              <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6 group-hover:bg-primary/20 transition-nature">
                <benefit.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-card-foreground mb-4">
                {benefit.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;