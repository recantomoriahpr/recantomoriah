// api/admin/upload.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import busboy from 'busboy';
import { randomUUID } from 'crypto';

// Desabilitar bodyParser para streaming
export const config = {
  api: {
    bodyParser: false,
  },
};

function getSupabaseClient() {
  const url = process.env.SUPABASE_URL || '';
  const key = process.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  if (!url || !key) {
    throw new Error('Missing Supabase env vars');
  }
  return createClient(url, key);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    console.log(`[API] [admin/upload]: ${req.method} request`);

    if (req.method !== 'POST') {
      res.setHeader('Content-Type', 'application/json');
      return res.status(405).json({ ok: false, error: 'Method not allowed' });
    }

    res.setHeader('Content-Type', 'application/json');

    // Validate Content-Type for multipart/form-data
    const contentType = (req.headers['content-type'] || '').toString();
    if (!contentType.toLowerCase().startsWith('multipart/form-data')) {
      return res.status(400).json({ ok: false, error: 'Invalid Content-Type. Expected multipart/form-data' });
    }

    return new Promise<void>((resolve, reject) => {
      const bb = busboy({ headers: req.headers as any });
      const detectedFields: string[] = [];
      const detectedFiles: { field: string; filename: string; mime: string; size?: number }[] = [];
      let receivedFileBuffer: Buffer | null = null;
      let receivedMeta: { filename: string; mimeType: string; field: string } | null = null;
      let receivedSize = 0;

      const ACCEPT_FIELDS = new Set(['file', 'image', 'logo']);

      bb.on('field', (name) => {
        detectedFields.push(name);
      });

      bb.on('file', async (fieldname, file, info) => {
        try {
          const { filename, mimeType } = info;
          detectedFiles.push({ field: fieldname, filename, mime: mimeType });

          if (!ACCEPT_FIELDS.has(fieldname)) {
            console.log('[upload] Ignoring file field:', fieldname);
            file.resume();
            return;
          }

          // Coletar chunks do arquivo (não responder aqui; apenas armazenar)
          const chunks: Buffer[] = [];
          receivedSize = 0;
          file.on('data', (chunk) => {
            chunks.push(chunk);
            receivedSize += Buffer.byteLength(chunk);
          });
          file.on('end', () => {
            if (receivedFileBuffer == null) {
              receivedFileBuffer = Buffer.concat(chunks);
              receivedMeta = { filename, mimeType, field: fieldname };
            }
          });
        } catch (err: any) {
          console.error('[upload] Error in file handler:', err);
          // Não responder aqui; o erro será tratado no 'finish' ou pelo bb.on('error')
        }
      });

      bb.on('finish', async () => {
        try {
          console.log('[upload] Detected fields:', detectedFields);
          console.log('[upload] Detected files:', detectedFiles);

          if (!receivedFileBuffer || !receivedMeta) {
            res.setHeader('Content-Type', 'application/json');
            res.status(400).json({ ok: false, error: 'No file uploaded. Expected field name: "file"' });
            return resolve();
          }

          // Validar envs somente agora (após parse)
          const url = process.env.SUPABASE_URL || '';
          const key = process.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_SERVICE_ROLE_KEY || '';
          const bucket = process.env.SUPABASE_BUCKET || '';
          if (!url || !key || !bucket) {
            res.setHeader('Content-Type', 'application/json');
            res.status(500).json({ ok: false, error: 'Missing Supabase env vars' });
            return resolve();
          }

          const supabase = createClient(url, key);

          // Validar tipo e tamanho aqui
          const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
          if (!allowedTypes.includes(receivedMeta.mimeType)) {
            res.setHeader('Content-Type', 'application/json');
            res.status(400).json({ ok: false, error: 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.' });
            return resolve();
          }
          if (receivedFileBuffer.length > 10 * 1024 * 1024) {
            res.setHeader('Content-Type', 'application/json');
            res.status(400).json({ ok: false, error: 'File too large. Maximum size is 10MB.' });
            return resolve();
          }

          // Gerar nome seguro e path
          const safeName = receivedMeta.filename.replace(/[^a-zA-Z0-9._-]/g, '_');
          const objectPath = `${new Date().toISOString().replace(/[:.]/g, '-')}-${randomUUID()}-${safeName}`;

          // Upload para Supabase Storage
          const { error: uploadError } = await supabase.storage
            .from(bucket)
            .upload(objectPath, receivedFileBuffer, {
              contentType: receivedMeta.mimeType,
              upsert: false,
            });
          if (uploadError) {
            console.error('[upload] Supabase upload error:', uploadError);
            res.setHeader('Content-Type', 'application/json');
            res.status(500).json({ ok: false, error: 'Failed to upload file to storage' });
            return resolve();
          }

          // Obter URL pública
          const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(objectPath);
          console.log(`[API] [admin/upload]: Upload successful for field "file" → ${publicData.publicUrl}`);

          res.setHeader('Content-Type', 'application/json');
          res.status(200).json({
            ok: true,
            url: publicData.publicUrl,
            path: objectPath,
            filename: safeName,
          });
          return resolve();
        } catch (err: any) {
          console.error('[upload] Error on finish:', err);
          res.setHeader('Content-Type', 'application/json');
          res.status(500).json({ ok: false, error: err?.message || 'Internal Server Error' });
          return resolve();
        }
      });

      bb.on('error', (err) => {
        console.error('[upload] Busboy error:', err);
        res.status(500).json({ ok: false, error: 'Error parsing multipart data' });
        reject(err);
      });

      req.pipe(bb);
    });
  } catch (e: any) {
    console.error(`[API] [admin/upload]: Unexpected error:`, e);
    res.setHeader('Content-Type', 'application/json');
    return res.status(500).json({ ok: false, error: e?.message || 'Internal Server Error' });
  }
}
