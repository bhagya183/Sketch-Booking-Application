import React, { useState } from 'react';
import { Box, Button, Typography, CircularProgress, Alert } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { uploadFile, getFileUrl } from '../services/fileService';

const FileUpload = ({ onFileSelect, accept = 'image/*', label = 'Upload Image', error }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      setUploadError('No file selected');
      onFileSelect(null);
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file');
      onFileSelect(null);
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File size should be less than 10MB');
      onFileSelect(null);
      return;
    }

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
    setLoading(true);
    setUploadError(null);

    try {
      console.log('Uploading file:', file.name, file.type, file.size);
      const filename = await uploadFile(file);
      console.log('Upload successful, filename:', filename);
      onFileSelect({ filename, url: getFileUrl(filename) });
    } catch (err) {
      console.error('Upload failed:', err);
      setUploadError(err.message || 'Failed to upload file');
      onFileSelect(null);
    } finally {
      setLoading(false);
    }
  };

  const handleButtonClick = () => {
    // Reset states when clicking the upload button
    setSelectedFile(null);
    setPreview(null);
    setUploadError(null);
  };

  return (
    <Box sx={{ width: '100%', textAlign: 'center' }}>
      <input
        accept={accept}
        style={{ display: 'none' }}
        id="file-upload"
        type="file"
        onChange={handleFileSelect}
      />
      <label htmlFor="file-upload">
        <Button
          variant="outlined"
          component="span"
          startIcon={<CloudUploadIcon />}
          disabled={loading}
          onClick={handleButtonClick}
        >
          {label}
        </Button>
      </label>

      {loading && (
        <Box sx={{ mt: 2 }}>
          <CircularProgress size={24} />
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            Uploading...
          </Typography>
        </Box>
      )}

      {(error || uploadError) && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error || uploadError}
        </Alert>
      )}

      {preview && (
        <Box sx={{ mt: 2 }}>
          <img
            src={preview}
            alt="Preview"
            style={{
              maxWidth: '100%',
              maxHeight: '200px',
              objectFit: 'contain',
            }}
          />
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            {selectedFile.name}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default FileUpload; 