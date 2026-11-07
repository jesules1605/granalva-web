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
  "APARTAMENTOS TURÍSTICOS",
  "OFICINAS Y DESPACHOS",
  "CENTROS DEPORTIVOS",
  "HOTELES Y ALOJAMIENTOS",
  "COMERCIOS Y LOCALES",
  "COMUNIDADES",
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
