import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

interface AdminTextEditorProps {
  onChanged: () => void;
}

const AdminTextEditor = ({ onChanged }: AdminTextEditorProps) => {
  const [texts, setTexts] = useState({
    heroTitle: 'Recanto Moriah – O lugar perfeito para seu retiro ou casamento dos sonhos',
    heroSubtitle: 'Natureza, conforto e estrutura completa para receber seu evento especial',
    heroButton: 'Solicitar Orçamento',
    benefitsTitle: 'Por que escolher o Recanto Moriah?',
    galleryTitle: 'Conheça nossos espaços',
    testimonialsTitle: 'Depoimentos',
    contactTitle: 'Solicite seu Orçamento',
    footerDescription: 'Recanto Moriah - O lugar perfeito para momentos especiais em meio à natureza'
  });

  const handleTextChange = (key: string, value: string) => {
    setTexts(prev => ({ ...prev, [key]: value }));
    onChanged();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Seção Hero (Topo)</CardTitle>
          <CardDescription>Edite os textos principais da primeira seção</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="heroTitle">Título Principal</Label>
            <Input
              id="heroTitle"
              value={texts.heroTitle}
              onChange={(e) => handleTextChange('heroTitle', e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="heroSubtitle">Subtítulo</Label>
            <Textarea
              id="heroSubtitle"
              value={texts.heroSubtitle}
              onChange={(e) => handleTextChange('heroSubtitle', e.target.value)}
              className="mt-1"
              rows={2}
            />
          </div>
          <div>
            <Label htmlFor="heroButton">Texto do Botão</Label>
            <Input
              id="heroButton"
              value={texts.heroButton}
              onChange={(e) => handleTextChange('heroButton', e.target.value)}
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Títulos das Seções</CardTitle>
          <CardDescription>Edite os títulos de cada seção do site</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="benefitsTitle">Título - Benefícios</Label>
            <Input
              id="benefitsTitle"
              value={texts.benefitsTitle}
              onChange={(e) => handleTextChange('benefitsTitle', e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="galleryTitle">Título - Galeria</Label>
            <Input
              id="galleryTitle"
              value={texts.galleryTitle}
              onChange={(e) => handleTextChange('galleryTitle', e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="testimonialsTitle">Título - Depoimentos</Label>
            <Input
              id="testimonialsTitle"
              value={texts.testimonialsTitle}
              onChange={(e) => handleTextChange('testimonialsTitle', e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="contactTitle">Título - Contato</Label>
            <Input
              id="contactTitle"
              value={texts.contactTitle}
              onChange={(e) => handleTextChange('contactTitle', e.target.value)}
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Rodapé</CardTitle>
          <CardDescription>Edite os textos do rodapé</CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="footerDescription">Descrição</Label>
            <Textarea
              id="footerDescription"
              value={texts.footerDescription}
              onChange={(e) => handleTextChange('footerDescription', e.target.value)}
              className="mt-1"
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Preview da Seção Hero */}
      <Card>
        <CardHeader>
          <CardTitle>Preview da Seção Hero</CardTitle>
          <CardDescription>Veja como ficará na landing page</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-gradient-hero text-white p-8 rounded-lg text-center">
            <h1 className="text-4xl font-bold mb-4">{texts.heroTitle}</h1>
            <p className="text-xl mb-6 opacity-90">{texts.heroSubtitle}</p>
            <button className="btn-hero">{texts.heroButton}</button>
          </div>
        </CardContent>
      </Card>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">💡 Preview em tempo real</h4>
        <p className="text-sm text-blue-700">
          As alterações serão aplicadas automaticamente quando você clicar em "Publicar Alterações" no topo da página.
        </p>
      </div>
    </div>
  );
};

export default AdminTextEditor;