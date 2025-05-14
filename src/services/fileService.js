import axios from 'axios';

const API_URL = 'http://localhost:8080/api/files';

export const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await axios.post(`${API_URL}/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data || 'Error uploading file');
    }
};

export const getFileUrl = (filename) => {
    return `${API_URL}/${filename}`;
}; 