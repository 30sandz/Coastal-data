import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getAllBeaches = async (filters = {}) => {
  try {
    console.log('Fetching beaches with filters:', filters); // Debug log
    const response = await axios.get(`${API_URL}/beaches`, {
      params: {
        activity: filters.activity || undefined,
        state: filters.state !== 'All States' ? filters.state : undefined,
        minScore: filters.minScore || undefined,
      },
    });
    console.log('Received beaches:', response.data); // Debug log
    return response.data;
  } catch (error) {
    console.error('Error fetching beaches:', error); // Debug log
    throw new Error(error.response?.data?.message || 'Failed to fetch beaches');
  }
};

export const getNearbyBeaches = async (lat, lng, maxDistance) => {
  try {
    const response = await axios.get(`${API_URL}/beaches/nearby`, {
      params: { lat, lng, maxDistance },
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch nearby beaches');
  }
};

export const getBeachById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/beaches/${id}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch beach details');
  }
};

export const addReview = async (beachId, review) => {
  try {
    const response = await axios.post(
      `${API_URL}/beaches/${beachId}/reviews`,
      review,
      {
        headers: getAuthHeader(),
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to add review');
  }
};

export const toggleFavorite = async (beachId) => {
  const response = await fetch(`${API_URL}/api/beaches/${beachId}/favorite`, {
    method: 'POST',
    headers: getAuthHeader(),
  });
  
  if (!response.ok) {
    throw new Error('Failed to toggle favorite');
  }
  
  return response.json();
};

export const getBeachConditions = async (beachId) => {
  try {
    const response = await axios.get(
      `${API_URL}/beaches/${beachId}/conditions`,
      {
        headers: getAuthHeader(),
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch beach conditions');
  }
};

export const getSuitabilityScore = (conditions) => {
  const scores = {
    swimming: calculateSwimmingScore(conditions),
    surfing: calculateSurfingScore(conditions),
    beach_party: calculateBeachPartyScore(conditions),
    picnic: calculatePicnicScore(conditions)
  };
  return scores;
};

const calculateSwimmingScore = (conditions) => {
  let score = 100;
  
  if (conditions.waveHeight > 1.5) score -= 20;
  if (conditions.windSpeed > 20) score -= 15;
  if (conditions.waterTemperature < 20) score -= 25;
  if (conditions.waterQuality !== 'Good' && conditions.waterQuality !== 'Excellent') score -= 30;
  
  return Math.max(0, Math.min(100, score));
};

const calculateSurfingScore = (conditions) => {
  let score = 100;
  
  if (conditions.waveHeight < 0.5) score -= 30;
  if (conditions.waveHeight > 3) score -= 20;
  if (conditions.windSpeed < 5) score -= 10;
  if (conditions.windSpeed > 30) score -= 30;
  
  return Math.max(0, Math.min(100, score));
};

const calculateBeachPartyScore = (conditions) => {
  let score = 100;
  
  if (conditions.windSpeed > 25) score -= 20;
  if (conditions.waterTemperature < 22) score -= 15;
  
  return Math.max(0, Math.min(100, score));
};

const calculatePicnicScore = (conditions) => {
  let score = 100;
  
  if (conditions.windSpeed > 20) score -= 25;
  if (conditions.waterTemperature < 20) score -= 10;
  
  return Math.max(0, Math.min(100, score));
}; 