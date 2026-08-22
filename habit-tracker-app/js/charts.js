// Módulo de Renderizado de Gráficos con Chart.js (Estilo Fitia)

let habitsChartInstance = null;
let weightChartInstance = null;
let calorieChartInstance = null;
let macroChartInstance = null;

function renderHabitsChart(canvasId) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return;

  const stats = getHabitsWeeklyStats();

  if (habitsChartInstance) {
    habitsChartInstance.destroy();
  }

  habitsChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: stats.labels,
      datasets: [{
        label: 'Hábitos Completados',
        data: stats.data,
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderColor: '#10B981',
        borderWidth: 2,
        borderRadius: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { stepSize: 1, precision: 0 },
          grid: { color: 'rgba(255, 255, 255, 0.05)' }
        },
        x: { grid: { display: false } }
      }
    }
  });
}

function renderWeightChart(canvasId) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return;

  const logs = loadWeightLogs();
  const goals = loadHealthGoals();

  const labels = logs.map(l => {
    const d = new Date(l.date + 'T00:00:00');
    return d.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
  });

  const weightData = logs.map(l => l.weight);
  const targetData = new Array(logs.length).fill(goals.targetWeight);

  if (weightChartInstance) {
    weightChartInstance.destroy();
  }

  weightChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Peso Registrado (kg)',
          data: weightData,
          borderColor: '#10B981',
          backgroundColor: 'rgba(16, 185, 129, 0.15)',
          fill: true,
          tension: 0.3,
          pointRadius: 5,
          pointHoverRadius: 7
        },
        {
          label: 'Meta (kg)',
          data: targetData,
          borderColor: '#EF4444',
          borderDash: [5, 5],
          pointRadius: 0,
          fill: false
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: '#E2E8F0' } }
      },
      scales: {
        y: { grid: { color: 'rgba(255, 255, 255, 0.05)' } },
        x: { grid: { display: false } }
      }
    }
  });
}

function renderCalorieChart(canvasId) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return;

  const stats = getWeeklyCaloriesStats();

  if (calorieChartInstance) {
    calorieChartInstance.destroy();
  }

  calorieChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: stats.labels,
      datasets: [
        {
          label: 'Calorías Consumidas (kcal)',
          data: stats.data,
          backgroundColor: 'rgba(16, 185, 129, 0.8)',
          borderRadius: 6
        },
        {
          label: 'Meta Diaria (kcal)',
          data: stats.target,
          type: 'line',
          borderColor: '#3B82F6',
          borderDash: [4, 4],
          pointRadius: 0,
          fill: false
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: '#E2E8F0' } }
      },
      scales: {
        y: { beginAtZero: true, grid: { color: 'rgba(255, 255, 255, 0.05)' } },
        x: { grid: { display: false } }
      }
    }
  });
}

// Gráfico de Dona para Macronutrientes (Proteínas, Carbs, Grasas) - Estilo Fitia
function renderMacroChart(canvasId) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return;

  const macros = getDailyMacrosTotal();

  // Si no hay datos aún
  const p = macros.protein || 1;
  const c = macros.carbs || 1;
  const f = macros.fat || 1;

  if (macroChartInstance) {
    macroChartInstance.destroy();
  }

  macroChartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Proteínas (g)', 'Carbohidratos (g)', 'Grasas (g)'],
      datasets: [{
        data: [p, c, f],
        backgroundColor: [
          '#EF4444', // Rojo Proteína
          '#3B82F6', // Azul Carbs
          '#F59E0B'  // Amarillo Grasas
        ],
        borderWidth: 2,
        borderColor: '#1e293b'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { color: '#E2E8F0', font: { size: 12 } }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `${context.label}: ${context.raw}g`;
            }
          }
        }
      },
      cutout: '70%'
    }
  });
}

function updateAllCharts() {
  renderHabitsChart('habitsChart');
  renderWeightChart('weightChart');
  renderCalorieChart('calorieChart');
  renderMacroChart('macroChart');
}
