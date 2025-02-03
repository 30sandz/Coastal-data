const mongoose = require('mongoose');

const beachSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    state: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    facilities: {
        restrooms: Boolean,
        parking: Boolean,
        lifeguards: Boolean,
        restaurants: Boolean,
        waterSports: Boolean,
        showers: Boolean
    },
    currentConditions: {
        waveHeight: Number,
        waterTemperature: Number,
        windSpeed: Number,
        waterQuality: String,
        lastUpdated: {
            type: Date,
            default: Date.now
        }
    },
    suitabilityScores: {
        swimming: {
            type: Number,
            min: 0,
            max: 100
        },
        surfing: {
            type: Number,
            min: 0,
            max: 100
        },
        beach_party: {
            type: Number,
            min: 0,
            max: 100
        },
        picnic: {
            type: Number,
            min: 0,
            max: 100
        }
    },
    warnings: [{
        message: String,
        active: {
            type: Boolean,
            default: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    reviews: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        comment: String,
        date: {
            type: Date,
            default: Date.now
        }
    }],
    images: [{
        url: String,
        caption: String,
        uploadedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        uploadDate: {
            type: Date,
            default: Date.now
        }
    }],
    status: {
        type: String,
        enum: ['active', 'inactive', 'warning'],
        default: 'active'
    }
}, {
    timestamps: true
});

// Index for geospatial queries
beachSchema.index({ location: '2dsphere' });

// Method to calculate overall suitability score
beachSchema.methods.calculateOverallSuitability = function() {
    const scores = this.suitabilityScores;
    return Object.values(scores).reduce((acc, score) => acc + score, 0) / Object.keys(scores).length;
};

// Static method to find nearby beaches
beachSchema.statics.findNearby = function(coordinates, maxDistance) {
    return this.find({
        location: {
            $near: {
                $geometry: {
                    type: 'Point',
                    coordinates: coordinates
                },
                $maxDistance: maxDistance
            }
        }
    });
};

const Beach = mongoose.model('Beach', beachSchema);

module.exports = Beach; 