import axios from 'axios';

//const API_URL = 'http://localhost:8080';
const API_URL = 'sketchbooking-production.up.railway.app';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// File upload helper function
const uploadFile = async (file, sketchId) => {
  if (!file) {
    throw new Error('No file provided');
  }

  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post(`${API_URL}/sketches/${sketchId}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Accept': 'application/json',
      },
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error('File upload error:', error);
    throw error;
  }
};

// Auth API calls
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
};

// User API calls
export const userAPI = {
  getProfile: () => api.get('/user-profiles'),
  updatePassword: (passwordData) => api.put('/user/updatePassword', passwordData),
};

// Artist API calls
export const artistAPI = {
  getAll: () => api.get('/artists'),
  getById: (id) => api.get(`/artists/${id}`),
  create: async (artistData, imageFile) => {
    try {
      if (imageFile) {
        const uploadResponse = await uploadFile(imageFile);
        artistData.image_url = uploadResponse.fileDownloadUri;
      }
      return api.post('/artists', artistData);
    } catch (error) {
      console.error('Error creating artist:', error);
      throw error;
    }
  },
  update: async (id, artistData, imageFile) => {
    try {
      if (imageFile) {
        const uploadResponse = await uploadFile(imageFile);
        artistData.image_url = uploadResponse.fileDownloadUri;
      }
      return api.put(`/artists/${id}`, artistData);
    } catch (error) {
      console.error('Error updating artist:', error);
      throw error;
    }
  },
};

// Sketch API calls
export const sketchAPI = {
  getAll: () => api.get('/sketches'),
  getById: (id) => api.get(`/sketches/${id}`),
  create: async (sketchData, imageFile) => {
    try {
      const response = await api.post('/sketches', sketchData);
      if (imageFile) {
        await uploadFile(imageFile, response.data.id);
      }
      return response;
    } catch (error) {
      console.error('Error creating sketch:', error);
      throw error;
    }
  },
  update: async (id, sketchData, imageFile) => {
    try {
      const response = await api.put(`/sketches/${id}`, sketchData);
      if (imageFile) {
        await uploadFile(imageFile, id);
      }
      return response;
    } catch (error) {
      console.error('Error updating sketch:', error);
      throw error;
    }
  },
};

// Booking API calls
export const bookingAPI = {
  create: (bookingData) => api.post('/bookings', bookingData),
  getAll: () => api.get('/bookings'),
  getById: (id) => api.get(`/bookings/${id}`),
  updateStatus: (id, status) => api.put(`/bookings/${id}/status`, { status }),
};

export default api; 