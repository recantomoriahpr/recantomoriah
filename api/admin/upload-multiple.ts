// api/admin/upload-multiple.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
// import { supabaseAdmin } from '../../src/server/supabase'; // Não usado ainda

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    console.log(`[API] [admin/upload-multiple]: ${req.method} request`);

    if (req.method === 'POST') {
      // Para upload múltiplo, vamos simular 3 uploads
      const timestamp = Date.now();
      const uploads: Array<{url: string, filename: string}> = [];
      
      for (let i = 0; i < 3; i++) {
        const filename = `upload-${timestamp}-${i + 1}.jpg`;
        const publicUrl = `https://picsum.photos/800/600?random=${timestamp + i}`;
        uploads.push({ url: publicUrl, filename });
      }
      
      console.log(`[API] [admin/upload-multiple]: Generated ${uploads.length} placeholder URLs`);
      
      return res.status(200).json({ 
        ok: true, 
        uploads,
        count: uploads.length,
        message: 'Upload múltiplo simulado - integração com Supabase Storage pendente'
      });
    }

    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  } catch (e: any) {
    console.error(`[API] [admin/upload-multiple]: Unexpected error:`, e);
    return res.status(500).json({ ok: false, error: e?.message || 'Internal Server Error' });
  }
}
