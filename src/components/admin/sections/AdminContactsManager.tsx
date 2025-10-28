import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Phone, Mail, MessageCircle, MapPin, Clock, Instagram, Facebook, Linkedin, Twitter } from 'lucide-react';
import { getContactInfo, updateContactInfo, type ContactInfoApi } from '@/lib/adminApi';
import { useToast } from '@/hooks/use-toast';

interface AdminContactsManagerProps {
  onChanged: () => void;
}

const AdminContactsManager = ({ onChanged }: AdminContactsManagerProps) => {
  const { toast } = useToast();
  const [contacts, setContacts] = useState({
    phone: '',
    whatsapp: '',
    email: '',
    address: '',
    addressComplement: '',
    addressReference: '',
    gpsCoordinates: '',
    weekdayHours: '',
    saturdayHours: '',
    sundayHours: '',
    responseTime: '',
    instagram: '',
    facebook: '',
    linkedin: '',
    twitter: ''
  });

  useEffect(() => {
    const loadContactInfo = async () => {
      try {
        const result = await getContactInfo();
        const data: ContactInfoApi = result?.data ?? result;
        if (data) {
          setContacts({
            phone: data.phone ?? '',
            whatsapp: data.whatsapp ?? '',
            email: data.email ?? '',
            address: data.address ?? '',
            addressComplement: data.address_complement ?? '',
            addressReference: data.address_reference ?? '',
            gpsCoordinates: data.gps_coordinates ?? '',
            weekdayHours: data.weekday_hours ?? '',
            saturdayHours: data.saturday_hours ?? '',
            sundayHours: data.sunday_hours ?? '',
            responseTime: data.response_time ?? '',
            instagram: data.instagram ?? '',
            facebook: data.facebook ?? '',
            linkedin: data.linkedin ?? '',
            twitter: data.twitter ?? ''
          });
        }
      } catch (err: any) {
        console.error('Failed to load contact info:', err);
      }
    };
    loadContactInfo();
  }, []);

  const handleContactChange = async (field: keyof typeof contacts, value: string) => {
    setContacts(prev => ({ ...prev, [field]: value }));
    onChanged();
    
    // Map frontend field names to API field names
    const fieldMap: Record<string, string> = {
      addressComplement: 'address_complement',
      addressReference: 'address_reference',
      gpsCoordinates: 'gps_coordinates',
      weekdayHours: 'weekday_hours',
      saturdayHours: 'saturday_hours',
      sundayHours: 'sunday_hours',
      responseTime: 'response_time'
    };
    
    const apiField = fieldMap[field] || field;
    
    try {
      await updateContactInfo({ [apiField]: value });
      toast({ 
        title: 'Contato atualizado', 
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
        <h3 className="text-lg font-medium">Gerenciar Contatos</h3>
        <p className="text-sm text-muted-foreground">
          Configure os dados de contato que serão usados em toda a landing page automaticamente
        </p>
      </div>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Informações de Contato
          </CardTitle>
          <CardDescription>
            Estes dados serão exibidos no rodapé, seção de contato e outros locais automaticamente
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone Principal</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="phone"
                  value={contacts.phone}
                  onChange={(e) => handleContactChange('phone', e.target.value)}
                  placeholder="(11) 99999-9999"
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp (apenas números)</Label>
              <div className="relative">
                <MessageCircle className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="whatsapp"
                  value={contacts.whatsapp}
                  onChange={(e) => handleContactChange('whatsapp', e.target.value)}
                  placeholder="11999999999"
                  className="pl-10"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Digite somente os números (DDD + 9 dígitos). Ex: 11999999999
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-mail Principal</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={contacts.email}
                onChange={(e) => handleContactChange('email', e.target.value)}
                placeholder="contato@recantomoriah.com.br"
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Address Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Endereço e Localização
          </CardTitle>
          <CardDescription>Configure o endereço completo e coordenadas GPS</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address">Endereço Principal</Label>
            <Input
              id="address"
              value={contacts.address}
              onChange={(e) => handleContactChange('address', e.target.value)}
              placeholder="Estrada Rural KM 15"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="addressComplement">Complemento</Label>
            <Input
              id="addressComplement"
              value={contacts.addressComplement}
              onChange={(e) => handleContactChange('addressComplement', e.target.value)}
              placeholder="Zona Rural, Bairro, etc."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="addressReference">Ponto de Referência</Label>
            <Input
              id="addressReference"
              value={contacts.addressReference}
              onChange={(e) => handleContactChange('addressReference', e.target.value)}
              placeholder="Próximo ao posto de gasolina central"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gpsCoordinates">Link do Mapa (Google Maps)</Label>
            <Input
              id="gpsCoordinates"
              value={contacts.gpsCoordinates}
              onChange={(e) => handleContactChange('gpsCoordinates', e.target.value)}
              placeholder="https://maps.google.com/..."
            />
            <p className="text-xs text-muted-foreground">
              Cole aqui o link do Google Maps para a localização. Será usado para criar links clicáveis no endereço.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Business Hours */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Horário de Atendimento
          </CardTitle>
          <CardDescription>Configure os horários de funcionamento</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weekdayHours">Segunda a Sexta</Label>
              <Input
                id="weekdayHours"
                value={contacts.weekdayHours}
                onChange={(e) => handleContactChange('weekdayHours', e.target.value)}
                placeholder="8h às 18h"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="saturdayHours">Sábados</Label>
              <Input
                id="saturdayHours"
                value={contacts.saturdayHours}
                onChange={(e) => handleContactChange('saturdayHours', e.target.value)}
                placeholder="8h às 16h"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="sundayHours">Domingos</Label>
              <Input
                id="sundayHours"
                value={contacts.sundayHours}
                onChange={(e) => handleContactChange('sundayHours', e.target.value)}
                placeholder="9h às 15h"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="responseTime">Informação sobre Tempo de Resposta</Label>
            <Textarea
              id="responseTime"
              value={contacts.responseTime}
              onChange={(e) => handleContactChange('responseTime', e.target.value)}
              placeholder="Informação sobre tempo de resposta"
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Social Media */}
      <Card>
        <CardHeader>
          <CardTitle>Redes Sociais</CardTitle>
          <CardDescription>Configure os links das redes sociais (deixe em branco para ocultar)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="instagram">Instagram</Label>
              <div className="relative">
                <Instagram className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="instagram"
                  value={contacts.instagram}
                  onChange={(e) => handleContactChange('instagram', e.target.value)}
                  placeholder="https://instagram.com/recantomoriah"
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="facebook">Facebook</Label>
              <div className="relative">
                <Facebook className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="facebook"
                  value={contacts.facebook}
                  onChange={(e) => handleContactChange('facebook', e.target.value)}
                  placeholder="https://facebook.com/recantomoriah"
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn</Label>
              <div className="relative">
                <Linkedin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="linkedin"
                  value={contacts.linkedin}
                  onChange={(e) => handleContactChange('linkedin', e.target.value)}
                  placeholder="https://linkedin.com/company/recantomoriah"
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="twitter">Twitter</Label>
              <div className="relative">
                <Twitter className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="twitter"
                  value={contacts.twitter}
                  onChange={(e) => handleContactChange('twitter', e.target.value)}
                  placeholder="https://twitter.com/recantomoriah"
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Preview dos Dados de Contato</CardTitle>
          <CardDescription>Veja como as informações aparecerão na landing page</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Info Preview */}
            <div className="space-y-4">
              <h4 className="font-semibold">Informações de Contato</h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-primary" />
                  <span>{contacts.phone}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MessageCircle className="w-4 h-4 text-primary" />
                  <span>{contacts.whatsapp}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-primary" />
                  <span>{contacts.email}</span>
                </div>
              </div>
            </div>

            {/* Address Preview */}
            <div className="space-y-4">
              <h4 className="font-semibold">Localização</h4>
              <div className="flex items-start space-x-3 text-sm">
                <MapPin className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p>{contacts.address}</p>
                  {contacts.addressComplement && <p>{contacts.addressComplement}</p>}
                  {contacts.addressReference && <p>{contacts.addressReference}</p>}
                </div>
              </div>
            </div>

            {/* Business Hours Preview */}
            <div className="space-y-4">
              <h4 className="font-semibold">Horário de Atendimento</h4>
              <div className="space-y-2 text-sm">
                <p><strong>Segunda a Sexta:</strong> {contacts.weekdayHours}</p>
                <p><strong>Sábados:</strong> {contacts.saturdayHours}</p>
                <p><strong>Domingos:</strong> {contacts.sundayHours}</p>
              </div>
            </div>

            {/* Social Media Preview */}
            <div className="space-y-4">
              <h4 className="font-semibold">Redes Sociais</h4>
              <div className="flex space-x-4">
                {contacts.instagram && (
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Instagram className="w-4 h-4 text-primary" />
                  </div>
                )}
                {contacts.facebook && (
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Facebook className="w-4 h-4 text-primary" />
                  </div>
                )}
                {contacts.linkedin && (
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Linkedin className="w-4 h-4 text-primary" />
                  </div>
                )}
                {contacts.twitter && (
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Twitter className="w-4 h-4 text-primary" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-medium text-yellow-900 mb-2">📋 Informações importantes</h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Estes dados serão automaticamente utilizados em toda a landing page</li>
          <li>• Alterações aqui refletem no rodapé, seção de contato e formulários</li>
          <li>• Redes sociais em branco não aparecerão no site</li>
          <li>• Use coordenadas GPS precisas para melhor integração com mapas</li>
        </ul>
      </div>
    </div>
  );
};

export default AdminContactsManager;