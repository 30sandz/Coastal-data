require('dotenv').config();
const mongoose = require('mongoose');
const Beach = require('../models/Beach');
const beaches = require('../data/beaches');

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');

    // Clear existing beaches
    await Beach.deleteMany({});
    console.log('Cleared existing beaches');

    // Insert new beaches
    await Beach.insertMany(beaches);
    console.log('Inserted new beaches');

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase(); 