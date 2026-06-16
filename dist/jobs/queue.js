"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addReservationJob = exports.reservationQueue = void 0;
const bullmq_1 = require("bullmq");
const ioredis_1 = __importDefault(require("ioredis"));
const connection = new ioredis_1.default({
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    maxRetriesPerRequest: null
});
exports.reservationQueue = new bullmq_1.Queue('ReservationQueue', {
    connection: connection
});
const addReservationJob = async (jobName, data, delay = 0) => {
    return await exports.reservationQueue.add(jobName, data, {
        delay
    });
};
exports.addReservationJob = addReservationJob;
