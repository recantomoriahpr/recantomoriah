CREATE TABLE "benefit_cards" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"icon_key" varchar(100) NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"order" integer DEFAULT 0 NOT NULL,
	"is_published" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "contact_info" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"phone" varchar(50),
	"whatsapp" varchar(50),
	"email" varchar(255),
	"address" text,
	"address_complement" varchar(255),
	"address_reference" text,
	"gps_coordinates" text,
	"weekday_hours" varchar(100),
	"saturday_hours" varchar(100),
	"sunday_hours" varchar(100),
	"response_time" text,
	"instagram" varchar(255),
	"facebook" varchar(255),
	"linkedin" varchar(255),
	"twitter" varchar(255),
	"footer_brand_title" varchar(255),
	"footer_brand_description" text,
	"footer_copyright_text" varchar(255),
	"footer_privacy_policy_text" varchar(100),
	"footer_terms_of_use_text" varchar(100),
	"is_published" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "contacts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"phone" varchar(50),
	"whatsapp_e164" varchar(50),
	"email" varchar(255),
	"endereco_principal" text,
	"complemento" varchar(255),
	"link_mapa" text,
	"is_published" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "footer_links" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"label" varchar(255) NOT NULL,
	"url" text NOT NULL,
	"category" varchar(100),
	"order" integer DEFAULT 0 NOT NULL,
	"is_published" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "gallery_albums" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"is_published" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "gallery_albums_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "gallery_images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"album_id" uuid NOT NULL,
	"url" text NOT NULL,
	"alt" varchar(255) NOT NULL,
	"caption" text,
	"order" integer DEFAULT 0 NOT NULL,
	"is_published" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "hero_slides" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"image_url" text NOT NULL,
	"title" varchar(255),
	"subtitle" text,
	"cta_text" varchar(100),
	"cta_link" text,
	"order" integer DEFAULT 0 NOT NULL,
	"is_published" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "info_cards" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"icon_key" varchar(100) NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"order" integer DEFAULT 0 NOT NULL,
	"is_published" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "schedules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255),
	"description" text,
	"footer" text,
	"order" integer DEFAULT 0 NOT NULL,
	"is_published" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "site_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"logo_url" text,
	"primary_color" varchar(50),
	"secondary_color" varchar(50),
	"accent_color" varchar(50),
	"background_color" varchar(50),
	"font_family" varchar(100),
	"benefits_title" varchar(255),
	"benefits_subtitle" text,
	"gallery_title" varchar(255),
	"gallery_subtitle" text,
	"testimonials_title" varchar(255),
	"testimonials_subtitle" text,
	"info_title" varchar(255),
	"info_subtitle" text,
	"is_published" boolean DEFAULT false NOT NULL,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "testimonials" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"role" varchar(255),
	"text" text NOT NULL,
	"rating" integer,
	"order" integer DEFAULT 0 NOT NULL,
	"is_published" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "gallery_images" ADD CONSTRAINT "gallery_images_album_id_gallery_albums_id_fk" FOREIGN KEY ("album_id") REFERENCES "public"."gallery_albums"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_benefit_cards_order" ON "benefit_cards" USING btree ("order");--> statement-breakpoint
CREATE INDEX "idx_benefit_cards_is_published" ON "benefit_cards" USING btree ("is_published");--> statement-breakpoint
CREATE INDEX "idx_contact_info_is_published" ON "contact_info" USING btree ("is_published");--> statement-breakpoint
CREATE INDEX "idx_contacts_is_published" ON "contacts" USING btree ("is_published");--> statement-breakpoint
CREATE INDEX "idx_contacts_created_at" ON "contacts" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_footer_links_category" ON "footer_links" USING btree ("category");--> statement-breakpoint
CREATE INDEX "idx_footer_links_order" ON "footer_links" USING btree ("order");--> statement-breakpoint
CREATE INDEX "idx_footer_links_is_published" ON "footer_links" USING btree ("is_published");--> statement-breakpoint
CREATE INDEX "idx_gallery_albums_slug" ON "gallery_albums" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "idx_gallery_albums_order" ON "gallery_albums" USING btree ("order");--> statement-breakpoint
CREATE INDEX "idx_gallery_albums_is_published" ON "gallery_albums" USING btree ("is_published");--> statement-breakpoint
CREATE INDEX "idx_gallery_images_album_id" ON "gallery_images" USING btree ("album_id");--> statement-breakpoint
CREATE INDEX "idx_gallery_images_order" ON "gallery_images" USING btree ("order");--> statement-breakpoint
CREATE INDEX "idx_gallery_images_is_published" ON "gallery_images" USING btree ("is_published");--> statement-breakpoint
CREATE INDEX "idx_hero_slides_order" ON "hero_slides" USING btree ("order");--> statement-breakpoint
CREATE INDEX "idx_hero_slides_is_published" ON "hero_slides" USING btree ("is_published");--> statement-breakpoint
CREATE INDEX "idx_info_cards_order" ON "info_cards" USING btree ("order");--> statement-breakpoint
CREATE INDEX "idx_info_cards_is_published" ON "info_cards" USING btree ("is_published");--> statement-breakpoint
CREATE INDEX "idx_schedules_order" ON "schedules" USING btree ("order");--> statement-breakpoint
CREATE INDEX "idx_schedules_is_published" ON "schedules" USING btree ("is_published");--> statement-breakpoint
CREATE INDEX "idx_site_settings_is_published" ON "site_settings" USING btree ("is_published");--> statement-breakpoint
CREATE INDEX "idx_testimonials_order" ON "testimonials" USING btree ("order");--> statement-breakpoint
CREATE INDEX "idx_testimonials_is_published" ON "testimonials" USING btree ("is_published");