// In-memory fallback to avoid requiring Redis locally for the demo
export const processJob = async (job: { name: string, data: any }) => {
    switch(job.name) {
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
};
