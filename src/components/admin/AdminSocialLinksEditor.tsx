import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Instagram, Facebook, MessageCircle, Phone, Mail, ExternalLink } from 'lucide-react';

interface AdminSocialLinksEditorProps {
  onChanged: () => void;
}

const AdminSocialLinksEditor = ({ onChanged }: AdminSocialLinksEditorProps) => {
  const [socialLinks, setSocialLinks] = useState({
    instagram: 'https://instagram.com/recantomariah',
    facebook: 'https://facebook.com/recantomariah',
    whatsapp: '5511999999999',
    phone: '(11) 99999-9999',
    email: 'contato@recantomariah.com',
  });

  const [buttonTexts, setButtonTexts] = useState({
    heroButton: 'Solicitar Orçamento',
    contactFormButton: 'Solicitar Orçamento',
    whatsappButton: 'Enviar via WhatsApp',
    galleryButton: 'Ver Galeria Completa',
  });

  const handleSocialLinkChange = (key: string, value: string) => {
    setSocialLinks(prev => ({ ...prev, [key]: value }));
    onChanged();
  };

  const handleButtonTextChange = (key: string, value: string) => {
    setButtonTexts(prev => ({ ...prev, [key]: value }));
    onChanged();
  };

  const testSocialLink = (platform: string, url: string) => {
    let testUrl = '';
    switch (platform) {
      case 'whatsapp':
        testUrl = `https://wa.me/${url}`;
        break;
      case 'phone':
        testUrl = `tel:${url}`;
        break;
      case 'email':
        testUrl = `mailto:${url}`;
        break;
      default:
        testUrl = url;
    }
    window.open(testUrl, '_blank');
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="social" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="social">Redes Sociais</TabsTrigger>
          <TabsTrigger value="buttons">Textos dos Botões</TabsTrigger>
        </TabsList>

        <TabsContent value="social" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Instagram className="h-5 w-5" />
                Links das Redes Sociais
              </CardTitle>
              <CardDescription>
                Configure os links que aparecem no rodapé e nas seções de contato
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="instagram" className="flex items-center gap-2">
                      <Instagram className="h-4 w-4" />
                      Instagram
                    </Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        id="instagram"
                        value={socialLinks.instagram}
                        onChange={(e) => handleSocialLinkChange('instagram', e.target.value)}
                        placeholder="https://instagram.com/recantomariah"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => testSocialLink('instagram', socialLinks.instagram)}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="facebook" className="flex items-center gap-2">
                      <Facebook className="h-4 w-4" />
                      Facebook
                    </Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        id="facebook"
                        value={socialLinks.facebook}
                        onChange={(e) => handleSocialLinkChange('facebook', e.target.value)}
                        placeholder="https://facebook.com/recantomariah"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => testSocialLink('facebook', socialLinks.facebook)}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="whatsapp" className="flex items-center gap-2">
                      <MessageCircle className="h-4 w-4" />
                      WhatsApp (com código do país)
                    </Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        id="whatsapp"
                        value={socialLinks.whatsapp}
                        onChange={(e) => handleSocialLinkChange('whatsapp', e.target.value)}
                        placeholder="5511999999999"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => testSocialLink('whatsapp', socialLinks.whatsapp)}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Formato: Código do país + DDD + número (sem espaços ou caracteres especiais)
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Telefone
                    </Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        id="phone"
                        value={socialLinks.phone}
                        onChange={(e) => handleSocialLinkChange('phone', e.target.value)}
                        placeholder="(11) 99999-9999"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => testSocialLink('phone', socialLinks.phone)}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      E-mail
                    </Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        id="email"
                        type="email"
                        value={socialLinks.email}
                        onChange={(e) => handleSocialLinkChange('email', e.target.value)}
                        placeholder="contato@recantomariah.com"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => testSocialLink('email', socialLinks.email)}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="buttons" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Textos dos Botões</CardTitle>
              <CardDescription>
                Personalize os textos dos botões principais do site
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="heroButton">Botão Principal (Hero)</Label>
                  <Input
                    id="heroButton"
                    value={buttonTexts.heroButton}
                    onChange={(e) => handleButtonTextChange('heroButton', e.target.value)}
                    placeholder="Solicitar Orçamento"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="contactFormButton">Botão do Formulário</Label>
                  <Input
                    id="contactFormButton"
                    value={buttonTexts.contactFormButton}
                    onChange={(e) => handleButtonTextChange('contactFormButton', e.target.value)}
                    placeholder="Solicitar Orçamento"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="whatsappButton">Botão WhatsApp</Label>
                  <Input
                    id="whatsappButton"
                    value={buttonTexts.whatsappButton}
                    onChange={(e) => handleButtonTextChange('whatsappButton', e.target.value)}
                    placeholder="Enviar via WhatsApp"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="galleryButton">Botão da Galeria</Label>
                  <Input
                    id="galleryButton"
                    value={buttonTexts.galleryButton}
                    onChange={(e) => handleButtonTextChange('galleryButton', e.target.value)}
                    placeholder="Ver Galeria Completa"
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium text-sm text-muted-foreground mb-3">Preview dos Botões:</h4>
                <div className="flex flex-wrap gap-3">
                  <Button className="btn-hero">
                    {buttonTexts.heroButton}
                  </Button>
                  <Button variant="outline">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    {buttonTexts.whatsappButton}
                  </Button>
                  <Button variant="secondary">
                    {buttonTexts.galleryButton}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-medium text-yellow-900 mb-2">💡 Dicas importantes</h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Use o botão de teste ao lado de cada campo para verificar se os links funcionam</li>
          <li>• Para WhatsApp, use apenas números (código do país + DDD + número)</li>
          <li>• Links do Instagram e Facebook devem começar com https://</li>
          <li>• Textos dos botões devem ser claros e chamativos</li>
        </ul>
      </div>
    </div>
  );
};

export default AdminSocialLinksEditor;