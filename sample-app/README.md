# Sample App with Redis Cache

A simple Node.js REST API with Redis caching for Kubernetes learning.

## Features

- **REST API**: User management endpoints
- **Redis Caching**: Automatic caching with TTL
- **Health Checks**: Built-in health monitoring
- **Docker Ready**: Multi-stage Docker build
- **K8s Ready**: Designed for Kubernetes deployment

## API Endpoints

- `GET /health` - Health check
- `GET /api/users` - Get all users (cached)
- `GET /api/users/:id` - Get user by ID (cached)
- `POST /api/users` - Create new user
- `GET /api/cache/stats` - Cache statistics
- `DELETE /api/cache` - Clear cache

## Local Development

```bash
# Install dependencies
npm install

# Start with nodemon
npm run dev
```

## Docker

```bash
# Build and run with Docker Compose
docker-compose up --build

# Test the API
curl http://localhost:3000/health
curl http://localhost:3000/api/users
```

## Environment Variables

- `PORT` - Server port (default: 3000)
- `REDIS_URL` - Redis connection URL (default: redis://localhost:6379)
- `NODE_ENV` - Environment (development/production)

## Cache Behavior

- **Users list**: Cached for 60 seconds
- **Individual user**: Cached for 5 minutes
- **Cache invalidation**: On user creation
- **Fallback**: Works without Redis connection