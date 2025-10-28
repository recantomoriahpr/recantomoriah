import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, Trees, Users, Home, Utensils, Car, Heart, Star, Zap, Shield, Award } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  listBenefitCards,
  createBenefitCard,
  updateBenefitCard,
  deleteBenefitCard,
  publishBenefitCards,
  type BenefitCardApi,
} from '@/lib/adminApi';

interface AdminBenefitsEditorProps {
  onChanged: () => void;
}

interface Benefit {
  id: string;
  icon: string;
  title: string;
  description: string;
  order: number;
}

const AdminBenefitsEditor = ({ onChanged }: AdminBenefitsEditorProps) => {
  const { toast } = useToast();
  const [benefits, setBenefits] = useState<Benefit[]>([]);

  useEffect(() => {
    const loadBenefits = async () => {
      try {
        const result = await listBenefitCards();
        const items: BenefitCardApi[] = (result?.data ?? result) as BenefitCardApi[];
        const mapped = (items || []).map((b) => ({
          id: b.id,
          icon: b.icon_key ?? 'Trees',
          title: b.title ?? '',
          description: b.description ?? '',
          order: b.order ?? 0,
        })).sort((a, b) => a.order - b.order);
        setBenefits(mapped);
      } catch (err: any) {
        toast({ title: 'Erro ao carregar benefícios', description: String(err?.message || err), variant: 'destructive' });
      }
    };
    loadBenefits();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const iconOptions = [
    { name: 'Trees', label: 'Árvores', component: Trees },
    { name: 'Users', label: 'Usuários', component: Users },
    { name: 'Home', label: 'Casa', component: Home },
    { name: 'Utensils', label: 'Utensílios', component: Utensils },
    { name: 'Car', label: 'Carro', component: Car },
    { name: 'Heart', label: 'Coração', component: Heart },
    { name: 'Star', label: 'Estrela', component: Star },
    { name: 'Zap', label: 'Raio', component: Zap },
    { name: 'Shield', label: 'Escudo', component: Shield },
    { name: 'Award', label: 'Prêmio', component: Award }
  ];

  const getIconComponent = (iconName: string) => {
    const icon = iconOptions.find(opt => opt.name === iconName);
    return icon ? icon.component : Trees;
  };

  const addBenefit = () => {
    const order = benefits.length ? Math.max(...benefits.map(b => b.order)) + 1 : 0;
    createBenefitCard({
      icon_key: 'Star',
      title: 'Novo Benefício',
      description: 'Descrição do benefício',
      order,
    })
      .then((res) => {
        const created: BenefitCardApi = res?.data ?? res;
        setBenefits(prev => [...prev, {
          id: created.id,
          icon: created.icon ?? 'Star',
          title: created.title ?? '',
          description: created.description ?? '',
          order: created.order ?? 0,
        }].sort((a, b) => a.order - b.order));
        onChanged();
      })
      .catch((err) => {
        toast({ title: 'Erro ao criar benefício', description: String(err?.message || err), variant: 'destructive' });
      });
  };

  const updateBenefit = (id: string, field: keyof Benefit, value: string) => {
    setBenefits(prev => prev.map(benefit => (benefit.id === id ? { ...benefit, [field]: value } : benefit)));

    const payload: any = {};
    if (field === 'icon') payload.icon_key = value;
    if (field === 'title') payload.title = value;
    if (field === 'description') payload.description = value;

    if (Object.keys(payload).length) {
      updateBenefitCard(id, payload).catch((err) => {
        toast({ title: 'Erro ao atualizar benefício', description: String(err?.message || err), variant: 'destructive' });
      });
    }
    onChanged();
  };

  const removeBenefit = (id: string) => {
    if (benefits.length > 1) {
      deleteBenefitCard(id)
        .then(() => {
          setBenefits(prev => prev.filter(benefit => benefit.id !== id));
          onChanged();
        })
        .catch((err) => {
          toast({ title: 'Erro ao remover benefício', description: String(err?.message || err), variant: 'destructive' });
        });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Publish Button */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Benefícios (Seção 2)</h3>
          <p className="text-sm text-muted-foreground">Gerencie os cards de benefícios do site</p>
        </div>
        <Button
          variant="outline"
          onClick={async () => {
            try {
              await publishBenefitCards();
              toast({ title: 'Benefícios publicados!', description: 'As alterações foram aplicadas ao site público.' });
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
          <h3 className="text-lg font-medium">Cards de Benefícios</h3>
          <p className="text-sm text-muted-foreground">Edite a seção "Por que escolher o Recanto Moriah?"</p>
        </div>
        <Button onClick={addBenefit} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Adicionar Card
        </Button>
      </div>

      {/* Preview Section */}
      <Card>
        <CardHeader>
          <CardTitle>Preview da Seção</CardTitle>
          <CardDescription>Veja como ficará na landing page</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-gradient-to-br from-background to-muted p-8 rounded-lg">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-primary mb-4">
                Por que escolher o Recanto Moriah?
              </h2>
              <p className="text-muted-foreground max-w-3xl mx-auto">
                Um espaço único que combina a tranquilidade da natureza com toda a estrutura necessária
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.slice(0, 6).map((benefit) => {
                const IconComponent = getIconComponent(benefit.icon);
                return (
                  <div
                    key={benefit.id}
                    className="bg-card p-6 rounded-xl shadow-sm border"
                  >
                    <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
                      <IconComponent className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-card-foreground mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Benefits Editor */}
      <div className="space-y-4">
        {benefits.map((benefit) => (
          <Card key={benefit.id}>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  {(() => {
                    const IconComponent = getIconComponent(benefit.icon);
                    return <IconComponent className="w-4 h-4" />;
                  })()}
                  Card: {benefit.title}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeBenefit(benefit.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Ícone</Label>
                  <select
                    value={benefit.icon}
                    onChange={(e) => updateBenefit(benefit.id, 'icon', e.target.value)}
                    className="w-full p-2 border border-input bg-background rounded-md"
                  >
                    {iconOptions.map((icon) => (
                      <option key={icon.name} value={icon.name}>
                        {icon.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`title-${benefit.id}`}>Título</Label>
                  <Input
                    id={`title-${benefit.id}`}
                    value={benefit.title}
                    onChange={(e) => updateBenefit(benefit.id, 'title', e.target.value)}
                    placeholder="Título do benefício"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`description-${benefit.id}`}>Descrição</Label>
                <Textarea
                  id={`description-${benefit.id}`}
                  value={benefit.description}
                  onChange={(e) => updateBenefit(benefit.id, 'description', e.target.value)}
                  placeholder="Descrição detalhada do benefício"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="font-medium text-green-900 mb-2">💡 Dicas para os cards de benefícios</h4>
        <ul className="text-sm text-green-700 space-y-1">
          <li>• Use títulos curtos e impactantes</li>
          <li>• Descreva benefícios concretos e específicos</li>
          <li>• Escolha ícones que representem bem cada benefício</li>
          <li>• Mantenha um número par de cards para melhor layout</li>
        </ul>
      </div>
    </div>
  );
};

export default AdminBenefitsEditor;