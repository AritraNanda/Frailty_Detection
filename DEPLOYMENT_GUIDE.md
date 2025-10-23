# Deployment Guide for Render

## Quick Setup

### 1. Environment Variables (Set in Render Dashboard)

Go to your service settings and add these environment variables:

```
NODE_ENV=production
PORT=10000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

### 2. Build & Start Commands

- **Build Command**: `npm run build`
- **Start Command**: `npm start`

### 3. Deploy

After setting up the environment variables and commands, simply push to your repository:

```bash
git add -A
git commit -m "Configure for production deployment"
git push origin main
```

Render will automatically:
1. Run `npm run build` which:
   - Installs root dependencies
   - Installs backend dependencies
   - Installs frontend dependencies
   - Builds the React app for production

2. Run `npm start` which:
   - Starts the backend server in production mode
   - Serves the built React app from the backend
   - All requests go through the same server (no CORS issues)

## Local Development

To run locally with both frontend and backend:

```bash
npm run dev
```

This will start:
- Backend on port 5001
- Frontend on port 3000

## Architecture

### Production
- Single server on port 10000 (or Render's assigned port)
- Backend serves API at `/api/*`
- Backend serves static React build for all other routes
- Frontend uses relative path `/api` for API calls

### Development
- Backend runs on port 5001
- Frontend runs on port 3000
- Frontend uses `http://localhost:5001/api` for API calls
- CORS enabled for localhost:3000

## Testing Production Build Locally

To test the production build on your local machine:

```bash
# Build the frontend
cd frontend
npm run build
cd ..

# Set NODE_ENV and run backend
cd Backend
NODE_ENV=production npm start
```

Then visit `http://localhost:5000` to see the production version.

## Troubleshooting

### Issue: "Something is already running on port X"
- **Cause**: Trying to run dev command on Render
- **Fix**: Ensure `npm start` is used in production, not `npm run dev`

### Issue: API calls failing with 404
- **Cause**: Frontend trying to call wrong API URL
- **Fix**: Ensure `.env.production` has `REACT_APP_API_URL=/api`

### Issue: White screen after deployment
- **Cause**: Frontend build not found or not served correctly
- **Fix**: Ensure `npm run build` completed successfully and check logs

### Issue: MongoDB connection failed
- **Cause**: MONGODB_URI not set or incorrect
- **Fix**: Set correct MONGODB_URI in Render environment variables
