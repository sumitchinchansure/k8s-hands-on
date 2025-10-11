const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for frontend
app.use(cors());
app.use(express.json());

// Multilingual surprising facts as fallback (when AI API is not available)
const surpriseFacts = {
  en: [
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
  ],
  ja: [
    "ハチミツは永遠に腐らない！古代エジプトの墓から発見された3,000年以上前のハチミツが、今でも完全に食べられる状態で保存されています。",
    "タコには3つの心臓があり、青い血が流れています！2つの心臓がエラに血を送り、残りの1つが体全体に血を送っています。",
    "バナナはベリーですが、イチゴはベリーではありません！植物学的に言えば、バナナはベリーに分類され、イチゴは集合果です。",
    "フラミンゴの群れは「フランボヤンス」と呼ばれます！これらのピンクの鳥は、エビや藻類を食べることで色を得ています。",
    "ウォンバットのうんちは四角い形をしています！これは転がらないようにして、縄張りをより効果的にマークするためです。",
    "サメは木よりも古い！サメは約4億年前から存在し、木は約3億5千万年前に現れました。",
    "あなたの鼻は50,000種類の匂いを記憶できます！これは私たちが持つ最も強力な記憶のトリガーの一つです。",
    "クレオパトラは、ギザの大ピラミッド建設よりも月面着陸に時代的に近い時期に生きていました！",
    "雲の重さは100万ポンド以上になることがあります！空に浮かんでいるにも関わらず、雲には大量の水滴が含まれています。",
    "イルカはお互いに名前を持っています！独特の口笛音でお互いを識別し、呼び合っています。"
  ]
};

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
    const language = req.query.lang || 'en'; // Default to English
    const supportedLanguages = ['en', 'ja'];

    // Validate language parameter
    const lang = supportedLanguages.includes(language) ? language : 'en';

    let fact;
    let source;

    // Try to get fact from AI API if API key is available
    if (process.env.OPENAI_API_KEY) {
      try {
        console.log(`Attempting to get fact from OpenAI API in ${lang}...`);
        const languagePrompt = lang === 'ja'
          ? 'Tell me a surprising and interesting fact in Japanese in 2-3 lines. Make it family-friendly, educational, and amazing. Don\'t repeat common facts. Please respond in Japanese.'
          : 'Tell me a surprising and interesting fact in 2-3 lines. Make it family-friendly, educational, and amazing. Don\'t repeat common facts.';

        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
          model: 'gpt-3.5-turbo',
          messages: [{
            role: 'user',
            content: languagePrompt
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
        console.log(`✅ Got fact from OpenAI API in ${lang}`);
      } catch (apiError) {
        console.log(`⚠️ OpenAI API failed, falling back to local facts in ${lang}:`, apiError.message);
        // Fall back to local facts
        const facts = surpriseFacts[lang];
        const randomIndex = Math.floor(Math.random() * facts.length);
        fact = facts[randomIndex];
        source = 'local_fallback';
      }
    } else {
      console.log(`📚 No OpenAI API key found, using local facts in ${lang}`);
      // Use local facts
      const facts = surpriseFacts[lang];
      const randomIndex = Math.floor(Math.random() * facts.length);
      fact = facts[randomIndex];
      source = 'local';
    }

    res.json({
      success: true,
      fact: fact,
      language: lang,
      source: source,
      timestamp: new Date().toISOString()
    });

    console.log(`Served surprise fact (${source}, ${lang}): ${fact.substring(0, 50)}...`);
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
  console.log(`📚 Loaded ${surpriseFacts.en.length} English facts, ${surpriseFacts.ja.length} Japanese facts`);

  if (process.env.OPENAI_API_KEY) {
    console.log(`🤖 OpenAI API integration: ENABLED`);
  } else {
    console.log(`🤖 OpenAI API integration: DISABLED (no API key)`);
    console.log(`💡 Set OPENAI_API_KEY environment variable to enable AI facts`);
  }
});