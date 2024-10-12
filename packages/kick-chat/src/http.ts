const MAX_CACHE_SIZE = 50;
const DEFAULT_TTL = 60000;

const cache = new Map();

const setCache = (key: string, value: any, ttl = DEFAULT_TTL) => {
  const expiry = Date.now() + ttl;

  if (cache.size >= MAX_CACHE_SIZE) {
    const oldestKey = cache.keys().next().value;
    cache.delete(oldestKey);
  }
  cache.set(key, {data: value, expiry});
};

const getCache = (key: string) => {
  const cached = cache.get(key);
  if (!cached) return null;

  if (cached.expiry < Date.now()) {
    cache.delete(key);
    return null;
  }

  return cached.data;
};

export const http = async (
  url: string,
  options: RequestInit = {},
  cacheKey: string | null = null,
  ttl = DEFAULT_TTL
) => {
  if (cacheKey) {
    const cachedResponse = getCache(cacheKey);
    if (cachedResponse) {
      return cachedResponse;
    }
  }

  try {
    const response = await fetch(url, {
      body: null,
      mode: 'cors',
      credentials: 'include',
      ...options,
      headers: {
        ...(options.headers ?? {}),
        accept: 'application/json',
        'accept-language': 'en-US,en;q=0.9',
        'cache-control': 'max-age=0',
      },
    });
    const data = await response.json();
    if (cacheKey) {
      setCache(cacheKey, data, ttl);
    }
    return data;
  } catch (error) {
    throw error;
  }
};

export function cacheKey(namespace: string, ...args: string[]) {
  return `${namespace}>>${args.join('::')}`;
}
