import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  Type, 
  Palette, 
  Image, 
  MessageSquare, 
  Info, 
  Link, 
  Monitor, 
  Save,
  ExternalLink,
  Play
} from 'lucide-react';

const AdminHelp = () => {
  const quickStartSteps = [
    {
      icon: Type,
      title: '1. Edite os Textos',
      description: 'Comece personalizando os títulos, subtítulos e textos dos botões',
      tip: 'Use textos chamativos e claros para atrair mais clientes'
    },
    {
      icon: Palette,
      title: '2. Escolha as Cores',
      description: 'Selecione uma paleta que combine com a identidade do Recanto Moriah',
      tip: 'Use cores que transmitam natureza e tranquilidade'
    },
    {
      icon: Image,
      title: '3. Adicione Fotos',
      description: 'Upload das melhores fotos dos espaços e eventos realizados',
      tip: 'Fotos de alta qualidade geram mais interesse dos clientes'
    },
    {
      icon: MessageSquare,
      title: '4. Gerencie Depoimentos',
      description: 'Adicione avaliações reais de clientes satisfeitos',
      tip: 'Depoimentos aumentam a confiança e credibilidade'
    },
    {
      icon: Info,
      title: '5. Configure Informações',
      description: 'Atualize contatos, capacidades e tipos de eventos',
      tip: 'Mantenha sempre as informações atualizadas'
    },
    {
      icon: Link,
      title: '6. Ajuste Links',
      description: 'Configure redes sociais e textos dos botões',
      tip: 'Links funcionais facilitam o contato dos clientes'
    }
  ];

  const faqs = [
    {
      question: 'Como publico as alterações?',
      answer: 'Clique no botão "Publicar Alterações" no topo da página. As mudanças aparecerão no site público imediatamente.'
    },
    {
      question: 'Como adiciono novas fotos?',
      answer: 'Na aba "Imagens", você pode arrastar e soltar arquivos ou clicar para selecionar. Use imagens em alta resolução (mínimo 1200px).'
    },
    {
      question: 'Posso ver como fica antes de publicar?',
      answer: 'Sim! Use a pré-visualização no lado esquerdo ou clique em "Visualizar Site" para abrir em nova aba.'
    },
    {
      question: 'Como configuro o WhatsApp?',
      answer: 'Na aba "Links", use o formato: código do país + DDD + número (ex: 5511999999999). Teste o link clicando no botão ao lado.'
    },
    {
      question: 'As cores afetam todo o site?',
      answer: 'Sim, as cores que você escolher na aba "Cores" são aplicadas automaticamente em todo o site mantendo harmonia visual.'
    },
    {
      question: 'Posso adicionar novos depoimentos?',
      answer: 'Claro! Na aba "Depoimentos", clique em "Adicionar Depoimento" e preencha os dados. Você pode também editar ou remover existentes.'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-primary mb-2">
          Central de Ajuda - CMS Recanto Moriah
        </h2>
        <p className="text-muted-foreground">
          Tudo que você precisa saber para gerenciar seu site com facilidade
        </p>
      </div>

      <Tabs defaultValue="tutorial" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tutorial">Tutorial Rápido</TabsTrigger>
          <TabsTrigger value="faq">Perguntas Frequentes</TabsTrigger>
          <TabsTrigger value="tips">Dicas Avançadas</TabsTrigger>
        </TabsList>

        <TabsContent value="tutorial" className="space-y-6">
          <div className="grid gap-6">
            <div className="text-center p-6 bg-gradient-nature rounded-lg">
              <Play className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-bold mb-2">Bem-vindo ao seu CMS!</h3>
              <p className="text-muted-foreground mb-4">
                Siga este tutorial passo a passo para personalizar completamente seu site
              </p>
              <Button className="btn-hero">
                <ExternalLink className="h-4 w-4 mr-2" />
                Ver Site Atual
              </Button>
            </div>

            <div className="grid gap-4">
              {quickStartSteps.map((step, index) => (
                <Card key={index} className="transition-nature hover:shadow-nature-medium">
                  <CardContent className="flex items-start space-x-4 p-6">
                    <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full flex-shrink-0">
                      <step.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg mb-2">{step.title}</h4>
                      <p className="text-muted-foreground mb-2">{step.description}</p>
                      <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                        <p className="text-sm text-blue-700">
                          💡 <strong>Dica:</strong> {step.tip}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="faq" className="space-y-4">
          {faqs.map((faq, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-lg">{faq.question}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{faq.answer}</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="tips" className="space-y-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="h-5 w-5" />
                  Otimização para Dispositivos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Desktop vs Mobile</h4>
                  <p className="text-sm text-muted-foreground">
                    Seu site se adapta automaticamente a qualquer dispositivo. Use a pré-visualização 
                    para ver como fica em celulares e tablets.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Imagens Responsivas</h4>
                  <p className="text-sm text-muted-foreground">
                    Faça upload de imagens em alta resolução. O sistema otimiza automaticamente 
                    para cada dispositivo.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Save className="h-5 w-5" />
                  Melhores Práticas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start space-x-2">
                    <span className="text-primary">•</span>
                    <span>Salve frequentemente suas alterações usando "Publicar Alterações"</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-primary">•</span>
                    <span>Use fotos reais do local - evite imagens genéricas da internet</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-primary">•</span>
                    <span>Mantenha depoimentos atualizados com eventos recentes</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-primary">•</span>
                    <span>Teste todos os links (WhatsApp, redes sociais) antes de publicar</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-primary">•</span>
                    <span>Use cores que reflitam a identidade do Recanto Moriah</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-green-50 border-green-200">
              <CardHeader>
                <CardTitle className="text-green-900">Suporte Técnico</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-green-700 mb-4">
                  Precisa de ajuda técnica? Entre em contato com nosso suporte especializado.
                </p>
                <div className="space-y-2 text-sm text-green-700">
                  <p><strong>Email:</strong> suporte@exemplo.com</p>
                  <p><strong>WhatsApp:</strong> (11) 99999-9999</p>
                  <p><strong>Horário:</strong> Segunda a Sexta, 9h às 18h</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminHelp;