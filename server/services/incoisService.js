const axios = require('axios');
const Beach = require('../models/Beach');

class IncoisService {
    constructor() {
        this.baseUrl = process.env.INCOIS_API_BASE_URL;
        this.apiKey = process.env.INCOIS_API_KEY;
    }

    async fetchOceanData(latitude, longitude) {
        try {
            const response = await axios.get(`${this.baseUrl}/ocean-data`, {
                params: {
                    lat: latitude,
                    lon: longitude,
                    key: this.apiKey
                }
            });

            return this.parseOceanData(response.data);
        } catch (error) {
            console.error('Error fetching ocean data:', error);
            throw new Error('Failed to fetch ocean data from INCOIS');
        }
    }

    async fetchWaterQuality(latitude, longitude) {
        try {
            const response = await axios.get(`${this.baseUrl}/water-quality`, {
                params: {
                    lat: latitude,
                    lon: longitude,
                    key: this.apiKey
                }
            });

            return this.parseWaterQuality(response.data);
        } catch (error) {
            console.error('Error fetching water quality:', error);
            throw new Error('Failed to fetch water quality data from INCOIS');
        }
    }

    parseOceanData(data) {
        // This is a placeholder parser - adjust according to actual INCOIS API response format
        return {
            waveHeight: data.wave_height || 0,
            waveDirection: data.wave_direction || 0,
            waterTemperature: data.water_temp || 0,
            windSpeed: data.wind_speed || 0,
            windDirection: data.wind_direction || 0,
            timestamp: new Date(data.timestamp) || new Date()
        };
    }

    parseWaterQuality(data) {
        // This is a placeholder parser - adjust according to actual INCOIS API response format
        return {
            quality: data.quality || 'good',
            parameters: {
                pH: data.ph || 7,
                dissolvedOxygen: data.dissolved_oxygen || 0,
                turbidity: data.turbidity || 0
            },
            timestamp: new Date(data.timestamp) || new Date()
        };
    }

    async updateBeachConditions(beachId) {
        try {
            const beach = await Beach.findById(beachId);
            
            if (!beach) {
                throw new Error('Beach not found');
            }

            const [oceanData, waterQuality] = await Promise.all([
                this.fetchOceanData(beach.location.coordinates[1], beach.location.coordinates[0]),
                this.fetchWaterQuality(beach.location.coordinates[1], beach.location.coordinates[0])
            ]);

            // Update beach conditions
            beach.currentConditions = {
                waveHeight: oceanData.waveHeight,
                waterTemperature: oceanData.waterTemperature,
                windSpeed: oceanData.windSpeed,
                windDirection: oceanData.windDirection,
                waterQuality: waterQuality.quality,
                lastUpdated: new Date()
            };

            // Generate warnings based on conditions
            beach.warnings = this.generateWarnings(oceanData, waterQuality);

            // Update suitability scores
            beach.suitabilityScores = this.calculateSuitabilityScores(beach.currentConditions);

            await beach.save();
            return beach;
        } catch (error) {
            console.error(`Error updating beach conditions for beach ${beachId}:`, error);
            throw error;
        }
    }

    generateWarnings(oceanData, waterQuality) {
        const warnings = [];

        // Wave height warnings
        if (oceanData.waveHeight > 2) {
            warnings.push({
                type: 'high_waves',
                message: `High waves detected (${oceanData.waveHeight}m)`,
                severity: oceanData.waveHeight > 3 ? 'high' : 'medium',
                active: true
            });
        }

        // Water quality warnings
        if (waterQuality.quality === 'poor') {
            warnings.push({
                type: 'water_quality',
                message: 'Poor water quality detected',
                severity: 'high',
                active: true
            });
        }

        // Wind speed warnings
        if (oceanData.windSpeed > 30) {
            warnings.push({
                type: 'other',
                message: `Strong winds detected (${oceanData.windSpeed}km/h)`,
                severity: 'high',
                active: true
            });
        }

        return warnings;
    }

    calculateSuitabilityScores(conditions) {
        // Implement your scoring logic here
        // This should match the logic in your beach routes
        const scores = {
            swimming: 0,
            surfing: 0,
            beachParty: 0,
            picnic: 0
        };

        // Swimming suitability
        if (conditions.waveHeight <= 1 && conditions.waterQuality === 'excellent') {
            scores.swimming = 100;
        } else if (conditions.waveHeight <= 2 && conditions.waterQuality === 'good') {
            scores.swimming = 75;
        } else if (conditions.waveHeight <= 3 && conditions.waterQuality !== 'poor') {
            scores.swimming = 50;
        }

        // Surfing suitability
        if (conditions.waveHeight >= 1 && conditions.waveHeight <= 3) {
            scores.surfing = 100;
        } else if (conditions.waveHeight > 3) {
            scores.surfing = 75;
        } else {
            scores.surfing = 25;
        }

        // Beach party suitability
        if (conditions.windSpeed <= 15) {
            scores.beachParty = 100;
        } else if (conditions.windSpeed <= 25) {
            scores.beachParty = 50;
        }

        // Picnic suitability
        if (conditions.windSpeed <= 20) {
            scores.picnic = 100;
        } else if (conditions.windSpeed <= 30) {
            scores.picnic = 50;
        }

        return scores;
    }
}

module.exports = new IncoisService(); 