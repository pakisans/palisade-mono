import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_hero_media_style" AS ENUM('standard', 'cover');
  CREATE TYPE "public"."enum__pages_v_version_hero_media_style" AS ENUM('standard', 'cover');
  ALTER TABLE "pages" ADD COLUMN "hero_media_style" "enum_pages_hero_media_style" DEFAULT 'standard';
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_media_style" "enum__pages_v_version_hero_media_style" DEFAULT 'standard';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages" DROP COLUMN "hero_media_style";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_media_style";
  DROP TYPE "public"."enum_pages_hero_media_style";
  DROP TYPE "public"."enum__pages_v_version_hero_media_style";`)
}
