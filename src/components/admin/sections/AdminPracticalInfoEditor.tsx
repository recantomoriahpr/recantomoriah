import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { MapPin, Users, Calendar, Clock, Trash2, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  listInfoCards,
  createInfoCard,
  updateInfoCard as updateInfoCardApi,
  deleteInfoCard as deleteInfoCardApi,
  publishInfoCards,
  listSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  publishSchedules,
  type InfoCardApi,
  type ScheduleApi,
} from '@/lib/adminApi';

interface AdminPracticalInfoEditorProps {
  onChanged: () => void;
}

interface InfoCard {
  id: string;
  icon: string;
  title: string;
  content: string;
  order: number;
}

const AdminPracticalInfoEditor = ({ onChanged }: AdminPracticalInfoEditorProps) => {
  const { toast } = useToast();
  const [infoCards, setInfoCards] = useState<InfoCard[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await listInfoCards();
        const items: InfoCardApi[] = (result?.data ?? result) as InfoCardApi[];
        const mapped = (items || []).map((c) => ({
          id: c.id,
          icon: c.icon_key ?? 'MapPin',
          title: c.title ?? '',
          content: c.description ?? '',
          order: c.order ?? 0,
        })).sort((a, b) => a.order - b.order);
        setInfoCards(mapped);
      } catch (err: any) {
        toast({ title: 'Erro ao carregar informações', description: String(err?.message || err), variant: 'destructive' });
      }
    };
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [eventTypes] = useState([
    {
      emoji: '💒',
      title: 'Casamentos',
      description: 'Cerimônias inesquecíveis'
    },
    {
      emoji: '🙏',
      title: 'Retiros',
      description: 'Espirituais e corporativos'
    },
    {
      emoji: '🎉',
      title: 'Aniversários',
      description: 'Celebrações especiais'
    },
    {
      emoji: '🤝',
      title: 'Corporativos',
      description: 'Confraternizações'
    }
  ]);


  const iconOptions = [
    { name: 'MapPin', label: 'Localização', component: MapPin },
    { name: 'Users', label: 'Usuários', component: Users },
    { name: 'Calendar', label: 'Calendário', component: Calendar },
    { name: 'Clock', label: 'Relógio', component: Clock }
  ];

  const getIconComponent = (iconName: string) => {
    const icon = iconOptions.find(opt => opt.name === iconName);
    return icon ? icon.component : MapPin;
  };



  const addInfoCard = () => {
    const order = infoCards.length ? Math.max(...infoCards.map(c => c.order)) + 1 : 0;
    createInfoCard({
      icon_key: 'MapPin',
      title: 'Nova Informação',
      description: 'Descrição da informação',
      order,
    })
      .then((res) => {
        const created: InfoCardApi = res?.data ?? res;
        setInfoCards(prev => [...prev, {
          id: created.id,
          icon: created.icon_key ?? 'MapPin',
          title: created.title ?? '',
          content: created.description ?? '',
          order: created.order ?? 0,
        }].sort((a, b) => a.order - b.order));
        onChanged();
      })
      .catch((err) => {
        toast({ title: 'Erro ao criar card', description: String(err?.message || err), variant: 'destructive' });
      });
  };

  const updateInfoCard = (id: string, field: keyof InfoCard, value: string) => {
    setInfoCards(prev => 
      prev.map(card => 
        card.id === id ? { ...card, [field]: value } : card
      )
    );

    const payload: any = {};
    if (field === 'icon') payload.icon_key = value;
    if (field === 'title') payload.title = value;
    if (field === 'content') payload.description = value;

    if (Object.keys(payload).length) {
      updateInfoCardApi(id, payload).catch((err) => {
        toast({ title: 'Erro ao atualizar card', description: String(err?.message || err), variant: 'destructive' });
      });
    }
    onChanged();
  };

  const removeInfoCard = (id: string) => {
    if (infoCards.length > 1) {
      deleteInfoCardApi(id)
        .then(() => {
          setInfoCards(prev => prev.filter(card => card.id !== id));
          onChanged();
        })
        .catch((err) => {
          toast({ title: 'Erro ao remover card', description: String(err?.message || err), variant: 'destructive' });
        });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Publish Button */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Informações Práticas (Seção 5)</h3>
          <p className="text-sm text-muted-foreground">Configure informações importantes sobre o local e serviços</p>
        </div>
        <Button
          variant="outline"
          onClick={async () => {
            try {
              await publishInfoCards();
              toast({ title: 'Informações publicadas!', description: 'As alterações foram aplicadas ao site público.' });
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
          <h4 className="font-medium">Cards de Informação</h4>
          <p className="text-sm text-muted-foreground">Adicione e edite os cards informativos</p>
        </div>
        <Button onClick={addInfoCard} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Adicionar Card
        </Button>
      </div>


      {/* Info Cards Editor */}
      <div className="space-y-4">
        {infoCards.map((card) => (
          <Card key={card.id}>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  {(() => {
                    const IconComponent = getIconComponent(card.icon);
                    return <IconComponent className="w-4 h-4" />;
                  })()}
                  {card.title}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeInfoCard(card.id)}
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
                    value={card.icon}
                    onChange={(e) => updateInfoCard(card.id, 'icon', e.target.value)}
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
                  <Label htmlFor={`title-${card.id}`}>Título</Label>
                  <Input
                    id={`title-${card.id}`}
                    value={card.title}
                    onChange={(e) => updateInfoCard(card.id, 'title', e.target.value)}
                    placeholder="Título da informação"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`content-${card.id}`}>Descrição</Label>
                <Input
                  id={`content-${card.id}`}
                  value={card.content}
                  onChange={(e) => updateInfoCard(card.id, 'content', e.target.value)}
                  placeholder="Descrição do card"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>


      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Preview da Seção</CardTitle>
          <CardDescription>Veja como ficará na landing page</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-background p-6 rounded-lg">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-primary mb-4">
                Informações Práticas
              </h2>
              <p className="text-muted-foreground max-w-3xl mx-auto">
                Tudo que você precisa saber para planejar seu evento conosco
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 items-start">
              {/* Info Cards */}
              <div className="grid sm:grid-cols-2 gap-4">
                {infoCards.slice(0, 4).map((card) => {
                  const IconComponent = getIconComponent(card.icon);
                  return (
                    <div
                      key={card.id}
                      className="bg-card p-4 rounded-xl shadow-sm border"
                    >
                      <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full mb-3">
                        <IconComponent className="w-5 h-5 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold text-card-foreground mb-2">
                        {card.title}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {card.content}
                      </p>
                    </div>
                  );
                })}
              </div>

            </div>

            {/* Event Types */}
            <div className="mt-8 bg-gradient-to-r from-primary to-primary/80 rounded-xl p-6 text-primary-foreground text-center">
              <h3 className="text-xl font-bold mb-4">
                Eventos que Realizamos
              </h3>
              <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                {eventTypes.map((type, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl mb-2">{type.emoji}</div>
                    <h4 className="font-semibold text-sm">{type.title}</h4>
                    <p className="text-xs opacity-90">{type.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">💡 Dicas para informações práticas</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Use informações precisas e atualizadas</li>
          <li>• Mantenha os cards organizados por importância</li>
          <li>• Coordenadas GPS precisas melhoram a experiência do usuário</li>
          <li>• Inclua todas as informações que clientes costumam perguntar</li>
        </ul>
      </div>
    </div>
  );
};

export default AdminPracticalInfoEditor;