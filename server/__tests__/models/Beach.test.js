const mongoose = require('mongoose');
const Beach = require('../../models/Beach');

describe('Beach Model Test', () => {
    beforeAll(async () => {
        await mongoose.connect(global.__MONGO_URI__, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    it('should create & save beach successfully', async () => {
        const validBeach = new Beach({
            name: 'Test Beach',
            location: {
                type: 'Point',
                coordinates: [72.8347, 18.9220] // Mumbai coordinates
            },
            state: 'Maharashtra',
            description: 'A beautiful test beach',
            facilities: {
                restrooms: true,
                parking: true,
                lifeguards: true
            }
        });

        const savedBeach = await validBeach.save();
        
        expect(savedBeach._id).toBeDefined();
        expect(savedBeach.name).toBe(validBeach.name);
        expect(savedBeach.location.coordinates).toEqual(validBeach.location.coordinates);
    });

    it('should fail to save beach without required fields', async () => {
        const beachWithoutRequiredField = new Beach({
            name: 'Incomplete Beach'
        });

        let err;
        try {
            await beachWithoutRequiredField.save();
        } catch (error) {
            err = error;
        }

        expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    });

    it('should calculate suitability scores correctly', async () => {
        const beach = new Beach({
            name: 'Score Test Beach',
            location: {
                type: 'Point',
                coordinates: [72.8347, 18.9220]
            },
            state: 'Maharashtra',
            description: 'Beach for testing scores',
            currentConditions: {
                waveHeight: 1.5,
                waterTemperature: 28,
                windSpeed: 12,
                windDirection: 'NE',
                waterQuality: 'good'
            }
        });

        const scores = beach.calculateOverallSuitability();
        expect(scores).toBeDefined();
        expect(typeof scores).toBe('number');
        expect(scores).toBeGreaterThanOrEqual(0);
        expect(scores).toBeLessThanOrEqual(100);
    });

    it('should find nearby beaches', async () => {
        // Create test beaches
        await Beach.create([
            {
                name: 'Near Beach 1',
                location: {
                    type: 'Point',
                    coordinates: [72.8347, 18.9220] // Mumbai
                },
                state: 'Maharashtra',
                description: 'Test beach 1'
            },
            {
                name: 'Near Beach 2',
                location: {
                    type: 'Point',
                    coordinates: [72.8547, 18.9320] // Nearby
                },
                state: 'Maharashtra',
                description: 'Test beach 2'
            },
            {
                name: 'Far Beach',
                location: {
                    type: 'Point',
                    coordinates: [80.2707, 13.0827] // Chennai (far away)
                },
                state: 'Tamil Nadu',
                description: 'Test beach 3'
            }
        ]);

        const nearbyBeaches = await Beach.findNearby([72.8347, 18.9220], 5000);
        expect(nearbyBeaches.length).toBe(2);
        expect(nearbyBeaches.some(b => b.name === 'Far Beach')).toBeFalsy();
    });
}); 