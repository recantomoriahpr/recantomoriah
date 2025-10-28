import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, Plus, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  listTestimonials,
  createTestimonial,
  updateTestimonial as updateTestimonialApi,
  deleteTestimonial,
  publishTestimonials,
  type TestimonialApi,
} from '@/lib/adminApi';

interface AdminTestimonialsEditorProps {
  onChanged: () => void;
}

interface Testimonial {
  id: string;
  name: string;
  text: string;
  event: string;
  rating: number;
  order: number;
}

const AdminTestimonialsEditor = ({ onChanged }: AdminTestimonialsEditorProps) => {
  const { toast } = useToast();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        const result = await listTestimonials();
        const items: TestimonialApi[] = (result?.data ?? result) as TestimonialApi[];
        const mapped = (items || []).map((t) => ({
          id: t.id,
          name: t.name ?? '',
          text: t.text ?? '',
          event: t.role ?? '',
          rating: t.rating ?? 5,
          order: t.order ?? 0,
        })).sort((a, b) => a.order - b.order);
        setTestimonials(mapped);
      } catch (err: any) {
        toast({ title: 'Erro ao carregar depoimentos', description: String(err?.message || err), variant: 'destructive' });
      }
    };
    loadTestimonials();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addTestimonial = () => {
    const order = testimonials.length ? Math.max(...testimonials.map(t => t.order)) + 1 : 0;
    createTestimonial({
      name: 'Novo Depoimento',
      text: 'Texto do depoimento',
      role: 'Evento',
      rating: 5,
      order,
    })
      .then((res) => {
        const created: TestimonialApi = res?.data ?? res;
        setTestimonials(prev => [...prev, {
          id: created.id,
          name: created.name ?? '',
          text: created.text ?? '',
          event: created.role ?? '',
          rating: created.rating ?? 5,
          order: created.order ?? 0,
        }].sort((a, b) => a.order - b.order));
        onChanged();
      })
      .catch((err) => {
        toast({ title: 'Erro ao criar depoimento', description: String(err?.message || err), variant: 'destructive' });
      });
  };

  const updateTestimonial = (id: string, field: keyof Testimonial, value: string | number) => {
    setTestimonials(prev => prev.map(testimonial => (testimonial.id === id ? { ...testimonial, [field]: value } : testimonial)));

    const payload: any = {};
    if (field === 'name') payload.name = value;
    if (field === 'text') payload.text = value;
    if (field === 'event') payload.role = value;
    if (field === 'rating') payload.rating = value;

    if (Object.keys(payload).length) {
      updateTestimonialApi(id, payload).catch((err) => {
        toast({ title: 'Erro ao atualizar depoimento', description: String(err?.message || err), variant: 'destructive' });
      });
    }
    onChanged();
  };

  const removeTestimonial = (id: string) => {
    deleteTestimonial(id)
      .then(() => {
        setTestimonials(prev => prev.filter(testimonial => testimonial.id !== id));
        onChanged();
      })
      .catch((err) => {
        toast({ title: 'Erro ao remover depoimento', description: String(err?.message || err), variant: 'destructive' });
      });
  };

  const StarRating = ({ rating, onRatingChange }: { rating: number; onRatingChange: (rating: number) => void }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onRatingChange(star)}
          className={`text-lg ${star <= rating ? 'text-yellow-400' : 'text-gray-300'} hover:text-yellow-400 transition-colors`}
        >
          <Star className="h-4 w-4" fill={star <= rating ? 'currentColor' : 'none'} />
        </button>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header with Publish Button */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Depoimentos (Seção 4)</h3>
          <p className="text-sm text-muted-foreground">Gerencie os depoimentos de clientes</p>
        </div>
        <Button
          variant="outline"
          onClick={async () => {
            try {
              await publishTestimonials();
              toast({ title: 'Depoimentos publicados!', description: 'As alterações foram aplicadas ao site público.' });
            } catch (err: any) {
              toast({ title: 'Erro ao publicar', description: String(err?.message || err), variant: 'destructive' });
            }
          }}
        >
          Publicar
        </Button>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Gerenciar Depoimentos</h3>
          <p className="text-sm text-muted-foreground">Adicione e edite depoimentos de clientes satisfeitos</p>
        </div>
        <Button onClick={addTestimonial} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Adicionar Depoimento
        </Button>
      </div>

      <div className="space-y-4">
        {testimonials.map((testimonial) => (
          <Card key={testimonial.id}>
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <CardTitle className="text-base">Depoimento #{testimonial.id}</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeTestimonial(testimonial.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`name-${testimonial.id}`}>Nome do Cliente</Label>
                  <Input
                    id={`name-${testimonial.id}`}
                    value={testimonial.name}
                    onChange={(e) => updateTestimonial(testimonial.id, 'name', e.target.value)}
                    placeholder="Ex: Ana e Carlos Silva"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor={`event-${testimonial.id}`}>Tipo de Evento</Label>
                  <Input
                    id={`event-${testimonial.id}`}
                    value={testimonial.event}
                    onChange={(e) => updateTestimonial(testimonial.id, 'event', e.target.value)}
                    placeholder="Ex: Casamento, Retiro, Aniversário"
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor={`text-${testimonial.id}`}>Depoimento</Label>
                <Textarea
                  id={`text-${testimonial.id}`}
                  value={testimonial.text}
                  onChange={(e) => updateTestimonial(testimonial.id, 'text', e.target.value)}
                  placeholder="Digite o depoimento completo do cliente..."
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div>
                <Label>Avaliação</Label>
                <div className="mt-2">
                  <StarRating 
                    rating={testimonial.rating} 
                    onRatingChange={(rating) => updateTestimonial(testimonial.id, 'rating', rating)} 
                  />
                </div>
              </div>

              {testimonial.name && testimonial.text && (
                <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium text-sm text-muted-foreground mb-2">Preview:</h4>
                  <blockquote className="text-sm italic">"{testimonial.text}"</blockquote>
                  <div className="flex items-center justify-between mt-2">
                    <cite className="text-sm font-medium">— {testimonial.name}</cite>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">{testimonial.event}</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {testimonials.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Nenhum depoimento cadastrado</h3>
            <p className="text-muted-foreground mb-4">
              Adicione depoimentos de clientes satisfeitos para aumentar a credibilidade do seu site.
            </p>
            <Button onClick={addTestimonial}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Primeiro Depoimento
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">💡 Dicas para bons depoimentos</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Use depoimentos reais e específicos</li>
          <li>• Inclua o tipo de evento para dar contexto</li>
          <li>• Mantenha textos concisos mas impactantes</li>
          <li>• Peça permissão antes de usar nomes reais</li>
        </ul>
      </div>
    </div>
  );
};

export default AdminTestimonialsEditor;