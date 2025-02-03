import React, { useState } from 'react';
import { useQuery } from 'react-query';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
} from '@mui/material';
import { getAllBeaches } from '../../services/beachService';
import BeachCard from '../beaches/BeachCard';

const activities = [
  { value: 'swimming', label: 'Swimming' },
  { value: 'surfing', label: 'Surfing' },
  { value: 'beach_party', label: 'Beach Party' },
  { value: 'picnic', label: 'Picnic' },
];

const states = [
  'All States',
  'Goa',
  'Kerala',
  'Tamil Nadu',
  'Maharashtra',
  'Odisha',
  'Gujarat',
  'Andhra Pradesh',
];

const Home = () => {
  const [filters, setFilters] = useState({
    activity: '',
    state: 'All States',
    minScore: 0,
  });

  const { data: beaches, isLoading, error } = useQuery(
    ['beaches', filters],
    () => getAllBeaches(filters),
    {
      refetchInterval: 300000, // Refetch every 5 minutes
      onError: (error) => {
        console.error('Error fetching beaches:', error);
      },
      onSuccess: (data) => {
        console.log('Successfully fetched beaches:', data);
      },
    }
  );

  const handleFilterChange = (type, value) => {
    console.log('Filter changed:', type, value); // Debug log
    setFilters((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

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
          Error loading beaches: {error.message}
        </Alert>
      </Container>
    );
  }

  const filteredBeaches = beaches?.filter((beach) => {
    if (filters.state !== 'All States' && beach.state !== filters.state) {
      return false;
    }
    if (
      filters.activity &&
      beach.suitabilityScores[filters.activity] < filters.minScore
    ) {
      return false;
    }
    return true;
  });

  console.log('Filtered beaches:', filteredBeaches); // Debug log

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Filters Section */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Find Your Perfect Beach
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Activity</InputLabel>
              <Select
                value={filters.activity}
                label="Activity"
                onChange={(e) => handleFilterChange('activity', e.target.value)}
              >
                <MenuItem value="">All Activities</MenuItem>
                {activities.map((activity) => (
                  <MenuItem key={activity.value} value={activity.value}>
                    {activity.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>State</InputLabel>
              <Select
                value={filters.state}
                label="State"
                onChange={(e) => handleFilterChange('state', e.target.value)}
              >
                {states.map((state) => (
                  <MenuItem key={state} value={state}>
                    {state}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          {filters.activity && (
            <Grid item xs={12} md={4}>
              <Typography gutterBottom>
                Minimum Suitability Score: {filters.minScore}
              </Typography>
              <Slider
                value={filters.minScore}
                onChange={(e, value) => handleFilterChange('minScore', value)}
                valueLabelDisplay="auto"
                step={10}
                marks
                min={0}
                max={100}
              />
            </Grid>
          )}
        </Grid>
      </Paper>

      {/* Results Section */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" color="text.secondary">
          {filteredBeaches?.length || 0} beaches found
        </Typography>
      </Box>

      {/* Beach Cards */}
      <Grid container spacing={3}>
        {filteredBeaches?.map((beach) => (
          <Grid item key={beach._id} xs={12} md={6} lg={4}>
            <BeachCard beach={beach} />
          </Grid>
        ))}
      </Grid>

      {(!filteredBeaches || filteredBeaches.length === 0) && (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="200px"
        >
          <Typography variant="h6" color="text.secondary">
            No beaches found matching your criteria
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default Home; 