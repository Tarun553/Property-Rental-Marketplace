import { Request, Response, NextFunction } from "express";
import { getCache, setCache } from "../utils/redis.js";

export const cacheMiddleware = (ttlSeconds: number = 3600) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Only cache GET requests
    if (req.method !== "GET") {
      return next();
    }

    const key = `cache:${req.originalUrl || req.url}`;

    try {
      const cachedData = await getCache(key);

      if (cachedData) {
        console.log(`Cache Hit for: ${key}`);
        return res.json(cachedData);
      }

      console.log(`Cache Miss for: ${key}`);

      // Override res.json to store the response in cache
      const originalJson = res.json.bind(res);
      res.json = (body: any) => {
        setCache(key, body, ttlSeconds);
        return originalJson(body);
      };

      next();
    } catch (error) {
      console.error("Cache Middleware Error:", error);
      next();
    }
  };
};
