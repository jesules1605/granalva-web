import config from "@payload-config";
import { convertMarkdownToLexical, editorConfigFactory } from "@payloadcms/richtext-lexical";
import { headers } from "next/headers";
import { getPayload, type Payload } from "payload";
import { verifiedReviews, team } from "../../../lib/home-content";
import { PHOTOS, type Photo } from "../../../lib/photos";
import { servicePages } from "../../../lib/services";
import { BUSINESS } from "../../../lib/site";
import type { Media } from "../../../../payload-types";
import { hasSetupToken } from "../../../lib/setup-token";

// Carga inicial del panel (idempotente): POST /api/seed-contenido, con sesión de propietario
// o con la clave SETUP_TOKEN del alojamiento.
// - Fotos provisionales con licencia en la biblioteca de medios (con autoría y licencia)
//   y asignadas a la portada y a cada servicio, para poder sustituirlas desde el panel.
// - Reseñas verificadas y equipo.
// - Páginas existentes como BORRADORES (no cambian la web hasta que se publiquen).
// No sobrescribe nada que ya exista.

const log: string[] = [];

type MediaCategory = NonNullable<Media["category"]>;

async function mediaFor(payload: Payload, origin: string, photo: Photo, category: MediaCategory): Promise<number> {
  const filename = photo.src.split("/").pop()!.replace(/\.jpg$/, ".webp");
  const existing = await payload.find({ collection: "media", where: { filename: { equals: filename } }, limit: 1, depth: 0 });
  if (existing.docs[0]) return existing.docs[0].id;
  const response = await fetch(new URL(photo.src, origin));
  if (!response.ok) throw new Error(`No se pudo leer ${photo.src}`);
  const data = Buffer.from(await response.arrayBuffer());
  const doc = await payload.create({
    collection: "media",
    data: { alt: photo.alt, credit: photo.sourceUrl ? `${photo.author} · ${photo.license} · ${photo.sourceUrl} · ${photo.changes}` : "Fotografía propia de Granalva", category, realPhoto: !photo.sourceUrl },
    file: { data, mimetype: "image/jpeg", name: photo.src.split("/").pop()!, size: data.length },
  });
  log.push(`medio: ${doc.filename}`);
  return doc.id;
}

/** HTML de una página legal ya publicada → Markdown (para convertirlo a Lexical). */
function htmlToMarkdown(html: string) {
  const article = html.match(/<article class="legal">([\s\S]*?)<\/article>/)?.[1] ?? "";
  return article
    .replace(/<nav[\s\S]*?<\/nav>/g, "")
    .replace(/<h1[\s\S]*?<\/h1>/g, "")
    .replace(/<p class="legal__updated"[\s\S]*?<\/p>/g, "")
    .replace(/<button[\s\S]*?<\/button>/g, "")
    .replace(/<tr>([\s\S]*?)<\/tr>/g, (_, row: string) => `- ${row.replace(/<t[hd][^>]*>([\s\S]*?)<\/t[hd]>/g, "$1 · ").replace(/ · $/, "")}\n`)
    .replace(/<\/?(table|thead|tbody)[^>]*>/g, "\n")
    .replace(/<h2[^>]*>([\s\S]*?)<\/h2>/g, "\n## $1\n")
    .replace(/<h3[^>]*>([\s\S]*?)<\/h3>/g, "\n### $1\n")
    .replace(/<li[^>]*>([\s\S]*?)<\/li>/g, "- $1\n")
    .replace(/<\/?ul[^>]*>/g, "\n")
    .replace(/<p[^>]*>([\s\S]*?)<\/p>/g, "\n$1\n")
    .replace(/<strong>([\s\S]*?)<\/strong>/g, "**$1**")
    .replace(/<a [^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g, "[$2]($1)")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export async function POST(request: Request) {
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: await headers() });
  const isOwner = (user as { role?: string } | null)?.role === "owner";
  if (!isOwner && !hasSetupToken(request)) return Response.json({ error: "Solo el propietario puede cargar el contenido inicial." }, { status: 403 });
  log.length = 0;
  const origin = new URL(request.url).origin;
  const editorConfig = await editorConfigFactory.default({ config: payload.config });
  const md = (markdown: string) => convertMarkdownToLexical({ editorConfig, markdown });

  // 1. Fotos y portada.
  const categoryFor: Record<string, MediaCategory> = { granalvaBedroom: "portada", granalvaBedroomMobile: "portada", hotelRoom: "lavanderia", hotelRoomMobile: "lavanderia", sierraNevada: "sierra-nevada", apartment: "limpieza-apartamentos", office: "empresas", renovation: "empresas" };
  const ids: Record<string, number> = {};
  for (const [key, photo] of Object.entries(PHOTOS)) ids[key] = await mediaFor(payload, origin, photo, categoryFor[key] ?? "otro");
  const home = await payload.findGlobal({ slug: "home-page", depth: 0 });
  if (!home.imageDesktop) {
    await payload.updateGlobal({ slug: "home-page", data: { imageDesktop: ids.granalvaBedroom, imageMobile: ids.granalvaBedroomMobile, overlay: 70, zoom: false, _status: "published" } });
    log.push("portada: imagen principal asignada");
  }

  // 2. Servicios: un documento publicado por servicio con su foto (sin cambiar textos).
  const photoKey = (src: string) => Object.entries(PHOTOS).find(([, p]) => p.src === src)?.[0];
  for (const service of servicePages) {
    const exists = await payload.find({ collection: "services", where: { slug: { equals: service.slug } }, limit: 1, depth: 0, draft: true });
    if (exists.docs[0]) continue;
    const key = photoKey(service.image);
    await payload.create({ collection: "services", data: { slug: service.slug as never, heroImage: key ? ids[key] : undefined, heroOverlay: 72, _status: "published" } });
    log.push(`servicio: ${service.slug}`);
  }

  // 3. Reseñas y equipo.
  for (const review of verifiedReviews) {
    const exists = await payload.find({ collection: "reviews", where: { author: { equals: review.author } }, limit: 1, depth: 0 });
    if (!exists.docs[0]) {
      await payload.create({ collection: "reviews", data: { ...review, rating: 5, visible: true, relatedToCompany: false } });
      log.push(`reseña: ${review.author}`);
    }
  }
  for (const [order, member] of team.entries()) {
    const exists = await payload.find({ collection: "team", where: { name: { equals: member.name } }, limit: 1, depth: 0 });
    if (!exists.docs[0]) {
      await payload.create({ collection: "team", data: { name: member.name, role: member.role, text: member.text, order: (order + 1) * 10, visible: true } });
      log.push(`equipo: ${member.name}`);
    }
  }

  // 4. Páginas como borradores (no se publican solas).
  const draftPage = async (slug: string, data: Record<string, unknown>) => {
    const exists = await payload.find({ collection: "pages", where: { slug: { equals: slug } }, limit: 1, depth: 0, draft: true });
    if (exists.docs[0]) return;
    await payload.create({ collection: "pages", draft: true, data: { slug, _status: "draft", ...data } as never });
    log.push(`página (borrador): /${slug}`);
  };
  await draftPage("sobre-nosotros", {
    title: "Sobre Granalva: limpieza y lavandería profesional en Granada",
    seo: { metaTitle: "Sobre nosotros: equipo de limpieza y lavandería en Granada", schemaType: "AboutPage" },
    layout: [
      { blockType: "hero", eyebrow: "EMPRESA GRANADINA · EQUIPO PROPIO", lead: "Limpieza de apartamentos turísticos, espacios profesionales y lavandería con recogida y entrega para empresas, alojamientos y particulares de Granada.", image: ids.granalvaBedroom, overlay: 70, primaryLabel: "Solicitar presupuesto", primaryHref: "/contacto#formulario" },
      { blockType: "text", heading: "Una empresa con procesos. Un equipo con nombre.", content: md("Granalva es una empresa granadina con experiencia específica en limpieza de apartamentos turísticos, espacios profesionales y lavandería. Cada servicio se coordina, ejecuta y revisa por un equipo que trabaja junto.") },
      { blockType: "team", heading: "Quién coordina cada servicio" },
      { blockType: "cards", heading: "Cuatro principios en cada servicio", columns: "4", items: [
        { title: "Planificación antes de empezar", text: "Estudiamos espacio, volumen, frecuencia y horarios antes de proponer un servicio." },
        { title: "Interlocutor directo", text: "Cada cliente sabe a quién llamar para cambios, incidencias o picos de trabajo." },
        { title: "Revisión del resultado", text: "Los puntos acordados se comprueban antes de dar por terminado un servicio." },
        { title: "Limpieza y lavandería coordinadas", text: "Un mismo equipo puede encargarse del espacio y de sus textiles." },
      ] },
      { blockType: "reviews", heading: "Lo que dicen nuestros clientes", layout: "carousel" },
      { blockType: "cta", heading: "Hablemos de tu operativa", text: "Cuéntanos qué necesitas y te propondremos un servicio ajustado a tu actividad.", buttonLabel: "Solicitar presupuesto", buttonHref: "/contacto#formulario" },
    ],
  });
  await draftPage("referencias", {
    title: "Referencias y opiniones de nuestros clientes",
    seo: { metaTitle: "Referencias y opiniones de clientes en Granada", schemaType: "CollectionPage" },
    layout: [
      { blockType: "reviews", heading: "Opiniones reales, sin editar", layout: "grid" },
      { blockType: "sectors", heading: "Sectores con los que trabajamos" },
      { blockType: "logos", heading: "Empresas que confían en Granalva" },
      { blockType: "services", heading: "Servicios que valoran nuestros clientes", services: ["limpieza-apartamentos-turisticos-granada", "empresa-limpieza-granada", "lavanderia-profesional-granada", "lavanderia-apartamentos-turisticos-granada"] },
      { blockType: "cta", heading: "¿Quieres ser nuestra próxima referencia?", buttonLabel: "Solicitar presupuesto", buttonHref: "/contacto#formulario" },
    ],
  });
  await draftPage("contacto", {
    title: "Contacto y presupuestos",
    seo: { metaTitle: "Contacto y presupuestos de limpieza y lavandería", schemaType: "ContactPage" },
    layout: [{ blockType: "contact", heading: "Hablemos de tu operativa", text: `Teléfono ${BUSINESS.phoneDisplay} · ${BUSINESS.email}. Responde el equipo de Granalva, sin intermediarios.`, variant: "general" }],
  });
  await draftPage("empresas", {
    title: "Limpieza y lavandería para empresas en Granada",
    seo: { metaTitle: "Limpieza y lavandería para empresas en Granada", schemaType: "WebPage" },
    layout: [
      { blockType: "hero", eyebrow: "PARA EMPRESAS Y ALOJAMIENTOS", lead: "Limpieza profesional, lavandería con recogida y entrega y renting textil coordinados por un mismo equipo.", image: ids.office, overlay: 90, primaryLabel: "Solicitar presupuesto empresarial", primaryHref: "/contacto#formulario" },
      { blockType: "services", heading: "Servicios para empresas", services: ["empresa-limpieza-granada", "limpieza-oficinas-locales-granada", "lavanderia-profesional-granada", "lavanderia-hoteles-granada", "renting-textil-granada", "limpieza-fin-de-obra-granada"] },
      { blockType: "contact", heading: "Cuéntanos qué necesita tu negocio", variant: "general" },
    ],
  });
  await draftPage("particulares", {
    title: "Lavandería a domicilio para particulares en Granada",
    seo: { metaTitle: "Lavandería a domicilio para particulares en Granada", schemaType: "WebPage" },
    layout: [
      { blockType: "hero", eyebrow: "PARA PARTICULARES", lead: "Recogemos tu colada en casa y te la devolvemos limpia, seca y doblada.", image: ids.hotelRoom, overlay: 90, primaryLabel: "Hacer un pedido", primaryHref: "/servicios/lavanderia-domicilio-granada#colada" },
      { blockType: "services", heading: "Servicio para particulares", services: ["lavanderia-domicilio-granada"] },
    ],
  });
  for (const [slug, title] of [["aviso-legal", "Aviso legal y condiciones de uso"], ["politica-de-privacidad", "Política de privacidad"], ["politica-de-cookies", "Política de cookies"], ["declaracion-de-accesibilidad", "Declaración de accesibilidad"]] as const) {
    const html = await (await fetch(new URL(`/${slug}`, origin))).text();
    await draftPage(slug, { title, showInSitemap: false, seo: { noindex: true, noindexConfirm: true, schemaType: "WebPage" }, layout: [{ blockType: "text", content: md(htmlToMarkdown(html)) }] });
  }

  return Response.json({ ok: true, creado: log });
}
