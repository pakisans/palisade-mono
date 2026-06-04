import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "products_rels" ADD COLUMN IF NOT EXISTS "variant_options_id" integer;
   ALTER TABLE "_products_v_rels" ADD COLUMN IF NOT EXISTS "variant_options_id" integer;
   ALTER TABLE "products_rels" DROP CONSTRAINT IF EXISTS "products_rels_variant_options_fk";
   ALTER TABLE "_products_v_rels" DROP CONSTRAINT IF EXISTS "_products_v_rels_variant_options_fk";
   ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_variant_options_fk" FOREIGN KEY ("variant_options_id") REFERENCES "public"."variant_options"("id") ON DELETE cascade ON UPDATE no action;
   ALTER TABLE "_products_v_rels" ADD CONSTRAINT "_products_v_rels_variant_options_fk" FOREIGN KEY ("variant_options_id") REFERENCES "public"."variant_options"("id") ON DELETE cascade ON UPDATE no action;
   CREATE INDEX IF NOT EXISTS "products_rels_variant_options_id_idx" ON "products_rels" USING btree ("variant_options_id");
   CREATE INDEX IF NOT EXISTS "_products_v_rels_variant_options_id_idx" ON "_products_v_rels" USING btree ("variant_options_id");
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "products_rels" DROP CONSTRAINT IF EXISTS "products_rels_variant_options_fk";
   ALTER TABLE "_products_v_rels" DROP CONSTRAINT IF EXISTS "_products_v_rels_variant_options_fk";
   DROP INDEX IF EXISTS "products_rels_variant_options_id_idx";
   DROP INDEX IF EXISTS "_products_v_rels_variant_options_id_idx";
   ALTER TABLE "products_rels" DROP COLUMN IF EXISTS "variant_options_id";
   ALTER TABLE "_products_v_rels" DROP COLUMN IF EXISTS "variant_options_id";
  `)
}
