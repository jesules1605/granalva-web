// Fotografías provisionales con licencia comercial verificada (Wikimedia Commons).
// Se sustituyen desde el panel (/admin) por fotografías reales de Granalva sin tocar código.
// Las licencias CC BY / CC BY-SA exigen atribución: se muestra en el aviso legal
// («Créditos de las fotografías»). Procedencia completa: docs/FOTOGRAFIAS.md.
export type Photo = {
  src: string;
  width: number;
  height: number;
  alt: string;
  author: string;
  license: "CC BY 2.0" | "CC BY 4.0" | "CC BY-SA 4.0" | "CC0 (dominio público)";
  licenseUrl: string;
  sourceUrl: string;
  /** Cambios respecto al original (obligatorio indicarlos en CC BY / BY-SA). */
  changes: string;
};

const CC = {
  "CC BY 2.0": "https://creativecommons.org/licenses/by/2.0/deed.es",
  "CC BY 4.0": "https://creativecommons.org/licenses/by/4.0/deed.es",
  "CC BY-SA 4.0": "https://creativecommons.org/licenses/by-sa/4.0/deed.es",
  "CC0 (dominio público)": "https://creativecommons.org/publicdomain/zero/1.0/deed.es",
} as const;

const photo = (p: Omit<Photo, "licenseUrl">): Photo => ({ ...p, licenseUrl: CC[p.license] });

export const PHOTOS = {
  hotelRoom: photo({
    src: "/fotos/habitacion-hotel-ropa-cama-blanca.jpg", width: 1920, height: 1277,
    alt: "Habitación de hotel con la cama hecha, ropa de cama blanca y toallas preparadas",
    author: "PattayaPatrol", license: "CC BY-SA 4.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:DZ6_0461_Cozy_neatly_made_hotel_room_with_a_king_bed_soft_pillows_bedside_lamps_and_calming_neutral_decor.jpg",
    changes: "Redimensionada; recorte vertical para móvil",
  }),
  hotelRoomMobile: photo({
    src: "/fotos/habitacion-hotel-ropa-cama-blanca-movil.jpg", width: 1021, height: 1277,
    alt: "Habitación de hotel con la cama hecha, ropa de cama blanca y toallas preparadas",
    author: "PattayaPatrol", license: "CC BY-SA 4.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:DZ6_0461_Cozy_neatly_made_hotel_room_with_a_king_bed_soft_pillows_bedside_lamps_and_calming_neutral_decor.jpg",
    changes: "Recorte vertical 4:5",
  }),
  sierraNevada: photo({
    src: "/fotos/sierra-nevada-pradollano-alojamiento-nieve.jpg", width: 1920, height: 1280,
    alt: "Alojamiento en la plaza de Pradollano, en Sierra Nevada, con la nieve recién caída",
    author: "Werner Wilmes", license: "CC BY 2.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Edificio_-_Pradollano.jpg",
    changes: "Redimensionada",
  }),
  apartment: photo({
    src: "/fotos/apartamento-turistico-dormitorio-toallas.jpg", width: 1920, height: 1080,
    alt: "Dormitorio de un apartamento turístico preparado para la llegada de huéspedes, con toallas sobre la cama",
    author: "MatthewHoobin", license: "CC0 (dominio público)",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Hotel_room_bedroom_in_building_on_Chapel_Street,_Salford,_Greater_Manchester,_England,_on_5_October_2025.jpg",
    changes: "Redimensionada",
  }),
  bedLinen: photo({
    src: "/fotos/ropa-de-cama-blanca-alojamiento.jpg", width: 1920, height: 1440,
    alt: "Ropa de cama blanca de un alojamiento, con funda nórdica y almohada",
    author: "Thirunavukkarasye-Raveendran", license: "CC BY-SA 4.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Bettbezug_Paris_Hotel_2013_PD-2.jpg",
    changes: "Redimensionada",
  }),
  office: photo({
    src: "/fotos/oficina-vacia-limpia.jpg", width: 1920, height: 1440,
    alt: "Oficina diáfana y limpia, con suelo de moqueta y ventanales",
    author: "Np6824", license: "CC BY-SA 4.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Empty_room_of_office.jpg",
    changes: "Redimensionada",
  }),
  renovation: photo({
    src: "/fotos/sala-reformada-fin-de-obra.jpg", width: 1920, height: 1280,
    alt: "Sala recién reformada y vacía, con suelo de madera y vigas, lista tras la obra",
    author: "Dietmar Rabich", license: "CC BY-SA 4.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:D%C3%BClmen,_Alte_Brennerei_L%C3%B6hning_--_2015_--_8609-13.jpg",
    changes: "Redimensionada",
  }),
  industrialLaundry: photo({
    src: "/fotos/lavanderia-industrial-plegadora.jpg", width: 1010, height: 853,
    alt: "Máquinas de lavandería industrial para el plegado de ropa de cama",
    author: "Larry D. Moore", license: "CC BY 4.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Laundry_1_Harmony_of_the_Seas_2026.jpg",
    changes: "Recortada (sin personas) y redimensionada",
  }),
} satisfies Record<string, Photo>;
