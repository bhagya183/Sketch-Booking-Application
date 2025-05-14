import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  TextField,
  InputAdornment,
  Dialog,
  DialogContent,
  IconButton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { sketchAPI } from '../services/api';

const SketchGallery = () => {
  const [sketches, setSketches] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSketch, setSelectedSketch] = useState(null);

  useEffect(() => {
    const fetchSketches = async () => {
      try {
        const response = await sketchAPI.getAll();
        setSketches(response.data);
      } catch (error) {
        console.error('Error fetching sketches:', error);
      }
    };

    fetchSketches();
  }, []);

  const filteredSketches = sketches.filter(sketch =>
    sketch.sketch_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (sketch.category && sketch.category.category_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleOpenDialog = (sketch) => {
    setSelectedSketch(sketch);
  };

  const handleCloseDialog = () => {
    setSelectedSketch(null);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Sketch Gallery
      </Typography>

      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search sketches by name or category..."
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

      <Grid container spacing={4}>
        {filteredSketches.map((sketch) => (
          <Grid item key={sketch.id} xs={12} sm={6} md={4}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                textAlign: 'center',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  transition: 'transform 0.3s ease-in-out',
                },
              }}
              onClick={() => handleOpenDialog(sketch)}
            >
              <CardMedia
                component="img"
                height="300"
                image={ './assets/HumanPortrait.jpg'}
                alt={sketch.sketch_name}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  {sketch.sketch_name}
                </Typography>
                {sketch.category && (
                  <Chip
                    label={sketch.category.category_name}
                    color="primary"
                    size="small"
                    sx={{ mb: 1 }}
                  />
                )}
                <Typography variant="h6" color="primary">
                  ${sketch.price}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={Boolean(selectedSketch)}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        {selectedSketch && (
          <>
            <IconButton
              onClick={handleCloseDialog}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: 'white',
                bgcolor: 'rgba(0, 0, 0, 0.5)',
                '&:hover': {
                  bgcolor: 'rgba(0, 0, 0, 0.7)',
                },
              }}
            >
              <CloseIcon />
            </IconButton>
            <DialogContent sx={{ p: 0 }}>
              <Box sx={{ position: 'relative' }}>
                <img
                  src={ './assets/HumanPortrait.jpg'}
                  alt={selectedSketch.sketch_name}
                  style={{ width: '100%', height: 'auto' }}
                />

                <Box 

                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    bgcolor: 'rgba(0, 0, 0, 0.7)',
                    color: 'white',
                    p: 2,
                  }}
                >
                  <Typography variant="h5">{selectedSketch.sketch_name}</Typography>
                  {selectedSketch.category && (
                    <Chip
                      label={selectedSketch.category.category_name}
                      color="primary"
                      size="small"
                      sx={{ mr: 1 }}
                    />
                  )}
                  <Typography variant="h6" sx={{ mt: 1 }}>
                    ${selectedSketch.price}
                  </Typography>
                </Box>
              </Box>
            </DialogContent>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default SketchGallery; 