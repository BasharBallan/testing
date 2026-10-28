// middlewares/cache.js
const cacheService = require("../utils/cacheService");

exports.cache = (keyBuilder, ttl = 60) => {
  return async (req, res, next) => {
    // Only cache GET requests
    if (req.method !== "GET") {
      return next();
    }

    try {
      const key = typeof keyBuilder === "function" ? keyBuilder(req) : keyBuilder;

      const cached = await cacheService.get(key);
      if (cached) {
        return res.status(200).json({
          status: "success",
          source: "cache",
          data: typeof cached === "string" ? JSON.parse(cached) : cached,
        });
      }

      // Override res.json to store data after controller finishes
      const originalJson = res.json.bind(res);

      res.json = async (body) => {
        if (res.statusCode === 200) {
          const dataToCache = body?.data !== undefined ? body.data : body;
          await cacheService.set(key, dataToCache, ttl);
        }
        return originalJson(body);
      };

      next();
    } catch (err) {
      console.error("Cache Middleware Error:", err);
      next();
    }
  };
};
