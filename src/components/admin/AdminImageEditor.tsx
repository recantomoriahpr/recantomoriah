import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Trash2, Plus, Image as ImageIcon } from 'lucide-react';

interface AdminImageEditorProps {
  onChanged: () => void;
}

const AdminImageEditor = ({ onChanged }: AdminImageEditorProps) => {
  const [heroImages, setHeroImages] = useState([
    { id: 1, url: '/src/assets/hero-main.jpg', alt: 'Vista principal da chácara' },
    { id: 2, url: '/src/assets/ceremony-space.jpg', alt: 'Espaço para cerimônias' },
    { id: 3, url: '/src/assets/garden-area.jpg', alt: 'Área do jardim' },
  ]);

  const [galleryImages, setGalleryImages] = useState({
    'salao': [
      { id: 1, url: '/src/assets/reception-hall.jpg', alt: 'Salão de festas principal' },
      { id: 2, url: '/src/assets/ceremony-space.jpg', alt: 'Área de cerimônias' },
    ],
    'dormitorios': [
      { id: 3, url: '/src/assets/accommodations.jpg', alt: 'Acomodações confortáveis' },
    ],
    'area-externa': [
      { id: 4, url: '/src/assets/garden-area.jpg', alt: 'Jardins e área externa' },
      { id: 5, url: '/src/assets/outdoor-kitchen.jpg', alt: 'Cozinha ao ar livre' },
    ],
  });

  const handleImageUpload = (category: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Simular upload (substituir pela integração Supabase)
      const newImage = {
        id: Date.now(),
        url: URL.createObjectURL(file),
        alt: file.name.replace(/\.[^/.]+$/, "")
      };

      if (category === 'hero') {
        setHeroImages(prev => [...prev, newImage]);
      } else {
        setGalleryImages(prev => ({
          ...prev,
          [category]: [...(prev[category as keyof typeof prev] || []), newImage]
        }));
      }
      onChanged();
    }
  };

  const handleImageRemove = (category: string, imageId: number) => {
    if (category === 'hero') {
      setHeroImages(prev => prev.filter(img => img.id !== imageId));
    } else {
      setGalleryImages(prev => ({
        ...prev,
        [category]: prev[category as keyof typeof prev]?.filter(img => img.id !== imageId) || []
      }));
    }
    onChanged();
  };

  const ImageGrid = ({ images, category }: { images: any[], category: string }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {images.map((image) => (
        <div key={image.id} className="relative group border rounded-lg overflow-hidden">
          <img 
            src={image.url} 
            alt={image.alt}
            className="w-full h-32 object-cover"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleImageRemove(category, image.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <div className="p-2">
            <Input
              value={image.alt}
              onChange={(e) => {
                // Atualizar alt text
                onChanged();
              }}
              placeholder="Descrição da imagem"
              className="text-xs"
            />
          </div>
        </div>
      ))}
      
      <div 
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center hover:border-primary transition-colors min-h-32 cursor-pointer"
        onDrop={(e) => {
          e.preventDefault();
          const file = e.dataTransfer.files[0];
          if (file && file.type.startsWith('image/')) {
            const mockEvent = {
              target: { files: [file] }
            } as any;
            handleImageUpload(category, mockEvent);
          }
        }}
        onDragOver={(e) => e.preventDefault()}
        onDragEnter={(e) => e.preventDefault()}
        onClick={() => document.getElementById(`upload-${category}`)?.click()}
      >
        <Upload className="h-8 w-8 text-gray-400 mb-2" />
        <div className="text-sm text-gray-600 text-center">
          <p className="font-medium">Clique para selecionar</p>
          <p>ou arraste uma imagem aqui</p>
          <p className="text-xs text-gray-500 mt-1">JPG, PNG até 10MB</p>
        </div>
        <Input
          id={`upload-${category}`}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleImageUpload(category, e)}
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Carrossel do Hero (Topo)</CardTitle>
          <CardDescription>Gerencie as imagens principais que aparecem no topo do site</CardDescription>
        </CardHeader>
        <CardContent>
          <ImageGrid images={heroImages} category="hero" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Galeria de Fotos por Categoria</CardTitle>
          <CardDescription>Organize as fotos em álbuns temáticos</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="salao" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="salao">Salão</TabsTrigger>
              <TabsTrigger value="dormitorios">Dormitórios</TabsTrigger>
              <TabsTrigger value="area-externa">Área Externa</TabsTrigger>
            </TabsList>

            <TabsContent value="salao" className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-medium">Salão de Festas</h4>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Categoria
                </Button>
              </div>
              <ImageGrid images={galleryImages.salao} category="salao" />
            </TabsContent>

            <TabsContent value="dormitorios" className="space-y-4">
              <h4 className="text-lg font-medium">Acomodações</h4>
              <ImageGrid images={galleryImages.dormitorios} category="dormitorios" />
            </TabsContent>

            <TabsContent value="area-externa" className="space-y-4">
              <h4 className="text-lg font-medium">Espaços Externos</h4>
              <ImageGrid images={galleryImages['area-externa']} category="area-externa" />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="font-medium text-green-900 mb-2 flex items-center gap-2">
          <ImageIcon className="h-4 w-4" />
          Dicas para melhores fotos
        </h4>
        <ul className="text-sm text-green-700 space-y-1">
          <li>• Use imagens em alta resolução (mínimo 1200px de largura)</li>
          <li>• Formato recomendado: JPG ou PNG</li>
          <li>• Adicione descrições claras para acessibilidade</li>
          <li>• Organize as fotos por categorias para facilitar navegação</li>
        </ul>
      </div>
    </div>
  );
};

export default AdminImageEditor;