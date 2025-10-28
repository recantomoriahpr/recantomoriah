import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, MapPin, Phone, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  listFooterLinks,
  createFooterLink,
  updateFooterLink,
  deleteFooterLink,
  publishFooterLinks,
  getContactInfo,
  updateContactInfo,
  type FooterLinkApi,
  type ContactInfoApi,
} from '@/lib/adminApi';

interface AdminFooterEditorProps {
  onChanged: () => void;
}

interface QuickLink {
  id: string;
  text: string;
  link: string;
  order: number;
}

const AdminFooterEditor = ({ onChanged }: AdminFooterEditorProps) => {
  const { toast } = useToast();
  const [brandData, setBrandData] = useState({
    title: 'Recanto Moriah',
    description: 'O lugar perfeito para seus momentos especiais. Natureza, conforto e estrutura completa para casamentos, retiros e eventos inesquecíveis.'
  });

  const [quickLinks, setQuickLinks] = useState<QuickLink[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load footer links
        const linksResult = await listFooterLinks();
        const items: FooterLinkApi[] = (linksResult?.data ?? linksResult) as FooterLinkApi[];
        const mapped = (items || []).map((l) => ({
          id: l.id,
          text: l.label ?? '',
          link: l.url ?? '#',
          order: l.order ?? 0,
        })).sort((a, b) => a.order - b.order);
        setQuickLinks(mapped);

        // Load contact info for footer data
        const contactResult = await getContactInfo();
        const data: ContactInfoApi = contactResult?.data ?? contactResult;
        if (data) {
          setBrandData({
            title: data.footer_brand_title || 'Recanto Moriah',
            description: data.footer_brand_description || 'O lugar perfeito para seus momentos especiais. Natureza, conforto e estrutura completa para casamentos, retiros e eventos inesquecíveis.'
          });
          setLegalLinks({
            privacyPolicy: data.footer_privacy_policy_text || 'Política de Privacidade',
            termsOfUse: data.footer_terms_of_use_text || 'Termos de Uso'
          });
          setCopyrightText(data.footer_copyright_text || 'Recanto Moriah. Todos os direitos reservados.');
        }
      } catch (err: any) {
        toast({ title: 'Erro ao carregar dados', description: String(err?.message || err), variant: 'destructive' });
      }
    };
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [legalLinks, setLegalLinks] = useState({
    privacyPolicy: 'Política de Privacidade',
    termsOfUse: 'Termos de Uso'
  });

  const [copyrightText, setCopyrightText] = useState('Recanto Moriah. Todos os direitos reservados.');

  const updateBrandData = async (field: keyof typeof brandData, value: string) => {
    setBrandData(prev => ({ ...prev, [field]: value }));
    onChanged();

    const fieldMap: Record<string, string> = {
      title: 'footer_brand_title',
      description: 'footer_brand_description'
    };

    try {
      await updateContactInfo({ [fieldMap[field]]: value });
      toast({ title: 'Rodapé atualizado', description: 'As informações foram salvas no banco de dados.' });
    } catch (err: any) {
      toast({ title: 'Erro ao salvar', description: String(err?.message || err), variant: 'destructive' });
    }
  };

  const updateLegalLinks = async (field: keyof typeof legalLinks, value: string) => {
    setLegalLinks(prev => ({ ...prev, [field]: value }));
    onChanged();

    const fieldMap: Record<string, string> = {
      privacyPolicy: 'footer_privacy_policy_text',
      termsOfUse: 'footer_terms_of_use_text'
    };

    try {
      await updateContactInfo({ [fieldMap[field]]: value });
      toast({ title: 'Links legais atualizados', description: 'As informações foram salvas no banco de dados.' });
    } catch (err: any) {
      toast({ title: 'Erro ao salvar', description: String(err?.message || err), variant: 'destructive' });
    }
  };

  const addQuickLink = () => {
    const order = quickLinks.length ? Math.max(...quickLinks.map(l => l.order)) + 1 : 0;
    createFooterLink({
      label: 'Novo Link',
      url: '#',
      order,
    })
      .then((res) => {
        const created: FooterLinkApi = res?.data ?? res;
        setQuickLinks(prev => [...prev, {
          id: created.id,
          text: created.label ?? '',
          link: created.url ?? '#',
          order: created.order ?? 0,
        }].sort((a, b) => a.order - b.order));
        onChanged();
      })
      .catch((err) => {
        toast({ title: 'Erro ao criar link', description: String(err?.message || err), variant: 'destructive' });
      });
  };

  const updateQuickLink = (id: string, field: keyof QuickLink, value: string) => {
    setQuickLinks(prev => prev.map(link => (link.id === id ? { ...link, [field]: value } : link)));

    const payload: any = {};
    if (field === 'text') payload.label = value;
    if (field === 'link') payload.url = value;

    if (Object.keys(payload).length) {
      updateFooterLink(id, payload).catch((err) => {
        toast({ title: 'Erro ao atualizar link', description: String(err?.message || err), variant: 'destructive' });
      });
    }
    onChanged();
  };

  const removeQuickLink = (id: string) => {
    deleteFooterLink(id)
      .then(() => {
        setQuickLinks(prev => prev.filter(link => link.id !== id));
        onChanged();
      })
      .catch((err) => {
        toast({ title: 'Erro ao remover link', description: String(err?.message || err), variant: 'destructive' });
      });
  };

  return (
    <div className="space-y-6">
      {/* Header with Publish Button */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Rodapé (Seção 7)</h3>
          <p className="text-sm text-muted-foreground">Configure todos os elementos do rodapé da landing page</p>
        </div>
        <Button
          variant="outline"
          onClick={async () => {
            try {
              await publishFooterLinks();
              toast({ title: 'Rodapé publicado!', description: 'As alterações foram aplicadas ao site público.' });
            } catch (err: any) {
              toast({ title: 'Erro ao publicar', description: String(err?.message || err), variant: 'destructive' });
            }
          }}
        >
          Publicar
        </Button>
      </div>

      {/* Brand Section */}
      <Card>
        <CardHeader>
          <CardTitle>Marca e Descrição</CardTitle>
          <CardDescription>Configure o nome da empresa e descrição principal</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="brandTitle">Nome da Empresa</Label>
            <Input
              id="brandTitle"
              value={brandData.title}
              onChange={(e) => updateBrandData('title', e.target.value)}
              placeholder="Recanto Moriah"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="brandDescription">Descrição</Label>
            <Textarea
              id="brandDescription"
              value={brandData.description}
              onChange={(e) => updateBrandData('description', e.target.value)}
              placeholder="Descrição da empresa no rodapé"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Quick Links */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Links de Navegação Rápida</CardTitle>
              <CardDescription>Configure os links internos do site</CardDescription>
            </div>
            <Button onClick={addQuickLink} size="sm" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Adicionar Link
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {quickLinks.map((link) => (
            <div key={link.id} className="flex items-center gap-3 p-3 border rounded-lg">
              <div className="flex-1 grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor={`text-${link.id}`} className="text-xs">Texto</Label>
                  <Input
                    id={`text-${link.id}`}
                    value={link.text}
                    onChange={(e) => updateQuickLink(link.id, 'text', e.target.value)}
                    placeholder="Texto do link"
                    className="h-8"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor={`link-${link.id}`} className="text-xs">Link</Label>
                  <Input
                    id={`link-${link.id}`}
                    value={link.link}
                    onChange={(e) => updateQuickLink(link.id, 'link', e.target.value)}
                    placeholder="#secao ou https://exemplo.com"
                    className="h-8"
                  />
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeQuickLink(link.id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Legal Links */}
      <Card>
        <CardHeader>
          <CardTitle>Links Legais</CardTitle>
          <CardDescription>Configure os textos dos links de política e termos</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="privacyPolicy">Política de Privacidade</Label>
              <Input
                id="privacyPolicy"
                value={legalLinks.privacyPolicy}
                onChange={(e) => updateLegalLinks('privacyPolicy', e.target.value)}
                placeholder="Política de Privacidade"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="termsOfUse">Termos de Uso</Label>
              <Input
                id="termsOfUse"
                value={legalLinks.termsOfUse}
                onChange={(e) => updateLegalLinks('termsOfUse', e.target.value)}
                placeholder="Termos de Uso"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Copyright */}
      <Card>
        <CardHeader>
          <CardTitle>Direitos Autorais</CardTitle>
          <CardDescription>Configure o texto de copyright</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="copyright">Texto de Copyright</Label>
            <Input
              id="copyright"
              value={copyrightText}
              onChange={async (e) => {
                const value = e.target.value;
                setCopyrightText(value);
                onChanged();
                try {
                  await updateContactInfo({ footer_copyright_text: value });
                  toast({ title: 'Copyright atualizado', description: 'As informações foram salvas no banco de dados.' });
                } catch (err: any) {
                  toast({ title: 'Erro ao salvar', description: String(err?.message || err), variant: 'destructive' });
                }
              }}
              placeholder="Recanto Moriah. Todos os direitos reservados."
            />
            <p className="text-xs text-muted-foreground">
              O ano atual ({new Date().getFullYear()}) será adicionado automaticamente
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Preview do Rodapé</CardTitle>
          <CardDescription>Veja como ficará na landing page</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-primary text-primary-foreground p-6 rounded-lg">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Brand and Description */}
              <div className="space-y-3">
                <h3 className="text-xl font-bold">{brandData.title}</h3>
                <p className="text-primary-foreground/80 leading-relaxed text-sm">
                  {brandData.description}
                </p>
                <div className="flex space-x-3">
                  <div className="p-2 bg-primary-foreground/10 rounded-full">
                    <div className="w-4 h-4 bg-primary-foreground/60 rounded"></div>
                  </div>
                  <div className="p-2 bg-primary-foreground/10 rounded-full">
                    <div className="w-4 h-4 bg-primary-foreground/60 rounded"></div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-3">
                <h4 className="text-base font-semibold">Contato</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Phone className="w-3 h-3" />
                    <span className="text-primary-foreground/80 text-sm">(Dados do Contatos)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-3 h-3" />
                    <span className="text-primary-foreground/80 text-sm">(Dados do Contatos)</span>
                  </div>
                </div>
              </div>

              {/* Address and Quick Links */}
              <div className="space-y-3">
                <h4 className="text-base font-semibold">Localização</h4>
                <div className="flex items-start space-x-2">
                  <MapPin className="w-3 h-3 mt-1 flex-shrink-0" />
                  <div className="text-primary-foreground/80 text-sm">
                    <p>(Dados do Contatos)</p>
                  </div>
                </div>
                
                <div className="pt-3">
                  <h5 className="font-medium text-sm mb-2">Navegação Rápida</h5>
                  <div className="space-y-1 text-primary-foreground/80 text-xs">
                    {quickLinks.map((link) => (
                      <p key={link.id}>• {link.text}</p>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="mt-8 pt-6 border-t border-primary-foreground/20">
              <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
                <p className="text-primary-foreground/60 text-xs">
                  © {new Date().getFullYear()} {copyrightText}
                </p>
                <div className="flex items-center space-x-4 text-primary-foreground/60 text-xs">
                  <span>{legalLinks.privacyPolicy}</span>
                  <span>{legalLinks.termsOfUse}</span>
                  <div className="w-3 h-3 bg-primary-foreground/30 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-medium text-yellow-900 mb-2">📋 Informação importante</h4>
        <p className="text-sm text-yellow-700">
          Os dados de contato (telefone, e-mail, endereço) e redes sociais são referenciados automaticamente 
          da seção "Contatos". Para alterar esses dados, vá até a aba "Contatos" no menu lateral.
        </p>
      </div>
    </div>
  );
};

export default AdminFooterEditor;