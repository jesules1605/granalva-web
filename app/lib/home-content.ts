// Contenido de la portada. Se trasladará al global `homepage` y a las colecciones
// `team` y `reviews` de Payload (fase 4).
// Reseñas: proceden de la página pública de referencias de Granalva; no modificar
// autores ni textos sin fuente y autorización (ver CLAUDE.md).

export const loads = [
  { id: "poco", label: "Poco", detail: "Hasta 4 kg", note: "Para salir del paso", scale: 0.72 },
  { id: "diario", label: "Diario", detail: "Hasta 8 kg", note: "La colada de la semana", scale: 0.9 },
  { id: "mucho", label: "Mucho", detail: "Hasta 12 kg", note: "Hogar, sábanas y más", scale: 1.1 },
];

export const verifiedReviews: [string, string][] = [
  ["Maravilloso trabajo. Se les nota el interés y la calidad.", "Noa Merlo"],
  ["Sin duda, la mejor opción de Granada. Son detallistas.", "Pilar Gómez"],
  ["Se nota la experiencia y dedicación de cada trabajador.", "Jesús Muñoz"],
  ["Se nota que son especialistas en apartamentos turísticos.", "José García"],
];

export const videoChapters = [
  { number: "01", label: "Lavandería profesional", text: "Textiles preparados y entregas coordinadas", time: 0 },
  { number: "02", label: "Limpieza de empresas", text: "Oficinas, locales y espacios impecables", time: 5.1 },
  { number: "03", label: "Alojamientos", text: "Limpieza, lavandería y renting textil", time: 10.1 },
];

export const processSteps = [
  {
    number: "01",
    label: "Solicita",
    title: "Cuéntanos qué necesitas",
    text: "Indica el tipo de servicio, la ubicación, el volumen y la frecuencia que necesita tu empresa o tu hogar.",
    note: "Una propuesta adaptada, sin soluciones genéricas.",
    x: 9,
    y: 70,
  },
  {
    number: "02",
    label: "Recogemos",
    title: "Coordinamos la ruta",
    text: "Acordamos la recogida en la dirección y la franja que mejor encajen con tu operativa.",
    note: "Transporte y comunicación directa.",
    x: 48,
    y: 25,
  },
  {
    number: "03",
    label: "Cuidamos",
    title: "Aplicamos el proceso adecuado",
    text: "Clasificamos, limpiamos, lavamos y revisamos cada servicio con un método definido.",
    note: "Equipo propio y control de calidad.",
    x: 66,
    y: 62,
  },
  {
    number: "04",
    label: "Entregamos",
    title: "Todo vuelve preparado",
    text: "Entregamos los textiles o dejamos el espacio listo dentro de la planificación acordada.",
    note: "Continuidad para tu empresa, tiempo para ti.",
    x: 89,
    y: 25,
  },
];

export const team = [
  { initials: "MA", name: "Margarita", role: "Dirección y coordinación", text: "Organiza cada jornada y supervisa que la planificación se cumpla de principio a fin." },
  { initials: "JA", name: "Jesús", role: "Operaciones y clientes", text: "Conecta las necesidades de cada cliente con la operativa y mantiene una comunicación directa." },
  { initials: "GG", name: "Equipo Granalva", role: "Lavandería y limpieza", text: "Profesionales que convierten cada planificación en un resultado cuidado y constante." },
];

export const sectors = [
  "Apartamentos turísticos",
  "Oficinas y despachos",
  "Centros deportivos",
  "Hoteles y alojamientos",
  "Comercios y locales",
  "Comunidades",
];

export const faqs = [
  {
    question: "¿Trabajáis con empresas y apartamentos turísticos en Granada?",
    answer: "Sí. Diseñamos servicios recurrentes o puntuales para alojamientos turísticos, oficinas, locales, centros deportivos, comunidades y otros negocios de Granada y su área metropolitana.",
  },
  {
    question: "¿La lavandería incluye recogida y entrega?",
    answer: "Coordinamos la recogida y la entrega según la ubicación, el volumen y la frecuencia del cliente. Para empresas elaboramos una operativa específica que dé continuidad al servicio.",
  },
  {
    question: "¿También atendéis a particulares?",
    answer: "Sí. Ofrecemos lavandería a domicilio para particulares, con diferentes tamaños de colada y un proceso sencillo de recogida, cuidado y entrega.",
  },
  {
    question: "¿Ofrecéis renting textil para alojamientos?",
    answer: "Sí. Podemos estudiar el suministro de ropa de cama y baño junto con la lavandería para reducir inversión, almacenamiento y problemas de rotación.",
  },
  {
    question: "¿Cómo se calcula el presupuesto de limpieza?",
    answer: "Valoramos el tipo y tamaño del espacio, la frecuencia, los horarios disponibles, la ubicación y las tareas necesarias. Así proponemos un servicio ajustado a la operativa real.",
  },
];

/**
 * Selector dinámico de la portada: cuatro líneas de servicio. Cada panel se
 * renderiza en el HTML del servidor (también los no activos) y enlaza con
 * enlaces normales a las páginas indexables de su línea.
 */
export type ServiceCategory = {
  id: string;
  tab: string;
  audience: "empresas" | "particulares";
  title: string;
  description: string;
  advantages: string[];
  image: string;
  imageAlt: string;
  cta: { label: string; href: string };
  links: { label: string; href: string }[];
};

export const serviceCategories: ServiceCategory[] = [
  {
    id: "lavanderia",
    tab: "Lavandería profesional",
    audience: "empresas",
    title: "Lavandería profesional con recogida y entrega",
    description:
      "Externaliza la ropa de cama, baño y uniformidad de tu negocio. Recogemos, tratamos y entregamos los textiles preparados para volver a la operativa.",
    advantages: [
      "Rutas de recogida y entrega acordadas",
      "Desmanchado, lavado, secado, planchado y doblado",
      "Textiles organizados por tipología",
    ],
    image: "/textiles-lavanderia-profesional-granada.png",
    imageAlt: "Ropa de cama, toallas y prendas limpias y dobladas",
    cta: { label: "Contratar lavandería profesional", href: "/contacto?servicio=lavanderia-profesional-granada" },
    links: [
      { label: "Lavandería profesional para empresas", href: "/servicios/lavanderia-profesional-granada" },
      { label: "Lavandería para hoteles", href: "/servicios/lavanderia-hoteles-granada" },
      { label: "Lavandería para apartamentos turísticos", href: "/servicios/lavanderia-apartamentos-turisticos-granada" },
      { label: "Lavandería en Sierra Nevada", href: "/servicios/lavanderia-sierra-nevada" },
    ],
  },
  {
    id: "limpieza",
    tab: "Limpieza profesional",
    audience: "empresas",
    title: "Limpieza profesional para empresas y alojamientos",
    description:
      "Un servicio planificado según tus horarios, tus espacios y el nivel de exigencia de tu actividad, con un interlocutor directo.",
    advantages: [
      "Frecuencia y franjas adaptadas a la actividad",
      "Protocolo por espacio y revisión de puntos críticos",
      "Oficinas, locales, apartamentos turísticos y fin de obra",
    ],
    image: "/limpieza-profesional-alojamiento-granada.png",
    imageAlt: "Preparación de un dormitorio durante una limpieza profesional",
    cta: { label: "Contactar para limpieza", href: "/contacto?servicio=empresa-limpieza-granada" },
    links: [
      { label: "Empresa de limpieza profesional", href: "/servicios/empresa-limpieza-granada" },
      { label: "Limpieza de oficinas y locales comerciales", href: "/servicios/limpieza-oficinas-locales-granada" },
      { label: "Limpieza de apartamentos turísticos", href: "/servicios/limpieza-apartamentos-turisticos-granada" },
      { label: "Limpieza fin de obra", href: "/servicios/limpieza-fin-de-obra-granada" },
    ],
  },
  {
    id: "renting",
    tab: "Renting textil",
    audience: "empresas",
    title: "Renting textil para hoteles y apartamentos",
    description:
      "Sábanas y toallas disponibles sin comprar todo el stock, con la lavandería integrada en el mismo ciclo de uso, recogida y entrega.",
    advantages: [
      "Menos inversión inicial en textiles",
      "Rotación calculada según plazas y ocupación",
      "Condiciones de reposición definidas desde el principio",
    ],
    image: "/ropa-cama-bano-renting-textil-granada.png",
    imageAlt: "Juego de sábanas y toallas blancas preparado para un alojamiento",
    cta: { label: "Solicitar propuesta de renting", href: "/contacto?servicio=renting-textil-granada" },
    links: [{ label: "Renting textil para alojamientos y empresas", href: "/servicios/renting-textil-granada" }],
  },
  {
    id: "particulares",
    tab: "Para particulares",
    audience: "particulares",
    title: "Tu colada, recogida y entregada en casa",
    description: "Recogemos la ropa en tu puerta, la lavamos, secamos y doblamos, y te la devolvemos preparada para guardar.",
    advantages: ["Tres tamaños de referencia: 4, 8 y 12 kg", "Lavado, secado y doblado", "Recogida y entrega en Granada y área metropolitana"],
    image: "/textiles-lavanderia-profesional-granada.png",
    imageAlt: "Colada limpia, seca y doblada lista para su entrega",
    cta: { label: "Hacer un pedido particular", href: "/servicios/lavanderia-domicilio-granada#colada" },
    links: [{ label: "Lavandería a domicilio con recogida y entrega", href: "/servicios/lavanderia-domicilio-granada" }],
  },
];

/** Bloque estacional de Sierra Nevada en la portada. Solo compromisos de proceso, sin plazos ni precios. */
export const sierraNevadaBlock = {
  label: "TEMPORADA 2026/27 · SIERRA NEVADA",
  title: "¿Estás preparando la temporada en Sierra Nevada?",
  text: "Organizamos la lavandería profesional, la recogida y entrega y el suministro textil de hoteles, apartamentos turísticos y alojamientos para que cada entrada llegue a tiempo, incluso en los momentos de mayor ocupación.",
  points: [
    { title: "Previsión", text: "Planificamos volumen, stock y rutas antes de la temporada." },
    { title: "Rutas programadas", text: "Recogida y entrega acordadas con cada alojamiento." },
    { title: "Temporada alta", text: "Coordinación directa en fines de semana y puentes." },
    { title: "Sábanas y toallas", text: "Tratadas y preparadas por tipología." },
    { title: "Renting textil", text: "Refuerzo del stock cuando la ocupación lo exige." },
    { title: "Atención directa", text: "Un interlocutor de Granalva para cada cambio." },
  ],
  primary: { label: "Reservar ruta de temporada", href: "/servicios/lavanderia-sierra-nevada#reservar-ruta" },
  secondary: { label: "Conocer el servicio en Sierra Nevada", href: "/servicios/lavanderia-sierra-nevada" },
};
