const beaches = [
  {
    name: "Calangute Beach",
    state: "Goa",
    description: "Known as the 'Queen of Beaches' in Goa, Calangute is famous for its vibrant atmosphere and water sports activities.",
    location: {
      type: "Point",
      coordinates: [73.7525, 15.5438]
    },
    facilities: {
      restrooms: true,
      parking: true,
      lifeguards: true,
      restaurants: true,
      waterSports: true,
      showers: true
    },
    currentConditions: {
      waveHeight: 0.5,
      waterTemperature: 28,
      windSpeed: 12,
      waterQuality: "Good"
    },
    suitabilityScores: {
      swimming: 85,
      surfing: 60,
      beach_party: 90,
      picnic: 85
    },
    warnings: []
  },
  {
    name: "Kovalam Beach",
    state: "Kerala",
    description: "A picturesque beach known for its lighthouse and calm waters, perfect for swimming and sunbathing.",
    location: {
      type: "Point",
      coordinates: [76.9785, 8.3988]
    },
    facilities: {
      restrooms: true,
      parking: true,
      lifeguards: true,
      restaurants: true,
      waterSports: true,
      showers: true
    },
    currentConditions: {
      waveHeight: 0.3,
      waterTemperature: 29,
      windSpeed: 8,
      waterQuality: "Excellent"
    },
    suitabilityScores: {
      swimming: 90,
      surfing: 40,
      beach_party: 75,
      picnic: 95
    },
    warnings: []
  },
  {
    name: "Marina Beach",
    state: "Tamil Nadu",
    description: "One of the longest urban beaches in the world, Marina Beach is a major tourist attraction in Chennai.",
    location: {
      type: "Point",
      coordinates: [80.2825, 13.0500]
    },
    facilities: {
      restrooms: true,
      parking: true,
      lifeguards: true,
      restaurants: true,
      waterSports: false,
      showers: false
    },
    currentConditions: {
      waveHeight: 0.8,
      waterTemperature: 27,
      windSpeed: 15,
      waterQuality: "Good"
    },
    suitabilityScores: {
      swimming: 60,
      surfing: 50,
      beach_party: 85,
      picnic: 90
    },
    warnings: [
      {
        message: "Strong currents during evening hours",
        active: true
      }
    ]
  },
  {
    name: "Puri Beach",
    state: "Odisha",
    description: "A sacred beach known for its religious significance and beautiful sunrise views.",
    location: {
      type: "Point",
      coordinates: [85.8317, 19.8076]
    },
    facilities: {
      restrooms: true,
      parking: true,
      lifeguards: true,
      restaurants: true,
      waterSports: false,
      showers: false
    },
    currentConditions: {
      waveHeight: 0.6,
      waterTemperature: 26,
      windSpeed: 10,
      waterQuality: "Good"
    },
    suitabilityScores: {
      swimming: 70,
      surfing: 45,
      beach_party: 80,
      picnic: 85
    },
    warnings: []
  },
  {
    name: "Varkala Beach",
    state: "Kerala",
    description: "A stunning beach set against dramatic cliffs, known for its mineral springs and excellent surfing conditions.",
    location: {
      type: "Point",
      coordinates: [76.7167, 8.7333]
    },
    facilities: {
      restrooms: true,
      parking: true,
      lifeguards: true,
      restaurants: true,
      waterSports: true,
      showers: true
    },
    currentConditions: {
      waveHeight: 1.2,
      waterTemperature: 28,
      windSpeed: 14,
      waterQuality: "Excellent"
    },
    suitabilityScores: {
      swimming: 75,
      surfing: 85,
      beach_party: 90,
      picnic: 80
    },
    warnings: []
  }
];

module.exports = beaches; 