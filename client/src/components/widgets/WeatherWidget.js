import React from 'react';
import { useQuery } from 'react-query';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Grid,
  Divider,
} from '@mui/material';
import {
  WbSunny,
  Cloud,
  Opacity,
  Air,
  DeviceThermostat,
} from '@mui/icons-material';

const WeatherWidget = ({ location }) => {
  const { data: weather, isLoading, error } = useQuery(
    ['weather', location],
    async () => {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${location.coordinates[1]}&lon=${location.coordinates[0]}&units=metric&appid=${process.env.REACT_APP_OPENWEATHER_API_KEY}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }
      return response.json();
    },
    {
      refetchInterval: 1800000, // Refetch every 30 minutes
    }
  );

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight={200}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        Error loading weather data: {error.message}
      </Alert>
    );
  }

  const getWeatherIcon = (iconCode) => {
    const iconMap = {
      '01d': <WbSunny sx={{ fontSize: 48 }} />,
      '01n': <WbSunny sx={{ fontSize: 48 }} />,
      default: <Cloud sx={{ fontSize: 48 }} />,
    };
    return iconMap[iconCode] || iconMap.default;
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Current Weather
      </Typography>

      <Grid container spacing={2}>
        {/* Main Weather Display */}
        <Grid item xs={12}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 2,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {getWeatherIcon(weather.weather[0].icon)}
              <Box sx={{ ml: 2 }}>
                <Typography variant="h4">
                  {Math.round(weather.main.temp)}°C
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  {weather.weather[0].description}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Divider />
        </Grid>

        {/* Weather Details */}
        <Grid item xs={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <DeviceThermostat sx={{ mr: 1 }} />
            <Box>
              <Typography variant="body2" color="text.secondary">
                Feels Like
              </Typography>
              <Typography variant="body1">
                {Math.round(weather.main.feels_like)}°C
              </Typography>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Opacity sx={{ mr: 1 }} />
            <Box>
              <Typography variant="body2" color="text.secondary">
                Humidity
              </Typography>
              <Typography variant="body1">{weather.main.humidity}%</Typography>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={6}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Air sx={{ mr: 1 }} />
            <Box>
              <Typography variant="body2" color="text.secondary">
                Wind Speed
              </Typography>
              <Typography variant="body1">
                {Math.round(weather.wind.speed * 3.6)} km/h
              </Typography>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={6}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Cloud sx={{ mr: 1 }} />
            <Box>
              <Typography variant="body2" color="text.secondary">
                Cloud Cover
              </Typography>
              <Typography variant="body1">{weather.clouds.all}%</Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: 'block', mt: 2, textAlign: 'right' }}
      >
        Last updated: {new Date(weather.dt * 1000).toLocaleTimeString()}
      </Typography>
    </Box>
  );
};

export default WeatherWidget; 