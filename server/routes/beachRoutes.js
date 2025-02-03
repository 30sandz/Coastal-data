const express = require('express');
const router = express.Router();
const Beach = require('../models/Beach');

// Get all beaches with optional filters
router.get('/', async (req, res) => {
  try {
    const { activity, state, minScore } = req.query;
    let query = {};

    if (state) {
      query.state = state;
    }

    if (activity) {
      query[`suitabilityScores.${activity}`] = { $gte: Number(minScore) || 0 };
    }

    const beaches = await Beach.find(query);
    res.json(beaches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get nearby beaches
router.get('/nearby', async (req, res) => {
  try {
    const { lat, lng, maxDistance = 50000 } = req.query; // maxDistance in meters
    
    const beaches = await Beach.findNearby(
      [Number(lng), Number(lat)],
      Number(maxDistance)
    );
    
    res.json(beaches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific beach
router.get('/:id', async (req, res) => {
  try {
    const beach = await Beach.findById(req.params.id);
    if (!beach) {
      return res.status(404).json({ message: 'Beach not found' });
    }
    res.json(beach);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a review to a beach
router.post('/:id/reviews', async (req, res) => {
  try {
    const beach = await Beach.findById(req.params.id);
    if (!beach) {
      return res.status(404).json({ message: 'Beach not found' });
    }

    const { rating, comment, userId } = req.body;
    beach.reviews.push({
      user: userId,
      rating,
      comment,
      date: new Date()
    });

    await beach.save();
    res.status(201).json(beach);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update beach conditions
router.patch('/:id/conditions', async (req, res) => {
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

    await beach.save();
    res.json(beach);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 