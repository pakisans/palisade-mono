import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "products" ADD COLUMN "technical_sheet_id" integer;
  ALTER TABLE "products" ADD COLUMN "installation_video" varchar;
  ALTER TABLE "_products_v" ADD COLUMN "version_technical_sheet_id" integer;
  ALTER TABLE "_products_v" ADD COLUMN "version_installation_video" varchar;
  ALTER TABLE "products" ADD CONSTRAINT "products_technical_sheet_id_media_id_fk" FOREIGN KEY ("technical_sheet_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v" ADD CONSTRAINT "_products_v_version_technical_sheet_id_media_id_fk" FOREIGN KEY ("version_technical_sheet_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "products_technical_sheet_idx" ON "products" USING btree ("technical_sheet_id");
  CREATE INDEX "_products_v_version_version_technical_sheet_idx" ON "_products_v" USING btree ("version_technical_sheet_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "products" DROP CONSTRAINT "products_technical_sheet_id_media_id_fk";
  
  ALTER TABLE "_products_v" DROP CONSTRAINT "_products_v_version_technical_sheet_id_media_id_fk";
  
  DROP INDEX "products_technical_sheet_idx";
  DROP INDEX "_products_v_version_version_technical_sheet_idx";
  ALTER TABLE "products" DROP COLUMN "technical_sheet_id";
  ALTER TABLE "products" DROP COLUMN "installation_video";
  ALTER TABLE "_products_v" DROP COLUMN "version_technical_sheet_id";
  ALTER TABLE "_products_v" DROP COLUMN "version_installation_video";`)
}
