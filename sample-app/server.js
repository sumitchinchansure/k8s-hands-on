const express = require('express');
const redis = require('redis');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

app.use(cors());
app.use(express.json());

let redisClient;

async function initRedis() {
  try {
    redisClient = redis.createClient({
      url: REDIS_URL
    });

    redisClient.on('error', (err) => {
      console.error('Redis error:', err);
    });

    redisClient.on('connect', () => {
      console.log('Connected to Redis');
    });

    await redisClient.connect();
  } catch (error) {
    console.error('Failed to connect to Redis:', error);
  }
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    redis: redisClient?.isOpen ? 'connected' : 'disconnected'
  });
});

// Get all users
app.get('/api/users', async (req, res) => {
  try {
    const cacheKey = 'users:all';

    // Try to get from cache first
    if (redisClient?.isOpen) {
      const cachedUsers = await redisClient.get(cacheKey);
      if (cachedUsers) {
        console.log('Serving from cache');
        return res.json({
          data: JSON.parse(cachedUsers),
          source: 'cache'
        });
      }
    }

    // Simulate database query
    const users = [
      { id: 1, name: 'John Doe', email: 'john@example.com' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
      { id: 3, name: 'Bob Johnson', email: 'bob@example.com' }
    ];

    // Cache the result for 60 seconds
    if (redisClient?.isOpen) {
      await redisClient.setEx(cacheKey, 60, JSON.stringify(users));
    }

    console.log('Serving from database');
    res.json({
      data: users,
      source: 'database'
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user by ID
app.get('/api/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const cacheKey = `user:${userId}`;

    // Try cache first
    if (redisClient?.isOpen) {
      const cachedUser = await redisClient.get(cacheKey);
      if (cachedUser) {
        console.log(`Serving user ${userId} from cache`);
        return res.json({
          data: JSON.parse(cachedUser),
          source: 'cache'
        });
      }
    }

    // Simulate database lookup
    const users = {
      '1': { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin' },
      '2': { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user' },
      '3': { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'user' }
    };

    const user = users[userId];
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Cache for 5 minutes
    if (redisClient?.isOpen) {
      await redisClient.setEx(cacheKey, 300, JSON.stringify(user));
    }

    console.log(`Serving user ${userId} from database`);
    res.json({
      data: user,
      source: 'database'
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new user
app.post('/api/users', async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    const newUser = {
      id: Date.now(),
      name,
      email,
      createdAt: new Date().toISOString()
    };

    // Invalidate cache
    if (redisClient?.isOpen) {
      await redisClient.del('users:all');
      console.log('Cache invalidated');
    }

    res.status(201).json({
      data: newUser,
      message: 'User created successfully'
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Cache stats
app.get('/api/cache/stats', async (req, res) => {
  try {
    if (!redisClient?.isOpen) {
      return res.json({ error: 'Redis not connected' });
    }

    const keys = await redisClient.keys('*');
    const stats = {
      connected: redisClient.isOpen,
      totalKeys: keys.length,
      keys: keys
    };

    res.json(stats);
  } catch (error) {
    console.error('Error getting cache stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Clear cache
app.delete('/api/cache', async (req, res) => {
  try {
    if (!redisClient?.isOpen) {
      return res.json({ error: 'Redis not connected' });
    }

    await redisClient.flushAll();
    res.json({ message: 'Cache cleared successfully' });
  } catch (error) {
    console.error('Error clearing cache:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await initRedis();
});