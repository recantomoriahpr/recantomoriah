import { Star, Quote } from 'lucide-react';

interface TestimonialData {
  id: string;
  name: string | null;
  role: string | null;
  text: string | null;
  rating: number | null;
  order: number;
}

interface TestimonialsProps {
  items?: TestimonialData[];
}

const Testimonials = ({ items = [] }: TestimonialsProps) => {
  const testimonials = items.length > 0 ? items.map(item => ({
    name: item.name || 'Cliente',
    event: item.role || 'Evento',
    text: item.text || '',
    rating: item.rating || 5,
  })) : [
    {
      name: 'Maria e João Silva',
      event: 'Casamento',
      text: 'Nosso casamento no Recanto Moriah foi simplesmente perfeito! A natureza ao redor criou um ambiente mágico e inesquecível.',
      rating: 5
    },
    {
      name: 'Igreja Comunidade Vida',
      event: 'Retiro Espiritual',
      text: 'Nosso retiro foi abençoado! A estrutura e o ambiente superaram nossas expectativas. Voltaremos com certeza.',
      rating: 5
    },
  ];
  return (
    <section className="py-20 bg-gradient-nature">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            Depoimentos
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Veja o que nossos clientes falam sobre suas experiências no Recanto Moriah
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-card p-8 rounded-xl shadow-nature hover:shadow-nature-medium transition-nature"
            >
              <div className="flex items-center mb-4">
                <Quote className="w-8 h-8 text-primary/30 mr-4" />
                <div className="flex space-x-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
              
              <p className="text-muted-foreground text-lg mb-6 leading-relaxed italic">
                "{testimonial.text}"
              </p>
              
              <div className="border-t border-border pt-4">
                <h4 className="font-semibold text-card-foreground">
                  {testimonial.name}
                </h4>
                <p className="text-primary text-sm font-medium">
                  {testimonial.event}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;