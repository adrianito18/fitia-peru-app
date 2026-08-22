// Controlador Principal de la Aplicación (Navegación PC & Mobile + Estado Inicial Limpio)

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initGoalSelector();
  initWaterTracker();
  initPeruFoodSearch();
  initPhotoScanner();
  initForms();
  renderDashboard();
  renderHabitsList();
  renderHealthSection();
  renderTipsSection();
});

// --- NAVEGACIÓN DUAL (PC SIDEBAR + MOBILE BOTTOM NAV) ---

function initNavigation() {
  const allNavButtons = document.querySelectorAll('.nav-links button, .mobile-nav-btn');
  const views = document.querySelectorAll('.view-section');

  allNavButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetViewId = btn.getAttribute('data-target');

      // Sincronizar clases activas en botones de PC y Móvil
      allNavButtons.forEach(b => {
        if (b.getAttribute('data-target') === targetViewId) {
          b.classList.add('active');
        } else {
          b.classList.remove('active');
        }
      });

      // Mostrar vista seleccionada
      views.forEach(v => {
        if (v.id === targetViewId) {
          v.style.display = 'block';
        } else {
          v.style.display = 'none';
        }
      });

      if (targetViewId === 'dashboardView' || targetViewId === 'chartsView' || targetViewId === 'healthView') {
        setTimeout(updateAllCharts, 50);
      }
    });
  });
}

// --- SELECTOR DE OBJETIVO FITIA ---

function initGoalSelector() {
  const goalBtns = document.querySelectorAll('.goal-btn');
  const goals = loadHealthGoals();

  goalBtns.forEach(btn => {
    const goalVal = btn.getAttribute('data-goal');
    if (goalVal === goals.fitnessGoal) {
      btn.classList.add('active');
    }

    btn.addEventListener('click', () => {
      goalBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const updatedGoals = updateFitnessGoal(goalVal);
      renderDashboard();
      renderHealthSection();
      setTimeout(updateAllCharts, 50);
    });
  });
}

// --- WIDGET DE AGUA ---

function initWaterTracker() {
  const btnAddWater = document.getElementById('btnAddWater');
  const btnSubWater = document.getElementById('btnSubWater');

  if (btnAddWater) {
    btnAddWater.addEventListener('click', () => {
      updateWaterGlasses(+1);
      renderWaterWidget();
    });
  }

  if (btnSubWater) {
    btnSubWater.addEventListener('click', () => {
      updateWaterGlasses(-1);
      renderWaterWidget();
    });
  }

  renderWaterWidget();
}

function renderWaterWidget() {
  const currentGlasses = getWaterGlasses();
  const goals = loadHealthGoals();
  const totalGlasses = goals.targetWaterGlasses || 10;

  const countText = document.getElementById('waterCountText');
  if (countText) {
    const liters = (currentGlasses * 0.25).toFixed(2);
    const targetLiters = (totalGlasses * 0.25).toFixed(2);
    countText.textContent = `${currentGlasses} / ${totalGlasses} vasos (${liters}L de ${targetLiters}L)`;
  }

  const iconsContainer = document.getElementById('waterGlassesIcons');
  if (iconsContainer) {
    iconsContainer.innerHTML = '';
    for (let i = 1; i <= totalGlasses; i++) {
      const glass = document.createElement('span');
      glass.className = `water-glass ${i <= currentGlasses ? 'active' : ''}`;
      glass.textContent = '💧';
      iconsContainer.appendChild(glass);
    }
  }
}

// --- BUSCADOR Y CATÁLOGO DE MARCAS PERUANAS ---

function initPeruFoodSearch() {
  const searchInput = document.getElementById('inputPeruSearch');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      renderPeruFoodCatalog(e.target.value);
    });
  }
  renderPeruFoodCatalog();
}

function renderPeruFoodCatalog(query = '') {
  const catalogContainer = document.getElementById('foodCatalogGrid');
  if (!catalogContainer) return;

  const filteredFoods = searchPeruFoods(query);
  catalogContainer.innerHTML = '';

  if (filteredFoods.length === 0) {
    catalogContainer.innerHTML = '<p class="stat-desc" style="grid-column: 1/-1;">No se encontraron productos coincidentes en el catálogo de Perú.</p>';
    return;
  }

  filteredFoods.forEach(food => {
    const chip = document.createElement('div');
    chip.className = 'food-chip';
    chip.innerHTML = `
      <div>
        <div class="food-chip-header">
          ${food.icon} ${escapeHtml(food.name)}
        </div>
        <div>
          <span class="brand-badge-tag">${escapeHtml(food.brand)}</span>
          <span class="store-badge-tag">🛒 ${escapeHtml(food.store)}</span>
        </div>
      </div>
      <div class="food-chip-macros">
        <strong>${food.calories} kcal</strong> | P: ${food.protein}g | C: ${food.carbs}g | G: ${food.fat}g
      </div>
    `;
    chip.addEventListener('click', () => {
      addMealEntry(food.name, food.calories, food.protein, food.carbs, food.fat, 'General');
      renderDashboard();
      renderHealthSection();
      setTimeout(updateAllCharts, 50);
    });
    catalogContainer.appendChild(chip);
  });
}

// --- ESCÁNER DE COMIDA POR FOTO ---

function initPhotoScanner() {
  const photoInput = document.getElementById('photoFileInput');
  const dropzone = document.getElementById('photoDropzone');
  const resultCard = document.getElementById('scanResultCard');

  if (!photoInput || !dropzone || !resultCard) return;

  dropzone.addEventListener('click', () => photoInput.click());

  dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.style.borderColor = 'var(--primary)';
  });

  dropzone.addEventListener('dragleave', () => {
    dropzone.style.borderColor = '#334155';
  });

  dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.style.borderColor = '#334155';
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handlePhotoUpload(e.dataTransfer.files[0]);
    }
  });

  photoInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
      handlePhotoUpload(e.target.files[0]);
    }
  });
}

async function handlePhotoUpload(file) {
  const resultCard = document.getElementById('scanResultCard');
  resultCard.style.display = 'block';
  resultCard.innerHTML = `
    <div class="scanning-spinner">
      <span>🔍</span> Analizando foto con IA Visión Nutricional...
    </div>
  `;

  const analysis = await analyzeFoodPhoto(file);

  resultCard.innerHTML = `
    <div style="display: flex; gap: 1rem; align-items: center; margin-bottom: 0.75rem;">
      <img src="${analysis.imageUrl}" class="scan-img-box" style="width: 110px; height: 90px;">
      <div>
        <h4 style="font-size: 1.05rem; font-weight: 800;">${escapeHtml(analysis.detectedName)}</h4>
        <span class="confidence-badge">🎯 ${analysis.confidence}% Coincidencia IA</span>
        <p class="stat-desc" style="margin-top: 0.3rem;">
          Marca / Tipo: <strong>${escapeHtml(analysis.brand)}</strong>
        </p>
      </div>
    </div>
    <div style="background: #090f1a; padding: 0.75rem; border-radius: 10px; margin-bottom: 0.75rem; font-size: 0.9rem;">
      🔥 <strong>${analysis.calories} kcal</strong> | 
      🔴 Prot: <strong>${analysis.protein}g</strong> | 
      🔵 Carbs: <strong>${analysis.carbs}g</strong> | 
      🟡 Grasas: <strong>${analysis.fat}g</strong>
    </div>
    <button class="btn btn-primary" id="btnLogScannedMeal" style="width: 100%;">
      ➕ Registrar esta comida en mi diario
    </button>
  `;

  document.getElementById('btnLogScannedMeal').addEventListener('click', () => {
    addMealEntry(analysis.detectedName, analysis.calories, analysis.protein, analysis.carbs, analysis.fat, 'General');
    alert(`¡${analysis.detectedName} registrado con éxito!`);
    renderDashboard();
    renderHealthSection();
    setTimeout(updateAllCharts, 50);
  });
}

// --- RENDERIZADO DEL DASHBOARD ---

function renderDashboard() {
  const habits = loadHabits();
  const todayStr = getTodayStr();

  const completedToday = habits.filter(h => h.completedDates.includes(todayStr)).length;
  const totalHabits = habits.length;
  const percentage = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;

  document.getElementById('dashHabitsCount').textContent = `${completedToday} / ${totalHabits}`;
  document.getElementById('dashHabitsPercentText').textContent = `${percentage}% completado hoy`;
  document.getElementById('dashHabitsProgress').style.width = `${percentage}%`;

  const latestWeight = getLatestWeight();
  const goals = loadHealthGoals();

  if (latestWeight) {
    document.getElementById('dashCurrentWeight').textContent = `${latestWeight.weight} kg`;
    const diff = (latestWeight.weight - goals.targetWeight).toFixed(1);
    const diffText = diff > 0 ? `${diff} kg sobre meta (${goals.targetWeight} kg)` : `${Math.abs(diff)} kg para alcanzar meta`;
    document.getElementById('dashWeightDiff').textContent = diffText;
  } else {
    document.getElementById('dashCurrentWeight').textContent = '-- kg';
    document.getElementById('dashWeightDiff').textContent = 'Ingresa tu peso en Nutrición';
  }

  const macrosToday = getDailyMacrosTotal(todayStr);
  document.getElementById('dashCaloriesTotal').textContent = `${macrosToday.calories} / ${goals.targetCalories} kcal`;
  const calPercent = Math.min(Math.round((macrosToday.calories / goals.targetCalories) * 100), 100);
  document.getElementById('dashCaloriesProgress').style.width = `${calPercent}%`;

  renderMacroCards(macrosToday, goals);

  const dashList = document.getElementById('dashHabitsList');
  dashList.innerHTML = '';

  if (habits.length === 0) {
    dashList.innerHTML = '<p class="stat-desc">Aún no tienes hábitos creados. ¡Ve a la pestaña "Hábitos" para crear el primero!</p>';
  } else {
    habits.forEach(h => {
      const isDone = h.completedDates.includes(todayStr);
      const { currentStreak } = calculateStreak(h);

      const item = document.createElement('div');
      item.className = 'list-item';
      item.innerHTML = `
        <div class="item-info">
          <div class="item-icon">${h.icon || '🎯'}</div>
          <div class="item-details">
            <h4>${escapeHtml(h.title)}</h4>
            <p><span class="badge badge-streak">🔥 Racha: ${currentStreak} días</span></p>
          </div>
        </div>
        <button class="btn-check ${isDone ? 'completed' : ''}" onclick="handleToggleHabit('${h.id}')">
          ${isDone ? '✓' : ''}
        </button>
      `;
      dashList.appendChild(item);
    });
  }

  renderWaterWidget();
  setTimeout(updateAllCharts, 50);
}

function renderMacroCards(current, goals) {
  const pVal = document.getElementById('dashProteinVal');
  const pProg = document.getElementById('dashProteinProgress');
  if (pVal && pProg) {
    pVal.textContent = `${current.protein} / ${goals.targetProtein}g`;
    const pPercent = Math.min(Math.round((current.protein / goals.targetProtein) * 100), 100);
    pProg.style.width = `${pPercent}%`;
  }

  const cVal = document.getElementById('dashCarbsVal');
  const cProg = document.getElementById('dashCarbsProgress');
  if (cVal && cProg) {
    cVal.textContent = `${current.carbs} / ${goals.targetCarbs}g`;
    const cPercent = Math.min(Math.round((current.carbs / goals.targetCarbs) * 100), 100);
    cProg.style.width = `${cPercent}%`;
  }

  const fVal = document.getElementById('dashFatVal');
  const fProg = document.getElementById('dashFatProgress');
  if (fVal && fProg) {
    fVal.textContent = `${current.fat} / ${goals.targetFat}g`;
    const fPercent = Math.min(Math.round((current.fat / goals.targetFat) * 100), 100);
    fProg.style.width = `${fPercent}%`;
  }
}

// --- RENDERIZADO HÁBITOS ---

function renderHabitsList() {
  const habits = loadHabits();
  const listContainer = document.getElementById('habitsFullList');
  const todayStr = getTodayStr();

  listContainer.innerHTML = '';

  if (habits.length === 0) {
    listContainer.innerHTML = '<p class="stat-desc">No has registrado ningún hábito aún. ¡Crea tu primer hábito usando el formulario de la izquierda!</p>';
    return;
  }

  habits.forEach(h => {
    const isDone = h.completedDates.includes(todayStr);
    const { currentStreak, bestStreak } = calculateStreak(h);

    const item = document.createElement('div');
    item.className = 'list-item';
    item.innerHTML = `
      <div class="item-info">
        <div class="item-icon">${h.icon || '🎯'}</div>
        <div class="item-details">
          <h4>${escapeHtml(h.title)}</h4>
          <p>
            <span class="badge">Categoría: ${getCategoryLabel(h.category)}</span>
            <span class="badge badge-streak">🔥 Racha: ${currentStreak} días</span>
            <span class="stat-desc"> (Mejor: ${bestStreak})</span>
          </p>
        </div>
      </div>
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <button class="btn-check ${isDone ? 'completed' : ''}" onclick="handleToggleHabit('${h.id}')">
          ${isDone ? '✓' : ''}
        </button>
        <button class="btn btn-danger" onclick="handleDeleteHabit('${h.id}')">🗑️</button>
      </div>
    `;
    listContainer.appendChild(item);
  });
}

function handleToggleHabit(habitId) {
  toggleHabitCompletion(habitId);
  renderDashboard();
  renderHabitsList();
}

function handleDeleteHabit(habitId) {
  if (confirm('¿Estás seguro de eliminar este hábito?')) {
    deleteHabit(habitId);
    renderDashboard();
    renderHabitsList();
  }
}

// --- RENDERIZADO SECCIÓN NUTRICIÓN Y SALUD ---

function renderHealthSection() {
  const goals = loadHealthGoals();
  document.getElementById('inputTargetWeight').value = goals.targetWeight;
  document.getElementById('inputTargetCalories').value = goals.targetCalories;
  document.getElementById('inputTargetProtein').value = goals.targetProtein;
  document.getElementById('inputTargetCarbs').value = goals.targetCarbs;
  document.getElementById('inputTargetFat').value = goals.targetFat;

  const weightLogs = loadWeightLogs();
  const weightTable = document.getElementById('weightLogsBody');
  weightTable.innerHTML = '';

  if (weightLogs.length === 0) {
    weightTable.innerHTML = '<tr><td colspan="3" class="stat-desc" style="padding: 0.75rem; text-align: center;">No hay registros de peso. ¡Ingresa tu peso inicial arriba!</td></tr>';
  } else {
    [...weightLogs].reverse().forEach(log => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td style="padding: 0.6rem; border-bottom: 1px solid var(--border-color);">${log.date}</td>
        <td style="padding: 0.6rem; border-bottom: 1px solid var(--border-color); font-weight: 600;">${log.weight} kg</td>
        <td style="padding: 0.6rem; border-bottom: 1px solid var(--border-color); text-align: right;">
          <button class="btn btn-danger" onclick="handleDeleteWeight('${log.date}')">🗑️</button>
        </td>
      `;
      weightTable.appendChild(row);
    });
  }

  const todayStr = getTodayStr();
  const mealLogs = loadMealLogs().filter(m => m.date === todayStr);
  const mealsList = document.getElementById('todayMealLogs');
  mealsList.innerHTML = '';

  if (mealLogs.length === 0) {
    mealsList.innerHTML = '<p class="stat-desc">Aún no has registrado comidas hoy. ¡Busca un producto peruano o toma una foto arriba!</p>';
  } else {
    mealLogs.forEach(m => {
      const item = document.createElement('div');
      item.className = 'list-item';
      item.innerHTML = `
        <div class="item-info">
          <div class="item-icon">🍎</div>
          <div class="item-details">
            <h4>${escapeHtml(m.name)}</h4>
            <p>
              <span class="badge">${m.mealType}</span> - <strong>${m.calories} kcal</strong> | 
              P: ${m.protein || 0}g | C: ${m.carbs || 0}g | G: ${m.fat || 0}g
            </p>
          </div>
        </div>
        <button class="btn btn-danger" onclick="handleDeleteMeal('${m.id}')">🗑️</button>
      `;
      mealsList.appendChild(item);
    });
  }
}

function handleDeleteWeight(dateStr) {
  deleteWeightEntry(dateStr);
  renderDashboard();
  renderHealthSection();
}

function handleDeleteMeal(mealId) {
  deleteMealEntry(mealId);
  renderDashboard();
  renderHealthSection();
}

function renderTipsSection(category = 'all') {
  const tips = getTipsByCategory(category);
  const tipsGrid = document.getElementById('tipsGrid');
  tipsGrid.innerHTML = '';

  tips.forEach(t => {
    const card = document.createElement('div');
    card.className = 'tip-card';
    card.innerHTML = `
      <div class="tip-header">
        <span class="tip-icon">${t.icon}</span>
        <div>
          <h3 class="tip-title">${escapeHtml(t.title)}</h3>
          <p class="tip-author">👤 <strong>${escapeHtml(t.author)}</strong></p>
          <p class="tip-book">📖 <em>${escapeHtml(t.book)}</em></p>
        </div>
      </div>
      <div style="margin: 0.4rem 0;">
        <span class="badge" style="background: rgba(99, 102, 241, 0.25); color: #a5b4fc; font-size: 0.72rem;">🔬 ${escapeHtml(t.science)}</span>
      </div>
      <p class="tip-text">${escapeHtml(t.text)}</p>
    `;
    tipsGrid.appendChild(card);
  });

  const filterBtns = document.querySelectorAll('.btn-filter');
  filterBtns.forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-category') === category);
  });
}

// --- FORMULARIOS ---

function initForms() {
  const formHabit = document.getElementById('formAddHabit');
  formHabit.addEventListener('submit', e => {
    e.preventDefault();
    const title = document.getElementById('inputHabitTitle').value;
    const category = document.getElementById('selectHabitCategory').value;
    const icon = document.getElementById('inputHabitIcon').value || '🎯';

    if (title.trim()) {
      createHabit(title, category, icon);
      formHabit.reset();
      renderDashboard();
      renderHabitsList();
    }
  });

  const formWeight = document.getElementById('formAddWeight');
  formWeight.addEventListener('submit', e => {
    e.preventDefault();
    const weight = document.getElementById('inputWeightValue').value;
    const date = document.getElementById('inputWeightDate').value || getTodayStr();

    if (weight) {
      addWeightEntry(weight, date);
      document.getElementById('inputWeightValue').value = '';
      renderDashboard();
      renderHealthSection();
    }
  });

  const formMeal = document.getElementById('formAddMeal');
  formMeal.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('inputMealName').value;
    const calories = document.getElementById('inputMealCalories').value;
    const protein = document.getElementById('inputMealProtein').value || 0;
    const carbs = document.getElementById('inputMealCarbs').value || 0;
    const fat = document.getElementById('inputMealFat').value || 0;
    const type = document.getElementById('selectMealType').value;

    if (name && calories) {
      addMealEntry(name, calories, protein, carbs, fat, type);
      formMeal.reset();
      renderDashboard();
      renderHealthSection();
      setTimeout(updateAllCharts, 50);
    }
  });

  const formGoals = document.getElementById('formHealthGoals');
  formGoals.addEventListener('submit', e => {
    e.preventDefault();
    const targetWeight = parseFloat(document.getElementById('inputTargetWeight').value);
    const targetCalories = parseInt(document.getElementById('inputTargetCalories').value, 10);
    const targetProtein = parseInt(document.getElementById('inputTargetProtein').value, 10);
    const targetCarbs = parseInt(document.getElementById('inputTargetCarbs').value, 10);
    const targetFat = parseInt(document.getElementById('inputTargetFat').value, 10);

    const goals = loadHealthGoals();
    saveHealthGoals({
      ...goals,
      targetWeight,
      targetCalories,
      targetProtein,
      targetCarbs,
      targetFat
    });

    alert('¡Metas actualizadas correctamente!');
    renderDashboard();
    renderHealthSection();
    setTimeout(updateAllCharts, 50);
  });

  const filterBtns = document.querySelectorAll('.btn-filter');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      renderTipsSection(btn.getAttribute('data-category'));
    });
  });

  document.getElementById('inputWeightDate').value = getTodayStr();
}

function getCategoryLabel(cat) {
  const map = {
    fitness: 'Ejercicio',
    nutrition: 'Nutrición',
    hydration: 'Hidratación',
    sleep: 'Sueño',
    mental: 'Salud Mental'
  };
  return map[cat] || 'General';
}

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, match => {
    const entities = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    };
    return entities[match];
  });
}
