
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material';
import { userAPI } from '../services/api';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');


 const fetchUserData = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const response = await userAPI.getProfile();
    console.log('API Response:', response.data.alps.descriptor);  // Log the descriptor array

    // Extracting user data from the descriptor array
    const userRepresentation = response.data.alps.descriptor[0];  // Access the first item
    const userDetails = userRepresentation?.descriptor || [];  // Access the descriptor array

    console.log('User Details:', userDetails);  // Log the user details for inspection

    // Extracting values for user fields
    const user = {};
    userDetails.forEach(detail => {
      if (detail.name === 'first_name') {
        user.first_name = detail.value || '';  // Assign first_name if found
      }
      if (detail.name === 'last_name') {
        user.last_name = detail.value || '';  // Assign last_name if found
      }
      if (detail.name === 'email') {
        user.email = detail.value || '';  // Assign email if found
      }
      if (detail.name === 'mobile') {
        user.mobile = detail.value || '';  // Assign mobile if found
      }
    });

    // Now, set user and bookings
    setUser(user);  // Set the user state with extracted data
    setBookings(response.data.bookings || []);  // Set bookings if available
    setLoading(false);
  } catch (error) {
    setError('Error fetching user data');
    setLoading(false);
  }
};


  useEffect(() => {
    fetchUserData();
  }, [navigate]);

  /*
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        console.log(user); 
        const response = await userAPI.getProfile();
        
        console.log('API Response:', response); // Check the response data

        setUser(response.data);
        console.log("Profile component mounted")
        setBookings(response.data.bookings || []);
        setLoading(false);
      } catch (error) {
        setError('Error fetching user data');
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);
*/
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'warning';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
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
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={4}>
        {/* User Profile Section */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Profile Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Name
              </Typography>
              <Typography variant="body1">
                {user?.first_name} {user?.last_name}
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Email
              </Typography>
              <Typography variant="body1">{user?.email}</Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Mobile
              </Typography>
              <Typography variant="body1">{user?.mobile}</Typography>
            </Box>
            <Button
              variant="outlined"
              color="primary"
              fullWidth
              onClick={() => navigate('/user/updatePassword')}
            >
              Change Password
            </Button>
          </Paper>
        </Grid>

        {/* Booking History Section */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Booking History
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {bookings.length === 0 ? (
              <Typography color="text.secondary">
                No bookings found
              </Typography>
            ) : (
              <Grid container spacing={2}>
                {bookings.map((booking) => (
                  <Grid item xs={12} key={booking.id}>
                    <Card>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="h6">
                            Sketch with {booking.artist?.first_name} {booking.artist?.last_name}
                          </Typography>
                          <Chip
                            label={booking.status}
                            color={getStatusColor(booking.status)}
                            size="small"
                          />
                        </Box>
                        <Typography variant="body2" color="text.secondary" paragraph>
                          {booking.sketchDetails}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2" color="text.secondary">
                            Booked on: {new Date(booking.booking_date).toLocaleDateString()}
                          </Typography>
                          <Typography variant="h6" color="primary">
                            ${booking.total_price}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
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