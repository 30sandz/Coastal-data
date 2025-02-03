import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
  Rating,
  Grid,
  Divider,
} from '@mui/material';
import {
  Pool,
  Surfing,
  BeachAccess,
  Restaurant,
  Warning,
  WavesOutlined,
  ThermostatOutlined,
  AirOutlined,
  WaterOutlined,
} from '@mui/icons-material';

const BeachCard = ({ beach }) => {
  const navigate = useNavigate();

  const getActivityIcon = (activity) => {
    switch (activity) {
      case 'swimming':
        return <Pool />;
      case 'surfing':
        return <Surfing />;
      case 'beach_party':
        return <BeachAccess />;
      case 'picnic':
        return <Restaurant />;
      default:
        return null;
    }
  };

  const getConditionIcon = (condition) => {
    switch (condition) {
      case 'waveHeight':
        return <WavesOutlined />;
      case 'waterTemperature':
        return <ThermostatOutlined />;
      case 'windSpeed':
        return <AirOutlined />;
      case 'waterQuality':
        return <WaterOutlined />;
      default:
        return null;
    }
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h5" gutterBottom>
          {beach.name}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          {beach.state}
        </Typography>

        {/* Active Warnings */}
        {beach.warnings?.some((w) => w.active) && (
          <Box sx={{ mt: 1, mb: 2 }}>
            {beach.warnings
              .filter((w) => w.active)
              .map((warning, index) => (
                <Chip
                  key={index}
                  icon={<Warning />}
                  label={warning.message}
                  color="error"
                  size="small"
                  sx={{ mr: 1, mb: 1 }}
                />
              ))}
          </Box>
        )}

        {/* Current Conditions */}
        <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
          Current Conditions
        </Typography>
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <WavesOutlined sx={{ mr: 1, fontSize: '1rem' }} />
              <Typography variant="body2">
                Waves: {beach.currentConditions.waveHeight}m
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ThermostatOutlined sx={{ mr: 1, fontSize: '1rem' }} />
              <Typography variant="body2">
                Water: {beach.currentConditions.waterTemperature}°C
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <AirOutlined sx={{ mr: 1, fontSize: '1rem' }} />
              <Typography variant="body2">
                Wind: {beach.currentConditions.windSpeed} km/h
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <WaterOutlined sx={{ mr: 1, fontSize: '1rem' }} />
              <Typography variant="body2">
                Quality: {beach.currentConditions.waterQuality}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        {/* Activity Scores */}
        <Typography variant="subtitle2" gutterBottom>
          Activity Suitability
        </Typography>
        <Grid container spacing={1}>
          {Object.entries(beach.suitabilityScores).map(([activity, score]) => (
            <Grid item xs={6} key={activity}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {getActivityIcon(activity)}
                <Box sx={{ ml: 1 }}>
                  <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                    {activity.replace('_', ' ')}
                  </Typography>
                  <Rating
                    value={(score / 100) * 5}
                    precision={0.5}
                    size="small"
                    readOnly
                  />
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </CardContent>

      <CardActions>
        <Button
          size="small"
          color="primary"
          onClick={() => navigate(`/beach/${beach._id}`)}
        >
          View Details
        </Button>
      </CardActions>
    </Card>
  );
};

export default BeachCard; 