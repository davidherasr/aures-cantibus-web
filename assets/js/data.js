/*
  AURES CANTIBUS · Datos editables
  ---------------------------------------------------------------------------
  Este archivo concentra el contenido vivo de la web para que no tengas que
  tocar HTML cada vez que haya un concierto, galería, noticia o cambio de texto.

  Consejo de mantenimiento:
  - Edita textos entre comillas.
  - Respeta comas, llaves y corchetes.
  - Las imágenes deben existir en /assets/img/... o en la ruta que indiques.
*/

window.AURES_DATA = {
  site: {
    name: "Aures Cantibus",
    subtitle: "Coral de voces mixtas de Zamora",
    city: "Zamora",
    claim: "Música coral, patrimonio y emoción desde Zamora.",
    founded: "2000",
    members: "40",
    years: "25",
    contactEmail: "contacto@aurescantibus.es",
    contactPhone: "",
    facebookUrl: "#",
    oldBlogUrl: "https://aurescantibuszamora.blogspot.com/",
    address: "Zamora",
    quoteLatin: "Oculi pictura tenetur, aures cantibus",
    quoteEs: "Los ojos son cautivados por la pintura, los oídos por el canto.",
    legalOwner: "Asociación Coral Aures Cantibus",
    domain: "aurescantibus.es"
  },

  nav: [
    { label: "Inicio", href: "index.html" },
    { label: "El Coro", href: "el-coro.html" },
    { label: "Agenda", href: "agenda.html" },
    { label: "Galería", href: "galeria.html" },
    { label: "Repertorio", href: "repertorio.html" },
    { label: "Canta", href: "canta.html" },
    { label: "Contacto", href: "contacto.html" }
  ],

  events: [
    {
      id: "concierto-navidad-2026",
      title: "Concierto de Navidad",
      eyebrow: "Próxima actuación destacada",
      date: "2026-12-21",
      time: "20:00",
      place: "Iglesia de San Vicente",
      city: "Zamora",
      address: "Iglesia de San Vicente, Zamora",
      type: "Concierto",
      status: "proximo",
      image: "assets/img/gallery/navidad-san-lazaro-cover.jpg",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=Iglesia%20de%20San%20Vicente%20Zamora",
      programUrl: "",
      short: "Una propuesta coral para cerrar el año con repertorio navideño, música sacra y piezas de tradición popular.",
      description: "Aures Cantibus ofrecerá un concierto de Navidad con una selección de obras corales vinculadas al tiempo litúrgico, al repertorio popular y a la tradición musical europea. La información exacta de programa, acceso y horario puede modificarse cuando la organización confirme todos los detalles.",
      featured: true
    },
    {
      id: "encuentro-coral-zamora-2026",
      title: "Encuentro Coral Ciudad de Zamora",
      eyebrow: "Encuentro coral",
      date: "2026-05-17",
      time: "19:30",
      place: "Auditorio por confirmar",
      city: "Zamora",
      address: "Zamora",
      type: "Encuentro coral",
      status: "proximo",
      image: "assets/img/gallery/encuentro-zamora-cover.jpg",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=Zamora",
      programUrl: "",
      short: "Encuentro de agrupaciones corales con repertorio variado y presencia de voces zamoranas.",
      description: "Encuentro de agrupaciones corales con repertorio variado y presencia de voces zamoranas. Sustituye estos datos por la información definitiva cuando el coro confirme el calendario.",
      featured: false
    },
    {
      id: "ramon-alvarez-2025",
      title: "Las huellas de Ramón Álvarez en la Pasión de Zamora",
      eyebrow: "Actuación realizada",
      date: "2025-03-24",
      time: "20:00",
      place: "Zamora",
      city: "Zamora",
      address: "Zamora",
      type: "Acto cultural",
      status: "realizado",
      image: "assets/img/gallery/ramon-alvarez-2025-cover.jpg",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=Zamora",
      programUrl: "",
      short: "Participación vinculada a la memoria patrimonial y musical de Zamora.",
      description: "Actuación incorporada al archivo del coro con título claro, contexto, lugar, fecha y acceso a galería fotográfica.",
      featured: false
    }
  ],

  galleries: [
    {
      id: "ramon-alvarez-2025",
      title: "Las huellas de Ramón Álvarez en la Pasión de Zamora",
      date: "2025-03-24",
      place: "Zamora",
      category: "Acto cultural",
      cover: "assets/img/gallery/ramon-alvarez-2025-cover.jpg",
      lead: "Memoria visual de una actuación vinculada al patrimonio, con fecha, lugar, contexto e imágenes navegables.",
      description: "Cada actuación se presenta como una pieza de archivo: imagen principal, contexto, lugar, fecha y fotografías navegables.",
      images: [
        { src: "assets/img/gallery/ramon-01.jpg", caption: "Vista general del coro durante la actuación" },
        { src: "assets/img/gallery/ramon-02.jpg", caption: "Dirección musical y conjunto vocal" },
        { src: "assets/img/gallery/ramon-03.jpg", caption: "Agrupación coral sobre escenario" },
        { src: "assets/img/gallery/ramon-04.jpg", caption: "Detalle de voces y carpetas corales" },
        { src: "assets/img/gallery/ramon-05.jpg", caption: "Momento central del programa" },
        { src: "assets/img/gallery/ramon-06.jpg", caption: "Archivo visual de Aures Cantibus" }
      ],
      featured: true
    },
    {
      id: "navidad-san-lazaro",
      title: "Concierto de Navidad · Archivo",
      date: "2024-12-22",
      place: "Zamora",
      category: "Navidad",
      cover: "assets/img/gallery/navidad-san-lazaro-cover.jpg",
      lead: "Repertorio navideño, música coral y tradición popular.",
      description: "Galería de ejemplo para conciertos navideños. Cambia las imágenes y el texto cuando tengas material real.",
      images: [
        { src: "assets/img/gallery/navidad-san-lazaro-cover.jpg", caption: "Concierto de Navidad" },
        { src: "assets/img/gallery/ramon-02.jpg", caption: "Canto coral" },
        { src: "assets/img/gallery/ramon-03.jpg", caption: "Archivo del coro" }
      ],
      featured: true
    },
    {
      id: "encuentro-zamora",
      title: "Encuentro Coral en Zamora",
      date: "2024-06-15",
      place: "Zamora",
      category: "Encuentro coral",
      cover: "assets/img/gallery/encuentro-zamora-cover.jpg",
      lead: "Participación en encuentros corales y proyectos compartidos.",
      description: "Modelo de galería para encuentros con otras agrupaciones.",
      images: [
        { src: "assets/img/gallery/encuentro-zamora-cover.jpg", caption: "Encuentro coral" },
        { src: "assets/img/gallery/ramon-04.jpg", caption: "Voces mixtas" },
        { src: "assets/img/gallery/ramon-05.jpg", caption: "Escenario" }
      ],
      featured: false
    },
    {
      id: "archivo-coral",
      title: "Archivo Coral Aures Cantibus",
      date: "2023-09-01",
      place: "Zamora y provincia",
      category: "Archivo",
      cover: "assets/img/gallery/archivo-coral-cover.jpg",
      lead: "Una memoria ordenada de actuaciones, viajes, encuentros y momentos de coro.",
      description: "Bloque de archivo para imágenes antiguas o colecciones no vinculadas a un único concierto.",
      images: [
        { src: "assets/img/gallery/archivo-coral-cover.jpg", caption: "Archivo coral" },
        { src: "assets/img/gallery/ramon-01.jpg", caption: "Memoria musical" },
        { src: "assets/img/gallery/ramon-06.jpg", caption: "Aures Cantibus" }
      ],
      featured: false
    }
  ],

  repertoire: [
    { title: "A la Nanita Nana", composer: "Popular de Málaga", category: "Nanas", origin: "España", period: "Popular" },
    { title: "Bajo los pliegues", composer: "E. Satué", category: "Nanas", origin: "España", period: "Contemporánea" },
    { title: "Canto de Berce", composer: "R. Groba", category: "Nanas", origin: "Galicia", period: "Contemporánea" },
    { title: "Nana para coro mixto", composer: "David Rivas", category: "Nanas", origin: "Zamora", period: "Contemporánea" },
    { title: "A la nanita nana", composer: "Villancico popular español", category: "Villancicos y Navidad", origin: "España", period: "Popular" },
    { title: "Adeste Fideles", composer: "Arm. E. Anton", category: "Villancicos y Navidad", origin: "Europa", period: "Tradicional" },
    { title: "Campana sobre campana", composer: "Arm. L. G. Farreny", category: "Villancicos y Navidad", origin: "Andalucía", period: "Popular" },
    { title: "Dadme albricias", composer: "Anónimo s. XVI", category: "Villancicos y Navidad", origin: "Cancionero de Upsala", period: "Renacimiento" },
    { title: "No la devemos dormir", composer: "Anónimo", category: "Villancicos y Navidad", origin: "Cancionero de Upsala", period: "Renacimiento" },
    { title: "Noche de paz", composer: "Popular alemán", category: "Villancicos y Navidad", origin: "Alemania", period: "Tradicional" },
    { title: "Noël ukrainien", composer: "Anónimo s. XVIII · adap. Oksana K.", category: "Villancicos y Navidad", origin: "Ucrania", period: "Tradicional" },
    { title: "Shchedryk", composer: "Mykola Leontóvych", category: "Villancicos y Navidad", origin: "Ucrania", period: "Siglo XX" },
    { title: "Verbum caro", composer: "Anónimo s. XVI", category: "Villancicos y Navidad", origin: "Cancionero de Upsala", period: "Renacimiento" },
    { title: "Bolero de Algodre", composer: "Canción popular de Zamora", category: "Canción popular", origin: "Zamora", period: "Popular" },
    { title: "Bullerengue", composer: "Ritmo colombiano", category: "Canción popular", origin: "Colombia", period: "Popular" },
    { title: "Camino del Indio", composer: "Popular", category: "Canción popular", origin: "Argentina", period: "Popular" },
    { title: "Flores de amor", composer: "Lorenzo García Morillas", category: "Canción popular", origin: "Habanera", period: "Popular" },
    { title: "Gaudeamus Igitur", composer: "Estudiantil tradicional", category: "Canción popular", origin: "Europa", period: "Tradicional" },
    { title: "Na Bahia Tem", composer: "Popular brasileña", category: "Canción popular", origin: "Brasil", period: "Popular" },
    { title: "Nerea izango zen", composer: "Popular vasca · arm. Javi Busto", category: "Canción popular", origin: "País Vasco", period: "Popular" },
    { title: "O voso galo comadre", composer: "Canción gallega", category: "Canción popular", origin: "Galicia", period: "Popular" },
    { title: "Ronda de Carballeda", composer: "Popular", category: "Canción popular", origin: "Zamora", period: "Popular" },
    { title: "Va pensiero", composer: "Giuseppe Verdi", category: "Grandes obras", origin: "Italia", period: "Romanticismo" },
    { title: "Agnus Dei · Missa Brevis", composer: "A. Lotti", category: "Música sacra", origin: "Italia", period: "Barroco" },
    { title: "Alleluia, Benedicat vobis", composer: "Haendel", category: "Música sacra", origin: "Europa", period: "Barroco" },
    { title: "Anima Christi", composer: "Marco Frisina", category: "Música sacra", origin: "Italia", period: "Contemporánea" },
    { title: "Ave María", composer: "J. Arcadelt", category: "Música sacra", origin: "Europa", period: "Renacimiento" },
    { title: "Ave María", composer: "David Rivas", category: "Música sacra", origin: "Zamora", period: "Contemporánea" },
    { title: "Ave María", composer: "Tomás Luis de Victoria", category: "Música sacra", origin: "España", period: "Renacimiento" },
    { title: "Ave Verum Corpus", composer: "E. Satué", category: "Música sacra", origin: "España", period: "Contemporánea" },
    { title: "Canticorum iubilo", composer: "Haendel", category: "Música sacra", origin: "Europa", period: "Barroco" },
    { title: "Dona nobis pacem", composer: "Mozart", category: "Música sacra", origin: "Austria", period: "Clasicismo" },
    { title: "Gabriel's Oboe", composer: "Ennio Morricone · arr. Paulo Rowlands", category: "Música sacra", origin: "Italia", period: "Contemporánea" },
    { title: "Pan divino y gracioso", composer: "Francisco Guerrero", category: "Música sacra", origin: "España", period: "Renacimiento" },
    { title: "Panis Angelicus", composer: "Hilarión Eslava", category: "Música sacra", origin: "España", period: "Romanticismo" },
    { title: "Stabat Mater", composer: "David Rivas", category: "Música sacra", origin: "Zamora", period: "Contemporánea" },
    { title: "Amor que me cautivas", composer: "Anónimo s. XVI", category: "Música antigua", origin: "España", period: "Renacimiento" },
    { title: "Ay linda amiga", composer: "Anónimo s. XVI", category: "Música antigua", origin: "España", period: "Renacimiento" },
    { title: "Ay luna que reluces", composer: "Anónimo s. XVI", category: "Música antigua", origin: "Cancionero de Upsala", period: "Renacimiento" },
    { title: "Ay triste que vengo", composer: "Juan del Encina", category: "Música antigua", origin: "España", period: "Renacimiento" },
    { title: "Con qué la lavaré", composer: "Juan Vásquez", category: "Música antigua", origin: "España", period: "Renacimiento" },
    { title: "Hoy comamos y bebamos", composer: "Juan del Encina", category: "Música antigua", origin: "España", period: "Renacimiento" },
    { title: "Il est bel et bon", composer: "Pierre Passereau", category: "Música antigua", origin: "Francia", period: "Renacimiento" },
    { title: "Mas vale trocar", composer: "Juan del Encina", category: "Música antigua", origin: "España", period: "Renacimiento" },
    { title: "Prado verde", composer: "Francisco Guerrero", category: "Música antigua", origin: "España", period: "Renacimiento" },
    { title: "Riu riu chiu", composer: "Anónimo s. XVI", category: "Música antigua", origin: "Cancionero de Upsala", period: "Renacimiento" },
    { title: "Tourdion", composer: "Pierre Attaingnant", category: "Música antigua", origin: "Francia", period: "Renacimiento" }
  ],

  timeline: [
    { year: "2000", title: "Fundación", text: "Una docena de vecinos del barrio de San Lázaro de Zamora comienza a reunirse para cantar juntos." },
    { year: "2000", title: "Primer concierto", text: "El primer concierto de la coral se celebra en Navidad, marcando el inicio de una trayectoria estable." },
    { year: "2000—hoy", title: "Crecimiento coral", text: "La agrupación se consolida como coro mixto con alrededor de cuarenta miembros y repertorio diverso." },
    { year: "Trayectoria", title: "Zamora, Castilla y León y Portugal", text: "Aures Cantibus actúa en Zamora, provincia, Comunidad Autónoma, Portugal y otros escenarios corales." },
    { year: "Proyectos", title: "Grandes colaboraciones", text: "Participación en proyectos con agrupaciones corales e instrumentales, orquestas y repertorio de mayor formato." }
  ],

  news: [
    {
      id: "nueva-web-aures-cantibus",
      title: "Nueva presencia digital de Aures Cantibus",
      date: "2026-06-28",
      image: "assets/img/hero-coro-warm.jpg",
      tag: "Actualidad",
      excerpt: "Una presencia digital más elegante para presentar agenda, galería, repertorio y contacto de la coral.",
      body: "La página oficial se plantea como un espacio sobrio, profesional y fácil de mantener, sin perder el carácter coral, patrimonial y zamorano de Aures Cantibus."
    },
    {
      id: "archivo-repertorio",
      title: "Repertorio ordenado por categorías",
      date: "2026-06-20",
      image: "assets/img/gallery/archivo-coral-cover.jpg",
      tag: "Repertorio",
      excerpt: "El repertorio se presenta con filtros por categoría, compositor, origen y época.",
      body: "La clasificación por categorías permite consultar rápidamente música sacra, villancicos, canción popular, nanas, música antigua y grandes obras."
    }
  ],

  faqs: [
    { q: "¿Hace falta experiencia previa?", a: "No es imprescindible tener trayectoria coral profesional, pero sí compromiso, oído, regularidad en ensayos y disposición para integrarse en un trabajo musical colectivo." },
    { q: "¿Qué voces forman el coro?", a: "Como coral mixta, Aures Cantibus trabaja con cuerdas de soprano, contralto, tenor y bajo. Si no sabes tu cuerda, puede valorarse en un primer contacto." },
    { q: "¿Se puede contratar al coro para un acto?", a: "Sí. La página de contacto permite solicitar información para conciertos, actos religiosos, encuentros corales, eventos culturales o colaboraciones institucionales." },
    { q: "¿Quién actualiza la web?", a: "El contenido está centralizado en assets/js/data.js. Cualquier persona con acceso al repositorio puede actualizar agenda, galerías, repertorio y noticias sin tocar la estructura HTML." }
  ]
};
