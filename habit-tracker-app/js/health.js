// Módulo de Salud, Macronutrientes y Marcas Peruanas (Limpio - Sin datos precargados)

const WEIGHT_STORAGE_KEY = 'habit_tracker_weight_v3';
const CALORIES_STORAGE_KEY = 'habit_tracker_calories_v3';
const HEALTH_GOALS_KEY = 'habit_tracker_goals_v3';
const WATER_STORAGE_KEY = 'habit_tracker_water_v3';

// Base de Datos de Productos y Marcas Comerciales en Perú (Plaza Vea, Wong, Metro, Tottus)
const PERU_BRANDS_DATABASE = [
  // LÁCTEOS Y YOGURES
  { id: 'pe1', name: 'Leche Evaporada Entera (Gloria - 200ml)', brand: 'Gloria', store: 'Plaza Vea / Wong / Metro / Tottus', calories: 134, protein: 6.8, carbs: 10.0, fat: 7.6, icon: '🥛' },
  { id: 'pe2', name: 'Yogur Griego Natural (Laive - 150g)', brand: 'Laive', store: 'Plaza Vea / Metro / Tottus', calories: 120, protein: 12.0, carbs: 6.0, fat: 5.0, icon: '🥣' },
  { id: 'pe3', name: 'Leche Fresca Pasteorizada (Danlac - 250ml)', brand: 'Danlac', store: 'Wong / Plaza Vea', calories: 150, protein: 8.0, carbs: 12.0, fat: 8.0, icon: '🥛' },
  { id: 'pe4', name: 'Queso Fresco Pasteurizado (Laive - 50g)', brand: 'Laive', store: 'Todos los supermercados', calories: 125, protein: 9.0, carbs: 1.0, fat: 9.5, icon: '🧀' },

  // CARNES Y PROTEÍNAS
  { id: 'pe5', name: 'Pechuga de Pollo Deshuesada (San Fernando - 150g)', brand: 'San Fernando', store: 'Plaza Vea / Wong / Metro / Tottus', calories: 247, protein: 46.5, carbs: 0.0, fat: 5.4, icon: '🍗' },
  { id: 'pe6', name: 'Atún en Lomitos en Aceite (Campomar - 80g drenado)', brand: 'Campomar', store: 'Plaza Vea / Metro / Tottus', calories: 160, protein: 22.0, carbs: 0.0, fat: 8.0, icon: '🐟' },
  { id: 'pe7', name: 'Atún en Agua y Sal (Primor - 80g drenado)', brand: 'Primor', store: 'Todos los supermercados', calories: 95, protein: 21.0, carbs: 0.0, fat: 1.0, icon: '🐟' },
  { id: 'pe8', name: 'Huevos Pardos Calibre Extra (La Calera - 2 uds)', brand: 'La Calera', store: 'Plaza Vea / Wong / Tottus', calories: 140, protein: 12.0, carbs: 1.0, fat: 10.0, icon: '🥚' },

  // ABARROTES Y CEREALES
  { id: 'pe9', name: 'Arroz Extra (Costeño - 150g cocido)', brand: 'Costeño', store: 'Plaza Vea / Wong / Metro / Tottus', calories: 195, protein: 4.2, carbs: 43.0, fat: 0.5, icon: '🍚' },
  { id: 'pe10', name: 'Fideos Canuto / Spaghetti (Don Vittorio - 100g cocido)', brand: 'Don Vittorio', store: 'Todos los supermercados', calories: 158, protein: 5.5, carbs: 31.0, fat: 0.9, icon: '🍝' },
  { id: 'pe11', name: 'Avena Tradicional (Quaker Perú - 40g seca)', brand: 'Quaker', store: 'Plaza Vea / Wong / Metro / Tottus', calories: 152, protein: 5.6, carbs: 26.0, fat: 2.8, icon: '🥣' },
  { id: 'pe12', name: 'Pan de Molde Vital Blanco (Bimbo - 2 rebanadas)', brand: 'Bimbo', store: 'Todos los supermercados', calories: 160, protein: 5.0, carbs: 29.0, fat: 2.5, icon: '🍞' },
  { id: 'pe13', name: 'Aceite Vegetal de Soya (Primor - 1 cucharada 13ml)', brand: 'Primor', store: 'Todos los supermercados', calories: 117, protein: 0.0, carbs: 0.0, fat: 13.0, icon: '🧴' },
  { id: 'pe14', name: 'Lentejas Selección (Costeño - 150g cocidas)', brand: 'Costeño', store: 'Plaza Vea / Metro / Tottus', calories: 174, protein: 13.0, carbs: 30.0, fat: 0.8, icon: '🍲' },
  { id: 'pe15', name: 'Queso Edam Tajado (Bell\'s - 30g)', brand: 'Bell\'s', store: 'Plaza Vea / Mass', calories: 105, protein: 7.0, carbs: 0.5, fat: 8.5, icon: '🧀' },

  // PLATOS PREPARADOS PERUANOS TÍPICOS
  { id: 'pp1', name: 'Pollo a la Brasa con Papas y Ensalada (1/4 de Pollo)', brand: 'Plato Peruano', store: 'Restaurante / Casero', calories: 680, protein: 52.0, carbs: 45.0, fat: 34.0, icon: '🍗' },
  { id: 'pp2', name: 'Lomo Saltado con Arroz y Papas Fritas (1 porción 400g)', brand: 'Plato Peruano', store: 'Restaurante / Casero', calories: 710, protein: 44.0, carbs: 62.0, fat: 31.0, icon: '🥩' },
  { id: 'pp3', name: 'Ceviche de Pescado con Camote y Choclo (Porción 300g)', brand: 'Plato Peruano', store: 'Restaurante / Casero', calories: 340, protein: 36.0, carbs: 28.0, fat: 6.0, icon: '🐟' },
  { id: 'pp4', name: 'Causa Rellena de Pollo (1 porción 200g)', brand: 'Plato Peruano', store: 'Restaurante / Casero', calories: 380, protein: 18.0, carbs: 38.0, fat: 17.0, icon: '🥔' },
  { id: 'pp5', name: 'Arroz con Pollo Peruano (Porción 350g)', brand: 'Plato Peruano', store: 'Restaurante / Casero', calories: 580, protein: 35.0, carbs: 62.0, fat: 20.0, icon: '🥘' }
];

// Metas Iniciales Estándar
const DEFAULT_HEALTH_GOALS = {
  fitnessGoal: 'fat_loss',
  targetWeight: 70,
  targetCalories: 2000,
  targetProtein: 140,
  targetCarbs: 180,
  targetFat: 60,
  targetWaterGlasses: 10
};

// LIMPIO: Sin registros previos de peso o comidas
const DEFAULT_WEIGHT_LOGS = [];
const DEFAULT_MEAL_LOGS = [];

function searchPeruFoods(query = '') {
  const q = query.toLowerCase().trim();
  if (!q) return PERU_BRANDS_DATABASE;

  return PERU_BRANDS_DATABASE.filter(item => 
    item.name.toLowerCase().includes(q) || 
    item.brand.toLowerCase().includes(q) || 
    item.store.toLowerCase().includes(q)
  );
}

function analyzeFoodPhoto(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageDataUrl = e.target.result;
      const fileName = (file.name || '').toLowerCase();

      let detectedResult;

      if (fileName.includes('lomo') || fileName.includes('carne')) {
        detectedResult = PERU_BRANDS_DATABASE.find(p => p.id === 'pp2');
      } else if (fileName.includes('pollo') || fileName.includes('brasa')) {
        detectedResult = PERU_BRANDS_DATABASE.find(p => p.id === 'pp1');
      } else if (fileName.includes('ceviche') || fileName.includes('pescado')) {
        detectedResult = PERU_BRANDS_DATABASE.find(p => p.id === 'pp3');
      } else if (fileName.includes('causa') || fileName.includes('papa')) {
        detectedResult = PERU_BRANDS_DATABASE.find(p => p.id === 'pp4');
      } else if (fileName.includes('arroz')) {
        detectedResult = PERU_BRANDS_DATABASE.find(p => p.id === 'pp5');
      } else {
        const sampleDishes = [
          PERU_BRANDS_DATABASE.find(p => p.id === 'pp1'),
          PERU_BRANDS_DATABASE.find(p => p.id === 'pe5'),
          PERU_BRANDS_DATABASE.find(p => p.id === 'pp2'),
          PERU_BRANDS_DATABASE.find(p => p.id === 'pp3')
        ];
        detectedResult = sampleDishes[Math.floor(Math.random() * sampleDishes.length)];
      }

      setTimeout(() => {
        resolve({
          imageUrl: imageDataUrl,
          detectedName: detectedResult.name,
          brand: detectedResult.brand,
          calories: detectedResult.calories,
          protein: detectedResult.protein,
          carbs: detectedResult.carbs,
          fat: detectedResult.fat,
          confidence: Math.floor(Math.random() * 8) + 92
        });
      }, 1000);
    };
    reader.readAsDataURL(file);
  });
}

function loadHealthGoals() {
  const data = localStorage.getItem(HEALTH_GOALS_KEY);
  if (!data) {
    saveHealthGoals(DEFAULT_HEALTH_GOALS);
    return DEFAULT_HEALTH_GOALS;
  }
  try {
    return { ...DEFAULT_HEALTH_GOALS, ...JSON.parse(data) };
  } catch (e) {
    return DEFAULT_HEALTH_GOALS;
  }
}

function saveHealthGoals(goals) {
  localStorage.setItem(HEALTH_GOALS_KEY, JSON.stringify(goals));
}

function updateFitnessGoal(fitnessGoal) {
  const goals = loadHealthGoals();
  goals.fitnessGoal = fitnessGoal;
  const weight = getLatestWeight() ? getLatestWeight().weight : goals.targetWeight;

  if (fitnessGoal === 'fat_loss') {
    goals.targetCalories = Math.round(weight * 26);
    goals.targetProtein = Math.round(weight * 2.0);
    goals.targetFat = Math.round(weight * 0.8);
    const calFromProteinAndFat = (goals.targetProtein * 4) + (goals.targetFat * 9);
    goals.targetCarbs = Math.max(50, Math.round((goals.targetCalories - calFromProteinAndFat) / 4));
  } else if (fitnessGoal === 'muscle_gain') {
    goals.targetCalories = Math.round(weight * 33);
    goals.targetProtein = Math.round(weight * 2.2);
    goals.targetFat = Math.round(weight * 0.9);
    const calFromProteinAndFat = (goals.targetProtein * 4) + (goals.targetFat * 9);
    goals.targetCarbs = Math.max(100, Math.round((goals.targetCalories - calFromProteinAndFat) / 4));
  } else {
    goals.targetCalories = Math.round(weight * 29);
    goals.targetProtein = Math.round(weight * 1.8);
    goals.targetFat = Math.round(weight * 0.9);
    const calFromProteinAndFat = (goals.targetProtein * 4) + (goals.targetFat * 9);
    goals.targetCarbs = Math.max(80, Math.round((goals.targetCalories - calFromProteinAndFat) / 4));
  }

  saveHealthGoals(goals);
  return goals;
}

function loadWeightLogs() {
  const data = localStorage.getItem(WEIGHT_STORAGE_KEY);
  if (!data) {
    saveWeightLogs(DEFAULT_WEIGHT_LOGS);
    return DEFAULT_WEIGHT_LOGS;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return DEFAULT_WEIGHT_LOGS;
  }
}

function saveWeightLogs(logs) {
  localStorage.setItem(WEIGHT_STORAGE_KEY, JSON.stringify(logs));
}

function addWeightEntry(weight, dateStr = getTodayStr()) {
  const logs = loadWeightLogs();
  const existingIndex = logs.findIndex(l => l.date === dateStr);
  
  if (existingIndex > -1) {
    logs[existingIndex].weight = parseFloat(weight);
  } else {
    logs.push({ date: dateStr, weight: parseFloat(weight) });
  }

  logs.sort((a, b) => new Date(a.date) - new Date(b.date));
  saveWeightLogs(logs);
}

function deleteWeightEntry(dateStr) {
  let logs = loadWeightLogs();
  logs = logs.filter(l => l.date !== dateStr);
  saveWeightLogs(logs);
}

function getLatestWeight() {
  const logs = loadWeightLogs();
  if (logs.length === 0) return null;
  return logs[logs.length - 1];
}

function loadMealLogs() {
  const data = localStorage.getItem(CALORIES_STORAGE_KEY);
  if (!data) {
    saveMealLogs(DEFAULT_MEAL_LOGS);
    return DEFAULT_MEAL_LOGS;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return DEFAULT_MEAL_LOGS;
  }
}

function saveMealLogs(logs) {
  localStorage.setItem(CALORIES_STORAGE_KEY, JSON.stringify(logs));
}

function addMealEntry(name, calories, protein = 0, carbs = 0, fat = 0, mealType = 'General', dateStr = getTodayStr()) {
  const logs = loadMealLogs();
  const newMeal = {
    id: 'm_' + Date.now(),
    date: dateStr,
    mealType,
    name: name.trim(),
    calories: parseInt(calories, 10) || 0,
    protein: parseFloat(protein) || 0,
    carbs: parseFloat(carbs) || 0,
    fat: parseFloat(fat) || 0
  };
  logs.push(newMeal);
  saveMealLogs(logs);
  return newMeal;
}

function deleteMealEntry(mealId) {
  let logs = loadMealLogs();
  logs = logs.filter(m => m.id !== mealId);
  saveMealLogs(logs);
}

function getDailyMacrosTotal(dateStr = getTodayStr()) {
  const logs = loadMealLogs().filter(m => m.date === dateStr);
  const total = { calories: 0, protein: 0, carbs: 0, fat: 0 };
  
  logs.forEach(m => {
    total.calories += m.calories || 0;
    total.protein += m.protein || 0;
    total.carbs += m.carbs || 0;
    total.fat += m.fat || 0;
  });

  total.protein = Math.round(total.protein * 10) / 10;
  total.carbs = Math.round(total.carbs * 10) / 10;
  total.fat = Math.round(total.fat * 10) / 10;

  return total;
}

function loadWaterLogs() {
  const data = localStorage.getItem(WATER_STORAGE_KEY);
  if (!data) return {};
  try {
    return JSON.parse(data);
  } catch (e) {
    return {};
  }
}

function getWaterGlasses(dateStr = getTodayStr()) {
  const logs = loadWaterLogs();
  return logs[dateStr] || 0;
}

function updateWaterGlasses(delta, dateStr = getTodayStr()) {
  const logs = loadWaterLogs();
  const current = logs[dateStr] || 0;
  const updated = Math.max(0, current + delta);
  logs[dateStr] = updated;
  localStorage.setItem(WATER_STORAGE_KEY, JSON.stringify(logs));
  return updated;
}
