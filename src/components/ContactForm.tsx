import { useState } from 'react';
import { Send, MessageCircle, Calendar, Mail, Phone, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { usePublicPage } from '@/hooks/usePublicPage';

const ContactForm = () => {
  const { toast } = useToast();
  const { data } = usePublicPage();
  const contactInfo = (data as any)?.contact_info;
  
  const whatsappDisabled = !contactInfo?.whatsapp || contactInfo.whatsapp.replace(/\D/g, '').length < 10;
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventDate: '',
    eventType: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, eventType: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate form submission
    toast({
      title: "Solicitação enviada!",
      description: "Entraremos em contato em breve para discutir seu evento.",
    });

    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      eventDate: '',
      eventType: '',
      message: ''
    });
  };

  const handleWhatsAppClick = () => {
    if (whatsappDisabled) {
      toast({
        title: "WhatsApp não configurado",
        description: "Configure o número do WhatsApp em Contatos no painel administrativo.",
        variant: "destructive"
      });
      return;
    }

    const message = `Olá! Gostaria de solicitar um orçamento para evento no Recanto Moriah.
    
Nome: ${formData.name || 'A informar'}
Data do evento: ${formData.eventDate || 'A definir'}
Tipo de evento: ${formData.eventType || 'A definir'}
    
Aguardo contato!`;
    
    const number = contactInfo?.whatsapp?.replace(/\D/g, '') || '';
    const whatsappUrl = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <section id="contato" className="py-20 bg-gradient-nature">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            Solicite seu Orçamento
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Entre em contato conosco e receba uma proposta personalizada para seu evento
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-card p-8 rounded-xl shadow-nature-medium">
              <h3 className="text-2xl font-semibold text-card-foreground mb-6">
                Formulário de Contato
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Seu nome"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="seu@email.com"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone/WhatsApp</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="(11) 99999-9999"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="eventDate">Data do Evento</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="eventDate"
                        name="eventDate"
                        type="date"
                        value={formData.eventDate}
                        onChange={handleInputChange}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Tipo de Evento</Label>
                  <Select onValueChange={handleSelectChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo de evento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="casamento">Casamento</SelectItem>
                      <SelectItem value="retiro">Retiro Espiritual</SelectItem>
                      <SelectItem value="aniversario">Aniversário</SelectItem>
                      <SelectItem value="corporativo">Evento Corporativo</SelectItem>
                      <SelectItem value="confraternizacao">Confraternização</SelectItem>
                      <SelectItem value="outros">Outros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Mensagem</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Conte-nos mais sobre seu evento, número de convidados, suas necessidades especiais..."
                    rows={4}
                  />
                </div>

                <div className="space-y-4">
                  <Button type="submit" className="w-full btn-hero">
                    <Send className="w-4 h-4 mr-2" />
                    Solicitar Orçamento
                  </Button>
                  
                  <Button
                    type="button"
                    onClick={handleWhatsAppClick}
                    variant="outline"
                    disabled={whatsappDisabled}
                    className={`w-full ${whatsappDisabled ? 'opacity-50 cursor-not-allowed' : 'border-primary text-primary hover:bg-primary hover:text-primary-foreground'}`}
                    title={whatsappDisabled ? "Configure o WhatsApp em Contatos" : "Enviar via WhatsApp"}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    {whatsappDisabled ? "WhatsApp não configurado" : "Enviar via WhatsApp"}
                  </Button>
                </div>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              <div className="bg-card p-8 rounded-xl shadow-nature">
                <h3 className="text-2xl font-semibold text-card-foreground mb-6">
                  Informações de Contato
                </h3>
                
                <div className="space-y-4">
                  <a 
                    href={`tel:${contactInfo?.phone?.replace(/\D/g, '') || '11999999999'}`}
                    className="flex items-center space-x-4 hover:bg-primary/5 p-2 rounded-lg transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-card-foreground">Telefone</p>
                      <p className="text-muted-foreground hover:text-primary transition-colors">{contactInfo?.phone || '(11) 99999-9999'}</p>
                    </div>
                  </a>
                  
                  <a 
                    href={`https://wa.me/${contactInfo?.whatsapp?.replace(/\D/g, '') || '11999999999'}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-4 hover:bg-primary/5 p-2 rounded-lg transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full">
                      <MessageCircle className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-card-foreground">WhatsApp</p>
                      <p className="text-muted-foreground hover:text-primary transition-colors">{contactInfo?.phone || '(11) 99999-9999'}</p>
                    </div>
                  </a>
                  
                  <a 
                    href={`mailto:${contactInfo?.email || 'contato@recantomoriah.com.br'}`}
                    className="flex items-center space-x-4 hover:bg-primary/5 p-2 rounded-lg transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-card-foreground">E-mail</p>
                      <p className="text-muted-foreground hover:text-primary transition-colors">{contactInfo?.email || 'contato@recantomoriah.com.br'}</p>
                    </div>
                  </a>
                </div>
              </div>

              <div className="bg-primary text-primary-foreground p-8 rounded-xl">
                <h3 className="text-xl font-semibold mb-4">
                  Horário de Atendimento
                </h3>
                <div className="space-y-2 text-sm">
                  <p><strong>Segunda a Sexta:</strong> {contactInfo?.weekday_hours || '8h às 18h'}</p>
                  <p><strong>Sábados:</strong> {contactInfo?.saturday_hours || '8h às 16h'}</p>
                  <p><strong>Domingos:</strong> {contactInfo?.sunday_hours || '9h às 15h'}</p>
                </div>
                <div className="mt-6 pt-6 border-t border-primary-foreground/20">
                  <p className="text-sm opacity-90">
                    {contactInfo?.response_time || 'Respondemos todas as mensagens em até 2 horas durante o horário comercial.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;