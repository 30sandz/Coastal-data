# Coastal Companion

A full-stack web application for discovering and exploring beaches in India. Users can find beaches based on activities, location, and current conditions.

## Features

- Browse beaches across different Indian states
- Filter beaches by:
  - Activities (Swimming, Surfing, Beach Party, Picnic)
  - State location
  - Minimum suitability score
- View detailed beach information:
  - Current conditions (wave height, water temperature, wind speed, water quality)
  - Activity suitability scores
  - Available facilities
  - User reviews
  - Weather information

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd coastal-companion
```

2. Install dependencies for both server and client:
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. Environment Setup:

Create `.env` file in the server directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/coastal-companion
JWT_SECRET=your_jwt_secret_here
INCOIS_API_BASE_URL=https://incois.gov.in/api
OPENWEATHER_API_KEY=your_openweather_api_key_here
NODE_ENV=development
```

Create `.env` file in the client directory:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_MAPBOX_TOKEN=your_mapbox_token_here
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
REACT_APP_OPENWEATHER_API_KEY=your_openweather_api_key_here
```

Note: The `.env` files are included in `.gitignore` to protect sensitive information. Make sure to keep your API keys and secrets secure and never commit them to version control.

## Running the Application

1. Start the MongoDB service on your system

2. Seed the database with beach data:
```bash
cd server
node scripts/seedBeaches.js
```

3. Start the server:
```bash
cd server
npm run dev
```
The server will run on http://localhost:5000

4. Start the client application:
```bash
cd client
npm start
```
The client will run on http://localhost:3000

## API Endpoints

### Beaches
- GET `/api/beaches` - Get all beaches with optional filters
- GET `/api/beaches/:id` - Get beach details by ID
- GET `/api/beaches/nearby` - Get nearby beaches based on coordinates
- GET `/api/beaches/:id/conditions` - Get beach conditions

### Reviews
- POST `/api/beaches/:id/reviews` - Add a review for a beach
- GET `/api/beaches/:id/reviews` - Get reviews for a beach

### User Authentication
- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/profile` - Get user profile

## Tech Stack

### Frontend
- React.js
- Material-UI
- React Query
- Axios
- React Router
- Recharts for data visualization

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Node-cron for scheduled tasks

## Project Structure
```
coastal-companion/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── context/      # Context providers
│   │   ├── services/     # API services
│   │   └── App.js        # Main app component
│   ├── .env              # Frontend environment variables
│   └── package.json      # Frontend dependencies
├── server/                # Express backend
│   ├── models/           # MongoDB schemas
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   ├── services/         # Business logic
│   ├── scripts/          # Database scripts
│   ├── .env              # Backend environment variables
│   └── package.json      # Backend dependencies
├── .gitignore            # Git ignore rules
└── README.md             # Project documentation
```

## Development

### Version Control
- The project uses `.gitignore` to exclude sensitive information and unnecessary files
- Environment variables should be kept secure and not committed to the repository
- Node modules and build artifacts are excluded from version control

### Environment Variables
- Both client and server use separate `.env` files for configuration
- Never commit actual API keys or secrets to version control
- Use example.env files to show required variables without actual values

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details 