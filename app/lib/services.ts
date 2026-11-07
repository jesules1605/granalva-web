// Dominio canónico. Se define por entorno (preproducción / producción) con
// NEXT_PUBLIC_SITE_URL; el valor por defecto conserva el de la versión publicada.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://granalva-propuesta-visual.manueljesus1605.chatgpt.site"
).replace(/\/+$/, "");

export type ServicePage = {
  slug: string;
  navLabel: string;
  title: string;
  eyebrow: string;
  metaTitle: string;
  metaDescription: string;
  summary: string;
  image: string;
  imageAlt: string;
  introTitle: string;
  intro: string[];
  promise: string;
  includes: { title: string; text: string }[];
  process: { title: string; text: string }[];
  audiences: string[];
  faqs: { question: string; answer: string }[];
  related: string[];
};

export const servicePages: ServicePage[] = [
  {
    slug: "empresa-limpieza-granada",
    navLabel: "Empresa de limpieza",
    title: "Empresa de limpieza en Granada para negocios que no pueden parar",
    eyebrow: "LIMPIEZA PROFESIONAL · GRANADA",
    metaTitle: "Empresa de limpieza en Granada | Granalva",
    metaDescription: "Limpieza profesional en Granada para empresas, oficinas, locales, alojamientos y centros. Equipo propio, planificación y presupuesto a medida.",
    summary: "Un servicio de limpieza profesional organizado alrededor de tus horarios, tus espacios y el nivel de exigencia de tu actividad.",
    image: "/service-cleaning.png",
    imageAlt: "Equipo de Granalva realizando una limpieza profesional en Granada",
    introTitle: "Limpieza profesional que se integra en tu operativa",
    intro: [
      "Una empresa necesita continuidad, discreción y una planificación que se cumpla. En Granalva estudiamos el espacio, la frecuencia, los horarios disponibles y las tareas críticas antes de definir el servicio.",
      "Coordinamos al equipo y mantenemos una comunicación directa para que la limpieza no dependa de soluciones improvisadas. El objetivo es sencillo: que cada jornada comience con el espacio preparado.",
    ],
    promise: "Una propuesta ajustada al servicio real, no una tarifa genérica desconectada de tu negocio.",
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
    faqs: [
      { question: "¿Cómo se calcula un presupuesto de limpieza para empresas?", answer: "Valoramos superficie, tipo de actividad, frecuencia, horario, ubicación, accesos y tareas necesarias. Con esa información preparamos una propuesta adaptada." },
      { question: "¿Podéis trabajar fuera del horario comercial?", answer: "Estudiamos las horas libres y la operativa de cada centro para proponer franjas que reduzcan las interferencias con clientes y trabajadores." },
      { question: "¿Trabajáis con varios centros de una misma empresa?", answer: "Sí. Podemos estudiar ubicaciones, tiempos de desplazamiento y frecuencia de cada centro para coordinar una operativa conjunta." },
      { question: "¿La limpieza puede ser periódica o puntual?", answer: "Preparamos servicios recurrentes y también limpiezas puntuales, profundas o asociadas a una necesidad concreta." },
    ],
    related: ["limpieza-oficinas-locales-granada", "limpieza-apartamentos-turisticos-granada", "limpieza-fin-de-obra-granada"],
  },
  {
    slug: "lavanderia-profesional-granada",
    navLabel: "Lavandería profesional",
    title: "Lavandería profesional en Granada con recogida y entrega",
    eyebrow: "LAVANDERÍA PARA EMPRESAS",
    metaTitle: "Lavandería profesional en Granada | Granalva",
    metaDescription: "Lavandería profesional en Granada para empresas y alojamientos: desmanchado, lavado, secado, planchado, doblado, recogida y entrega.",
    summary: "Externaliza el cuidado de tus textiles con una ruta coordinada, un proceso completo y atención directa.",
    image: "/hero-laundry.png",
    imageAlt: "Textiles limpios preparados por la lavandería profesional de Granalva",
    introTitle: "Tus textiles preparados cuando tu negocio los necesita",
    intro: [
      "La lavandería profesional no consiste solo en lavar. Requiere coordinar volúmenes, recogidas, entregas y acabados para que la ropa vuelva lista para entrar de nuevo en servicio.",
      "Granalva estudia el tipo de textil, la frecuencia y la operativa del cliente. Nuestro servicio puede incluir desmanchado previo, lavado, secado, planchado, doblado y transporte acordado.",
    ],
    promise: "Una ruta de lavandería pensada para dar continuidad a tu empresa, no para añadir otra preocupación.",
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
    faqs: [
      { question: "¿La lavandería incluye transporte?", answer: "Podemos incluir recogida y entrega dentro de una ruta acordada. La ubicación, frecuencia y volumen se estudian en cada propuesta." },
      { question: "¿Qué tipos de textiles gestionáis?", answer: "Estudiamos ropa de cama y baño, uniformidad, toallas y otros textiles profesionales según composición, estado y necesidades de acabado." },
      { question: "¿Existe un volumen mínimo?", answer: "Necesitamos conocer el volumen y la frecuencia para valorar la viabilidad de la ruta. Preparamos cada propuesta según la operativa real." },
      { question: "¿Podemos hacer una prueba de servicio?", answer: "Cuando la operativa lo permite, podemos valorar una prueba para comprobar acabados, tiempos y coordinación antes de consolidar la ruta." },
    ],
    related: ["lavanderia-hoteles-granada", "lavanderia-apartamentos-turisticos-granada", "renting-textil-granada"],
  },
  {
    slug: "lavanderia-hoteles-granada",
    navLabel: "Lavandería para hoteles",
    title: "Lavandería para hoteles y alojamientos en Granada",
    eyebrow: "HOSTELERÍA · ROPA DE CAMA Y BAÑO",
    metaTitle: "Lavandería para hoteles en Granada | Granalva",
    metaDescription: "Lavandería para hoteles y alojamientos en Granada. Gestión de sábanas y toallas, recogidas periódicas, entrega coordinada y renting textil.",
    summary: "Una operativa textil estable para habitaciones que deben estar listas, incluso en semanas de máxima ocupación.",
    image: "/service-renting.png",
    imageAlt: "Ropa de cama y baño preparada para hoteles en Granada",
    introTitle: "Continuidad textil para ocupaciones exigentes",
    intro: [
      "En un hotel o alojamiento, una entrega tardía afecta directamente a la preparación de habitaciones. Por eso planteamos la lavandería como una parte de la operativa, no como un servicio aislado.",
      "Estudiamos ocupación, rotación, stock disponible, volumen semanal y puntos de recogida para definir una ruta que ayude a mantener la continuidad del establecimiento.",
    ],
    promise: "Ropa de cama y baño preparada para que el equipo pueda concentrarse en recibir al huésped.",
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
    faqs: [
      { question: "¿Podéis adaptar la frecuencia a la temporada alta?", answer: "Sí. La propuesta parte del volumen y de la estacionalidad; revisamos con el alojamiento las necesidades de los periodos de mayor ocupación." },
      { question: "¿Gestionáis sábanas y toallas?", answer: "Son las categorías principales del servicio hotelero. Confirmamos formatos, composición, acabados y cantidades antes de iniciar la operativa." },
      { question: "¿Ofrecéis renting textil para hoteles?", answer: "Podemos estudiar un modelo de renting de ropa de cama y baño vinculado a la lavandería y a la rotación necesaria." },
      { question: "¿Trabajáis fuera de Granada capital?", answer: "Trabajamos Granada y rutas acordadas en el área metropolitana. Para otras ubicaciones valoramos volumen, frecuencia y viabilidad logística." },
    ],
    related: ["lavanderia-profesional-granada", "renting-textil-granada", "limpieza-apartamentos-turisticos-granada"],
  },
  {
    slug: "lavanderia-apartamentos-turisticos-granada",
    navLabel: "Lavandería para apartamentos",
    title: "Lavandería para apartamentos turísticos en Granada",
    eyebrow: "GESTORES Y ALOJAMIENTOS TURÍSTICOS",
    metaTitle: "Lavandería apartamentos turísticos Granada | Granalva",
    metaDescription: "Lavandería para apartamentos turísticos en Granada: recogida, lavado y entrega de sábanas y toallas coordinada con la rotación de huéspedes.",
    summary: "Textiles limpios y preparados para acompañar el ritmo real de entradas, salidas y cambios de última hora.",
    image: "/hero-laundry.png",
    imageAlt: "Sábanas y toallas para apartamentos turísticos en Granada",
    introTitle: "La lavandería que entiende una entrada de huéspedes",
    intro: [
      "Los apartamentos turísticos no funcionan con una semana idéntica a la anterior. Cambian las ocupaciones, los horarios de salida y el número de juegos textiles que entran en rotación.",
      "Granalva combina experiencia en limpieza turística y lavandería para coordinar recogidas, entregas y preparación de ropa de cama y baño con las necesidades del gestor.",
    ],
    promise: "Menos tiempo persiguiendo textiles y más control sobre la preparación de cada alojamiento.",
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
    faqs: [
      { question: "¿Recogéis directamente en los apartamentos?", answer: "Podemos estudiar recogida por ubicaciones o un punto centralizado. La opción adecuada depende de la dispersión, el volumen y la frecuencia." },
      { question: "¿Podéis coordinar lavandería y limpieza?", answer: "Sí. Granalva presta ambos servicios y puede estudiar una operativa conjunta para simplificar la preparación de los alojamientos." },
      { question: "¿Cómo se calcula el volumen?", answer: "Partimos del número de camas, juegos por alojamiento, ocupación estimada y rotación semanal. Una prueba o histórico ayuda a ajustar la propuesta." },
      { question: "¿Tenéis renting de sábanas y toallas?", answer: "Podemos valorar renting textil para reducir inversión y reforzar la disponibilidad de juegos en rotación." },
    ],
    related: ["limpieza-apartamentos-turisticos-granada", "renting-textil-granada", "lavanderia-profesional-granada"],
  },
  {
    slug: "limpieza-apartamentos-turisticos-granada",
    navLabel: "Limpieza de apartamentos",
    title: "Limpieza de apartamentos turísticos en Granada",
    eyebrow: "ESPECIALIDAD GRANALVA",
    metaTitle: "Limpieza de apartamentos turísticos Granada | Granalva",
    metaDescription: "Limpieza de apartamentos turísticos en Granada coordinada con entradas y salidas, revisión, lavandería y gestión textil para alojamientos.",
    summary: "Apartamentos preparados para la siguiente entrada con un proceso pensado para la rotación turística.",
    image: "/service-cleaning.png",
    imageAlt: "Limpieza de un apartamento turístico en Granada por Granalva",
    introTitle: "No es limpiar una vivienda: es preparar una experiencia",
    intro: [
      "Una limpieza turística tiene un tiempo concreto, una entrada prevista y una lista de detalles que afectan directamente a la percepción del huésped. Por eso trabajamos con una planificación específica para alojamientos.",
      "Coordinamos limpieza, revisión del espacio, presentación y, cuando se contrata, lavandería o renting textil. El gestor mantiene un interlocutor directo para organizar la operativa.",
    ],
    promise: "Cada salida se convierte en una entrada preparada, no en una carrera de última hora.",
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
    faqs: [
      { question: "¿Trabajáis coordinados con el calendario de reservas?", answer: "Organizamos la planificación a partir de entradas, salidas y franjas disponibles que facilita el gestor." },
      { question: "¿Incluye lavandería?", answer: "La lavandería puede contratarse y coordinarse con la limpieza. Se presupuesta según volumen, frecuencia y ruta." },
      { question: "¿Podéis atender varios apartamentos?", answer: "Sí. Estudiamos ubicación, tiempos, características y rotación de cada unidad para diseñar una planificación conjunta." },
      { question: "¿Cómo preparáis el presupuesto?", answer: "Valoramos superficie, capacidad, distribución, frecuencia, ubicación, accesos y tareas acordadas. El presupuesto se plantea por la operativa necesaria." },
    ],
    related: ["lavanderia-apartamentos-turisticos-granada", "renting-textil-granada", "empresa-limpieza-granada"],
  },
  {
    slug: "limpieza-oficinas-locales-granada",
    navLabel: "Oficinas y locales",
    title: "Limpieza de oficinas y locales en Granada",
    eyebrow: "ESPACIOS DE TRABAJO Y ATENCIÓN AL PÚBLICO",
    metaTitle: "Limpieza de oficinas y locales Granada | Granalva",
    metaDescription: "Limpieza de oficinas, despachos, comercios y locales en Granada. Horarios adaptados, planificación periódica y equipo profesional coordinado.",
    summary: "Un plan de limpieza compatible con tus horarios para que el equipo y los clientes encuentren siempre el espacio preparado.",
    image: "/service-cleaning.png",
    imageAlt: "Servicio de limpieza de oficinas y locales comerciales en Granada",
    introTitle: "Limpieza que respeta el ritmo de tu actividad",
    intro: [
      "Cada oficina o local tiene horas de apertura, zonas de uso intensivo y requisitos diferentes. Antes de presupuestar, conocemos el espacio y las franjas en las que podemos trabajar sin interrumpir la actividad.",
      "Definimos tareas periódicas, puntos críticos y frecuencia. También podemos estudiar varios centros de una misma empresa para organizar desplazamientos y mantener un estándar común.",
    ],
    promise: "Tu espacio listo para abrir, recibir al equipo o atender al siguiente cliente.",
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
    faqs: [
      { question: "¿Os adaptáis a las horas libres del centro?", answer: "Sí. Necesitamos conocer horarios de apertura, actividad y accesos para proponer franjas compatibles." },
      { question: "¿Podéis limpiar varios locales?", answer: "Estudiamos cada ubicación y los desplazamientos para preparar una propuesta conjunta y operativamente viable." },
      { question: "¿Aportáis productos y materiales?", answer: "Definimos en la propuesta qué productos, consumibles y medios forman parte del servicio según las necesidades del espacio." },
      { question: "¿El servicio se calcula por horas?", answer: "Analizamos las horas estimadas, pero la propuesta puede plantearse por servicio y frecuencia, con tareas y condiciones claramente definidas." },
    ],
    related: ["empresa-limpieza-granada", "limpieza-fin-de-obra-granada", "lavanderia-profesional-granada"],
  },
  {
    slug: "limpieza-fin-de-obra-granada",
    navLabel: "Limpieza fin de obra",
    title: "Limpieza de fin de obra y reforma en Granada",
    eyebrow: "ESPACIOS LISTOS PARA ESTRENAR",
    metaTitle: "Limpieza fin de obra en Granada | Granalva",
    metaDescription: "Limpieza fin de obra y reforma en Granada para viviendas, locales, oficinas y promociones. Valoración previa y servicio profesional detallado.",
    summary: "Retiramos la suciedad propia de una obra o reforma para que el espacio pueda entregarse, abrir o volver a utilizarse.",
    image: "/service-cleaning.png",
    imageAlt: "Limpieza profesional de fin de obra en Granada",
    introTitle: "El último trabajo antes de abrir la puerta",
    intro: [
      "El polvo fino, los restos adheridos y la suciedad de una reforma requieren una planificación distinta al mantenimiento habitual. Evaluamos el estado del espacio y los materiales antes de definir tareas y medios.",
      "Trabajamos en viviendas, locales, oficinas y otros espacios después de obras o reformas, con una propuesta ajustada a superficie, accesos, nivel de suciedad y fecha de entrega.",
    ],
    promise: "Un espacio preparado para su entrega o apertura, sin trasladar la limpieza final al cliente.",
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
    faqs: [
      { question: "¿Necesitáis visitar la obra antes?", answer: "Una valoración o información visual detallada permite definir mejor el alcance, los medios y el tiempo necesario." },
      { question: "¿Retiráis escombros?", answer: "La retirada de escombros no debe darse por incluida. Confirmamos qué residuos existen y qué tareas forman parte del presupuesto." },
      { question: "¿Podéis trabajar antes de una apertura?", answer: "Sí. Necesitamos conocer la fecha objetivo y el estado real para comprobar disponibilidad y organizar el servicio." },
      { question: "¿Trabajáis para empresas y particulares?", answer: "Sí. Valoramos viviendas, locales, oficinas y otros espacios tanto para clientes profesionales como particulares." },
    ],
    related: ["empresa-limpieza-granada", "limpieza-oficinas-locales-granada", "limpieza-apartamentos-turisticos-granada"],
  },
  {
    slug: "renting-textil-granada",
    navLabel: "Renting textil",
    title: "Renting textil en Granada para alojamientos y empresas",
    eyebrow: "SÁBANAS · TOALLAS · ROTACIÓN",
    metaTitle: "Renting textil en Granada | Granalva",
    metaDescription: "Renting textil en Granada para hoteles y apartamentos turísticos. Sábanas y toallas vinculadas a lavandería, rotación y entregas acordadas.",
    summary: "Disponibilidad de ropa de cama y baño sin asumir toda la compra, reposición y rotación del stock.",
    image: "/service-renting.png",
    imageAlt: "Sábanas y toallas del servicio de renting textil de Granalva",
    introTitle: "Textiles disponibles sin inmovilizar más stock del necesario",
    intro: [
      "El renting textil ayuda a reducir la inversión inicial y simplifica la reposición de ropa de cama y baño. Para que funcione, debe estar coordinado con la lavandería y con el ritmo de entradas del alojamiento.",
      "Analizamos plazas, juegos en rotación, frecuencia y necesidades de almacenamiento antes de preparar una propuesta. El objetivo es dimensionar el servicio, no acumular textiles sin control.",
    ],
    promise: "Un sistema textil dimensionado para la operativa real del alojamiento.",
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
    faqs: [
      { question: "¿Qué incluye el renting textil?", answer: "La propuesta define las categorías y cantidades de textiles, su lavandería, rotación, entregas y condiciones de reposición." },
      { question: "¿Puedo combinar stock propio y renting?", answer: "Podemos estudiar una solución que complemente el stock existente cuando resulte operativamente viable." },
      { question: "¿Cómo calculáis los juegos necesarios?", answer: "Partimos de plazas, ocupación, frecuencia de recogida y entrega, margen operativo y capacidad de almacenamiento." },
      { question: "¿El renting está disponible sin lavandería?", answer: "Se estudia como una solución vinculada a la gestión y cuidado de los textiles; confirmamos el modelo adecuado en la propuesta." },
    ],
    related: ["lavanderia-hoteles-granada", "lavanderia-apartamentos-turisticos-granada", "lavanderia-profesional-granada"],
  },
  {
    slug: "lavanderia-domicilio-granada",
    navLabel: "Lavandería a domicilio",
    title: "Lavandería a domicilio en Granada: recogemos tu colada",
    eyebrow: "PARA PARTICULARES",
    metaTitle: "Lavandería a domicilio en Granada | Granalva",
    metaDescription: "Lavandería a domicilio en Granada para particulares. Recogemos tu ropa, la lavamos, secamos y doblamos, y la devolvemos preparada.",
    summary: "Tu colada sale de casa y vuelve limpia, seca y doblada para que recuperes tiempo sin desplazarte.",
    image: "/hero-laundry.png",
    imageAlt: "Colada limpia y doblada del servicio de lavandería a domicilio en Granada",
    introTitle: "La semana ya tiene suficientes tareas",
    intro: [
      "La lavandería a domicilio está pensada para personas que quieren ahorrar tiempo, resolver una acumulación de ropa o delegar la colada habitual sin desplazarse.",
      "Acordamos la recogida, cuidamos la ropa según el servicio contratado y la devolvemos limpia, seca y doblada. También puedes consultarnos por textiles del hogar y necesidades puntuales.",
    ],
    promise: "Menos bolsas, menos lavadoras y más tiempo para lo que sí quieres hacer.",
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
    faqs: [
      { question: "¿Cómo solicito la recogida?", answer: "Puedes contactar por teléfono, correo o el formulario indicando dirección, volumen aproximado y disponibilidad." },
      { question: "¿Qué tamaño de colada puedo enviar?", answer: "La web muestra referencias de 4, 8 y 12 kg. Confirmamos contigo el volumen y las condiciones antes de la recogida." },
      { question: "¿La ropa vuelve doblada?", answer: "El servicio de colada contempla lavado, secado y doblado, salvo que se acuerde otro tratamiento o acabado." },
      { question: "¿Recogéis edredones o textiles grandes?", answer: "Consúltanos el tipo, tamaño y composición para confirmar si podemos tratarlo y preparar una propuesta." },
    ],
    related: ["lavanderia-profesional-granada", "empresa-limpieza-granada", "renting-textil-granada"],
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
