import type { Metadata } from "next";
import "./globals.css";
import { SITE_URL, servicePages } from "./lib/services";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Empresa de limpieza y lavandería en Granada | Granalva",
    template: "%s | Granalva",
  },
  description:
    "Limpieza profesional y lavandería en Granada para empresas, apartamentos turísticos, oficinas y particulares. Recogida, entrega y renting textil.",
  alternates: {
    canonical: "/",
    languages: { "es-ES": "/" },
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: SITE_URL,
    siteName: "Granalva",
    title: "Limpieza y lavandería profesional en Granada | Granalva",
    description:
      "Un mismo equipo para la limpieza, la lavandería y la gestión textil de empresas, alojamientos y particulares en Granada.",
    images: [
      {
        url: "/service-cleaning.png",
        width: 1200,
        height: 630,
        alt: "Servicio profesional de limpieza y lavandería de Granalva en Granada",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Limpieza y lavandería profesional en Granada | Granalva",
    description:
      "Limpieza de empresas y alojamientos, lavandería profesional, recogida, entrega y renting textil en Granada.",
    images: ["/service-cleaning.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["Organization", "ProfessionalService"],
      "@id": `${SITE_URL}/#organization`,
      name: "Granalva",
      legalName: "Limpiezas Granalva",
      url: SITE_URL,
      logo: `${SITE_URL}/granalva-logo.jpg`,
      email: "info@limpiezasgranalva.com",
      telephone: "+34744488964",
      description:
        "Empresa granadina de limpieza profesional, lavandería, recogida y entrega, y renting textil para empresas, alojamientos y particulares.",
      areaServed: [
        { "@type": "City", name: "Granada" },
        { "@type": "AdministrativeArea", name: "Área metropolitana de Granada" },
      ],
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+34744488964",
        email: "info@limpiezasgranalva.com",
        contactType: "customer service",
        areaServed: "ES-GR",
        availableLanguage: "Spanish",
      },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Servicios de limpieza y lavandería en Granada",
        itemListElement: servicePages.map((service) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: service.navLabel,
            url: `${SITE_URL}/servicios/${service.slug}`,
            areaServed: "Granada",
          },
        })),
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "Granalva",
      inLanguage: "es-ES",
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {children}
      </body>
    </html>
  );
}
