import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_posts_blocks_banner_style" AS ENUM('info', 'warning', 'error', 'success');
  CREATE TYPE "public"."enum_posts_blocks_cta_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_posts_blocks_cta_links_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum_posts_blocks_content_columns_size" AS ENUM('oneThird', 'half', 'twoThirds', 'full');
  CREATE TYPE "public"."enum_posts_blocks_content_columns_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_posts_blocks_content_columns_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum_posts_blocks_carousel_populate_by" AS ENUM('collection', 'selection');
  CREATE TYPE "public"."enum_posts_blocks_carousel_relation_to" AS ENUM('products');
  CREATE TYPE "public"."enum_posts_blocks_archive_populate_by" AS ENUM('collection', 'selection');
  CREATE TYPE "public"."enum_posts_blocks_archive_relation_to" AS ENUM('products');
  CREATE TYPE "public"."enum_posts_blocks_code_language" AS ENUM('typescript', 'javascript', 'css');
  CREATE TYPE "public"."enum_posts_blocks_quote_rating" AS ENUM('5', '4', '3');
  CREATE TYPE "public"."enum_posts_blocks_video_platform" AS ENUM('youtube', 'vimeo', 'direct');
  CREATE TYPE "public"."enum_posts_blocks_spacer_size" AS ENUM('xs', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum_posts_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__posts_v_blocks_banner_style" AS ENUM('info', 'warning', 'error', 'success');
  CREATE TYPE "public"."enum__posts_v_blocks_cta_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__posts_v_blocks_cta_links_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum__posts_v_blocks_content_columns_size" AS ENUM('oneThird', 'half', 'twoThirds', 'full');
  CREATE TYPE "public"."enum__posts_v_blocks_content_columns_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__posts_v_blocks_content_columns_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum__posts_v_blocks_carousel_populate_by" AS ENUM('collection', 'selection');
  CREATE TYPE "public"."enum__posts_v_blocks_carousel_relation_to" AS ENUM('products');
  CREATE TYPE "public"."enum__posts_v_blocks_archive_populate_by" AS ENUM('collection', 'selection');
  CREATE TYPE "public"."enum__posts_v_blocks_archive_relation_to" AS ENUM('products');
  CREATE TYPE "public"."enum__posts_v_blocks_code_language" AS ENUM('typescript', 'javascript', 'css');
  CREATE TYPE "public"."enum__posts_v_blocks_quote_rating" AS ENUM('5', '4', '3');
  CREATE TYPE "public"."enum__posts_v_blocks_video_platform" AS ENUM('youtube', 'vimeo', 'direct');
  CREATE TYPE "public"."enum__posts_v_blocks_spacer_size" AS ENUM('xs', 'sm', 'md', 'lg', 'xl');
  CREATE TYPE "public"."enum__posts_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__posts_v_published_locale" AS ENUM('sr', 'en');
  CREATE TYPE "public"."enum_post_categories_blocks_banner_style" AS ENUM('info', 'warning', 'error', 'success');
  CREATE TYPE "public"."enum_post_categories_blocks_cta_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_post_categories_blocks_cta_links_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum_post_categories_blocks_content_columns_size" AS ENUM('oneThird', 'half', 'twoThirds', 'full');
  CREATE TYPE "public"."enum_post_categories_blocks_content_columns_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_post_categories_blocks_content_columns_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum_post_categories_blocks_carousel_populate_by" AS ENUM('collection', 'selection');
  CREATE TYPE "public"."enum_post_categories_blocks_carousel_relation_to" AS ENUM('products');
  CREATE TYPE "public"."enum_post_categories_blocks_archive_populate_by" AS ENUM('collection', 'selection');
  CREATE TYPE "public"."enum_post_categories_blocks_archive_relation_to" AS ENUM('products');
  CREATE TYPE "public"."enum_post_categories_blocks_code_language" AS ENUM('typescript', 'javascript', 'css');
  CREATE TYPE "public"."enum_post_categories_blocks_quote_rating" AS ENUM('5', '4', '3');
  CREATE TYPE "public"."enum_post_categories_blocks_video_platform" AS ENUM('youtube', 'vimeo', 'direct');
  CREATE TYPE "public"."enum_post_categories_blocks_spacer_size" AS ENUM('xs', 'sm', 'md', 'lg', 'xl');
  CREATE TABLE "posts_blocks_banner" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"style" "enum_posts_blocks_banner_style" DEFAULT 'info',
  	"content" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "posts_blocks_cta_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_posts_blocks_cta_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_appearance" "enum_posts_blocks_cta_links_link_appearance" DEFAULT 'default'
  );
  
  CREATE TABLE "posts_blocks_cta_links_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "posts_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"rich_text" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "posts_blocks_content_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"size" "enum_posts_blocks_content_columns_size" DEFAULT 'oneThird',
  	"rich_text" jsonb,
  	"enable_link" boolean,
  	"link_type" "enum_posts_blocks_content_columns_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_appearance" "enum_posts_blocks_content_columns_link_appearance" DEFAULT 'default'
  );
  
  CREATE TABLE "posts_blocks_content_columns_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "posts_blocks_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "posts_blocks_media_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "posts_blocks_carousel" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"populate_by" "enum_posts_blocks_carousel_populate_by" DEFAULT 'collection',
  	"relation_to" "enum_posts_blocks_carousel_relation_to" DEFAULT 'products',
  	"limit" numeric DEFAULT 10,
  	"populated_docs_total" numeric,
  	"block_name" varchar
  );
  
  CREATE TABLE "posts_blocks_three_item_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "posts_blocks_archive" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"intro_content" jsonb,
  	"populate_by" "enum_posts_blocks_archive_populate_by" DEFAULT 'collection',
  	"relation_to" "enum_posts_blocks_archive_relation_to" DEFAULT 'products',
  	"limit" numeric DEFAULT 10,
  	"block_name" varchar
  );
  
  CREATE TABLE "posts_blocks_code" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"language" "enum_posts_blocks_code_language" DEFAULT 'typescript',
  	"code" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "posts_blocks_form_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"form_id" integer,
  	"enable_intro" boolean,
  	"intro_content" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "posts_blocks_quote" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"avatar_id" integer,
  	"rating" "enum_posts_blocks_quote_rating",
  	"block_name" varchar
  );
  
  CREATE TABLE "posts_blocks_quote_locales" (
  	"text" varchar,
  	"author" varchar,
  	"role" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "posts_blocks_faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "posts_blocks_faq_items_locales" (
  	"question" varchar,
  	"answer" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "posts_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "posts_blocks_faq_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "posts_blocks_stats_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "posts_blocks_stats_items_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "posts_blocks_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "posts_blocks_stats_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "posts_blocks_video" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_posts_blocks_video_platform" DEFAULT 'youtube',
  	"autoplay" boolean DEFAULT false,
  	"url" varchar,
  	"thumbnail_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "posts_blocks_video_locales" (
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "posts_blocks_spacer" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"size" "enum_posts_blocks_spacer_size" DEFAULT 'md',
  	"show_divider" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "posts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"published_on" timestamp(3) with time zone,
  	"featured_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_posts_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "posts_locales" (
  	"title" varchar,
  	"excerpt" varchar,
  	"content" jsonb,
  	"meta_title" varchar,
  	"meta_image_id" integer,
  	"meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "posts_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"products_id" integer,
  	"categories_id" integer,
  	"brands_id" integer,
  	"posts_id" integer,
  	"post_categories_id" integer
  );
  
  CREATE TABLE "_posts_v_blocks_banner" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"style" "enum__posts_v_blocks_banner_style" DEFAULT 'info',
  	"content" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_posts_v_blocks_cta_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum__posts_v_blocks_cta_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_appearance" "enum__posts_v_blocks_cta_links_link_appearance" DEFAULT 'default',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_posts_v_blocks_cta_links_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_posts_v_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"rich_text" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_posts_v_blocks_content_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"size" "enum__posts_v_blocks_content_columns_size" DEFAULT 'oneThird',
  	"rich_text" jsonb,
  	"enable_link" boolean,
  	"link_type" "enum__posts_v_blocks_content_columns_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_appearance" "enum__posts_v_blocks_content_columns_link_appearance" DEFAULT 'default',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_posts_v_blocks_content_columns_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_posts_v_blocks_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_posts_v_blocks_media_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_posts_v_blocks_carousel" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"populate_by" "enum__posts_v_blocks_carousel_populate_by" DEFAULT 'collection',
  	"relation_to" "enum__posts_v_blocks_carousel_relation_to" DEFAULT 'products',
  	"limit" numeric DEFAULT 10,
  	"populated_docs_total" numeric,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_posts_v_blocks_three_item_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_posts_v_blocks_archive" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"intro_content" jsonb,
  	"populate_by" "enum__posts_v_blocks_archive_populate_by" DEFAULT 'collection',
  	"relation_to" "enum__posts_v_blocks_archive_relation_to" DEFAULT 'products',
  	"limit" numeric DEFAULT 10,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_posts_v_blocks_code" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"language" "enum__posts_v_blocks_code_language" DEFAULT 'typescript',
  	"code" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_posts_v_blocks_form_block" (
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
  
  CREATE TABLE "_posts_v_blocks_quote" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"avatar_id" integer,
  	"rating" "enum__posts_v_blocks_quote_rating",
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_posts_v_blocks_quote_locales" (
  	"text" varchar,
  	"author" varchar,
  	"role" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_posts_v_blocks_faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_posts_v_blocks_faq_items_locales" (
  	"question" varchar,
  	"answer" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_posts_v_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_posts_v_blocks_faq_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_posts_v_blocks_stats_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_posts_v_blocks_stats_items_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_posts_v_blocks_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_posts_v_blocks_stats_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_posts_v_blocks_video" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"platform" "enum__posts_v_blocks_video_platform" DEFAULT 'youtube',
  	"autoplay" boolean DEFAULT false,
  	"url" varchar,
  	"thumbnail_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_posts_v_blocks_video_locales" (
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_posts_v_blocks_spacer" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"size" "enum__posts_v_blocks_spacer_size" DEFAULT 'md',
  	"show_divider" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_posts_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_published_on" timestamp(3) with time zone,
  	"version_featured_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__posts_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__posts_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_posts_v_locales" (
  	"version_title" varchar,
  	"version_excerpt" varchar,
  	"version_content" jsonb,
  	"version_meta_title" varchar,
  	"version_meta_image_id" integer,
  	"version_meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_posts_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"products_id" integer,
  	"categories_id" integer,
  	"brands_id" integer,
  	"posts_id" integer,
  	"post_categories_id" integer
  );
  
  CREATE TABLE "post_categories_blocks_banner" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"style" "enum_post_categories_blocks_banner_style" DEFAULT 'info' NOT NULL,
  	"content" jsonb NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "post_categories_blocks_cta_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_post_categories_blocks_cta_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_appearance" "enum_post_categories_blocks_cta_links_link_appearance" DEFAULT 'default'
  );
  
  CREATE TABLE "post_categories_blocks_cta_links_locales" (
  	"link_label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "post_categories_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"rich_text" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "post_categories_blocks_content_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"size" "enum_post_categories_blocks_content_columns_size" DEFAULT 'oneThird',
  	"rich_text" jsonb,
  	"enable_link" boolean,
  	"link_type" "enum_post_categories_blocks_content_columns_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_appearance" "enum_post_categories_blocks_content_columns_link_appearance" DEFAULT 'default'
  );
  
  CREATE TABLE "post_categories_blocks_content_columns_locales" (
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "post_categories_blocks_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "post_categories_blocks_media_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" integer NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "post_categories_blocks_carousel" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"populate_by" "enum_post_categories_blocks_carousel_populate_by" DEFAULT 'collection',
  	"relation_to" "enum_post_categories_blocks_carousel_relation_to" DEFAULT 'products',
  	"limit" numeric DEFAULT 10,
  	"populated_docs_total" numeric,
  	"block_name" varchar
  );
  
  CREATE TABLE "post_categories_blocks_three_item_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "post_categories_blocks_archive" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"intro_content" jsonb,
  	"populate_by" "enum_post_categories_blocks_archive_populate_by" DEFAULT 'collection',
  	"relation_to" "enum_post_categories_blocks_archive_relation_to" DEFAULT 'products',
  	"limit" numeric DEFAULT 10,
  	"block_name" varchar
  );
  
  CREATE TABLE "post_categories_blocks_code" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"language" "enum_post_categories_blocks_code_language" DEFAULT 'typescript',
  	"code" varchar NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "post_categories_blocks_form_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"form_id" integer NOT NULL,
  	"enable_intro" boolean,
  	"intro_content" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "post_categories_blocks_quote" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"avatar_id" integer,
  	"rating" "enum_post_categories_blocks_quote_rating",
  	"block_name" varchar
  );
  
  CREATE TABLE "post_categories_blocks_quote_locales" (
  	"text" varchar NOT NULL,
  	"author" varchar,
  	"role" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "post_categories_blocks_faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "post_categories_blocks_faq_items_locales" (
  	"question" varchar NOT NULL,
  	"answer" jsonb NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "post_categories_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "post_categories_blocks_faq_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "post_categories_blocks_stats_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "post_categories_blocks_stats_items_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "post_categories_blocks_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "post_categories_blocks_stats_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "post_categories_blocks_video" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_post_categories_blocks_video_platform" DEFAULT 'youtube' NOT NULL,
  	"autoplay" boolean DEFAULT false,
  	"url" varchar NOT NULL,
  	"thumbnail_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "post_categories_blocks_video_locales" (
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "post_categories_blocks_spacer" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"size" "enum_post_categories_blocks_spacer_size" DEFAULT 'md' NOT NULL,
  	"show_divider" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "post_categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar NOT NULL,
  	"image_id" integer,
  	"seo_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "post_categories_locales" (
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "post_categories_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"products_id" integer,
  	"categories_id" integer,
  	"brands_id" integer,
  	"posts_id" integer,
  	"post_categories_id" integer
  );
  
  ALTER TABLE "pages_rels" ADD COLUMN "posts_id" integer;
  ALTER TABLE "pages_rels" ADD COLUMN "post_categories_id" integer;
  ALTER TABLE "_pages_v_rels" ADD COLUMN "posts_id" integer;
  ALTER TABLE "_pages_v_rels" ADD COLUMN "post_categories_id" integer;
  ALTER TABLE "categories_rels" ADD COLUMN "posts_id" integer;
  ALTER TABLE "categories_rels" ADD COLUMN "post_categories_id" integer;
  ALTER TABLE "brands_rels" ADD COLUMN "posts_id" integer;
  ALTER TABLE "brands_rels" ADD COLUMN "post_categories_id" integer;
  ALTER TABLE "products_rels" ADD COLUMN "posts_id" integer;
  ALTER TABLE "products_rels" ADD COLUMN "post_categories_id" integer;
  ALTER TABLE "_products_v_rels" ADD COLUMN "posts_id" integer;
  ALTER TABLE "_products_v_rels" ADD COLUMN "post_categories_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "posts_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "post_categories_id" integer;
  ALTER TABLE "header_rels" ADD COLUMN "posts_id" integer;
  ALTER TABLE "header_rels" ADD COLUMN "post_categories_id" integer;
  ALTER TABLE "footer_rels" ADD COLUMN "posts_id" integer;
  ALTER TABLE "footer_rels" ADD COLUMN "post_categories_id" integer;
  ALTER TABLE "posts_blocks_banner" ADD CONSTRAINT "posts_blocks_banner_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_cta_links" ADD CONSTRAINT "posts_blocks_cta_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_cta_links_locales" ADD CONSTRAINT "posts_blocks_cta_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts_blocks_cta_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_cta" ADD CONSTRAINT "posts_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_content_columns" ADD CONSTRAINT "posts_blocks_content_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts_blocks_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_content_columns_locales" ADD CONSTRAINT "posts_blocks_content_columns_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts_blocks_content_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_content" ADD CONSTRAINT "posts_blocks_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_media_block" ADD CONSTRAINT "posts_blocks_media_block_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_blocks_media_block" ADD CONSTRAINT "posts_blocks_media_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_carousel" ADD CONSTRAINT "posts_blocks_carousel_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_three_item_grid" ADD CONSTRAINT "posts_blocks_three_item_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_archive" ADD CONSTRAINT "posts_blocks_archive_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_code" ADD CONSTRAINT "posts_blocks_code_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_form_block" ADD CONSTRAINT "posts_blocks_form_block_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_blocks_form_block" ADD CONSTRAINT "posts_blocks_form_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_quote" ADD CONSTRAINT "posts_blocks_quote_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_blocks_quote" ADD CONSTRAINT "posts_blocks_quote_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_quote_locales" ADD CONSTRAINT "posts_blocks_quote_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts_blocks_quote"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_faq_items" ADD CONSTRAINT "posts_blocks_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_faq_items_locales" ADD CONSTRAINT "posts_blocks_faq_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts_blocks_faq_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_faq" ADD CONSTRAINT "posts_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_faq_locales" ADD CONSTRAINT "posts_blocks_faq_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_stats_items" ADD CONSTRAINT "posts_blocks_stats_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_stats_items_locales" ADD CONSTRAINT "posts_blocks_stats_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts_blocks_stats_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_stats" ADD CONSTRAINT "posts_blocks_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_stats_locales" ADD CONSTRAINT "posts_blocks_stats_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_video" ADD CONSTRAINT "posts_blocks_video_thumbnail_id_media_id_fk" FOREIGN KEY ("thumbnail_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_blocks_video" ADD CONSTRAINT "posts_blocks_video_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_video_locales" ADD CONSTRAINT "posts_blocks_video_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts_blocks_video"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_blocks_spacer" ADD CONSTRAINT "posts_blocks_spacer_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_featured_image_id_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_locales" ADD CONSTRAINT "posts_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_locales" ADD CONSTRAINT "posts_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_brands_fk" FOREIGN KEY ("brands_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_post_categories_fk" FOREIGN KEY ("post_categories_id") REFERENCES "public"."post_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_banner" ADD CONSTRAINT "_posts_v_blocks_banner_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_cta_links" ADD CONSTRAINT "_posts_v_blocks_cta_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_cta_links_locales" ADD CONSTRAINT "_posts_v_blocks_cta_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v_blocks_cta_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_cta" ADD CONSTRAINT "_posts_v_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_content_columns" ADD CONSTRAINT "_posts_v_blocks_content_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v_blocks_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_content_columns_locales" ADD CONSTRAINT "_posts_v_blocks_content_columns_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v_blocks_content_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_content" ADD CONSTRAINT "_posts_v_blocks_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_media_block" ADD CONSTRAINT "_posts_v_blocks_media_block_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_media_block" ADD CONSTRAINT "_posts_v_blocks_media_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_carousel" ADD CONSTRAINT "_posts_v_blocks_carousel_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_three_item_grid" ADD CONSTRAINT "_posts_v_blocks_three_item_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_archive" ADD CONSTRAINT "_posts_v_blocks_archive_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_code" ADD CONSTRAINT "_posts_v_blocks_code_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_form_block" ADD CONSTRAINT "_posts_v_blocks_form_block_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_form_block" ADD CONSTRAINT "_posts_v_blocks_form_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_quote" ADD CONSTRAINT "_posts_v_blocks_quote_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_quote" ADD CONSTRAINT "_posts_v_blocks_quote_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_quote_locales" ADD CONSTRAINT "_posts_v_blocks_quote_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v_blocks_quote"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_faq_items" ADD CONSTRAINT "_posts_v_blocks_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_faq_items_locales" ADD CONSTRAINT "_posts_v_blocks_faq_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v_blocks_faq_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_faq" ADD CONSTRAINT "_posts_v_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_faq_locales" ADD CONSTRAINT "_posts_v_blocks_faq_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_stats_items" ADD CONSTRAINT "_posts_v_blocks_stats_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_stats_items_locales" ADD CONSTRAINT "_posts_v_blocks_stats_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v_blocks_stats_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_stats" ADD CONSTRAINT "_posts_v_blocks_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_stats_locales" ADD CONSTRAINT "_posts_v_blocks_stats_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_video" ADD CONSTRAINT "_posts_v_blocks_video_thumbnail_id_media_id_fk" FOREIGN KEY ("thumbnail_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_video" ADD CONSTRAINT "_posts_v_blocks_video_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_video_locales" ADD CONSTRAINT "_posts_v_blocks_video_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v_blocks_video"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_blocks_spacer" ADD CONSTRAINT "_posts_v_blocks_spacer_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_parent_id_posts_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_featured_image_id_media_id_fk" FOREIGN KEY ("version_featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_locales" ADD CONSTRAINT "_posts_v_locales_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_locales" ADD CONSTRAINT "_posts_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_brands_fk" FOREIGN KEY ("brands_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_post_categories_fk" FOREIGN KEY ("post_categories_id") REFERENCES "public"."post_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "post_categories_blocks_banner" ADD CONSTRAINT "post_categories_blocks_banner_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."post_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "post_categories_blocks_cta_links" ADD CONSTRAINT "post_categories_blocks_cta_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."post_categories_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "post_categories_blocks_cta_links_locales" ADD CONSTRAINT "post_categories_blocks_cta_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."post_categories_blocks_cta_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "post_categories_blocks_cta" ADD CONSTRAINT "post_categories_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."post_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "post_categories_blocks_content_columns" ADD CONSTRAINT "post_categories_blocks_content_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."post_categories_blocks_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "post_categories_blocks_content_columns_locales" ADD CONSTRAINT "post_categories_blocks_content_columns_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."post_categories_blocks_content_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "post_categories_blocks_content" ADD CONSTRAINT "post_categories_blocks_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."post_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "post_categories_blocks_media_block" ADD CONSTRAINT "post_categories_blocks_media_block_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "post_categories_blocks_media_block" ADD CONSTRAINT "post_categories_blocks_media_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."post_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "post_categories_blocks_carousel" ADD CONSTRAINT "post_categories_blocks_carousel_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."post_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "post_categories_blocks_three_item_grid" ADD CONSTRAINT "post_categories_blocks_three_item_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."post_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "post_categories_blocks_archive" ADD CONSTRAINT "post_categories_blocks_archive_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."post_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "post_categories_blocks_code" ADD CONSTRAINT "post_categories_blocks_code_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."post_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "post_categories_blocks_form_block" ADD CONSTRAINT "post_categories_blocks_form_block_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "post_categories_blocks_form_block" ADD CONSTRAINT "post_categories_blocks_form_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."post_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "post_categories_blocks_quote" ADD CONSTRAINT "post_categories_blocks_quote_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "post_categories_blocks_quote" ADD CONSTRAINT "post_categories_blocks_quote_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."post_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "post_categories_blocks_quote_locales" ADD CONSTRAINT "post_categories_blocks_quote_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."post_categories_blocks_quote"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "post_categories_blocks_faq_items" ADD CONSTRAINT "post_categories_blocks_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."post_categories_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "post_categories_blocks_faq_items_locales" ADD CONSTRAINT "post_categories_blocks_faq_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."post_categories_blocks_faq_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "post_categories_blocks_faq" ADD CONSTRAINT "post_categories_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."post_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "post_categories_blocks_faq_locales" ADD CONSTRAINT "post_categories_blocks_faq_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."post_categories_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "post_categories_blocks_stats_items" ADD CONSTRAINT "post_categories_blocks_stats_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."post_categories_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "post_categories_blocks_stats_items_locales" ADD CONSTRAINT "post_categories_blocks_stats_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."post_categories_blocks_stats_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "post_categories_blocks_stats" ADD CONSTRAINT "post_categories_blocks_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."post_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "post_categories_blocks_stats_locales" ADD CONSTRAINT "post_categories_blocks_stats_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."post_categories_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "post_categories_blocks_video" ADD CONSTRAINT "post_categories_blocks_video_thumbnail_id_media_id_fk" FOREIGN KEY ("thumbnail_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "post_categories_blocks_video" ADD CONSTRAINT "post_categories_blocks_video_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."post_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "post_categories_blocks_video_locales" ADD CONSTRAINT "post_categories_blocks_video_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."post_categories_blocks_video"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "post_categories_blocks_spacer" ADD CONSTRAINT "post_categories_blocks_spacer_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."post_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "post_categories" ADD CONSTRAINT "post_categories_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "post_categories" ADD CONSTRAINT "post_categories_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "post_categories_locales" ADD CONSTRAINT "post_categories_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."post_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "post_categories_rels" ADD CONSTRAINT "post_categories_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."post_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "post_categories_rels" ADD CONSTRAINT "post_categories_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "post_categories_rels" ADD CONSTRAINT "post_categories_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "post_categories_rels" ADD CONSTRAINT "post_categories_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "post_categories_rels" ADD CONSTRAINT "post_categories_rels_brands_fk" FOREIGN KEY ("brands_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "post_categories_rels" ADD CONSTRAINT "post_categories_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "post_categories_rels" ADD CONSTRAINT "post_categories_rels_post_categories_fk" FOREIGN KEY ("post_categories_id") REFERENCES "public"."post_categories"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "posts_blocks_banner_order_idx" ON "posts_blocks_banner" USING btree ("_order");
  CREATE INDEX "posts_blocks_banner_parent_id_idx" ON "posts_blocks_banner" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_banner_path_idx" ON "posts_blocks_banner" USING btree ("_path");
  CREATE INDEX "posts_blocks_cta_links_order_idx" ON "posts_blocks_cta_links" USING btree ("_order");
  CREATE INDEX "posts_blocks_cta_links_parent_id_idx" ON "posts_blocks_cta_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "posts_blocks_cta_links_locales_locale_parent_id_unique" ON "posts_blocks_cta_links_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "posts_blocks_cta_order_idx" ON "posts_blocks_cta" USING btree ("_order");
  CREATE INDEX "posts_blocks_cta_parent_id_idx" ON "posts_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_cta_path_idx" ON "posts_blocks_cta" USING btree ("_path");
  CREATE INDEX "posts_blocks_content_columns_order_idx" ON "posts_blocks_content_columns" USING btree ("_order");
  CREATE INDEX "posts_blocks_content_columns_parent_id_idx" ON "posts_blocks_content_columns" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "posts_blocks_content_columns_locales_locale_parent_id_unique" ON "posts_blocks_content_columns_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "posts_blocks_content_order_idx" ON "posts_blocks_content" USING btree ("_order");
  CREATE INDEX "posts_blocks_content_parent_id_idx" ON "posts_blocks_content" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_content_path_idx" ON "posts_blocks_content" USING btree ("_path");
  CREATE INDEX "posts_blocks_media_block_order_idx" ON "posts_blocks_media_block" USING btree ("_order");
  CREATE INDEX "posts_blocks_media_block_parent_id_idx" ON "posts_blocks_media_block" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_media_block_path_idx" ON "posts_blocks_media_block" USING btree ("_path");
  CREATE INDEX "posts_blocks_media_block_media_idx" ON "posts_blocks_media_block" USING btree ("media_id");
  CREATE INDEX "posts_blocks_carousel_order_idx" ON "posts_blocks_carousel" USING btree ("_order");
  CREATE INDEX "posts_blocks_carousel_parent_id_idx" ON "posts_blocks_carousel" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_carousel_path_idx" ON "posts_blocks_carousel" USING btree ("_path");
  CREATE INDEX "posts_blocks_three_item_grid_order_idx" ON "posts_blocks_three_item_grid" USING btree ("_order");
  CREATE INDEX "posts_blocks_three_item_grid_parent_id_idx" ON "posts_blocks_three_item_grid" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_three_item_grid_path_idx" ON "posts_blocks_three_item_grid" USING btree ("_path");
  CREATE INDEX "posts_blocks_archive_order_idx" ON "posts_blocks_archive" USING btree ("_order");
  CREATE INDEX "posts_blocks_archive_parent_id_idx" ON "posts_blocks_archive" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_archive_path_idx" ON "posts_blocks_archive" USING btree ("_path");
  CREATE INDEX "posts_blocks_code_order_idx" ON "posts_blocks_code" USING btree ("_order");
  CREATE INDEX "posts_blocks_code_parent_id_idx" ON "posts_blocks_code" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_code_path_idx" ON "posts_blocks_code" USING btree ("_path");
  CREATE INDEX "posts_blocks_form_block_order_idx" ON "posts_blocks_form_block" USING btree ("_order");
  CREATE INDEX "posts_blocks_form_block_parent_id_idx" ON "posts_blocks_form_block" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_form_block_path_idx" ON "posts_blocks_form_block" USING btree ("_path");
  CREATE INDEX "posts_blocks_form_block_form_idx" ON "posts_blocks_form_block" USING btree ("form_id");
  CREATE INDEX "posts_blocks_quote_order_idx" ON "posts_blocks_quote" USING btree ("_order");
  CREATE INDEX "posts_blocks_quote_parent_id_idx" ON "posts_blocks_quote" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_quote_path_idx" ON "posts_blocks_quote" USING btree ("_path");
  CREATE INDEX "posts_blocks_quote_avatar_idx" ON "posts_blocks_quote" USING btree ("avatar_id");
  CREATE UNIQUE INDEX "posts_blocks_quote_locales_locale_parent_id_unique" ON "posts_blocks_quote_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "posts_blocks_faq_items_order_idx" ON "posts_blocks_faq_items" USING btree ("_order");
  CREATE INDEX "posts_blocks_faq_items_parent_id_idx" ON "posts_blocks_faq_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "posts_blocks_faq_items_locales_locale_parent_id_unique" ON "posts_blocks_faq_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "posts_blocks_faq_order_idx" ON "posts_blocks_faq" USING btree ("_order");
  CREATE INDEX "posts_blocks_faq_parent_id_idx" ON "posts_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_faq_path_idx" ON "posts_blocks_faq" USING btree ("_path");
  CREATE UNIQUE INDEX "posts_blocks_faq_locales_locale_parent_id_unique" ON "posts_blocks_faq_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "posts_blocks_stats_items_order_idx" ON "posts_blocks_stats_items" USING btree ("_order");
  CREATE INDEX "posts_blocks_stats_items_parent_id_idx" ON "posts_blocks_stats_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "posts_blocks_stats_items_locales_locale_parent_id_unique" ON "posts_blocks_stats_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "posts_blocks_stats_order_idx" ON "posts_blocks_stats" USING btree ("_order");
  CREATE INDEX "posts_blocks_stats_parent_id_idx" ON "posts_blocks_stats" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_stats_path_idx" ON "posts_blocks_stats" USING btree ("_path");
  CREATE UNIQUE INDEX "posts_blocks_stats_locales_locale_parent_id_unique" ON "posts_blocks_stats_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "posts_blocks_video_order_idx" ON "posts_blocks_video" USING btree ("_order");
  CREATE INDEX "posts_blocks_video_parent_id_idx" ON "posts_blocks_video" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_video_path_idx" ON "posts_blocks_video" USING btree ("_path");
  CREATE INDEX "posts_blocks_video_thumbnail_idx" ON "posts_blocks_video" USING btree ("thumbnail_id");
  CREATE UNIQUE INDEX "posts_blocks_video_locales_locale_parent_id_unique" ON "posts_blocks_video_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "posts_blocks_spacer_order_idx" ON "posts_blocks_spacer" USING btree ("_order");
  CREATE INDEX "posts_blocks_spacer_parent_id_idx" ON "posts_blocks_spacer" USING btree ("_parent_id");
  CREATE INDEX "posts_blocks_spacer_path_idx" ON "posts_blocks_spacer" USING btree ("_path");
  CREATE UNIQUE INDEX "posts_slug_idx" ON "posts" USING btree ("slug");
  CREATE INDEX "posts_featured_image_idx" ON "posts" USING btree ("featured_image_id");
  CREATE INDEX "posts_updated_at_idx" ON "posts" USING btree ("updated_at");
  CREATE INDEX "posts_created_at_idx" ON "posts" USING btree ("created_at");
  CREATE INDEX "posts__status_idx" ON "posts" USING btree ("_status");
  CREATE INDEX "posts_meta_meta_image_idx" ON "posts_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "posts_locales_locale_parent_id_unique" ON "posts_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "posts_rels_order_idx" ON "posts_rels" USING btree ("order");
  CREATE INDEX "posts_rels_parent_idx" ON "posts_rels" USING btree ("parent_id");
  CREATE INDEX "posts_rels_path_idx" ON "posts_rels" USING btree ("path");
  CREATE INDEX "posts_rels_pages_id_idx" ON "posts_rels" USING btree ("pages_id");
  CREATE INDEX "posts_rels_products_id_idx" ON "posts_rels" USING btree ("products_id");
  CREATE INDEX "posts_rels_categories_id_idx" ON "posts_rels" USING btree ("categories_id");
  CREATE INDEX "posts_rels_brands_id_idx" ON "posts_rels" USING btree ("brands_id");
  CREATE INDEX "posts_rels_posts_id_idx" ON "posts_rels" USING btree ("posts_id");
  CREATE INDEX "posts_rels_post_categories_id_idx" ON "posts_rels" USING btree ("post_categories_id");
  CREATE INDEX "_posts_v_blocks_banner_order_idx" ON "_posts_v_blocks_banner" USING btree ("_order");
  CREATE INDEX "_posts_v_blocks_banner_parent_id_idx" ON "_posts_v_blocks_banner" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_blocks_banner_path_idx" ON "_posts_v_blocks_banner" USING btree ("_path");
  CREATE INDEX "_posts_v_blocks_cta_links_order_idx" ON "_posts_v_blocks_cta_links" USING btree ("_order");
  CREATE INDEX "_posts_v_blocks_cta_links_parent_id_idx" ON "_posts_v_blocks_cta_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_posts_v_blocks_cta_links_locales_locale_parent_id_unique" ON "_posts_v_blocks_cta_links_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_posts_v_blocks_cta_order_idx" ON "_posts_v_blocks_cta" USING btree ("_order");
  CREATE INDEX "_posts_v_blocks_cta_parent_id_idx" ON "_posts_v_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_blocks_cta_path_idx" ON "_posts_v_blocks_cta" USING btree ("_path");
  CREATE INDEX "_posts_v_blocks_content_columns_order_idx" ON "_posts_v_blocks_content_columns" USING btree ("_order");
  CREATE INDEX "_posts_v_blocks_content_columns_parent_id_idx" ON "_posts_v_blocks_content_columns" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_posts_v_blocks_content_columns_locales_locale_parent_id_uni" ON "_posts_v_blocks_content_columns_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_posts_v_blocks_content_order_idx" ON "_posts_v_blocks_content" USING btree ("_order");
  CREATE INDEX "_posts_v_blocks_content_parent_id_idx" ON "_posts_v_blocks_content" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_blocks_content_path_idx" ON "_posts_v_blocks_content" USING btree ("_path");
  CREATE INDEX "_posts_v_blocks_media_block_order_idx" ON "_posts_v_blocks_media_block" USING btree ("_order");
  CREATE INDEX "_posts_v_blocks_media_block_parent_id_idx" ON "_posts_v_blocks_media_block" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_blocks_media_block_path_idx" ON "_posts_v_blocks_media_block" USING btree ("_path");
  CREATE INDEX "_posts_v_blocks_media_block_media_idx" ON "_posts_v_blocks_media_block" USING btree ("media_id");
  CREATE INDEX "_posts_v_blocks_carousel_order_idx" ON "_posts_v_blocks_carousel" USING btree ("_order");
  CREATE INDEX "_posts_v_blocks_carousel_parent_id_idx" ON "_posts_v_blocks_carousel" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_blocks_carousel_path_idx" ON "_posts_v_blocks_carousel" USING btree ("_path");
  CREATE INDEX "_posts_v_blocks_three_item_grid_order_idx" ON "_posts_v_blocks_three_item_grid" USING btree ("_order");
  CREATE INDEX "_posts_v_blocks_three_item_grid_parent_id_idx" ON "_posts_v_blocks_three_item_grid" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_blocks_three_item_grid_path_idx" ON "_posts_v_blocks_three_item_grid" USING btree ("_path");
  CREATE INDEX "_posts_v_blocks_archive_order_idx" ON "_posts_v_blocks_archive" USING btree ("_order");
  CREATE INDEX "_posts_v_blocks_archive_parent_id_idx" ON "_posts_v_blocks_archive" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_blocks_archive_path_idx" ON "_posts_v_blocks_archive" USING btree ("_path");
  CREATE INDEX "_posts_v_blocks_code_order_idx" ON "_posts_v_blocks_code" USING btree ("_order");
  CREATE INDEX "_posts_v_blocks_code_parent_id_idx" ON "_posts_v_blocks_code" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_blocks_code_path_idx" ON "_posts_v_blocks_code" USING btree ("_path");
  CREATE INDEX "_posts_v_blocks_form_block_order_idx" ON "_posts_v_blocks_form_block" USING btree ("_order");
  CREATE INDEX "_posts_v_blocks_form_block_parent_id_idx" ON "_posts_v_blocks_form_block" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_blocks_form_block_path_idx" ON "_posts_v_blocks_form_block" USING btree ("_path");
  CREATE INDEX "_posts_v_blocks_form_block_form_idx" ON "_posts_v_blocks_form_block" USING btree ("form_id");
  CREATE INDEX "_posts_v_blocks_quote_order_idx" ON "_posts_v_blocks_quote" USING btree ("_order");
  CREATE INDEX "_posts_v_blocks_quote_parent_id_idx" ON "_posts_v_blocks_quote" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_blocks_quote_path_idx" ON "_posts_v_blocks_quote" USING btree ("_path");
  CREATE INDEX "_posts_v_blocks_quote_avatar_idx" ON "_posts_v_blocks_quote" USING btree ("avatar_id");
  CREATE UNIQUE INDEX "_posts_v_blocks_quote_locales_locale_parent_id_unique" ON "_posts_v_blocks_quote_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_posts_v_blocks_faq_items_order_idx" ON "_posts_v_blocks_faq_items" USING btree ("_order");
  CREATE INDEX "_posts_v_blocks_faq_items_parent_id_idx" ON "_posts_v_blocks_faq_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_posts_v_blocks_faq_items_locales_locale_parent_id_unique" ON "_posts_v_blocks_faq_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_posts_v_blocks_faq_order_idx" ON "_posts_v_blocks_faq" USING btree ("_order");
  CREATE INDEX "_posts_v_blocks_faq_parent_id_idx" ON "_posts_v_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_blocks_faq_path_idx" ON "_posts_v_blocks_faq" USING btree ("_path");
  CREATE UNIQUE INDEX "_posts_v_blocks_faq_locales_locale_parent_id_unique" ON "_posts_v_blocks_faq_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_posts_v_blocks_stats_items_order_idx" ON "_posts_v_blocks_stats_items" USING btree ("_order");
  CREATE INDEX "_posts_v_blocks_stats_items_parent_id_idx" ON "_posts_v_blocks_stats_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_posts_v_blocks_stats_items_locales_locale_parent_id_unique" ON "_posts_v_blocks_stats_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_posts_v_blocks_stats_order_idx" ON "_posts_v_blocks_stats" USING btree ("_order");
  CREATE INDEX "_posts_v_blocks_stats_parent_id_idx" ON "_posts_v_blocks_stats" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_blocks_stats_path_idx" ON "_posts_v_blocks_stats" USING btree ("_path");
  CREATE UNIQUE INDEX "_posts_v_blocks_stats_locales_locale_parent_id_unique" ON "_posts_v_blocks_stats_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_posts_v_blocks_video_order_idx" ON "_posts_v_blocks_video" USING btree ("_order");
  CREATE INDEX "_posts_v_blocks_video_parent_id_idx" ON "_posts_v_blocks_video" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_blocks_video_path_idx" ON "_posts_v_blocks_video" USING btree ("_path");
  CREATE INDEX "_posts_v_blocks_video_thumbnail_idx" ON "_posts_v_blocks_video" USING btree ("thumbnail_id");
  CREATE UNIQUE INDEX "_posts_v_blocks_video_locales_locale_parent_id_unique" ON "_posts_v_blocks_video_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_posts_v_blocks_spacer_order_idx" ON "_posts_v_blocks_spacer" USING btree ("_order");
  CREATE INDEX "_posts_v_blocks_spacer_parent_id_idx" ON "_posts_v_blocks_spacer" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_blocks_spacer_path_idx" ON "_posts_v_blocks_spacer" USING btree ("_path");
  CREATE INDEX "_posts_v_parent_idx" ON "_posts_v" USING btree ("parent_id");
  CREATE INDEX "_posts_v_version_version_slug_idx" ON "_posts_v" USING btree ("version_slug");
  CREATE INDEX "_posts_v_version_version_featured_image_idx" ON "_posts_v" USING btree ("version_featured_image_id");
  CREATE INDEX "_posts_v_version_version_updated_at_idx" ON "_posts_v" USING btree ("version_updated_at");
  CREATE INDEX "_posts_v_version_version_created_at_idx" ON "_posts_v" USING btree ("version_created_at");
  CREATE INDEX "_posts_v_version_version__status_idx" ON "_posts_v" USING btree ("version__status");
  CREATE INDEX "_posts_v_created_at_idx" ON "_posts_v" USING btree ("created_at");
  CREATE INDEX "_posts_v_updated_at_idx" ON "_posts_v" USING btree ("updated_at");
  CREATE INDEX "_posts_v_snapshot_idx" ON "_posts_v" USING btree ("snapshot");
  CREATE INDEX "_posts_v_published_locale_idx" ON "_posts_v" USING btree ("published_locale");
  CREATE INDEX "_posts_v_latest_idx" ON "_posts_v" USING btree ("latest");
  CREATE INDEX "_posts_v_autosave_idx" ON "_posts_v" USING btree ("autosave");
  CREATE INDEX "_posts_v_version_meta_version_meta_image_idx" ON "_posts_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE UNIQUE INDEX "_posts_v_locales_locale_parent_id_unique" ON "_posts_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_posts_v_rels_order_idx" ON "_posts_v_rels" USING btree ("order");
  CREATE INDEX "_posts_v_rels_parent_idx" ON "_posts_v_rels" USING btree ("parent_id");
  CREATE INDEX "_posts_v_rels_path_idx" ON "_posts_v_rels" USING btree ("path");
  CREATE INDEX "_posts_v_rels_pages_id_idx" ON "_posts_v_rels" USING btree ("pages_id");
  CREATE INDEX "_posts_v_rels_products_id_idx" ON "_posts_v_rels" USING btree ("products_id");
  CREATE INDEX "_posts_v_rels_categories_id_idx" ON "_posts_v_rels" USING btree ("categories_id");
  CREATE INDEX "_posts_v_rels_brands_id_idx" ON "_posts_v_rels" USING btree ("brands_id");
  CREATE INDEX "_posts_v_rels_posts_id_idx" ON "_posts_v_rels" USING btree ("posts_id");
  CREATE INDEX "_posts_v_rels_post_categories_id_idx" ON "_posts_v_rels" USING btree ("post_categories_id");
  CREATE INDEX "post_categories_blocks_banner_order_idx" ON "post_categories_blocks_banner" USING btree ("_order");
  CREATE INDEX "post_categories_blocks_banner_parent_id_idx" ON "post_categories_blocks_banner" USING btree ("_parent_id");
  CREATE INDEX "post_categories_blocks_banner_path_idx" ON "post_categories_blocks_banner" USING btree ("_path");
  CREATE INDEX "post_categories_blocks_cta_links_order_idx" ON "post_categories_blocks_cta_links" USING btree ("_order");
  CREATE INDEX "post_categories_blocks_cta_links_parent_id_idx" ON "post_categories_blocks_cta_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "post_categories_blocks_cta_links_locales_locale_parent_id_un" ON "post_categories_blocks_cta_links_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "post_categories_blocks_cta_order_idx" ON "post_categories_blocks_cta" USING btree ("_order");
  CREATE INDEX "post_categories_blocks_cta_parent_id_idx" ON "post_categories_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "post_categories_blocks_cta_path_idx" ON "post_categories_blocks_cta" USING btree ("_path");
  CREATE INDEX "post_categories_blocks_content_columns_order_idx" ON "post_categories_blocks_content_columns" USING btree ("_order");
  CREATE INDEX "post_categories_blocks_content_columns_parent_id_idx" ON "post_categories_blocks_content_columns" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "post_categories_blocks_content_columns_locales_locale_parent" ON "post_categories_blocks_content_columns_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "post_categories_blocks_content_order_idx" ON "post_categories_blocks_content" USING btree ("_order");
  CREATE INDEX "post_categories_blocks_content_parent_id_idx" ON "post_categories_blocks_content" USING btree ("_parent_id");
  CREATE INDEX "post_categories_blocks_content_path_idx" ON "post_categories_blocks_content" USING btree ("_path");
  CREATE INDEX "post_categories_blocks_media_block_order_idx" ON "post_categories_blocks_media_block" USING btree ("_order");
  CREATE INDEX "post_categories_blocks_media_block_parent_id_idx" ON "post_categories_blocks_media_block" USING btree ("_parent_id");
  CREATE INDEX "post_categories_blocks_media_block_path_idx" ON "post_categories_blocks_media_block" USING btree ("_path");
  CREATE INDEX "post_categories_blocks_media_block_media_idx" ON "post_categories_blocks_media_block" USING btree ("media_id");
  CREATE INDEX "post_categories_blocks_carousel_order_idx" ON "post_categories_blocks_carousel" USING btree ("_order");
  CREATE INDEX "post_categories_blocks_carousel_parent_id_idx" ON "post_categories_blocks_carousel" USING btree ("_parent_id");
  CREATE INDEX "post_categories_blocks_carousel_path_idx" ON "post_categories_blocks_carousel" USING btree ("_path");
  CREATE INDEX "post_categories_blocks_three_item_grid_order_idx" ON "post_categories_blocks_three_item_grid" USING btree ("_order");
  CREATE INDEX "post_categories_blocks_three_item_grid_parent_id_idx" ON "post_categories_blocks_three_item_grid" USING btree ("_parent_id");
  CREATE INDEX "post_categories_blocks_three_item_grid_path_idx" ON "post_categories_blocks_three_item_grid" USING btree ("_path");
  CREATE INDEX "post_categories_blocks_archive_order_idx" ON "post_categories_blocks_archive" USING btree ("_order");
  CREATE INDEX "post_categories_blocks_archive_parent_id_idx" ON "post_categories_blocks_archive" USING btree ("_parent_id");
  CREATE INDEX "post_categories_blocks_archive_path_idx" ON "post_categories_blocks_archive" USING btree ("_path");
  CREATE INDEX "post_categories_blocks_code_order_idx" ON "post_categories_blocks_code" USING btree ("_order");
  CREATE INDEX "post_categories_blocks_code_parent_id_idx" ON "post_categories_blocks_code" USING btree ("_parent_id");
  CREATE INDEX "post_categories_blocks_code_path_idx" ON "post_categories_blocks_code" USING btree ("_path");
  CREATE INDEX "post_categories_blocks_form_block_order_idx" ON "post_categories_blocks_form_block" USING btree ("_order");
  CREATE INDEX "post_categories_blocks_form_block_parent_id_idx" ON "post_categories_blocks_form_block" USING btree ("_parent_id");
  CREATE INDEX "post_categories_blocks_form_block_path_idx" ON "post_categories_blocks_form_block" USING btree ("_path");
  CREATE INDEX "post_categories_blocks_form_block_form_idx" ON "post_categories_blocks_form_block" USING btree ("form_id");
  CREATE INDEX "post_categories_blocks_quote_order_idx" ON "post_categories_blocks_quote" USING btree ("_order");
  CREATE INDEX "post_categories_blocks_quote_parent_id_idx" ON "post_categories_blocks_quote" USING btree ("_parent_id");
  CREATE INDEX "post_categories_blocks_quote_path_idx" ON "post_categories_blocks_quote" USING btree ("_path");
  CREATE INDEX "post_categories_blocks_quote_avatar_idx" ON "post_categories_blocks_quote" USING btree ("avatar_id");
  CREATE UNIQUE INDEX "post_categories_blocks_quote_locales_locale_parent_id_unique" ON "post_categories_blocks_quote_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "post_categories_blocks_faq_items_order_idx" ON "post_categories_blocks_faq_items" USING btree ("_order");
  CREATE INDEX "post_categories_blocks_faq_items_parent_id_idx" ON "post_categories_blocks_faq_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "post_categories_blocks_faq_items_locales_locale_parent_id_un" ON "post_categories_blocks_faq_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "post_categories_blocks_faq_order_idx" ON "post_categories_blocks_faq" USING btree ("_order");
  CREATE INDEX "post_categories_blocks_faq_parent_id_idx" ON "post_categories_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "post_categories_blocks_faq_path_idx" ON "post_categories_blocks_faq" USING btree ("_path");
  CREATE UNIQUE INDEX "post_categories_blocks_faq_locales_locale_parent_id_unique" ON "post_categories_blocks_faq_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "post_categories_blocks_stats_items_order_idx" ON "post_categories_blocks_stats_items" USING btree ("_order");
  CREATE INDEX "post_categories_blocks_stats_items_parent_id_idx" ON "post_categories_blocks_stats_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "post_categories_blocks_stats_items_locales_locale_parent_id_" ON "post_categories_blocks_stats_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "post_categories_blocks_stats_order_idx" ON "post_categories_blocks_stats" USING btree ("_order");
  CREATE INDEX "post_categories_blocks_stats_parent_id_idx" ON "post_categories_blocks_stats" USING btree ("_parent_id");
  CREATE INDEX "post_categories_blocks_stats_path_idx" ON "post_categories_blocks_stats" USING btree ("_path");
  CREATE UNIQUE INDEX "post_categories_blocks_stats_locales_locale_parent_id_unique" ON "post_categories_blocks_stats_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "post_categories_blocks_video_order_idx" ON "post_categories_blocks_video" USING btree ("_order");
  CREATE INDEX "post_categories_blocks_video_parent_id_idx" ON "post_categories_blocks_video" USING btree ("_parent_id");
  CREATE INDEX "post_categories_blocks_video_path_idx" ON "post_categories_blocks_video" USING btree ("_path");
  CREATE INDEX "post_categories_blocks_video_thumbnail_idx" ON "post_categories_blocks_video" USING btree ("thumbnail_id");
  CREATE UNIQUE INDEX "post_categories_blocks_video_locales_locale_parent_id_unique" ON "post_categories_blocks_video_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "post_categories_blocks_spacer_order_idx" ON "post_categories_blocks_spacer" USING btree ("_order");
  CREATE INDEX "post_categories_blocks_spacer_parent_id_idx" ON "post_categories_blocks_spacer" USING btree ("_parent_id");
  CREATE INDEX "post_categories_blocks_spacer_path_idx" ON "post_categories_blocks_spacer" USING btree ("_path");
  CREATE UNIQUE INDEX "post_categories_slug_idx" ON "post_categories" USING btree ("slug");
  CREATE INDEX "post_categories_image_idx" ON "post_categories" USING btree ("image_id");
  CREATE INDEX "post_categories_seo_seo_image_idx" ON "post_categories" USING btree ("seo_image_id");
  CREATE INDEX "post_categories_updated_at_idx" ON "post_categories" USING btree ("updated_at");
  CREATE INDEX "post_categories_created_at_idx" ON "post_categories" USING btree ("created_at");
  CREATE UNIQUE INDEX "post_categories_locales_locale_parent_id_unique" ON "post_categories_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "post_categories_rels_order_idx" ON "post_categories_rels" USING btree ("order");
  CREATE INDEX "post_categories_rels_parent_idx" ON "post_categories_rels" USING btree ("parent_id");
  CREATE INDEX "post_categories_rels_path_idx" ON "post_categories_rels" USING btree ("path");
  CREATE INDEX "post_categories_rels_pages_id_idx" ON "post_categories_rels" USING btree ("pages_id");
  CREATE INDEX "post_categories_rels_products_id_idx" ON "post_categories_rels" USING btree ("products_id");
  CREATE INDEX "post_categories_rels_categories_id_idx" ON "post_categories_rels" USING btree ("categories_id");
  CREATE INDEX "post_categories_rels_brands_id_idx" ON "post_categories_rels" USING btree ("brands_id");
  CREATE INDEX "post_categories_rels_posts_id_idx" ON "post_categories_rels" USING btree ("posts_id");
  CREATE INDEX "post_categories_rels_post_categories_id_idx" ON "post_categories_rels" USING btree ("post_categories_id");
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_post_categories_fk" FOREIGN KEY ("post_categories_id") REFERENCES "public"."post_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_post_categories_fk" FOREIGN KEY ("post_categories_id") REFERENCES "public"."post_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories_rels" ADD CONSTRAINT "categories_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories_rels" ADD CONSTRAINT "categories_rels_post_categories_fk" FOREIGN KEY ("post_categories_id") REFERENCES "public"."post_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "brands_rels" ADD CONSTRAINT "brands_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "brands_rels" ADD CONSTRAINT "brands_rels_post_categories_fk" FOREIGN KEY ("post_categories_id") REFERENCES "public"."post_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_post_categories_fk" FOREIGN KEY ("post_categories_id") REFERENCES "public"."post_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_rels" ADD CONSTRAINT "_products_v_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_rels" ADD CONSTRAINT "_products_v_rels_post_categories_fk" FOREIGN KEY ("post_categories_id") REFERENCES "public"."post_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_post_categories_fk" FOREIGN KEY ("post_categories_id") REFERENCES "public"."post_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_rels" ADD CONSTRAINT "header_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_rels" ADD CONSTRAINT "header_rels_post_categories_fk" FOREIGN KEY ("post_categories_id") REFERENCES "public"."post_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_rels" ADD CONSTRAINT "footer_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_rels" ADD CONSTRAINT "footer_rels_post_categories_fk" FOREIGN KEY ("post_categories_id") REFERENCES "public"."post_categories"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_rels_posts_id_idx" ON "pages_rels" USING btree ("posts_id");
  CREATE INDEX "pages_rels_post_categories_id_idx" ON "pages_rels" USING btree ("post_categories_id");
  CREATE INDEX "_pages_v_rels_posts_id_idx" ON "_pages_v_rels" USING btree ("posts_id");
  CREATE INDEX "_pages_v_rels_post_categories_id_idx" ON "_pages_v_rels" USING btree ("post_categories_id");
  CREATE INDEX "categories_rels_posts_id_idx" ON "categories_rels" USING btree ("posts_id");
  CREATE INDEX "categories_rels_post_categories_id_idx" ON "categories_rels" USING btree ("post_categories_id");
  CREATE INDEX "brands_rels_posts_id_idx" ON "brands_rels" USING btree ("posts_id");
  CREATE INDEX "brands_rels_post_categories_id_idx" ON "brands_rels" USING btree ("post_categories_id");
  CREATE INDEX "products_rels_posts_id_idx" ON "products_rels" USING btree ("posts_id");
  CREATE INDEX "products_rels_post_categories_id_idx" ON "products_rels" USING btree ("post_categories_id");
  CREATE INDEX "_products_v_rels_posts_id_idx" ON "_products_v_rels" USING btree ("posts_id");
  CREATE INDEX "_products_v_rels_post_categories_id_idx" ON "_products_v_rels" USING btree ("post_categories_id");
  CREATE INDEX "payload_locked_documents_rels_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("posts_id");
  CREATE INDEX "payload_locked_documents_rels_post_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("post_categories_id");
  CREATE INDEX "header_rels_posts_id_idx" ON "header_rels" USING btree ("posts_id");
  CREATE INDEX "header_rels_post_categories_id_idx" ON "header_rels" USING btree ("post_categories_id");
  CREATE INDEX "footer_rels_posts_id_idx" ON "footer_rels" USING btree ("posts_id");
  CREATE INDEX "footer_rels_post_categories_id_idx" ON "footer_rels" USING btree ("post_categories_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "posts_blocks_banner" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_blocks_cta_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_blocks_cta_links_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_blocks_cta" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_blocks_content_columns" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_blocks_content_columns_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_blocks_content" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_blocks_media_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_blocks_carousel" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_blocks_three_item_grid" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_blocks_archive" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_blocks_code" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_blocks_form_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_blocks_quote" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_blocks_quote_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_blocks_faq_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_blocks_faq_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_blocks_faq" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_blocks_faq_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_blocks_stats_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_blocks_stats_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_blocks_stats" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_blocks_stats_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_blocks_video" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_blocks_video_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_blocks_spacer" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_blocks_banner" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_blocks_cta_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_blocks_cta_links_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_blocks_cta" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_blocks_content_columns" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_blocks_content_columns_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_blocks_content" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_blocks_media_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_blocks_carousel" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_blocks_three_item_grid" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_blocks_archive" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_blocks_code" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_blocks_form_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_blocks_quote" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_blocks_quote_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_blocks_faq_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_blocks_faq_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_blocks_faq" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_blocks_faq_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_blocks_stats_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_blocks_stats_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_blocks_stats" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_blocks_stats_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_blocks_video" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_blocks_video_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_blocks_spacer" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "post_categories_blocks_banner" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "post_categories_blocks_cta_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "post_categories_blocks_cta_links_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "post_categories_blocks_cta" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "post_categories_blocks_content_columns" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "post_categories_blocks_content_columns_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "post_categories_blocks_content" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "post_categories_blocks_media_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "post_categories_blocks_carousel" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "post_categories_blocks_three_item_grid" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "post_categories_blocks_archive" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "post_categories_blocks_code" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "post_categories_blocks_form_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "post_categories_blocks_quote" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "post_categories_blocks_quote_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "post_categories_blocks_faq_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "post_categories_blocks_faq_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "post_categories_blocks_faq" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "post_categories_blocks_faq_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "post_categories_blocks_stats_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "post_categories_blocks_stats_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "post_categories_blocks_stats" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "post_categories_blocks_stats_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "post_categories_blocks_video" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "post_categories_blocks_video_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "post_categories_blocks_spacer" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "post_categories" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "post_categories_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "post_categories_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "posts_blocks_banner" CASCADE;
  DROP TABLE "posts_blocks_cta_links" CASCADE;
  DROP TABLE "posts_blocks_cta_links_locales" CASCADE;
  DROP TABLE "posts_blocks_cta" CASCADE;
  DROP TABLE "posts_blocks_content_columns" CASCADE;
  DROP TABLE "posts_blocks_content_columns_locales" CASCADE;
  DROP TABLE "posts_blocks_content" CASCADE;
  DROP TABLE "posts_blocks_media_block" CASCADE;
  DROP TABLE "posts_blocks_carousel" CASCADE;
  DROP TABLE "posts_blocks_three_item_grid" CASCADE;
  DROP TABLE "posts_blocks_archive" CASCADE;
  DROP TABLE "posts_blocks_code" CASCADE;
  DROP TABLE "posts_blocks_form_block" CASCADE;
  DROP TABLE "posts_blocks_quote" CASCADE;
  DROP TABLE "posts_blocks_quote_locales" CASCADE;
  DROP TABLE "posts_blocks_faq_items" CASCADE;
  DROP TABLE "posts_blocks_faq_items_locales" CASCADE;
  DROP TABLE "posts_blocks_faq" CASCADE;
  DROP TABLE "posts_blocks_faq_locales" CASCADE;
  DROP TABLE "posts_blocks_stats_items" CASCADE;
  DROP TABLE "posts_blocks_stats_items_locales" CASCADE;
  DROP TABLE "posts_blocks_stats" CASCADE;
  DROP TABLE "posts_blocks_stats_locales" CASCADE;
  DROP TABLE "posts_blocks_video" CASCADE;
  DROP TABLE "posts_blocks_video_locales" CASCADE;
  DROP TABLE "posts_blocks_spacer" CASCADE;
  DROP TABLE "posts" CASCADE;
  DROP TABLE "posts_locales" CASCADE;
  DROP TABLE "posts_rels" CASCADE;
  DROP TABLE "_posts_v_blocks_banner" CASCADE;
  DROP TABLE "_posts_v_blocks_cta_links" CASCADE;
  DROP TABLE "_posts_v_blocks_cta_links_locales" CASCADE;
  DROP TABLE "_posts_v_blocks_cta" CASCADE;
  DROP TABLE "_posts_v_blocks_content_columns" CASCADE;
  DROP TABLE "_posts_v_blocks_content_columns_locales" CASCADE;
  DROP TABLE "_posts_v_blocks_content" CASCADE;
  DROP TABLE "_posts_v_blocks_media_block" CASCADE;
  DROP TABLE "_posts_v_blocks_carousel" CASCADE;
  DROP TABLE "_posts_v_blocks_three_item_grid" CASCADE;
  DROP TABLE "_posts_v_blocks_archive" CASCADE;
  DROP TABLE "_posts_v_blocks_code" CASCADE;
  DROP TABLE "_posts_v_blocks_form_block" CASCADE;
  DROP TABLE "_posts_v_blocks_quote" CASCADE;
  DROP TABLE "_posts_v_blocks_quote_locales" CASCADE;
  DROP TABLE "_posts_v_blocks_faq_items" CASCADE;
  DROP TABLE "_posts_v_blocks_faq_items_locales" CASCADE;
  DROP TABLE "_posts_v_blocks_faq" CASCADE;
  DROP TABLE "_posts_v_blocks_faq_locales" CASCADE;
  DROP TABLE "_posts_v_blocks_stats_items" CASCADE;
  DROP TABLE "_posts_v_blocks_stats_items_locales" CASCADE;
  DROP TABLE "_posts_v_blocks_stats" CASCADE;
  DROP TABLE "_posts_v_blocks_stats_locales" CASCADE;
  DROP TABLE "_posts_v_blocks_video" CASCADE;
  DROP TABLE "_posts_v_blocks_video_locales" CASCADE;
  DROP TABLE "_posts_v_blocks_spacer" CASCADE;
  DROP TABLE "_posts_v" CASCADE;
  DROP TABLE "_posts_v_locales" CASCADE;
  DROP TABLE "_posts_v_rels" CASCADE;
  DROP TABLE "post_categories_blocks_banner" CASCADE;
  DROP TABLE "post_categories_blocks_cta_links" CASCADE;
  DROP TABLE "post_categories_blocks_cta_links_locales" CASCADE;
  DROP TABLE "post_categories_blocks_cta" CASCADE;
  DROP TABLE "post_categories_blocks_content_columns" CASCADE;
  DROP TABLE "post_categories_blocks_content_columns_locales" CASCADE;
  DROP TABLE "post_categories_blocks_content" CASCADE;
  DROP TABLE "post_categories_blocks_media_block" CASCADE;
  DROP TABLE "post_categories_blocks_carousel" CASCADE;
  DROP TABLE "post_categories_blocks_three_item_grid" CASCADE;
  DROP TABLE "post_categories_blocks_archive" CASCADE;
  DROP TABLE "post_categories_blocks_code" CASCADE;
  DROP TABLE "post_categories_blocks_form_block" CASCADE;
  DROP TABLE "post_categories_blocks_quote" CASCADE;
  DROP TABLE "post_categories_blocks_quote_locales" CASCADE;
  DROP TABLE "post_categories_blocks_faq_items" CASCADE;
  DROP TABLE "post_categories_blocks_faq_items_locales" CASCADE;
  DROP TABLE "post_categories_blocks_faq" CASCADE;
  DROP TABLE "post_categories_blocks_faq_locales" CASCADE;
  DROP TABLE "post_categories_blocks_stats_items" CASCADE;
  DROP TABLE "post_categories_blocks_stats_items_locales" CASCADE;
  DROP TABLE "post_categories_blocks_stats" CASCADE;
  DROP TABLE "post_categories_blocks_stats_locales" CASCADE;
  DROP TABLE "post_categories_blocks_video" CASCADE;
  DROP TABLE "post_categories_blocks_video_locales" CASCADE;
  DROP TABLE "post_categories_blocks_spacer" CASCADE;
  DROP TABLE "post_categories" CASCADE;
  DROP TABLE "post_categories_locales" CASCADE;
  DROP TABLE "post_categories_rels" CASCADE;
  ALTER TABLE "pages_rels" DROP CONSTRAINT "pages_rels_posts_fk";
  
  ALTER TABLE "pages_rels" DROP CONSTRAINT "pages_rels_post_categories_fk";
  
  ALTER TABLE "_pages_v_rels" DROP CONSTRAINT "_pages_v_rels_posts_fk";
  
  ALTER TABLE "_pages_v_rels" DROP CONSTRAINT "_pages_v_rels_post_categories_fk";
  
  ALTER TABLE "categories_rels" DROP CONSTRAINT "categories_rels_posts_fk";
  
  ALTER TABLE "categories_rels" DROP CONSTRAINT "categories_rels_post_categories_fk";
  
  ALTER TABLE "brands_rels" DROP CONSTRAINT "brands_rels_posts_fk";
  
  ALTER TABLE "brands_rels" DROP CONSTRAINT "brands_rels_post_categories_fk";
  
  ALTER TABLE "products_rels" DROP CONSTRAINT "products_rels_posts_fk";
  
  ALTER TABLE "products_rels" DROP CONSTRAINT "products_rels_post_categories_fk";
  
  ALTER TABLE "_products_v_rels" DROP CONSTRAINT "_products_v_rels_posts_fk";
  
  ALTER TABLE "_products_v_rels" DROP CONSTRAINT "_products_v_rels_post_categories_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_posts_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_post_categories_fk";
  
  ALTER TABLE "header_rels" DROP CONSTRAINT "header_rels_posts_fk";
  
  ALTER TABLE "header_rels" DROP CONSTRAINT "header_rels_post_categories_fk";
  
  ALTER TABLE "footer_rels" DROP CONSTRAINT "footer_rels_posts_fk";
  
  ALTER TABLE "footer_rels" DROP CONSTRAINT "footer_rels_post_categories_fk";
  
  DROP INDEX "pages_rels_posts_id_idx";
  DROP INDEX "pages_rels_post_categories_id_idx";
  DROP INDEX "_pages_v_rels_posts_id_idx";
  DROP INDEX "_pages_v_rels_post_categories_id_idx";
  DROP INDEX "categories_rels_posts_id_idx";
  DROP INDEX "categories_rels_post_categories_id_idx";
  DROP INDEX "brands_rels_posts_id_idx";
  DROP INDEX "brands_rels_post_categories_id_idx";
  DROP INDEX "products_rels_posts_id_idx";
  DROP INDEX "products_rels_post_categories_id_idx";
  DROP INDEX "_products_v_rels_posts_id_idx";
  DROP INDEX "_products_v_rels_post_categories_id_idx";
  DROP INDEX "payload_locked_documents_rels_posts_id_idx";
  DROP INDEX "payload_locked_documents_rels_post_categories_id_idx";
  DROP INDEX "header_rels_posts_id_idx";
  DROP INDEX "header_rels_post_categories_id_idx";
  DROP INDEX "footer_rels_posts_id_idx";
  DROP INDEX "footer_rels_post_categories_id_idx";
  ALTER TABLE "pages_rels" DROP COLUMN "posts_id";
  ALTER TABLE "pages_rels" DROP COLUMN "post_categories_id";
  ALTER TABLE "_pages_v_rels" DROP COLUMN "posts_id";
  ALTER TABLE "_pages_v_rels" DROP COLUMN "post_categories_id";
  ALTER TABLE "categories_rels" DROP COLUMN "posts_id";
  ALTER TABLE "categories_rels" DROP COLUMN "post_categories_id";
  ALTER TABLE "brands_rels" DROP COLUMN "posts_id";
  ALTER TABLE "brands_rels" DROP COLUMN "post_categories_id";
  ALTER TABLE "products_rels" DROP COLUMN "posts_id";
  ALTER TABLE "products_rels" DROP COLUMN "post_categories_id";
  ALTER TABLE "_products_v_rels" DROP COLUMN "posts_id";
  ALTER TABLE "_products_v_rels" DROP COLUMN "post_categories_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "posts_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "post_categories_id";
  ALTER TABLE "header_rels" DROP COLUMN "posts_id";
  ALTER TABLE "header_rels" DROP COLUMN "post_categories_id";
  ALTER TABLE "footer_rels" DROP COLUMN "posts_id";
  ALTER TABLE "footer_rels" DROP COLUMN "post_categories_id";
  DROP TYPE "public"."enum_posts_blocks_banner_style";
  DROP TYPE "public"."enum_posts_blocks_cta_links_link_type";
  DROP TYPE "public"."enum_posts_blocks_cta_links_link_appearance";
  DROP TYPE "public"."enum_posts_blocks_content_columns_size";
  DROP TYPE "public"."enum_posts_blocks_content_columns_link_type";
  DROP TYPE "public"."enum_posts_blocks_content_columns_link_appearance";
  DROP TYPE "public"."enum_posts_blocks_carousel_populate_by";
  DROP TYPE "public"."enum_posts_blocks_carousel_relation_to";
  DROP TYPE "public"."enum_posts_blocks_archive_populate_by";
  DROP TYPE "public"."enum_posts_blocks_archive_relation_to";
  DROP TYPE "public"."enum_posts_blocks_code_language";
  DROP TYPE "public"."enum_posts_blocks_quote_rating";
  DROP TYPE "public"."enum_posts_blocks_video_platform";
  DROP TYPE "public"."enum_posts_blocks_spacer_size";
  DROP TYPE "public"."enum_posts_status";
  DROP TYPE "public"."enum__posts_v_blocks_banner_style";
  DROP TYPE "public"."enum__posts_v_blocks_cta_links_link_type";
  DROP TYPE "public"."enum__posts_v_blocks_cta_links_link_appearance";
  DROP TYPE "public"."enum__posts_v_blocks_content_columns_size";
  DROP TYPE "public"."enum__posts_v_blocks_content_columns_link_type";
  DROP TYPE "public"."enum__posts_v_blocks_content_columns_link_appearance";
  DROP TYPE "public"."enum__posts_v_blocks_carousel_populate_by";
  DROP TYPE "public"."enum__posts_v_blocks_carousel_relation_to";
  DROP TYPE "public"."enum__posts_v_blocks_archive_populate_by";
  DROP TYPE "public"."enum__posts_v_blocks_archive_relation_to";
  DROP TYPE "public"."enum__posts_v_blocks_code_language";
  DROP TYPE "public"."enum__posts_v_blocks_quote_rating";
  DROP TYPE "public"."enum__posts_v_blocks_video_platform";
  DROP TYPE "public"."enum__posts_v_blocks_spacer_size";
  DROP TYPE "public"."enum__posts_v_version_status";
  DROP TYPE "public"."enum__posts_v_published_locale";
  DROP TYPE "public"."enum_post_categories_blocks_banner_style";
  DROP TYPE "public"."enum_post_categories_blocks_cta_links_link_type";
  DROP TYPE "public"."enum_post_categories_blocks_cta_links_link_appearance";
  DROP TYPE "public"."enum_post_categories_blocks_content_columns_size";
  DROP TYPE "public"."enum_post_categories_blocks_content_columns_link_type";
  DROP TYPE "public"."enum_post_categories_blocks_content_columns_link_appearance";
  DROP TYPE "public"."enum_post_categories_blocks_carousel_populate_by";
  DROP TYPE "public"."enum_post_categories_blocks_carousel_relation_to";
  DROP TYPE "public"."enum_post_categories_blocks_archive_populate_by";
  DROP TYPE "public"."enum_post_categories_blocks_archive_relation_to";
  DROP TYPE "public"."enum_post_categories_blocks_code_language";
  DROP TYPE "public"."enum_post_categories_blocks_quote_rating";
  DROP TYPE "public"."enum_post_categories_blocks_video_platform";
  DROP TYPE "public"."enum_post_categories_blocks_spacer_size";`)
}
