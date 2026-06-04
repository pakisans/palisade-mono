import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('sr', 'en');
  CREATE TYPE "public"."enum_users_roles" AS ENUM('admin', 'customer');
  CREATE TYPE "public"."enum_pages_hero_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_pages_hero_links_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum_pages_blocks_banner_style" AS ENUM('info', 'warning', 'error', 'success');
  CREATE TYPE "public"."enum_pages_blocks_cta_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_cta_links_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum_pages_blocks_content_columns_size" AS ENUM('oneThird', 'half', 'twoThirds', 'full');
  CREATE TYPE "public"."enum_pages_blocks_content_columns_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_content_columns_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum_pages_blocks_carousel_populate_by" AS ENUM('collection', 'selection');
  CREATE TYPE "public"."enum_pages_blocks_carousel_relation_to" AS ENUM('products');
  CREATE TYPE "public"."enum_pages_blocks_archive_populate_by" AS ENUM('collection', 'selection');
  CREATE TYPE "public"."enum_pages_blocks_archive_relation_to" AS ENUM('products');
  CREATE TYPE "public"."enum_pages_blocks_code_language" AS ENUM('typescript', 'javascript', 'css');
  CREATE TYPE "public"."enum_pages_blocks_quote_rating" AS ENUM('5', '4', '3');
  CREATE TYPE "public"."enum_pages_blocks_video_platform" AS ENUM('youtube', 'vimeo', 'direct');
  CREATE TYPE "public"."enum_pages_blocks_spacer_size" AS ENUM('xs', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_pages_hero_type" AS ENUM('none', 'highImpact', 'mediumImpact', 'lowImpact');
  CREATE TYPE "public"."enum_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_version_hero_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__pages_v_version_hero_links_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum__pages_v_blocks_banner_style" AS ENUM('info', 'warning', 'error', 'success');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_links_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum__pages_v_blocks_content_columns_size" AS ENUM('oneThird', 'half', 'twoThirds', 'full');
  CREATE TYPE "public"."enum__pages_v_blocks_content_columns_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_content_columns_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum__pages_v_blocks_carousel_populate_by" AS ENUM('collection', 'selection');
  CREATE TYPE "public"."enum__pages_v_blocks_carousel_relation_to" AS ENUM('products');
  CREATE TYPE "public"."enum__pages_v_blocks_archive_populate_by" AS ENUM('collection', 'selection');
  CREATE TYPE "public"."enum__pages_v_blocks_archive_relation_to" AS ENUM('products');
  CREATE TYPE "public"."enum__pages_v_blocks_code_language" AS ENUM('typescript', 'javascript', 'css');
  CREATE TYPE "public"."enum__pages_v_blocks_quote_rating" AS ENUM('5', '4', '3');
  CREATE TYPE "public"."enum__pages_v_blocks_video_platform" AS ENUM('youtube', 'vimeo', 'direct');
  CREATE TYPE "public"."enum__pages_v_blocks_spacer_size" AS ENUM('xs', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__pages_v_version_hero_type" AS ENUM('none', 'highImpact', 'mediumImpact', 'lowImpact');
  CREATE TYPE "public"."enum__pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_published_locale" AS ENUM('sr', 'en');
  CREATE TYPE "public"."enum_categories_blocks_banner_style" AS ENUM('info', 'warning', 'error', 'success');
  CREATE TYPE "public"."enum_categories_blocks_cta_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_categories_blocks_cta_links_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum_categories_blocks_content_columns_size" AS ENUM('oneThird', 'half', 'twoThirds', 'full');
  CREATE TYPE "public"."enum_categories_blocks_content_columns_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_categories_blocks_content_columns_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum_categories_blocks_carousel_populate_by" AS ENUM('collection', 'selection');
  CREATE TYPE "public"."enum_categories_blocks_carousel_relation_to" AS ENUM('products');
  CREATE TYPE "public"."enum_categories_blocks_archive_populate_by" AS ENUM('collection', 'selection');
  CREATE TYPE "public"."enum_categories_blocks_archive_relation_to" AS ENUM('products');
  CREATE TYPE "public"."enum_categories_blocks_code_language" AS ENUM('typescript', 'javascript', 'css');
  CREATE TYPE "public"."enum_categories_blocks_quote_rating" AS ENUM('5', '4', '3');
  CREATE TYPE "public"."enum_categories_blocks_video_platform" AS ENUM('youtube', 'vimeo', 'direct');
  CREATE TYPE "public"."enum_categories_blocks_spacer_size" AS ENUM('xs', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_brands_blocks_banner_style" AS ENUM('info', 'warning', 'error', 'success');
  CREATE TYPE "public"."enum_brands_blocks_cta_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_brands_blocks_cta_links_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum_brands_blocks_content_columns_size" AS ENUM('oneThird', 'half', 'twoThirds', 'full');
  CREATE TYPE "public"."enum_brands_blocks_content_columns_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_brands_blocks_content_columns_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum_brands_blocks_carousel_populate_by" AS ENUM('collection', 'selection');
  CREATE TYPE "public"."enum_brands_blocks_carousel_relation_to" AS ENUM('products');
  CREATE TYPE "public"."enum_brands_blocks_archive_populate_by" AS ENUM('collection', 'selection');
  CREATE TYPE "public"."enum_brands_blocks_archive_relation_to" AS ENUM('products');
  CREATE TYPE "public"."enum_brands_blocks_code_language" AS ENUM('typescript', 'javascript', 'css');
  CREATE TYPE "public"."enum_brands_blocks_quote_rating" AS ENUM('5', '4', '3');
  CREATE TYPE "public"."enum_brands_blocks_video_platform" AS ENUM('youtube', 'vimeo', 'direct');
  CREATE TYPE "public"."enum_brands_blocks_spacer_size" AS ENUM('xs', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_coupons_type" AS ENUM('percentage', 'fixed');
  CREATE TYPE "public"."enum_forms_confirmation_type" AS ENUM('message', 'redirect');
  CREATE TYPE "public"."enum_addresses_country" AS ENUM('US', 'GB', 'CA', 'AU', 'AT', 'BE', 'BR', 'BG', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HK', 'HU', 'IN', 'IE', 'IT', 'JP', 'LV', 'LT', 'LU', 'MY', 'MT', 'MX', 'NL', 'NZ', 'NO', 'PL', 'PT', 'RO', 'SG', 'SK', 'SI', 'ES', 'SE', 'CH');
  CREATE TYPE "public"."enum_variants_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__variants_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__variants_v_published_locale" AS ENUM('sr', 'en');
  CREATE TYPE "public"."enum_products_blocks_banner_style" AS ENUM('info', 'warning', 'error', 'success');
  CREATE TYPE "public"."enum_products_blocks_cta_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_products_blocks_cta_links_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum_products_blocks_content_columns_size" AS ENUM('oneThird', 'half', 'twoThirds', 'full');
  CREATE TYPE "public"."enum_products_blocks_content_columns_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_products_blocks_content_columns_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum_products_blocks_carousel_populate_by" AS ENUM('collection', 'selection');
  CREATE TYPE "public"."enum_products_blocks_carousel_relation_to" AS ENUM('products');
  CREATE TYPE "public"."enum_products_blocks_archive_populate_by" AS ENUM('collection', 'selection');
  CREATE TYPE "public"."enum_products_blocks_archive_relation_to" AS ENUM('products');
  CREATE TYPE "public"."enum_products_blocks_code_language" AS ENUM('typescript', 'javascript', 'css');
  CREATE TYPE "public"."enum_products_blocks_quote_rating" AS ENUM('5', '4', '3');
  CREATE TYPE "public"."enum_products_blocks_video_platform" AS ENUM('youtube', 'vimeo', 'direct');
  CREATE TYPE "public"."enum_products_blocks_spacer_size" AS ENUM('xs', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_products_visibility" AS ENUM('catalog', 'catalogOnly', 'searchOnly', 'hidden');
  CREATE TYPE "public"."enum_products_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__products_v_blocks_banner_style" AS ENUM('info', 'warning', 'error', 'success');
  CREATE TYPE "public"."enum__products_v_blocks_cta_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__products_v_blocks_cta_links_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum__products_v_blocks_content_columns_size" AS ENUM('oneThird', 'half', 'twoThirds', 'full');
  CREATE TYPE "public"."enum__products_v_blocks_content_columns_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__products_v_blocks_content_columns_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum__products_v_blocks_carousel_populate_by" AS ENUM('collection', 'selection');
  CREATE TYPE "public"."enum__products_v_blocks_carousel_relation_to" AS ENUM('products');
  CREATE TYPE "public"."enum__products_v_blocks_archive_populate_by" AS ENUM('collection', 'selection');
  CREATE TYPE "public"."enum__products_v_blocks_archive_relation_to" AS ENUM('products');
  CREATE TYPE "public"."enum__products_v_blocks_code_language" AS ENUM('typescript', 'javascript', 'css');
  CREATE TYPE "public"."enum__products_v_blocks_quote_rating" AS ENUM('5', '4', '3');
  CREATE TYPE "public"."enum__products_v_blocks_video_platform" AS ENUM('youtube', 'vimeo', 'direct');
  CREATE TYPE "public"."enum__products_v_blocks_spacer_size" AS ENUM('xs', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__products_v_version_visibility" AS ENUM('catalog', 'catalogOnly', 'searchOnly', 'hidden');
  CREATE TYPE "public"."enum__products_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__products_v_published_locale" AS ENUM('sr', 'en');
  CREATE TYPE "public"."enum_carts_currency" AS ENUM('USD');
  CREATE TYPE "public"."enum_orders_status" AS ENUM('processing', 'completed', 'cancelled', 'refunded');
  CREATE TYPE "public"."enum_orders_currency" AS ENUM('USD');
  CREATE TYPE "public"."enum_transactions_payment_method" AS ENUM('stripe');
  CREATE TYPE "public"."enum_transactions_status" AS ENUM('pending', 'succeeded', 'failed', 'cancelled', 'expired', 'refunded');
  CREATE TYPE "public"."enum_transactions_currency" AS ENUM('USD');
  CREATE TYPE "public"."enum_header_nav_items_sub_items_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_header_nav_items_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_header_promo_banner_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_footer_nav_items_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_footer_blocks_footer_column_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_footer_blocks_footer_social_profiles_platform" AS ENUM('facebook', 'instagram', 'linkedin', 'tiktok', 'x', 'youtube');
  CREATE TYPE "public"."enum_footer_bottom_bar_legal_links_link_type" AS ENUM('reference', 'custom');
  CREATE TABLE "users_roles" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_users_roles",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "pages_hero_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_pages_hero_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_appearance" "enum_pages_hero_links_link_appearance" DEFAULT 'default'
  );
  
  CREATE TABLE "pages_hero_links_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_banner" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"style" "enum_pages_blocks_banner_style" DEFAULT 'info',
  	"content" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_cta_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_pages_blocks_cta_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_appearance" "enum_pages_blocks_cta_links_link_appearance" DEFAULT 'default'
  );
  
  CREATE TABLE "pages_blocks_cta_links_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"rich_text" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_content_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"size" "enum_pages_blocks_content_columns_size" DEFAULT 'oneThird',
  	"rich_text" jsonb,
  	"enable_link" boolean,
  	"link_type" "enum_pages_blocks_content_columns_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_appearance" "enum_pages_blocks_content_columns_link_appearance" DEFAULT 'default'
  );
  
  CREATE TABLE "pages_blocks_content_columns_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_media_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_carousel" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"populate_by" "enum_pages_blocks_carousel_populate_by" DEFAULT 'collection',
  	"relation_to" "enum_pages_blocks_carousel_relation_to" DEFAULT 'products',
  	"limit" numeric DEFAULT 10,
  	"populated_docs_total" numeric,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_three_item_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_archive" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"intro_content" jsonb,
  	"populate_by" "enum_pages_blocks_archive_populate_by" DEFAULT 'collection',
  	"relation_to" "enum_pages_blocks_archive_relation_to" DEFAULT 'products',
  	"limit" numeric DEFAULT 10,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_code" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"language" "enum_pages_blocks_code_language" DEFAULT 'typescript',
  	"code" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_form_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"form_id" integer,
  	"enable_intro" boolean,
  	"intro_content" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_quote" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"avatar_id" integer,
  	"rating" "enum_pages_blocks_quote_rating",
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_quote_locales" (
  	"text" varchar,
  	"author" varchar,
  	"role" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "pages_blocks_faq_items_locales" (
  	"question" varchar,
  	"answer" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_faq_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_stats_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "pages_blocks_stats_items_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_stats_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_video" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_pages_blocks_video_platform" DEFAULT 'youtube',
  	"autoplay" boolean DEFAULT false,
  	"url" varchar,
  	"thumbnail_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_video_locales" (
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_spacer" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"size" "enum_pages_blocks_spacer_size" DEFAULT 'md',
  	"show_divider" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"published_on" timestamp(3) with time zone,
  	"hero_type" "enum_pages_hero_type" DEFAULT 'lowImpact',
  	"hero_rich_text" jsonb,
  	"hero_media_id" integer,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_pages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "pages_locales" (
  	"title" varchar,
  	"meta_title" varchar,
  	"meta_image_id" integer,
  	"meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "pages_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"products_id" integer,
  	"categories_id" integer,
  	"brands_id" integer
  );
  
  CREATE TABLE "_pages_v_version_hero_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum__pages_v_version_hero_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_appearance" "enum__pages_v_version_hero_links_link_appearance" DEFAULT 'default',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_version_hero_links_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_banner" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"style" "enum__pages_v_blocks_banner_style" DEFAULT 'info',
  	"content" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_cta_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum__pages_v_blocks_cta_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_appearance" "enum__pages_v_blocks_cta_links_link_appearance" DEFAULT 'default',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_cta_links_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"rich_text" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_content_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"size" "enum__pages_v_blocks_content_columns_size" DEFAULT 'oneThird',
  	"rich_text" jsonb,
  	"enable_link" boolean,
  	"link_type" "enum__pages_v_blocks_content_columns_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_appearance" "enum__pages_v_blocks_content_columns_link_appearance" DEFAULT 'default',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_content_columns_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_media_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_carousel" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"populate_by" "enum__pages_v_blocks_carousel_populate_by" DEFAULT 'collection',
  	"relation_to" "enum__pages_v_blocks_carousel_relation_to" DEFAULT 'products',
  	"limit" numeric DEFAULT 10,
  	"populated_docs_total" numeric,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_three_item_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_archive" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"intro_content" jsonb,
  	"populate_by" "enum__pages_v_blocks_archive_populate_by" DEFAULT 'collection',
  	"relation_to" "enum__pages_v_blocks_archive_relation_to" DEFAULT 'products',
  	"limit" numeric DEFAULT 10,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_code" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"language" "enum__pages_v_blocks_code_language" DEFAULT 'typescript',
  	"code" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_form_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"form_id" integer,
  	"enable_intro" boolean,
  	"intro_content" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_quote" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"avatar_id" integer,
  	"rating" "enum__pages_v_blocks_quote_rating",
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_quote_locales" (
  	"text" varchar,
  	"author" varchar,
  	"role" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_faq_items_locales" (
  	"question" varchar,
  	"answer" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_faq_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_stats_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_stats_items_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_stats_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_video" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"platform" "enum__pages_v_blocks_video_platform" DEFAULT 'youtube',
  	"autoplay" boolean DEFAULT false,
  	"url" varchar,
  	"thumbnail_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_video_locales" (
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_spacer" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"size" "enum__pages_v_blocks_spacer_size" DEFAULT 'md',
  	"show_divider" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_published_on" timestamp(3) with time zone,
  	"version_hero_type" "enum__pages_v_version_hero_type" DEFAULT 'lowImpact',
  	"version_hero_rich_text" jsonb,
  	"version_hero_media_id" integer,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__pages_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_pages_v_locales" (
  	"version_title" varchar,
  	"version_meta_title" varchar,
  	"version_meta_image_id" integer,
  	"version_meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"products_id" integer,
  	"categories_id" integer,
  	"brands_id" integer
  );
  
  CREATE TABLE "categories_blocks_banner" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"style" "enum_categories_blocks_banner_style" DEFAULT 'info' NOT NULL,
  	"content" jsonb NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "categories_blocks_cta_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_categories_blocks_cta_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_appearance" "enum_categories_blocks_cta_links_link_appearance" DEFAULT 'default'
  );
  
  CREATE TABLE "categories_blocks_cta_links_locales" (
  	"link_label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "categories_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"rich_text" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "categories_blocks_content_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"size" "enum_categories_blocks_content_columns_size" DEFAULT 'oneThird',
  	"rich_text" jsonb,
  	"enable_link" boolean,
  	"link_type" "enum_categories_blocks_content_columns_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_appearance" "enum_categories_blocks_content_columns_link_appearance" DEFAULT 'default'
  );
  
  CREATE TABLE "categories_blocks_content_columns_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "categories_blocks_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "categories_blocks_media_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" integer NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "categories_blocks_carousel" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"populate_by" "enum_categories_blocks_carousel_populate_by" DEFAULT 'collection',
  	"relation_to" "enum_categories_blocks_carousel_relation_to" DEFAULT 'products',
  	"limit" numeric DEFAULT 10,
  	"populated_docs_total" numeric,
  	"block_name" varchar
  );
  
  CREATE TABLE "categories_blocks_three_item_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "categories_blocks_archive" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"intro_content" jsonb,
  	"populate_by" "enum_categories_blocks_archive_populate_by" DEFAULT 'collection',
  	"relation_to" "enum_categories_blocks_archive_relation_to" DEFAULT 'products',
  	"limit" numeric DEFAULT 10,
  	"block_name" varchar
  );
  
  CREATE TABLE "categories_blocks_code" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"language" "enum_categories_blocks_code_language" DEFAULT 'typescript',
  	"code" varchar NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "categories_blocks_form_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"form_id" integer NOT NULL,
  	"enable_intro" boolean,
  	"intro_content" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "categories_blocks_quote" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"avatar_id" integer,
  	"rating" "enum_categories_blocks_quote_rating",
  	"block_name" varchar
  );
  
  CREATE TABLE "categories_blocks_quote_locales" (
  	"text" varchar NOT NULL,
  	"author" varchar,
  	"role" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "categories_blocks_faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "categories_blocks_faq_items_locales" (
  	"question" varchar NOT NULL,
  	"answer" jsonb NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "categories_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "categories_blocks_faq_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "categories_blocks_stats_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "categories_blocks_stats_items_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "categories_blocks_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "categories_blocks_stats_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "categories_blocks_video" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_categories_blocks_video_platform" DEFAULT 'youtube' NOT NULL,
  	"autoplay" boolean DEFAULT false,
  	"url" varchar NOT NULL,
  	"thumbnail_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "categories_blocks_video_locales" (
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "categories_blocks_spacer" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"size" "enum_categories_blocks_spacer_size" DEFAULT 'md' NOT NULL,
  	"show_divider" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar NOT NULL,
  	"parent_id" integer,
  	"image_id" integer,
  	"seo_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "categories_locales" (
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "categories_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"products_id" integer,
  	"categories_id" integer,
  	"brands_id" integer
  );
  
  CREATE TABLE "brands_blocks_banner" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"style" "enum_brands_blocks_banner_style" DEFAULT 'info' NOT NULL,
  	"content" jsonb NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "brands_blocks_cta_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_brands_blocks_cta_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_appearance" "enum_brands_blocks_cta_links_link_appearance" DEFAULT 'default'
  );
  
  CREATE TABLE "brands_blocks_cta_links_locales" (
  	"link_label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "brands_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"rich_text" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "brands_blocks_content_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"size" "enum_brands_blocks_content_columns_size" DEFAULT 'oneThird',
  	"rich_text" jsonb,
  	"enable_link" boolean,
  	"link_type" "enum_brands_blocks_content_columns_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_appearance" "enum_brands_blocks_content_columns_link_appearance" DEFAULT 'default'
  );
  
  CREATE TABLE "brands_blocks_content_columns_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "brands_blocks_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "brands_blocks_media_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" integer NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "brands_blocks_carousel" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"populate_by" "enum_brands_blocks_carousel_populate_by" DEFAULT 'collection',
  	"relation_to" "enum_brands_blocks_carousel_relation_to" DEFAULT 'products',
  	"limit" numeric DEFAULT 10,
  	"populated_docs_total" numeric,
  	"block_name" varchar
  );
  
  CREATE TABLE "brands_blocks_three_item_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "brands_blocks_archive" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"intro_content" jsonb,
  	"populate_by" "enum_brands_blocks_archive_populate_by" DEFAULT 'collection',
  	"relation_to" "enum_brands_blocks_archive_relation_to" DEFAULT 'products',
  	"limit" numeric DEFAULT 10,
  	"block_name" varchar
  );
  
  CREATE TABLE "brands_blocks_code" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"language" "enum_brands_blocks_code_language" DEFAULT 'typescript',
  	"code" varchar NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "brands_blocks_form_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"form_id" integer NOT NULL,
  	"enable_intro" boolean,
  	"intro_content" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "brands_blocks_quote" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"avatar_id" integer,
  	"rating" "enum_brands_blocks_quote_rating",
  	"block_name" varchar
  );
  
  CREATE TABLE "brands_blocks_quote_locales" (
  	"text" varchar NOT NULL,
  	"author" varchar,
  	"role" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "brands_blocks_faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "brands_blocks_faq_items_locales" (
  	"question" varchar NOT NULL,
  	"answer" jsonb NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "brands_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "brands_blocks_faq_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "brands_blocks_stats_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "brands_blocks_stats_items_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "brands_blocks_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "brands_blocks_stats_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "brands_blocks_video" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_brands_blocks_video_platform" DEFAULT 'youtube' NOT NULL,
  	"autoplay" boolean DEFAULT false,
  	"url" varchar NOT NULL,
  	"thumbnail_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "brands_blocks_video_locales" (
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "brands_blocks_spacer" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"size" "enum_brands_blocks_spacer_size" DEFAULT 'md' NOT NULL,
  	"show_divider" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "brands" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar NOT NULL,
  	"logo_id" integer,
  	"seo_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "brands_locales" (
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "brands_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"products_id" integer,
  	"categories_id" integer,
  	"brands_id" integer
  );
  
  CREATE TABLE "tags" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "tags_locales" (
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "coupons" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"code" varchar NOT NULL,
  	"active" boolean DEFAULT true,
  	"type" "enum_coupons_type" DEFAULT 'fixed' NOT NULL,
  	"value" numeric NOT NULL,
  	"minimum_order_amount" numeric,
  	"usage_limit" numeric,
  	"starts_at" timestamp(3) with time zone,
  	"ends_at" timestamp(3) with time zone,
  	"usage_count" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "coupons_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"products_id" integer,
  	"categories_id" integer
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "media_locales" (
  	"alt" varchar NOT NULL,
  	"caption" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "forms_blocks_checkbox" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"width" numeric,
  	"required" boolean,
  	"default_value" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_checkbox_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_country" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"width" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_country_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_email" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"width" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_email_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_message" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_message_locales" (
  	"message" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_number" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"width" numeric,
  	"default_value" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_number_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_select_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_select_options_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_select" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"width" numeric,
  	"placeholder" varchar,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_select_locales" (
  	"label" varchar,
  	"default_value" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_state" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"width" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_state_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"width" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_text_locales" (
  	"label" varchar,
  	"default_value" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_textarea" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"width" numeric,
  	"required" boolean,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_textarea_locales" (
  	"label" varchar,
  	"default_value" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_emails" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"email_to" varchar,
  	"cc" varchar,
  	"bcc" varchar,
  	"reply_to" varchar,
  	"email_from" varchar
  );
  
  CREATE TABLE "forms_emails_locales" (
  	"subject" varchar DEFAULT 'You''ve received a new message.' NOT NULL,
  	"message" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"confirmation_type" "enum_forms_confirmation_type" DEFAULT 'message',
  	"redirect_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "forms_locales" (
  	"submit_button_label" varchar,
  	"confirmation_message" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "form_submissions_submission_data" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"field" varchar NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "form_submissions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"form_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "addresses" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"customer_id" integer,
  	"title" varchar,
  	"first_name" varchar,
  	"last_name" varchar,
  	"company" varchar,
  	"address_line1" varchar,
  	"address_line2" varchar,
  	"city" varchar,
  	"state" varchar,
  	"postal_code" varchar,
  	"country" "enum_addresses_country" NOT NULL,
  	"phone" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "variants" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"product_id" integer,
  	"inventory" numeric DEFAULT 0,
  	"price_in_u_s_d_enabled" boolean,
  	"price_in_u_s_d" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"deleted_at" timestamp(3) with time zone,
  	"_status" "enum_variants_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "variants_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"variant_options_id" integer
  );
  
  CREATE TABLE "_variants_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_product_id" integer,
  	"version_inventory" numeric DEFAULT 0,
  	"version_price_in_u_s_d_enabled" boolean,
  	"version_price_in_u_s_d" numeric,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version_deleted_at" timestamp(3) with time zone,
  	"version__status" "enum__variants_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__variants_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_variants_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"variant_options_id" integer
  );
  
  CREATE TABLE "variant_types" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"name" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"deleted_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "variant_options" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_variantoptions_options_order" varchar,
  	"variant_type_id" integer NOT NULL,
  	"label" varchar NOT NULL,
  	"value" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"deleted_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "products_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"variant_option_id" integer
  );
  
  CREATE TABLE "products_blocks_banner" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"style" "enum_products_blocks_banner_style" DEFAULT 'info',
  	"content" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "products_blocks_cta_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_products_blocks_cta_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_appearance" "enum_products_blocks_cta_links_link_appearance" DEFAULT 'default'
  );
  
  CREATE TABLE "products_blocks_cta_links_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "products_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"rich_text" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "products_blocks_content_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"size" "enum_products_blocks_content_columns_size" DEFAULT 'oneThird',
  	"rich_text" jsonb,
  	"enable_link" boolean,
  	"link_type" "enum_products_blocks_content_columns_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_appearance" "enum_products_blocks_content_columns_link_appearance" DEFAULT 'default'
  );
  
  CREATE TABLE "products_blocks_content_columns_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "products_blocks_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "products_blocks_media_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "products_blocks_carousel" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"populate_by" "enum_products_blocks_carousel_populate_by" DEFAULT 'collection',
  	"relation_to" "enum_products_blocks_carousel_relation_to" DEFAULT 'products',
  	"limit" numeric DEFAULT 10,
  	"populated_docs_total" numeric,
  	"block_name" varchar
  );
  
  CREATE TABLE "products_blocks_three_item_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "products_blocks_archive" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"intro_content" jsonb,
  	"populate_by" "enum_products_blocks_archive_populate_by" DEFAULT 'collection',
  	"relation_to" "enum_products_blocks_archive_relation_to" DEFAULT 'products',
  	"limit" numeric DEFAULT 10,
  	"block_name" varchar
  );
  
  CREATE TABLE "products_blocks_code" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"language" "enum_products_blocks_code_language" DEFAULT 'typescript',
  	"code" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "products_blocks_form_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"form_id" integer,
  	"enable_intro" boolean,
  	"intro_content" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "products_blocks_quote" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"avatar_id" integer,
  	"rating" "enum_products_blocks_quote_rating",
  	"block_name" varchar
  );
  
  CREATE TABLE "products_blocks_quote_locales" (
  	"text" varchar,
  	"author" varchar,
  	"role" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "products_blocks_faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "products_blocks_faq_items_locales" (
  	"question" varchar,
  	"answer" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "products_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "products_blocks_faq_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "products_blocks_stats_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "products_blocks_stats_items_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "products_blocks_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "products_blocks_stats_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "products_blocks_video" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_products_blocks_video_platform" DEFAULT 'youtube',
  	"autoplay" boolean DEFAULT false,
  	"url" varchar,
  	"thumbnail_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "products_blocks_video_locales" (
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "products_blocks_spacer" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"size" "enum_products_blocks_spacer_size" DEFAULT 'md',
  	"show_divider" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "products_badges" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "products_badges_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "products_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "products_highlights_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "products_specifications" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "products_specifications_locales" (
  	"label" varchar,
  	"value" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "products" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"price" numeric,
  	"sale_price" numeric,
  	"sale_start_date" timestamp(3) with time zone,
  	"sale_end_date" timestamp(3) with time zone,
  	"inventory" numeric DEFAULT 0,
  	"enable_variants" boolean,
  	"price_in_u_s_d_enabled" boolean,
  	"price_in_u_s_d" numeric,
  	"brand_id" integer,
  	"visibility" "enum_products_visibility" DEFAULT 'catalog',
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"deleted_at" timestamp(3) with time zone,
  	"_status" "enum_products_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "products_locales" (
  	"title" varchar,
  	"description" jsonb,
  	"meta_title" varchar,
  	"meta_image_id" integer,
  	"meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "products_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"products_id" integer,
  	"categories_id" integer,
  	"brands_id" integer,
  	"variant_types_id" integer,
  	"tags_id" integer
  );
  
  CREATE TABLE "_products_v_version_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"variant_option_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_products_v_blocks_banner" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"style" "enum__products_v_blocks_banner_style" DEFAULT 'info',
  	"content" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_products_v_blocks_cta_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum__products_v_blocks_cta_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_appearance" "enum__products_v_blocks_cta_links_link_appearance" DEFAULT 'default',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_products_v_blocks_cta_links_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_products_v_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"rich_text" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_products_v_blocks_content_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"size" "enum__products_v_blocks_content_columns_size" DEFAULT 'oneThird',
  	"rich_text" jsonb,
  	"enable_link" boolean,
  	"link_type" "enum__products_v_blocks_content_columns_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_appearance" "enum__products_v_blocks_content_columns_link_appearance" DEFAULT 'default',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_products_v_blocks_content_columns_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_products_v_blocks_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_products_v_blocks_media_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_products_v_blocks_carousel" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"populate_by" "enum__products_v_blocks_carousel_populate_by" DEFAULT 'collection',
  	"relation_to" "enum__products_v_blocks_carousel_relation_to" DEFAULT 'products',
  	"limit" numeric DEFAULT 10,
  	"populated_docs_total" numeric,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_products_v_blocks_three_item_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_products_v_blocks_archive" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"intro_content" jsonb,
  	"populate_by" "enum__products_v_blocks_archive_populate_by" DEFAULT 'collection',
  	"relation_to" "enum__products_v_blocks_archive_relation_to" DEFAULT 'products',
  	"limit" numeric DEFAULT 10,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_products_v_blocks_code" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"language" "enum__products_v_blocks_code_language" DEFAULT 'typescript',
  	"code" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_products_v_blocks_form_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"form_id" integer,
  	"enable_intro" boolean,
  	"intro_content" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_products_v_blocks_quote" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"avatar_id" integer,
  	"rating" "enum__products_v_blocks_quote_rating",
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_products_v_blocks_quote_locales" (
  	"text" varchar,
  	"author" varchar,
  	"role" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_products_v_blocks_faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_products_v_blocks_faq_items_locales" (
  	"question" varchar,
  	"answer" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_products_v_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_products_v_blocks_faq_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_products_v_blocks_stats_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_products_v_blocks_stats_items_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_products_v_blocks_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_products_v_blocks_stats_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_products_v_blocks_video" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"platform" "enum__products_v_blocks_video_platform" DEFAULT 'youtube',
  	"autoplay" boolean DEFAULT false,
  	"url" varchar,
  	"thumbnail_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_products_v_blocks_video_locales" (
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_products_v_blocks_spacer" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"size" "enum__products_v_blocks_spacer_size" DEFAULT 'md',
  	"show_divider" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_products_v_version_badges" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_products_v_version_badges_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_products_v_version_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_products_v_version_highlights_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_products_v_version_specifications" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_products_v_version_specifications_locales" (
  	"label" varchar,
  	"value" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_products_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_price" numeric,
  	"version_sale_price" numeric,
  	"version_sale_start_date" timestamp(3) with time zone,
  	"version_sale_end_date" timestamp(3) with time zone,
  	"version_inventory" numeric DEFAULT 0,
  	"version_enable_variants" boolean,
  	"version_price_in_u_s_d_enabled" boolean,
  	"version_price_in_u_s_d" numeric,
  	"version_brand_id" integer,
  	"version_visibility" "enum__products_v_version_visibility" DEFAULT 'catalog',
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version_deleted_at" timestamp(3) with time zone,
  	"version__status" "enum__products_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__products_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_products_v_locales" (
  	"version_title" varchar,
  	"version_description" jsonb,
  	"version_meta_title" varchar,
  	"version_meta_image_id" integer,
  	"version_meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_products_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"products_id" integer,
  	"categories_id" integer,
  	"brands_id" integer,
  	"variant_types_id" integer,
  	"tags_id" integer
  );
  
  CREATE TABLE "carts_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"product_id" integer,
  	"variant_id" integer,
  	"quantity" numeric DEFAULT 1 NOT NULL
  );
  
  CREATE TABLE "carts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"secret" varchar,
  	"customer_id" integer,
  	"purchased_at" timestamp(3) with time zone,
  	"subtotal" numeric,
  	"currency" "enum_carts_currency" DEFAULT 'USD',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "orders_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"product_id" integer,
  	"variant_id" integer,
  	"quantity" numeric DEFAULT 1 NOT NULL
  );
  
  CREATE TABLE "orders" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"shipping_address_title" varchar,
  	"shipping_address_first_name" varchar,
  	"shipping_address_last_name" varchar,
  	"shipping_address_company" varchar,
  	"shipping_address_address_line1" varchar,
  	"shipping_address_address_line2" varchar,
  	"shipping_address_city" varchar,
  	"shipping_address_state" varchar,
  	"shipping_address_postal_code" varchar,
  	"shipping_address_country" varchar,
  	"shipping_address_phone" varchar,
  	"customer_id" integer,
  	"customer_email" varchar,
  	"status" "enum_orders_status" DEFAULT 'processing',
  	"amount" numeric,
  	"currency" "enum_orders_currency" DEFAULT 'USD',
  	"access_token" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "orders_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"transactions_id" integer
  );
  
  CREATE TABLE "transactions_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"product_id" integer,
  	"variant_id" integer,
  	"quantity" numeric DEFAULT 1 NOT NULL
  );
  
  CREATE TABLE "transactions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"payment_method" "enum_transactions_payment_method",
  	"stripe_customer_i_d" varchar,
  	"stripe_payment_intent_i_d" varchar,
  	"billing_address_title" varchar,
  	"billing_address_first_name" varchar,
  	"billing_address_last_name" varchar,
  	"billing_address_company" varchar,
  	"billing_address_address_line1" varchar,
  	"billing_address_address_line2" varchar,
  	"billing_address_city" varchar,
  	"billing_address_state" varchar,
  	"billing_address_postal_code" varchar,
  	"billing_address_country" varchar,
  	"billing_address_phone" varchar,
  	"status" "enum_transactions_status" DEFAULT 'pending' NOT NULL,
  	"customer_id" integer,
  	"customer_email" varchar,
  	"order_id" integer,
  	"cart_id" integer,
  	"amount" numeric,
  	"currency" "enum_transactions_currency" DEFAULT 'USD',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"pages_id" integer,
  	"categories_id" integer,
  	"brands_id" integer,
  	"tags_id" integer,
  	"coupons_id" integer,
  	"media_id" integer,
  	"forms_id" integer,
  	"form_submissions_id" integer,
  	"addresses_id" integer,
  	"variants_id" integer,
  	"variant_types_id" integer,
  	"variant_options_id" integer,
  	"products_id" integer,
  	"carts_id" integer,
  	"orders_id" integer,
  	"transactions_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "header_nav_items_sub_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_header_nav_items_sub_items_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar
  );
  
  CREATE TABLE "header_nav_items_sub_items_locales" (
  	"link_label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "header_nav_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_header_nav_items_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar
  );
  
  CREATE TABLE "header_nav_items_locales" (
  	"link_label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "header" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"promo_banner_enabled" boolean DEFAULT false,
  	"promo_banner_link_type" "enum_header_promo_banner_link_type" DEFAULT 'reference',
  	"promo_banner_link_new_tab" boolean,
  	"promo_banner_link_url" varchar,
  	"promo_banner_image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "header_locales" (
  	"promo_banner_text" varchar,
  	"promo_banner_link_label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "header_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"products_id" integer,
  	"categories_id" integer,
  	"brands_id" integer
  );
  
  CREATE TABLE "footer_nav_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_footer_nav_items_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar
  );
  
  CREATE TABLE "footer_nav_items_locales" (
  	"link_label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "footer_blocks_footer_brand" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"logo_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "footer_blocks_footer_brand_locales" (
  	"tagline" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "footer_blocks_footer_column_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_footer_blocks_footer_column_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar
  );
  
  CREATE TABLE "footer_blocks_footer_column_links_locales" (
  	"link_label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "footer_blocks_footer_column" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "footer_blocks_footer_column_locales" (
  	"title" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "footer_blocks_footer_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "footer_blocks_footer_text_locales" (
  	"title" varchar,
  	"content" jsonb NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "footer_blocks_footer_contact" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"phone" varchar,
  	"email" varchar,
  	"address" varchar,
  	"map_link" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "footer_blocks_footer_contact_locales" (
  	"title" varchar,
  	"working_hours" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "footer_blocks_footer_social_profiles" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_footer_blocks_footer_social_profiles_platform" NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "footer_blocks_footer_social" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "footer_blocks_footer_social_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "footer_blocks_footer_newsletter" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "footer_blocks_footer_newsletter_locales" (
  	"heading" varchar NOT NULL,
  	"description" varchar,
  	"button_label" varchar,
  	"privacy_note" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "footer_bottom_bar_legal_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_footer_bottom_bar_legal_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar
  );
  
  CREATE TABLE "footer_bottom_bar_legal_links_locales" (
  	"link_label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "footer" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "footer_locales" (
  	"bottom_bar_copyright" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "footer_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"products_id" integer,
  	"categories_id" integer,
  	"brands_id" integer
  );
  
  ALTER TABLE "users_roles" ADD CONSTRAINT "users_roles_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_hero_links" ADD CONSTRAINT "pages_hero_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_hero_links_locales" ADD CONSTRAINT "pages_hero_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_hero_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_banner" ADD CONSTRAINT "pages_blocks_banner_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta_links" ADD CONSTRAINT "pages_blocks_cta_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta_links_locales" ADD CONSTRAINT "pages_blocks_cta_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_cta_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta" ADD CONSTRAINT "pages_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_content_columns" ADD CONSTRAINT "pages_blocks_content_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_content_columns_locales" ADD CONSTRAINT "pages_blocks_content_columns_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_content_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_content" ADD CONSTRAINT "pages_blocks_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_media_block" ADD CONSTRAINT "pages_blocks_media_block_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_media_block" ADD CONSTRAINT "pages_blocks_media_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_carousel" ADD CONSTRAINT "pages_blocks_carousel_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_three_item_grid" ADD CONSTRAINT "pages_blocks_three_item_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_archive" ADD CONSTRAINT "pages_blocks_archive_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_code" ADD CONSTRAINT "pages_blocks_code_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_form_block" ADD CONSTRAINT "pages_blocks_form_block_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_form_block" ADD CONSTRAINT "pages_blocks_form_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_quote" ADD CONSTRAINT "pages_blocks_quote_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_quote" ADD CONSTRAINT "pages_blocks_quote_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_quote_locales" ADD CONSTRAINT "pages_blocks_quote_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_quote"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq_items" ADD CONSTRAINT "pages_blocks_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq_items_locales" ADD CONSTRAINT "pages_blocks_faq_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_faq_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq" ADD CONSTRAINT "pages_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq_locales" ADD CONSTRAINT "pages_blocks_faq_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_stats_items" ADD CONSTRAINT "pages_blocks_stats_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_stats_items_locales" ADD CONSTRAINT "pages_blocks_stats_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_stats_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_stats" ADD CONSTRAINT "pages_blocks_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_stats_locales" ADD CONSTRAINT "pages_blocks_stats_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_video" ADD CONSTRAINT "pages_blocks_video_thumbnail_id_media_id_fk" FOREIGN KEY ("thumbnail_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_video" ADD CONSTRAINT "pages_blocks_video_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_video_locales" ADD CONSTRAINT "pages_blocks_video_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_video"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_spacer" ADD CONSTRAINT "pages_blocks_spacer_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_hero_media_id_media_id_fk" FOREIGN KEY ("hero_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_locales" ADD CONSTRAINT "pages_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_locales" ADD CONSTRAINT "pages_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_brands_fk" FOREIGN KEY ("brands_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_version_hero_links" ADD CONSTRAINT "_pages_v_version_hero_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_version_hero_links_locales" ADD CONSTRAINT "_pages_v_version_hero_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_version_hero_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_banner" ADD CONSTRAINT "_pages_v_blocks_banner_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta_links" ADD CONSTRAINT "_pages_v_blocks_cta_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta_links_locales" ADD CONSTRAINT "_pages_v_blocks_cta_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_cta_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta" ADD CONSTRAINT "_pages_v_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_content_columns" ADD CONSTRAINT "_pages_v_blocks_content_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_content_columns_locales" ADD CONSTRAINT "_pages_v_blocks_content_columns_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_content_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_content" ADD CONSTRAINT "_pages_v_blocks_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_media_block" ADD CONSTRAINT "_pages_v_blocks_media_block_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_media_block" ADD CONSTRAINT "_pages_v_blocks_media_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_carousel" ADD CONSTRAINT "_pages_v_blocks_carousel_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_three_item_grid" ADD CONSTRAINT "_pages_v_blocks_three_item_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_archive" ADD CONSTRAINT "_pages_v_blocks_archive_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_code" ADD CONSTRAINT "_pages_v_blocks_code_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_form_block" ADD CONSTRAINT "_pages_v_blocks_form_block_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_form_block" ADD CONSTRAINT "_pages_v_blocks_form_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_quote" ADD CONSTRAINT "_pages_v_blocks_quote_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_quote" ADD CONSTRAINT "_pages_v_blocks_quote_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_quote_locales" ADD CONSTRAINT "_pages_v_blocks_quote_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_quote"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faq_items" ADD CONSTRAINT "_pages_v_blocks_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faq_items_locales" ADD CONSTRAINT "_pages_v_blocks_faq_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_faq_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faq" ADD CONSTRAINT "_pages_v_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faq_locales" ADD CONSTRAINT "_pages_v_blocks_faq_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_stats_items" ADD CONSTRAINT "_pages_v_blocks_stats_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_stats_items_locales" ADD CONSTRAINT "_pages_v_blocks_stats_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_stats_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_stats" ADD CONSTRAINT "_pages_v_blocks_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_stats_locales" ADD CONSTRAINT "_pages_v_blocks_stats_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_video" ADD CONSTRAINT "_pages_v_blocks_video_thumbnail_id_media_id_fk" FOREIGN KEY ("thumbnail_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_video" ADD CONSTRAINT "_pages_v_blocks_video_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_video_locales" ADD CONSTRAINT "_pages_v_blocks_video_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_video"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_spacer" ADD CONSTRAINT "_pages_v_blocks_spacer_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_hero_media_id_media_id_fk" FOREIGN KEY ("version_hero_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_locales" ADD CONSTRAINT "_pages_v_locales_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_locales" ADD CONSTRAINT "_pages_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_brands_fk" FOREIGN KEY ("brands_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories_blocks_banner" ADD CONSTRAINT "categories_blocks_banner_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories_blocks_cta_links" ADD CONSTRAINT "categories_blocks_cta_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."categories_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories_blocks_cta_links_locales" ADD CONSTRAINT "categories_blocks_cta_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."categories_blocks_cta_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories_blocks_cta" ADD CONSTRAINT "categories_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories_blocks_content_columns" ADD CONSTRAINT "categories_blocks_content_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."categories_blocks_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories_blocks_content_columns_locales" ADD CONSTRAINT "categories_blocks_content_columns_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."categories_blocks_content_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories_blocks_content" ADD CONSTRAINT "categories_blocks_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories_blocks_media_block" ADD CONSTRAINT "categories_blocks_media_block_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "categories_blocks_media_block" ADD CONSTRAINT "categories_blocks_media_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories_blocks_carousel" ADD CONSTRAINT "categories_blocks_carousel_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories_blocks_three_item_grid" ADD CONSTRAINT "categories_blocks_three_item_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories_blocks_archive" ADD CONSTRAINT "categories_blocks_archive_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories_blocks_code" ADD CONSTRAINT "categories_blocks_code_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories_blocks_form_block" ADD CONSTRAINT "categories_blocks_form_block_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "categories_blocks_form_block" ADD CONSTRAINT "categories_blocks_form_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories_blocks_quote" ADD CONSTRAINT "categories_blocks_quote_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "categories_blocks_quote" ADD CONSTRAINT "categories_blocks_quote_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories_blocks_quote_locales" ADD CONSTRAINT "categories_blocks_quote_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."categories_blocks_quote"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories_blocks_faq_items" ADD CONSTRAINT "categories_blocks_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."categories_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories_blocks_faq_items_locales" ADD CONSTRAINT "categories_blocks_faq_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."categories_blocks_faq_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories_blocks_faq" ADD CONSTRAINT "categories_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories_blocks_faq_locales" ADD CONSTRAINT "categories_blocks_faq_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."categories_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories_blocks_stats_items" ADD CONSTRAINT "categories_blocks_stats_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."categories_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories_blocks_stats_items_locales" ADD CONSTRAINT "categories_blocks_stats_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."categories_blocks_stats_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories_blocks_stats" ADD CONSTRAINT "categories_blocks_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories_blocks_stats_locales" ADD CONSTRAINT "categories_blocks_stats_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."categories_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories_blocks_video" ADD CONSTRAINT "categories_blocks_video_thumbnail_id_media_id_fk" FOREIGN KEY ("thumbnail_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "categories_blocks_video" ADD CONSTRAINT "categories_blocks_video_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories_blocks_video_locales" ADD CONSTRAINT "categories_blocks_video_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."categories_blocks_video"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories_blocks_spacer" ADD CONSTRAINT "categories_blocks_spacer_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories" ADD CONSTRAINT "categories_parent_id_categories_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "categories" ADD CONSTRAINT "categories_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "categories" ADD CONSTRAINT "categories_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "categories_locales" ADD CONSTRAINT "categories_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories_rels" ADD CONSTRAINT "categories_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories_rels" ADD CONSTRAINT "categories_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories_rels" ADD CONSTRAINT "categories_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories_rels" ADD CONSTRAINT "categories_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories_rels" ADD CONSTRAINT "categories_rels_brands_fk" FOREIGN KEY ("brands_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "brands_blocks_banner" ADD CONSTRAINT "brands_blocks_banner_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "brands_blocks_cta_links" ADD CONSTRAINT "brands_blocks_cta_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."brands_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "brands_blocks_cta_links_locales" ADD CONSTRAINT "brands_blocks_cta_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."brands_blocks_cta_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "brands_blocks_cta" ADD CONSTRAINT "brands_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "brands_blocks_content_columns" ADD CONSTRAINT "brands_blocks_content_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."brands_blocks_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "brands_blocks_content_columns_locales" ADD CONSTRAINT "brands_blocks_content_columns_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."brands_blocks_content_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "brands_blocks_content" ADD CONSTRAINT "brands_blocks_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "brands_blocks_media_block" ADD CONSTRAINT "brands_blocks_media_block_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "brands_blocks_media_block" ADD CONSTRAINT "brands_blocks_media_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "brands_blocks_carousel" ADD CONSTRAINT "brands_blocks_carousel_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "brands_blocks_three_item_grid" ADD CONSTRAINT "brands_blocks_three_item_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "brands_blocks_archive" ADD CONSTRAINT "brands_blocks_archive_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "brands_blocks_code" ADD CONSTRAINT "brands_blocks_code_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "brands_blocks_form_block" ADD CONSTRAINT "brands_blocks_form_block_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "brands_blocks_form_block" ADD CONSTRAINT "brands_blocks_form_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "brands_blocks_quote" ADD CONSTRAINT "brands_blocks_quote_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "brands_blocks_quote" ADD CONSTRAINT "brands_blocks_quote_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "brands_blocks_quote_locales" ADD CONSTRAINT "brands_blocks_quote_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."brands_blocks_quote"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "brands_blocks_faq_items" ADD CONSTRAINT "brands_blocks_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."brands_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "brands_blocks_faq_items_locales" ADD CONSTRAINT "brands_blocks_faq_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."brands_blocks_faq_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "brands_blocks_faq" ADD CONSTRAINT "brands_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "brands_blocks_faq_locales" ADD CONSTRAINT "brands_blocks_faq_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."brands_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "brands_blocks_stats_items" ADD CONSTRAINT "brands_blocks_stats_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."brands_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "brands_blocks_stats_items_locales" ADD CONSTRAINT "brands_blocks_stats_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."brands_blocks_stats_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "brands_blocks_stats" ADD CONSTRAINT "brands_blocks_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "brands_blocks_stats_locales" ADD CONSTRAINT "brands_blocks_stats_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."brands_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "brands_blocks_video" ADD CONSTRAINT "brands_blocks_video_thumbnail_id_media_id_fk" FOREIGN KEY ("thumbnail_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "brands_blocks_video" ADD CONSTRAINT "brands_blocks_video_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "brands_blocks_video_locales" ADD CONSTRAINT "brands_blocks_video_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."brands_blocks_video"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "brands_blocks_spacer" ADD CONSTRAINT "brands_blocks_spacer_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "brands" ADD CONSTRAINT "brands_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "brands" ADD CONSTRAINT "brands_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "brands_locales" ADD CONSTRAINT "brands_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "brands_rels" ADD CONSTRAINT "brands_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "brands_rels" ADD CONSTRAINT "brands_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "brands_rels" ADD CONSTRAINT "brands_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "brands_rels" ADD CONSTRAINT "brands_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "brands_rels" ADD CONSTRAINT "brands_rels_brands_fk" FOREIGN KEY ("brands_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tags_locales" ADD CONSTRAINT "tags_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "coupons_rels" ADD CONSTRAINT "coupons_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."coupons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "coupons_rels" ADD CONSTRAINT "coupons_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "coupons_rels" ADD CONSTRAINT "coupons_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media_locales" ADD CONSTRAINT "media_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_checkbox" ADD CONSTRAINT "forms_blocks_checkbox_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_checkbox_locales" ADD CONSTRAINT "forms_blocks_checkbox_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_checkbox"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_country" ADD CONSTRAINT "forms_blocks_country_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_country_locales" ADD CONSTRAINT "forms_blocks_country_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_country"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_email" ADD CONSTRAINT "forms_blocks_email_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_email_locales" ADD CONSTRAINT "forms_blocks_email_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_email"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_message" ADD CONSTRAINT "forms_blocks_message_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_message_locales" ADD CONSTRAINT "forms_blocks_message_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_message"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_number" ADD CONSTRAINT "forms_blocks_number_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_number_locales" ADD CONSTRAINT "forms_blocks_number_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_number"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_select_options" ADD CONSTRAINT "forms_blocks_select_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_select"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_select_options_locales" ADD CONSTRAINT "forms_blocks_select_options_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_select_options"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_select" ADD CONSTRAINT "forms_blocks_select_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_select_locales" ADD CONSTRAINT "forms_blocks_select_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_select"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_state" ADD CONSTRAINT "forms_blocks_state_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_state_locales" ADD CONSTRAINT "forms_blocks_state_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_state"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_text" ADD CONSTRAINT "forms_blocks_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_text_locales" ADD CONSTRAINT "forms_blocks_text_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_text"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_textarea" ADD CONSTRAINT "forms_blocks_textarea_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_textarea_locales" ADD CONSTRAINT "forms_blocks_textarea_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_textarea"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_emails" ADD CONSTRAINT "forms_emails_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_emails_locales" ADD CONSTRAINT "forms_emails_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_emails"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_locales" ADD CONSTRAINT "forms_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "form_submissions_submission_data" ADD CONSTRAINT "form_submissions_submission_data_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."form_submissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "form_submissions" ADD CONSTRAINT "form_submissions_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "addresses" ADD CONSTRAINT "addresses_customer_id_users_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "variants" ADD CONSTRAINT "variants_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "variants_rels" ADD CONSTRAINT "variants_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."variants"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "variants_rels" ADD CONSTRAINT "variants_rels_variant_options_fk" FOREIGN KEY ("variant_options_id") REFERENCES "public"."variant_options"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_variants_v" ADD CONSTRAINT "_variants_v_parent_id_variants_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."variants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_variants_v" ADD CONSTRAINT "_variants_v_version_product_id_products_id_fk" FOREIGN KEY ("version_product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_variants_v_rels" ADD CONSTRAINT "_variants_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_variants_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_variants_v_rels" ADD CONSTRAINT "_variants_v_rels_variant_options_fk" FOREIGN KEY ("variant_options_id") REFERENCES "public"."variant_options"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "variant_options" ADD CONSTRAINT "variant_options_variant_type_id_variant_types_id_fk" FOREIGN KEY ("variant_type_id") REFERENCES "public"."variant_types"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_gallery" ADD CONSTRAINT "products_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_gallery" ADD CONSTRAINT "products_gallery_variant_option_id_variant_options_id_fk" FOREIGN KEY ("variant_option_id") REFERENCES "public"."variant_options"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_gallery" ADD CONSTRAINT "products_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_banner" ADD CONSTRAINT "products_blocks_banner_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_cta_links" ADD CONSTRAINT "products_blocks_cta_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_cta_links_locales" ADD CONSTRAINT "products_blocks_cta_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_blocks_cta_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_cta" ADD CONSTRAINT "products_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_content_columns" ADD CONSTRAINT "products_blocks_content_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_blocks_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_content_columns_locales" ADD CONSTRAINT "products_blocks_content_columns_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_blocks_content_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_content" ADD CONSTRAINT "products_blocks_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_media_block" ADD CONSTRAINT "products_blocks_media_block_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_blocks_media_block" ADD CONSTRAINT "products_blocks_media_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_carousel" ADD CONSTRAINT "products_blocks_carousel_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_three_item_grid" ADD CONSTRAINT "products_blocks_three_item_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_archive" ADD CONSTRAINT "products_blocks_archive_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_code" ADD CONSTRAINT "products_blocks_code_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_form_block" ADD CONSTRAINT "products_blocks_form_block_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_blocks_form_block" ADD CONSTRAINT "products_blocks_form_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_quote" ADD CONSTRAINT "products_blocks_quote_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_blocks_quote" ADD CONSTRAINT "products_blocks_quote_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_quote_locales" ADD CONSTRAINT "products_blocks_quote_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_blocks_quote"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_faq_items" ADD CONSTRAINT "products_blocks_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_faq_items_locales" ADD CONSTRAINT "products_blocks_faq_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_blocks_faq_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_faq" ADD CONSTRAINT "products_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_faq_locales" ADD CONSTRAINT "products_blocks_faq_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_stats_items" ADD CONSTRAINT "products_blocks_stats_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_stats_items_locales" ADD CONSTRAINT "products_blocks_stats_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_blocks_stats_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_stats" ADD CONSTRAINT "products_blocks_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_stats_locales" ADD CONSTRAINT "products_blocks_stats_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_video" ADD CONSTRAINT "products_blocks_video_thumbnail_id_media_id_fk" FOREIGN KEY ("thumbnail_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_blocks_video" ADD CONSTRAINT "products_blocks_video_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_video_locales" ADD CONSTRAINT "products_blocks_video_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_blocks_video"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_blocks_spacer" ADD CONSTRAINT "products_blocks_spacer_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_badges" ADD CONSTRAINT "products_badges_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_badges_locales" ADD CONSTRAINT "products_badges_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_badges"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_highlights" ADD CONSTRAINT "products_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_highlights_locales" ADD CONSTRAINT "products_highlights_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_highlights"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_specifications" ADD CONSTRAINT "products_specifications_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_specifications_locales" ADD CONSTRAINT "products_specifications_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_specifications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_locales" ADD CONSTRAINT "products_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_locales" ADD CONSTRAINT "products_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_brands_fk" FOREIGN KEY ("brands_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_variant_types_fk" FOREIGN KEY ("variant_types_id") REFERENCES "public"."variant_types"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_version_gallery" ADD CONSTRAINT "_products_v_version_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v_version_gallery" ADD CONSTRAINT "_products_v_version_gallery_variant_option_id_variant_options_id_fk" FOREIGN KEY ("variant_option_id") REFERENCES "public"."variant_options"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v_version_gallery" ADD CONSTRAINT "_products_v_version_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_banner" ADD CONSTRAINT "_products_v_blocks_banner_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_cta_links" ADD CONSTRAINT "_products_v_blocks_cta_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_cta_links_locales" ADD CONSTRAINT "_products_v_blocks_cta_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v_blocks_cta_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_cta" ADD CONSTRAINT "_products_v_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_content_columns" ADD CONSTRAINT "_products_v_blocks_content_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v_blocks_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_content_columns_locales" ADD CONSTRAINT "_products_v_blocks_content_columns_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v_blocks_content_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_content" ADD CONSTRAINT "_products_v_blocks_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_media_block" ADD CONSTRAINT "_products_v_blocks_media_block_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_media_block" ADD CONSTRAINT "_products_v_blocks_media_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_carousel" ADD CONSTRAINT "_products_v_blocks_carousel_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_three_item_grid" ADD CONSTRAINT "_products_v_blocks_three_item_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_archive" ADD CONSTRAINT "_products_v_blocks_archive_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_code" ADD CONSTRAINT "_products_v_blocks_code_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_form_block" ADD CONSTRAINT "_products_v_blocks_form_block_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_form_block" ADD CONSTRAINT "_products_v_blocks_form_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_quote" ADD CONSTRAINT "_products_v_blocks_quote_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_quote" ADD CONSTRAINT "_products_v_blocks_quote_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_quote_locales" ADD CONSTRAINT "_products_v_blocks_quote_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v_blocks_quote"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_faq_items" ADD CONSTRAINT "_products_v_blocks_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_faq_items_locales" ADD CONSTRAINT "_products_v_blocks_faq_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v_blocks_faq_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_faq" ADD CONSTRAINT "_products_v_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_faq_locales" ADD CONSTRAINT "_products_v_blocks_faq_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_stats_items" ADD CONSTRAINT "_products_v_blocks_stats_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_stats_items_locales" ADD CONSTRAINT "_products_v_blocks_stats_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v_blocks_stats_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_stats" ADD CONSTRAINT "_products_v_blocks_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_stats_locales" ADD CONSTRAINT "_products_v_blocks_stats_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_video" ADD CONSTRAINT "_products_v_blocks_video_thumbnail_id_media_id_fk" FOREIGN KEY ("thumbnail_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_video" ADD CONSTRAINT "_products_v_blocks_video_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_video_locales" ADD CONSTRAINT "_products_v_blocks_video_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v_blocks_video"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_blocks_spacer" ADD CONSTRAINT "_products_v_blocks_spacer_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_version_badges" ADD CONSTRAINT "_products_v_version_badges_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_version_badges_locales" ADD CONSTRAINT "_products_v_version_badges_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v_version_badges"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_version_highlights" ADD CONSTRAINT "_products_v_version_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_version_highlights_locales" ADD CONSTRAINT "_products_v_version_highlights_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v_version_highlights"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_version_specifications" ADD CONSTRAINT "_products_v_version_specifications_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_version_specifications_locales" ADD CONSTRAINT "_products_v_version_specifications_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v_version_specifications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v" ADD CONSTRAINT "_products_v_parent_id_products_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v" ADD CONSTRAINT "_products_v_version_brand_id_brands_id_fk" FOREIGN KEY ("version_brand_id") REFERENCES "public"."brands"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v_locales" ADD CONSTRAINT "_products_v_locales_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v_locales" ADD CONSTRAINT "_products_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_rels" ADD CONSTRAINT "_products_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_rels" ADD CONSTRAINT "_products_v_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_rels" ADD CONSTRAINT "_products_v_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_rels" ADD CONSTRAINT "_products_v_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_rels" ADD CONSTRAINT "_products_v_rels_brands_fk" FOREIGN KEY ("brands_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_rels" ADD CONSTRAINT "_products_v_rels_variant_types_fk" FOREIGN KEY ("variant_types_id") REFERENCES "public"."variant_types"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_rels" ADD CONSTRAINT "_products_v_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "carts_items" ADD CONSTRAINT "carts_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "carts_items" ADD CONSTRAINT "carts_items_variant_id_variants_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."variants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "carts_items" ADD CONSTRAINT "carts_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."carts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "carts" ADD CONSTRAINT "carts_customer_id_users_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "orders_items" ADD CONSTRAINT "orders_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "orders_items" ADD CONSTRAINT "orders_items_variant_id_variants_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."variants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "orders_items" ADD CONSTRAINT "orders_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "orders" ADD CONSTRAINT "orders_customer_id_users_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "orders_rels" ADD CONSTRAINT "orders_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "orders_rels" ADD CONSTRAINT "orders_rels_transactions_fk" FOREIGN KEY ("transactions_id") REFERENCES "public"."transactions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "transactions_items" ADD CONSTRAINT "transactions_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "transactions_items" ADD CONSTRAINT "transactions_items_variant_id_variants_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."variants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "transactions_items" ADD CONSTRAINT "transactions_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."transactions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "transactions" ADD CONSTRAINT "transactions_customer_id_users_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "transactions" ADD CONSTRAINT "transactions_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "transactions" ADD CONSTRAINT "transactions_cart_id_carts_id_fk" FOREIGN KEY ("cart_id") REFERENCES "public"."carts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_brands_fk" FOREIGN KEY ("brands_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_coupons_fk" FOREIGN KEY ("coupons_id") REFERENCES "public"."coupons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_forms_fk" FOREIGN KEY ("forms_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_form_submissions_fk" FOREIGN KEY ("form_submissions_id") REFERENCES "public"."form_submissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_addresses_fk" FOREIGN KEY ("addresses_id") REFERENCES "public"."addresses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_variants_fk" FOREIGN KEY ("variants_id") REFERENCES "public"."variants"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_variant_types_fk" FOREIGN KEY ("variant_types_id") REFERENCES "public"."variant_types"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_variant_options_fk" FOREIGN KEY ("variant_options_id") REFERENCES "public"."variant_options"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_carts_fk" FOREIGN KEY ("carts_id") REFERENCES "public"."carts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_orders_fk" FOREIGN KEY ("orders_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_transactions_fk" FOREIGN KEY ("transactions_id") REFERENCES "public"."transactions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_nav_items_sub_items" ADD CONSTRAINT "header_nav_items_sub_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header_nav_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_nav_items_sub_items_locales" ADD CONSTRAINT "header_nav_items_sub_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header_nav_items_sub_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_nav_items" ADD CONSTRAINT "header_nav_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_nav_items_locales" ADD CONSTRAINT "header_nav_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header_nav_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header" ADD CONSTRAINT "header_promo_banner_image_id_media_id_fk" FOREIGN KEY ("promo_banner_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "header_locales" ADD CONSTRAINT "header_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_rels" ADD CONSTRAINT "header_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_rels" ADD CONSTRAINT "header_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_rels" ADD CONSTRAINT "header_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_rels" ADD CONSTRAINT "header_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_rels" ADD CONSTRAINT "header_rels_brands_fk" FOREIGN KEY ("brands_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_nav_items" ADD CONSTRAINT "footer_nav_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_nav_items_locales" ADD CONSTRAINT "footer_nav_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_nav_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_blocks_footer_brand" ADD CONSTRAINT "footer_blocks_footer_brand_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "footer_blocks_footer_brand" ADD CONSTRAINT "footer_blocks_footer_brand_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_blocks_footer_brand_locales" ADD CONSTRAINT "footer_blocks_footer_brand_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_blocks_footer_brand"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_blocks_footer_column_links" ADD CONSTRAINT "footer_blocks_footer_column_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_blocks_footer_column"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_blocks_footer_column_links_locales" ADD CONSTRAINT "footer_blocks_footer_column_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_blocks_footer_column_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_blocks_footer_column" ADD CONSTRAINT "footer_blocks_footer_column_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_blocks_footer_column_locales" ADD CONSTRAINT "footer_blocks_footer_column_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_blocks_footer_column"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_blocks_footer_text" ADD CONSTRAINT "footer_blocks_footer_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_blocks_footer_text_locales" ADD CONSTRAINT "footer_blocks_footer_text_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_blocks_footer_text"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_blocks_footer_contact" ADD CONSTRAINT "footer_blocks_footer_contact_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_blocks_footer_contact_locales" ADD CONSTRAINT "footer_blocks_footer_contact_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_blocks_footer_contact"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_blocks_footer_social_profiles" ADD CONSTRAINT "footer_blocks_footer_social_profiles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_blocks_footer_social"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_blocks_footer_social" ADD CONSTRAINT "footer_blocks_footer_social_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_blocks_footer_social_locales" ADD CONSTRAINT "footer_blocks_footer_social_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_blocks_footer_social"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_blocks_footer_newsletter" ADD CONSTRAINT "footer_blocks_footer_newsletter_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_blocks_footer_newsletter_locales" ADD CONSTRAINT "footer_blocks_footer_newsletter_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_blocks_footer_newsletter"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_bottom_bar_legal_links" ADD CONSTRAINT "footer_bottom_bar_legal_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_bottom_bar_legal_links_locales" ADD CONSTRAINT "footer_bottom_bar_legal_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_bottom_bar_legal_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_locales" ADD CONSTRAINT "footer_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_rels" ADD CONSTRAINT "footer_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_rels" ADD CONSTRAINT "footer_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_rels" ADD CONSTRAINT "footer_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_rels" ADD CONSTRAINT "footer_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_rels" ADD CONSTRAINT "footer_rels_brands_fk" FOREIGN KEY ("brands_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_roles_order_idx" ON "users_roles" USING btree ("order");
  CREATE INDEX "users_roles_parent_idx" ON "users_roles" USING btree ("parent_id");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "pages_hero_links_order_idx" ON "pages_hero_links" USING btree ("_order");
  CREATE INDEX "pages_hero_links_parent_id_idx" ON "pages_hero_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_hero_links_locales_locale_parent_id_unique" ON "pages_hero_links_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_banner_order_idx" ON "pages_blocks_banner" USING btree ("_order");
  CREATE INDEX "pages_blocks_banner_parent_id_idx" ON "pages_blocks_banner" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_banner_path_idx" ON "pages_blocks_banner" USING btree ("_path");
  CREATE INDEX "pages_blocks_cta_links_order_idx" ON "pages_blocks_cta_links" USING btree ("_order");
  CREATE INDEX "pages_blocks_cta_links_parent_id_idx" ON "pages_blocks_cta_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_cta_links_locales_locale_parent_id_unique" ON "pages_blocks_cta_links_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_cta_order_idx" ON "pages_blocks_cta" USING btree ("_order");
  CREATE INDEX "pages_blocks_cta_parent_id_idx" ON "pages_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cta_path_idx" ON "pages_blocks_cta" USING btree ("_path");
  CREATE INDEX "pages_blocks_content_columns_order_idx" ON "pages_blocks_content_columns" USING btree ("_order");
  CREATE INDEX "pages_blocks_content_columns_parent_id_idx" ON "pages_blocks_content_columns" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_content_columns_locales_locale_parent_id_unique" ON "pages_blocks_content_columns_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_content_order_idx" ON "pages_blocks_content" USING btree ("_order");
  CREATE INDEX "pages_blocks_content_parent_id_idx" ON "pages_blocks_content" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_content_path_idx" ON "pages_blocks_content" USING btree ("_path");
  CREATE INDEX "pages_blocks_media_block_order_idx" ON "pages_blocks_media_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_media_block_parent_id_idx" ON "pages_blocks_media_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_media_block_path_idx" ON "pages_blocks_media_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_media_block_media_idx" ON "pages_blocks_media_block" USING btree ("media_id");
  CREATE INDEX "pages_blocks_carousel_order_idx" ON "pages_blocks_carousel" USING btree ("_order");
  CREATE INDEX "pages_blocks_carousel_parent_id_idx" ON "pages_blocks_carousel" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_carousel_path_idx" ON "pages_blocks_carousel" USING btree ("_path");
  CREATE INDEX "pages_blocks_three_item_grid_order_idx" ON "pages_blocks_three_item_grid" USING btree ("_order");
  CREATE INDEX "pages_blocks_three_item_grid_parent_id_idx" ON "pages_blocks_three_item_grid" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_three_item_grid_path_idx" ON "pages_blocks_three_item_grid" USING btree ("_path");
  CREATE INDEX "pages_blocks_archive_order_idx" ON "pages_blocks_archive" USING btree ("_order");
  CREATE INDEX "pages_blocks_archive_parent_id_idx" ON "pages_blocks_archive" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_archive_path_idx" ON "pages_blocks_archive" USING btree ("_path");
  CREATE INDEX "pages_blocks_code_order_idx" ON "pages_blocks_code" USING btree ("_order");
  CREATE INDEX "pages_blocks_code_parent_id_idx" ON "pages_blocks_code" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_code_path_idx" ON "pages_blocks_code" USING btree ("_path");
  CREATE INDEX "pages_blocks_form_block_order_idx" ON "pages_blocks_form_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_form_block_parent_id_idx" ON "pages_blocks_form_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_form_block_path_idx" ON "pages_blocks_form_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_form_block_form_idx" ON "pages_blocks_form_block" USING btree ("form_id");
  CREATE INDEX "pages_blocks_quote_order_idx" ON "pages_blocks_quote" USING btree ("_order");
  CREATE INDEX "pages_blocks_quote_parent_id_idx" ON "pages_blocks_quote" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_quote_path_idx" ON "pages_blocks_quote" USING btree ("_path");
  CREATE INDEX "pages_blocks_quote_avatar_idx" ON "pages_blocks_quote" USING btree ("avatar_id");
  CREATE UNIQUE INDEX "pages_blocks_quote_locales_locale_parent_id_unique" ON "pages_blocks_quote_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_faq_items_order_idx" ON "pages_blocks_faq_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_items_parent_id_idx" ON "pages_blocks_faq_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_faq_items_locales_locale_parent_id_unique" ON "pages_blocks_faq_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_faq_order_idx" ON "pages_blocks_faq" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_parent_id_idx" ON "pages_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faq_path_idx" ON "pages_blocks_faq" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_faq_locales_locale_parent_id_unique" ON "pages_blocks_faq_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_stats_items_order_idx" ON "pages_blocks_stats_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_stats_items_parent_id_idx" ON "pages_blocks_stats_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_stats_items_locales_locale_parent_id_unique" ON "pages_blocks_stats_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_stats_order_idx" ON "pages_blocks_stats" USING btree ("_order");
  CREATE INDEX "pages_blocks_stats_parent_id_idx" ON "pages_blocks_stats" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_stats_path_idx" ON "pages_blocks_stats" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_stats_locales_locale_parent_id_unique" ON "pages_blocks_stats_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_video_order_idx" ON "pages_blocks_video" USING btree ("_order");
  CREATE INDEX "pages_blocks_video_parent_id_idx" ON "pages_blocks_video" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_video_path_idx" ON "pages_blocks_video" USING btree ("_path");
  CREATE INDEX "pages_blocks_video_thumbnail_idx" ON "pages_blocks_video" USING btree ("thumbnail_id");
  CREATE UNIQUE INDEX "pages_blocks_video_locales_locale_parent_id_unique" ON "pages_blocks_video_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_spacer_order_idx" ON "pages_blocks_spacer" USING btree ("_order");
  CREATE INDEX "pages_blocks_spacer_parent_id_idx" ON "pages_blocks_spacer" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_spacer_path_idx" ON "pages_blocks_spacer" USING btree ("_path");
  CREATE INDEX "pages_hero_hero_media_idx" ON "pages" USING btree ("hero_media_id");
  CREATE UNIQUE INDEX "pages_slug_idx" ON "pages" USING btree ("slug");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX "pages__status_idx" ON "pages" USING btree ("_status");
  CREATE INDEX "pages_meta_meta_image_idx" ON "pages_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "pages_locales_locale_parent_id_unique" ON "pages_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_rels_order_idx" ON "pages_rels" USING btree ("order");
  CREATE INDEX "pages_rels_parent_idx" ON "pages_rels" USING btree ("parent_id");
  CREATE INDEX "pages_rels_path_idx" ON "pages_rels" USING btree ("path");
  CREATE INDEX "pages_rels_pages_id_idx" ON "pages_rels" USING btree ("pages_id");
  CREATE INDEX "pages_rels_products_id_idx" ON "pages_rels" USING btree ("products_id");
  CREATE INDEX "pages_rels_categories_id_idx" ON "pages_rels" USING btree ("categories_id");
  CREATE INDEX "pages_rels_brands_id_idx" ON "pages_rels" USING btree ("brands_id");
  CREATE INDEX "_pages_v_version_hero_links_order_idx" ON "_pages_v_version_hero_links" USING btree ("_order");
  CREATE INDEX "_pages_v_version_hero_links_parent_id_idx" ON "_pages_v_version_hero_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_pages_v_version_hero_links_locales_locale_parent_id_unique" ON "_pages_v_version_hero_links_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_banner_order_idx" ON "_pages_v_blocks_banner" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_banner_parent_id_idx" ON "_pages_v_blocks_banner" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_banner_path_idx" ON "_pages_v_blocks_banner" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_cta_links_order_idx" ON "_pages_v_blocks_cta_links" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_cta_links_parent_id_idx" ON "_pages_v_blocks_cta_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_cta_links_locales_locale_parent_id_unique" ON "_pages_v_blocks_cta_links_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_cta_order_idx" ON "_pages_v_blocks_cta" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_cta_parent_id_idx" ON "_pages_v_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_cta_path_idx" ON "_pages_v_blocks_cta" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_content_columns_order_idx" ON "_pages_v_blocks_content_columns" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_content_columns_parent_id_idx" ON "_pages_v_blocks_content_columns" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_content_columns_locales_locale_parent_id_uni" ON "_pages_v_blocks_content_columns_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_content_order_idx" ON "_pages_v_blocks_content" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_content_parent_id_idx" ON "_pages_v_blocks_content" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_content_path_idx" ON "_pages_v_blocks_content" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_media_block_order_idx" ON "_pages_v_blocks_media_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_media_block_parent_id_idx" ON "_pages_v_blocks_media_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_media_block_path_idx" ON "_pages_v_blocks_media_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_media_block_media_idx" ON "_pages_v_blocks_media_block" USING btree ("media_id");
  CREATE INDEX "_pages_v_blocks_carousel_order_idx" ON "_pages_v_blocks_carousel" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_carousel_parent_id_idx" ON "_pages_v_blocks_carousel" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_carousel_path_idx" ON "_pages_v_blocks_carousel" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_three_item_grid_order_idx" ON "_pages_v_blocks_three_item_grid" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_three_item_grid_parent_id_idx" ON "_pages_v_blocks_three_item_grid" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_three_item_grid_path_idx" ON "_pages_v_blocks_three_item_grid" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_archive_order_idx" ON "_pages_v_blocks_archive" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_archive_parent_id_idx" ON "_pages_v_blocks_archive" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_archive_path_idx" ON "_pages_v_blocks_archive" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_code_order_idx" ON "_pages_v_blocks_code" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_code_parent_id_idx" ON "_pages_v_blocks_code" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_code_path_idx" ON "_pages_v_blocks_code" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_form_block_order_idx" ON "_pages_v_blocks_form_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_form_block_parent_id_idx" ON "_pages_v_blocks_form_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_form_block_path_idx" ON "_pages_v_blocks_form_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_form_block_form_idx" ON "_pages_v_blocks_form_block" USING btree ("form_id");
  CREATE INDEX "_pages_v_blocks_quote_order_idx" ON "_pages_v_blocks_quote" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_quote_parent_id_idx" ON "_pages_v_blocks_quote" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_quote_path_idx" ON "_pages_v_blocks_quote" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_quote_avatar_idx" ON "_pages_v_blocks_quote" USING btree ("avatar_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_quote_locales_locale_parent_id_unique" ON "_pages_v_blocks_quote_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_faq_items_order_idx" ON "_pages_v_blocks_faq_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_faq_items_parent_id_idx" ON "_pages_v_blocks_faq_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_faq_items_locales_locale_parent_id_unique" ON "_pages_v_blocks_faq_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_faq_order_idx" ON "_pages_v_blocks_faq" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_faq_parent_id_idx" ON "_pages_v_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_faq_path_idx" ON "_pages_v_blocks_faq" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_faq_locales_locale_parent_id_unique" ON "_pages_v_blocks_faq_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_stats_items_order_idx" ON "_pages_v_blocks_stats_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_stats_items_parent_id_idx" ON "_pages_v_blocks_stats_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_stats_items_locales_locale_parent_id_unique" ON "_pages_v_blocks_stats_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_stats_order_idx" ON "_pages_v_blocks_stats" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_stats_parent_id_idx" ON "_pages_v_blocks_stats" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_stats_path_idx" ON "_pages_v_blocks_stats" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_stats_locales_locale_parent_id_unique" ON "_pages_v_blocks_stats_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_video_order_idx" ON "_pages_v_blocks_video" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_video_parent_id_idx" ON "_pages_v_blocks_video" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_video_path_idx" ON "_pages_v_blocks_video" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_video_thumbnail_idx" ON "_pages_v_blocks_video" USING btree ("thumbnail_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_video_locales_locale_parent_id_unique" ON "_pages_v_blocks_video_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_spacer_order_idx" ON "_pages_v_blocks_spacer" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_spacer_parent_id_idx" ON "_pages_v_blocks_spacer" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_spacer_path_idx" ON "_pages_v_blocks_spacer" USING btree ("_path");
  CREATE INDEX "_pages_v_parent_idx" ON "_pages_v" USING btree ("parent_id");
  CREATE INDEX "_pages_v_version_hero_version_hero_media_idx" ON "_pages_v" USING btree ("version_hero_media_id");
  CREATE INDEX "_pages_v_version_version_slug_idx" ON "_pages_v" USING btree ("version_slug");
  CREATE INDEX "_pages_v_version_version_updated_at_idx" ON "_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_pages_v_version_version_created_at_idx" ON "_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_pages_v_version_version__status_idx" ON "_pages_v" USING btree ("version__status");
  CREATE INDEX "_pages_v_created_at_idx" ON "_pages_v" USING btree ("created_at");
  CREATE INDEX "_pages_v_updated_at_idx" ON "_pages_v" USING btree ("updated_at");
  CREATE INDEX "_pages_v_snapshot_idx" ON "_pages_v" USING btree ("snapshot");
  CREATE INDEX "_pages_v_published_locale_idx" ON "_pages_v" USING btree ("published_locale");
  CREATE INDEX "_pages_v_latest_idx" ON "_pages_v" USING btree ("latest");
  CREATE INDEX "_pages_v_autosave_idx" ON "_pages_v" USING btree ("autosave");
  CREATE INDEX "_pages_v_version_meta_version_meta_image_idx" ON "_pages_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE UNIQUE INDEX "_pages_v_locales_locale_parent_id_unique" ON "_pages_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_rels_order_idx" ON "_pages_v_rels" USING btree ("order");
  CREATE INDEX "_pages_v_rels_parent_idx" ON "_pages_v_rels" USING btree ("parent_id");
  CREATE INDEX "_pages_v_rels_path_idx" ON "_pages_v_rels" USING btree ("path");
  CREATE INDEX "_pages_v_rels_pages_id_idx" ON "_pages_v_rels" USING btree ("pages_id");
  CREATE INDEX "_pages_v_rels_products_id_idx" ON "_pages_v_rels" USING btree ("products_id");
  CREATE INDEX "_pages_v_rels_categories_id_idx" ON "_pages_v_rels" USING btree ("categories_id");
  CREATE INDEX "_pages_v_rels_brands_id_idx" ON "_pages_v_rels" USING btree ("brands_id");
  CREATE INDEX "categories_blocks_banner_order_idx" ON "categories_blocks_banner" USING btree ("_order");
  CREATE INDEX "categories_blocks_banner_parent_id_idx" ON "categories_blocks_banner" USING btree ("_parent_id");
  CREATE INDEX "categories_blocks_banner_path_idx" ON "categories_blocks_banner" USING btree ("_path");
  CREATE INDEX "categories_blocks_cta_links_order_idx" ON "categories_blocks_cta_links" USING btree ("_order");
  CREATE INDEX "categories_blocks_cta_links_parent_id_idx" ON "categories_blocks_cta_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "categories_blocks_cta_links_locales_locale_parent_id_unique" ON "categories_blocks_cta_links_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "categories_blocks_cta_order_idx" ON "categories_blocks_cta" USING btree ("_order");
  CREATE INDEX "categories_blocks_cta_parent_id_idx" ON "categories_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "categories_blocks_cta_path_idx" ON "categories_blocks_cta" USING btree ("_path");
  CREATE INDEX "categories_blocks_content_columns_order_idx" ON "categories_blocks_content_columns" USING btree ("_order");
  CREATE INDEX "categories_blocks_content_columns_parent_id_idx" ON "categories_blocks_content_columns" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "categories_blocks_content_columns_locales_locale_parent_id_u" ON "categories_blocks_content_columns_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "categories_blocks_content_order_idx" ON "categories_blocks_content" USING btree ("_order");
  CREATE INDEX "categories_blocks_content_parent_id_idx" ON "categories_blocks_content" USING btree ("_parent_id");
  CREATE INDEX "categories_blocks_content_path_idx" ON "categories_blocks_content" USING btree ("_path");
  CREATE INDEX "categories_blocks_media_block_order_idx" ON "categories_blocks_media_block" USING btree ("_order");
  CREATE INDEX "categories_blocks_media_block_parent_id_idx" ON "categories_blocks_media_block" USING btree ("_parent_id");
  CREATE INDEX "categories_blocks_media_block_path_idx" ON "categories_blocks_media_block" USING btree ("_path");
  CREATE INDEX "categories_blocks_media_block_media_idx" ON "categories_blocks_media_block" USING btree ("media_id");
  CREATE INDEX "categories_blocks_carousel_order_idx" ON "categories_blocks_carousel" USING btree ("_order");
  CREATE INDEX "categories_blocks_carousel_parent_id_idx" ON "categories_blocks_carousel" USING btree ("_parent_id");
  CREATE INDEX "categories_blocks_carousel_path_idx" ON "categories_blocks_carousel" USING btree ("_path");
  CREATE INDEX "categories_blocks_three_item_grid_order_idx" ON "categories_blocks_three_item_grid" USING btree ("_order");
  CREATE INDEX "categories_blocks_three_item_grid_parent_id_idx" ON "categories_blocks_three_item_grid" USING btree ("_parent_id");
  CREATE INDEX "categories_blocks_three_item_grid_path_idx" ON "categories_blocks_three_item_grid" USING btree ("_path");
  CREATE INDEX "categories_blocks_archive_order_idx" ON "categories_blocks_archive" USING btree ("_order");
  CREATE INDEX "categories_blocks_archive_parent_id_idx" ON "categories_blocks_archive" USING btree ("_parent_id");
  CREATE INDEX "categories_blocks_archive_path_idx" ON "categories_blocks_archive" USING btree ("_path");
  CREATE INDEX "categories_blocks_code_order_idx" ON "categories_blocks_code" USING btree ("_order");
  CREATE INDEX "categories_blocks_code_parent_id_idx" ON "categories_blocks_code" USING btree ("_parent_id");
  CREATE INDEX "categories_blocks_code_path_idx" ON "categories_blocks_code" USING btree ("_path");
  CREATE INDEX "categories_blocks_form_block_order_idx" ON "categories_blocks_form_block" USING btree ("_order");
  CREATE INDEX "categories_blocks_form_block_parent_id_idx" ON "categories_blocks_form_block" USING btree ("_parent_id");
  CREATE INDEX "categories_blocks_form_block_path_idx" ON "categories_blocks_form_block" USING btree ("_path");
  CREATE INDEX "categories_blocks_form_block_form_idx" ON "categories_blocks_form_block" USING btree ("form_id");
  CREATE INDEX "categories_blocks_quote_order_idx" ON "categories_blocks_quote" USING btree ("_order");
  CREATE INDEX "categories_blocks_quote_parent_id_idx" ON "categories_blocks_quote" USING btree ("_parent_id");
  CREATE INDEX "categories_blocks_quote_path_idx" ON "categories_blocks_quote" USING btree ("_path");
  CREATE INDEX "categories_blocks_quote_avatar_idx" ON "categories_blocks_quote" USING btree ("avatar_id");
  CREATE UNIQUE INDEX "categories_blocks_quote_locales_locale_parent_id_unique" ON "categories_blocks_quote_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "categories_blocks_faq_items_order_idx" ON "categories_blocks_faq_items" USING btree ("_order");
  CREATE INDEX "categories_blocks_faq_items_parent_id_idx" ON "categories_blocks_faq_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "categories_blocks_faq_items_locales_locale_parent_id_unique" ON "categories_blocks_faq_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "categories_blocks_faq_order_idx" ON "categories_blocks_faq" USING btree ("_order");
  CREATE INDEX "categories_blocks_faq_parent_id_idx" ON "categories_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "categories_blocks_faq_path_idx" ON "categories_blocks_faq" USING btree ("_path");
  CREATE UNIQUE INDEX "categories_blocks_faq_locales_locale_parent_id_unique" ON "categories_blocks_faq_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "categories_blocks_stats_items_order_idx" ON "categories_blocks_stats_items" USING btree ("_order");
  CREATE INDEX "categories_blocks_stats_items_parent_id_idx" ON "categories_blocks_stats_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "categories_blocks_stats_items_locales_locale_parent_id_uniqu" ON "categories_blocks_stats_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "categories_blocks_stats_order_idx" ON "categories_blocks_stats" USING btree ("_order");
  CREATE INDEX "categories_blocks_stats_parent_id_idx" ON "categories_blocks_stats" USING btree ("_parent_id");
  CREATE INDEX "categories_blocks_stats_path_idx" ON "categories_blocks_stats" USING btree ("_path");
  CREATE UNIQUE INDEX "categories_blocks_stats_locales_locale_parent_id_unique" ON "categories_blocks_stats_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "categories_blocks_video_order_idx" ON "categories_blocks_video" USING btree ("_order");
  CREATE INDEX "categories_blocks_video_parent_id_idx" ON "categories_blocks_video" USING btree ("_parent_id");
  CREATE INDEX "categories_blocks_video_path_idx" ON "categories_blocks_video" USING btree ("_path");
  CREATE INDEX "categories_blocks_video_thumbnail_idx" ON "categories_blocks_video" USING btree ("thumbnail_id");
  CREATE UNIQUE INDEX "categories_blocks_video_locales_locale_parent_id_unique" ON "categories_blocks_video_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "categories_blocks_spacer_order_idx" ON "categories_blocks_spacer" USING btree ("_order");
  CREATE INDEX "categories_blocks_spacer_parent_id_idx" ON "categories_blocks_spacer" USING btree ("_parent_id");
  CREATE INDEX "categories_blocks_spacer_path_idx" ON "categories_blocks_spacer" USING btree ("_path");
  CREATE UNIQUE INDEX "categories_slug_idx" ON "categories" USING btree ("slug");
  CREATE INDEX "categories_parent_idx" ON "categories" USING btree ("parent_id");
  CREATE INDEX "categories_image_idx" ON "categories" USING btree ("image_id");
  CREATE INDEX "categories_seo_seo_image_idx" ON "categories" USING btree ("seo_image_id");
  CREATE INDEX "categories_updated_at_idx" ON "categories" USING btree ("updated_at");
  CREATE INDEX "categories_created_at_idx" ON "categories" USING btree ("created_at");
  CREATE UNIQUE INDEX "categories_locales_locale_parent_id_unique" ON "categories_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "categories_rels_order_idx" ON "categories_rels" USING btree ("order");
  CREATE INDEX "categories_rels_parent_idx" ON "categories_rels" USING btree ("parent_id");
  CREATE INDEX "categories_rels_path_idx" ON "categories_rels" USING btree ("path");
  CREATE INDEX "categories_rels_pages_id_idx" ON "categories_rels" USING btree ("pages_id");
  CREATE INDEX "categories_rels_products_id_idx" ON "categories_rels" USING btree ("products_id");
  CREATE INDEX "categories_rels_categories_id_idx" ON "categories_rels" USING btree ("categories_id");
  CREATE INDEX "categories_rels_brands_id_idx" ON "categories_rels" USING btree ("brands_id");
  CREATE INDEX "brands_blocks_banner_order_idx" ON "brands_blocks_banner" USING btree ("_order");
  CREATE INDEX "brands_blocks_banner_parent_id_idx" ON "brands_blocks_banner" USING btree ("_parent_id");
  CREATE INDEX "brands_blocks_banner_path_idx" ON "brands_blocks_banner" USING btree ("_path");
  CREATE INDEX "brands_blocks_cta_links_order_idx" ON "brands_blocks_cta_links" USING btree ("_order");
  CREATE INDEX "brands_blocks_cta_links_parent_id_idx" ON "brands_blocks_cta_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "brands_blocks_cta_links_locales_locale_parent_id_unique" ON "brands_blocks_cta_links_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "brands_blocks_cta_order_idx" ON "brands_blocks_cta" USING btree ("_order");
  CREATE INDEX "brands_blocks_cta_parent_id_idx" ON "brands_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "brands_blocks_cta_path_idx" ON "brands_blocks_cta" USING btree ("_path");
  CREATE INDEX "brands_blocks_content_columns_order_idx" ON "brands_blocks_content_columns" USING btree ("_order");
  CREATE INDEX "brands_blocks_content_columns_parent_id_idx" ON "brands_blocks_content_columns" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "brands_blocks_content_columns_locales_locale_parent_id_uniqu" ON "brands_blocks_content_columns_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "brands_blocks_content_order_idx" ON "brands_blocks_content" USING btree ("_order");
  CREATE INDEX "brands_blocks_content_parent_id_idx" ON "brands_blocks_content" USING btree ("_parent_id");
  CREATE INDEX "brands_blocks_content_path_idx" ON "brands_blocks_content" USING btree ("_path");
  CREATE INDEX "brands_blocks_media_block_order_idx" ON "brands_blocks_media_block" USING btree ("_order");
  CREATE INDEX "brands_blocks_media_block_parent_id_idx" ON "brands_blocks_media_block" USING btree ("_parent_id");
  CREATE INDEX "brands_blocks_media_block_path_idx" ON "brands_blocks_media_block" USING btree ("_path");
  CREATE INDEX "brands_blocks_media_block_media_idx" ON "brands_blocks_media_block" USING btree ("media_id");
  CREATE INDEX "brands_blocks_carousel_order_idx" ON "brands_blocks_carousel" USING btree ("_order");
  CREATE INDEX "brands_blocks_carousel_parent_id_idx" ON "brands_blocks_carousel" USING btree ("_parent_id");
  CREATE INDEX "brands_blocks_carousel_path_idx" ON "brands_blocks_carousel" USING btree ("_path");
  CREATE INDEX "brands_blocks_three_item_grid_order_idx" ON "brands_blocks_three_item_grid" USING btree ("_order");
  CREATE INDEX "brands_blocks_three_item_grid_parent_id_idx" ON "brands_blocks_three_item_grid" USING btree ("_parent_id");
  CREATE INDEX "brands_blocks_three_item_grid_path_idx" ON "brands_blocks_three_item_grid" USING btree ("_path");
  CREATE INDEX "brands_blocks_archive_order_idx" ON "brands_blocks_archive" USING btree ("_order");
  CREATE INDEX "brands_blocks_archive_parent_id_idx" ON "brands_blocks_archive" USING btree ("_parent_id");
  CREATE INDEX "brands_blocks_archive_path_idx" ON "brands_blocks_archive" USING btree ("_path");
  CREATE INDEX "brands_blocks_code_order_idx" ON "brands_blocks_code" USING btree ("_order");
  CREATE INDEX "brands_blocks_code_parent_id_idx" ON "brands_blocks_code" USING btree ("_parent_id");
  CREATE INDEX "brands_blocks_code_path_idx" ON "brands_blocks_code" USING btree ("_path");
  CREATE INDEX "brands_blocks_form_block_order_idx" ON "brands_blocks_form_block" USING btree ("_order");
  CREATE INDEX "brands_blocks_form_block_parent_id_idx" ON "brands_blocks_form_block" USING btree ("_parent_id");
  CREATE INDEX "brands_blocks_form_block_path_idx" ON "brands_blocks_form_block" USING btree ("_path");
  CREATE INDEX "brands_blocks_form_block_form_idx" ON "brands_blocks_form_block" USING btree ("form_id");
  CREATE INDEX "brands_blocks_quote_order_idx" ON "brands_blocks_quote" USING btree ("_order");
  CREATE INDEX "brands_blocks_quote_parent_id_idx" ON "brands_blocks_quote" USING btree ("_parent_id");
  CREATE INDEX "brands_blocks_quote_path_idx" ON "brands_blocks_quote" USING btree ("_path");
  CREATE INDEX "brands_blocks_quote_avatar_idx" ON "brands_blocks_quote" USING btree ("avatar_id");
  CREATE UNIQUE INDEX "brands_blocks_quote_locales_locale_parent_id_unique" ON "brands_blocks_quote_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "brands_blocks_faq_items_order_idx" ON "brands_blocks_faq_items" USING btree ("_order");
  CREATE INDEX "brands_blocks_faq_items_parent_id_idx" ON "brands_blocks_faq_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "brands_blocks_faq_items_locales_locale_parent_id_unique" ON "brands_blocks_faq_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "brands_blocks_faq_order_idx" ON "brands_blocks_faq" USING btree ("_order");
  CREATE INDEX "brands_blocks_faq_parent_id_idx" ON "brands_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "brands_blocks_faq_path_idx" ON "brands_blocks_faq" USING btree ("_path");
  CREATE UNIQUE INDEX "brands_blocks_faq_locales_locale_parent_id_unique" ON "brands_blocks_faq_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "brands_blocks_stats_items_order_idx" ON "brands_blocks_stats_items" USING btree ("_order");
  CREATE INDEX "brands_blocks_stats_items_parent_id_idx" ON "brands_blocks_stats_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "brands_blocks_stats_items_locales_locale_parent_id_unique" ON "brands_blocks_stats_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "brands_blocks_stats_order_idx" ON "brands_blocks_stats" USING btree ("_order");
  CREATE INDEX "brands_blocks_stats_parent_id_idx" ON "brands_blocks_stats" USING btree ("_parent_id");
  CREATE INDEX "brands_blocks_stats_path_idx" ON "brands_blocks_stats" USING btree ("_path");
  CREATE UNIQUE INDEX "brands_blocks_stats_locales_locale_parent_id_unique" ON "brands_blocks_stats_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "brands_blocks_video_order_idx" ON "brands_blocks_video" USING btree ("_order");
  CREATE INDEX "brands_blocks_video_parent_id_idx" ON "brands_blocks_video" USING btree ("_parent_id");
  CREATE INDEX "brands_blocks_video_path_idx" ON "brands_blocks_video" USING btree ("_path");
  CREATE INDEX "brands_blocks_video_thumbnail_idx" ON "brands_blocks_video" USING btree ("thumbnail_id");
  CREATE UNIQUE INDEX "brands_blocks_video_locales_locale_parent_id_unique" ON "brands_blocks_video_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "brands_blocks_spacer_order_idx" ON "brands_blocks_spacer" USING btree ("_order");
  CREATE INDEX "brands_blocks_spacer_parent_id_idx" ON "brands_blocks_spacer" USING btree ("_parent_id");
  CREATE INDEX "brands_blocks_spacer_path_idx" ON "brands_blocks_spacer" USING btree ("_path");
  CREATE UNIQUE INDEX "brands_slug_idx" ON "brands" USING btree ("slug");
  CREATE INDEX "brands_logo_idx" ON "brands" USING btree ("logo_id");
  CREATE INDEX "brands_seo_seo_image_idx" ON "brands" USING btree ("seo_image_id");
  CREATE INDEX "brands_updated_at_idx" ON "brands" USING btree ("updated_at");
  CREATE INDEX "brands_created_at_idx" ON "brands" USING btree ("created_at");
  CREATE UNIQUE INDEX "brands_locales_locale_parent_id_unique" ON "brands_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "brands_rels_order_idx" ON "brands_rels" USING btree ("order");
  CREATE INDEX "brands_rels_parent_idx" ON "brands_rels" USING btree ("parent_id");
  CREATE INDEX "brands_rels_path_idx" ON "brands_rels" USING btree ("path");
  CREATE INDEX "brands_rels_pages_id_idx" ON "brands_rels" USING btree ("pages_id");
  CREATE INDEX "brands_rels_products_id_idx" ON "brands_rels" USING btree ("products_id");
  CREATE INDEX "brands_rels_categories_id_idx" ON "brands_rels" USING btree ("categories_id");
  CREATE INDEX "brands_rels_brands_id_idx" ON "brands_rels" USING btree ("brands_id");
  CREATE UNIQUE INDEX "tags_slug_idx" ON "tags" USING btree ("slug");
  CREATE INDEX "tags_updated_at_idx" ON "tags" USING btree ("updated_at");
  CREATE INDEX "tags_created_at_idx" ON "tags" USING btree ("created_at");
  CREATE UNIQUE INDEX "tags_locales_locale_parent_id_unique" ON "tags_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "coupons_code_idx" ON "coupons" USING btree ("code");
  CREATE INDEX "coupons_updated_at_idx" ON "coupons" USING btree ("updated_at");
  CREATE INDEX "coupons_created_at_idx" ON "coupons" USING btree ("created_at");
  CREATE INDEX "coupons_rels_order_idx" ON "coupons_rels" USING btree ("order");
  CREATE INDEX "coupons_rels_parent_idx" ON "coupons_rels" USING btree ("parent_id");
  CREATE INDEX "coupons_rels_path_idx" ON "coupons_rels" USING btree ("path");
  CREATE INDEX "coupons_rels_products_id_idx" ON "coupons_rels" USING btree ("products_id");
  CREATE INDEX "coupons_rels_categories_id_idx" ON "coupons_rels" USING btree ("categories_id");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE UNIQUE INDEX "media_locales_locale_parent_id_unique" ON "media_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_checkbox_order_idx" ON "forms_blocks_checkbox" USING btree ("_order");
  CREATE INDEX "forms_blocks_checkbox_parent_id_idx" ON "forms_blocks_checkbox" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_checkbox_path_idx" ON "forms_blocks_checkbox" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_checkbox_locales_locale_parent_id_unique" ON "forms_blocks_checkbox_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_country_order_idx" ON "forms_blocks_country" USING btree ("_order");
  CREATE INDEX "forms_blocks_country_parent_id_idx" ON "forms_blocks_country" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_country_path_idx" ON "forms_blocks_country" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_country_locales_locale_parent_id_unique" ON "forms_blocks_country_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_email_order_idx" ON "forms_blocks_email" USING btree ("_order");
  CREATE INDEX "forms_blocks_email_parent_id_idx" ON "forms_blocks_email" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_email_path_idx" ON "forms_blocks_email" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_email_locales_locale_parent_id_unique" ON "forms_blocks_email_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_message_order_idx" ON "forms_blocks_message" USING btree ("_order");
  CREATE INDEX "forms_blocks_message_parent_id_idx" ON "forms_blocks_message" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_message_path_idx" ON "forms_blocks_message" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_message_locales_locale_parent_id_unique" ON "forms_blocks_message_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_number_order_idx" ON "forms_blocks_number" USING btree ("_order");
  CREATE INDEX "forms_blocks_number_parent_id_idx" ON "forms_blocks_number" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_number_path_idx" ON "forms_blocks_number" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_number_locales_locale_parent_id_unique" ON "forms_blocks_number_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_select_options_order_idx" ON "forms_blocks_select_options" USING btree ("_order");
  CREATE INDEX "forms_blocks_select_options_parent_id_idx" ON "forms_blocks_select_options" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "forms_blocks_select_options_locales_locale_parent_id_unique" ON "forms_blocks_select_options_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_select_order_idx" ON "forms_blocks_select" USING btree ("_order");
  CREATE INDEX "forms_blocks_select_parent_id_idx" ON "forms_blocks_select" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_select_path_idx" ON "forms_blocks_select" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_select_locales_locale_parent_id_unique" ON "forms_blocks_select_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_state_order_idx" ON "forms_blocks_state" USING btree ("_order");
  CREATE INDEX "forms_blocks_state_parent_id_idx" ON "forms_blocks_state" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_state_path_idx" ON "forms_blocks_state" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_state_locales_locale_parent_id_unique" ON "forms_blocks_state_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_text_order_idx" ON "forms_blocks_text" USING btree ("_order");
  CREATE INDEX "forms_blocks_text_parent_id_idx" ON "forms_blocks_text" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_text_path_idx" ON "forms_blocks_text" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_text_locales_locale_parent_id_unique" ON "forms_blocks_text_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_blocks_textarea_order_idx" ON "forms_blocks_textarea" USING btree ("_order");
  CREATE INDEX "forms_blocks_textarea_parent_id_idx" ON "forms_blocks_textarea" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_textarea_path_idx" ON "forms_blocks_textarea" USING btree ("_path");
  CREATE UNIQUE INDEX "forms_blocks_textarea_locales_locale_parent_id_unique" ON "forms_blocks_textarea_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_emails_order_idx" ON "forms_emails" USING btree ("_order");
  CREATE INDEX "forms_emails_parent_id_idx" ON "forms_emails" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "forms_emails_locales_locale_parent_id_unique" ON "forms_emails_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_updated_at_idx" ON "forms" USING btree ("updated_at");
  CREATE INDEX "forms_created_at_idx" ON "forms" USING btree ("created_at");
  CREATE UNIQUE INDEX "forms_locales_locale_parent_id_unique" ON "forms_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "form_submissions_submission_data_order_idx" ON "form_submissions_submission_data" USING btree ("_order");
  CREATE INDEX "form_submissions_submission_data_parent_id_idx" ON "form_submissions_submission_data" USING btree ("_parent_id");
  CREATE INDEX "form_submissions_form_idx" ON "form_submissions" USING btree ("form_id");
  CREATE INDEX "form_submissions_updated_at_idx" ON "form_submissions" USING btree ("updated_at");
  CREATE INDEX "form_submissions_created_at_idx" ON "form_submissions" USING btree ("created_at");
  CREATE INDEX "addresses_customer_idx" ON "addresses" USING btree ("customer_id");
  CREATE INDEX "addresses_updated_at_idx" ON "addresses" USING btree ("updated_at");
  CREATE INDEX "addresses_created_at_idx" ON "addresses" USING btree ("created_at");
  CREATE INDEX "variants_product_idx" ON "variants" USING btree ("product_id");
  CREATE INDEX "variants_updated_at_idx" ON "variants" USING btree ("updated_at");
  CREATE INDEX "variants_created_at_idx" ON "variants" USING btree ("created_at");
  CREATE INDEX "variants_deleted_at_idx" ON "variants" USING btree ("deleted_at");
  CREATE INDEX "variants__status_idx" ON "variants" USING btree ("_status");
  CREATE INDEX "variants_rels_order_idx" ON "variants_rels" USING btree ("order");
  CREATE INDEX "variants_rels_parent_idx" ON "variants_rels" USING btree ("parent_id");
  CREATE INDEX "variants_rels_path_idx" ON "variants_rels" USING btree ("path");
  CREATE INDEX "variants_rels_variant_options_id_idx" ON "variants_rels" USING btree ("variant_options_id");
  CREATE INDEX "_variants_v_parent_idx" ON "_variants_v" USING btree ("parent_id");
  CREATE INDEX "_variants_v_version_version_product_idx" ON "_variants_v" USING btree ("version_product_id");
  CREATE INDEX "_variants_v_version_version_updated_at_idx" ON "_variants_v" USING btree ("version_updated_at");
  CREATE INDEX "_variants_v_version_version_created_at_idx" ON "_variants_v" USING btree ("version_created_at");
  CREATE INDEX "_variants_v_version_version_deleted_at_idx" ON "_variants_v" USING btree ("version_deleted_at");
  CREATE INDEX "_variants_v_version_version__status_idx" ON "_variants_v" USING btree ("version__status");
  CREATE INDEX "_variants_v_created_at_idx" ON "_variants_v" USING btree ("created_at");
  CREATE INDEX "_variants_v_updated_at_idx" ON "_variants_v" USING btree ("updated_at");
  CREATE INDEX "_variants_v_snapshot_idx" ON "_variants_v" USING btree ("snapshot");
  CREATE INDEX "_variants_v_published_locale_idx" ON "_variants_v" USING btree ("published_locale");
  CREATE INDEX "_variants_v_latest_idx" ON "_variants_v" USING btree ("latest");
  CREATE INDEX "_variants_v_autosave_idx" ON "_variants_v" USING btree ("autosave");
  CREATE INDEX "_variants_v_rels_order_idx" ON "_variants_v_rels" USING btree ("order");
  CREATE INDEX "_variants_v_rels_parent_idx" ON "_variants_v_rels" USING btree ("parent_id");
  CREATE INDEX "_variants_v_rels_path_idx" ON "_variants_v_rels" USING btree ("path");
  CREATE INDEX "_variants_v_rels_variant_options_id_idx" ON "_variants_v_rels" USING btree ("variant_options_id");
  CREATE INDEX "variant_types_updated_at_idx" ON "variant_types" USING btree ("updated_at");
  CREATE INDEX "variant_types_created_at_idx" ON "variant_types" USING btree ("created_at");
  CREATE INDEX "variant_types_deleted_at_idx" ON "variant_types" USING btree ("deleted_at");
  CREATE INDEX "variant_options__variantoptions_options_order_idx" ON "variant_options" USING btree ("_variantoptions_options_order");
  CREATE INDEX "variant_options_variant_type_idx" ON "variant_options" USING btree ("variant_type_id");
  CREATE INDEX "variant_options_updated_at_idx" ON "variant_options" USING btree ("updated_at");
  CREATE INDEX "variant_options_created_at_idx" ON "variant_options" USING btree ("created_at");
  CREATE INDEX "variant_options_deleted_at_idx" ON "variant_options" USING btree ("deleted_at");
  CREATE INDEX "products_gallery_order_idx" ON "products_gallery" USING btree ("_order");
  CREATE INDEX "products_gallery_parent_id_idx" ON "products_gallery" USING btree ("_parent_id");
  CREATE INDEX "products_gallery_image_idx" ON "products_gallery" USING btree ("image_id");
  CREATE INDEX "products_gallery_variant_option_idx" ON "products_gallery" USING btree ("variant_option_id");
  CREATE INDEX "products_blocks_banner_order_idx" ON "products_blocks_banner" USING btree ("_order");
  CREATE INDEX "products_blocks_banner_parent_id_idx" ON "products_blocks_banner" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_banner_path_idx" ON "products_blocks_banner" USING btree ("_path");
  CREATE INDEX "products_blocks_cta_links_order_idx" ON "products_blocks_cta_links" USING btree ("_order");
  CREATE INDEX "products_blocks_cta_links_parent_id_idx" ON "products_blocks_cta_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "products_blocks_cta_links_locales_locale_parent_id_unique" ON "products_blocks_cta_links_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "products_blocks_cta_order_idx" ON "products_blocks_cta" USING btree ("_order");
  CREATE INDEX "products_blocks_cta_parent_id_idx" ON "products_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_cta_path_idx" ON "products_blocks_cta" USING btree ("_path");
  CREATE INDEX "products_blocks_content_columns_order_idx" ON "products_blocks_content_columns" USING btree ("_order");
  CREATE INDEX "products_blocks_content_columns_parent_id_idx" ON "products_blocks_content_columns" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "products_blocks_content_columns_locales_locale_parent_id_uni" ON "products_blocks_content_columns_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "products_blocks_content_order_idx" ON "products_blocks_content" USING btree ("_order");
  CREATE INDEX "products_blocks_content_parent_id_idx" ON "products_blocks_content" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_content_path_idx" ON "products_blocks_content" USING btree ("_path");
  CREATE INDEX "products_blocks_media_block_order_idx" ON "products_blocks_media_block" USING btree ("_order");
  CREATE INDEX "products_blocks_media_block_parent_id_idx" ON "products_blocks_media_block" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_media_block_path_idx" ON "products_blocks_media_block" USING btree ("_path");
  CREATE INDEX "products_blocks_media_block_media_idx" ON "products_blocks_media_block" USING btree ("media_id");
  CREATE INDEX "products_blocks_carousel_order_idx" ON "products_blocks_carousel" USING btree ("_order");
  CREATE INDEX "products_blocks_carousel_parent_id_idx" ON "products_blocks_carousel" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_carousel_path_idx" ON "products_blocks_carousel" USING btree ("_path");
  CREATE INDEX "products_blocks_three_item_grid_order_idx" ON "products_blocks_three_item_grid" USING btree ("_order");
  CREATE INDEX "products_blocks_three_item_grid_parent_id_idx" ON "products_blocks_three_item_grid" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_three_item_grid_path_idx" ON "products_blocks_three_item_grid" USING btree ("_path");
  CREATE INDEX "products_blocks_archive_order_idx" ON "products_blocks_archive" USING btree ("_order");
  CREATE INDEX "products_blocks_archive_parent_id_idx" ON "products_blocks_archive" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_archive_path_idx" ON "products_blocks_archive" USING btree ("_path");
  CREATE INDEX "products_blocks_code_order_idx" ON "products_blocks_code" USING btree ("_order");
  CREATE INDEX "products_blocks_code_parent_id_idx" ON "products_blocks_code" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_code_path_idx" ON "products_blocks_code" USING btree ("_path");
  CREATE INDEX "products_blocks_form_block_order_idx" ON "products_blocks_form_block" USING btree ("_order");
  CREATE INDEX "products_blocks_form_block_parent_id_idx" ON "products_blocks_form_block" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_form_block_path_idx" ON "products_blocks_form_block" USING btree ("_path");
  CREATE INDEX "products_blocks_form_block_form_idx" ON "products_blocks_form_block" USING btree ("form_id");
  CREATE INDEX "products_blocks_quote_order_idx" ON "products_blocks_quote" USING btree ("_order");
  CREATE INDEX "products_blocks_quote_parent_id_idx" ON "products_blocks_quote" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_quote_path_idx" ON "products_blocks_quote" USING btree ("_path");
  CREATE INDEX "products_blocks_quote_avatar_idx" ON "products_blocks_quote" USING btree ("avatar_id");
  CREATE UNIQUE INDEX "products_blocks_quote_locales_locale_parent_id_unique" ON "products_blocks_quote_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "products_blocks_faq_items_order_idx" ON "products_blocks_faq_items" USING btree ("_order");
  CREATE INDEX "products_blocks_faq_items_parent_id_idx" ON "products_blocks_faq_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "products_blocks_faq_items_locales_locale_parent_id_unique" ON "products_blocks_faq_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "products_blocks_faq_order_idx" ON "products_blocks_faq" USING btree ("_order");
  CREATE INDEX "products_blocks_faq_parent_id_idx" ON "products_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_faq_path_idx" ON "products_blocks_faq" USING btree ("_path");
  CREATE UNIQUE INDEX "products_blocks_faq_locales_locale_parent_id_unique" ON "products_blocks_faq_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "products_blocks_stats_items_order_idx" ON "products_blocks_stats_items" USING btree ("_order");
  CREATE INDEX "products_blocks_stats_items_parent_id_idx" ON "products_blocks_stats_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "products_blocks_stats_items_locales_locale_parent_id_unique" ON "products_blocks_stats_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "products_blocks_stats_order_idx" ON "products_blocks_stats" USING btree ("_order");
  CREATE INDEX "products_blocks_stats_parent_id_idx" ON "products_blocks_stats" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_stats_path_idx" ON "products_blocks_stats" USING btree ("_path");
  CREATE UNIQUE INDEX "products_blocks_stats_locales_locale_parent_id_unique" ON "products_blocks_stats_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "products_blocks_video_order_idx" ON "products_blocks_video" USING btree ("_order");
  CREATE INDEX "products_blocks_video_parent_id_idx" ON "products_blocks_video" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_video_path_idx" ON "products_blocks_video" USING btree ("_path");
  CREATE INDEX "products_blocks_video_thumbnail_idx" ON "products_blocks_video" USING btree ("thumbnail_id");
  CREATE UNIQUE INDEX "products_blocks_video_locales_locale_parent_id_unique" ON "products_blocks_video_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "products_blocks_spacer_order_idx" ON "products_blocks_spacer" USING btree ("_order");
  CREATE INDEX "products_blocks_spacer_parent_id_idx" ON "products_blocks_spacer" USING btree ("_parent_id");
  CREATE INDEX "products_blocks_spacer_path_idx" ON "products_blocks_spacer" USING btree ("_path");
  CREATE INDEX "products_badges_order_idx" ON "products_badges" USING btree ("_order");
  CREATE INDEX "products_badges_parent_id_idx" ON "products_badges" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "products_badges_locales_locale_parent_id_unique" ON "products_badges_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "products_highlights_order_idx" ON "products_highlights" USING btree ("_order");
  CREATE INDEX "products_highlights_parent_id_idx" ON "products_highlights" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "products_highlights_locales_locale_parent_id_unique" ON "products_highlights_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "products_specifications_order_idx" ON "products_specifications" USING btree ("_order");
  CREATE INDEX "products_specifications_parent_id_idx" ON "products_specifications" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "products_specifications_locales_locale_parent_id_unique" ON "products_specifications_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "products_brand_idx" ON "products" USING btree ("brand_id");
  CREATE UNIQUE INDEX "products_slug_idx" ON "products" USING btree ("slug");
  CREATE INDEX "products_updated_at_idx" ON "products" USING btree ("updated_at");
  CREATE INDEX "products_created_at_idx" ON "products" USING btree ("created_at");
  CREATE INDEX "products_deleted_at_idx" ON "products" USING btree ("deleted_at");
  CREATE INDEX "products__status_idx" ON "products" USING btree ("_status");
  CREATE INDEX "products_meta_meta_image_idx" ON "products_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "products_locales_locale_parent_id_unique" ON "products_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "products_rels_order_idx" ON "products_rels" USING btree ("order");
  CREATE INDEX "products_rels_parent_idx" ON "products_rels" USING btree ("parent_id");
  CREATE INDEX "products_rels_path_idx" ON "products_rels" USING btree ("path");
  CREATE INDEX "products_rels_pages_id_idx" ON "products_rels" USING btree ("pages_id");
  CREATE INDEX "products_rels_products_id_idx" ON "products_rels" USING btree ("products_id");
  CREATE INDEX "products_rels_categories_id_idx" ON "products_rels" USING btree ("categories_id");
  CREATE INDEX "products_rels_brands_id_idx" ON "products_rels" USING btree ("brands_id");
  CREATE INDEX "products_rels_variant_types_id_idx" ON "products_rels" USING btree ("variant_types_id");
  CREATE INDEX "products_rels_tags_id_idx" ON "products_rels" USING btree ("tags_id");
  CREATE INDEX "_products_v_version_gallery_order_idx" ON "_products_v_version_gallery" USING btree ("_order");
  CREATE INDEX "_products_v_version_gallery_parent_id_idx" ON "_products_v_version_gallery" USING btree ("_parent_id");
  CREATE INDEX "_products_v_version_gallery_image_idx" ON "_products_v_version_gallery" USING btree ("image_id");
  CREATE INDEX "_products_v_version_gallery_variant_option_idx" ON "_products_v_version_gallery" USING btree ("variant_option_id");
  CREATE INDEX "_products_v_blocks_banner_order_idx" ON "_products_v_blocks_banner" USING btree ("_order");
  CREATE INDEX "_products_v_blocks_banner_parent_id_idx" ON "_products_v_blocks_banner" USING btree ("_parent_id");
  CREATE INDEX "_products_v_blocks_banner_path_idx" ON "_products_v_blocks_banner" USING btree ("_path");
  CREATE INDEX "_products_v_blocks_cta_links_order_idx" ON "_products_v_blocks_cta_links" USING btree ("_order");
  CREATE INDEX "_products_v_blocks_cta_links_parent_id_idx" ON "_products_v_blocks_cta_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_products_v_blocks_cta_links_locales_locale_parent_id_unique" ON "_products_v_blocks_cta_links_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_products_v_blocks_cta_order_idx" ON "_products_v_blocks_cta" USING btree ("_order");
  CREATE INDEX "_products_v_blocks_cta_parent_id_idx" ON "_products_v_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "_products_v_blocks_cta_path_idx" ON "_products_v_blocks_cta" USING btree ("_path");
  CREATE INDEX "_products_v_blocks_content_columns_order_idx" ON "_products_v_blocks_content_columns" USING btree ("_order");
  CREATE INDEX "_products_v_blocks_content_columns_parent_id_idx" ON "_products_v_blocks_content_columns" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_products_v_blocks_content_columns_locales_locale_parent_id_" ON "_products_v_blocks_content_columns_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_products_v_blocks_content_order_idx" ON "_products_v_blocks_content" USING btree ("_order");
  CREATE INDEX "_products_v_blocks_content_parent_id_idx" ON "_products_v_blocks_content" USING btree ("_parent_id");
  CREATE INDEX "_products_v_blocks_content_path_idx" ON "_products_v_blocks_content" USING btree ("_path");
  CREATE INDEX "_products_v_blocks_media_block_order_idx" ON "_products_v_blocks_media_block" USING btree ("_order");
  CREATE INDEX "_products_v_blocks_media_block_parent_id_idx" ON "_products_v_blocks_media_block" USING btree ("_parent_id");
  CREATE INDEX "_products_v_blocks_media_block_path_idx" ON "_products_v_blocks_media_block" USING btree ("_path");
  CREATE INDEX "_products_v_blocks_media_block_media_idx" ON "_products_v_blocks_media_block" USING btree ("media_id");
  CREATE INDEX "_products_v_blocks_carousel_order_idx" ON "_products_v_blocks_carousel" USING btree ("_order");
  CREATE INDEX "_products_v_blocks_carousel_parent_id_idx" ON "_products_v_blocks_carousel" USING btree ("_parent_id");
  CREATE INDEX "_products_v_blocks_carousel_path_idx" ON "_products_v_blocks_carousel" USING btree ("_path");
  CREATE INDEX "_products_v_blocks_three_item_grid_order_idx" ON "_products_v_blocks_three_item_grid" USING btree ("_order");
  CREATE INDEX "_products_v_blocks_three_item_grid_parent_id_idx" ON "_products_v_blocks_three_item_grid" USING btree ("_parent_id");
  CREATE INDEX "_products_v_blocks_three_item_grid_path_idx" ON "_products_v_blocks_three_item_grid" USING btree ("_path");
  CREATE INDEX "_products_v_blocks_archive_order_idx" ON "_products_v_blocks_archive" USING btree ("_order");
  CREATE INDEX "_products_v_blocks_archive_parent_id_idx" ON "_products_v_blocks_archive" USING btree ("_parent_id");
  CREATE INDEX "_products_v_blocks_archive_path_idx" ON "_products_v_blocks_archive" USING btree ("_path");
  CREATE INDEX "_products_v_blocks_code_order_idx" ON "_products_v_blocks_code" USING btree ("_order");
  CREATE INDEX "_products_v_blocks_code_parent_id_idx" ON "_products_v_blocks_code" USING btree ("_parent_id");
  CREATE INDEX "_products_v_blocks_code_path_idx" ON "_products_v_blocks_code" USING btree ("_path");
  CREATE INDEX "_products_v_blocks_form_block_order_idx" ON "_products_v_blocks_form_block" USING btree ("_order");
  CREATE INDEX "_products_v_blocks_form_block_parent_id_idx" ON "_products_v_blocks_form_block" USING btree ("_parent_id");
  CREATE INDEX "_products_v_blocks_form_block_path_idx" ON "_products_v_blocks_form_block" USING btree ("_path");
  CREATE INDEX "_products_v_blocks_form_block_form_idx" ON "_products_v_blocks_form_block" USING btree ("form_id");
  CREATE INDEX "_products_v_blocks_quote_order_idx" ON "_products_v_blocks_quote" USING btree ("_order");
  CREATE INDEX "_products_v_blocks_quote_parent_id_idx" ON "_products_v_blocks_quote" USING btree ("_parent_id");
  CREATE INDEX "_products_v_blocks_quote_path_idx" ON "_products_v_blocks_quote" USING btree ("_path");
  CREATE INDEX "_products_v_blocks_quote_avatar_idx" ON "_products_v_blocks_quote" USING btree ("avatar_id");
  CREATE UNIQUE INDEX "_products_v_blocks_quote_locales_locale_parent_id_unique" ON "_products_v_blocks_quote_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_products_v_blocks_faq_items_order_idx" ON "_products_v_blocks_faq_items" USING btree ("_order");
  CREATE INDEX "_products_v_blocks_faq_items_parent_id_idx" ON "_products_v_blocks_faq_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_products_v_blocks_faq_items_locales_locale_parent_id_unique" ON "_products_v_blocks_faq_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_products_v_blocks_faq_order_idx" ON "_products_v_blocks_faq" USING btree ("_order");
  CREATE INDEX "_products_v_blocks_faq_parent_id_idx" ON "_products_v_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "_products_v_blocks_faq_path_idx" ON "_products_v_blocks_faq" USING btree ("_path");
  CREATE UNIQUE INDEX "_products_v_blocks_faq_locales_locale_parent_id_unique" ON "_products_v_blocks_faq_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_products_v_blocks_stats_items_order_idx" ON "_products_v_blocks_stats_items" USING btree ("_order");
  CREATE INDEX "_products_v_blocks_stats_items_parent_id_idx" ON "_products_v_blocks_stats_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_products_v_blocks_stats_items_locales_locale_parent_id_uniq" ON "_products_v_blocks_stats_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_products_v_blocks_stats_order_idx" ON "_products_v_blocks_stats" USING btree ("_order");
  CREATE INDEX "_products_v_blocks_stats_parent_id_idx" ON "_products_v_blocks_stats" USING btree ("_parent_id");
  CREATE INDEX "_products_v_blocks_stats_path_idx" ON "_products_v_blocks_stats" USING btree ("_path");
  CREATE UNIQUE INDEX "_products_v_blocks_stats_locales_locale_parent_id_unique" ON "_products_v_blocks_stats_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_products_v_blocks_video_order_idx" ON "_products_v_blocks_video" USING btree ("_order");
  CREATE INDEX "_products_v_blocks_video_parent_id_idx" ON "_products_v_blocks_video" USING btree ("_parent_id");
  CREATE INDEX "_products_v_blocks_video_path_idx" ON "_products_v_blocks_video" USING btree ("_path");
  CREATE INDEX "_products_v_blocks_video_thumbnail_idx" ON "_products_v_blocks_video" USING btree ("thumbnail_id");
  CREATE UNIQUE INDEX "_products_v_blocks_video_locales_locale_parent_id_unique" ON "_products_v_blocks_video_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_products_v_blocks_spacer_order_idx" ON "_products_v_blocks_spacer" USING btree ("_order");
  CREATE INDEX "_products_v_blocks_spacer_parent_id_idx" ON "_products_v_blocks_spacer" USING btree ("_parent_id");
  CREATE INDEX "_products_v_blocks_spacer_path_idx" ON "_products_v_blocks_spacer" USING btree ("_path");
  CREATE INDEX "_products_v_version_badges_order_idx" ON "_products_v_version_badges" USING btree ("_order");
  CREATE INDEX "_products_v_version_badges_parent_id_idx" ON "_products_v_version_badges" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_products_v_version_badges_locales_locale_parent_id_unique" ON "_products_v_version_badges_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_products_v_version_highlights_order_idx" ON "_products_v_version_highlights" USING btree ("_order");
  CREATE INDEX "_products_v_version_highlights_parent_id_idx" ON "_products_v_version_highlights" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_products_v_version_highlights_locales_locale_parent_id_uniq" ON "_products_v_version_highlights_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_products_v_version_specifications_order_idx" ON "_products_v_version_specifications" USING btree ("_order");
  CREATE INDEX "_products_v_version_specifications_parent_id_idx" ON "_products_v_version_specifications" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_products_v_version_specifications_locales_locale_parent_id_" ON "_products_v_version_specifications_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_products_v_parent_idx" ON "_products_v" USING btree ("parent_id");
  CREATE INDEX "_products_v_version_version_brand_idx" ON "_products_v" USING btree ("version_brand_id");
  CREATE INDEX "_products_v_version_version_slug_idx" ON "_products_v" USING btree ("version_slug");
  CREATE INDEX "_products_v_version_version_updated_at_idx" ON "_products_v" USING btree ("version_updated_at");
  CREATE INDEX "_products_v_version_version_created_at_idx" ON "_products_v" USING btree ("version_created_at");
  CREATE INDEX "_products_v_version_version_deleted_at_idx" ON "_products_v" USING btree ("version_deleted_at");
  CREATE INDEX "_products_v_version_version__status_idx" ON "_products_v" USING btree ("version__status");
  CREATE INDEX "_products_v_created_at_idx" ON "_products_v" USING btree ("created_at");
  CREATE INDEX "_products_v_updated_at_idx" ON "_products_v" USING btree ("updated_at");
  CREATE INDEX "_products_v_snapshot_idx" ON "_products_v" USING btree ("snapshot");
  CREATE INDEX "_products_v_published_locale_idx" ON "_products_v" USING btree ("published_locale");
  CREATE INDEX "_products_v_latest_idx" ON "_products_v" USING btree ("latest");
  CREATE INDEX "_products_v_autosave_idx" ON "_products_v" USING btree ("autosave");
  CREATE INDEX "_products_v_version_meta_version_meta_image_idx" ON "_products_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE UNIQUE INDEX "_products_v_locales_locale_parent_id_unique" ON "_products_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_products_v_rels_order_idx" ON "_products_v_rels" USING btree ("order");
  CREATE INDEX "_products_v_rels_parent_idx" ON "_products_v_rels" USING btree ("parent_id");
  CREATE INDEX "_products_v_rels_path_idx" ON "_products_v_rels" USING btree ("path");
  CREATE INDEX "_products_v_rels_pages_id_idx" ON "_products_v_rels" USING btree ("pages_id");
  CREATE INDEX "_products_v_rels_products_id_idx" ON "_products_v_rels" USING btree ("products_id");
  CREATE INDEX "_products_v_rels_categories_id_idx" ON "_products_v_rels" USING btree ("categories_id");
  CREATE INDEX "_products_v_rels_brands_id_idx" ON "_products_v_rels" USING btree ("brands_id");
  CREATE INDEX "_products_v_rels_variant_types_id_idx" ON "_products_v_rels" USING btree ("variant_types_id");
  CREATE INDEX "_products_v_rels_tags_id_idx" ON "_products_v_rels" USING btree ("tags_id");
  CREATE INDEX "carts_items_order_idx" ON "carts_items" USING btree ("_order");
  CREATE INDEX "carts_items_parent_id_idx" ON "carts_items" USING btree ("_parent_id");
  CREATE INDEX "carts_items_product_idx" ON "carts_items" USING btree ("product_id");
  CREATE INDEX "carts_items_variant_idx" ON "carts_items" USING btree ("variant_id");
  CREATE INDEX "carts_secret_idx" ON "carts" USING btree ("secret");
  CREATE INDEX "carts_customer_idx" ON "carts" USING btree ("customer_id");
  CREATE INDEX "carts_updated_at_idx" ON "carts" USING btree ("updated_at");
  CREATE INDEX "carts_created_at_idx" ON "carts" USING btree ("created_at");
  CREATE INDEX "orders_items_order_idx" ON "orders_items" USING btree ("_order");
  CREATE INDEX "orders_items_parent_id_idx" ON "orders_items" USING btree ("_parent_id");
  CREATE INDEX "orders_items_product_idx" ON "orders_items" USING btree ("product_id");
  CREATE INDEX "orders_items_variant_idx" ON "orders_items" USING btree ("variant_id");
  CREATE INDEX "orders_customer_idx" ON "orders" USING btree ("customer_id");
  CREATE UNIQUE INDEX "orders_access_token_idx" ON "orders" USING btree ("access_token");
  CREATE INDEX "orders_updated_at_idx" ON "orders" USING btree ("updated_at");
  CREATE INDEX "orders_created_at_idx" ON "orders" USING btree ("created_at");
  CREATE INDEX "orders_rels_order_idx" ON "orders_rels" USING btree ("order");
  CREATE INDEX "orders_rels_parent_idx" ON "orders_rels" USING btree ("parent_id");
  CREATE INDEX "orders_rels_path_idx" ON "orders_rels" USING btree ("path");
  CREATE INDEX "orders_rels_transactions_id_idx" ON "orders_rels" USING btree ("transactions_id");
  CREATE INDEX "transactions_items_order_idx" ON "transactions_items" USING btree ("_order");
  CREATE INDEX "transactions_items_parent_id_idx" ON "transactions_items" USING btree ("_parent_id");
  CREATE INDEX "transactions_items_product_idx" ON "transactions_items" USING btree ("product_id");
  CREATE INDEX "transactions_items_variant_idx" ON "transactions_items" USING btree ("variant_id");
  CREATE INDEX "transactions_customer_idx" ON "transactions" USING btree ("customer_id");
  CREATE INDEX "transactions_order_idx" ON "transactions" USING btree ("order_id");
  CREATE INDEX "transactions_cart_idx" ON "transactions" USING btree ("cart_id");
  CREATE INDEX "transactions_updated_at_idx" ON "transactions" USING btree ("updated_at");
  CREATE INDEX "transactions_created_at_idx" ON "transactions" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("categories_id");
  CREATE INDEX "payload_locked_documents_rels_brands_id_idx" ON "payload_locked_documents_rels" USING btree ("brands_id");
  CREATE INDEX "payload_locked_documents_rels_tags_id_idx" ON "payload_locked_documents_rels" USING btree ("tags_id");
  CREATE INDEX "payload_locked_documents_rels_coupons_id_idx" ON "payload_locked_documents_rels" USING btree ("coupons_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_forms_id_idx" ON "payload_locked_documents_rels" USING btree ("forms_id");
  CREATE INDEX "payload_locked_documents_rels_form_submissions_id_idx" ON "payload_locked_documents_rels" USING btree ("form_submissions_id");
  CREATE INDEX "payload_locked_documents_rels_addresses_id_idx" ON "payload_locked_documents_rels" USING btree ("addresses_id");
  CREATE INDEX "payload_locked_documents_rels_variants_id_idx" ON "payload_locked_documents_rels" USING btree ("variants_id");
  CREATE INDEX "payload_locked_documents_rels_variant_types_id_idx" ON "payload_locked_documents_rels" USING btree ("variant_types_id");
  CREATE INDEX "payload_locked_documents_rels_variant_options_id_idx" ON "payload_locked_documents_rels" USING btree ("variant_options_id");
  CREATE INDEX "payload_locked_documents_rels_products_id_idx" ON "payload_locked_documents_rels" USING btree ("products_id");
  CREATE INDEX "payload_locked_documents_rels_carts_id_idx" ON "payload_locked_documents_rels" USING btree ("carts_id");
  CREATE INDEX "payload_locked_documents_rels_orders_id_idx" ON "payload_locked_documents_rels" USING btree ("orders_id");
  CREATE INDEX "payload_locked_documents_rels_transactions_id_idx" ON "payload_locked_documents_rels" USING btree ("transactions_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "header_nav_items_sub_items_order_idx" ON "header_nav_items_sub_items" USING btree ("_order");
  CREATE INDEX "header_nav_items_sub_items_parent_id_idx" ON "header_nav_items_sub_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "header_nav_items_sub_items_locales_locale_parent_id_unique" ON "header_nav_items_sub_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "header_nav_items_order_idx" ON "header_nav_items" USING btree ("_order");
  CREATE INDEX "header_nav_items_parent_id_idx" ON "header_nav_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "header_nav_items_locales_locale_parent_id_unique" ON "header_nav_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "header_promo_banner_promo_banner_image_idx" ON "header" USING btree ("promo_banner_image_id");
  CREATE UNIQUE INDEX "header_locales_locale_parent_id_unique" ON "header_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "header_rels_order_idx" ON "header_rels" USING btree ("order");
  CREATE INDEX "header_rels_parent_idx" ON "header_rels" USING btree ("parent_id");
  CREATE INDEX "header_rels_path_idx" ON "header_rels" USING btree ("path");
  CREATE INDEX "header_rels_pages_id_idx" ON "header_rels" USING btree ("pages_id");
  CREATE INDEX "header_rels_products_id_idx" ON "header_rels" USING btree ("products_id");
  CREATE INDEX "header_rels_categories_id_idx" ON "header_rels" USING btree ("categories_id");
  CREATE INDEX "header_rels_brands_id_idx" ON "header_rels" USING btree ("brands_id");
  CREATE INDEX "footer_nav_items_order_idx" ON "footer_nav_items" USING btree ("_order");
  CREATE INDEX "footer_nav_items_parent_id_idx" ON "footer_nav_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "footer_nav_items_locales_locale_parent_id_unique" ON "footer_nav_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "footer_blocks_footer_brand_order_idx" ON "footer_blocks_footer_brand" USING btree ("_order");
  CREATE INDEX "footer_blocks_footer_brand_parent_id_idx" ON "footer_blocks_footer_brand" USING btree ("_parent_id");
  CREATE INDEX "footer_blocks_footer_brand_path_idx" ON "footer_blocks_footer_brand" USING btree ("_path");
  CREATE INDEX "footer_blocks_footer_brand_logo_idx" ON "footer_blocks_footer_brand" USING btree ("logo_id");
  CREATE UNIQUE INDEX "footer_blocks_footer_brand_locales_locale_parent_id_unique" ON "footer_blocks_footer_brand_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "footer_blocks_footer_column_links_order_idx" ON "footer_blocks_footer_column_links" USING btree ("_order");
  CREATE INDEX "footer_blocks_footer_column_links_parent_id_idx" ON "footer_blocks_footer_column_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "footer_blocks_footer_column_links_locales_locale_parent_id_u" ON "footer_blocks_footer_column_links_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "footer_blocks_footer_column_order_idx" ON "footer_blocks_footer_column" USING btree ("_order");
  CREATE INDEX "footer_blocks_footer_column_parent_id_idx" ON "footer_blocks_footer_column" USING btree ("_parent_id");
  CREATE INDEX "footer_blocks_footer_column_path_idx" ON "footer_blocks_footer_column" USING btree ("_path");
  CREATE UNIQUE INDEX "footer_blocks_footer_column_locales_locale_parent_id_unique" ON "footer_blocks_footer_column_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "footer_blocks_footer_text_order_idx" ON "footer_blocks_footer_text" USING btree ("_order");
  CREATE INDEX "footer_blocks_footer_text_parent_id_idx" ON "footer_blocks_footer_text" USING btree ("_parent_id");
  CREATE INDEX "footer_blocks_footer_text_path_idx" ON "footer_blocks_footer_text" USING btree ("_path");
  CREATE UNIQUE INDEX "footer_blocks_footer_text_locales_locale_parent_id_unique" ON "footer_blocks_footer_text_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "footer_blocks_footer_contact_order_idx" ON "footer_blocks_footer_contact" USING btree ("_order");
  CREATE INDEX "footer_blocks_footer_contact_parent_id_idx" ON "footer_blocks_footer_contact" USING btree ("_parent_id");
  CREATE INDEX "footer_blocks_footer_contact_path_idx" ON "footer_blocks_footer_contact" USING btree ("_path");
  CREATE UNIQUE INDEX "footer_blocks_footer_contact_locales_locale_parent_id_unique" ON "footer_blocks_footer_contact_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "footer_blocks_footer_social_profiles_order_idx" ON "footer_blocks_footer_social_profiles" USING btree ("_order");
  CREATE INDEX "footer_blocks_footer_social_profiles_parent_id_idx" ON "footer_blocks_footer_social_profiles" USING btree ("_parent_id");
  CREATE INDEX "footer_blocks_footer_social_order_idx" ON "footer_blocks_footer_social" USING btree ("_order");
  CREATE INDEX "footer_blocks_footer_social_parent_id_idx" ON "footer_blocks_footer_social" USING btree ("_parent_id");
  CREATE INDEX "footer_blocks_footer_social_path_idx" ON "footer_blocks_footer_social" USING btree ("_path");
  CREATE UNIQUE INDEX "footer_blocks_footer_social_locales_locale_parent_id_unique" ON "footer_blocks_footer_social_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "footer_blocks_footer_newsletter_order_idx" ON "footer_blocks_footer_newsletter" USING btree ("_order");
  CREATE INDEX "footer_blocks_footer_newsletter_parent_id_idx" ON "footer_blocks_footer_newsletter" USING btree ("_parent_id");
  CREATE INDEX "footer_blocks_footer_newsletter_path_idx" ON "footer_blocks_footer_newsletter" USING btree ("_path");
  CREATE UNIQUE INDEX "footer_blocks_footer_newsletter_locales_locale_parent_id_uni" ON "footer_blocks_footer_newsletter_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "footer_bottom_bar_legal_links_order_idx" ON "footer_bottom_bar_legal_links" USING btree ("_order");
  CREATE INDEX "footer_bottom_bar_legal_links_parent_id_idx" ON "footer_bottom_bar_legal_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "footer_bottom_bar_legal_links_locales_locale_parent_id_uniqu" ON "footer_bottom_bar_legal_links_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "footer_locales_locale_parent_id_unique" ON "footer_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "footer_rels_order_idx" ON "footer_rels" USING btree ("order");
  CREATE INDEX "footer_rels_parent_idx" ON "footer_rels" USING btree ("parent_id");
  CREATE INDEX "footer_rels_path_idx" ON "footer_rels" USING btree ("path");
  CREATE INDEX "footer_rels_pages_id_idx" ON "footer_rels" USING btree ("pages_id");
  CREATE INDEX "footer_rels_products_id_idx" ON "footer_rels" USING btree ("products_id");
  CREATE INDEX "footer_rels_categories_id_idx" ON "footer_rels" USING btree ("categories_id");
  CREATE INDEX "footer_rels_brands_id_idx" ON "footer_rels" USING btree ("brands_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_roles" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "pages_hero_links" CASCADE;
  DROP TABLE "pages_hero_links_locales" CASCADE;
  DROP TABLE "pages_blocks_banner" CASCADE;
  DROP TABLE "pages_blocks_cta_links" CASCADE;
  DROP TABLE "pages_blocks_cta_links_locales" CASCADE;
  DROP TABLE "pages_blocks_cta" CASCADE;
  DROP TABLE "pages_blocks_content_columns" CASCADE;
  DROP TABLE "pages_blocks_content_columns_locales" CASCADE;
  DROP TABLE "pages_blocks_content" CASCADE;
  DROP TABLE "pages_blocks_media_block" CASCADE;
  DROP TABLE "pages_blocks_carousel" CASCADE;
  DROP TABLE "pages_blocks_three_item_grid" CASCADE;
  DROP TABLE "pages_blocks_archive" CASCADE;
  DROP TABLE "pages_blocks_code" CASCADE;
  DROP TABLE "pages_blocks_form_block" CASCADE;
  DROP TABLE "pages_blocks_quote" CASCADE;
  DROP TABLE "pages_blocks_quote_locales" CASCADE;
  DROP TABLE "pages_blocks_faq_items" CASCADE;
  DROP TABLE "pages_blocks_faq_items_locales" CASCADE;
  DROP TABLE "pages_blocks_faq" CASCADE;
  DROP TABLE "pages_blocks_faq_locales" CASCADE;
  DROP TABLE "pages_blocks_stats_items" CASCADE;
  DROP TABLE "pages_blocks_stats_items_locales" CASCADE;
  DROP TABLE "pages_blocks_stats" CASCADE;
  DROP TABLE "pages_blocks_stats_locales" CASCADE;
  DROP TABLE "pages_blocks_video" CASCADE;
  DROP TABLE "pages_blocks_video_locales" CASCADE;
  DROP TABLE "pages_blocks_spacer" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "pages_locales" CASCADE;
  DROP TABLE "pages_rels" CASCADE;
  DROP TABLE "_pages_v_version_hero_links" CASCADE;
  DROP TABLE "_pages_v_version_hero_links_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_banner" CASCADE;
  DROP TABLE "_pages_v_blocks_cta_links" CASCADE;
  DROP TABLE "_pages_v_blocks_cta_links_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_cta" CASCADE;
  DROP TABLE "_pages_v_blocks_content_columns" CASCADE;
  DROP TABLE "_pages_v_blocks_content_columns_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_content" CASCADE;
  DROP TABLE "_pages_v_blocks_media_block" CASCADE;
  DROP TABLE "_pages_v_blocks_carousel" CASCADE;
  DROP TABLE "_pages_v_blocks_three_item_grid" CASCADE;
  DROP TABLE "_pages_v_blocks_archive" CASCADE;
  DROP TABLE "_pages_v_blocks_code" CASCADE;
  DROP TABLE "_pages_v_blocks_form_block" CASCADE;
  DROP TABLE "_pages_v_blocks_quote" CASCADE;
  DROP TABLE "_pages_v_blocks_quote_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_faq_items" CASCADE;
  DROP TABLE "_pages_v_blocks_faq_items_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_faq" CASCADE;
  DROP TABLE "_pages_v_blocks_faq_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_stats_items" CASCADE;
  DROP TABLE "_pages_v_blocks_stats_items_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_stats" CASCADE;
  DROP TABLE "_pages_v_blocks_stats_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_video" CASCADE;
  DROP TABLE "_pages_v_blocks_video_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_spacer" CASCADE;
  DROP TABLE "_pages_v" CASCADE;
  DROP TABLE "_pages_v_locales" CASCADE;
  DROP TABLE "_pages_v_rels" CASCADE;
  DROP TABLE "categories_blocks_banner" CASCADE;
  DROP TABLE "categories_blocks_cta_links" CASCADE;
  DROP TABLE "categories_blocks_cta_links_locales" CASCADE;
  DROP TABLE "categories_blocks_cta" CASCADE;
  DROP TABLE "categories_blocks_content_columns" CASCADE;
  DROP TABLE "categories_blocks_content_columns_locales" CASCADE;
  DROP TABLE "categories_blocks_content" CASCADE;
  DROP TABLE "categories_blocks_media_block" CASCADE;
  DROP TABLE "categories_blocks_carousel" CASCADE;
  DROP TABLE "categories_blocks_three_item_grid" CASCADE;
  DROP TABLE "categories_blocks_archive" CASCADE;
  DROP TABLE "categories_blocks_code" CASCADE;
  DROP TABLE "categories_blocks_form_block" CASCADE;
  DROP TABLE "categories_blocks_quote" CASCADE;
  DROP TABLE "categories_blocks_quote_locales" CASCADE;
  DROP TABLE "categories_blocks_faq_items" CASCADE;
  DROP TABLE "categories_blocks_faq_items_locales" CASCADE;
  DROP TABLE "categories_blocks_faq" CASCADE;
  DROP TABLE "categories_blocks_faq_locales" CASCADE;
  DROP TABLE "categories_blocks_stats_items" CASCADE;
  DROP TABLE "categories_blocks_stats_items_locales" CASCADE;
  DROP TABLE "categories_blocks_stats" CASCADE;
  DROP TABLE "categories_blocks_stats_locales" CASCADE;
  DROP TABLE "categories_blocks_video" CASCADE;
  DROP TABLE "categories_blocks_video_locales" CASCADE;
  DROP TABLE "categories_blocks_spacer" CASCADE;
  DROP TABLE "categories" CASCADE;
  DROP TABLE "categories_locales" CASCADE;
  DROP TABLE "categories_rels" CASCADE;
  DROP TABLE "brands_blocks_banner" CASCADE;
  DROP TABLE "brands_blocks_cta_links" CASCADE;
  DROP TABLE "brands_blocks_cta_links_locales" CASCADE;
  DROP TABLE "brands_blocks_cta" CASCADE;
  DROP TABLE "brands_blocks_content_columns" CASCADE;
  DROP TABLE "brands_blocks_content_columns_locales" CASCADE;
  DROP TABLE "brands_blocks_content" CASCADE;
  DROP TABLE "brands_blocks_media_block" CASCADE;
  DROP TABLE "brands_blocks_carousel" CASCADE;
  DROP TABLE "brands_blocks_three_item_grid" CASCADE;
  DROP TABLE "brands_blocks_archive" CASCADE;
  DROP TABLE "brands_blocks_code" CASCADE;
  DROP TABLE "brands_blocks_form_block" CASCADE;
  DROP TABLE "brands_blocks_quote" CASCADE;
  DROP TABLE "brands_blocks_quote_locales" CASCADE;
  DROP TABLE "brands_blocks_faq_items" CASCADE;
  DROP TABLE "brands_blocks_faq_items_locales" CASCADE;
  DROP TABLE "brands_blocks_faq" CASCADE;
  DROP TABLE "brands_blocks_faq_locales" CASCADE;
  DROP TABLE "brands_blocks_stats_items" CASCADE;
  DROP TABLE "brands_blocks_stats_items_locales" CASCADE;
  DROP TABLE "brands_blocks_stats" CASCADE;
  DROP TABLE "brands_blocks_stats_locales" CASCADE;
  DROP TABLE "brands_blocks_video" CASCADE;
  DROP TABLE "brands_blocks_video_locales" CASCADE;
  DROP TABLE "brands_blocks_spacer" CASCADE;
  DROP TABLE "brands" CASCADE;
  DROP TABLE "brands_locales" CASCADE;
  DROP TABLE "brands_rels" CASCADE;
  DROP TABLE "tags" CASCADE;
  DROP TABLE "tags_locales" CASCADE;
  DROP TABLE "coupons" CASCADE;
  DROP TABLE "coupons_rels" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "media_locales" CASCADE;
  DROP TABLE "forms_blocks_checkbox" CASCADE;
  DROP TABLE "forms_blocks_checkbox_locales" CASCADE;
  DROP TABLE "forms_blocks_country" CASCADE;
  DROP TABLE "forms_blocks_country_locales" CASCADE;
  DROP TABLE "forms_blocks_email" CASCADE;
  DROP TABLE "forms_blocks_email_locales" CASCADE;
  DROP TABLE "forms_blocks_message" CASCADE;
  DROP TABLE "forms_blocks_message_locales" CASCADE;
  DROP TABLE "forms_blocks_number" CASCADE;
  DROP TABLE "forms_blocks_number_locales" CASCADE;
  DROP TABLE "forms_blocks_select_options" CASCADE;
  DROP TABLE "forms_blocks_select_options_locales" CASCADE;
  DROP TABLE "forms_blocks_select" CASCADE;
  DROP TABLE "forms_blocks_select_locales" CASCADE;
  DROP TABLE "forms_blocks_state" CASCADE;
  DROP TABLE "forms_blocks_state_locales" CASCADE;
  DROP TABLE "forms_blocks_text" CASCADE;
  DROP TABLE "forms_blocks_text_locales" CASCADE;
  DROP TABLE "forms_blocks_textarea" CASCADE;
  DROP TABLE "forms_blocks_textarea_locales" CASCADE;
  DROP TABLE "forms_emails" CASCADE;
  DROP TABLE "forms_emails_locales" CASCADE;
  DROP TABLE "forms" CASCADE;
  DROP TABLE "forms_locales" CASCADE;
  DROP TABLE "form_submissions_submission_data" CASCADE;
  DROP TABLE "form_submissions" CASCADE;
  DROP TABLE "addresses" CASCADE;
  DROP TABLE "variants" CASCADE;
  DROP TABLE "variants_rels" CASCADE;
  DROP TABLE "_variants_v" CASCADE;
  DROP TABLE "_variants_v_rels" CASCADE;
  DROP TABLE "variant_types" CASCADE;
  DROP TABLE "variant_options" CASCADE;
  DROP TABLE "products_gallery" CASCADE;
  DROP TABLE "products_blocks_banner" CASCADE;
  DROP TABLE "products_blocks_cta_links" CASCADE;
  DROP TABLE "products_blocks_cta_links_locales" CASCADE;
  DROP TABLE "products_blocks_cta" CASCADE;
  DROP TABLE "products_blocks_content_columns" CASCADE;
  DROP TABLE "products_blocks_content_columns_locales" CASCADE;
  DROP TABLE "products_blocks_content" CASCADE;
  DROP TABLE "products_blocks_media_block" CASCADE;
  DROP TABLE "products_blocks_carousel" CASCADE;
  DROP TABLE "products_blocks_three_item_grid" CASCADE;
  DROP TABLE "products_blocks_archive" CASCADE;
  DROP TABLE "products_blocks_code" CASCADE;
  DROP TABLE "products_blocks_form_block" CASCADE;
  DROP TABLE "products_blocks_quote" CASCADE;
  DROP TABLE "products_blocks_quote_locales" CASCADE;
  DROP TABLE "products_blocks_faq_items" CASCADE;
  DROP TABLE "products_blocks_faq_items_locales" CASCADE;
  DROP TABLE "products_blocks_faq" CASCADE;
  DROP TABLE "products_blocks_faq_locales" CASCADE;
  DROP TABLE "products_blocks_stats_items" CASCADE;
  DROP TABLE "products_blocks_stats_items_locales" CASCADE;
  DROP TABLE "products_blocks_stats" CASCADE;
  DROP TABLE "products_blocks_stats_locales" CASCADE;
  DROP TABLE "products_blocks_video" CASCADE;
  DROP TABLE "products_blocks_video_locales" CASCADE;
  DROP TABLE "products_blocks_spacer" CASCADE;
  DROP TABLE "products_badges" CASCADE;
  DROP TABLE "products_badges_locales" CASCADE;
  DROP TABLE "products_highlights" CASCADE;
  DROP TABLE "products_highlights_locales" CASCADE;
  DROP TABLE "products_specifications" CASCADE;
  DROP TABLE "products_specifications_locales" CASCADE;
  DROP TABLE "products" CASCADE;
  DROP TABLE "products_locales" CASCADE;
  DROP TABLE "products_rels" CASCADE;
  DROP TABLE "_products_v_version_gallery" CASCADE;
  DROP TABLE "_products_v_blocks_banner" CASCADE;
  DROP TABLE "_products_v_blocks_cta_links" CASCADE;
  DROP TABLE "_products_v_blocks_cta_links_locales" CASCADE;
  DROP TABLE "_products_v_blocks_cta" CASCADE;
  DROP TABLE "_products_v_blocks_content_columns" CASCADE;
  DROP TABLE "_products_v_blocks_content_columns_locales" CASCADE;
  DROP TABLE "_products_v_blocks_content" CASCADE;
  DROP TABLE "_products_v_blocks_media_block" CASCADE;
  DROP TABLE "_products_v_blocks_carousel" CASCADE;
  DROP TABLE "_products_v_blocks_three_item_grid" CASCADE;
  DROP TABLE "_products_v_blocks_archive" CASCADE;
  DROP TABLE "_products_v_blocks_code" CASCADE;
  DROP TABLE "_products_v_blocks_form_block" CASCADE;
  DROP TABLE "_products_v_blocks_quote" CASCADE;
  DROP TABLE "_products_v_blocks_quote_locales" CASCADE;
  DROP TABLE "_products_v_blocks_faq_items" CASCADE;
  DROP TABLE "_products_v_blocks_faq_items_locales" CASCADE;
  DROP TABLE "_products_v_blocks_faq" CASCADE;
  DROP TABLE "_products_v_blocks_faq_locales" CASCADE;
  DROP TABLE "_products_v_blocks_stats_items" CASCADE;
  DROP TABLE "_products_v_blocks_stats_items_locales" CASCADE;
  DROP TABLE "_products_v_blocks_stats" CASCADE;
  DROP TABLE "_products_v_blocks_stats_locales" CASCADE;
  DROP TABLE "_products_v_blocks_video" CASCADE;
  DROP TABLE "_products_v_blocks_video_locales" CASCADE;
  DROP TABLE "_products_v_blocks_spacer" CASCADE;
  DROP TABLE "_products_v_version_badges" CASCADE;
  DROP TABLE "_products_v_version_badges_locales" CASCADE;
  DROP TABLE "_products_v_version_highlights" CASCADE;
  DROP TABLE "_products_v_version_highlights_locales" CASCADE;
  DROP TABLE "_products_v_version_specifications" CASCADE;
  DROP TABLE "_products_v_version_specifications_locales" CASCADE;
  DROP TABLE "_products_v" CASCADE;
  DROP TABLE "_products_v_locales" CASCADE;
  DROP TABLE "_products_v_rels" CASCADE;
  DROP TABLE "carts_items" CASCADE;
  DROP TABLE "carts" CASCADE;
  DROP TABLE "orders_items" CASCADE;
  DROP TABLE "orders" CASCADE;
  DROP TABLE "orders_rels" CASCADE;
  DROP TABLE "transactions_items" CASCADE;
  DROP TABLE "transactions" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "header_nav_items_sub_items" CASCADE;
  DROP TABLE "header_nav_items_sub_items_locales" CASCADE;
  DROP TABLE "header_nav_items" CASCADE;
  DROP TABLE "header_nav_items_locales" CASCADE;
  DROP TABLE "header" CASCADE;
  DROP TABLE "header_locales" CASCADE;
  DROP TABLE "header_rels" CASCADE;
  DROP TABLE "footer_nav_items" CASCADE;
  DROP TABLE "footer_nav_items_locales" CASCADE;
  DROP TABLE "footer_blocks_footer_brand" CASCADE;
  DROP TABLE "footer_blocks_footer_brand_locales" CASCADE;
  DROP TABLE "footer_blocks_footer_column_links" CASCADE;
  DROP TABLE "footer_blocks_footer_column_links_locales" CASCADE;
  DROP TABLE "footer_blocks_footer_column" CASCADE;
  DROP TABLE "footer_blocks_footer_column_locales" CASCADE;
  DROP TABLE "footer_blocks_footer_text" CASCADE;
  DROP TABLE "footer_blocks_footer_text_locales" CASCADE;
  DROP TABLE "footer_blocks_footer_contact" CASCADE;
  DROP TABLE "footer_blocks_footer_contact_locales" CASCADE;
  DROP TABLE "footer_blocks_footer_social_profiles" CASCADE;
  DROP TABLE "footer_blocks_footer_social" CASCADE;
  DROP TABLE "footer_blocks_footer_social_locales" CASCADE;
  DROP TABLE "footer_blocks_footer_newsletter" CASCADE;
  DROP TABLE "footer_blocks_footer_newsletter_locales" CASCADE;
  DROP TABLE "footer_bottom_bar_legal_links" CASCADE;
  DROP TABLE "footer_bottom_bar_legal_links_locales" CASCADE;
  DROP TABLE "footer" CASCADE;
  DROP TABLE "footer_locales" CASCADE;
  DROP TABLE "footer_rels" CASCADE;
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum_users_roles";
  DROP TYPE "public"."enum_pages_hero_links_link_type";
  DROP TYPE "public"."enum_pages_hero_links_link_appearance";
  DROP TYPE "public"."enum_pages_blocks_banner_style";
  DROP TYPE "public"."enum_pages_blocks_cta_links_link_type";
  DROP TYPE "public"."enum_pages_blocks_cta_links_link_appearance";
  DROP TYPE "public"."enum_pages_blocks_content_columns_size";
  DROP TYPE "public"."enum_pages_blocks_content_columns_link_type";
  DROP TYPE "public"."enum_pages_blocks_content_columns_link_appearance";
  DROP TYPE "public"."enum_pages_blocks_carousel_populate_by";
  DROP TYPE "public"."enum_pages_blocks_carousel_relation_to";
  DROP TYPE "public"."enum_pages_blocks_archive_populate_by";
  DROP TYPE "public"."enum_pages_blocks_archive_relation_to";
  DROP TYPE "public"."enum_pages_blocks_code_language";
  DROP TYPE "public"."enum_pages_blocks_quote_rating";
  DROP TYPE "public"."enum_pages_blocks_video_platform";
  DROP TYPE "public"."enum_pages_blocks_spacer_size";
  DROP TYPE "public"."enum_pages_hero_type";
  DROP TYPE "public"."enum_pages_status";
  DROP TYPE "public"."enum__pages_v_version_hero_links_link_type";
  DROP TYPE "public"."enum__pages_v_version_hero_links_link_appearance";
  DROP TYPE "public"."enum__pages_v_blocks_banner_style";
  DROP TYPE "public"."enum__pages_v_blocks_cta_links_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_cta_links_link_appearance";
  DROP TYPE "public"."enum__pages_v_blocks_content_columns_size";
  DROP TYPE "public"."enum__pages_v_blocks_content_columns_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_content_columns_link_appearance";
  DROP TYPE "public"."enum__pages_v_blocks_carousel_populate_by";
  DROP TYPE "public"."enum__pages_v_blocks_carousel_relation_to";
  DROP TYPE "public"."enum__pages_v_blocks_archive_populate_by";
  DROP TYPE "public"."enum__pages_v_blocks_archive_relation_to";
  DROP TYPE "public"."enum__pages_v_blocks_code_language";
  DROP TYPE "public"."enum__pages_v_blocks_quote_rating";
  DROP TYPE "public"."enum__pages_v_blocks_video_platform";
  DROP TYPE "public"."enum__pages_v_blocks_spacer_size";
  DROP TYPE "public"."enum__pages_v_version_hero_type";
  DROP TYPE "public"."enum__pages_v_version_status";
  DROP TYPE "public"."enum__pages_v_published_locale";
  DROP TYPE "public"."enum_categories_blocks_banner_style";
  DROP TYPE "public"."enum_categories_blocks_cta_links_link_type";
  DROP TYPE "public"."enum_categories_blocks_cta_links_link_appearance";
  DROP TYPE "public"."enum_categories_blocks_content_columns_size";
  DROP TYPE "public"."enum_categories_blocks_content_columns_link_type";
  DROP TYPE "public"."enum_categories_blocks_content_columns_link_appearance";
  DROP TYPE "public"."enum_categories_blocks_carousel_populate_by";
  DROP TYPE "public"."enum_categories_blocks_carousel_relation_to";
  DROP TYPE "public"."enum_categories_blocks_archive_populate_by";
  DROP TYPE "public"."enum_categories_blocks_archive_relation_to";
  DROP TYPE "public"."enum_categories_blocks_code_language";
  DROP TYPE "public"."enum_categories_blocks_quote_rating";
  DROP TYPE "public"."enum_categories_blocks_video_platform";
  DROP TYPE "public"."enum_categories_blocks_spacer_size";
  DROP TYPE "public"."enum_brands_blocks_banner_style";
  DROP TYPE "public"."enum_brands_blocks_cta_links_link_type";
  DROP TYPE "public"."enum_brands_blocks_cta_links_link_appearance";
  DROP TYPE "public"."enum_brands_blocks_content_columns_size";
  DROP TYPE "public"."enum_brands_blocks_content_columns_link_type";
  DROP TYPE "public"."enum_brands_blocks_content_columns_link_appearance";
  DROP TYPE "public"."enum_brands_blocks_carousel_populate_by";
  DROP TYPE "public"."enum_brands_blocks_carousel_relation_to";
  DROP TYPE "public"."enum_brands_blocks_archive_populate_by";
  DROP TYPE "public"."enum_brands_blocks_archive_relation_to";
  DROP TYPE "public"."enum_brands_blocks_code_language";
  DROP TYPE "public"."enum_brands_blocks_quote_rating";
  DROP TYPE "public"."enum_brands_blocks_video_platform";
  DROP TYPE "public"."enum_brands_blocks_spacer_size";
  DROP TYPE "public"."enum_coupons_type";
  DROP TYPE "public"."enum_forms_confirmation_type";
  DROP TYPE "public"."enum_addresses_country";
  DROP TYPE "public"."enum_variants_status";
  DROP TYPE "public"."enum__variants_v_version_status";
  DROP TYPE "public"."enum__variants_v_published_locale";
  DROP TYPE "public"."enum_products_blocks_banner_style";
  DROP TYPE "public"."enum_products_blocks_cta_links_link_type";
  DROP TYPE "public"."enum_products_blocks_cta_links_link_appearance";
  DROP TYPE "public"."enum_products_blocks_content_columns_size";
  DROP TYPE "public"."enum_products_blocks_content_columns_link_type";
  DROP TYPE "public"."enum_products_blocks_content_columns_link_appearance";
  DROP TYPE "public"."enum_products_blocks_carousel_populate_by";
  DROP TYPE "public"."enum_products_blocks_carousel_relation_to";
  DROP TYPE "public"."enum_products_blocks_archive_populate_by";
  DROP TYPE "public"."enum_products_blocks_archive_relation_to";
  DROP TYPE "public"."enum_products_blocks_code_language";
  DROP TYPE "public"."enum_products_blocks_quote_rating";
  DROP TYPE "public"."enum_products_blocks_video_platform";
  DROP TYPE "public"."enum_products_blocks_spacer_size";
  DROP TYPE "public"."enum_products_visibility";
  DROP TYPE "public"."enum_products_status";
  DROP TYPE "public"."enum__products_v_blocks_banner_style";
  DROP TYPE "public"."enum__products_v_blocks_cta_links_link_type";
  DROP TYPE "public"."enum__products_v_blocks_cta_links_link_appearance";
  DROP TYPE "public"."enum__products_v_blocks_content_columns_size";
  DROP TYPE "public"."enum__products_v_blocks_content_columns_link_type";
  DROP TYPE "public"."enum__products_v_blocks_content_columns_link_appearance";
  DROP TYPE "public"."enum__products_v_blocks_carousel_populate_by";
  DROP TYPE "public"."enum__products_v_blocks_carousel_relation_to";
  DROP TYPE "public"."enum__products_v_blocks_archive_populate_by";
  DROP TYPE "public"."enum__products_v_blocks_archive_relation_to";
  DROP TYPE "public"."enum__products_v_blocks_code_language";
  DROP TYPE "public"."enum__products_v_blocks_quote_rating";
  DROP TYPE "public"."enum__products_v_blocks_video_platform";
  DROP TYPE "public"."enum__products_v_blocks_spacer_size";
  DROP TYPE "public"."enum__products_v_version_visibility";
  DROP TYPE "public"."enum__products_v_version_status";
  DROP TYPE "public"."enum__products_v_published_locale";
  DROP TYPE "public"."enum_carts_currency";
  DROP TYPE "public"."enum_orders_status";
  DROP TYPE "public"."enum_orders_currency";
  DROP TYPE "public"."enum_transactions_payment_method";
  DROP TYPE "public"."enum_transactions_status";
  DROP TYPE "public"."enum_transactions_currency";
  DROP TYPE "public"."enum_header_nav_items_sub_items_link_type";
  DROP TYPE "public"."enum_header_nav_items_link_type";
  DROP TYPE "public"."enum_header_promo_banner_link_type";
  DROP TYPE "public"."enum_footer_nav_items_link_type";
  DROP TYPE "public"."enum_footer_blocks_footer_column_links_link_type";
  DROP TYPE "public"."enum_footer_blocks_footer_social_profiles_platform";
  DROP TYPE "public"."enum_footer_bottom_bar_legal_links_link_type";`)
}
