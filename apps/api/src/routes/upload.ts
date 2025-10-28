import { Router, type Request, type Response } from 'express';
import multer, { type FileFilterCallback } from 'multer';
import { randomUUID } from 'crypto';
import { getSupabaseService } from '../lib/supabase';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (_req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype);
    if (allowed) {
      return cb(null, true);
    }
    return cb(new Error('Invalid file type'));
  },
});

const BUCKET = 'recanto-moriah';

// Upload único
router.post('/upload', upload.single('file'), async (req: Request, res: Response) => {
  try {
    const file = req.file as Express.Multer.File | undefined;
    if (!file) {
      return res.status(400).json({ error: 'Missing file field "file" in multipart form-data' });
    }

    const supabase = getSupabaseService();

    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    const objectPath = `${new Date().toISOString().replace(/[:.]/g, '-')}-${randomUUID()}-${safeName}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(objectPath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (uploadError) {
      console.error('[upload] upload error', uploadError);
      return res.status(500).json({ error: 'Failed to upload file' });
    }

    const { data: publicData } = supabase.storage.from(BUCKET).getPublicUrl(objectPath);

    return res.json({
      url: publicData.publicUrl,
      bucket: BUCKET,
      path: objectPath,
    });
  } catch (err) {
    console.error('[upload] unexpected error', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Upload múltiplo (até 10 imagens)
router.post('/upload-multiple', upload.array('files', 10), async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[] | undefined;
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files provided' });
    }

    const supabase = getSupabaseService();
    const results = [];

    for (const file of files) {
      const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
      const objectPath = `${new Date().toISOString().replace(/[:.]/g, '-')}-${randomUUID()}-${safeName}`;

      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(objectPath, file.buffer, {
          contentType: file.mimetype,
          upsert: false,
        });

      if (uploadError) {
        console.error('[upload-multiple] upload error', uploadError);
        results.push({
          filename: file.originalname,
          success: false,
          error: 'Failed to upload',
        });
        continue;
      }

      const { data: publicData } = supabase.storage.from(BUCKET).getPublicUrl(objectPath);

      results.push({
        filename: file.originalname,
        success: true,
        url: publicData.publicUrl,
        bucket: BUCKET,
        path: objectPath,
      });
    }

    return res.json({
      results,
      successCount: results.filter(r => r.success).length,
      totalCount: files.length,
    });
  } catch (err) {
    console.error('[upload-multiple] unexpected error', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
