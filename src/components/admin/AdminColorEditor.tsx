import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface AdminColorEditorProps {
  onChanged: () => void;
}

const AdminColorEditor = ({ onChanged }: AdminColorEditorProps) => {
  const [colors, setColors] = useState({
    primary: '#4a5d23', // Verde escuro desbotado atual
    secondary: '#f4f1e8', // Bege claro
    accent: '#e8e0d0', // Bege médio
    background: '#fefcf7', // Bege muito claro
  });

  const handleColorChange = (key: string, value: string) => {
    setColors(prev => ({ ...prev, [key]: value }));
    onChanged();
  };

  const presets = [
    {
      name: 'Natureza Original',
      colors: {
        primary: '#4a5d23',
        secondary: '#f4f1e8',
        accent: '#e8e0d0',
        background: '#fefcf7'
      }
    },
    {
      name: 'Verde Suave',
      colors: {
        primary: '#6b8e3d',
        secondary: '#f8f6f0',
        accent: '#eae6dc',
        background: '#fdfcfa'
      }
    },
    {
      name: 'Terra e Folhagem',
      colors: {
        primary: '#5a6b2f',
        secondary: '#f2efea',
        accent: '#e4dfd5',
        background: '#fbf9f6'
      }
    }
  ];

  const applyPreset = (preset: typeof presets[0]) => {
    setColors(preset.colors);
    onChanged();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Paleta de Cores Personalizada</CardTitle>
          <CardDescription>Personalize as cores principais do site</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="primary">Cor Primária (Verde)</Label>
              <div className="flex gap-2">
                <Input
                  id="primary"
                  type="color"
                  value={colors.primary}
                  onChange={(e) => handleColorChange('primary', e.target.value)}
                  className="w-16 h-10 p-1"
                />
                <Input
                  type="text"
                  value={colors.primary}
                  onChange={(e) => handleColorChange('primary', e.target.value)}
                  className="flex-1"
                  placeholder="#4a5d23"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="secondary">Cor Secundária (Bege Claro)</Label>
              <div className="flex gap-2">
                <Input
                  id="secondary"
                  type="color"
                  value={colors.secondary}
                  onChange={(e) => handleColorChange('secondary', e.target.value)}
                  className="w-16 h-10 p-1"
                />
                <Input
                  type="text"
                  value={colors.secondary}
                  onChange={(e) => handleColorChange('secondary', e.target.value)}
                  className="flex-1"
                  placeholder="#f4f1e8"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="accent">Cor de Destaque (Bege Médio)</Label>
              <div className="flex gap-2">
                <Input
                  id="accent"
                  type="color"
                  value={colors.accent}
                  onChange={(e) => handleColorChange('accent', e.target.value)}
                  className="w-16 h-10 p-1"
                />
                <Input
                  type="text"
                  value={colors.accent}
                  onChange={(e) => handleColorChange('accent', e.target.value)}
                  className="flex-1"
                  placeholder="#e8e0d0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="background">Cor de Fundo</Label>
              <div className="flex gap-2">
                <Input
                  id="background"
                  type="color"
                  value={colors.background}
                  onChange={(e) => handleColorChange('background', e.target.value)}
                  className="w-16 h-10 p-1"
                />
                <Input
                  type="text"
                  value={colors.background}
                  onChange={(e) => handleColorChange('background', e.target.value)}
                  className="flex-1"
                  placeholder="#fefcf7"
                />
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-4 bg-gradient-to-r from-warm-beige to-pure-white">
            <h4 className="font-medium mb-3">Preview das Cores</h4>
            <div className="flex gap-4">
              <div 
                className="w-20 h-20 rounded-lg shadow-sm border"
                style={{ backgroundColor: colors.primary }}
                title="Cor Primária"
              />
              <div 
                className="w-20 h-20 rounded-lg shadow-sm border"
                style={{ backgroundColor: colors.secondary }}
                title="Cor Secundária"
              />
              <div 
                className="w-20 h-20 rounded-lg shadow-sm border"
                style={{ backgroundColor: colors.accent }}
                title="Cor de Destaque"
              />
              <div 
                className="w-20 h-20 rounded-lg shadow-sm border"
                style={{ backgroundColor: colors.background }}
                title="Cor de Fundo"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Paletas Pré-definidas</CardTitle>
          <CardDescription>Escolha uma combinação harmoniosa</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {presets.map((preset, index) => (
              <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <h4 className="font-medium mb-3">{preset.name}</h4>
                <div className="flex gap-2 mb-3">
                  <div 
                    className="w-8 h-8 rounded"
                    style={{ backgroundColor: preset.colors.primary }}
                  />
                  <div 
                    className="w-8 h-8 rounded"
                    style={{ backgroundColor: preset.colors.secondary }}
                  />
                  <div 
                    className="w-8 h-8 rounded"
                    style={{ backgroundColor: preset.colors.accent }}
                  />
                  <div 
                    className="w-8 h-8 rounded"
                    style={{ backgroundColor: preset.colors.background }}
                  />
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => applyPreset(preset)}
                  className="w-full"
                >
                  Aplicar
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-medium text-yellow-900 mb-2">⚠️ Importante</h4>
        <p className="text-sm text-yellow-700">
          As alterações de cor serão aplicadas quando você clicar em "Publicar Alterações". 
          Certifique-se de que as cores tenham contraste suficiente para acessibilidade.
        </p>
      </div>
    </div>
  );
};

export default AdminColorEditor;