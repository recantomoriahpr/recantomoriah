/**
 * EXEMPLOS DE USO DO DRIZZLE ORM
 * Demonstrações práticas de queries para o projeto Moriah
 */

import { db } from './src/db';
import { 
  heroSlides, 
  benefitCards, 
  galleryAlbums, 
  galleryImages,
  testimonials,
  siteSettings,
  contactInfo,
} from './src/db/schema';
import { eq, isNull, desc, asc, and } from 'drizzle-orm';

// =====================================================
// 1. BUSCAR HERO SLIDES PUBLICADOS (ordenados)
// =====================================================
export async function getPublishedHeroSlides() {
  const slides = await db
    .select()
    .from(heroSlides)
    .where(
      and(
        eq(heroSlides.is_published, true),
        isNull(heroSlides.deleted_at)
      )
    )
    .orderBy(asc(heroSlides.order));

  return slides;
}

// =====================================================
// 2. CRIAR NOVO BENEFIT CARD
// =====================================================
export async function createBenefitCard(data: {
  icon_key: string;
  title: string;
  description?: string;
  order?: number;
}) {
  // Buscar o maior order atual
  const maxOrder = await db
    .select({ maxOrder: heroSlides.order })
    .from(benefitCards)
    .where(isNull(benefitCards.deleted_at))
    .orderBy(desc(benefitCards.order))
    .limit(1);

  const nextOrder = maxOrder.length > 0 ? (maxOrder[0].maxOrder ?? 0) + 1 : 0;

  const [newCard] = await db
    .insert(benefitCards)
    .values({
      icon_key: data.icon_key,
      title: data.title,
      description: data.description,
      order: data.order ?? nextOrder,
      is_published: false,
    })
    .returning();

  return newCard;
}

// =====================================================
// 3. ATUALIZAR BENEFIT CARD
// =====================================================
export async function updateBenefitCard(
  id: string,
  data: Partial<{ title: string; description: string; order: number }>
) {
  const [updated] = await db
    .update(benefitCards)
    .set(data)
    .where(eq(benefitCards.id, id))
    .returning();

  return updated;
}

// =====================================================
// 4. SOFT DELETE (marcar como deletado)
// =====================================================
export async function deleteBenefitCard(id: string) {
  const [deleted] = await db
    .update(benefitCards)
    .set({ deleted_at: new Date() })
    .where(eq(benefitCards.id, id))
    .returning();

  return deleted;
}

// =====================================================
// 5. PUBLICAR TODOS OS CARDS
// =====================================================
export async function publishAllBenefitCards() {
  const published = await db
    .update(benefitCards)
    .set({ is_published: true })
    .where(isNull(benefitCards.deleted_at))
    .returning();

  return published;
}

// =====================================================
// 6. BUSCAR ÁLBUNS COM SUAS IMAGENS
// =====================================================
export async function getAlbumsWithImages() {
  // Buscar álbuns publicados
  const albums = await db
    .select()
    .from(galleryAlbums)
    .where(
      and(
        eq(galleryAlbums.is_published, true),
        isNull(galleryAlbums.deleted_at)
      )
    )
    .orderBy(asc(galleryAlbums.order));

  // Para cada álbum, buscar imagens
  const albumsWithImages = await Promise.all(
    albums.map(async (album) => {
      const images = await db
        .select()
        .from(galleryImages)
        .where(
          and(
            eq(galleryImages.album_id, album.id),
            eq(galleryImages.is_published, true),
            isNull(galleryImages.deleted_at)
          )
        )
        .orderBy(asc(galleryImages.order));

      return {
        ...album,
        images,
      };
    })
  );

  return albumsWithImages;
}

// =====================================================
// 7. ADICIONAR IMAGEM A UM ÁLBUM
// =====================================================
export async function addImageToAlbum(albumId: string, data: {
  url: string;
  alt: string;
  caption?: string;
}) {
  // Buscar maior order do álbum
  const maxOrder = await db
    .select({ maxOrder: galleryImages.order })
    .from(galleryImages)
    .where(
      and(
        eq(galleryImages.album_id, albumId),
        isNull(galleryImages.deleted_at)
      )
    )
    .orderBy(desc(galleryImages.order))
    .limit(1);

  const nextOrder = maxOrder.length > 0 ? (maxOrder[0].maxOrder ?? 0) + 1 : 0;

  const [newImage] = await db
    .insert(galleryImages)
    .values({
      album_id: albumId,
      url: data.url,
      alt: data.alt,
      caption: data.caption,
      order: nextOrder,
      is_published: false,
    })
    .returning();

  return newImage;
}

// =====================================================
// 8. BUSCAR CONFIGURAÇÕES DO SITE (singleton)
// =====================================================
export async function getSiteSettings() {
  const [settings] = await db
    .select()
    .from(siteSettings)
    .where(
      and(
        eq(siteSettings.is_published, true),
        isNull(siteSettings.deleted_at)
      )
    )
    .orderBy(desc(siteSettings.published_at))
    .limit(1);

  return settings || null;
}

// =====================================================
// 9. ATUALIZAR CONFIGURAÇÕES DO SITE
// =====================================================
export async function updateSiteSettings(data: {
  logo_url?: string;
  primary_color?: string;
  benefits_title?: string;
  // ... outros campos
}) {
  // Buscar registro existente
  const existing = await db
    .select()
    .from(siteSettings)
    .where(isNull(siteSettings.deleted_at))
    .limit(1);

  if (existing.length === 0) {
    // Criar novo se não existir
    const [created] = await db
      .insert(siteSettings)
      .values({
        ...data,
        is_published: false,
      })
      .returning();
    return created;
  }

  // Atualizar existente
  const [updated] = await db
    .update(siteSettings)
    .set(data)
    .where(eq(siteSettings.id, existing[0].id))
    .returning();

  return updated;
}

// =====================================================
// 10. BUSCAR CONTACT INFO (singleton)
// =====================================================
export async function getContactInfo() {
  const [info] = await db
    .select()
    .from(contactInfo)
    .where(
      and(
        eq(contactInfo.is_published, true),
        isNull(contactInfo.deleted_at)
      )
    )
    .orderBy(desc(contactInfo.created_at))
    .limit(1);

  return info || null;
}

// =====================================================
// 11. BUSCAR DEPOIMENTOS COM FILTRO DE RATING
// =====================================================
export async function getTestimonialsByRating(minRating: number = 4) {
  const testimonialsList = await db
    .select()
    .from(testimonials)
    .where(
      and(
        eq(testimonials.is_published, true),
        isNull(testimonials.deleted_at),
        // Rating >= minRating (se não for null)
      )
    )
    .orderBy(asc(testimonials.order));

  // Filtrar por rating (porque Drizzle não tem operador >= direto em todos os casos)
  return testimonialsList.filter(t => !t.rating || t.rating >= minRating);
}

// =====================================================
// 12. CONTAR ITEMS PUBLICADOS
// =====================================================
export async function countPublishedItems() {
  const [benefitCount] = await db
    .select({ count: benefitCards.id })
    .from(benefitCards)
    .where(
      and(
        eq(benefitCards.is_published, true),
        isNull(benefitCards.deleted_at)
      )
    );

  const [slideCount] = await db
    .select({ count: heroSlides.id })
    .from(heroSlides)
    .where(
      and(
        eq(heroSlides.is_published, true),
        isNull(heroSlides.deleted_at)
      )
    );

  return {
    benefits: benefitCount,
    slides: slideCount,
  };
}

// =====================================================
// 13. BUSCAR TODOS OS DADOS PÚBLICOS (como a rota /public)
// =====================================================
export async function getAllPublicData() {
  const [
    settings,
    slides,
    benefits,
    albums,
    images,
    testimonialsList,
    info,
  ] = await Promise.all([
    getSiteSettings(),
    getPublishedHeroSlides(),
    db.select().from(benefitCards)
      .where(and(eq(benefitCards.is_published, true), isNull(benefitCards.deleted_at)))
      .orderBy(asc(benefitCards.order)),
    db.select().from(galleryAlbums)
      .where(and(eq(galleryAlbums.is_published, true), isNull(galleryAlbums.deleted_at)))
      .orderBy(asc(galleryAlbums.order)),
    db.select().from(galleryImages)
      .where(and(eq(galleryImages.is_published, true), isNull(galleryImages.deleted_at)))
      .orderBy(asc(galleryImages.order)),
    db.select().from(testimonials)
      .where(and(eq(testimonials.is_published, true), isNull(testimonials.deleted_at)))
      .orderBy(asc(testimonials.order)),
    getContactInfo(),
  ]);

  return {
    siteSettings: settings,
    heroSlides: slides,
    benefitCards: benefits,
    galleryAlbums: albums,
    galleryImages: images,
    testimonials: testimonialsList,
    contactInfo: info,
  };
}

// =====================================================
// EXEMPLO DE USO
// =====================================================
async function example() {
  try {
    // 1. Buscar slides
    const slides = await getPublishedHeroSlides();
    console.log('Slides:', slides);

    // 2. Criar benefit card
    const newCard = await createBenefitCard({
      icon_key: 'Leaf',
      title: 'Área Verde',
      description: 'Natureza exuberante',
    });
    console.log('Novo card:', newCard);

    // 3. Buscar álbuns com imagens
    const albums = await getAlbumsWithImages();
    console.log('Álbuns:', albums);

    // 4. Buscar todos os dados públicos
    const publicData = await getAllPublicData();
    console.log('Dados públicos:', publicData);

  } catch (error) {
    console.error('Erro:', error);
  }
}

// Descomente para executar o exemplo:
// example();
