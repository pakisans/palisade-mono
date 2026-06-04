import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "header" ADD COLUMN "logo_id" integer;
  ALTER TABLE "header_locales" ADD COLUMN "site_name" varchar;
  ALTER TABLE "header" ADD CONSTRAINT "header_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "header_logo_idx" ON "header" USING btree ("logo_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "header" DROP CONSTRAINT "header_logo_id_media_id_fk";
  
  DROP INDEX "header_logo_idx";
  ALTER TABLE "header" DROP COLUMN "logo_id";
  ALTER TABLE "header_locales" DROP COLUMN "site_name";`)
}
