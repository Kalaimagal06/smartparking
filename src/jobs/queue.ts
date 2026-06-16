import { processJob } from './workers';

// In-memory fallback to avoid requiring Redis locally for the demo
export const addReservationJob = async (jobName: string, data: any, delay: number = 0) => {
    console.log(`[Queue Mock] Job ${jobName} queued with delay ${delay}ms`);
    
    // Simulate job execution via setTimeout
    setTimeout(async () => {
        try {
            await processJob({ name: jobName, data });
            console.log(`[Queue Mock] Job ${jobName} completed successfully`);
        } catch (error) {
            console.error(`[Queue Mock] Job ${jobName} failed:`, error);
        }
    }, delay);

    return { id: `job-${Date.now()}` };
};
