import { Request, Response, NextFunction } from "express";
import { getCache, setCache, redisClient } from "../utils/redis.js";

export const cacheMiddleware = (ttlSeconds: number = 3600) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Only cache GET requests
    if (req.method !== "GET") {
      return next();
    }

    // Skip if Redis is not connected
    if (!redisClient.isOpen || !redisClient.isReady) {
      console.warn("Redis is not ready, skipping cache");
      return next();
    }

    const key = `cache:${req.originalUrl || req.url}`;

    try {
      // Use a race to avoid hanging if Redis is slow
      const cachedData = await Promise.race([
        getCache(key),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Redis Timeout")), 2000),
        ),
      ]);

      if (cachedData) {
        console.log(`Cache Hit for: ${key}`);
        return res.json(cachedData);
      }

      console.log(`Cache Miss for: ${key}`);

      // Override res.json to store the response in cache
      const originalJson = res.json.bind(res);
      res.json = (body: any) => {
        if (redisClient.isReady) {
          setCache(key, body, ttlSeconds).catch((err) =>
            console.error("Cache set error:", err),
          );
        }
        return originalJson(body);
      };

      next();
    } catch (error) {
      console.error("Cache Middleware Error (falling back to DB):", error);
      next();
    }
  };
};
