export function normalizeMeal(rawMeal) {
  const ingredients = Array.from({ length: 20 }, (_, index) => {
    const ingredientIndex = index + 1;
    const name = rawMeal[`strIngredient${ingredientIndex}`];
    const measure = rawMeal[`strMeasure${ingredientIndex}`];
    
    if (name && name.trim().length > 0) {
      return {
        name: name.trim(),
        measure: measure ? measure.trim() : ''
      };
    }
    return null;
  }).filter((item) => item !== null);

  const tags = rawMeal.strTags 
    ? rawMeal.strTags.split(',').map((tag) => tag.trim()).filter((tag) => tag.length > 0)
    : [];

  return {
    id: rawMeal.idMeal,
    title: rawMeal.strMeal || 'Sin título',
    category: rawMeal.strCategory || 'Sin categoría',
    area: rawMeal.strArea || 'Desconocida',
    thumbnail: rawMeal.strMealThumb || 'https://via.placeholder.com/300?text=No+Image',
    tags,
    ingredients,
    ingredientsCount: ingredients.length
  };
}

export function transformMealData(rawMeals) {
  if (!Array.isArray(rawMeals)) return [];

  return rawMeals
    .filter((meal) => meal !== null && typeof meal === 'object' && Boolean(meal.idMeal))
    .map(normalizeMeal);
}

export function filterMealsByArea(meals, selectedArea) {
  if (selectedArea === 'ALL' || !selectedArea) {
    return meals;
  }
  return meals.filter((meal) => meal.area === selectedArea);
}

export function calculateMealMetrics(meals) {
  if (!Array.isArray(meals) || meals.length === 0) {
    return {
      totalCount: 0,
      avgIngredients: 0,
      uniqueAreasCount: 0,
      topArea: 'N/A'
    };
  }

  const aggregate = meals.reduce((acc, meal) => {
    acc.totalIngredients += meal.ingredientsCount;
    acc.areaCounts[meal.area] = (acc.areaCounts[meal.area] || 0) + 1;
    return acc;
  }, { totalIngredients: 0, areaCounts: {} });

  const totalCount = meals.length;
  const avgIngredients = (aggregate.totalIngredients / totalCount).toFixed(1);

  const areas = Object.keys(aggregate.areaCounts);
  const uniqueAreasCount = areas.length;

  const topArea = areas.reduce((maxArea, currentArea) => {
    if (!maxArea) return currentArea;
    return aggregate.areaCounts[currentArea] > aggregate.areaCounts[maxArea]
      ? currentArea
      : maxArea;
  }, '');

  return {
    totalCount,
    avgIngredients: Number(avgIngredients),
    uniqueAreasCount,
    topArea: topArea || 'N/A'
  };
}

export function extractUniqueAreas(meals) {
  if (!Array.isArray(meals)) return [];

  const areasSet = meals.reduce((acc, meal) => {
    if (meal.area && !acc.includes(meal.area)) {
      acc.push(meal.area);
    }
    return acc;
  }, []);

  return areasSet.sort();
}