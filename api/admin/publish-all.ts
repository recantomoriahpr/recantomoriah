// api/admin/publish-all.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(url, serviceKey);

const tables = [
  'site_settings',
  'hero_slides', 
  'benefit_cards',
  'testimonials',
  'info_cards',
  'gallery_albums',
  'gallery_images',
  'footer_links',
  'contact_info'
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    console.log(`[API] [admin/publish-all]: ${req.method} request`);

    if (req.method === 'POST') {
      const results: Array<{table: string, success: boolean, error?: string, count: number}> = [];
      const publishedAt = new Date().toISOString();

      for (const table of tables) {
        try {
          const { data, error } = await supabase
            .from(table)
            .update({ 
              is_published: true,
              published_at: publishedAt
            })
            .is('deleted_at', null)
            .select('id');

          if (error) {
            console.error(`[API] [admin/publish-all]: Error publishing ${table}:`, error);
            results.push({ table, success: false, error: error.message, count: 0 });
          } else {
            console.log(`[API] [admin/publish-all]: Published ${data?.length || 0} items in ${table}`);
            results.push({ table, success: true, count: data?.length || 0 });
          }
        } catch (e: any) {
          console.error(`[API] [admin/publish-all]: Exception publishing ${table}:`, e);
          results.push({ table, success: false, error: e.message, count: 0 });
        }
      }

      const totalCount = results.reduce((sum, r) => sum + (r.count || 0), 0);
      const successCount = results.filter(r => r.success).length;
      
      console.log(`[API] [admin/publish-all]: Published ${totalCount} total items across ${successCount}/${tables.length} tables`);
      
      return res.status(200).json({ 
        ok: true, 
        results,
        summary: {
          totalItems: totalCount,
          successfulTables: successCount,
          totalTables: tables.length,
          publishedAt
        }
      });
    }

    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  } catch (e: any) {
    console.error(`[API] [admin/publish-all]: Unexpected error:`, e);
    return res.status(500).json({ ok: false, error: e?.message || 'Internal Server Error' });
  }
}
