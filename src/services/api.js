import { getFromCache, setToCache } from './cache.js';

const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

export async function fetchMealsByQuery(query) {
  const sanitizedQuery = query.trim().toLowerCase();
  const cacheKey = `search_${sanitizedQuery}`;

  const cachedData = getFromCache(cacheKey);
  if (cachedData !== null) {
    return { data: cachedData, fromCache: true };
  }

  const endpoint = `${BASE_URL}/search.php?s=${encodeURIComponent(sanitizedQuery)}`;
  
  let response;
  try {
    response = await fetch(endpoint);
  } catch (networkError) {
    throw new Error(`Error de red al conectar con TheMealDB: ${networkError.message}`);
  }

  if (!response.ok) {
    throw new Error(`Error de servidor HTTP: ${response.status} ${response.statusText}`);
  }

  let jsonResult;
  try {
    jsonResult = await response.json();
  } catch (parseError) {
    throw new Error(`Respuesta inválida no se pudo parsear como JSON: ${parseError.message}`);
  }

  const meals = jsonResult.meals || [];
  
  setToCache(cacheKey, meals);

  return { data: meals, fromCache: false };
}