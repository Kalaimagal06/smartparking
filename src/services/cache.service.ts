// In-memory fallback to avoid requiring Redis locally for the demo
const memoryCache = new Map<string, any>();

export const getFromCache = async (key: string): Promise<any | null> => {
  console.log(`[Cache] Checking key ${key}`);
  return memoryCache.has(key) ? memoryCache.get(key) : null;
};

export const setInCache = async (key: string, value: any, ttlSeconds: number = 3600): Promise<void> => {
  console.log(`[Cache] Setting key ${key}`);
  memoryCache.set(key, value);
  // Basic mock TTL
  setTimeout(() => memoryCache.delete(key), ttlSeconds * 1000);
};

export const invalidateCache = async (key: string): Promise<void> => {
  memoryCache.delete(key);
};
