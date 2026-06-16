"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.invalidateCache = exports.setInCache = exports.getFromCache = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
// Connect to Redis. In a real app, use environment variables for host/port.
const redis = new ioredis_1.default({
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
});
redis.on('error', (err) => {
    console.error('[Redis Cache] Error:', err);
});
redis.on('connect', () => {
    console.log('[Redis Cache] Connected successfully');
});
const getFromCache = async (key) => {
    try {
        const data = await redis.get(key);
        return data ? JSON.parse(data) : null;
    }
    catch (error) {
        console.error(`[Cache Error] Failed to get key ${key}:`, error);
        return null;
    }
};
exports.getFromCache = getFromCache;
const setInCache = async (key, value, ttlSeconds = 3600) => {
    try {
        await redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
    }
    catch (error) {
        console.error(`[Cache Error] Failed to set key ${key}:`, error);
    }
};
exports.setInCache = setInCache;
const invalidateCache = async (key) => {
    try {
        await redis.del(key);
    }
    catch (error) {
        console.error(`[Cache Error] Failed to invalidate key ${key}:`, error);
    }
};
exports.invalidateCache = invalidateCache;
exports.default = redis;
