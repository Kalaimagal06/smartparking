"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReservation = exports.checkAvailability = void 0;
const cache_service_1 = require("../services/cache.service");
const queue_1 = require("../jobs/queue");
const checkAvailability = async (req, res, next) => {
    try {
        const { spotId } = req.params;
        const cacheKey = `spot:${spotId}:availability`;
        // Check cache first
        const cachedAvailability = await (0, cache_service_1.getFromCache)(cacheKey);
        if (cachedAvailability !== null) {
            console.log(`[Cache] Hit for ${cacheKey}`);
            res.status(200).json({ spotId, available: cachedAvailability, source: 'cache' });
            return;
        }
        console.log(`[Cache] Miss for ${cacheKey}`);
        // Simulate database call to check availability
        const isAvailable = Math.random() > 0.5; // Randomly available or not
        // Store in cache for 60 seconds
        await (0, cache_service_1.setInCache)(cacheKey, isAvailable, 60);
        res.status(200).json({ spotId, available: isAvailable, source: 'database' });
    }
    catch (error) {
        next(error);
    }
};
exports.checkAvailability = checkAvailability;
const createReservation = async (req, res, next) => {
    try {
        const { spotId, userId, email } = req.body;
        if (!spotId || !userId || !email) {
            res.status(400).json({ success: false, message: 'spotId, userId, and email are required.' });
            return;
        }
        // Simulate reservation creation in database
        const reservationId = `RES-${Date.now()}`;
        // 1. Queue email confirmation job (immediate)
        await (0, queue_1.addReservationJob)('sendConfirmationEmail', { reservationId, email });
        // 2. Queue expiration job (delayed by 15 minutes = 15 * 60 * 1000 ms)
        await (0, queue_1.addReservationJob)('expireReservation', { reservationId, spotId }, 15 * 60 * 1000);
        res.status(201).json({
            success: true,
            message: 'Reservation created successfully. Confirmation email queued.',
            reservation: {
                id: reservationId,
                spotId,
                userId
            }
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createReservation = createReservation;
