import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
} from '@mui/material';
import BrushIcon from '@mui/icons-material/Brush';
import PaletteIcon from '@mui/icons-material/Palette';
import BookOnlineIcon from '@mui/icons-material/BookOnline';

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <BrushIcon sx={{ fontSize: 40 }} />,
      title: 'Sketch Gallery',
      description: 'Browse through our collection of beautiful sketches from talented artists.',
      action: () => navigate('/gallery'),
    },
    {
      icon: <PaletteIcon sx={{ fontSize: 40 }} />,
      title: 'Find Artists',
      description: 'Discover skilled artists and view their portfolios.',
      action: () => navigate('/artists'),
    },
    {
      icon: <BookOnlineIcon sx={{ fontSize: 40 }} />,
      title: 'Book a Sketch',
      description: 'Commission custom sketches from our talented artists.',
      action: () => navigate('/artists'),
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          mb: 6,
        }}
      >
        <Container maxWidth="md">
          <Typography
            component="h1"
            variant="h2"
            align="center"
            gutterBottom
          >
            Welcome to Sketch Booking
          </Typography>
          <Typography variant="h5" align="center" paragraph>
            Discover talented artists and commission beautiful sketches for your special moments
          </Typography>
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              onClick={() => navigate('/gallery')}
            >
              View Gallery
            </Button>
            <Button
              variant="outlined"
              color="inherit"
              size="large"
              onClick={() => navigate('/artists')}
            >
              Find Artists
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  p: 2,
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    transition: 'transform 0.3s ease-in-out',
                    cursor: 'pointer',
                  },
                }}
                onClick={feature.action}
              >
                <Box sx={{ color: 'primary.main', mb: 2 }}>
                  {feature.icon}
                </Box>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    {feature.title}
                  </Typography>
                  <Typography color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Home; 