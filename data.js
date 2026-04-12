// =========================================================
// DATA.JS — Preguntas, jugadores y penitencias editables
// =========================================================

const DEFAULT_PLAYERS = [
  { id: 1, name: "Luz Angélica Cañavera", emoji: "🌊", color: "#4FC3F7" },
  { id: 2, name: "Duvan Durango", emoji: "🌿", color: "#81C784" },
  { id: 3, name: "Natalhy Gamarra", emoji: "🌸", color: "#F48FB1" },
  { id: 4, name: "Deimer García", emoji: "⚡", color: "#FFD54F" },
  { id: 5, name: "Samuel Herrera", emoji: "🔥", color: "#FF8A65" },
  { id: 6, name: "Emanuel Herrera", emoji: "🌙", color: "#CE93D8" },
  { id: 7, name: "Eduin Jiménez", emoji: "🏔️", color: "#80CBC4" },
  { id: 8, name: "Ebert Layonet", emoji: "💎", color: "#90CAF9" },
  { id: 9, name: "Roberto Mass", emoji: "🦁", color: "#FFAB40" },
  { id: 10, name: "Mara Polo", emoji: "🌺", color: "#EF9A9A" },
  { id: 11, name: "Cristian Sáenz", emoji: "🐋", color: "#80DEEA" },
  { id: 12, name: "David Tirado", emoji: "🦅", color: "#A5D6A7" },
  { id: 13, name: "Isabela Tordecilla", emoji: "✨", color: "#FFF59D" },
  { id: 14, name: "María Villalobos", emoji: "🦋", color: "#F8BBD9" },
];

const DEFAULT_QUESTIONS = [
  // ===== CONCEPTOS BÁSICOS =====
  {
    id: 1,
    category: "🔬 Conceptos",
    difficulty: 1,
    text: "¿Qué describe mejor el concepto de TRANSPORTE de contaminantes?",
    correct: "El movimiento físico del contaminante desde su punto de emisión",
    wrong: [
      "La dilución del contaminante en el ambiente",
      "La transformación química del contaminante",
      "La absorción del contaminante por el suelo"
    ],
    explanation: "El transporte es el movimiento físico del contaminante. La DISPERSIÓN es la que describe su dilución y distribución."
  },
  {
    id: 2,
    category: "🔬 Conceptos",
    difficulty: 1,
    text: "¿Cómo se define la LIXIVIACIÓN?",
    correct: "El agua que se filtra en el suelo transportando contaminantes hacia aguas subterráneas",
    wrong: [
      "La evaporación de contaminantes desde el suelo a la atmósfera",
      "El movimiento horizontal del aire que arrastra partículas",
      "La absorción de contaminantes por las raíces de las plantas"
    ],
    explanation: "La lixiviación ocurre cuando el agua de lluvia o riego se infiltra, arrastrando sustancias hacia los acuíferos subterráneos."
  },
  {
    id: 3,
    category: "🔬 Conceptos",
    difficulty: 2,
    text: "¿Qué es una PLUMA en el contexto de contaminación?",
    correct: "Flujo disperso de contaminante desde una fuente puntual hacia la atmósfera o cuerpos de agua",
    wrong: [
      "Instrumento para medir la concentración de contaminantes en el aire",
      "Tipo de microorganismo que degrada contaminantes orgánicos",
      "Barrera física que impide la dispersión de contaminantes"
    ],
    explanation: "Una pluma es el rastro visible o invisible que deja un contaminante al ser liberado desde una fuente específica, como el humo de una chimenea."
  },
  {
    id: 4,
    category: "🔬 Conceptos",
    difficulty: 1,
    text: "¿Qué es la ADVECCIÓN?",
    correct: "Transporte horizontal de una sustancia debido al movimiento masivo del fluido",
    wrong: [
      "Movimiento vertical del aire por diferencias de temperatura",
      "Proceso de descomposición biológica de contaminantes",
      "Filtración de contaminantes a través de membranas"
    ],
    explanation: "La advección es el transporte horizontal (en ríos o el viento), mientras que la convección es el movimiento vertical."
  },

  // ===== ATMÓSFERA =====
  {
    id: 5,
    category: "🌬️ Atmósfera",
    difficulty: 2,
    text: "¿Qué factor meteorológico actúa como 'lavado' atmosférico, atrapando partículas y llevándolas al suelo?",
    correct: "La humedad y precipitación",
    wrong: [
      "La radiación solar",
      "La turbulencia atmosférica",
      "La temperatura del aire"
    ],
    explanation: "La lluvia actúa como un purificador natural: las gotas atrapan partículas contaminantes y las depositan en el suelo, proceso llamado deposición húmeda."
  },
  {
    id: 6,
    category: "🌬️ Atmósfera",
    difficulty: 2,
    text: "¿Qué ocurre con los contaminantes atmosféricos durante una INVERSIÓN TÉRMICA?",
    correct: "Se acumulan cerca de la superficie porque la mezcla vertical se limita",
    wrong: [
      "Se dispersan rápidamente hacia las capas altas de la atmósfera",
      "Se transforman en contaminantes secundarios por reacciones fotoquímicas",
      "Se depositan en el suelo por efecto de la gravedad"
    ],
    explanation: "En una inversión térmica, una capa de aire caliente actúa como 'tapa', impidiendo que los contaminantes suban, generando smog en las ciudades."
  },
  {
    id: 7,
    category: "🌬️ Atmósfera",
    difficulty: 3,
    text: "Según el artículo sobre Valledupar, ¿qué tipo de vehículo emitió la mayor cantidad de CO y PM10?",
    correct: "Las motocicletas",
    wrong: [
      "Los automóviles particulares",
      "Los buses de transporte público",
      "Los camiones de carga pesada"
    ],
    explanation: "El estudio mostró que las motocicletas son las mayores emisoras de CO y PM10, mientras que los automóviles lideran en SOx, NOx y CO2."
  },
  {
    id: 8,
    category: "🌬️ Atmósfera",
    difficulty: 2,
    text: "¿Cómo la TOPOGRAFÍA puede empeorar la contaminación del aire en una ciudad?",
    correct: "Los valles actúan como muros que atrapan el smog, impidiendo la dispersión lateral",
    wrong: [
      "Las montañas aceleran los vientos y aumentan la dispersión de contaminantes",
      "Los valles generan turbulencia que dispersa los contaminantes uniformemente",
      "La topografía no tiene efecto significativo en la dispersión atmosférica"
    ],
    explanation: "Ciudades como Ciudad de México o Medellín, ubicadas en valles, sufren más contaminación porque la orografía atrapa los contaminantes."
  },
  {
    id: 9,
    category: "🌬️ Atmósfera",
    difficulty: 3,
    text: "En Valledupar, ¿hacia dónde se desplazan los contaminantes durante la temporada LLUVIOSA?",
    correct: "Hacia el noreste",
    wrong: [
      "Hacia el sureste",
      "Hacia el suroeste",
      "Hacia el noroeste"
    ],
    explanation: "El modelo HYSPLIT mostró que en temporada lluviosa los contaminantes van al noreste, mientras que en seca van al sureste, según los patrones de viento."
  },

  // ===== AGUA =====
  {
    id: 10,
    category: "💧 Agua",
    difficulty: 1,
    text: "¿Cuál es el orden correcto de las etapas de tratamiento de aguas residuales?",
    correct: "Primario → Secundario → Terciario",
    wrong: [
      "Biológico → Físico → Químico",
      "Terciario → Primario → Secundario",
      "Filtración → Sedimentación → Desinfección"
    ],
    explanation: "El tratamiento avanza de los procesos físicos simples (primario) a los biológicos (secundario) y finalmente a la eliminación de contaminantes específicos (terciario)."
  },
  {
    id: 11,
    category: "💧 Agua",
    difficulty: 2,
    text: "¿Qué porcentaje de materia orgánica puede eliminar el tratamiento SECUNDARIO de aguas?",
    correct: "Entre un 30% y un 60%",
    wrong: [
      "Entre un 80% y un 95%",
      "Entre un 10% y un 20%",
      "El 100% de la materia orgánica"
    ],
    explanation: "El tratamiento secundario usa microorganismos (bacterias) para degradar materia orgánica, pero no es 100% eficiente. Para contaminantes específicos se necesita el terciario."
  },
  {
    id: 12,
    category: "💧 Agua",
    difficulty: 2,
    text: "¿Cuál es el objetivo principal del tratamiento TERCIARIO del agua?",
    correct: "Eliminar contaminantes específicos como nutrientes, metales pesados y patógenos no removidos antes",
    wrong: [
      "Remover sólidos en suspensión y materiales flotantes mediante sedimentación",
      "Degradar materia orgánica usando bacterias y microorganismos",
      "Neutralizar el pH del agua para consumo humano"
    ],
    explanation: "El terciario o tratamiento avanzado usa técnicas como desinfección con cloro u ozono, filtración avanzada e intercambio iónico para contaminantes persistentes."
  },
  {
    id: 13,
    category: "💧 Agua",
    difficulty: 3,
    text: "¿Qué proceso del tratamiento de agua AGRUPA partículas finas para facilitar su eliminación?",
    correct: "Coagulación y floculación",
    wrong: [
      "Oxidación y reducción química",
      "Biofiltración con microorganismos",
      "Intercambio iónico"
    ],
    explanation: "La coagulación añade químicos que neutralizan las cargas de las partículas, y la floculación las une en flóculos más grandes que pueden sedimentar o filtrarse."
  },

  // ===== SUELO =====
  {
    id: 14,
    category: "🌱 Suelo",
    difficulty: 1,
    text: "¿Qué tipo de suelo permite un transporte MÁS RÁPIDO de contaminantes hacia los acuíferos?",
    correct: "Suelos arenosos, por su alta porosidad y permeabilidad",
    wrong: [
      "Suelos arcillosos, por su baja permeabilidad que actúa como filtro",
      "Suelos rocosos, por su superficie impermeable",
      "Suelos orgánicos, por su alta capacidad de adsorción"
    ],
    explanation: "Los suelos arenosos tienen poros grandes que dejan pasar el agua rápidamente. Las arcillas, en cambio, actúan como filtro y retardan el movimiento."
  },
  {
    id: 15,
    category: "🌱 Suelo",
    difficulty: 2,
    text: "¿En qué se diferencia la BIORREMEDIACIÓN de la FITORREMEDIACIÓN?",
    correct: "La biorremediación usa microorganismos (bacterias/hongos), la fitorremediación usa plantas",
    wrong: [
      "La biorremediación usa plantas, la fitorremediación usa microorganismos",
      "La biorremediación aplica calor, la fitorremediación aplica químicos oxidantes",
      "Son el mismo proceso con nombres distintos"
    ],
    explanation: "Ambas son técnicas biológicas y sostenibles: la biorremediación usa bacterias y hongos para degradar contaminantes; la fitorremediación usa plantas que los absorben o transforman."
  },
  {
    id: 16,
    category: "🌱 Suelo",
    difficulty: 2,
    text: "¿Cuál técnica de remediación de suelos es COSTOSA pero logra alta descontaminación en poco tiempo?",
    correct: "Los tratamientos térmicos (altas temperaturas)",
    wrong: [
      "La fitorremediación con plantas hiperacumuladoras",
      "La biorremediación con bacterias nativas",
      "El encapsulamiento o confinamiento del suelo"
    ],
    explanation: "Los tratamientos térmicos destruyen o volatilizan contaminantes muy efectivamente, pero su alto costo energético limita su uso a casos de contaminación severa."
  },
  {
    id: 17,
    category: "🌱 Suelo",
    difficulty: 3,
    text: "¿Qué diferencia a una remediación IN SITU de una EX SITU?",
    correct: "In situ trata el suelo en el lugar; ex situ requiere excavar el suelo y tratarlo fuera",
    wrong: [
      "In situ usa solo métodos biológicos; ex situ solo métodos químicos",
      "In situ es para suelos arenosos; ex situ para suelos arcillosos",
      "In situ es más costoso; ex situ es más barato"
    ],
    explanation: "La decisión depende del tipo de contaminante, profundidad y extensión. El in situ es menos disruptivo pero más lento; el ex situ da más control pero es más invasivo."
  },

  // ===== TRATAMIENTO AIRE =====
  {
    id: 18,
    category: "🏭 Tratamiento",
    difficulty: 2,
    text: "¿Qué tecnología de tratamiento del aire se basa en MICROORGANISMOS para degradar contaminantes de forma natural?",
    correct: "La biofiltración",
    wrong: [
      "La oxidación catalítica",
      "Los lavadores de gases (scrubbers)",
      "La reducción catalítica selectiva (SCR)"
    ],
    explanation: "La biofiltración es especialmente útil para olores y compuestos como el ácido sulfhídrico. Es económica y sostenible comparada con procesos químicos."
  },
  {
    id: 19,
    category: "🏭 Tratamiento",
    difficulty: 3,
    text: "¿Cuál es la diferencia principal entre el tratamiento ambiental y la CORRECCIÓN ambiental?",
    correct: "El tratamiento reduce o neutraliza contaminantes; la corrección busca restaurar las condiciones originales del medio",
    wrong: [
      "El tratamiento se aplica al agua; la corrección se aplica al suelo",
      "El tratamiento es preventivo; la corrección es obligatorio por ley",
      "El tratamiento usa tecnología; la corrección usa solo métodos naturales"
    ],
    explanation: "Ambos actúan después de que el daño ocurrió, pero el tratamiento mitiga y la corrección restaura. Son complementarios en la gestión ambiental integral."
  },
  {
    id: 20,
    category: "🏭 Tratamiento",
    difficulty: 2,
    text: "¿Qué proceso conecta la atmósfera con el suelo y el agua, permitiendo que contaminantes atmosféricos 'aterricen'?",
    correct: "La deposición (húmeda y seca)",
    wrong: [
      "La volatilización y evaporación",
      "La turbulencia atmosférica",
      "La advección horizontal"
    ],
    explanation: "La deposición húmeda (lluvia) y seca (polvo) transfieren contaminantes del aire al suelo y agua. La volatilización hace el proceso inverso."
  },

  // ===== RETOS ESPECIALES =====
  {
    id: 21,
    category: "⚡ Reto",
    difficulty: 3,
    text: "¡RETO EN VIVO! En 30 segundos, el jugador debe explicar con SUS PROPIAS PALABRAS qué es el modelo HYSPLIT y para qué se usó en el estudio de Valledupar.",
    correct: "RETO ORAL",
    wrong: [],
    explanation: "HYSPLIT (Hybrid Single Particle Lagrangian Integrated Trajectory) es un modelo computacional que simula y analiza las trayectorias de partículas en la atmósfera, permitiendo predecir hacia dónde se moverán los contaminantes.",
    isReto: true
  },
  {
    id: 22,
    category: "⚡ Reto",
    difficulty: 3,
    text: "¡RETO GRUPAL! El grupo debe señalar en el mapa imaginario de Valledupar hacia dónde van los contaminantes en temporada SECA y LLUVIOSA. ¡Dibújenlo en el aire!",
    correct: "RETO ORAL",
    wrong: [],
    explanation: "Temporada lluviosa → Noreste. Temporada seca → Sureste. El patrón se invierte porque los vientos cambian con las estaciones.",
    isReto: true
  },
  {
    id: 23,
    category: "🏭 Tratamiento",
    difficulty: 3,
    text: "¿Cuáles son los efectos FÍSICOS y MENTALES que el ruido puede provocar en las personas, según el artículo sobre contaminación auditiva?",
    correct: "Estrés, afectación a la salud física y mental por sonido indeseable constante",
    wrong: [
      "Solo pérdida auditiva temporal sin efectos en el bienestar",
      "Únicamente efectos positivos de adaptación sensorial",
      "Aumento de la productividad por estimulación sonora"
    ],
    explanation: "El ruido constante provoca estrés y afecta la salud física y mental. El artículo lo define como 'todo sonido indeseable que afecta o perjudica a las personas'."
  },
  {
    id: 24,
    category: "🔬 Conceptos",
    difficulty: 2,
    text: "¿Qué proceso ocurre cuando la radiación solar activa reacciones químicas en el aire con contaminantes primarios?",
    correct: "Se forman contaminantes secundarios (reacciones fotoquímicas)",
    wrong: [
      "Los contaminantes se destruyen y desaparecen",
      "El viento aumenta su velocidad dispersando todo más rápido",
      "La humedad relativa baja, concentrando más los contaminantes"
    ],
    explanation: "Los contaminantes secundarios como el ozono troposférico y el smog fotoquímico se forman cuando la luz solar reacciona con NOx y compuestos orgánicos volátiles."
  },
  {
    id: 25,
    category: "🌬️ Atmósfera",
    difficulty: 3,
    text: "Según las estadísticas del artículo sobre Valledupar, ¿en qué porcentaje creció el parque vehicular de ciudades intermedias colombianas como Valledupar desde 2008?",
    correct: "Un 74%",
    wrong: [
      "Un 45%",
      "Un 120%",
      "Un 30%"
    ],
    explanation: "Este crecimiento del 74% explica por qué las ciudades intermedias son ahora foco de preocupación ambiental. El transporte vehicular domina las emisiones urbanas."
  }
];

const DEFAULT_PENALTIES = [
  "🎤 Canta los primeros 10 segundos de tu canción favorita",
  "🦆 Camina como pato por 15 segundos",
  "🎭 Actúa como un contaminante que viaja en el viento (30 seg)",
  "🤔 Di 5 cosas que ves en el salón que empiecen con la misma letra que tu nombre",
  "💃 Baila al ritmo de un compañero que tararea una canción",
  "🐸 Salta como rana 10 veces diciendo 'lixiviación' en cada salto",
  "🤸 Haz 5 estrellas de mar saltando",
  "📢 Explica qué es la advección con voz de locutor de radio",
  "😂 Cuenta un chiste de ingeniería (aunque sea malo)",
  "🎨 Dibuja una pluma contaminante en el aire con el dedo",
  "🐌 Habla en cámara lenta durante 20 segundos",
  "🦁 Ruge como un microorganismo que come contaminantes",
  "🎯 Nombra 3 tecnologías de tratamiento del aire en 10 segundos",
  "🌊 Imita el sonido y movimiento de un río contaminado",
  "🤖 Habla como un robot que explica la biofiltración"
];

// Estado del juego guardado en localStorage para persistencia
function loadGameData() {
  const saved = localStorage.getItem('ecoChallenge_data');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch(e) {}
  }
  return {
    players: JSON.parse(JSON.stringify(DEFAULT_PLAYERS)),
    questions: JSON.parse(JSON.stringify(DEFAULT_QUESTIONS)),
    penalties: [...DEFAULT_PENALTIES]
  };
}

function saveGameData(data) {
  localStorage.setItem('ecoChallenge_data', JSON.stringify(data));
}

let GAME_DATA = loadGameData();
