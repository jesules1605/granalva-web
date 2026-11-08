// Fotografías: la de portada es propia de Granalva; el resto, provisionales con licencia
// comercial verificada (Wikimedia Commons).
// Se sustituyen desde el panel (/admin) por fotografías reales de Granalva sin tocar código.
// Las licencias CC BY / CC BY-SA exigen atribución: se muestra en el aviso legal
// («Créditos de las fotografías»). Procedencia completa: docs/FOTOGRAFIAS.md.
export type Photo = {
  src: string;
  width: number;
  height: number;
  alt: string;
  author: string;
  license: "CC BY 2.0" | "CC BY 4.0" | "CC BY-SA 4.0" | "CC0 (dominio público)" | "Propia de Granalva";
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
  "Propia de Granalva": "",
} as const;

const photo = (p: Omit<Photo, "licenseUrl">): Photo => ({ ...p, licenseUrl: CC[p.license] });

export const PHOTOS = {
  // Fotografía de portada facilitada por Granalva («Foto-portada-Granalva», 8 nov 2026).
  granalvaBedroom: photo({
    src: "/fotos/granalva-preparacion-cama-alojamiento-granada.jpg", width: 1448, height: 1086,
    alt: "Profesional de Granalva preparando la cama de un alojamiento de estilo granadino con ropa de cama blanca y colcha azul",
    author: "Limpiezas Granalva", license: "Propia de Granalva", sourceUrl: "", changes: "Recorte vertical para móvil",
  }),
  granalvaBedroomMobile: photo({
    src: "/fotos/granalva-preparacion-cama-alojamiento-granada-movil.jpg", width: 868, height: 1086,
    alt: "Profesional de Granalva preparando la cama de un alojamiento de estilo granadino con ropa de cama blanca y colcha azul",
    author: "Limpiezas Granalva", license: "Propia de Granalva", sourceUrl: "", changes: "Recorte vertical 4:5",
  }),
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
} satisfies Record<string, Photo>;

/** Dimensiones de una foto del registro por su ruta (para reservar espacio sin sobreescalar). */
export const photoSize = (src: string) => {
  const found = Object.values(PHOTOS).find((p) => p.src === src);
  return found ? { width: found.width, height: found.height } : undefined;
};
