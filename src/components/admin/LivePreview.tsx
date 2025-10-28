import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Monitor, Smartphone } from 'lucide-react';
import { useState } from 'react';

interface LivePreviewProps {
  hasChanges: boolean;
}

const LivePreview = ({ hasChanges }: LivePreviewProps) => {
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');

  const openFullPreview = () => {
    window.open('/', '_blank');
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Pré-visualização</CardTitle>
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'desktop' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('desktop')}
            >
              <Monitor className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'mobile' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('mobile')}
            >
              <Smartphone className="h-4 w-4" />
            </Button>
          </div>
        </div>
        {hasChanges && (
          <div className="text-sm text-orange-600 bg-orange-50 p-2 rounded-md">
            ⚠️ Alterações não salvas. Clique em "Publicar" para aplicar.
          </div>
        )}
      </CardHeader>
      <CardContent className="flex-1 flex flex-col space-y-4 min-h-0">
        <div className="flex-1 flex flex-col min-h-0">
          <div 
            className={`border rounded-lg overflow-hidden bg-white flex-1 ${
              viewMode === 'mobile' ? 'max-w-sm mx-auto w-full' : 'w-full'
            }`}
            style={{ minHeight: '80vh' }}
          >
            <iframe
              src="/"
              className="w-full h-full border-0"
              title="Pré-visualização do site"
              style={{ 
                transform: viewMode === 'mobile' ? 'scale(0.8)' : 'scale(1)',
                transformOrigin: 'top left',
                width: viewMode === 'mobile' ? '125%' : '100%',
                height: viewMode === 'mobile' ? '125%' : '100%'
              }}
            />
          </div>
        </div>
        
        <div className="flex-shrink-0 space-y-4">
          <Button 
            onClick={openFullPreview}
            variant="outline" 
            className="w-full"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Abrir Pré-visualização em Tela Cheia
          </Button>

          <div className="text-xs text-muted-foreground space-y-1">
            <p>• As alterações aparecem após clicar em "Publicar"</p>
            <p>• Use os botões acima para ver como fica no desktop e mobile</p>
            <p>• Clique no botão acima para ver em tela cheia</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LivePreview;