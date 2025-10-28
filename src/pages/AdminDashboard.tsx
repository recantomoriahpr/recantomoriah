import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { LogOut, Save, Eye, Palette, Image, MessageSquare, Info, Mail, Phone, HelpCircle, Scroll } from 'lucide-react';
import { publishAll } from '@/lib/adminApi';
import AdminBrandEditor from '@/components/admin/sections/AdminBrandEditor';
import AdminHeroEditor from '@/components/admin/sections/AdminHeroEditor';
import AdminBenefitsEditor from '@/components/admin/sections/AdminBenefitsEditor';
import AdminGalleryEditor from '@/components/admin/sections/AdminGalleryEditor';
import AdminTestimonialsEditor from '@/components/admin/AdminTestimonialsEditor';
import AdminPracticalInfoEditor from '@/components/admin/sections/AdminPracticalInfoEditor';
import AdminFooterEditor from '@/components/admin/sections/AdminFooterEditor';
import AdminContactsManager from '@/components/admin/sections/AdminContactsManager';
import AdminHelp from '@/components/admin/AdminHelp';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    // Verificar se está logado
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    if (!isLoggedIn) {
      navigate('/admin');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    navigate('/admin');
    toast({
      title: "Logout realizado",
      description: "Até logo!",
    });
  };

  const handleSave = async () => {
    // Toast de loading
    toast({
      title: "Publicando alterações...",
      description: "Aguarde enquanto salvamos suas mudanças",
    });

    try {
      await publishAll();
      setHasChanges(false);
      toast({
        title: "✅ Alterações publicadas!",
        description: "Todas as mudanças foram aplicadas ao site público com sucesso!",
      });
    } catch (err: any) {
      toast({
        title: "Erro ao publicar",
        description: String(err?.message || err),
        variant: "destructive",
      });
    }
  };

  const handlePreview = () => {
    window.open('/', '_blank');
  };

  return (
    <div className="min-h-screen bg-warm-beige-light">
      {/* Header */}
      <header className="bg-pure-white border-b border-warm-beige-dark shadow-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-nature-green">Recanto Moriah - Admin</h1>
              {hasChanges && (
                <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full animate-pulse">
                  ⚠️ Alterações não salvas
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handlePreview}
                className="flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                Visualizar Site
              </Button>
              
              <Button 
                onClick={handleSave}
                disabled={!hasChanges}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                Publicar Alterações
              </Button>
              
              <Button 
                variant="outline"
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-600 hover:text-red-700"
              >
                <LogOut className="h-4 w-4" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-full mx-auto px-4 py-8">
        <div className="h-[calc(100vh-120px)]">
          {/* Editor Area - Full Width */}
          <div className="flex-1 flex flex-col min-h-0">
            <Tabs defaultValue="brand" className="flex-1 flex flex-col space-y-6 min-h-0">
              <TabsList className="flex-shrink-0 grid w-full grid-cols-4 lg:grid-cols-8 bg-pure-white text-xs overflow-x-auto scrollbar-hide">
                <TabsTrigger value="brand" className="flex items-center gap-1 whitespace-nowrap">
                  <Palette className="h-3 w-3" />
                  Identidade
                </TabsTrigger>
                <TabsTrigger value="hero" className="flex items-center gap-1 whitespace-nowrap">
                  <Image className="h-3 w-3" />
                  Carrossel
                </TabsTrigger>
                <TabsTrigger value="benefits" className="flex items-center gap-1 whitespace-nowrap">
                  <MessageSquare className="h-3 w-3" />
                  Cards
                </TabsTrigger>
                <TabsTrigger value="gallery" className="flex items-center gap-1 whitespace-nowrap">
                  <Image className="h-3 w-3" />
                  Galeria
                </TabsTrigger>
                <TabsTrigger value="testimonials" className="flex items-center gap-1 whitespace-nowrap">
                  <MessageSquare className="h-3 w-3" />
                  Depoimentos
                </TabsTrigger>
                <TabsTrigger value="info" className="flex items-center gap-1 whitespace-nowrap">
                  <Info className="h-3 w-3" />
                  Localização
                </TabsTrigger>
                <TabsTrigger value="footer" className="flex items-center gap-1 whitespace-nowrap">
                  <Scroll className="h-3 w-3" />
                  Rodapé
                </TabsTrigger>
                <TabsTrigger value="contacts" className="flex items-center gap-1 whitespace-nowrap">
                  <Phone className="h-3 w-3" />
                  Contatos
                </TabsTrigger>
              </TabsList>

              <div className="flex-1 overflow-y-auto min-h-0">
                <TabsContent value="brand" className="mt-0 h-full">
                  <AdminBrandEditor onChanged={() => setHasChanges(true)} />
                </TabsContent>

                <TabsContent value="hero" className="mt-0 h-full">
                  <AdminHeroEditor onChanged={() => setHasChanges(true)} />
                </TabsContent>

                <TabsContent value="benefits" className="mt-0 h-full">
                  <AdminBenefitsEditor onChanged={() => setHasChanges(true)} />
                </TabsContent>

                <TabsContent value="gallery" className="mt-0 h-full">
                  <AdminGalleryEditor onChanged={() => setHasChanges(true)} />
                </TabsContent>

                <TabsContent value="testimonials" className="mt-0 h-full">
                  <AdminTestimonialsEditor onChanged={() => setHasChanges(true)} />
                </TabsContent>

                <TabsContent value="info" className="mt-0 h-full">
                  <AdminPracticalInfoEditor onChanged={() => setHasChanges(true)} />
                </TabsContent>

                <TabsContent value="footer" className="mt-0 h-full">
                  <AdminFooterEditor onChanged={() => setHasChanges(true)} />
                </TabsContent>

                <TabsContent value="contacts" className="mt-0 h-full">
                  <AdminContactsManager onChanged={() => setHasChanges(true)} />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;