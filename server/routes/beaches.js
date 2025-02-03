const express = require('express');
const router = express.Router();
const { auth, adminAuth } = require('../middleware/auth');
const Beach = require('../models/Beach');

// Get all beaches with optional filters
router.get('/', async (req, res) => {
    try {
        const { activity, state, minSuitability } = req.query;
        let query = {};

        if (state) {
            query.state = state;
        }

        if (activity) {
            query[`suitabilityScores.${activity}`] = { $gte: minSuitability || 0 };
        }

        const beaches = await Beach.find(query)
            .select('-reviews')
            .sort('-suitabilityScores.overall');

        res.json(beaches);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching beaches', error: error.message });
    }
});

// Get nearby beaches
router.get('/nearby', async (req, res) => {
    try {
        const { lat, lng, maxDistance = 10000 } = req.query; // maxDistance in meters

        if (!lat || !lng) {
            return res.status(400).json({ message: 'Latitude and longitude are required' });
        }

        const beaches = await Beach.findNearby([parseFloat(lng), parseFloat(lat)], parseFloat(maxDistance));
        res.json(beaches);
    } catch (error) {
        res.status(500).json({ message: 'Error finding nearby beaches', error: error.message });
    }
});

// Get single beach by ID
router.get('/:id', async (req, res) => {
    try {
        const beach = await Beach.findById(req.params.id)
            .populate({
                path: 'reviews.user',
                select: 'username'
            });

        if (!beach) {
            return res.status(404).json({ message: 'Beach not found' });
        }

        res.json(beach);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching beach', error: error.message });
    }
});

// Add new beach (admin only)
router.post('/', adminAuth, async (req, res) => {
    try {
        const beach = new Beach(req.body);
        await beach.save();
        res.status(201).json(beach);
    } catch (error) {
        res.status(400).json({ message: 'Error creating beach', error: error.message });
    }
});

// Update beach (admin only)
router.patch('/:id', adminAuth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = [
        'name', 'description', 'facilities', 'currentConditions',
        'suitabilityScores', 'warnings', 'status'
    ];
    
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).json({ message: 'Invalid updates' });
    }

    try {
        const beach = await Beach.findById(req.params.id);
        
        if (!beach) {
            return res.status(404).json({ message: 'Beach not found' });
        }

        updates.forEach(update => beach[update] = req.body[update]);
        await beach.save();
        
        res.json(beach);
    } catch (error) {
        res.status(400).json({ message: 'Error updating beach', error: error.message });
    }
});

// Add review to beach
router.post('/:id/reviews', auth, async (req, res) => {
    try {
        const beach = await Beach.findById(req.params.id);
        
        if (!beach) {
            return res.status(404).json({ message: 'Beach not found' });
        }

        const review = {
            user: req.user._id,
            rating: req.body.rating,
            comment: req.body.comment
        };

        beach.reviews.push(review);
        await beach.save();

        res.status(201).json(beach);
    } catch (error) {
        res.status(400).json({ message: 'Error adding review', error: error.message });
    }
});

// Toggle favorite beach for user
router.post('/:id/favorite', auth, async (req, res) => {
    try {
        const beach = await Beach.findById(req.params.id);
        
        if (!beach) {
            return res.status(404).json({ message: 'Beach not found' });
        }

        const index = req.user.favoriteBeaches.indexOf(beach._id);
        
        if (index === -1) {
            req.user.favoriteBeaches.push(beach._id);
        } else {
            req.user.favoriteBeaches.splice(index, 1);
        }

        await req.user.save();
        res.json({ message: 'Favorites updated successfully', favoriteBeaches: req.user.favoriteBeaches });
    } catch (error) {
        res.status(400).json({ message: 'Error updating favorites', error: error.message });
    }
});

// Update current conditions (admin only)
router.patch('/:id/conditions', adminAuth, async (req, res) => {
    try {
        const beach = await Beach.findById(req.params.id);
        
        if (!beach) {
            return res.status(404).json({ message: 'Beach not found' });
        }

        beach.currentConditions = {
            ...beach.currentConditions,
            ...req.body,
            lastUpdated: new Date()
        };

        // Recalculate suitability scores based on new conditions
        // This is a placeholder - implement your own scoring logic
        beach.suitabilityScores = calculateSuitabilityScores(beach.currentConditions);

        await beach.save();
        res.json(beach);
    } catch (error) {
        res.status(400).json({ message: 'Error updating conditions', error: error.message });
    }
});

// Helper function to calculate suitability scores
function calculateSuitabilityScores(conditions) {
    // This is a simple example - implement your own scoring logic
    const scores = {
        swimming: 0,
        surfing: 0,
        beachParty: 0,
        picnic: 0
    };

    // Swimming suitability
    if (conditions.waveHeight <= 1) {
        scores.swimming = 100;
    } else if (conditions.waveHeight <= 2) {
        scores.swimming = 50;
    }

    // Surfing suitability
    if (conditions.waveHeight >= 1 && conditions.waveHeight <= 3) {
        scores.surfing = 100;
    } else if (conditions.waveHeight > 3) {
        scores.surfing = 50;
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

module.exports = router; 