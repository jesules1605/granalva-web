import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_campaigns_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__campaigns_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_site_settings_social_platform" AS ENUM('Google Business Profile', 'Instagram', 'Facebook', 'LinkedIn', 'TikTok', 'YouTube', 'Otra');
  CREATE TABLE "campaigns_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"text" varchar
  );
  
  CREATE TABLE "campaigns" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"active" boolean DEFAULT true,
  	"priority" numeric DEFAULT 10,
  	"start_date" timestamp(3) with time zone,
  	"end_date" timestamp(3) with time zone,
  	"label" varchar,
  	"title" varchar,
  	"text" varchar,
  	"primary_label" varchar,
  	"primary_href" varchar,
  	"secondary_label" varchar,
  	"secondary_href" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_campaigns_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_campaigns_v_version_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_campaigns_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_active" boolean DEFAULT true,
  	"version_priority" numeric DEFAULT 10,
  	"version_start_date" timestamp(3) with time zone,
  	"version_end_date" timestamp(3) with time zone,
  	"version_label" varchar,
  	"version_title" varchar,
  	"version_text" varchar,
  	"version_primary_label" varchar,
  	"version_primary_href" varchar,
  	"version_secondary_label" varchar,
  	"version_secondary_href" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__campaigns_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "posts_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"categories_id" integer
  );
  
  CREATE TABLE "_posts_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"categories_id" integer
  );
  
  CREATE TABLE "categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_settings_social" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_site_settings_social_platform" NOT NULL,
  	"url" varchar NOT NULL
  );
  
  ALTER TABLE "services" ALTER COLUMN "hero_overlay" SET DEFAULT 72;
  ALTER TABLE "_services_v" ALTER COLUMN "version_hero_overlay" SET DEFAULT 72;
  ALTER TABLE "home_page" ALTER COLUMN "overlay" SET DEFAULT 70;
  ALTER TABLE "_home_page_v" ALTER COLUMN "version_overlay" SET DEFAULT 70;
  ALTER TABLE "posts" ADD COLUMN "author_member_id" integer;
  ALTER TABLE "_posts_v" ADD COLUMN "version_author_member_id" integer;
  ALTER TABLE "media" ADD COLUMN "title" varchar;
  ALTER TABLE "media" ADD COLUMN "caption" varchar;
  ALTER TABLE "_media_v" ADD COLUMN "version_title" varchar;
  ALTER TABLE "_media_v" ADD COLUMN "version_caption" varchar;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "campaigns_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "categories_id" integer;
  ALTER TABLE "site_settings" ADD COLUMN "opening_hours" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "order_url" varchar;
  ALTER TABLE "campaigns_points" ADD CONSTRAINT "campaigns_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."campaigns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_campaigns_v_version_points" ADD CONSTRAINT "_campaigns_v_version_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_campaigns_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_campaigns_v" ADD CONSTRAINT "_campaigns_v_parent_id_campaigns_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."campaigns"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_social" ADD CONSTRAINT "site_settings_social_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "campaigns_points_order_idx" ON "campaigns_points" USING btree ("_order");
  CREATE INDEX "campaigns_points_parent_id_idx" ON "campaigns_points" USING btree ("_parent_id");
  CREATE INDEX "campaigns_updated_at_idx" ON "campaigns" USING btree ("updated_at");
  CREATE INDEX "campaigns_created_at_idx" ON "campaigns" USING btree ("created_at");
  CREATE INDEX "campaigns__status_idx" ON "campaigns" USING btree ("_status");
  CREATE INDEX "_campaigns_v_version_points_order_idx" ON "_campaigns_v_version_points" USING btree ("_order");
  CREATE INDEX "_campaigns_v_version_points_parent_id_idx" ON "_campaigns_v_version_points" USING btree ("_parent_id");
  CREATE INDEX "_campaigns_v_parent_idx" ON "_campaigns_v" USING btree ("parent_id");
  CREATE INDEX "_campaigns_v_version_version_updated_at_idx" ON "_campaigns_v" USING btree ("version_updated_at");
  CREATE INDEX "_campaigns_v_version_version_created_at_idx" ON "_campaigns_v" USING btree ("version_created_at");
  CREATE INDEX "_campaigns_v_version_version__status_idx" ON "_campaigns_v" USING btree ("version__status");
  CREATE INDEX "_campaigns_v_created_at_idx" ON "_campaigns_v" USING btree ("created_at");
  CREATE INDEX "_campaigns_v_updated_at_idx" ON "_campaigns_v" USING btree ("updated_at");
  CREATE INDEX "_campaigns_v_latest_idx" ON "_campaigns_v" USING btree ("latest");
  CREATE INDEX "posts_rels_order_idx" ON "posts_rels" USING btree ("order");
  CREATE INDEX "posts_rels_parent_idx" ON "posts_rels" USING btree ("parent_id");
  CREATE INDEX "posts_rels_path_idx" ON "posts_rels" USING btree ("path");
  CREATE INDEX "posts_rels_categories_id_idx" ON "posts_rels" USING btree ("categories_id");
  CREATE INDEX "_posts_v_rels_order_idx" ON "_posts_v_rels" USING btree ("order");
  CREATE INDEX "_posts_v_rels_parent_idx" ON "_posts_v_rels" USING btree ("parent_id");
  CREATE INDEX "_posts_v_rels_path_idx" ON "_posts_v_rels" USING btree ("path");
  CREATE INDEX "_posts_v_rels_categories_id_idx" ON "_posts_v_rels" USING btree ("categories_id");
  CREATE UNIQUE INDEX "categories_name_idx" ON "categories" USING btree ("name");
  CREATE INDEX "categories_updated_at_idx" ON "categories" USING btree ("updated_at");
  CREATE INDEX "categories_created_at_idx" ON "categories" USING btree ("created_at");
  CREATE INDEX "site_settings_social_order_idx" ON "site_settings_social" USING btree ("_order");
  CREATE INDEX "site_settings_social_parent_id_idx" ON "site_settings_social" USING btree ("_parent_id");
  ALTER TABLE "posts" ADD CONSTRAINT "posts_author_member_id_team_id_fk" FOREIGN KEY ("author_member_id") REFERENCES "public"."team"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_author_member_id_team_id_fk" FOREIGN KEY ("version_author_member_id") REFERENCES "public"."team"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_campaigns_fk" FOREIGN KEY ("campaigns_id") REFERENCES "public"."campaigns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "posts_author_member_idx" ON "posts" USING btree ("author_member_id");
  CREATE INDEX "_posts_v_version_version_author_member_idx" ON "_posts_v" USING btree ("version_author_member_id");
  CREATE INDEX "payload_locked_documents_rels_campaigns_id_idx" ON "payload_locked_documents_rels" USING btree ("campaigns_id");
  CREATE INDEX "payload_locked_documents_rels_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("categories_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "campaigns_points" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "campaigns" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_campaigns_v_version_points" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_campaigns_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "categories" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings_social" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "campaigns_points" CASCADE;
  DROP TABLE "campaigns" CASCADE;
  DROP TABLE "_campaigns_v_version_points" CASCADE;
  DROP TABLE "_campaigns_v" CASCADE;
  DROP TABLE "posts_rels" CASCADE;
  DROP TABLE "_posts_v_rels" CASCADE;
  DROP TABLE "categories" CASCADE;
  DROP TABLE "site_settings_social" CASCADE;
  ALTER TABLE "posts" DROP CONSTRAINT IF EXISTS "posts_author_member_id_team_id_fk";
  
  ALTER TABLE "_posts_v" DROP CONSTRAINT IF EXISTS "_posts_v_version_author_member_id_team_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_campaigns_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_categories_fk";
  
  DROP INDEX "posts_author_member_idx";
  DROP INDEX "_posts_v_version_version_author_member_idx";
  DROP INDEX "payload_locked_documents_rels_campaigns_id_idx";
  DROP INDEX "payload_locked_documents_rels_categories_id_idx";
  ALTER TABLE "services" ALTER COLUMN "hero_overlay" SET DEFAULT 90;
  ALTER TABLE "_services_v" ALTER COLUMN "version_hero_overlay" SET DEFAULT 90;
  ALTER TABLE "home_page" ALTER COLUMN "overlay" SET DEFAULT 85;
  ALTER TABLE "_home_page_v" ALTER COLUMN "version_overlay" SET DEFAULT 85;
  ALTER TABLE "posts" DROP COLUMN "author_member_id";
  ALTER TABLE "_posts_v" DROP COLUMN "version_author_member_id";
  ALTER TABLE "media" DROP COLUMN "title";
  ALTER TABLE "media" DROP COLUMN "caption";
  ALTER TABLE "_media_v" DROP COLUMN "version_title";
  ALTER TABLE "_media_v" DROP COLUMN "version_caption";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "campaigns_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "categories_id";
  ALTER TABLE "site_settings" DROP COLUMN "opening_hours";
  ALTER TABLE "site_settings" DROP COLUMN "order_url";
  DROP TYPE "public"."enum_campaigns_status";
  DROP TYPE "public"."enum__campaigns_v_version_status";
  DROP TYPE "public"."enum_site_settings_social_platform";`)
}
