// Base de Datos de Recomendaciones Basadas en Investigación Científica y Libros Best-Sellers

const EXPERT_TIPS = [
  {
    id: 1,
    category: 'mental',
    title: 'La Regla de la Identidad y el Entorno',
    author: 'James Clear',
    book: 'Hábitos Atómicos (Atomic Habits)',
    science: 'Psicología Conductual & Neuroplasticidad',
    text: 'No te enfoques solo en lo que quieres lograr, sino en la persona en la que te quieres convertir. Cada hábito completado es un voto a favor de tu nueva identidad. Modifica tu entorno para que las señales de tus buenos hábitos sean obvias.',
    icon: '📘'
  },
  {
    id: 2,
    category: 'mental',
    title: 'La Regla de los 2 Minutos',
    author: 'James Clear',
    book: 'Hábitos Atómicos (Atomic Habits)',
    science: 'Reducción de Fricción Cognitiva',
    text: 'Cuando empieces un nuevo hábito, este debe tomar menos de 2 minutos completarlo (ej. 2 min de lectura o ponerse las zapatillas). Superar la inercia inicial activa el sistema de recompensa dopaminérgico.',
    icon: '⏱️'
  },
  {
    id: 3,
    category: 'sleep',
    title: 'La Regularidad Circadiana y la Temperatura',
    author: 'Dr. Matthew Walker (Director del Centro de Ciencia del Sueño de UC Berkeley)',
    book: 'Por Qué Dormimos (Why We Sleep)',
    science: 'Neurobiología del Sueño',
    text: 'Acostarse y despertarse a la misma hora todos los días es el factor #1 para estabilizar tu ritmo circadiano. Mantener la habitación a ~18°C y evitar luz azul 60 min antes de dormir maximiza la secreción de melatonina natural.',
    icon: '🌙'
  },
  {
    id: 4,
    category: 'fitness',
    title: 'Ejercicio en Zona 2 para Longevidad Mitocondrial',
    author: 'Dr. Peter Attia (Médico Especialista en Longevidad, Stanford & Johns Hopkins)',
    book: 'Outlive: La Ciencia y el Arte de la Longevidad',
    science: 'Fisiología Metabólica & Longevidad',
    text: 'Realizar entre 150 y 180 minutos semanales de ejercicio en Zona 2 (intensidad donde puedes hablar pero con esfuerzo) incrementa la densidad mitocondrial, mejora la sensibilidad a la insulina y reduce la mortalidad general.',
    icon: '🏃‍♂️'
  },
  {
    id: 5,
    category: 'fitness',
    title: 'Masa Muscular y Fuerza de Agarre como Indicadores de Salud',
    author: 'Dr. Peter Attia',
    book: 'Outlive: La Ciencia y el Arte de la Longevidad',
    science: 'Biomarcadores de Mortalidad',
    text: 'La fuerza de agarre y la masa muscular son dos de los predictores biométricos más potentes de longevidad y preservación funcional. Prioriza el entrenamiento de fuerza al menos 3 veces por semana.',
    icon: '🏋️‍♂️'
  },
  {
    id: 6,
    category: 'nutrition',
    title: 'El Orden de los Alimentos para Controlar picos de Glucosa',
    author: 'Jessie Inchauspé (Bioquímica)',
    book: 'La Revolución de la Glucosa (Glucose Revolution)',
    science: 'Bioquímica Nutricional',
    text: 'Comer primero las verduras/fibra, luego las proteínas y grasas, y al final los carbohidratos o azúcares reduce los picos de glucosa hasta en un 73% y los picos de insulina en un 48% en la misma comida.',
    icon: '🥗'
  },
  {
    id: 7,
    category: 'mental',
    title: 'El Bucle del Hábito: Señal, Rutina y Recompensa',
    author: 'Charles Duhigg (Premio Pulitzer)',
    book: 'El Poder del Hábito (The Power of Habit)',
    science: 'Neurobiología del Comportamiento en los Ganglios Basales',
    text: 'Para transformar un hábito, no luches contra la señal ni elimines la recompensa. Mantén la misma señal visual o temporal y la misma recompensa, pero sustituye la rutina intermedia por una acción saludable.',
    icon: '🔄'
  },
  {
    id: 8,
    category: 'nutrition',
    title: 'La Proteína y la Saciedad por Acción de la PYY y GLP-1',
    author: 'Dr. Michael Greger',
    book: 'Comer para No Morir (How Not to Die)',
    science: 'Endocrinología Gastrointestinal',
    text: 'Consumir de 25g a 40g de proteína magra en las comidas principales estimula la liberación de las hormonas de saciedad PYY y GLP-1, reduciendo los antojos de comida ultraprocesada durante el resto del día.',
    icon: '🍗'
  },
  {
    id: 9,
    category: 'mental',
    title: 'Completar el Ciclo Biológico del Estrés',
    author: 'Dra. Emily Nagoski & Dra. Amelia Nagoski',
    book: 'Burnout: El Secreto para Romper el Ciclo del Estrés',
    science: 'Fisiología del Sistema Nervioso Autónomo',
    text: 'El estrés físico permanece atrapado en el cuerpo aunque la causa psicológica haya terminado. 20 minutos de movimiento físico (caminar, correr), respiración diafragmática o risa profunda son necesarios para cerrar biológicamente el ciclo de estrés.',
    icon: '🧠'
  },
  {
    id: 10,
    category: 'hydration',
    title: 'Hidratación y Rendimiento Cognitivo',
    author: 'Dra. Stacy Sims (Fisióloga del Ejercicio y Nutricionista)',
    book: 'Roar: Match Your Training and Nutrition',
    science: 'Fisiología de la Deshidratación Celular',
    text: 'Una deshidratación leve de tan solo el 1.5% del volumen de agua corporal reduce la memoria de trabajo, aumenta la fatiga percibida y disminuye la capacidad de concentración hasta en un 25%. Consume 35ml por kg de peso.',
    icon: '💧'
  }
];

function getTipsByCategory(category = 'all') {
  if (category === 'all') return EXPERT_TIPS;
  return EXPERT_TIPS.filter(tip => tip.category === category);
}
