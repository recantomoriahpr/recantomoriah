import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Upload, Trash2, Plus, Eye, ChevronLeft, ChevronRight, ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { API_BASE } from '@/lib/api';
import {
  listHeroSlides,
  createHeroSlide,
  updateHeroSlide,
  deleteHeroSlide,
  publishHeroSlides,
  type HeroSlideApi,
} from '@/lib/adminApi';

interface AdminHeroEditorProps {
  onChanged: () => void;
}

interface HeroSlide {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  order: number;
}

const AdminHeroEditor = ({ onChanged }: AdminHeroEditorProps) => {
  const { toast } = useToast();
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [previewSlide, setPreviewSlide] = useState(0);

  const mapFromApi = (s: HeroSlideApi): HeroSlide => ({
    id: s.id,
    image: s.image_url ?? '',
    title: s.title ?? '',
    subtitle: s.subtitle ?? '',
    buttonText: s.cta_text ?? 'Solicitar Orçamento',
    buttonLink: s.cta_link ?? '#contato',
    order: s.order ?? 0,
  });

  const loadSlides = async () => {
    try {
      const result = await listHeroSlides();
      const items: HeroSlideApi[] = (result?.data ?? result) as HeroSlideApi[];
      const mapped = (items || []).map(mapFromApi).sort((a, b) => a.order - b.order);
      setSlides(mapped);
    } catch (err: any) {
      toast({ title: 'Erro ao carregar slides', description: String(err?.message || err), variant: 'destructive' });
    }
  };

  useEffect(() => {
    loadSlides();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addSlide = () => {
    const order = slides.length ? Math.max(...slides.map(s => s.order)) + 1 : 0;
    // Cria no backend e insere no estado
    createHeroSlide({
      image_url: `https://picsum.photos/1200/600?random=${Date.now()}`,
      title: 'Novo Slide',
      subtitle: 'Descrição do slide',
      cta_text: 'Solicitar Orçamento',
      cta_link: '#contato',
      order,
    })
      .then((res) => {
        const created: HeroSlideApi = res?.data ?? res;
        setSlides(prev => [...prev, mapFromApi(created)].sort((a, b) => a.order - b.order));
        onChanged();
      })
      .catch((err) => {
        toast({ title: 'Erro ao criar slide', description: String(err?.message || err), variant: 'destructive' });
      });
  };

  const updateSlide = (id: string, field: keyof HeroSlide, value: string) => {
    setSlides(prev => prev.map(slide => (slide.id === id ? { ...slide, [field]: value } : slide)));

    // Map field to API payload
    const payload: any = {};
    if (field === 'image') payload.image_url = value;
    if (field === 'title') payload.title = value;
    if (field === 'subtitle') payload.subtitle = value;
    if (field === 'buttonText') payload.cta_text = value;
    if (field === 'buttonLink') payload.cta_link = value;

    // Persist update
    if (Object.keys(payload).length) {
      updateHeroSlide(id, payload).catch((err) => {
        toast({ title: 'Erro ao atualizar slide', description: String(err?.message || err), variant: 'destructive' });
      });
    }
    onChanged();
  };

  const removeSlide = (id: string) => {
    if (slides.length > 1) {
      deleteHeroSlide(id)
        .then(() => {
          setSlides(prev => prev.filter(slide => slide.id !== id));
          if (previewSlide >= slides.length - 1) setPreviewSlide(0);
          onChanged();
        })
        .catch((err) => {
          toast({ title: 'Erro ao remover slide', description: String(err?.message || err), variant: 'destructive' });
        });
    }
  };

  const handleImageUpload = async (slideId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const form = new FormData();
        form.append('file', file);
        const res = await fetch(`${API_BASE}/admin/upload`, { method: 'POST', body: form });
        const data = await res.json();
        if (!res.ok || data?.error) throw new Error(data?.error || 'Upload failed');
        const imageUrl: string = data.url;
        updateSlide(slideId, 'image', imageUrl);
        toast({ title: 'Imagem enviada', description: 'Upload concluído com sucesso.' });
      } catch (err: any) {
        toast({ title: 'Erro no upload', description: String(err?.message || err), variant: 'destructive' });
      }
    }
  };

  const nextPreview = () => {
    setPreviewSlide((prev) => (prev + 1) % slides.length);
  };

  const prevPreview = () => {
    setPreviewSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Carrossel do Topo (Hero)</h3>
          <p className="text-sm text-muted-foreground">Gerencie os slides principais que aparecem no topo do site</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={addSlide} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Adicionar Slide
          </Button>
          <Button
            variant="outline"
            onClick={async () => {
              try {
                await publishHeroSlides();
                toast({ title: 'Slides publicados!', description: 'As alterações foram aplicadas ao site público.' });
              } catch (err: any) {
                toast({ title: 'Erro ao publicar', description: String(err?.message || err), variant: 'destructive' });
              }
            }}
          >
            Publicar
          </Button>
        </div>
      </div>

      {/* Preview Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Preview do Carrossel
          </CardTitle>
          <CardDescription>Visualize como ficará na landing page</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative h-64 bg-gray-200 rounded-lg overflow-hidden">
            {slides[previewSlide]?.image ? (
              <img 
                src={slides[previewSlide].image} 
                alt="Preview" 
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <ImageIcon className="w-16 h-16 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Nenhuma imagem carregada</p>
                </div>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
            
            <div className="relative h-full flex items-center justify-center text-white text-center p-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  {slides[previewSlide]?.title || 'Título do Slide'}
                </h1>
                <p className="text-lg mb-4 opacity-90">
                  {slides[previewSlide]?.subtitle || 'Subtítulo do slide'}
                </p>
                <button className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                  {slides[previewSlide]?.buttonText || 'Botão'}
                </button>
              </div>
            </div>

            {slides.length > 1 && (
              <>
                <button
                  onClick={prevPreview}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={nextPreview}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
                
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                  {slides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setPreviewSlide(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === previewSlide ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Slides Editor */}
      <div className="space-y-4">
        {slides.map((slide, index) => (
          <Card key={slide.id}>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Slide #{index + 1}</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSlide(slide.id)}
                  className="text-red-600 hover:text-red-700"
                  disabled={slides.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Image Upload */}
              <div className="space-y-2">
                <Label>Imagem de Fundo</Label>
                <div className="flex items-center gap-4">
                  <div 
                    className="w-32 h-20 bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-muted-foreground/25 cursor-pointer hover:border-primary/50 transition-colors overflow-hidden"
                    onClick={() => document.getElementById(`image-${slide.id}`)?.click()}
                  >
                    {slide.image ? (
                      <img src={slide.image} alt="Slide preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center text-muted-foreground">
                        <Upload className="h-6 w-6 mx-auto mb-1" />
                        <p className="text-xs">Clique aqui</p>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <Input
                      id={`image-${slide.id}`}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageUpload(slide.id, e)}
                    />
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById(`image-${slide.id}`)?.click()}
                      className="w-full"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Selecionar Imagem
                    </Button>
                  </div>
                </div>
              </div>

              {/* Text Content */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`title-${slide.id}`}>Título</Label>
                  <Input
                    id={`title-${slide.id}`}
                    value={slide.title}
                    onChange={(e) => updateSlide(slide.id, 'title', e.target.value)}
                    placeholder="Título do slide"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`buttonText-${slide.id}`}>Texto do Botão</Label>
                  <Input
                    id={`buttonText-${slide.id}`}
                    value={slide.buttonText}
                    onChange={(e) => updateSlide(slide.id, 'buttonText', e.target.value)}
                    placeholder="Solicitar Orçamento"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`subtitle-${slide.id}`}>Subtítulo</Label>
                <Textarea
                  id={`subtitle-${slide.id}`}
                  value={slide.subtitle}
                  onChange={(e) => updateSlide(slide.id, 'subtitle', e.target.value)}
                  placeholder="Descrição do slide"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`buttonLink-${slide.id}`}>Link do Botão</Label>
                <Input
                  id={`buttonLink-${slide.id}`}
                  value={slide.buttonLink}
                  onChange={(e) => updateSlide(slide.id, 'buttonLink', e.target.value)}
                  placeholder="#contato ou https://exemplo.com"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">💡 Dicas para o carrossel</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Use imagens em alta resolução (mínimo 1920x1080px)</li>
          <li>• Mantenha títulos concisos e impactantes</li>
          <li>• O carrossel muda automaticamente a cada 5 segundos</li>
          <li>• Links internos começam com # (ex: #contato)</li>
        </ul>
      </div>
    </div>
  );
};

export default AdminHeroEditor;