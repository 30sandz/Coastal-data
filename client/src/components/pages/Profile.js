import React, { useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Alert,
  Divider,
  FormGroup,
  FormControlLabel,
  Switch,
  Chip,
  CircularProgress,
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { useMutation, useQuery } from 'react-query';
import { getAllBeaches } from '../../services/beachService';
import BeachCard from '../beaches/BeachCard';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    username: user.username || '',
    email: user.email || '',
  });
  const [preferences, setPreferences] = useState(user.preferences || {
    activities: [],
    notifications: {
      email: false,
      push: true,
    },
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch favorite beaches
  const {
    data: favoriteBeaches,
    isLoading,
    error: fetchError,
  } = useQuery('favoriteBeaches', () =>
    getAllBeaches({ ids: user.favoriteBeaches })
  );

  const updateProfileMutation = useMutation(
    (updates) => updateProfile(updates),
    {
      onSuccess: () => {
        setSuccess('Profile updated successfully');
        setTimeout(() => setSuccess(''), 3000);
      },
      onError: (error) => {
        setError(error.message || 'Failed to update profile');
      },
    }
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleActivityToggle = (activity) => {
    setPreferences((prev) => {
      const activities = prev.activities.includes(activity)
        ? prev.activities.filter((a) => a !== activity)
        : [...prev.activities, activity];
      return { ...prev, activities };
    });
  };

  const handleNotificationChange = (type) => {
    setPreferences((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: !prev.notifications[type],
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    updateProfileMutation.mutate({
      ...formData,
      preferences,
    });
  };

  const activities = [
    'swimming',
    'surfing',
    'beach_party',
    'picnic',
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Profile Settings */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Profile Settings
            </Typography>
            <Divider sx={{ mb: 3 }} />

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {success}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                margin="normal"
              />

              <Typography variant="subtitle1" sx={{ mt: 3, mb: 2 }}>
                Preferred Activities
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                {activities.map((activity) => (
                  <Chip
                    key={activity}
                    label={activity.replace('_', ' ')}
                    onClick={() => handleActivityToggle(activity)}
                    color={
                      preferences.activities.includes(activity)
                        ? 'primary'
                        : 'default'
                    }
                    variant={
                      preferences.activities.includes(activity)
                        ? 'filled'
                        : 'outlined'
                    }
                  />
                ))}
              </Box>

              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                Notifications
              </Typography>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      checked={preferences.notifications.email}
                      onChange={() => handleNotificationChange('email')}
                    />
                  }
                  label="Email Notifications"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={preferences.notifications.push}
                      onChange={() => handleNotificationChange('push')}
                    />
                  }
                  label="Push Notifications"
                />
              </FormGroup>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ mt: 3 }}
                disabled={updateProfileMutation.isLoading}
              >
                {updateProfileMutation.isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </form>
          </Paper>
        </Grid>

        {/* Favorite Beaches */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Favorite Beaches
            </Typography>
            <Divider sx={{ mb: 3 }} />

            {isLoading ? (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight={200}
              >
                <CircularProgress />
              </Box>
            ) : fetchError ? (
              <Alert severity="error">
                Error loading favorite beaches: {fetchError.message}
              </Alert>
            ) : favoriteBeaches?.length === 0 ? (
              <Typography color="text.secondary">
                No favorite beaches yet. Start exploring to add some!
              </Typography>
            ) : (
              <Grid container spacing={2}>
                {favoriteBeaches?.map((beach) => (
                  <Grid item xs={12} key={beach._id}>
                    <BeachCard beach={beach} />
                  </Grid>
                ))}
              </Grid>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile; 