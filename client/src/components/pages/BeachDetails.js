import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Chip,
  Divider,
  Rating,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  WavesOutlined,
  ThermostatOutlined,
  AirOutlined,
  WaterOutlined,
  Warning,
  Pool,
  Surfing,
  BeachAccess,
  Restaurant,
  Wc,
  LocalParking,
  PoolOutlined,
  RestaurantOutlined,
} from '@mui/icons-material';
import { getBeachById } from '../../services/beachService';
import ReviewSection from '../reviews/ReviewSection';
import WeatherWidget from '../widgets/WeatherWidget';
import ConditionsChart from '../charts/ConditionsChart';

const BeachDetails = () => {
  const { id } = useParams();
  const { data: beach, isLoading, error } = useQuery(
    ['beach', id],
    () => getBeachById(id),
    {
      refetchInterval: 300000, // Refetch every 5 minutes
    }
  );

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">
          Error loading beach details: {error.message}
        </Alert>
      </Container>
    );
  }

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

  const getFacilityIcon = (facility) => {
    switch (facility) {
      case 'restrooms':
        return <Wc />;
      case 'parking':
        return <LocalParking />;
      case 'lifeguards':
        return <PoolOutlined />;
      case 'restaurants':
        return <RestaurantOutlined />;
      default:
        return <BeachAccess />;
    }
  };

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

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Header Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, mb: 2 }}>
            <Typography variant="h4" gutterBottom>
              {beach.name}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              {beach.state}
            </Typography>
            <Typography variant="body1" paragraph>
              {beach.description}
            </Typography>

            {/* Active Warnings */}
            {beach.warnings?.some((w) => w.active) && (
              <Box sx={{ mt: 2 }}>
                {beach.warnings
                  .filter((w) => w.active)
                  .map((warning, index) => (
                    <Chip
                      key={index}
                      icon={<Warning />}
                      label={warning.message}
                      color="error"
                      sx={{ mr: 1, mb: 1 }}
                    />
                  ))}
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Current Conditions */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Current Conditions
            </Typography>
            <List>
              {Object.entries(beach.currentConditions).map(
                ([key, value]) =>
                  key !== 'lastUpdated' && (
                    <ListItem key={key}>
                      <ListItemIcon>{getConditionIcon(key)}</ListItemIcon>
                      <ListItemText
                        primary={key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                        secondary={
                          typeof value === 'number'
                            ? `${value} ${
                                key === 'waveHeight'
                                  ? 'm'
                                  : key === 'windSpeed'
                                  ? 'km/h'
                                  : '°C'
                              }`
                            : value
                        }
                      />
                    </ListItem>
                  )
              )}
            </List>
            <Typography variant="caption" color="text.secondary">
              Last updated: {new Date(beach.currentConditions.lastUpdated).toLocaleString()}
            </Typography>
          </Paper>
        </Grid>

        {/* Weather Widget */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <WeatherWidget location={beach.location} />
          </Paper>
        </Grid>

        {/* Conditions Chart */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Conditions Trend
            </Typography>
            <ConditionsChart beachId={beach._id} />
          </Paper>
        </Grid>

        {/* Facilities */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Facilities
            </Typography>
            <List>
              {Object.entries(beach.facilities).map(
                ([facility, available]) =>
                  available && (
                    <ListItem key={facility}>
                      <ListItemIcon>{getFacilityIcon(facility)}</ListItemIcon>
                      <ListItemText
                        primary={facility.replace('_', ' ').toLowerCase()}
                      />
                    </ListItem>
                  )
              )}
            </List>
          </Paper>
        </Grid>

        {/* Activity Suitability */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Activity Suitability
            </Typography>
            <List>
              {Object.entries(beach.suitabilityScores).map(([activity, score]) => (
                <ListItem key={activity}>
                  <ListItemIcon>{getActivityIcon(activity)}</ListItemIcon>
                  <ListItemText
                    primary={activity.replace('_', ' ')}
                    secondary={
                      <Rating
                        value={(score / 100) * 5}
                        precision={0.5}
                        readOnly
                      />
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Reviews Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Reviews
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <ReviewSection beachId={beach._id} reviews={beach.reviews} />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default BeachDetails; 