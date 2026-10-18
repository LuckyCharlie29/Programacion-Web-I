import { fetchMealsByQuery } from './services/api.js';
import { 
  transformMealData, 
  filterMealsByArea, 
  calculateMealMetrics, 
  extractUniqueAreas 
} from './utils/dataTransform.js';
import { 
  renderLoading, 
  renderError, 
  renderCacheIndicator, 
  renderMetrics, 
  renderAreaOptions, 
  renderMeals 
} from './components/render.js';

const state = {
  rawMeals: [],
  transformedMeals: [],
  selectedArea: 'ALL'
};

const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const categoryFilter = document.getElementById('category-filter');

function updateAndRender() {
  const filteredMeals = filterMealsByArea(state.transformedMeals, state.selectedArea);
  const metrics = calculateMealMetrics(filteredMeals);

  renderMetrics(metrics);
  renderMeals(filteredMeals);
}

async function handleSearch(query) {
  renderLoading();

  try {
    const { data: rawMeals, fromCache } = await fetchMealsByQuery(query);
    
    state.rawMeals = rawMeals;
    state.transformedMeals = transformMealData(rawMeals);
    state.selectedArea = 'ALL';

    const uniqueAreas = extractUniqueAreas(state.transformedMeals);

    renderCacheIndicator(fromCache);
    renderAreaOptions(uniqueAreas, state.selectedArea);
    updateAndRender();

  } catch (error) {
    renderError(error.message);
  }
}

searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const query = searchInput.value;
  if (query) {
    handleSearch(query);
  }
});

categoryFilter.addEventListener('change', (event) => {
  state.selectedArea = event.target.value;
  updateAndRender();
});

handleSearch('chicken');