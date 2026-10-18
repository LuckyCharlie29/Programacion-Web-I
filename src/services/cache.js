const CACHE_PREFIX = 'async_odyssey_cache_';
const DEFAULT_TTL_MS = 1000 * 60 * 10;

export function getFromCache(key) {
  try {
    const rawItem = localStorage.getItem(`${CACHE_PREFIX}${key}`);
    if (!rawItem) return null;

    const parsedItem = JSON.parse(rawItem);
    const now = Date.now();

    if (now > parsedItem.expiry) {
      localStorage.removeItem(`${CACHE_PREFIX}${key}`);
      return null;
    }

    return parsedItem.data;
  } catch (error) {
    console.warn('Error accediendo a localStorage:', error);
    return null;
  }
}

export function setToCache(key, data, ttlMs = DEFAULT_TTL_MS) {
  try {
    const item = {
      data,
      expiry: Date.now() + ttlMs,
    };
    localStorage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify(item));
  } catch (error) {
    console.warn('Error guardando en localStorage:', error);
  }
}