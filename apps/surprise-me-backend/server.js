const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for frontend
app.use(cors());
app.use(express.json());

// Array of surprising facts as fallback (when AI API is not available)
const surpriseFacts = [
  "Honey never spoils! Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old and still perfectly edible.",
  "Octopuses have three hearts and blue blood! Two hearts pump blood to their gills, while the third pumps blood to the rest of their body.",
  "Bananas are berries, but strawberries aren't! Botanically speaking, bananas qualify as berries while strawberries are aggregate fruits.",
  "A group of flamingos is called a 'flamboyance'! These pink birds also get their color from eating shrimp and algae.",
  "Wombat poop is cube-shaped! This helps prevent it from rolling away and marks their territory more effectively.",
  "Sharks are older than trees! Sharks have been around for about 400 million years, while trees appeared around 350 million years ago.",
  "Your nose can remember 50,000 different scents! It's one of the most powerful memory triggers we have.",
  "Cleopatra lived closer in time to the Moon landing than to the construction of the Great Pyramid of Giza!",
  "A cloud can weigh more than a million pounds! Despite floating in the air, clouds contain massive amounts of water droplets.",
  "Dolphins have names for each other! They use unique whistle signatures to identify and call each other."
];

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'surprise-me-backend' });
});

// Ready check endpoint
app.get('/ready', (req, res) => {
  res.json({ status: 'ready', service: 'surprise-me-backend' });
});

// Get a surprising fact
app.get('/api/surprise', async (req, res) => {
  try {
    let fact;
    let source;

    // Try to get fact from AI API if API key is available
    if (process.env.OPENAI_API_KEY) {
      try {
        console.log('Attempting to get fact from OpenAI API...');
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
          model: 'gpt-3.5-turbo',
          messages: [{
            role: 'user',
            content: 'Tell me a surprising and interesting fact in 2-3 lines. Make it family-friendly, educational, and amazing. Don\'t repeat common facts.'
          }],
          max_tokens: 150,
          temperature: 0.8
        }, {
          headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          },
          timeout: 10000
        });

        fact = response.data.choices[0].message.content.trim();
        source = 'openai';
        console.log('✅ Got fact from OpenAI API');
      } catch (apiError) {
        console.log('⚠️ OpenAI API failed, falling back to local facts:', apiError.message);
        // Fall back to local facts
        const randomIndex = Math.floor(Math.random() * surpriseFacts.length);
        fact = surpriseFacts[randomIndex];
        source = 'local_fallback';
      }
    } else {
      console.log('📚 No OpenAI API key found, using local facts');
      // Use local facts
      const randomIndex = Math.floor(Math.random() * surpriseFacts.length);
      fact = surpriseFacts[randomIndex];
      source = 'local';
    }

    res.json({
      success: true,
      fact: fact,
      source: source,
      timestamp: new Date().toISOString()
    });

    console.log(`Served surprise fact (${source}): ${fact.substring(0, 50)}...`);
  } catch (error) {
    console.error('Error getting surprise fact:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get surprise fact',
      error: error.message
    });
  }
});

// Add a status endpoint to show AI integration status
app.get('/api/status', (req, res) => {
  res.json({
    service: 'surprise-me-backend',
    aiEnabled: !!process.env.OPENAI_API_KEY,
    factsCount: surpriseFacts.length,
    version: '1.0.0'
  });
});

app.listen(PORT, () => {
  console.log(`🎉 Surprise Me Backend running on port ${PORT}`);
  console.log(`📚 Loaded ${surpriseFacts.length} local surprise facts`);

  if (process.env.OPENAI_API_KEY) {
    console.log(`🤖 OpenAI API integration: ENABLED`);
  } else {
    console.log(`🤖 OpenAI API integration: DISABLED (no API key)`);
    console.log(`💡 Set OPENAI_API_KEY environment variable to enable AI facts`);
  }
});