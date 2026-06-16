"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bullmq_1 = require("bullmq");
const ioredis_1 = __importDefault(require("ioredis"));
const connection = new ioredis_1.default({
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    maxRetriesPerRequest: null
});
const worker = new bullmq_1.Worker('ReservationQueue', async (job) => {
    switch (job.name) {
        case 'sendConfirmationEmail':
            console.log(`[Worker] Sending confirmation email for reservation ${job.data.reservationId} to ${job.data.email}`);
            // Simulate sending email
            await new Promise(resolve => setTimeout(resolve, 1000));
            console.log(`[Worker] Email sent to ${job.data.email}`);
            break;
        case 'expireReservation':
            console.log(`[Worker] Checking expiration for reservation ${job.data.reservationId}`);
            // Logic to check if user checked in, and if not, free up the spot
            break;
        default:
            console.warn(`[Worker] Unknown job name: ${job.name}`);
    }
}, { connection: connection });
worker.on('completed', job => {
    console.log(`[Worker] Job ${job.id} has completed!`);
});
worker.on('failed', (job, err) => {
    console.error(`[Worker] Job ${job?.id} has failed with ${err.message}`);
});
exports.default = worker;
