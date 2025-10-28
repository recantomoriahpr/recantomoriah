// api/admin/upload.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(url, serviceKey);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    console.log(`[API] [admin/upload]: ${req.method} request`);

    if (req.method === 'POST') {
      // Para upload simples, vamos retornar uma URL de placeholder por enquanto
      // Em produção, isso seria integrado com Supabase Storage
      const timestamp = Date.now();
      const filename = `upload-${timestamp}.jpg`;
      const publicUrl = `https://picsum.photos/800/600?random=${timestamp}`;
      
      console.log(`[API] [admin/upload]: Generated placeholder URL: ${publicUrl}`);
      
      return res.status(200).json({ 
        ok: true, 
        url: publicUrl,
        filename,
        message: 'Upload simulado - integração com Supabase Storage pendente'
      });
    }

    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  } catch (e: any) {
    console.error(`[API] [admin/upload]: Unexpected error:`, e);
    return res.status(500).json({ ok: false, error: e?.message || 'Internal Server Error' });
  }
}
