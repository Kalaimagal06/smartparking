import { Request, Response, NextFunction } from 'express';

export const cacheMiddleware = (keyPrefix: string, ttlSeconds: number = 60) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        next();
    };
};

export const invalidateCache = async (keyPrefix: string) => {
    // No-op since Redis is removed
};
