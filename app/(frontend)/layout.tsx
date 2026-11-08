import type { Metadata, Viewport } from "next";
import { preload } from "react-dom";
import "../globals.css";
import { CookieConsent } from "../components/cookie-consent";
import { getBusinessExtras, getSiteSettings } from "../lib/cms";
import { jsonLdString, organizationJsonLd, websiteJsonLd } from "../lib/seo";
import { servicePages, SITE_URL } from "../lib/services";
import { BUSINESS, INDEXABLE } from "../lib/site";

const OG_IMAGE = {
  url: "/og-granalva-limpieza-lavanderia-granada.jpg",
  width: 1200,
  height: 630,
  alt: "Limpieza y lavandería profesional de Granalva en Granada",
};

// Valores por defecto. Cada página define su propio title, description y canonical.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: BUSINESS.name,
  title: {
    default: "Empresa de limpieza y lavandería en Granada | Granalva",
    template: "%s | Granalva",
  },
  description:
    "Empresa de limpieza y lavandería profesional en Granada para empresas, alojamientos turísticos y particulares.",
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: BUSINESS.name,
    images: [OG_IMAGE],
  },
  twitter: { card: "summary_large_image", images: [OG_IMAGE.url] },
  robots: INDEXABLE
    ? {
        index: true,
        follow: true,
        googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
      }
    : { index: false, follow: false, googleBot: { index: false, follow: false } },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg", apple: "/granalva-logo.jpg" },
  ...(process.env.GOOGLE_SITE_VERIFICATION ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } } : {}),
};

export const viewport: Viewport = {
  themeColor: "#123d92",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  // NAP y perfiles oficiales del panel (Ajustes del sitio) en los datos estructurados.
  const [settings, extras] = await Promise.all([getSiteSettings(), getBusinessExtras()]);
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [organizationJsonLd(servicePages, { sameAs: extras.sameAs, telephone: settings.phoneE164, email: settings.email }), websiteJsonLd()],
  };
  // Granaina se usa en todos los titulares: se precarga para evitar saltos de fuente.
  preload("/fonts/granaina-limpia.woff2", { as: "font", type: "font/woff2", crossOrigin: "anonymous" });

  return (
    <html lang="es">
      <body className="antialiased">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(structuredData) }} />
        {children}
        <CookieConsent gaId={process.env.NEXT_PUBLIC_GA_ID || undefined} />
      </body>
    </html>
  );
}
