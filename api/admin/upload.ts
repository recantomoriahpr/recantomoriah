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

    const supabase = getSupabaseClient();
    const bucket = process.env.SUPABASE_BUCKET;
    if (!bucket) {
      return res.status(500).json({ ok: false, error: 'Missing Supabase env vars' });
    }

    return new Promise<void>((resolve, reject) => {
      const bb = busboy({ headers: req.headers as any });
      let fileProcessed = false;
      const detectedFields = new Set<string>();

      bb.on('file', async (fieldname, file, info) => {
        try {
          detectedFields.add(fieldname);
          const normalizedField = fieldname === 'image' ? 'file' : fieldname;

          if (normalizedField !== 'file') {
            // Ignore unexpected file fields
            console.log(`[API] [admin/upload]: Ignoring file field: ${fieldname}`);
            file.resume();
            return;
          }

          const { filename, mimeType } = info;
          
          // Validar tipo de arquivo
          const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
          if (!allowedTypes.includes(mimeType)) {
            file.resume(); // Descartar stream
            res.status(400).json({ ok: false, error: 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.' });
            resolve();
            return;
          }

          // Coletar chunks do arquivo
          const chunks: Buffer[] = [];
          file.on('data', (chunk) => chunks.push(chunk));
          
          file.on('end', async () => {
            try {
              const buffer = Buffer.concat(chunks);
              
              // Validar tamanho (10MB)
              if (buffer.length > 10 * 1024 * 1024) {
                res.status(400).json({ ok: false, error: 'File too large. Maximum size is 10MB.' });
                resolve();
                return;
              }

              // Gerar nome seguro
              const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
              const objectPath = `${new Date().toISOString().replace(/[:.]/g, '-')}-${randomUUID()}-${safeName}`;

              // Upload para Supabase Storage
              const { error: uploadError } = await supabase.storage
                .from(bucket)
                .upload(objectPath, buffer, {
                  contentType: mimeType,
                  upsert: false,
                });

              if (uploadError) {
                console.error('[upload] Supabase upload error:', uploadError);
                res.status(500).json({ ok: false, error: 'Failed to upload file to storage' });
                resolve();
                return;
              }

              // Obter URL pública
              const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(objectPath);

              console.log(`[API] [admin/upload]: Upload successful for field "${normalizedField}" → ${publicData.publicUrl}`);

              res.status(200).json({
                ok: true,
                url: publicData.publicUrl,
                path: objectPath,
                filename: safeName,
              });

              fileProcessed = true;
              resolve();
            } catch (err: any) {
              console.error('[upload] Error processing file:', err);
              res.status(500).json({ ok: false, error: err?.message || 'Internal Server Error' });
              resolve();
            }
          });
        } catch (err: any) {
          console.error('[upload] Error in file handler:', err);
          res.status(500).json({ ok: false, error: err?.message || 'Internal Server Error' });
          resolve();
        }
      });

      bb.on('finish', () => {
        const fieldNames = Array.from(detectedFields.values());
        console.log(`[API] [admin/upload]: Detected file fields: ${fieldNames.join(', ') || '(none)'}`);
        if (!fileProcessed) {
          res.status(400).json({ ok: false, error: 'No file uploaded. Expected field name: "file"' });
          resolve();
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
