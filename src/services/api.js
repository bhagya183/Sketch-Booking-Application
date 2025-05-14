import axios from 'axios';

//const API_URL = 'http://localhost:8080';
const API_URL = 'https://sketchappserver-production.up.railway.app/';

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
  login: (credentials) => api.post(`${API_URL}/auth/login`, credentials),
  register: (userData) => api.post(`${API_URL}/auth/register`, userData),
};

// User API calls
export const userAPI = {
  getProfile: () => api.get(`${API_URL}/user-profiles`),
  updatePassword: (passwordData) => api.put(`${API_URL}/user/updatePassword`, passwordData),
};

// Artist API calls
export const artistAPI = {
  getAll: () => api.get(`${API_URL}/artists`),
  getById: (id) => api.get(`${API_URL}/artists/${id}`),
  create: async (artistData, imageFile) => {
    try {
      if (imageFile) {
        const uploadResponse = await uploadFile(imageFile);
        artistData.image_url = uploadResponse.fileDownloadUri;
      }
      return api.post(`${API_URL}/artists`, artistData);
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
      return api.put(`${API_URL}/artists/${id}`, artistData);
    } catch (error) {
      console.error('Error updating artist:', error);
      throw error;
    }
  },
};

// Sketch API calls
export const sketchAPI = {
  getAll: () => api.get(`${API_URL}/sketches`),
  getById: (id) => api.get(`${API_URL}/sketches/${id}`),
  create: async (sketchData, imageFile) => {
    try {
      const response = await api.post(`${API_URL}/sketches`, sketchData);
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
      const response = await api.put(`${API_URL}/sketches/${id}`, sketchData);
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
  create: (bookingData) => api.post(`${API_URL}/bookings`, bookingData),
  getAll: () => api.get(`${API_URL}/bookings`),
  getById: (id) => api.get(`${API_URL}/bookings/${id}`),
  updateStatus: (id, status) => api.put(`${API_URL}/bookings/${id}/status`, { status }),
};

export default api; 