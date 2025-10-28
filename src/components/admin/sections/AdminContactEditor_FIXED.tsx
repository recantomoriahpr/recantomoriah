import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Phone, Mail, MessageCircle, MapPin, Clock } from 'lucide-react';
import { getGlobalData, updateGlobalContacts } from '@/lib/globalData';
import { useToast } from '@/hooks/use-toast';

interface AdminContactEditorProps {
  onChanged: () => void;
}

const AdminContactEditor = ({ onChanged }: AdminContactEditorProps) => {
  const { toast } = useToast();
  const [contactData, setContactData] = useState(() => {
    const globalData = getGlobalData();
    return {
      phone: globalData.contatos.phone,
      whatsapp: globalData.contatos.whatsapp,
      email: globalData.contatos.email,
      address: globalData.contatos.address,
      addressComplement: globalData.contatos.addressComplement,
      weekdayHours: globalData.contatos.weekdayHours,
      saturdayHours: globalData.contatos.saturdayHours,
      sundayHours: globalData.contatos.sundayHours,
      responseTime: globalData.contatos.responseTime
    };
  });

  const updateContactData = (field: keyof typeof contactData, value: string) => {
    setContactData(prev => ({ ...prev, [field]: value }));
    
    // Update globalData immediately
    updateGlobalContacts({ [field]: value });
    onChanged();
    
    toast({ title: 'Contato atualizado', description: 'As informações foram salvas e aparecerão no site.' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-medium">Contatos</h3>
        <p className="text-sm text-muted-foreground">Configure as informações de contato que aparecem no formulário de orçamento e rodapé</p>
      </div>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Informações de Contato
          </CardTitle>
          <CardDescription>Dados que aparecem no formulário e rodapé do site</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={contactData.phone}
                onChange={(e) => updateContactData('phone', e.target.value)}
                placeholder="(11) 99999-9999"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp</Label>
              <Input
                id="whatsapp"
                value={contactData.whatsapp}
                onChange={(e) => updateContactData('whatsapp', e.target.value)}
                placeholder="(11) 99999-9999"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              value={contactData.email}
              onChange={(e) => updateContactData('email', e.target.value)}
              placeholder="contato@recantomoriah.com.br"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Endereço</Label>
            <Input
              id="address"
              value={contactData.address}
              onChange={(e) => updateContactData('address', e.target.value)}
              placeholder="Estrada Rural KM 15, Zona Rural"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="addressComplement">Complemento do Endereço</Label>
            <Input
              id="addressComplement"
              value={contactData.addressComplement}
              onChange={(e) => updateContactData('addressComplement', e.target.value)}
              placeholder="Próximo ao posto central"
            />
          </div>
        </CardContent>
      </Card>

      {/* Business Hours */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Horários de Atendimento
          </CardTitle>
          <CardDescription>Configure os horários que aparecem no formulário de contato</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="weekdayHours">Segunda a Sexta</Label>
            <Input
              id="weekdayHours"
              value={contactData.weekdayHours}
              onChange={(e) => updateContactData('weekdayHours', e.target.value)}
              placeholder="8h às 18h"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="saturdayHours">Sábados</Label>
            <Input
              id="saturdayHours"
              value={contactData.saturdayHours}
              onChange={(e) => updateContactData('saturdayHours', e.target.value)}
              placeholder="8h às 16h"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sundayHours">Domingos</Label>
            <Input
              id="sundayHours"
              value={contactData.sundayHours}
              onChange={(e) => updateContactData('sundayHours', e.target.value)}
              placeholder="9h às 15h"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="responseTime">Tempo de Resposta</Label>
            <Input
              id="responseTime"
              value={contactData.responseTime}
              onChange={(e) => updateContactData('responseTime', e.target.value)}
              placeholder="Respondemos em até 2 horas durante o horário comercial"
            />
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Preview dos Contatos</CardTitle>
          <CardDescription>Veja como aparecerá no site</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted p-4 rounded-lg space-y-3">
            <div className="flex items-center space-x-3">
              <Phone className="w-4 h-4 text-primary" />
              <span>{contactData.phone}</span>
            </div>
            <div className="flex items-center space-x-3">
              <MessageCircle className="w-4 h-4 text-primary" />
              <span>{contactData.whatsapp}</span>
            </div>
            <div className="flex items-center space-x-3">
              <Mail className="w-4 h-4 text-primary" />
              <span>{contactData.email}</span>
            </div>
            <div className="flex items-start space-x-3">
              <MapPin className="w-4 h-4 text-primary mt-1" />
              <div>
                <p>{contactData.address}</p>
                {contactData.addressComplement && <p className="text-sm text-muted-foreground">{contactData.addressComplement}</p>}
              </div>
            </div>
            <div className="border-t pt-3 mt-3">
              <h5 className="font-medium mb-2">Horário de Atendimento</h5>
              <div className="text-sm space-y-1">
                <p><strong>Segunda a Sexta:</strong> {contactData.weekdayHours}</p>
                <p><strong>Sábados:</strong> {contactData.saturdayHours}</p>
                <p><strong>Domingos:</strong> {contactData.sundayHours}</p>
              </div>
              <p className="text-sm text-muted-foreground mt-2">{contactData.responseTime}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminContactEditor;
