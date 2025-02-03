const cron = require('node-cron');
const Beach = require('../models/Beach');
const incoisService = require('./incoisService');

class CronService {
    constructor() {
        this.jobs = [];
    }

    // Initialize all cron jobs
    init() {
        this.startBeachUpdates();
    }

    // Start periodic beach condition updates
    startBeachUpdates() {
        // Update beach conditions every hour
        const job = cron.schedule('0 * * * *', async () => {
            console.log('Running beach conditions update...');
            try {
                const beaches = await Beach.find({ status: 'active' });
                
                for (const beach of beaches) {
                    try {
                        await incoisService.updateBeachConditions(beach._id);
                        console.log(`Updated conditions for beach: ${beach.name}`);
                    } catch (error) {
                        console.error(`Error updating beach ${beach.name}:`, error);
                    }
                }
                
                console.log('Beach conditions update completed');
            } catch (error) {
                console.error('Error in beach update cron job:', error);
            }
        });

        this.jobs.push(job);
    }

    // Clean up warning flags daily
    startWarningCleanup() {
        // Clean up old warnings at midnight
        const job = cron.schedule('0 0 * * *', async () => {
            console.log('Running warning cleanup...');
            try {
                const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
                
                await Beach.updateMany(
                    { 'warnings.timestamp': { $lt: twentyFourHoursAgo } },
                    { $pull: { warnings: { timestamp: { $lt: twentyFourHoursAgo } } } }
                );
                
                console.log('Warning cleanup completed');
            } catch (error) {
                console.error('Error in warning cleanup cron job:', error);
            }
        });

        this.jobs.push(job);
    }

    // Stop all cron jobs
    stopAll() {
        this.jobs.forEach(job => job.stop());
        this.jobs = [];
    }
}

module.exports = new CronService(); 