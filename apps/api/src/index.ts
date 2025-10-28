import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { getSupabaseService } from './lib/supabase';

import authRoutes from './routes/auth';
import publicRoutes from './routes/public';
import uploadRoutes from './routes/upload';
import siteSettingsRoutes from './routes/siteSettings';
import heroSlidesRoutes from './routes/heroSlides';
import benefitCardsRoutes from './routes/benefitCards';
import galleryAlbumsRoutes from './routes/galleryAlbums';
import galleryImagesRoutes from './routes/galleryImages';
import testimonialsRoutes from './routes/testimonials';
import infoCardsRoutes from './routes/infoCards';
import contactsRoutes from './routes/contacts';
import contactInfoRoutes from './routes/contactInfo';
import schedulesRoutes from './routes/schedules';
import footerLinksRoutes from './routes/footerLinks';

const app = express();

// Security & middleware
app.use(helmet());

const allowedOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

// In dev, allow any localhost port for CORS (when not using proxy)
const isDev = process.env.NODE_ENV !== 'production';
const corsOrigin = isDev
  ? [/^http:\/\/localhost:\d+$/, /^http:\/\/127\.0\.0\.1:\d+$/]
  : allowedOrigins;

app.use(
  cors({
    origin: corsOrigin,
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Routes
app.use('/auth', authRoutes);
app.use('/public', publicRoutes);
app.use('/admin', uploadRoutes);
app.use('/admin', siteSettingsRoutes);
app.use('/admin', heroSlidesRoutes);
app.use('/admin', benefitCardsRoutes);
app.use('/admin', galleryAlbumsRoutes);
app.use('/admin', galleryImagesRoutes);
app.use('/admin', testimonialsRoutes);
app.use('/admin', infoCardsRoutes);
app.use('/admin', contactsRoutes);
app.use('/admin', contactInfoRoutes);
app.use('/admin', schedulesRoutes);
app.use('/admin', footerLinksRoutes);

// Publish all sections at once
app.post('/admin/publish-all', async (_req, res) => {
  try {
    const supabase = getSupabaseService();
    const tables = [
      'site_settings',
      'hero_slides',
      'benefit_cards',
      'gallery_albums',
      'gallery_images',
      'testimonials',
      'info_cards',
      'schedules',
      'footer_links',
      'contact_info',
    ];

    const results = await Promise.allSettled(
      tables.map((table) =>
        supabase
          .from(table)
          .update({ is_published: true })
          .is('deleted_at', null)
      )
    );

    const errors = results.filter((r) => r.status === 'rejected');
    if (errors.length) {
      console.error('[POST /admin/publish-all] some updates failed:', errors);
    }

    return res.json({ ok: true, message: 'All sections published' });
  } catch (err) {
    console.error('[POST /admin/publish-all] unexpected:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Health check (optional)
app.get('/health', (_req, res) => res.json({ ok: true }));

// Error handling
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[ERROR]', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = Number(process.env.PORT || 8080);
app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
