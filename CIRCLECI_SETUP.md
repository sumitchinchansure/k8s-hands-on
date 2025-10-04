# CircleCI Setup Guide

This guide will help you set up CircleCI to automatically build and push Docker images to Docker Hub.

## Prerequisites

1. **Docker Hub Account**: Create account at https://hub.docker.com
2. **CircleCI Account**: Sign up at https://circleci.com using your GitHub account
3. **GitHub Repository**: Push this project to GitHub

## Setup Steps

### 1. Docker Hub Setup

1. Create a Docker Hub repository:
   - Go to https://hub.docker.com
   - Click "Create Repository"
   - Name it: `k8s-sample-app`
   - Set visibility to Public (or Private if you prefer)

2. Generate Access Token:
   - Go to Account Settings → Security
   - Click "New Access Token"
   - Name: `circleci-token`
   - Copy the generated token (you'll need this)

### 2. CircleCI Project Setup

1. Go to https://circleci.com/dashboard
2. Click "Set Up Project" next to your GitHub repository
3. Choose "Fast: Use existing config in .circleci/config.yml"
4. Click "Set Up Project"

### 3. Environment Variables

In CircleCI project settings, add these environment variables:

#### Option A: Project-level Environment Variables
Go to Project Settings → Environment Variables:

- `DOCKERHUB_USERNAME`: Your Docker Hub username
- `DOCKERHUB_PASSWORD`: Your Docker Hub access token (not password!)

#### Option B: Context (Recommended for multiple projects)
1. Go to Organization Settings → Contexts
2. Create a new context: `docker-hub-creds`
3. Add environment variables:
   - `DOCKERHUB_USERNAME`: Your Docker Hub username
   - `DOCKERHUB_PASSWORD`: Your Docker Hub access token

### 4. Workflow Behavior

The CircleCI configuration includes two workflows:

**Build and Test Job:**
- Runs on every commit
- Installs dependencies
- Runs tests (when available)
- Runs linting (when available)

**Build and Push Job:**
- Only runs on `master` branch pushes
- Builds Docker image
- Tags with `master-<short-sha>` and `latest`
- Pushes to Docker Hub

### 5. Image Tagging Strategy

- **Master branch**: `master-<7-char-sha>` + `latest`
- **Version tags**: `v1.0.0` + `latest` (when you create git tags)
- **Other branches**: Build only, no push

## Testing the Setup

1. Push code to a feature branch → Only build/test runs
2. Push code to master branch → Build, test, and push to Docker Hub
3. Create a git tag (e.g., `v1.0.0`) → Build, test, and push with version tag

## Commands to Get Started

```bash
# Initialize git repository
git init
git add .
git commit -m "Initial commit with CircleCI setup"

# Add your GitHub remote
git remote add origin https://github.com/YOUR_USERNAME/k8s-handon.git

# Push to GitHub
git push -u origin master

# Create a version tag (optional)
git tag v1.0.0
git push origin v1.0.0
```

## Troubleshooting

- **Build fails**: Check the build logs in CircleCI dashboard
- **Docker push fails**: Verify DOCKERHUB_USERNAME and DOCKERHUB_PASSWORD are set correctly
- **No builds triggered**: Ensure your repository is connected to CircleCI

## Security Best Practices

- ✅ Use Docker Hub access tokens instead of passwords
- ✅ Store secrets in CircleCI environment variables
- ✅ Use contexts for shared credentials across projects
- ✅ Enable Docker layer caching for faster builds