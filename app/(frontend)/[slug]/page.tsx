import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { CmsPage, cmsPageMetadata } from "../../components/cms-page";
import { getPage, getPublishedPages } from "../../lib/cms";

// Páginas nuevas creadas en el panel (p. ej. /empresas o /particulares). Las rutas
// propias de la web (servicios, contacto, sobre-nosotros, referencias, legales…)
// tienen su carpeta y se sustituyen desde ella cuando existe una página publicada.
type PageProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getPublishedPages()).map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const page = await getPage((await params).slug, (await draftMode()).isEnabled);
  return page ? cmsPageMetadata(page) : {};
}

export default async function PanelPage({ params }: PageProps) {
  const page = await getPage((await params).slug, (await draftMode()).isEnabled);
  if (!page) notFound();
  return <CmsPage page={page} />;
}
