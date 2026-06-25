import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_about_mission" ADD COLUMN "video_cover" boolean DEFAULT true;
  ALTER TABLE "_pages_v_blocks_about_mission" ADD COLUMN "video_cover" boolean DEFAULT true;
  ALTER TABLE "posts_blocks_about_mission" ADD COLUMN "video_cover" boolean DEFAULT true;
  ALTER TABLE "_posts_v_blocks_about_mission" ADD COLUMN "video_cover" boolean DEFAULT true;
  ALTER TABLE "categories_blocks_about_mission" ADD COLUMN "video_cover" boolean DEFAULT true;
  ALTER TABLE "post_categories_blocks_about_mission" ADD COLUMN "video_cover" boolean DEFAULT true;
  ALTER TABLE "brands_blocks_about_mission" ADD COLUMN "video_cover" boolean DEFAULT true;
  ALTER TABLE "products_blocks_about_mission" ADD COLUMN "video_cover" boolean DEFAULT true;
  ALTER TABLE "_products_v_blocks_about_mission" ADD COLUMN "video_cover" boolean DEFAULT true;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_about_mission" DROP COLUMN "video_cover";
  ALTER TABLE "_pages_v_blocks_about_mission" DROP COLUMN "video_cover";
  ALTER TABLE "posts_blocks_about_mission" DROP COLUMN "video_cover";
  ALTER TABLE "_posts_v_blocks_about_mission" DROP COLUMN "video_cover";
  ALTER TABLE "categories_blocks_about_mission" DROP COLUMN "video_cover";
  ALTER TABLE "post_categories_blocks_about_mission" DROP COLUMN "video_cover";
  ALTER TABLE "brands_blocks_about_mission" DROP COLUMN "video_cover";
  ALTER TABLE "products_blocks_about_mission" DROP COLUMN "video_cover";
  ALTER TABLE "_products_v_blocks_about_mission" DROP COLUMN "video_cover";`)
}
