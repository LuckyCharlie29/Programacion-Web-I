const statusContainer = document.getElementById('status-container');
const resultsGrid = document.getElementById('results-grid');
const metricsContainer = document.getElementById('metrics-container');
const categoryFilterSelect = document.getElementById('category-filter');

export function renderLoading() {
  statusContainer.innerHTML = `
    <div class="status-loading">
      <span>Cargando datos desde TheMealDB...</span>
    </div>
  `;
  resultsGrid.innerHTML = '';
  metricsContainer.innerHTML = '';
}

export function renderError(message) {
  statusContainer.innerHTML = `
    <div class="status-error">
      <strong>Error:</strong> ${message}
    </div>
  `;
  resultsGrid.innerHTML = '';
  metricsContainer.innerHTML = '';
}

export function renderCacheIndicator(fromCache) {
  if (fromCache) {
    statusContainer.innerHTML = `
      <div class="status-cache">
        ⚡ Respuesta cargada desde la caché local (localStorage).
      </div>
    `;
  } else {
    statusContainer.innerHTML = '';
  }
}

export function renderMetrics(metrics) {
  metricsContainer.innerHTML = `
    <div class="metric-card">
      <div class="metric-title">Total de Recetas</div>
      <div class="metric-value">${metrics.totalCount}</div>
    </div>
    <div class="metric-card">
      <div class="metric-title">Promedio Ingredientes</div>
      <div class="metric-value">${metrics.avgIngredients}</div>
    </div>
    <div class="metric-card">
      <div class="metric-title">Áreas Representadas</div>
      <div class="metric-value">${metrics.uniqueAreasCount}</div>
    </div>
    <div class="metric-card">
      <div class="metric-title">Área Predominante</div>
      <div class="metric-value">${metrics.topArea}</div>
    </div>
  `;
}

export function renderAreaOptions(areas, currentSelected = 'ALL') {
  categoryFilterSelect.innerHTML = '<option value="ALL">Todas las áreas</option>';
  
  areas.forEach((area) => {
    const option = document.createElement('option');
    option.value = area;
    option.textContent = area;
    if (area === currentSelected) {
      option.selected = true;
    }
    categoryFilterSelect.appendChild(option);
  });

  categoryFilterSelect.disabled = areas.length === 0;
}

export function renderMeals(meals) {
  if (meals.length === 0) {
    resultsGrid.innerHTML = `
      <p style="grid-column: 1 / -1; color: var(--text-muted);">
        No se encontraron recetas con los criterios especificados.
      </p>
    `;
    return;
  }

  resultsGrid.innerHTML = meals.map((meal) => `
    <article class="meal-card">
      <img src="${meal.thumbnail}" alt="${meal.title}" loading="lazy" />
      <div class="meal-card-body">
        <h2 class="meal-title">${meal.title}</h2>
        <div>
          <span class="meal-badge">${meal.category}</span>
          <span class="meal-badge">${meal.area}</span>
        </div>
        <p class="meal-ingredients-count">
          <strong>${meal.ingredientsCount}</strong> ingredientes requeridos
        </p>
      </div>
    </article>
  `).join('');
}