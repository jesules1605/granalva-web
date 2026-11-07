// Fuente única del contenido de las nueve páginas de servicio.
// Cada campo de este modelo se trasladará a la colección `services` de Payload
// (fase 4) con el mismo nombre, para que el propietario pueda editarlo en /admin.
// Mapa de intenciones y palabras clave: docs/seo-strategy.md.

/** Dominio canónico, sin barra final. Se define por entorno con NEXT_PUBLIC_SITE_URL. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://limpiezasgranalva.com").replace(/\/+$/, "");

/** Imágenes de servicio. Pendiente de sustituir por fotografías reales de Granalva. */
export const IMAGES = {
  laundry: "/textiles-lavanderia-profesional-granada.png",
  cleaning: "/limpieza-profesional-alojamiento-granada.png",
  renting: "/ropa-cama-bano-renting-textil-granada.png",
} as const;

export type ServicePage = {
  slug: string;
  /** Etiqueta corta para menús, breadcrumbs y tarjetas. */
  navLabel: string;
  /** H1 único de la página. */
  h1: string;
  eyebrow: string;
  /** Title SEO (≈ 50-65 caracteres). */
  metaTitle: string;
  /** Meta description (≈ 120-160 caracteres). */
  metaDescription: string;
  /** Intención de búsqueda principal que atiende la página (uso interno). */
  intent: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  summary: string;
  image: string;
  imageAlt: string;
  /** H2 de la introducción: contiene la palabra principal de forma natural. */
  introTitle: string;
  intro: string[];
  promise: string;
  /** Necesidades que resuelve el servicio. */
  needsTitle: string;
  needs: { title: string; text: string }[];
  includes: { title: string; text: string }[];
  process: { title: string; text: string }[];
  audiences: string[];
  /** Cobertura geográfica real. No añadir zonas sin confirmación del propietario. */
  coverage: string;
  /** Área de servicio específica para datos estructurados (por defecto, la de la empresa). */
  areaServed?: { "@type": string; name: string }[];
  faqs: { question: string; answer: string }[];
  /** Entre dos y cuatro servicios relacionados con texto de enlace descriptivo. */
  related: { slug: string; anchor: string }[];
  /** Texto del CTA principal, adaptado a la intención (B2B o particular). */
  ctaLabel: string;
  ctaTitle: string;
  ctaText: string;
  /** Secciones específicas de la página (p. ej. temporada, rutas, textiles). */
  extraSections?: { id: string; eyebrow: string; title: string; intro?: string; items: { title: string; text: string }[] }[];
  /** Variante de formulario incrustado en la propia página (ancla #reservar-ruta). */
  embeddedForm?: "sierra-nevada";
  /** Muestra el selector de tamaño de colada (ancla #colada). */
  showLoadPicker?: boolean;
  /** Plantilla compacta: presentación, beneficios, funcionamiento, detalle en acordeones, relacionados y formulario. */
  layout?: "compact";
  /** Frase editorial secundaria (no sustituye al H1). */
  tagline?: string;
  /** Tres beneficios breves y escaneables (plantilla compacta). */
  highlights?: { title: string; text: string }[];
  /** Fecha de la última revisión del contenido (ISO 8601). */
  updatedAt: string;
};

const CONTENT_REVIEWED = "2026-11-07";
const STANDARD_COVERAGE =
  "Trabajamos en Granada capital y en el área metropolitana con rutas acordadas. Para otras ubicaciones de la provincia valoramos el volumen, la frecuencia y la viabilidad logística antes de confirmar el servicio.";

export const servicePages: ServicePage[] = [
  {
    slug: "empresa-limpieza-granada",
    navLabel: "Empresa de limpieza",
    h1: "Empresa de limpieza profesional en Granada",
    eyebrow: "LIMPIEZA PROFESIONAL · GRANADA",
    metaTitle: "Empresa de limpieza profesional en Granada | Granalva",
    metaDescription:
      "Empresa de limpieza en Granada para negocios, oficinas, locales y alojamientos. Servicios de limpieza profesional con equipo propio y presupuesto a medida.",
    intent: "Contratar una empresa de limpieza profesional en Granada para un negocio o espacio profesional.",
    primaryKeyword: "empresa de limpieza Granada",
    secondaryKeywords: ["limpieza Granada", "limpieza profesional Granada", "servicios de limpieza Granada"],
    summary: "Un servicio de limpieza profesional organizado alrededor de tus horarios, tus espacios y el nivel de exigencia de tu actividad.",
    image: IMAGES.cleaning,
    imageAlt: "Preparación de un dormitorio durante una limpieza profesional de alojamiento",
    introTitle: "Una empresa de limpieza en Granada que se integra en tu operativa",
    intro: [
      "Una empresa necesita continuidad, discreción y una planificación que se cumpla. En Granalva estudiamos el espacio, la frecuencia, los horarios disponibles y las tareas críticas antes de definir el servicio.",
      "Coordinamos al equipo y mantenemos una comunicación directa para que la limpieza no dependa de soluciones improvisadas. El objetivo es sencillo: que cada jornada comience con el espacio preparado.",
      "Nuestros servicios de limpieza en Granada abarcan mantenimiento periódico, limpiezas puntuales y profundas, apartamentos turísticos, oficinas, locales comerciales y espacios después de obras. Si tu negocio también necesita lavandería o renting textil, lo coordinamos dentro de la misma operativa.",
    ],
    promise: "Una propuesta ajustada al servicio real, no una tarifa genérica desconectada de tu negocio.",
    needsTitle: "Qué resuelve una limpieza profesional bien planificada",
    needs: [
      { title: "Proveedores dispersos", text: "Un único interlocutor para limpieza, lavandería y textiles evita coordinar varias empresas a la vez." },
      { title: "Limpieza que interrumpe", text: "Organizamos el servicio en las franjas que menos afectan a tu equipo y a tus clientes." },
      { title: "Calidad irregular", text: "Las tareas y los puntos críticos quedan definidos y se revisan, en lugar de depender de cada jornada." },
    ],
    includes: [
      { title: "Planificación", text: "Frecuencias, franjas horarias y tareas definidas según la actividad del espacio." },
      { title: "Equipo coordinado", text: "Profesionales organizados por Granalva y un interlocutor directo para el seguimiento." },
      { title: "Productos y medios", text: "Valoramos los materiales, equipos y procedimientos adecuados para cada superficie." },
      { title: "Revisión", text: "Control de los puntos importantes y adaptación cuando cambia la operativa del cliente." },
    ],
    process: [
      { title: "Visitamos o analizamos", text: "Conocemos el espacio, la actividad, los accesos y las prioridades." },
      { title: "Diseñamos el servicio", text: "Definimos tareas, frecuencia, horarios y recursos necesarios." },
      { title: "Coordinamos el equipo", text: "Organizamos la ejecución para interferir lo mínimo en tu actividad." },
      { title: "Revisamos y ajustamos", text: "Seguimos el servicio y adaptamos la planificación cuando sea necesario." },
    ],
    audiences: ["Oficinas y despachos", "Comercios y locales", "Centros deportivos", "Comunidades", "Alojamientos", "Espacios profesionales"],
    coverage: STANDARD_COVERAGE,
    faqs: [
      { question: "¿Cómo se calcula un presupuesto de limpieza para empresas?", answer: "Valoramos superficie, tipo de actividad, frecuencia, horario, ubicación, accesos y tareas necesarias. Con esa información preparamos una propuesta adaptada." },
      { question: "¿Podéis trabajar fuera del horario comercial?", answer: "Estudiamos las horas libres y la operativa de cada centro para proponer franjas que reduzcan las interferencias con clientes y trabajadores." },
      { question: "¿Trabajáis con varios centros de una misma empresa?", answer: "Sí. Podemos estudiar ubicaciones, tiempos de desplazamiento y frecuencia de cada centro para coordinar una operativa conjunta." },
      { question: "¿La limpieza puede ser periódica o puntual?", answer: "Preparamos servicios recurrentes y también limpiezas puntuales, profundas o asociadas a una necesidad concreta." },
    ],
    related: [
      { slug: "limpieza-oficinas-locales-granada", anchor: "limpieza de oficinas y locales comerciales" },
      { slug: "limpieza-apartamentos-turisticos-granada", anchor: "limpieza de apartamentos turísticos" },
      { slug: "limpieza-fin-de-obra-granada", anchor: "limpieza fin de obra en Granada" },
      { slug: "lavanderia-profesional-granada", anchor: "lavandería profesional para empresas" },
    ],
    ctaLabel: "Solicitar presupuesto empresarial",
    ctaTitle: "Cuéntanos qué necesita tu empresa.",
    ctaText: "Estudiaremos el espacio, la frecuencia y los horarios para preparar una propuesta de limpieza clara y ajustada.",
    updatedAt: CONTENT_REVIEWED,
  },
  {
    slug: "lavanderia-profesional-granada",
    navLabel: "Lavandería profesional",
    h1: "Lavandería profesional para empresas en Granada",
    eyebrow: "LAVANDERÍA PARA EMPRESAS",
    metaTitle: "Lavandería profesional en Granada para empresas | Granalva",
    metaDescription:
      "Lavandería en Granada para empresas y alojamientos: desmanchado, lavado, secado, planchado y doblado, con recogida y entrega coordinadas. Pide propuesta.",
    intent: "Externalizar la lavandería de un negocio en Granada con un servicio profesional.",
    primaryKeyword: "lavandería Granada",
    secondaryKeywords: ["lavandería profesional Granada", "lavandería para empresas Granada", "lavandería con recogida y entrega Granada"],
    summary: "Externaliza el cuidado de tus textiles con una ruta coordinada, un proceso completo y atención directa.",
    image: IMAGES.laundry,
    imageAlt: "Ropa de cama, toallas y prendas limpias, dobladas y apiladas tras el servicio de lavandería",
    introTitle: "Lavandería profesional en Granada: tus textiles listos cuando los necesitas",
    intro: [
      "La lavandería profesional no consiste solo en lavar. Requiere coordinar volúmenes, recogidas, entregas y acabados para que la ropa vuelva lista para entrar de nuevo en servicio.",
      "Granalva estudia el tipo de textil, la frecuencia y la operativa del cliente. Nuestro servicio puede incluir desmanchado previo, lavado, secado, planchado, doblado y transporte acordado.",
      "Somos una lavandería para empresas en Granada con recogida y entrega: organizamos una ruta compatible con tu actividad para que no tengas que desplazarte ni dedicar personal a llevar y recoger la ropa.",
    ],
    promise: "Una ruta de lavandería pensada para dar continuidad a tu empresa, no para añadir otra preocupación.",
    needsTitle: "Qué resuelve externalizar la lavandería",
    needs: [
      { title: "Falta de espacio y maquinaria", text: "No necesitas reservar espacio, equipos ni personal para lavar, secar y planchar dentro del negocio." },
      { title: "Desplazamientos", text: "La recogida y la entrega se integran en una ruta acordada, sin viajes a la lavandería." },
      { title: "Acabados irregulares", text: "Cada tipo de textil sigue el proceso acordado y se revisa antes de volver a tu operativa." },
    ],
    includes: [
      { title: "Recogida coordinada", text: "Acordamos ubicación, días y franjas en función del volumen y la ruta." },
      { title: "Proceso completo", text: "Desmanchado, lavado, secado, planchado y doblado según el servicio contratado." },
      { title: "Preparación", text: "Los textiles se organizan para facilitar su recepción y su vuelta a la operativa." },
      { title: "Entrega", text: "Devolución planificada con comunicación directa ante cualquier incidencia." },
    ],
    process: [
      { title: "Medimos el volumen", text: "Conocemos kilos aproximados, tipos de prenda y frecuencia semanal." },
      { title: "Fijamos la ruta", text: "Organizamos recogidas y entregas compatibles con tu actividad." },
      { title: "Tratamos los textiles", text: "Aplicamos el proceso acordado y revisamos el resultado." },
      { title: "Entregamos preparado", text: "La ropa vuelve doblada y organizada para volver a utilizarse." },
    ],
    audiences: ["Hoteles", "Apartamentos turísticos", "Residencias", "Centros deportivos", "Salones y clínicas", "Empresas con uniformidad"],
    coverage: STANDARD_COVERAGE,
    faqs: [
      { question: "¿La lavandería incluye transporte?", answer: "Podemos incluir recogida y entrega dentro de una ruta acordada. La ubicación, frecuencia y volumen se estudian en cada propuesta." },
      { question: "¿Qué tipos de textiles gestionáis?", answer: "Estudiamos ropa de cama y baño, uniformidad, toallas y otros textiles profesionales según composición, estado y necesidades de acabado." },
      { question: "¿Existe un volumen mínimo?", answer: "Necesitamos conocer el volumen y la frecuencia para valorar la viabilidad de la ruta. Preparamos cada propuesta según la operativa real." },
      { question: "¿Podemos hacer una prueba de servicio?", answer: "Cuando la operativa lo permite, podemos valorar una prueba para comprobar acabados, tiempos y coordinación antes de consolidar la ruta." },
    ],
    related: [
      { slug: "lavanderia-hoteles-granada", anchor: "lavandería para hoteles en Granada" },
      { slug: "lavanderia-apartamentos-turisticos-granada", anchor: "lavandería para apartamentos turísticos" },
      { slug: "renting-textil-granada", anchor: "renting textil para alojamientos" },
    ],
    ctaLabel: "Planificar recogidas y entregas",
    ctaTitle: "Cuéntanos el volumen y la frecuencia de tu lavandería.",
    ctaText: "Con los kilos aproximados, los tipos de textil y la ubicación preparamos una ruta y una propuesta adaptadas.",
    updatedAt: CONTENT_REVIEWED,
  },
  {
    slug: "lavanderia-hoteles-granada",
    navLabel: "Lavandería para hoteles",
    h1: "Lavandería para hoteles y alojamientos en Granada",
    eyebrow: "HOSTELERÍA · ROPA DE CAMA Y BAÑO",
    metaTitle: "Lavandería para hoteles en Granada | Granalva",
    metaDescription:
      "Lavandería para hoteles en Granada: lavado de sábanas y toallas, recogida y entrega de ropa hotelera coordinada con la ocupación y renting textil opcional.",
    intent: "Externalizar el lavado de la ropa de un hotel o alojamiento en Granada.",
    primaryKeyword: "lavandería para hoteles Granada",
    secondaryKeywords: ["lavado de ropa de hotel", "lavandería hostelería Granada", "recogida y entrega de ropa hotelera"],
    summary: "Una operativa textil estable para habitaciones que deben estar listas, incluso en semanas de máxima ocupación.",
    image: IMAGES.renting,
    imageAlt: "Sábanas y toallas blancas dobladas junto a una bolsa de lavandería",
    introTitle: "Lavandería para hoteles en Granada pensada para la ocupación real",
    intro: [
      "En un hotel o alojamiento, una entrega tardía afecta directamente a la preparación de habitaciones. Por eso planteamos la lavandería como una parte de la operativa, no como un servicio aislado.",
      "Estudiamos ocupación, rotación, stock disponible, volumen semanal y puntos de recogida para definir una ruta que ayude a mantener la continuidad del establecimiento.",
      "El lavado de ropa de hotel exige separar categorías, mantener los acabados y respetar plazos. Organizamos la recogida y entrega de ropa hotelera por tipología para que el equipo de pisos la reciba preparada para su distribución.",
    ],
    promise: "Ropa de cama y baño preparada para que el equipo pueda concentrarse en recibir al huésped.",
    needsTitle: "Qué resuelve una lavandería coordinada con el hotel",
    needs: [
      { title: "Picos de ocupación", text: "La frecuencia de recogidas se ajusta a la temporada y a los fines de semana de mayor actividad." },
      { title: "Stock insuficiente", text: "Calculamos la rotación necesaria y, si hace falta, estudiamos renting textil para reforzar el stock." },
      { title: "Tiempo del equipo de pisos", text: "Los textiles llegan clasificados y doblados, listos para almacenarse y subir a planta." },
    ],
    includes: [
      { title: "Plan de recogidas", text: "Frecuencia adaptada al volumen, temporada y capacidad de almacenamiento." },
      { title: "Ropa de cama", text: "Lavado, secado, acabado y doblado de sábanas, fundas y otros textiles." },
      { title: "Ropa de baño", text: "Gestión de toallas y textiles de uso recurrente en el alojamiento." },
      { title: "Renting opcional", text: "Posibilidad de estudiar suministro textil para reforzar o externalizar el stock." },
    ],
    process: [
      { title: "Analizamos ocupación", text: "Revisamos plazas, rotación, picos de demanda y stock actual." },
      { title: "Diseñamos la frecuencia", text: "Acordamos recogidas y entregas según la operativa del alojamiento." },
      { title: "Procesamos por tipología", text: "Organizamos ropa de cama y baño para mantener orden y trazabilidad operativa." },
      { title: "Entregamos para planta", text: "Preparamos los textiles para facilitar su almacenamiento y distribución." },
    ],
    audiences: ["Hoteles urbanos", "Alojamientos rurales", "Hostales", "Apartahoteles", "Residencias", "Complejos turísticos"],
    coverage: STANDARD_COVERAGE,
    faqs: [
      { question: "¿Podéis adaptar la frecuencia a la temporada alta?", answer: "Sí. La propuesta parte del volumen y de la estacionalidad; revisamos con el alojamiento las necesidades de los periodos de mayor ocupación." },
      { question: "¿Gestionáis sábanas y toallas?", answer: "Son las categorías principales del servicio hotelero. Confirmamos formatos, composición, acabados y cantidades antes de iniciar la operativa." },
      { question: "¿Ofrecéis renting textil para hoteles?", answer: "Podemos estudiar un modelo de renting de ropa de cama y baño vinculado a la lavandería y a la rotación necesaria." },
      { question: "¿Trabajáis fuera de Granada capital?", answer: "Trabajamos Granada y rutas acordadas en el área metropolitana. Para otras ubicaciones valoramos volumen, frecuencia y viabilidad logística." },
    ],
    related: [
      { slug: "renting-textil-granada", anchor: "renting textil para hoteles y apartamentos" },
      { slug: "lavanderia-profesional-granada", anchor: "lavandería profesional en Granada" },
      { slug: "lavanderia-apartamentos-turisticos-granada", anchor: "lavandería para apartamentos turísticos" },
      { slug: "lavanderia-sierra-nevada", anchor: "lavandería para hoteles en Sierra Nevada" },
    ],
    ctaLabel: "Planificar recogidas y entregas",
    ctaTitle: "Planifiquemos la lavandería de tu alojamiento.",
    ctaText: "Indícanos plazas, ocupación aproximada y stock actual para dimensionar las recogidas y entregas.",
    updatedAt: CONTENT_REVIEWED,
  },
  {
    slug: "lavanderia-apartamentos-turisticos-granada",
    navLabel: "Lavandería para apartamentos",
    h1: "Lavandería para apartamentos turísticos en Granada",
    eyebrow: "GESTORES Y ALOJAMIENTOS TURÍSTICOS",
    metaTitle: "Lavandería para apartamentos turísticos en Granada | Granalva",
    metaDescription:
      "Lavandería para apartamentos turísticos en Granada: recogida, lavado de sábanas y toallas y entrega coordinada con la rotación de huéspedes.",
    intent: "Resolver el lavado de sábanas y toallas de uno o varios apartamentos turísticos en Granada.",
    primaryKeyword: "lavandería apartamentos turísticos Granada",
    secondaryKeywords: ["lavado de sábanas y toallas", "lavandería para apartamentos", "recogida y entrega"],
    summary: "Textiles limpios y preparados para acompañar el ritmo real de entradas, salidas y cambios de última hora.",
    image: IMAGES.laundry,
    imageAlt: "Sábanas y toallas limpias y dobladas para la rotación de un apartamento turístico",
    introTitle: "Una lavandería para apartamentos turísticos que entiende una entrada de huéspedes",
    intro: [
      "Los apartamentos turísticos no funcionan con una semana idéntica a la anterior. Cambian las ocupaciones, los horarios de salida y el número de juegos textiles que entran en rotación.",
      "Granalva combina experiencia en limpieza turística y lavandería para coordinar recogidas, entregas y preparación de ropa de cama y baño con las necesidades del gestor.",
      "El lavado de sábanas y toallas se organiza por juegos, con recogida y entrega en cada apartamento o en un punto centralizado, para que la ropa limpia esté disponible antes de la siguiente entrada.",
    ],
    promise: "Menos tiempo persiguiendo textiles y más control sobre la preparación de cada alojamiento.",
    needsTitle: "Qué resuelve una lavandería coordinada con las reservas",
    needs: [
      { title: "Juegos que no llegan a tiempo", text: "La ruta se diseña a partir de las entradas y salidas, no de un calendario fijo." },
      { title: "Varias ubicaciones", text: "Agrupamos recogidas por zonas o en un punto centralizado para simplificar la logística del gestor." },
      { title: "Dos proveedores sin coordinar", text: "Lavandería y limpieza pueden contratarse juntas y organizarse con una sola planificación." },
    ],
    includes: [
      { title: "Recogida por ruta", text: "Puntos y horarios acordados con el gestor o el equipo de limpieza." },
      { title: "Sábanas y fundas", text: "Proceso profesional y doblado para facilitar la preparación de camas." },
      { title: "Toallas", text: "Clasificación y preparación de textiles de baño para cada rotación." },
      { title: "Coordinación", text: "Comunicación directa para alinear lavandería, limpieza y entradas." },
    ],
    process: [
      { title: "Conocemos la cartera", text: "Revisamos número de alojamientos, plazas, ubicación y rotación." },
      { title: "Definimos puntos", text: "Acordamos recogidas por apartamento, almacén o punto centralizado." },
      { title: "Cuidamos y organizamos", text: "Procesamos la ropa y la preparamos para una recepción ordenada." },
      { title: "Ajustamos la ruta", text: "Revisamos la frecuencia cuando cambia el volumen o la temporada." },
    ],
    audiences: ["Gestores de apartamentos", "Propietarios profesionales", "Empresas de gestión vacacional", "Apartahoteles", "Viviendas turísticas", "Alojamientos rurales"],
    coverage: STANDARD_COVERAGE,
    faqs: [
      { question: "¿Recogéis directamente en los apartamentos?", answer: "Podemos estudiar recogida por ubicaciones o un punto centralizado. La opción adecuada depende de la dispersión, el volumen y la frecuencia." },
      { question: "¿Podéis coordinar lavandería y limpieza?", answer: "Sí. Granalva presta ambos servicios y puede estudiar una operativa conjunta para simplificar la preparación de los alojamientos." },
      { question: "¿Cómo se calcula el volumen?", answer: "Partimos del número de camas, juegos por alojamiento, ocupación estimada y rotación semanal. Una prueba o histórico ayuda a ajustar la propuesta." },
      { question: "¿Tenéis renting de sábanas y toallas?", answer: "Podemos valorar renting textil para reducir inversión y reforzar la disponibilidad de juegos en rotación." },
    ],
    related: [
      { slug: "limpieza-apartamentos-turisticos-granada", anchor: "limpieza de apartamentos turísticos en Granada" },
      { slug: "renting-textil-granada", anchor: "alquiler de sábanas y toallas (renting textil)" },
      { slug: "lavanderia-hoteles-granada", anchor: "lavandería para hoteles y alojamientos" },
      { slug: "lavanderia-sierra-nevada", anchor: "lavandería para apartamentos en Sierra Nevada" },
    ],
    ctaLabel: "Planificar recogidas y entregas",
    ctaTitle: "Organicemos la lavandería de tus apartamentos.",
    ctaText: "Cuéntanos cuántos alojamientos gestionas, sus plazas y dónde están para proponer una ruta de recogida y entrega.",
    updatedAt: CONTENT_REVIEWED,
  },
  {
    slug: "lavanderia-sierra-nevada",
    navLabel: "Lavandería en Sierra Nevada",
    h1: "Lavandería profesional en Sierra Nevada para hoteles y apartamentos",
    eyebrow: "SERVICIO DE TEMPORADA · SIERRA NEVADA",
    metaTitle: "Lavandería en Sierra Nevada para hoteles y apartamentos | Granalva",
    metaDescription:
      "Lavandería profesional para hoteles, apartamentos turísticos y alojamientos de Sierra Nevada. Recogida, entrega, cuidado textil y rutas adaptadas a la temporada.",
    intent: "Contratar lavandería con recogida y entrega para un alojamiento de Sierra Nevada, sobre todo en temporada de esquí.",
    primaryKeyword: "lavandería Sierra Nevada",
    secondaryKeywords: [
      "lavandería profesional Sierra Nevada",
      "lavandería para hoteles Sierra Nevada",
      "lavandería apartamentos turísticos Sierra Nevada",
      "recogida y entrega lavandería Sierra Nevada",
      "renting textil Sierra Nevada",
      "lavado de sábanas y toallas Sierra Nevada",
    ],
    summary:
      "Coordinamos la recogida, el cuidado y la entrega de sábanas y toallas para hoteles, apartamentos turísticos y alojamientos de Sierra Nevada. Planificamos las rutas según la ocupación para que cada entrada tenga el textil preparado a tiempo.",
    image: IMAGES.renting,
    imageAlt: "Sábanas y toallas blancas preparadas para un alojamiento de temporada",
    introTitle: "Lavandería en Sierra Nevada: la temporada se prepara antes de que empiece",
    intro: [
      "En la estación, la ocupación cambia con la nieve, los puentes y los fines de semana. Un alojamiento puede pasar de una semana tranquila a cambiar todas sus camas en un mismo día, y la ropa limpia tiene que estar arriba antes de la siguiente entrada.",
      "Granalva organiza la lavandería profesional de alojamientos de Sierra Nevada desde Granada: planificamos con antelación el volumen previsto, acordamos rutas de recogida y entrega y preparamos sábanas y toallas por tipología para que el equipo del alojamiento solo tenga que colocarlas.",
      "Cuando el stock propio no alcanza para los picos de ocupación, estudiamos el renting textil como refuerzo, integrado en la misma ruta de lavandería.",
    ],
    promise: "Previsión antes de la temporada y coordinación directa durante ella.",
    needsTitle: "Lo que exige la temporada en Sierra Nevada",
    needs: [
      { title: "Picos de ocupación", text: "Fines de semana, puentes y festivos concentran muchas entradas y salidas en pocas horas." },
      { title: "Logística de montaña", text: "La distancia, la meteorología y los accesos obligan a planificar las rutas con antelación." },
      { title: "Espacio limitado", text: "Muchos alojamientos tienen poco espacio para almacenar ropa limpia y sucia entre una entrega y la siguiente." },
    ],
    includes: [
      { title: "Recogida y entrega", text: "Rutas programadas entre Granada y el alojamiento, acordadas según volumen y temporada." },
      { title: "Lavado y acabado", text: "Desmanchado, lavado, secado, planchado y doblado según el servicio contratado." },
      { title: "Preparación por tipología", text: "Ropa de cama y baño organizada para facilitar su almacenamiento y distribución." },
      { title: "Renting textil opcional", text: "Refuerzo del stock de sábanas y toallas para los periodos de mayor ocupación." },
    ],
    process: [
      { title: "Previsión de temporada", text: "Revisamos plazas, ocupación esperada, stock y espacio de almacenamiento antes de empezar." },
      { title: "Ruta acordada", text: "Fijamos puntos, días y franjas de recogida y entrega compatibles con las entradas del alojamiento." },
      { title: "Tratamiento textil", text: "Procesamos la ropa en Granada y revisamos el resultado antes de preparar la entrega." },
      { title: "Entrega y ajuste", text: "Entregamos preparado y revisamos la planificación cuando cambia la ocupación." },
    ],
    audiences: ["Hoteles de montaña", "Apartamentos turísticos", "Gestores de varias unidades", "Apartahoteles", "Albergues y hostales", "Alojamientos de temporada"],
    coverage:
      "Atendemos alojamientos de Sierra Nevada mediante rutas programadas desde Granada. Al preparar la propuesta confirmamos la viabilidad de cada ubicación, los días de recogida y entrega y la frecuencia, según el volumen y la temporada.",
    areaServed: [{ "@type": "Place", name: "Sierra Nevada (Granada)" }],
    faqs: [
      { question: "¿Recogéis la ropa directamente en el alojamiento de Sierra Nevada?", answer: "Sí, organizamos la recogida y la entrega mediante rutas acordadas. Confirmamos la ubicación, los puntos de recogida y los días al preparar la propuesta." },
      { question: "¿Con cuánta antelación conviene organizar la temporada?", answer: "Cuanto antes conozcamos plazas, ocupación prevista y stock, mejor podremos dimensionar rutas y textiles. Lo ideal es hablarlo antes del inicio de la temporada." },
      { question: "¿Qué pasa en los fines de semana y puentes de máxima ocupación?", answer: "La planificación tiene en cuenta los picos previstos. Si cambian las reservas, coordinamos con el alojamiento los ajustes posibles en la ruta." },
      { question: "¿Podéis suministrar sábanas y toallas además de lavarlas?", answer: "Podemos estudiar renting textil vinculado a la lavandería para reforzar el stock durante la temporada." },
      { question: "¿Trabajáis también fuera de la temporada de esquí?", answer: "La página y el servicio se mantienen todo el año. Fuera de temporada adaptamos rutas y frecuencia al volumen real de cada alojamiento." },
    ],
    related: [
      { slug: "lavanderia-hoteles-granada", anchor: "lavandería para hoteles y alojamientos" },
      { slug: "lavanderia-apartamentos-turisticos-granada", anchor: "lavandería para apartamentos turísticos" },
      { slug: "renting-textil-granada", anchor: "renting textil para la temporada" },
    ],
    ctaLabel: "Preparar mi temporada",
    ctaTitle: "Reserva tu ruta para la temporada 2026/27.",
    ctaText: "Cuéntanos qué alojamiento gestionas, cuántas plazas tiene y cuándo empiezas. Te proponemos una ruta de recogida y entrega.",
    extraSections: [
      {
        id: "hoteles",
        eyebrow: "HOTELES Y ALOJAMIENTOS",
        title: "Lavandería para hoteles en Sierra Nevada",
        intro: "En un hotel de montaña, la ropa de cama y baño condiciona la preparación de habitaciones en los días de más entradas.",
        items: [
          { title: "Volumen por temporada", text: "Partimos de las plazas y de la ocupación prevista para estimar el volumen semanal." },
          { title: "Entregas para planta", text: "Textiles clasificados y doblados para que pasen directamente al almacén o a las plantas." },
          { title: "Coordinación con gobernanta", text: "Un interlocutor directo para cambios de última hora y picos de ocupación." },
        ],
      },
      {
        id: "apartamentos",
        eyebrow: "APARTAMENTOS TURÍSTICOS Y GESTORES",
        title: "Lavandería para apartamentos turísticos en Sierra Nevada",
        intro: "Los gestores con varias unidades necesitan juegos completos disponibles entre una salida y la siguiente entrada.",
        items: [
          { title: "Juegos por apartamento", text: "Organizamos la ropa por juegos para simplificar la preparación de cada unidad." },
          { title: "Puntos de recogida", text: "Recogida por apartamento o en un punto centralizado, según la dispersión de la cartera." },
          { title: "Rotación de temporada", text: "Calculamos los juegos necesarios para cubrir la rotación sin acumular textiles." },
        ],
      },
      {
        id: "rutas",
        eyebrow: "RUTAS Y COORDINACIÓN",
        title: "Rutas de recogida y entrega programadas",
        items: [
          { title: "Planificación previa", text: "Acordamos la ruta antes de la temporada, con margen para los fines de semana de más actividad." },
          { title: "Comunicación directa", text: "Un canal directo con el equipo de Granalva para confirmar recogidas, entregas y cambios." },
          { title: "Ajuste con la ocupación", text: "Revisamos la frecuencia cuando cambian las reservas o la temporada." },
        ],
      },
      {
        id: "textiles",
        eyebrow: "TIPOS DE TEXTILES",
        title: "Sábanas, toallas y textiles de alojamiento",
        items: [
          { title: "Ropa de cama", text: "Sábanas, fundas y otras piezas de cama según el formato de cada alojamiento." },
          { title: "Ropa de baño", text: "Toallas y textiles de baño de uso recurrente." },
          { title: "Otros textiles", text: "Consúltanos otros textiles del alojamiento para confirmar su tratamiento." },
        ],
      },
      {
        id: "picos",
        eyebrow: "PREPARACIÓN ANTE PICOS",
        title: "Preparados para los momentos de mayor ocupación",
        items: [
          { title: "Stock suficiente", text: "Calculamos la rotación para que haya ropa limpia disponible en los días de más cambios." },
          { title: "Renting como refuerzo", text: "Si el stock propio no alcanza, valoramos renting textil para la temporada." },
          { title: "Seguimiento", text: "Revisamos con el alojamiento cómo ha funcionado cada pico para ajustar el siguiente." },
        ],
      },
    ],
    embeddedForm: "sierra-nevada",
    layout: "compact",
    tagline: "La temporada se prepara antes de que empiece.",
    highlights: [
      { title: "Rutas programadas de recogida y entrega", text: "Acordamos puntos, días y franjas antes de la temporada y los ajustamos cuando cambia la ocupación." },
      { title: "Textil preparado y organizado por tipología", text: "Sábanas y toallas lavadas, revisadas y dobladas por tipología, listas para el almacén o las plantas." },
      { title: "Renting textil para picos de ocupación", text: "Si el stock propio no alcanza en fines de semana y puentes, lo reforzamos dentro de la misma ruta." },
    ],
    updatedAt: CONTENT_REVIEWED,
  },
  {
    slug: "limpieza-apartamentos-turisticos-granada",
    navLabel: "Limpieza de apartamentos",
    h1: "Limpieza de apartamentos turísticos en Granada",
    eyebrow: "ESPECIALIDAD GRANALVA",
    metaTitle: "Limpieza de apartamentos turísticos en Granada | Granalva",
    metaDescription:
      "Limpieza de apartamentos turísticos en Granada entre huéspedes, coordinada con entradas y salidas, con revisión final y lavandería opcional.",
    intent: "Contratar la limpieza entre estancias de apartamentos turísticos o viviendas vacacionales en Granada.",
    primaryKeyword: "limpieza apartamentos turísticos Granada",
    secondaryKeywords: ["limpieza alquiler vacacional", "limpieza entre huéspedes", "limpieza de alojamientos"],
    summary: "Apartamentos preparados para la siguiente entrada con un proceso pensado para la rotación turística.",
    image: IMAGES.cleaning,
    imageAlt: "Preparación de la cama de un apartamento turístico entre dos estancias",
    introTitle: "Limpieza de apartamentos turísticos: no es limpiar una vivienda, es preparar una experiencia",
    intro: [
      "Una limpieza turística tiene un tiempo concreto, una entrada prevista y una lista de detalles que afectan directamente a la percepción del huésped. Por eso trabajamos con una planificación específica para alojamientos.",
      "Coordinamos limpieza, revisión del espacio, presentación y, cuando se contrata, lavandería o renting textil. El gestor mantiene un interlocutor directo para organizar la operativa.",
      "La limpieza entre huéspedes de un alquiler vacacional se organiza a partir de las horas de salida y de entrada. Cada alojamiento tiene su ficha con accesos, capacidad y detalles de presentación para que el resultado sea constante.",
    ],
    promise: "Cada salida se convierte en una entrada preparada, no en una carrera de última hora.",
    needsTitle: "Qué resuelve una limpieza turística profesional",
    needs: [
      { title: "Franjas muy ajustadas", text: "Planificamos el servicio entre la salida y la siguiente entrada acordadas con el gestor." },
      { title: "Detalles que se olvidan", text: "Un protocolo por alojamiento fija los puntos que se revisan antes de cerrar el servicio." },
      { title: "Ropa de cama sin coordinar", text: "La limpieza puede ir unida a la lavandería y al renting textil para que los juegos estén disponibles." },
    ],
    includes: [
      { title: "Limpieza entre estancias", text: "Proceso adaptado a salidas, entradas y características de cada alojamiento." },
      { title: "Revisión de detalles", text: "Comprobación de los puntos acordados antes de considerar finalizado el servicio." },
      { title: "Preparación textil", text: "Coordinación con ropa de cama y baño cuando existe servicio de lavandería." },
      { title: "Comunicación", text: "Canal directo para planificación, cambios y necesidades operativas." },
    ],
    process: [
      { title: "Ficha del alojamiento", text: "Definimos acceso, capacidad, distribución y particularidades." },
      { title: "Protocolo acordado", text: "Ordenamos tareas y detalles importantes para la presentación." },
      { title: "Limpieza y preparación", text: "El equipo ejecuta el servicio dentro de la franja coordinada." },
      { title: "Seguimiento", text: "Registramos incidencias operativas y ajustamos el proceso cuando procede." },
    ],
    audiences: ["Apartamentos turísticos", "Viviendas de uso turístico", "Gestores profesionales", "Apartahoteles", "Alojamientos rurales", "Propietarios con varias unidades"],
    coverage: STANDARD_COVERAGE,
    faqs: [
      { question: "¿Trabajáis coordinados con el calendario de reservas?", answer: "Organizamos la planificación a partir de entradas, salidas y franjas disponibles que facilita el gestor." },
      { question: "¿Incluye lavandería?", answer: "La lavandería puede contratarse y coordinarse con la limpieza. Se presupuesta según volumen, frecuencia y ruta." },
      { question: "¿Podéis atender varios apartamentos?", answer: "Sí. Estudiamos ubicación, tiempos, características y rotación de cada unidad para diseñar una planificación conjunta." },
      { question: "¿Cómo preparáis el presupuesto?", answer: "Valoramos superficie, capacidad, distribución, frecuencia, ubicación, accesos y tareas acordadas. El presupuesto se plantea por la operativa necesaria." },
    ],
    related: [
      { slug: "lavanderia-apartamentos-turisticos-granada", anchor: "lavandería para apartamentos turísticos" },
      { slug: "renting-textil-granada", anchor: "renting textil para alojamientos" },
      { slug: "empresa-limpieza-granada", anchor: "empresa de limpieza profesional en Granada" },
    ],
    ctaLabel: "Solicitar presupuesto empresarial",
    ctaTitle: "Prepara cada entrada sin carreras de última hora.",
    ctaText: "Indícanos cuántos apartamentos gestionas, su capacidad y la rotación habitual para proponerte una planificación.",
    updatedAt: CONTENT_REVIEWED,
  },
  {
    slug: "limpieza-oficinas-locales-granada",
    navLabel: "Oficinas y locales",
    h1: "Limpieza de oficinas y locales comerciales en Granada",
    eyebrow: "ESPACIOS DE TRABAJO Y ATENCIÓN AL PÚBLICO",
    metaTitle: "Limpieza de oficinas y locales comerciales en Granada | Granalva",
    metaDescription:
      "Limpieza de oficinas, despachos y locales comerciales en Granada. Horarios adaptados a tu actividad, planificación periódica y equipo coordinado.",
    intent: "Contratar la limpieza periódica de una oficina, despacho o local comercial en Granada.",
    primaryKeyword: "limpieza oficinas Granada",
    secondaryKeywords: ["limpieza locales comerciales Granada", "limpieza de despachos", "limpieza de comercios"],
    summary: "Un plan de limpieza compatible con tus horarios para que el equipo y los clientes encuentren siempre el espacio preparado.",
    image: IMAGES.cleaning,
    imageAlt: "Profesional de limpieza preparando un espacio interior",
    introTitle: "Limpieza de oficinas en Granada que respeta el ritmo de tu actividad",
    intro: [
      "Cada oficina o local tiene horas de apertura, zonas de uso intensivo y requisitos diferentes. Antes de presupuestar, conocemos el espacio y las franjas en las que podemos trabajar sin interrumpir la actividad.",
      "Definimos tareas periódicas, puntos críticos y frecuencia. También podemos estudiar varios centros de una misma empresa para organizar desplazamientos y mantener un estándar común.",
      "En la limpieza de locales comerciales cuidamos especialmente los accesos, el escaparate, la zona de atención y los aseos, que son lo primero que ve el cliente al entrar.",
    ],
    promise: "Tu espacio listo para abrir, recibir al equipo o atender al siguiente cliente.",
    needsTitle: "Qué resuelve una limpieza periódica bien organizada",
    needs: [
      { title: "Interrupciones en horario laboral", text: "Trabajamos en horas libres o en franjas compatibles con la actividad del centro." },
      { title: "Zonas de uso intensivo", text: "Aseos, cocinas y zonas comunes tienen la frecuencia que necesitan, no la misma que el resto." },
      { title: "Imagen ante el cliente", text: "Recepción, accesos y zonas visibles se mantienen como parte prioritaria del protocolo." },
    ],
    includes: [
      { title: "Zonas de trabajo", text: "Mesas, despachos, salas y áreas compartidas según el protocolo acordado." },
      { title: "Atención al público", text: "Cuidado de accesos, recepción y zonas visibles para clientes." },
      { title: "Aseos y zonas comunes", text: "Limpieza periódica de espacios de uso intensivo." },
      { title: "Horarios adaptados", text: "Organización en horas libres o franjas compatibles con la actividad." },
    ],
    process: [
      { title: "Revisamos el espacio", text: "Medimos zonas, usos, horarios y frecuencia necesaria." },
      { title: "Priorizamos tareas", text: "Diferenciamos mantenimiento, detalle y limpiezas periódicas." },
      { title: "Organizamos horarios", text: "Encajamos el servicio en las horas libres del centro." },
      { title: "Mantenemos el estándar", text: "Revisamos la operativa y ajustamos los puntos necesarios." },
    ],
    audiences: ["Oficinas", "Despachos profesionales", "Comercios", "Centros deportivos", "Clínicas y centros", "Locales con atención al público"],
    coverage: STANDARD_COVERAGE,
    faqs: [
      { question: "¿Os adaptáis a las horas libres del centro?", answer: "Sí. Necesitamos conocer horarios de apertura, actividad y accesos para proponer franjas compatibles." },
      { question: "¿Podéis limpiar varios locales?", answer: "Estudiamos cada ubicación y los desplazamientos para preparar una propuesta conjunta y operativamente viable." },
      { question: "¿Aportáis productos y materiales?", answer: "Definimos en la propuesta qué productos, consumibles y medios forman parte del servicio según las necesidades del espacio." },
      { question: "¿El servicio se calcula por horas?", answer: "Analizamos las horas estimadas, pero la propuesta puede plantearse por servicio y frecuencia, con tareas y condiciones claramente definidas." },
    ],
    related: [
      { slug: "empresa-limpieza-granada", anchor: "empresa de limpieza profesional en Granada" },
      { slug: "limpieza-fin-de-obra-granada", anchor: "limpieza fin de obra antes de abrir un local" },
      { slug: "lavanderia-profesional-granada", anchor: "lavandería para empresas con uniformidad" },
    ],
    ctaLabel: "Solicitar presupuesto empresarial",
    ctaTitle: "Mantén tu oficina o local siempre preparado.",
    ctaText: "Cuéntanos la superficie, los horarios y la frecuencia que necesitas para preparar una propuesta de limpieza periódica.",
    updatedAt: CONTENT_REVIEWED,
  },
  {
    slug: "limpieza-fin-de-obra-granada",
    navLabel: "Limpieza fin de obra",
    h1: "Limpieza fin de obra y después de reformas en Granada",
    eyebrow: "ESPACIOS LISTOS PARA ESTRENAR",
    metaTitle: "Limpieza fin de obra y reformas en Granada | Granalva",
    metaDescription:
      "Limpieza fin de obra en Granada para viviendas, locales y oficinas. Limpieza después de reforma con valoración previa y revisión final.",
    intent: "Dejar un espacio listo para su uso después de una obra o reforma en Granada.",
    primaryKeyword: "limpieza fin de obra Granada",
    secondaryKeywords: ["limpieza después de reforma", "limpieza de obra", "limpieza final de obra"],
    summary: "Retiramos la suciedad propia de una obra o reforma para que el espacio pueda entregarse, abrir o volver a utilizarse.",
    image: IMAGES.cleaning,
    imageAlt: "Espacio interior preparado y limpio, listo para volver a utilizarse",
    introTitle: "Limpieza fin de obra en Granada: el último trabajo antes de abrir la puerta",
    intro: [
      "El polvo fino, los restos adheridos y la suciedad de una reforma requieren una planificación distinta al mantenimiento habitual. Evaluamos el estado del espacio y los materiales antes de definir tareas y medios.",
      "Trabajamos en viviendas, locales, oficinas y otros espacios después de obras o reformas, con una propuesta ajustada a superficie, accesos, nivel de suciedad y fecha de entrega.",
      "Una limpieza después de reforma avanza por fases: primero la retirada general de polvo y restos, después superficies, cristales y detalles, y por último una revisión de los puntos acordados.",
    ],
    promise: "Un espacio preparado para su entrega o apertura, sin trasladar la limpieza final al cliente.",
    needsTitle: "Qué resuelve una limpieza de obra profesional",
    needs: [
      { title: "Polvo que vuelve a aparecer", text: "La limpieza por fases evita repartir el polvo fino de una zona a otra." },
      { title: "Materiales delicados", text: "Valoramos cada superficie antes de elegir productos y métodos." },
      { title: "Fechas de entrega", text: "Organizamos el servicio en función del día en que el espacio debe estar disponible." },
    ],
    includes: [
      { title: "Polvo de obra", text: "Retirada progresiva de polvo fino en superficies y zonas acordadas." },
      { title: "Superficies", text: "Tratamiento adaptado al material y al estado observado en la valoración." },
      { title: "Cristales y detalles", text: "Limpieza de puntos definidos en el alcance del presupuesto." },
      { title: "Entrega", text: "Organización del servicio según la fecha en la que el espacio debe estar disponible." },
    ],
    process: [
      { title: "Valoración previa", text: "Revisamos superficie, materiales, restos, accesos y fecha objetivo." },
      { title: "Definición de alcance", text: "Detallamos tareas incluidas y condiciones necesarias." },
      { title: "Limpieza por fases", text: "Avanzamos desde la retirada general hasta los acabados de detalle." },
      { title: "Revisión final", text: "Comprobamos los puntos acordados antes de cerrar el servicio." },
    ],
    audiences: ["Viviendas reformadas", "Locales comerciales", "Oficinas", "Promociones", "Alojamientos renovados", "Profesionales y particulares"],
    coverage: STANDARD_COVERAGE,
    faqs: [
      { question: "¿Necesitáis visitar la obra antes?", answer: "Una valoración o información visual detallada permite definir mejor el alcance, los medios y el tiempo necesario." },
      { question: "¿Retiráis escombros?", answer: "La retirada de escombros no debe darse por incluida. Confirmamos qué residuos existen y qué tareas forman parte del presupuesto." },
      { question: "¿Podéis trabajar antes de una apertura?", answer: "Sí. Necesitamos conocer la fecha objetivo y el estado real para comprobar disponibilidad y organizar el servicio." },
      { question: "¿Trabajáis para empresas y particulares?", answer: "Sí. Valoramos viviendas, locales, oficinas y otros espacios tanto para clientes profesionales como particulares." },
    ],
    related: [
      { slug: "limpieza-oficinas-locales-granada", anchor: "limpieza periódica de oficinas y locales" },
      { slug: "empresa-limpieza-granada", anchor: "empresa de limpieza profesional en Granada" },
      { slug: "limpieza-apartamentos-turisticos-granada", anchor: "limpieza de apartamentos turísticos reformados" },
    ],
    ctaLabel: "Solicitar presupuesto de fin de obra",
    ctaTitle: "¿Cuándo tiene que estar listo el espacio?",
    ctaText: "Envíanos la superficie, el tipo de obra y la fecha objetivo. Si es posible, añade fotografías para valorar el alcance.",
    updatedAt: CONTENT_REVIEWED,
  },
  {
    slug: "renting-textil-granada",
    navLabel: "Renting textil",
    h1: "Renting textil para alojamientos y empresas en Granada",
    eyebrow: "SÁBANAS · TOALLAS · ROTACIÓN",
    metaTitle: "Renting textil en Granada para alojamientos | Granalva",
    metaDescription:
      "Renting textil en Granada: alquiler de sábanas y toallas para hoteles y apartamentos turísticos, con lavandería, rotación y entregas acordadas.",
    intent: "Disponer de ropa de cama y baño para un alojamiento sin comprar todo el stock.",
    primaryKeyword: "renting textil Granada",
    secondaryKeywords: ["alquiler de sábanas y toallas", "textiles para hoteles", "textiles para apartamentos"],
    summary: "Disponibilidad de ropa de cama y baño sin asumir toda la compra, reposición y rotación del stock.",
    image: IMAGES.renting,
    imageAlt: "Juego de sábanas y toallas blancas preparado para un alojamiento",
    introTitle: "Renting textil en Granada: textiles disponibles sin inmovilizar más stock del necesario",
    intro: [
      "El renting textil ayuda a reducir la inversión inicial y simplifica la reposición de ropa de cama y baño. Para que funcione, debe estar coordinado con la lavandería y con el ritmo de entradas del alojamiento.",
      "Analizamos plazas, juegos en rotación, frecuencia y necesidades de almacenamiento antes de preparar una propuesta. El objetivo es dimensionar el servicio, no acumular textiles sin control.",
      "En la práctica funciona como un alquiler de sábanas y toallas vinculado al lavado: los textiles para hoteles y apartamentos entran en un ciclo de uso, recogida, lavandería y entrega acordado en la propuesta.",
    ],
    promise: "Un sistema textil dimensionado para la operativa real del alojamiento.",
    needsTitle: "Qué resuelve el renting textil",
    needs: [
      { title: "Inversión inicial", text: "Evitas comprar de una vez todos los juegos necesarios para abrir o ampliar un alojamiento." },
      { title: "Reposición y desgaste", text: "Las condiciones de reposición quedan definidas desde el principio." },
      { title: "Almacenamiento", text: "La rotación se calcula para no acumular más textiles de los que necesitas." },
    ],
    includes: [
      { title: "Ropa de cama", text: "Estudio de sábanas y piezas necesarias según tipología de cama y rotación." },
      { title: "Ropa de baño", text: "Toallas y categorías acordadas para cada tipo de alojamiento." },
      { title: "Lavandería", text: "Proceso de cuidado integrado en la rotación del material textil." },
      { title: "Reposición acordada", text: "Condiciones de uso, rotación y reposición definidas en la propuesta." },
    ],
    process: [
      { title: "Inventariamos necesidades", text: "Revisamos plazas, formatos, consumo y stock existente." },
      { title: "Calculamos rotación", text: "Dimensionamos juegos según ocupación y frecuencia de lavandería." },
      { title: "Acordamos condiciones", text: "Definimos textiles, entregas, uso y responsabilidades." },
      { title: "Integramos la lavandería", text: "Coordinamos el cuidado de los textiles con la ruta del cliente." },
    ],
    audiences: ["Hoteles", "Apartamentos turísticos", "Apartahoteles", "Alojamientos rurales", "Residencias", "Gestores profesionales"],
    coverage: STANDARD_COVERAGE,
    faqs: [
      { question: "¿Qué incluye el renting textil?", answer: "La propuesta define las categorías y cantidades de textiles, su lavandería, rotación, entregas y condiciones de reposición." },
      { question: "¿Puedo combinar stock propio y renting?", answer: "Podemos estudiar una solución que complemente el stock existente cuando resulte operativamente viable." },
      { question: "¿Cómo calculáis los juegos necesarios?", answer: "Partimos de plazas, ocupación, frecuencia de recogida y entrega, margen operativo y capacidad de almacenamiento." },
      { question: "¿El renting está disponible sin lavandería?", answer: "Se estudia como una solución vinculada a la gestión y cuidado de los textiles; confirmamos el modelo adecuado en la propuesta." },
    ],
    related: [
      { slug: "lavanderia-hoteles-granada", anchor: "lavandería para hoteles en Granada" },
      { slug: "lavanderia-apartamentos-turisticos-granada", anchor: "lavandería para apartamentos turísticos" },
      { slug: "limpieza-apartamentos-turisticos-granada", anchor: "limpieza de apartamentos turísticos" },
      { slug: "lavanderia-sierra-nevada", anchor: "renting textil para la temporada en Sierra Nevada" },
    ],
    ctaLabel: "Solicitar propuesta de renting",
    ctaTitle: "Calculemos los textiles que necesita tu alojamiento.",
    ctaText: "Indícanos plazas, tipos de cama, ocupación y stock actual para dimensionar una propuesta de renting textil.",
    updatedAt: CONTENT_REVIEWED,
  },
  {
    slug: "lavanderia-domicilio-granada",
    navLabel: "Lavandería a domicilio",
    h1: "Lavandería a domicilio con recogida y entrega en Granada",
    eyebrow: "PARA PARTICULARES",
    metaTitle: "Lavandería a domicilio en Granada con recogida | Granalva",
    metaDescription:
      "Lavandería a domicilio en Granada: recogemos tu ropa, la lavamos, secamos y doblamos, y te la devolvemos en casa. Colada de 4, 8 o 12 kg.",
    intent: "Que un particular delegue su colada con recogida y entrega en casa en Granada.",
    primaryKeyword: "lavandería a domicilio Granada",
    secondaryKeywords: ["recogida y entrega de ropa", "colada a domicilio", "lavado y doblado"],
    summary: "Tu colada sale de casa y vuelve limpia, seca y doblada para que recuperes tiempo sin desplazarte.",
    image: IMAGES.laundry,
    imageAlt: "Colada limpia, seca y doblada lista para devolverse a domicilio",
    introTitle: "Lavandería a domicilio en Granada: la semana ya tiene suficientes tareas",
    intro: [
      "La lavandería a domicilio está pensada para personas que quieren ahorrar tiempo, resolver una acumulación de ropa o delegar la colada habitual sin desplazarse.",
      "Acordamos la recogida, cuidamos la ropa según el servicio contratado y la devolvemos limpia, seca y doblada. También puedes consultarnos por textiles del hogar y necesidades puntuales.",
      "La colada a domicilio funciona con tres tamaños de referencia —hasta 4, 8 o 12 kg— para que puedas indicarnos el volumen aproximado. La recogida y entrega de ropa se confirman contigo antes del servicio.",
    ],
    promise: "Menos bolsas, menos lavadoras y más tiempo para lo que sí quieres hacer.",
    needsTitle: "Qué resuelve la lavandería a domicilio",
    needs: [
      { title: "Falta de tiempo", text: "Delegas el lavado y doblado de la ropa de la semana sin cambiar tu rutina." },
      { title: "Ropa acumulada", text: "Resolvemos de una vez una colada grande o textiles del hogar que se han ido acumulando." },
      { title: "Sin desplazamientos", text: "Recogemos y devolvemos la ropa en la dirección y franja acordadas." },
    ],
    includes: [
      { title: "Recogida", text: "Acordamos dirección, día y franja según disponibilidad de ruta." },
      { title: "Lavado", text: "Clasificación básica y proceso de lavado conforme al servicio contratado." },
      { title: "Secado y doblado", text: "La ropa se prepara para que resulte sencillo guardarla al recibirla." },
      { title: "Entrega", text: "Devolvemos la colada en el punto y franja coordinados." },
    ],
    process: [
      { title: "Nos cuentas tu necesidad", text: "Indicas volumen aproximado, dirección y tipo de ropa." },
      { title: "Acordamos recogida", text: "Confirmamos una franja compatible con la ruta." },
      { title: "Cuidamos tu colada", text: "Lavamos, secamos y doblamos según el servicio." },
      { title: "La devolvemos", text: "Recibes la ropa preparada para volver al armario." },
    ],
    audiences: ["Colada semanal", "Familias", "Profesionales con poco tiempo", "Estudiantes", "Textiles del hogar", "Necesidades puntuales"],
    coverage:
      "Recogemos y entregamos en Granada y en el área metropolitana según la disponibilidad de ruta. Al solicitar el servicio te confirmamos si tu dirección está incluida y la franja disponible.",
    faqs: [
      { question: "¿Cómo solicito la recogida?", answer: "Puedes contactar por teléfono, correo o el formulario indicando dirección, volumen aproximado y disponibilidad." },
      { question: "¿Qué tamaño de colada puedo enviar?", answer: "La web muestra referencias de 4, 8 y 12 kg. Confirmamos contigo el volumen y las condiciones antes de la recogida." },
      { question: "¿La ropa vuelve doblada?", answer: "El servicio de colada contempla lavado, secado y doblado, salvo que se acuerde otro tratamiento o acabado." },
      { question: "¿Recogéis edredones o textiles grandes?", answer: "Consúltanos el tipo, tamaño y composición para confirmar si podemos tratarlo y preparar una propuesta." },
    ],
    related: [
      { slug: "lavanderia-profesional-granada", anchor: "lavandería profesional para empresas" },
      { slug: "empresa-limpieza-granada", anchor: "servicios de limpieza en Granada" },
    ],
    ctaLabel: "Solicitar recogida",
    ctaTitle: "Solicita la recogida de tu colada.",
    ctaText: "Indícanos tu dirección, el tamaño aproximado de la colada y tu disponibilidad. Te confirmamos la franja de recogida.",
    showLoadPicker: true,
    updatedAt: CONTENT_REVIEWED,
  },
];

export const serviceBySlug = Object.fromEntries(servicePages.map((service) => [service.slug, service])) as Record<string, ServicePage>;

export const homepageServices = [
  serviceBySlug["lavanderia-profesional-granada"],
  serviceBySlug["limpieza-apartamentos-turisticos-granada"],
  serviceBySlug["limpieza-oficinas-locales-granada"],
  serviceBySlug["renting-textil-granada"],
  serviceBySlug["limpieza-fin-de-obra-granada"],
];
