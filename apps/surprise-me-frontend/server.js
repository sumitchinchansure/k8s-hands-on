const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const BACKEND_URL = process.env.BACKEND_URL || 'http://surprise-me-backend:3001';

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'surprise-me-frontend' });
});

// Ready check endpoint
app.get('/ready', (req, res) => {
  res.json({ status: 'ready', service: 'surprise-me-frontend' });
});

// API endpoint to get surprise from backend
app.get('/api/surprise', async (req, res) => {
  try {
    console.log(`Calling backend at: ${BACKEND_URL}/api/surprise`);
    const response = await axios.get(`${BACKEND_URL}/api/surprise`, {
      timeout: 5000
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error calling backend:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to get surprise from backend',
      error: error.message
    });
  }
});

// Serve main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🌟 Surprise Me Frontend running on port ${PORT}`);
  console.log(`🔗 Backend URL: ${BACKEND_URL}`);
});