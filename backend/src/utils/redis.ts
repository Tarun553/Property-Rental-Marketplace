import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient.on("error", (err) => console.error("Redis Client Error", err));
redisClient.on("connect", () => console.log("Redis Client Connecting..."));
redisClient.on("ready", () => console.log("Redis Client Ready"));
redisClient.on("end", () => console.log("Redis Client Disconnected"));

const connectRedis = async () => {
  if (!redisClient.isOpen) {
    try {
      console.log("Attempting to connect to Redis...");
      await redisClient.connect();
    } catch (error) {
      console.error("Failed to connect to Redis:", error);
    }
  }
};

// Ensure connection is established on module load
await connectRedis();

export { redisClient, connectRedis };

export const getCache = async (key: string) => {
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error(`Redis Get Error [${key}]:`, error);
    return null;
  }
};

export const setCache = async (
  key: string,
  value: unknown,
  ttlSeconds: number = 3600,
) => {
  try {
    await redisClient.set(key, JSON.stringify(value), {
      EX: ttlSeconds,
    });
  } catch (error) {
    console.error(`Redis Set Error [${key}]:`, error);
  }
};

export const deleteCache = async (key: string) => {
  try {
    await redisClient.del(key);
  } catch (error) {
    console.error(`Redis Del Error [${key}]:`, error);
  }
};

export const deletePattern = async (pattern: string) => {
  try {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
  } catch (error) {
    console.error(`Redis Delete Pattern Error [${pattern}]:`, error);
  }
};
