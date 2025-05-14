import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Alert,
  CircularProgress,
} from '@mui/material';
import { artistAPI, bookingAPI } from '../services/api';

const BookingForm = () => {
  const { artistId } = useParams();
  const navigate = useNavigate();
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    sketchDetails: '',
    total_price: '',
  });

  useEffect(() => {
    const fetchArtist = async () => {
      try {
        const response = await artistAPI.getById(artistId);
        setArtist(response.data);
        setLoading(false);
      } catch (error) {
        setError('Error fetching artist details');
        setLoading(false);
      }
    };

    fetchArtist();
  }, [artistId]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const bookingData = {
        ...formData,
        artist_id: parseInt(artistId),
        status: 'pending',
      };

      await bookingAPI.create(bookingData);
      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while booking');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Book a Sketch with {artist?.first_name} {artist?.last_name}
        </Typography>

        <Typography variant="subtitle1" color="text.secondary" paragraph>
          Specialization: {artist?.specialization}
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                multiline
                rows={4}
                label="Sketch Details"
                name="sketchDetails"
                value={formData.sketchDetails}
                onChange={handleChange}
                helperText="Please describe what kind of sketch you want (e.g., portrait, landscape, etc.)"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                type="number"
                label="Total Price"
                name="total_price"
                value={formData.total_price}
                onChange={handleChange}
                helperText="Enter the agreed price for the sketch"
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                fullWidth
              >
                Submit Booking
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default BookingForm; 