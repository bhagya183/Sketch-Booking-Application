import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Chip,
  TextField,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { artistAPI } from '../services/api';

const ArtistList = () => {
  const navigate = useNavigate();
  const [artists, setArtists] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  console.log('ArtistList component mounted');

  useEffect(() => {
  const fetchArtists = async () => {
    try {
      const response = await artistAPI.getAll();
      console.log('Raw API response:', response);

      // Check if response.data is an array or needs further access
      if (Array.isArray(response.data)) {
        console.log('✅ response.data is an array');
        setArtists(response.data);
      } else if (Array.isArray(response.data.artists)) {
        console.log('✅ response.data.artists is an array');
        setArtists(response.data.artists);
      } else {
        console.error('❌ Unexpected response structure:', response.data);
        setArtists([]); // fallback
      }
    } catch (error) {
      console.error('❌ Error fetching artists:', error);
    }
  };

  fetchArtists();
}, []);

 

  /*
  const filteredArtists = artists.filter(artist =>
  {filteredArtists.length === 0 ? (
  <Typography>No artists found.</Typography>
) : (
  filteredArtists.map((artist) => (
    // your grid code
     artist.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    artist.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    artist.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  ))
)});
*/

const filteredArtists = Array.isArray(artists)
  ? artists.filter(artist =>
      artist.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      artist.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      artist.specialization.toLowerCase().includes(searchTerm.toLowerCase())
    )
  : [];


/*
  const filteredArtists = artists.filter(artist =>
    artist.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    artist.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    artist.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );
*/

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Our Artists
      </Typography>

      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search artists by name or specialization..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>


    {filteredArtists.length === 0 ? (
        <Typography variant="h6" color="text.secondary">
          No artists found.
        </Typography>
      ) : (

      <Grid container spacing={4}>
        {filteredArtists.map((artist) => (
          <Grid item key={artist.id} xs={12} sm={6} md={4}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  transition: 'transform 0.3s ease-in-out',
                  cursor: 'pointer',
                },
              }}
            >


             <img
                  src={`./assets/user.png`}
                  alt="Artist"
                  style={{ width: "250px", height: "250px", objectFit: "cover" }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                  {artist.first_name} {artist.last_name}
                </Typography>
                <Chip
                  label={artist.specialization}
                  color="primary"
                  size="small"
                  sx={{ mb: 2 }}
                />
                <Typography variant="body2" color="text.secondary" paragraph>
                  {artist.availability}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={() => navigate(`/booking/${artist.id}`)}
                >
                  Book Now
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

)}

    </Container>
  );
};

export default ArtistList; 