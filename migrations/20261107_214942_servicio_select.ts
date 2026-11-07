import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_contact_submissions_servicio" AS ENUM('empresa-limpieza-granada', 'lavanderia-profesional-granada', 'lavanderia-hoteles-granada', 'lavanderia-apartamentos-turisticos-granada', 'lavanderia-sierra-nevada', 'limpieza-apartamentos-turisticos-granada', 'limpieza-oficinas-locales-granada', 'limpieza-fin-de-obra-granada', 'renting-textil-granada', 'lavanderia-domicilio-granada', 'varios');
  ALTER TABLE "contact_submissions" ALTER COLUMN "servicio" SET DATA TYPE "public"."enum_contact_submissions_servicio" USING "servicio"::"public"."enum_contact_submissions_servicio";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "contact_submissions" ALTER COLUMN "servicio" SET DATA TYPE varchar;
  DROP TYPE "public"."enum_contact_submissions_servicio";`)
}
