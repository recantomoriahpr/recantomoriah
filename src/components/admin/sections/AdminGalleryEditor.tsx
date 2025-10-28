import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Trash2, Plus, Eye, FolderPlus, Edit2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { API_BASE } from '@/lib/api';
import {
  listGalleryAlbums,
  createGalleryAlbum,
  updateGalleryAlbum,
  deleteGalleryAlbum,
  publishGalleryAlbums,
  listGalleryImages,
  createGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
  publishGalleryImages,
  type GalleryAlbumApi,
  type GalleryImageApi,
} from '@/lib/adminApi';

interface AdminGalleryEditorProps {
  onChanged: () => void;
}

interface GalleryImage {
  id: string;
  url: string;
  alt: string;
  caption: string;
  order: number;
  externalLink?: string;
}

interface GalleryCategory {
  id: string;
  title: string;
  description: string;
  order: number;
  images: GalleryImage[];
}

const AdminGalleryEditor = ({ onChanged }: AdminGalleryEditorProps) => {
  const { toast } = useToast();
  const [categories, setCategories] = useState<GalleryCategory[]>([]);

  useEffect(() => {
    const loadGallery = async () => {
      try {
        const albumsResult = await listGalleryAlbums();
        const albums: GalleryAlbumApi[] = (albumsResult?.data ?? albumsResult) as GalleryAlbumApi[];
        
        const imagesResult = await listGalleryImages();
        const allImages: GalleryImageApi[] = (imagesResult?.data ?? imagesResult) as GalleryImageApi[];
        
        const mapped = (albums || []).map((album) => ({
          id: album.id,
          title: album.title ?? '',
          description: album.description ?? '',
          order: album.order ?? 0,
          images: (allImages || [])
            .filter(img => img.album_id === album.id)
            .map(img => ({
              id: img.id,
              url: img.url ?? '',
              alt: img.alt ?? '',
              caption: img.caption ?? '',
              order: img.order ?? 0,
              externalLink: img.external_link ?? '',
            }))
            .sort((a, b) => a.order - b.order),
        })).sort((a, b) => a.order - b.order);
        
        setCategories(mapped);
        if (mapped.length > 0) setSelectedCategory(mapped[0].id);
      } catch (err: any) {
        toast({ title: 'Erro ao carregar galeria', description: String(err?.message || err), variant: 'destructive' });
      }
    };
    loadGallery();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [selectedCategory, setSelectedCategory] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState<string | null>(null);

  const addCategory = () => {
    if (newCategoryName.trim()) {
      const order = categories.length ? Math.max(...categories.map(c => c.order)) + 1 : 0;
      const slug = newCategoryName.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      createGalleryAlbum({
        title: newCategoryName.trim(),
        slug: slug || `album-${Date.now()}`,
        order,
      })
        .then((res) => {
          const created: GalleryAlbumApi = res?.data ?? res;
          const newCategory: GalleryCategory = {
            id: created.id,
            title: created.title ?? '',
            description: created.description ?? '',
            order: created.order ?? 0,
            images: [],
          };
          setCategories(prev => [...prev, newCategory].sort((a, b) => a.order - b.order));
          setNewCategoryName('');
          setSelectedCategory(newCategory.id);
          onChanged();
        })
        .catch((err) => {
          toast({ title: 'Erro ao criar álbum', description: String(err?.message || err), variant: 'destructive' });
        });
    }
  };

  const updateCategoryTitle = (categoryId: string, newTitle: string) => {
    setCategories(prev => prev.map(cat => (cat.id === categoryId ? { ...cat, title: newTitle } : cat)));
    updateGalleryAlbum(categoryId, { title: newTitle }).catch((err) => {
      toast({ title: 'Erro ao atualizar álbum', description: String(err?.message || err), variant: 'destructive' });
    });
    onChanged();
  };

  const removeCategory = (categoryId: string) => {
    if (categories.length > 1) {
      deleteGalleryAlbum(categoryId)
        .then(() => {
          setCategories(prev => {
            const filtered = prev.filter(cat => cat.id !== categoryId);
            if (selectedCategory === categoryId && filtered.length > 0) {
              setSelectedCategory(filtered[0].id);
            }
            return filtered;
          });
          onChanged();
        })
        .catch((err) => {
          toast({ title: 'Erro ao remover álbum', description: String(err?.message || err), variant: 'destructive' });
        });
    }
  };

  const addImage = async (categoryId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    try {
      const form = new FormData();
      
      // Adicionar todos os arquivos ao FormData
      for (let i = 0; i < files.length; i++) {
        form.append('files', files[i]);
      }

      // Upload múltiplo
      toast({ title: 'Fazendo upload...', description: `Enviando ${files.length} imagem(ns)...` });
      
      const res = await fetch(`${API_BASE}/admin/upload-multiple`, { method: 'POST', body: form });
      const data = await res.json();
      
      if (!res.ok || data?.error) throw new Error(data?.error || 'Upload failed');

      const category = categories.find(c => c.id === categoryId);
      let currentOrder = category ? category.images.length : 0;
      const newImages: GalleryImage[] = [];

      // Criar registro no banco para cada imagem bem-sucedida
      for (const result of data.results || []) {
        if (result.success) {
          const filename = result.filename.replace(/\.[^/.]+$/, '');
          
          const created = await createGalleryImage({
            album_id: categoryId,
            url: result.url,
            alt: filename,
            caption: filename,
            order: currentOrder++,
          });

          const createdData: GalleryImageApi = created?.data ?? created;
          newImages.push({
            id: createdData.id,
            url: createdData.url ?? '',
            alt: createdData.alt ?? '',
            caption: createdData.caption ?? '',
            order: createdData.order ?? 0,
          });
        }
      }

      if (newImages.length > 0) {
        setCategories(prev => prev.map(cat => (
          cat.id === categoryId 
            ? { ...cat, images: [...cat.images, ...newImages].sort((a, b) => a.order - b.order) } 
            : cat
        )));

        toast({ 
          title: 'Upload concluído!', 
          description: `${newImages.length} de ${files.length} imagem(ns) adicionada(s) com sucesso.` 
        });
        onChanged();
      } else {
        throw new Error('Nenhuma imagem foi enviada com sucesso');
      }

      // Limpar input
      event.target.value = '';
    } catch (err: any) {
      toast({ title: 'Erro no upload', description: String(err?.message || err), variant: 'destructive' });
    }
  };

  const updateImage = (categoryId: string, imageId: string, field: keyof GalleryImage, value: string) => {
    setCategories(prev => prev.map(cat => (cat.id === categoryId ? { ...cat, images: cat.images.map(img => (img.id === imageId ? { ...img, [field]: value } : img)) } : cat)));
    
    const payload: any = {};
    if (field === 'caption') payload.caption = value;
    if (field === 'alt') payload.alt = value;
    if (field === 'externalLink') payload.external_link = value;
    
    if (Object.keys(payload).length) {
      updateGalleryImage(imageId, payload).catch((err) => {
        toast({ title: 'Erro ao atualizar imagem', description: String(err?.message || err), variant: 'destructive' });
      });
    }
    onChanged();
  };

  // Suporte a vídeos removido

  const removeImage = (categoryId: string, imageId: string) => {
    deleteGalleryImage(imageId)
      .then(() => {
        setCategories(prev => prev.map(cat => (cat.id === categoryId ? { ...cat, images: cat.images.filter(img => img.id !== imageId) } : cat)));
        onChanged();
      })
      .catch((err) => {
        toast({ title: 'Erro ao remover imagem', description: String(err?.message || err), variant: 'destructive' });
      });
  };

  const getCurrentCategory = () => {
    return categories.find(cat => cat.id === selectedCategory) || categories[0];
  };

  return (
    <div className="space-y-6">
      {/* Header with Publish Button */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Galeria (Seção 3)</h3>
          <p className="text-sm text-muted-foreground">Gerencie álbuns e imagens da galeria</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={async () => {
              try {
                await publishGalleryAlbums();
                await publishGalleryImages();
                toast({ title: 'Galeria publicada!', description: 'As alterações foram aplicadas ao site público.' });
              } catch (err: any) {
                toast({ title: 'Erro ao publicar', description: String(err?.message || err), variant: 'destructive' });
              }
            }}
          >
            Publicar
          </Button>
        </div>
      </div>
      <div>
        <h3 className="text-lg font-medium">Galeria de Fotos</h3>
        <p className="text-sm text-muted-foreground">Organize as fotos em álbuns temáticos</p>
      </div>

      {/* Category Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderPlus className="h-5 w-5" />
            Gerenciar Categorias
          </CardTitle>
          <CardDescription>Crie e organize as categorias de fotos</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Nome da nova categoria"
              onKeyPress={(e) => e.key === 'Enter' && addCategory()}
            />
            <Button onClick={addCategory} disabled={!newCategoryName.trim()}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center gap-2 p-2 border rounded">
                {editingCategory === category.id ? (
                  <Input
                    value={category.title}
                    onChange={(e) => updateCategoryTitle(category.id, e.target.value)}
                    onBlur={() => setEditingCategory(null)}
                    onKeyPress={(e) => e.key === 'Enter' && setEditingCategory(null)}
                    className="text-sm"
                    autoFocus
                  />
                ) : (
                  <>
                    <span className="flex-1 text-sm">{category.title}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingCategory(category.id)}
                    >
                      <Edit2 className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCategory(category.id)}
                      disabled={categories.length === 1}
                      className="text-red-600"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Gallery Editor */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Editor de Fotos por Categoria
          </CardTitle>
        </CardHeader>
        <CardContent>
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
              <div className="flex overflow-x-auto scrollbar-hide pb-2 mb-4">
                <TabsList className="flex w-max bg-card">
                  {categories.map((category) => (
                    <TabsTrigger 
                      key={category.id} 
                      value={category.id}
                      className="whitespace-nowrap flex-shrink-0"
                    >
                      {category.title}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

            {categories.map((category) => (
              <TabsContent key={category.id} value={category.id} className="space-y-4 mt-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-medium">{category.title}</h4>
                  <span className="text-sm text-muted-foreground">
                    {category.images.length} foto(s)
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {category.images.map((image) => (
                    <div key={image.id} className="border rounded-lg overflow-hidden">
                      <div className="relative group">
                        <img 
                          src={image.url} 
                          alt={image.alt}
                          className="w-full h-32 object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => removeImage(category.id, image.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="p-3 space-y-2">
                        <Input
                          value={image.caption}
                          onChange={(e) => updateImage(category.id, image.id, 'caption', e.target.value)}
                          placeholder="Legenda da foto"
                          className="text-xs"
                        />
                        <Input
                          value={image.alt}
                          onChange={(e) => updateImage(category.id, image.id, 'alt', e.target.value)}
                          placeholder="Texto alternativo"
                          className="text-xs"
                        />
                        <Input
                          value={image.externalLink || ''}
                          onChange={(e) => updateImage(category.id, image.id, 'externalLink', e.target.value)}
                          placeholder="Link externo (Drive, YouTube, etc)"
                          className="text-xs"
                        />
                      </div>
                    </div>
                  ))}
                  
                  {/* Add Image Button */}
                  <div 
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center hover:border-primary transition-colors min-h-32 cursor-pointer"
                    onClick={() => document.getElementById(`upload-${category.id}`)?.click()}
                  >
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <div className="text-sm text-gray-600 text-center">
                      <p className="font-medium">Adicionar Fotos</p>
                      <p className="text-xs text-gray-500">Selecione múltiplas fotos (JPG, PNG até 10MB cada)</p>
                    </div>
                    <Input
                      id={`upload-${category.id}`}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => addImage(category.id, e)}
                    />
                  </div>

                  {/* Bloco de vídeo removido */}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Preview da Galeria</CardTitle>
          <CardDescription>Veja como ficará na landing page</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-background p-6 rounded-lg border">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-primary mb-4">
                Conheça Nossos Espaços
              </h2>
              <p className="text-muted-foreground max-w-3xl mx-auto">
                Explore cada detalhe do Recanto Moriah através de nossa galeria completa
              </p>
            </div>

            <div className="flex justify-center mb-6">
              <div className="flex overflow-x-auto scrollbar-hide space-x-2 bg-card p-1 rounded-lg shadow-sm max-w-full">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className="whitespace-nowrap flex-shrink-0"
                  >
                    {category.title}
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getCurrentCategory()?.images.slice(0, 6).map((image) => (
                <div key={image.id} className="relative group cursor-pointer overflow-hidden rounded-lg border">
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="text-white text-center">
                      <p className="font-semibold text-sm">{image.caption}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">💡 Dicas para a galeria</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Use imagens em alta resolução (mínimo 800x600px)</li>
          <li>• Organize as fotos em categorias lógicas</li>
          <li>• Adicione legendas descritivas para cada imagem</li>
          <li>• Mantenha um número equilibrado de fotos por categoria</li>
        </ul>
      </div>
    </div>
  );
};

export default AdminGalleryEditor;