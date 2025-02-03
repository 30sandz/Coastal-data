import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Rating,
  Avatar,
  List,
  ListItem,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { useMutation, useQueryClient } from 'react-query';
import { addReview } from '../../services/beachService';

const ReviewSection = ({ beachId, reviews = [] }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [openDialog, setOpenDialog] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: '',
  });
  const [error, setError] = useState('');

  const addReviewMutation = useMutation(
    (review) => addReview(beachId, review),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['beach', beachId]);
        handleClose();
      },
      onError: (error) => {
        setError(error.message || 'Failed to add review');
      },
    }
  );

  const handleClickOpen = () => {
    if (!user) {
      setError('Please login to add a review');
      return;
    }
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
    setNewReview({ rating: 0, comment: '' });
    setError('');
  };

  const handleSubmit = async () => {
    if (newReview.rating === 0) {
      setError('Please provide a rating');
      return;
    }

    addReviewMutation.mutate(newReview);
  };

  const getInitials = (username) => {
    return username
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">
          Reviews ({reviews.length})
        </Typography>
        <Button
          variant="contained"
          onClick={handleClickOpen}
          disabled={!user}
        >
          Add Review
        </Button>
      </Box>

      {/* Reviews List */}
      <List>
        {reviews.map((review, index) => (
          <React.Fragment key={index}>
            <ListItem alignItems="flex-start" sx={{ px: 0 }}>
              <Box sx={{ display: 'flex', width: '100%' }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  {getInitials(review.user.username)}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="subtitle1">
                      {review.user.username}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(review.date).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Rating value={review.rating} readOnly size="small" sx={{ my: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    {review.comment}
                  </Typography>
                </Box>
              </Box>
            </ListItem>
            {index < reviews.length - 1 && <Divider component="li" />}
          </React.Fragment>
        ))}
        {reviews.length === 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
            No reviews yet. Be the first to review this beach!
          </Typography>
        )}
      </List>

      {/* Add Review Dialog */}
      <Dialog open={openDialog} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Add Review</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Box sx={{ py: 2 }}>
            <Typography component="legend">Rating</Typography>
            <Rating
              value={newReview.rating}
              onChange={(event, newValue) => {
                setNewReview((prev) => ({ ...prev, rating: newValue }));
              }}
              size="large"
            />
          </Box>
          <TextField
            autoFocus
            margin="dense"
            label="Review"
            fullWidth
            multiline
            rows={4}
            value={newReview.comment}
            onChange={(e) =>
              setNewReview((prev) => ({ ...prev, comment: e.target.value }))
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={addReviewMutation.isLoading}
          >
            {addReviewMutation.isLoading ? 'Submitting...' : 'Submit'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ReviewSection; 