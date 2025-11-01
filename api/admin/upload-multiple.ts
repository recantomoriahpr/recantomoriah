// api/admin/upload-multiple.ts
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

interface UploadResult {
  success: boolean;
  url?: string;
  path?: string;
  filename: string;
  error?: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    console.log(`[API] [admin/upload-multiple]: ${req.method} request`);

    if (req.method !== 'POST') {
      return res.status(405).json({ ok: false, error: 'Method not allowed' });
    }

    const supabase = getSupabaseClient();
    const bucket = process.env.SUPABASE_BUCKET || 'recanto-moriah';

    return new Promise<void>((resolve, reject) => {
      const bb = busboy({ headers: req.headers as any });
      const results: UploadResult[] = [];
      const filePromises: Promise<void>[] = [];
      const MAX_FILES = 10;
      let fileCount = 0;

      bb.on('file', (fieldname, file, info) => {
        fileCount++;
        
        if (fileCount > MAX_FILES) {
          file.resume(); // Descartar arquivo extra
          return;
        }

        const { filename, mimeType } = info;
        
        const filePromise = new Promise<void>((resolveFile) => {
          // Validar tipo de arquivo
          const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
          if (!allowedTypes.includes(mimeType)) {
            file.resume();
            results.push({
              success: false,
              filename,
              error: 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.',
            });
            resolveFile();
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
                results.push({
                  success: false,
                  filename,
                  error: 'File too large. Maximum size is 10MB.',
                });
                resolveFile();
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
                console.error('[upload-multiple] Supabase upload error:', uploadError);
                results.push({
                  success: false,
                  filename: safeName,
                  error: 'Failed to upload file to storage',
                });
                resolveFile();
                return;
              }

              // Obter URL pública
              const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(objectPath);

              console.log(`[API] [admin/upload-multiple]: Upload successful: ${publicData.publicUrl}`);

              results.push({
                success: true,
                url: publicData.publicUrl,
                path: objectPath,
                filename: safeName,
              });

              resolveFile();
            } catch (err: any) {
              console.error('[upload-multiple] Error processing file:', err);
              results.push({
                success: false,
                filename,
                error: err?.message || 'Internal Server Error',
              });
              resolveFile();
            }
          });

          file.on('error', (err) => {
            console.error('[upload-multiple] File stream error:', err);
            results.push({
              success: false,
              filename,
              error: 'Error reading file stream',
            });
            resolveFile();
          });
        });

        filePromises.push(filePromise);
      });

      bb.on('finish', async () => {
        // Aguardar todos os uploads
        await Promise.all(filePromises);

        if (results.length === 0) {
          res.status(400).json({ 
            ok: false, 
            error: 'No files uploaded. Expected field name: "files"',
          });
          resolve();
          return;
        }

        // Filtrar apenas uploads bem-sucedidos para compatibilidade com front-end
        const uploads = results
          .filter(r => r.success && r.url)
          .map(r => ({
            url: r.url!,
            filename: r.filename,
            path: r.path || '',
          }));

        const successCount = uploads.length;
        const failedCount = results.length - successCount;

        // Log interno para debug
        console.log(`[API] [admin/upload-multiple]: Processed ${results.length} files, ${successCount} successful, ${failedCount} failed`);
        if (failedCount > 0) {
          const failures = results.filter(r => !r.success);
          console.warn('[API] [admin/upload-multiple]: Failed uploads:', failures);
        }

        res.status(200).json({
          ok: true,
          uploads,
          count: uploads.length,
        });

        resolve();
      });

      bb.on('error', (err) => {
        console.error('[upload-multiple] Busboy error:', err);
        res.status(500).json({ ok: false, error: 'Error parsing multipart data' });
        reject(err);
      });

      req.pipe(bb);
    });
  } catch (e: any) {
    console.error(`[API] [admin/upload-multiple]: Unexpected error:`, e);
    return res.status(500).json({ ok: false, error: e?.message || 'Internal Server Error' });
  }
}
