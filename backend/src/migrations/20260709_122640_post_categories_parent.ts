import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "post_categories" ADD COLUMN "parent_id" integer;
  ALTER TABLE "post_categories" ADD CONSTRAINT "post_categories_parent_id_post_categories_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."post_categories"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "post_categories_parent_idx" ON "post_categories" USING btree ("parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "post_categories" DROP CONSTRAINT "post_categories_parent_id_post_categories_id_fk";
  
  DROP INDEX "post_categories_parent_idx";
  ALTER TABLE "post_categories" DROP COLUMN "parent_id";`)
}
