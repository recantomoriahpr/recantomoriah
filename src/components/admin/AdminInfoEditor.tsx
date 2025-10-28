import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { MapPin, Users, Calendar, Phone, Mail, Instagram, Facebook } from 'lucide-react';

interface AdminInfoEditorProps {
  onChanged: () => void;
}

const AdminInfoEditor = ({ onChanged }: AdminInfoEditorProps) => {
  const [info, setInfo] = useState({
    // Contato
    phone: '(11) 99999-9999',
    whatsapp: '5511999999999',
    email: 'contato@recantomariah.com',
    address: 'Estrada Rural km 15, Zona Rural, Cidade - SP, 12345-678',
    
    // Capacidades
    salaoCapacity: '150 pessoas',
    dormitoriosCapacity: '40 pessoas',
    estacionamento: '50 vagas',
    
    // Tipos de eventos
    eventTypes: 'Casamentos, Retiros Religiosos, Aniversários, Confraternizações, Eventos Corporativos',
    
    // Redes sociais
    instagram: '@recantomariah',
    facebook: 'RecantoMariahOficial',
    
    // Descrições
    locationDescription: 'Localizado em meio à natureza preservada, com fácil acesso pela rodovia principal.',
    facilitiesDescription: 'Estrutura completa com salão climatizado, cozinha industrial, banheiros acessíveis e ampla área verde.'
  });

  const handleInfoChange = (key: string, value: string) => {
    setInfo(prev => ({ ...prev, [key]: value }));
    onChanged();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Informações de Contato
          </CardTitle>
          <CardDescription>Dados para contato e localização</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={info.phone}
                onChange={(e) => handleInfoChange('phone', e.target.value)}
                placeholder="(11) 99999-9999"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="whatsapp">WhatsApp (com código do país)</Label>
              <Input
                id="whatsapp"
                value={info.whatsapp}
                onChange={(e) => handleInfoChange('whatsapp', e.target.value)}
                placeholder="5511999999999"
                className="mt-1"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              value={info.email}
              onChange={(e) => handleInfoChange('email', e.target.value)}
              placeholder="contato@recantomariah.com"
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="address">Endereço Completo</Label>
            <Textarea
              id="address"
              value={info.address}
              onChange={(e) => handleInfoChange('address', e.target.value)}
              placeholder="Estrada Rural km 15, Zona Rural, Cidade - SP, 12345-678"
              className="mt-1"
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="locationDescription">Descrição da Localização</Label>
            <Textarea
              id="locationDescription"
              value={info.locationDescription}
              onChange={(e) => handleInfoChange('locationDescription', e.target.value)}
              placeholder="Descreva a localização, acesso e características do local"
              className="mt-1"
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Capacidade dos Espaços
          </CardTitle>
          <CardDescription>Informações sobre capacidade e estrutura</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="salaoCapacity">Capacidade do Salão</Label>
              <Input
                id="salaoCapacity"
                value={info.salaoCapacity}
                onChange={(e) => handleInfoChange('salaoCapacity', e.target.value)}
                placeholder="150 pessoas"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="dormitoriosCapacity">Capacidade dos Dormitórios</Label>
              <Input
                id="dormitoriosCapacity"
                value={info.dormitoriosCapacity}
                onChange={(e) => handleInfoChange('dormitoriosCapacity', e.target.value)}
                placeholder="40 pessoas"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="estacionamento">Vagas de Estacionamento</Label>
              <Input
                id="estacionamento"
                value={info.estacionamento}
                onChange={(e) => handleInfoChange('estacionamento', e.target.value)}
                placeholder="50 vagas"
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="facilitiesDescription">Descrição das Instalações</Label>
            <Textarea
              id="facilitiesDescription"
              value={info.facilitiesDescription}
              onChange={(e) => handleInfoChange('facilitiesDescription', e.target.value)}
              placeholder="Descreva as principais facilidades e estruturas disponíveis"
              className="mt-1"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Tipos de Eventos
          </CardTitle>
          <CardDescription>Eventos que o local pode receber</CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="eventTypes">Tipos de Eventos Aceitos</Label>
            <Textarea
              id="eventTypes"
              value={info.eventTypes}
              onChange={(e) => handleInfoChange('eventTypes', e.target.value)}
              placeholder="Casamentos, Retiros Religiosos, Aniversários, Confraternizações, Eventos Corporativos"
              className="mt-1"
              rows={2}
            />
            <p className="text-sm text-muted-foreground mt-1">
              Separe os tipos de evento por vírgula
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Instagram className="h-5 w-5" />
            Redes Sociais
          </CardTitle>
          <CardDescription>Links para redes sociais</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="instagram" className="flex items-center gap-2">
                <Instagram className="h-4 w-4" />
                Instagram
              </Label>
              <Input
                id="instagram"
                value={info.instagram}
                onChange={(e) => handleInfoChange('instagram', e.target.value)}
                placeholder="@recantomariah"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="facebook" className="flex items-center gap-2">
                <Facebook className="h-4 w-4" />
                Facebook
              </Label>
              <Input
                id="facebook"
                value={info.facebook}
                onChange={(e) => handleInfoChange('facebook', e.target.value)}
                placeholder="RecantoMariahOficial"
                className="mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-medium text-green-900 mb-2 flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Dica: Google Maps
          </h4>
          <p className="text-sm text-green-700">
            Para adicionar um mapa interativo, você pode incorporar o Google Maps usando o endereço cadastrado.
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
            <Phone className="h-4 w-4" />
            WhatsApp
          </h4>
          <p className="text-sm text-blue-700">
            O número do WhatsApp deve incluir o código do país (55) + DDD + número para funcionar corretamente.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminInfoEditor;