import { pgTable, uuid, text, boolean, timestamp, integer, varchar, index } from 'drizzle-orm/pg-core';

/**
 * ===============================================================
 * SITE SETTINGS - Configurações globais do site (singleton)
 * ===============================================================
 */
export const siteSettings = pgTable('site_settings', {
  id: uuid('id').primaryKey().defaultRandom(),
  
  // Visual/Branding
  logo_url: text('logo_url'),
  primary_color: varchar('primary_color', { length: 50 }),
  secondary_color: varchar('secondary_color', { length: 50 }),
  accent_color: varchar('accent_color', { length: 50 }),
  background_color: varchar('background_color', { length: 50 }),
  font_family: varchar('font_family', { length: 100 }),
  
  // Section titles
  benefits_title: varchar('benefits_title', { length: 255 }),
  benefits_subtitle: text('benefits_subtitle'),
  gallery_title: varchar('gallery_title', { length: 255 }),
  gallery_subtitle: text('gallery_subtitle'),
  testimonials_title: varchar('testimonials_title', { length: 255 }),
  testimonials_subtitle: text('testimonials_subtitle'),
  info_title: varchar('info_title', { length: 255 }),
  info_subtitle: text('info_subtitle'),
  
  // Publishing control
  is_published: boolean('is_published').notNull().default(false),
  published_at: timestamp('published_at', { withTimezone: true }),
  
  // Metadata
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  deleted_at: timestamp('deleted_at', { withTimezone: true }),
}, (table) => ({
  isPublishedIdx: index('idx_site_settings_is_published').on(table.is_published),
}));

/**
 * ===============================================================
 * HERO SLIDES - Slides do carrossel principal/hero
 * ===============================================================
 */
export const heroSlides = pgTable('hero_slides', {
  id: uuid('id').primaryKey().defaultRandom(),
  
  // Content
  image_url: text('image_url').notNull(), // URL da imagem do slide
  title: varchar('title', { length: 255 }),
  subtitle: text('subtitle'),
  cta_text: varchar('cta_text', { length: 100 }), // Call-to-action text
  cta_link: text('cta_link'), // Call-to-action link
  
  // Ordering & Publishing
  order: integer('order').notNull().default(0),
  is_published: boolean('is_published').notNull().default(false),
  
  // Metadata
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  deleted_at: timestamp('deleted_at', { withTimezone: true }),
}, (table) => ({
  orderIdx: index('idx_hero_slides_order').on(table.order),
  isPublishedIdx: index('idx_hero_slides_is_published').on(table.is_published),
}));

/**
 * ===============================================================
 * BENEFIT CARDS - Cards de benefícios/vantagens
 * ===============================================================
 */
export const benefitCards = pgTable('benefit_cards', {
  id: uuid('id').primaryKey().defaultRandom(),
  
  // Content
  icon_key: varchar('icon_key', { length: 100 }).notNull(), // Lucide icon key
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  
  // Ordering & Publishing
  order: integer('order').notNull().default(0),
  is_published: boolean('is_published').notNull().default(false),
  
  // Metadata
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  deleted_at: timestamp('deleted_at', { withTimezone: true }),
}, (table) => ({
  orderIdx: index('idx_benefit_cards_order').on(table.order),
  isPublishedIdx: index('idx_benefit_cards_is_published').on(table.is_published),
}));

/**
 * ===============================================================
 * GALLERY ALBUMS - Álbuns/categorias de fotos
 * ===============================================================
 */
export const galleryAlbums = pgTable('gallery_albums', {
  id: uuid('id').primaryKey().defaultRandom(),
  
  // Content
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(), // Para URLs amigáveis
  
  // Ordering & Publishing
  order: integer('order').notNull().default(0),
  is_published: boolean('is_published').notNull().default(false),
  
  // Metadata
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  deleted_at: timestamp('deleted_at', { withTimezone: true }),
}, (table) => ({
  slugIdx: index('idx_gallery_albums_slug').on(table.slug),
  orderIdx: index('idx_gallery_albums_order').on(table.order),
  isPublishedIdx: index('idx_gallery_albums_is_published').on(table.is_published),
}));

/**
 * ===============================================================
 * GALLERY IMAGES - Imagens das galerias
 * ===============================================================
 */
export const galleryImages = pgTable('gallery_images', {
  id: uuid('id').primaryKey().defaultRandom(),
  
  // Relationships
  album_id: uuid('album_id').notNull().references(() => galleryAlbums.id, { onDelete: 'cascade' }),
  
  // Content
  url: text('url').notNull(), // URL da imagem
  alt: varchar('alt', { length: 255 }).notNull(), // Texto alternativo
  caption: text('caption'), // Legenda opcional
  external_link: text('external_link'), // Link externo (ex: Drive, YouTube, etc)
  
  // Ordering & Publishing
  order: integer('order').notNull().default(0),
  is_published: boolean('is_published').notNull().default(false),
  
  // Metadata
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  deleted_at: timestamp('deleted_at', { withTimezone: true }),
}, (table) => ({
  albumIdIdx: index('idx_gallery_images_album_id').on(table.album_id),
  orderIdx: index('idx_gallery_images_order').on(table.order),
  isPublishedIdx: index('idx_gallery_images_is_published').on(table.is_published),
}));

/**
 * ===============================================================
 * TESTIMONIALS - Depoimentos de clientes
 * ===============================================================
 */
export const testimonials = pgTable('testimonials', {
  id: uuid('id').primaryKey().defaultRandom(),
  
  // Content
  name: varchar('name', { length: 255 }).notNull(),
  role: varchar('role', { length: 255 }), // Cargo/descrição da pessoa
  text: text('text').notNull(), // Texto do depoimento
  rating: integer('rating'), // Avaliação 1-5 estrelas (opcional)
  
  // Ordering & Publishing
  order: integer('order').notNull().default(0),
  is_published: boolean('is_published').notNull().default(false),
  
  // Metadata
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  deleted_at: timestamp('deleted_at', { withTimezone: true }),
}, (table) => ({
  orderIdx: index('idx_testimonials_order').on(table.order),
  isPublishedIdx: index('idx_testimonials_is_published').on(table.is_published),
}));

/**
 * ===============================================================
 * INFO CARDS - Cards informativos
 * ===============================================================
 */
export const infoCards = pgTable('info_cards', {
  id: uuid('id').primaryKey().defaultRandom(),
  
  // Content
  icon_key: varchar('icon_key', { length: 100 }).notNull(), // Lucide icon key
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  
  // Ordering & Publishing
  order: integer('order').notNull().default(0),
  is_published: boolean('is_published').notNull().default(false),
  
  // Metadata
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  deleted_at: timestamp('deleted_at', { withTimezone: true }),
}, (table) => ({
  orderIdx: index('idx_info_cards_order').on(table.order),
  isPublishedIdx: index('idx_info_cards_is_published').on(table.is_published),
}));

/**
 * ===============================================================
 * CONTACTS - Mensagens/formulários de contato recebidos
 * ===============================================================
 */
export const contacts = pgTable('contacts', {
  id: uuid('id').primaryKey().defaultRandom(),
  
  // Contact data
  phone: varchar('phone', { length: 50 }),
  whatsapp_e164: varchar('whatsapp_e164', { length: 50 }), // Formato internacional
  email: varchar('email', { length: 255 }),
  endereco_principal: text('endereco_principal'),
  complemento: varchar('complemento', { length: 255 }),
  link_mapa: text('link_mapa'), // Link do Google Maps
  
  // Publishing (para moderação)
  is_published: boolean('is_published').notNull().default(false),
  
  // Metadata
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  deleted_at: timestamp('deleted_at', { withTimezone: true }),
}, (table) => ({
  isPublishedIdx: index('idx_contacts_is_published').on(table.is_published),
  createdAtIdx: index('idx_contacts_created_at').on(table.created_at),
}));

/**
 * ===============================================================
 * SCHEDULES - Horários/agendamentos
 * ===============================================================
 */
export const schedules = pgTable('schedules', {
  id: uuid('id').primaryKey().defaultRandom(),
  
  // Content
  title: varchar('title', { length: 255 }),
  description: text('description'),
  footer: text('footer'), // Informação adicional/rodapé
  
  // Ordering & Publishing
  order: integer('order').notNull().default(0),
  is_published: boolean('is_published').notNull().default(false),
  
  // Metadata
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  deleted_at: timestamp('deleted_at', { withTimezone: true }),
}, (table) => ({
  orderIdx: index('idx_schedules_order').on(table.order),
  isPublishedIdx: index('idx_schedules_is_published').on(table.is_published),
}));

/**
 * ===============================================================
 * FOOTER LINKS - Links do rodapé
 * ===============================================================
 */
export const footerLinks = pgTable('footer_links', {
  id: uuid('id').primaryKey().defaultRandom(),
  
  // Content
  label: varchar('label', { length: 255 }).notNull(),
  url: text('url').notNull(),
  category: varchar('category', { length: 100 }), // Para agrupar links (ex: "legal", "social")
  
  // Ordering & Publishing
  order: integer('order').notNull().default(0),
  is_published: boolean('is_published').notNull().default(false),
  
  // Metadata
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  deleted_at: timestamp('deleted_at', { withTimezone: true }),
}, (table) => ({
  categoryIdx: index('idx_footer_links_category').on(table.category),
  orderIdx: index('idx_footer_links_order').on(table.order),
  isPublishedIdx: index('idx_footer_links_is_published').on(table.is_published),
}));

/**
 * ===============================================================
 * CONTACT INFO - Informações de contato globais (singleton)
 * Deve existir apenas 1 registro publicado
 * ===============================================================
 */
export const contactInfo = pgTable('contact_info', {
  id: uuid('id').primaryKey().defaultRandom(),
  
  // Contact Information
  phone: varchar('phone', { length: 50 }),
  whatsapp: varchar('whatsapp', { length: 50 }), // Formato display (ex: "(11) 99999-9999")
  email: varchar('email', { length: 255 }),
  
  // Address Information
  address: text('address'),
  address_complement: varchar('address_complement', { length: 255 }),
  address_reference: text('address_reference'),
  gps_coordinates: text('gps_coordinates'), // Link do Google Maps
  
  // Business Hours
  weekday_hours: varchar('weekday_hours', { length: 100 }),
  saturday_hours: varchar('saturday_hours', { length: 100 }),
  sunday_hours: varchar('sunday_hours', { length: 100 }),
  response_time: text('response_time'),
  
  // Social Media
  instagram: varchar('instagram', { length: 255 }),
  facebook: varchar('facebook', { length: 255 }),
  linkedin: varchar('linkedin', { length: 255 }),
  twitter: varchar('twitter', { length: 255 }),
  
  // Footer Brand Data
  footer_brand_title: varchar('footer_brand_title', { length: 255 }),
  footer_brand_description: text('footer_brand_description'),
  footer_copyright_text: varchar('footer_copyright_text', { length: 255 }),
  footer_privacy_policy_text: varchar('footer_privacy_policy_text', { length: 100 }),
  footer_terms_of_use_text: varchar('footer_terms_of_use_text', { length: 100 }),
  
  // Publishing Control
  is_published: boolean('is_published').notNull().default(false),
  
  // Metadata
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  deleted_at: timestamp('deleted_at', { withTimezone: true }),
}, (table) => ({
  isPublishedIdx: index('idx_contact_info_is_published').on(table.is_published),
}));
