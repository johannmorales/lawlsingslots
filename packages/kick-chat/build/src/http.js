"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.http = void 0;
exports.cacheKey = cacheKey;
const MAX_CACHE_SIZE = 50;
const DEFAULT_TTL = 60000;
const cache = new Map();
const setCache = (key, value, ttl = DEFAULT_TTL) => {
    const expiry = Date.now() + ttl;
    if (cache.size >= MAX_CACHE_SIZE) {
        const oldestKey = cache.keys().next().value;
        cache.delete(oldestKey);
    }
    cache.set(key, { data: value, expiry });
};
const getCache = (key) => {
    const cached = cache.get(key);
    if (!cached)
        return null;
    if (cached.expiry < Date.now()) {
        cache.delete(key);
        return null;
    }
    return cached.data;
};
const http = async (url, options = {}, cacheKey = null, ttl = DEFAULT_TTL) => {
    var _a;
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
                ...((_a = options.headers) !== null && _a !== void 0 ? _a : {}),
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
    }
    catch (error) {
        throw error;
    }
};
exports.http = http;
function cacheKey(namespace, ...args) {
    return `${namespace}>>${args.join('::')}`;
}
//# sourceMappingURL=http.js.map