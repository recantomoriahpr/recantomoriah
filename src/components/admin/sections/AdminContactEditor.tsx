import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Phone, Mail, MessageCircle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getContactInfo, updateContactInfo, type ContactInfoApi } from '@/lib/adminApi';

interface AdminContactEditorProps {
  onChanged: () => void;
}

const AdminContactEditor = ({ onChanged }: AdminContactEditorProps) => {
  const { toast } = useToast();
  
  const [sectionData, setSectionData] = useState({
    title: 'Solicite seu Orçamento',
    subtitle: 'Entre em contato conosco e receba uma proposta personalizada para seu evento'
  });

  const [formData, setFormData] = useState({
    title: 'Formulário de Contato',
    submitButtonText: 'Solicitar Orçamento',
    whatsappButtonText: 'Enviar via WhatsApp',
    successMessage: 'Entraremos em contato em breve para discutir seu evento.'
  });

  const [businessHours, setBusinessHours] = useState({
    title: 'Horário de Atendimento',
    weekdays: 'Segunda a Sexta: 8h às 18h',
    saturday: 'Sábados: 8h às 16h',
    sunday: 'Domingos: 9h às 15h',
    responseInfo: 'Respondemos todas as mensagens em até 2 horas durante o horário comercial.'
  });

  useEffect(() => {
    const loadContactInfo = async () => {
      try {
        const result = await getContactInfo();
        const data: ContactInfoApi = result?.data ?? result;
        if (data) {
          setBusinessHours({
            title: 'Horário de Atendimento',
            weekdays: data.weekday_hours || 'Segunda a Sexta: 8h às 18h',
            saturday: data.saturday_hours || 'Sábados: 8h às 16h',
            sunday: data.sunday_hours || 'Domingos: 9h às 15h',
            responseInfo: data.response_time || 'Respondemos todas as mensagens em até 2 horas durante o horário comercial.'
          });
        }
      } catch (err: any) {
        console.error('Failed to load contact info:', err);
      }
    };
    loadContactInfo();
  }, []);

  const updateSectionData = (field: keyof typeof sectionData, value: string) => {
    setSectionData(prev => ({ ...prev, [field]: value }));
    onChanged();
  };

  const updateFormData = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    onChanged();
  };

  const updateBusinessHours = async (field: keyof typeof businessHours, value: string) => {
    setBusinessHours(prev => ({ ...prev, [field]: value }));
    onChanged();

    const fieldMap: Record<string, string> = {
      weekdays: 'weekday_hours',
      saturday: 'saturday_hours',
      sunday: 'sunday_hours',
      responseInfo: 'response_time'
    };

    const apiField = fieldMap[field];
    if (!apiField) return;

    try {
      await updateContactInfo({ [apiField]: value });
      toast({
        title: 'Horário atualizado',
        description: 'As informações foram salvas no banco de dados.'
      });
    } catch (err: any) {
      toast({
        title: 'Erro ao salvar',
        description: String(err?.message || err),
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Seção de Orçamento</h3>
        <p className="text-sm text-muted-foreground">Configure o formulário de contato e informações de atendimento</p>
      </div>

      {/* Section Header */}
      <Card>
        <CardHeader>
          <CardTitle>Título e Subtítulo da Seção</CardTitle>
          <CardDescription>Configure os textos principais da seção de contato</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="contactTitle">Título da Seção</Label>
            <Input
              id="contactTitle"
              value={sectionData.title}
              onChange={(e) => updateSectionData('title', e.target.value)}
              placeholder="Solicite seu Orçamento"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contactSubtitle">Subtítulo da Seção</Label>
            <Textarea
              id="contactSubtitle"
              value={sectionData.subtitle}
              onChange={(e) => updateSectionData('subtitle', e.target.value)}
              placeholder="Descrição da seção"
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Form Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Configuração do Formulário</CardTitle>
          <CardDescription>Personalize os textos e mensagens do formulário</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="formTitle">Título do Formulário</Label>
            <Input
              id="formTitle"
              value={formData.title}
              onChange={(e) => updateFormData('title', e.target.value)}
              placeholder="Formulário de Contato"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="submitButton">Texto do Botão Principal</Label>
              <Input
                id="submitButton"
                value={formData.submitButtonText}
                onChange={(e) => updateFormData('submitButtonText', e.target.value)}
                placeholder="Solicitar Orçamento"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsappButton">Texto do Botão WhatsApp</Label>
              <Input
                id="whatsappButton"
                value={formData.whatsappButtonText}
                onChange={(e) => updateFormData('whatsappButtonText', e.target.value)}
                placeholder="Enviar via WhatsApp"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="successMessage">Mensagem de Sucesso</Label>
            <Textarea
              id="successMessage"
              value={formData.successMessage}
              onChange={(e) => updateFormData('successMessage', e.target.value)}
              placeholder="Mensagem exibida após envio do formulário"
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Business Hours Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Horário de Atendimento
          </CardTitle>
          <CardDescription>Configure as informações de horário que aparecem no card lateral</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="businessTitle">Título do Card</Label>
            <Input
              id="businessTitle"
              value={businessHours.title}
              onChange={(e) => updateBusinessHours('title', e.target.value)}
              placeholder="Horário de Atendimento"
            />
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weekdays">Segunda a Sexta</Label>
              <Input
                id="weekdays"
                value={businessHours.weekdays}
                onChange={(e) => updateBusinessHours('weekdays', e.target.value)}
                placeholder="Segunda a Sexta: 8h às 18h"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="saturday">Sábados</Label>
              <Input
                id="saturday"
                value={businessHours.saturday}
                onChange={(e) => updateBusinessHours('saturday', e.target.value)}
                placeholder="Sábados: 8h às 16h"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sunday">Domingos</Label>
              <Input
                id="sunday"
                value={businessHours.sunday}
                onChange={(e) => updateBusinessHours('sunday', e.target.value)}
                placeholder="Domingos: 9h às 15h"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="responseInfo">Informação sobre Tempo de Resposta</Label>
            <Textarea
              id="responseInfo"
              value={businessHours.responseInfo}
              onChange={(e) => updateBusinessHours('responseInfo', e.target.value)}
              placeholder="Informação sobre tempo de resposta"
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Preview da Seção</CardTitle>
          <CardDescription>Veja como ficará na landing page</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-gradient-to-br from-background to-muted p-6 rounded-lg">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-primary mb-4">
                {sectionData.title}
              </h2>
              <p className="text-muted-foreground max-w-3xl mx-auto">
                {sectionData.subtitle}
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Contact Form Preview */}
                <div className="bg-card p-6 rounded-xl shadow-sm border">
                  <h3 className="text-xl font-semibold text-card-foreground mb-4">
                    {formData.title}
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-sm font-medium">Nome Completo</label>
                        <div className="h-8 bg-muted rounded border"></div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-medium">E-mail</label>
                        <div className="h-8 bg-muted rounded border"></div>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-sm font-medium">Telefone/WhatsApp</label>
                        <div className="h-8 bg-muted rounded border"></div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-medium">Data do Evento</label>
                        <div className="h-8 bg-muted rounded border"></div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-sm font-medium">Tipo de Evento</label>
                      <div className="h-8 bg-muted rounded border"></div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-sm font-medium">Mensagem</label>
                      <div className="h-20 bg-muted rounded border"></div>
                    </div>

                    <div className="space-y-2">
                      <div className="h-10 bg-primary text-primary-foreground rounded flex items-center justify-center text-sm font-medium">
                        {formData.submitButtonText}
                      </div>
                      <div className="h-10 bg-background border border-primary text-primary rounded flex items-center justify-center text-sm font-medium">
                        {formData.whatsappButtonText}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Info Preview */}
                <div className="space-y-6">
                  <div className="bg-card p-6 rounded-xl shadow-sm border">
                    <h3 className="text-xl font-semibold text-card-foreground mb-4">
                      Informações de Contato
                    </h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full">
                          <Phone className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-card-foreground text-sm">Telefone</p>
                          <p className="text-muted-foreground text-sm">(Dados do Contatos)</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full">
                          <MessageCircle className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-card-foreground text-sm">WhatsApp</p>
                          <p className="text-muted-foreground text-sm">(Dados do Contatos)</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full">
                          <Mail className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-card-foreground text-sm">E-mail</p>
                          <p className="text-muted-foreground text-sm">(Dados do Contatos)</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-primary text-primary-foreground p-6 rounded-xl">
                    <h3 className="text-lg font-semibold mb-3">
                      {businessHours.title}
                    </h3>
                    <div className="space-y-1 text-sm">
                      <p>{businessHours.weekdays}</p>
                      <p>{businessHours.saturday}</p>
                      <p>{businessHours.sunday}</p>
                    </div>
                    <div className="mt-4 pt-4 border-t border-primary-foreground/20">
                      <p className="text-sm opacity-90">
                        {businessHours.responseInfo}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-medium text-yellow-900 mb-2">📋 Informação importante</h4>
        <p className="text-sm text-yellow-700">
          Os dados de contato (telefone, e-mail, WhatsApp) são referenciados automaticamente da seção 
          "Contatos". Para alterar esses dados, vá até a aba "Contatos" no menu lateral.
        </p>
      </div>
    </div>
  );
};

export default AdminContactEditor;