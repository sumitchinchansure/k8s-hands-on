# Personal Setup Guide: GitHub + CircleCI + Docker Hub

This guide walks you through setting up CI/CD with your personal accounts.

## 🔧 Prerequisites Setup

### 1. GitHub Account Setup
- Go to https://github.com
- Sign up or login to your personal account
- We'll create the repository in the next steps

### 2. Docker Hub Account Setup
- Go to https://hub.docker.com
- Sign up or login to your personal account
- **Create a new repository:**
  - Click "Create Repository"
  - Repository Name: `k8s-sample-app`
  - Description: `Sample Node.js app for Kubernetes learning`
  - Visibility: Public (recommended for learning)
  - Click "Create"

### 3. CircleCI Account Setup
- Go to https://circleci.com
- Click "Sign Up"
- **Important:** Choose "Sign up with GitHub"
- This automatically connects your GitHub account
- Complete the signup process

## 🚀 Step-by-Step Integration

### Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Fill in repository details:
   - Repository name: `k8s-hands-on` (or your preferred name)
   - Description: `Kubernetes hands-on learning with sample app`
   - Public repository (recommended)
   - **Don't** initialize with README (we have our files already)
3. Click "Create repository"
4. **Copy the repository URL** (you'll need this)

### Step 2: Connect Local Repository to GitHub

Run these commands in your project directory:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Make initial commit
git commit -m "Initial commit: Node.js app with Redis and CircleCI setup"

# Add your GitHub repository as remote (replace with your URL)
git remote add origin https://github.com/YOUR_USERNAME/k8s-hands-on.git

# Push to GitHub
git branch -M main  # Use 'main' as default branch
git push -u origin main
```

### Step 3: Set up CircleCI Project

1. Go to https://circleci.com/dashboard
2. You should see your GitHub repositories listed
3. Find your `k8s-hands-on` repository
4. Click "Set Up Project"
5. CircleCI will detect the `.circleci/config.yml` file
6. Click "Use Existing Config"
7. Click "Start Building"

### Step 4: Configure Docker Hub Credentials

1. In CircleCI dashboard, go to your project
2. Click "Project Settings" (gear icon)
3. In the left sidebar, click "Environment Variables"
4. Add these variables:
   - **DOCKERHUB_USERNAME**: Your Docker Hub username
   - **DOCKERHUB_PASSWORD**: Your Docker Hub access token (see below)

**Creating Docker Hub Access Token:**
1. Go to https://hub.docker.com/settings/security
2. Click "New Access Token"
3. Token Name: `circleci-k8s-app`
4. Access permissions: Read, Write, Delete
5. Click "Generate"
6. **Copy the token immediately** (you won't see it again)
7. Use this token as DOCKERHUB_PASSWORD in CircleCI

## 🔍 How It Works

### GitHub Repository Connection
- CircleCI automatically detects your repository through GitHub OAuth
- No need to specify repository details in the config file
- Builds trigger automatically on commits

### Branch Strategy
- **Any branch**: Runs build and test
- **main/master branch**: Runs build, test, AND pushes to Docker Hub
- **Git tags (v*)**: Builds with version tags

### Docker Image Naming
Your images will be pushed as:
- `YOUR_DOCKERHUB_USERNAME/k8s-sample-app:main-abc1234` (branch-sha)
- `YOUR_DOCKERHUB_USERNAME/k8s-sample-app:latest`

## 🧪 Testing Your Setup

### Test 1: Feature Branch
```bash
# Create and switch to feature branch
git checkout -b feature/test-ci

# Make a small change
echo "# Test change" >> README.md

# Commit and push
git add .
git commit -m "Test CI build"
git push -u origin feature/test-ci
```
**Expected result:** Build runs but NO Docker push

### Test 2: Main Branch
```bash
# Switch back to main
git checkout main

# Merge feature branch
git merge feature/test-ci

# Push to main
git push origin main
```
**Expected result:** Build runs AND pushes to Docker Hub

### Test 3: Version Tag
```bash
# Create version tag
git tag v1.0.0
git push origin v1.0.0
```
**Expected result:** Build with version tag `v1.0.0`

## 📋 Verification Checklist

- [ ] GitHub repository created and code pushed
- [ ] CircleCI project connected to GitHub repo
- [ ] Docker Hub repository created
- [ ] CircleCI environment variables set (DOCKERHUB_USERNAME, DOCKERHUB_PASSWORD)
- [ ] First build triggered and successful
- [ ] Docker image appears in Docker Hub

## 🔗 Quick Links

- **Your GitHub Repo**: https://github.com/YOUR_USERNAME/k8s-hands-on
- **Your CircleCI Project**: https://circleci.com/gh/YOUR_USERNAME/k8s-hands-on
- **Your Docker Hub Repo**: https://hub.docker.com/r/YOUR_USERNAME/k8s-sample-app

## 🚨 Common Issues

1. **Build fails immediately**: Check if CircleCI can access your repo
2. **Docker push fails**: Verify DOCKERHUB_USERNAME and DOCKERHUB_PASSWORD
3. **No builds trigger**: Ensure repository is properly connected in CircleCI
4. **Permission denied**: Make sure you used an access token, not your Docker Hub password

Need help? Check the build logs in CircleCI dashboard for detailed error messages!