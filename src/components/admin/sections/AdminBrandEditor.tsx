import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Upload, Palette, Type } from 'lucide-react';
import { updateGlobalTheme, getGlobalData } from '@/lib/globalData';
import { useToast } from '@/hooks/use-toast';
import { API_BASE } from '@/lib/api';
import {
  getSiteSettings,
  updateSiteSettings,
  publishSiteSettings,
  type SiteSettingsApi,
} from '@/lib/adminApi';

interface AdminBrandEditorProps {
  onChanged: () => void;
}

const AdminBrandEditor = ({ onChanged }: AdminBrandEditorProps) => {
  const { toast } = useToast();
  const [brand, setBrand] = useState(() => {
    const globalData = getGlobalData();
    return {
      logo: '',
      primaryColor: globalData.theme.primary,
      secondaryColor: globalData.theme.secondary,
      accentColor: globalData.theme.accent,
      backgroundColor: globalData.theme.background,
      fontFamily: globalData.theme.fontFamily
    };
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [settingsId, setSettingsId] = useState<string | null>(null);

  // Load settings from API on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const result = await getSiteSettings();
        const data: SiteSettingsApi = result?.data ?? result;
        if (data) {
          setSettingsId(data.id);
          setBrand({
            logo: data.logo_url ?? '',
            primaryColor: data.primary_color ?? '#4a5d23',
            secondaryColor: data.secondary_color ?? '#f4f1e8',
            accentColor: data.accent_color ?? '#e8e0d0',
            backgroundColor: data.background_color ?? '#fefcf7',
            fontFamily: data.font_family ?? 'Inter',
          });
          // Apply to global theme for preview
          updateGlobalTheme({
            primary: data.primary_color ?? '#4a5d23',
            secondary: data.secondary_color ?? '#f4f1e8',
            accent: data.accent_color ?? '#e8e0d0',
            background: data.background_color ?? '#fefcf7',
            fontFamily: data.font_family ?? 'Inter',
          });
        }
      } catch (err: any) {
        toast({ title: 'Erro ao carregar configurações', description: String(err?.message || err), variant: 'destructive' });
      }
    };
    loadSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBrandChange = (key: string, value: string) => {
    setBrand(prev => ({ ...prev, [key]: value }));
    
    // Atualizar tema global em tempo real (preview)
    if (key === 'primaryColor' || key === 'secondaryColor' || key === 'accentColor' || key === 'backgroundColor' || key === 'fontFamily') {
      const themeUpdate: any = {};
      
      // Mapear nomes corretos
      if (key === 'primaryColor') themeUpdate.primary = value;
      else if (key === 'secondaryColor') themeUpdate.secondary = value;  
      else if (key === 'accentColor') themeUpdate.accent = value;
      else if (key === 'backgroundColor') themeUpdate.background = value;
      else if (key === 'fontFamily') themeUpdate.fontFamily = value;
      
      updateGlobalTheme(themeUpdate);
    }

    // Persist to API
    const payload: any = {};
    if (key === 'primaryColor') payload.primary_color = value;
    else if (key === 'secondaryColor') payload.secondary_color = value;
    else if (key === 'accentColor') payload.accent_color = value;
    else if (key === 'backgroundColor') payload.background_color = value;
    else if (key === 'fontFamily') payload.font_family = value;
    else if (key === 'logo') payload.logo_url = value;

    if (Object.keys(payload).length) {
      updateSiteSettings(payload).catch((err) => {
        toast({ title: 'Erro ao salvar', description: String(err?.message || err), variant: 'destructive' });
      });
    }
    
    onChanged();
  };

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setLogoFile(file);
      try {
        const form = new FormData();
        form.append('file', file);
        const res = await fetch(`${API_BASE}/admin/upload`, { method: 'POST', body: form });
        const data = await res.json();
        if (!res.ok || data?.error) throw new Error(data?.error || 'Upload failed');
        const logoUrl: string = data.url;
        setBrand(prev => ({ ...prev, logo: logoUrl }));
        await updateSiteSettings({ logo_url: logoUrl });
        toast({ title: 'Logo enviado', description: 'Upload concluído com sucesso.' });
        onChanged();
      } catch (err: any) {
        toast({ title: 'Erro no upload', description: String(err?.message || err), variant: 'destructive' });
      }
    }
  };

  const colorPresets = [
    {
      name: 'Natureza Original',
      colors: {
        primaryColor: '#4a5d23',
        secondaryColor: '#f4f1e8',
        accentColor: '#e8e0d0',
        backgroundColor: '#fefcf7'
      }
    },
    {
      name: 'Verde Suave',
      colors: {
        primaryColor: '#6b8e3d',
        secondaryColor: '#f8f6f0',
        accentColor: '#eae6dc',
        backgroundColor: '#fdfcfa'
      }
    },
    {
      name: 'Terra e Folhagem',
      colors: {
        primaryColor: '#5a6b2f',
        secondaryColor: '#f2efea',
        accentColor: '#e4dfd5',
        backgroundColor: '#fbf9f6'
      }
    }
  ];

  const fontOptions = [
    'Inter',
    'Roboto',
    'Open Sans',
    'Playfair Display', // Fonte elegante tipo Resort
    'Lato',
    'Montserrat',
    'Poppins',
    'Raleway',
  ];

  const applyColorPreset = async (preset: typeof colorPresets[0]) => {
    setBrand(prev => ({ ...prev, ...preset.colors }));
    
    // Aplicar preset ao tema global (preview)
    updateGlobalTheme({
      primary: preset.colors.primaryColor,
      secondary: preset.colors.secondaryColor, 
      accent: preset.colors.accentColor,
      background: preset.colors.backgroundColor
    });

    // Persist to API
    try {
      await updateSiteSettings({
        primary_color: preset.colors.primaryColor,
        secondary_color: preset.colors.secondaryColor,
        accent_color: preset.colors.accentColor,
        background_color: preset.colors.backgroundColor,
      });
    } catch (err: any) {
      toast({ title: 'Erro ao aplicar preset', description: String(err?.message || err), variant: 'destructive' });
    }
    
    onChanged();
  };

  return (
    <div className="space-y-6">
      {/* Header with Publish Button */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Identidade Visual</h3>
          <p className="text-sm text-muted-foreground">Configure logo, cores e tipografia do site</p>
        </div>
        <Button
          variant="outline"
          onClick={async () => {
            try {
              await publishSiteSettings();
              toast({ title: 'Configurações publicadas!', description: 'As alterações foram aplicadas ao site público.' });
            } catch (err: any) {
              toast({ title: 'Erro ao publicar', description: String(err?.message || err), variant: 'destructive' });
            }
          }}
        >
          Publicar
        </Button>
      </div>

      {/* Logo Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Logo da Empresa
          </CardTitle>
          <CardDescription>Faça upload do logo ou deixe em branco para usar apenas texto</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div 
              className="w-32 h-20 bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-muted-foreground/25 cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => document.getElementById('logo-upload')?.click()}
            >
              {brand.logo ? (
                <img src={brand.logo} alt="Logo preview" className="max-w-full max-h-full object-contain" />
              ) : (
                <div className="text-center text-muted-foreground">
                  <Upload className="h-6 w-6 mx-auto mb-1" />
                  <p className="text-xs">Clique para enviar</p>
                </div>
              )}
            </div>
            <div className="flex-1">
              <Input
                id="logo-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleLogoUpload}
              />
              <Button
                variant="outline"
                onClick={() => document.getElementById('logo-upload')?.click()}
                className="w-full"
              >
                <Upload className="h-4 w-4 mr-2" />
                Selecionar Logo
              </Button>
              {logoFile && (
                <p className="text-sm text-muted-foreground mt-2">
                  Arquivo: {logoFile.name}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Colors Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Paleta de Cores
          </CardTitle>
          <CardDescription>Defina as cores principais da identidade visual</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="primaryColor">Cor Primária (Verde)</Label>
              <div className="flex gap-2">
                <Input
                  id="primaryColor"
                  type="color"
                  value={brand.primaryColor}
                  onChange={(e) => handleBrandChange('primaryColor', e.target.value)}
                  className="w-16 h-10 p-1"
                />
                <Input
                  type="text"
                  value={brand.primaryColor}
                  onChange={(e) => handleBrandChange('primaryColor', e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="secondaryColor">Cor Secundária (Bege)</Label>
              <div className="flex gap-2">
                <Input
                  id="secondaryColor"
                  type="color"
                  value={brand.secondaryColor}
                  onChange={(e) => handleBrandChange('secondaryColor', e.target.value)}
                  className="w-16 h-10 p-1"
                />
                <Input
                  type="text"
                  value={brand.secondaryColor}
                  onChange={(e) => handleBrandChange('secondaryColor', e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="accentColor">Cor de Destaque</Label>
              <div className="flex gap-2">
                <Input
                  id="accentColor"
                  type="color"
                  value={brand.accentColor}
                  onChange={(e) => handleBrandChange('accentColor', e.target.value)}
                  className="w-16 h-10 p-1"
                />
                <Input
                  type="text"
                  value={brand.accentColor}
                  onChange={(e) => handleBrandChange('accentColor', e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="backgroundColor">Cor de Fundo</Label>
              <div className="flex gap-2">
                <Input
                  id="backgroundColor"
                  type="color"
                  value={brand.backgroundColor}
                  onChange={(e) => handleBrandChange('backgroundColor', e.target.value)}
                  className="w-16 h-10 p-1"
                />
                <Input
                  type="text"
                  value={brand.backgroundColor}
                  onChange={(e) => handleBrandChange('backgroundColor', e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-3">Preview das Cores</h4>
            <div className="flex gap-4">
              <div 
                className="w-20 h-20 rounded-lg shadow-sm border"
                style={{ backgroundColor: brand.primaryColor }}
                title="Cor Primária"
              />
              <div 
                className="w-20 h-20 rounded-lg shadow-sm border"
                style={{ backgroundColor: brand.secondaryColor }}
                title="Cor Secundária"
              />
              <div 
                className="w-20 h-20 rounded-lg shadow-sm border"
                style={{ backgroundColor: brand.accentColor }}
                title="Cor de Destaque"
              />
              <div 
                className="w-20 h-20 rounded-lg shadow-sm border"
                style={{ backgroundColor: brand.backgroundColor }}
                title="Cor de Fundo"
              />
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-3">Paletas Pré-definidas</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {colorPresets.map((preset, index) => (
                <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h5 className="font-medium mb-3">{preset.name}</h5>
                  <div className="flex gap-2 mb-3">
                    {Object.values(preset.colors).map((color, i) => (
                      <div 
                        key={i}
                        className="w-8 h-8 rounded border"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => applyColorPreset(preset)}
                    className="w-full"
                  >
                    Aplicar
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Typography Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Type className="h-5 w-5" />
            Tipografia
          </CardTitle>
          <CardDescription>Escolha a fonte principal do site</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fontFamily">Família de Fonte</Label>
            <select
              id="fontFamily"
              value={brand.fontFamily}
              onChange={(e) => handleBrandChange('fontFamily', e.target.value)}
              className="w-full p-2 border border-input bg-background rounded-md"
            >
              {fontOptions.map((font) => (
                <option key={font} value={font}>{font}</option>
              ))}
            </select>
          </div>

          <div className="border rounded-lg p-4" style={{ fontFamily: brand.fontFamily }}>
            <h4 className="font-medium mb-3">Preview da Fonte</h4>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold">Recanto Moriah</h1>
              <h2 className="text-xl font-semibold">Título de Seção</h2>
              <p className="text-base">Este é um exemplo de parágrafo usando a fonte selecionada. Permite visualizar como ficará o texto no site.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminBrandEditor;