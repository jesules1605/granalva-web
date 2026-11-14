import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_contact_submissions_lost_reason" AS ENUM('precio', 'sin-respuesta', 'fuera-de-servicio', 'plazo', 'competencia', 'otro');
  CREATE TYPE "public"."enum_system_events_type" AS ENUM('form_error', 'form_verification', 'email_error');
  CREATE TABLE "consent_records" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"consent_id" varchar NOT NULL,
  	"analytics" boolean DEFAULT false,
  	"version" numeric NOT NULL,
  	"tools" varchar,
  	"path" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "system_events" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"type" "enum_system_events_type" NOT NULL,
  	"path" varchar,
  	"detail" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "analytics_settings_recipients" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"email" varchar NOT NULL
  );
  
  CREATE TABLE "analytics_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"ga4_measurement_id" varchar,
  	"ga4_property_id" varchar,
  	"gtm_container_id" varchar,
  	"clarity_project_id" varchar,
  	"cloudflare_site_tag" varchar,
  	"search_console_property" varchar DEFAULT 'sc-domain:limpiezasgranalva.com',
  	"looker_studio_url" varchar,
  	"weekly_report" boolean DEFAULT true,
  	"monthly_report" boolean DEFAULT true,
  	"alerts" boolean DEFAULT true,
  	"no_leads_days" numeric DEFAULT 10,
  	"form_errors_per_day" numeric DEFAULT 3,
  	"organic_drop_percent" numeric DEFAULT 40,
  	"not_found_increase_percent" numeric DEFAULT 100,
  	"lcp_threshold_ms" numeric DEFAULT 2500,
  	"inp_threshold_ms" numeric DEFAULT 200,
  	"cls_threshold" numeric DEFAULT 0.1,
  	"google_connected_email" varchar,
  	"google_connected_at" timestamp(3) with time zone,
  	"google_refresh_token" varchar,
  	"alert_state" jsonb,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "contact_submissions" ADD COLUMN "estimated_amount" numeric;
  ALTER TABLE "contact_submissions" ADD COLUMN "follow_up_date" timestamp(3) with time zone;
  ALTER TABLE "contact_submissions" ADD COLUMN "lost_reason" "enum_contact_submissions_lost_reason";
  ALTER TABLE "contact_submissions" ADD COLUMN "lost_reason_detail" varchar;
  ALTER TABLE "contact_submissions" ADD COLUMN "contacted_at" timestamp(3) with time zone;
  ALTER TABLE "contact_submissions" ADD COLUMN "quoted_at" timestamp(3) with time zone;
  ALTER TABLE "contact_submissions" ADD COLUMN "closed_at" timestamp(3) with time zone;
  ALTER TABLE "contact_submissions" ADD COLUMN "analytics_consent" boolean DEFAULT false;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "consent_records_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "system_events_id" integer;
  ALTER TABLE "analytics_settings_recipients" ADD CONSTRAINT "analytics_settings_recipients_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."analytics_settings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "consent_records_consent_id_idx" ON "consent_records" USING btree ("consent_id");
  CREATE INDEX "consent_records_updated_at_idx" ON "consent_records" USING btree ("updated_at");
  CREATE INDEX "consent_records_created_at_idx" ON "consent_records" USING btree ("created_at");
  CREATE INDEX "system_events_type_idx" ON "system_events" USING btree ("type");
  CREATE INDEX "system_events_updated_at_idx" ON "system_events" USING btree ("updated_at");
  CREATE INDEX "system_events_created_at_idx" ON "system_events" USING btree ("created_at");
  CREATE INDEX "analytics_settings_recipients_order_idx" ON "analytics_settings_recipients" USING btree ("_order");
  CREATE INDEX "analytics_settings_recipients_parent_id_idx" ON "analytics_settings_recipients" USING btree ("_parent_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_consent_records_fk" FOREIGN KEY ("consent_records_id") REFERENCES "public"."consent_records"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_system_events_fk" FOREIGN KEY ("system_events_id") REFERENCES "public"."system_events"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_consent_records_id_idx" ON "payload_locked_documents_rels" USING btree ("consent_records_id");
  CREATE INDEX "payload_locked_documents_rels_system_events_id_idx" ON "payload_locked_documents_rels" USING btree ("system_events_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "consent_records" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "system_events" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "analytics_settings_recipients" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "analytics_settings" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "consent_records" CASCADE;
  DROP TABLE "system_events" CASCADE;
  DROP TABLE "analytics_settings_recipients" CASCADE;
  DROP TABLE "analytics_settings" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_consent_records_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_system_events_fk";
  
  DROP INDEX "payload_locked_documents_rels_consent_records_id_idx";
  DROP INDEX "payload_locked_documents_rels_system_events_id_idx";
  ALTER TABLE "contact_submissions" DROP COLUMN "estimated_amount";
  ALTER TABLE "contact_submissions" DROP COLUMN "follow_up_date";
  ALTER TABLE "contact_submissions" DROP COLUMN "lost_reason";
  ALTER TABLE "contact_submissions" DROP COLUMN "lost_reason_detail";
  ALTER TABLE "contact_submissions" DROP COLUMN "contacted_at";
  ALTER TABLE "contact_submissions" DROP COLUMN "quoted_at";
  ALTER TABLE "contact_submissions" DROP COLUMN "closed_at";
  ALTER TABLE "contact_submissions" DROP COLUMN "analytics_consent";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "consent_records_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "system_events_id";
  DROP TYPE "public"."enum_contact_submissions_lost_reason";
  DROP TYPE "public"."enum_system_events_type";`)
}
