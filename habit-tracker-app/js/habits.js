// Módulo de Gestión de Hábitos (Limpio - Sin datos de prueba)

const HABITS_STORAGE_KEY = 'habit_tracker_habits_v2';

// Arreglo vacío por defecto para que el usuario empiece desde cero
const DEFAULT_HABITS = [];

function loadHabits() {
  const data = localStorage.getItem(HABITS_STORAGE_KEY);
  if (!data) {
    saveHabits(DEFAULT_HABITS);
    return DEFAULT_HABITS;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return DEFAULT_HABITS;
  }
}

function saveHabits(habits) {
  localStorage.setItem(HABITS_STORAGE_KEY, JSON.stringify(habits));
}

function createHabit(title, category, icon = '🎯') {
  const habits = loadHabits();
  const newHabit = {
    id: 'h_' + Date.now(),
    title: title.trim(),
    category: category || 'general',
    frequency: 'daily',
    icon: icon || '🎯',
    createdAt: new Date().toISOString(),
    completedDates: []
  };
  habits.push(newHabit);
  saveHabits(habits);
  return newHabit;
}

function deleteHabit(habitId) {
  let habits = loadHabits();
  habits = habits.filter(h => h.id !== habitId);
  saveHabits(habits);
}

function toggleHabitCompletion(habitId, dateStr = getTodayStr()) {
  const habits = loadHabits();
  const habit = habits.find(h => h.id === habitId);
  if (!habit) return null;

  const index = habit.completedDates.indexOf(dateStr);
  if (index > -1) {
    habit.completedDates.splice(index, 1);
  } else {
    habit.completedDates.push(dateStr);
  }

  saveHabits(habits);
  return habit;
}

function getTodayStr() {
  const today = new Date();
  return formatDateStr(today);
}

function formatDateStr(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function calculateStreak(habit) {
  if (!habit || !habit.completedDates || habit.completedDates.length === 0) {
    return { currentStreak: 0, bestStreak: 0 };
  }

  const sortedDates = [...habit.completedDates].sort().reverse();
  const todayStr = getTodayStr();

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = formatDateStr(yesterday);

  let currentStreak = 0;
  let checkDate = new Date();

  if (!sortedDates.includes(todayStr) && sortedDates.includes(yesterdayStr)) {
    checkDate = yesterday;
  }

  while (true) {
    const checkStr = formatDateStr(checkDate);
    if (sortedDates.includes(checkStr)) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  let bestStreak = 0;
  let tempStreak = 0;
  const chronological = [...habit.completedDates].sort();

  for (let i = 0; i < chronological.length; i++) {
    if (i === 0) {
      tempStreak = 1;
    } else {
      const prevDate = new Date(chronological[i - 1]);
      const currDate = new Date(chronological[i]);
      const diffTime = Math.abs(currDate - prevDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        tempStreak++;
      } else if (diffDays > 1) {
        tempStreak = 1;
      }
    }
    if (tempStreak > bestStreak) bestStreak = tempStreak;
  }

  return { currentStreak, bestStreak };
}

function getHabitsWeeklyStats() {
  const habits = loadHabits();
  const days = [];
  const counts = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const dStr = formatDateStr(d);
    const dayName = d.toLocaleDateString('es-ES', { weekday: 'short' });
    days.push(dayName);

    let completedCount = 0;
    habits.forEach(h => {
      if (h.completedDates.includes(dStr)) {
        completedCount++;
      }
    });
    counts.push(completedCount);
  }

  return { labels: days, data: counts, totalHabits: habits.length };
}
