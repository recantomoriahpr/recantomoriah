import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { apiFetch } from '@/lib/api';

const DevHealth = () => {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const ping = async () => {
    setLoading(true);
    setResult('');
    try {
      const res = await apiFetch('/health', { method: 'GET' });
      const json = await res.json();
      setResult(JSON.stringify(json, null, 2));
    } catch (e: any) {
      setResult(`Error: ${e?.message || String(e)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Dev Health Check</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Clique para chamar GET /health via client centralizado. Esta página existe apenas no ambiente de desenvolvimento.
          </p>
          <Button onClick={ping} disabled={loading}>
            {loading ? 'Chamando...' : 'Chamar /health'}
          </Button>
          {result && (
            <pre className="mt-4 p-3 bg-muted rounded text-sm overflow-auto" data-testid="dev-health-output">
              {result}
            </pre>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DevHealth;
