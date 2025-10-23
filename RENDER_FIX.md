# CRITICAL: Render Dashboard Configuration

## ⚠️ IMPORTANT: Update These Settings in Render Dashboard

Your deployment is failing because Render is running the **WRONG START COMMAND**.

### Go to Render Dashboard → Your Service → Settings

### 1. Start Command (MOST IMPORTANT!)
**Current (Wrong):** `npm run dev`  
**Change to:** `npm start`

This is the most critical fix! The start command MUST be `npm start`, not `npm run dev`.

### 2. Build Command
Should be: `npm run build`

### 3. Environment Variables
Add/update these in the "Environment" section:

```
NODE_ENV = production
MONGODB_URI = (your MongoDB connection string)
JWT_SECRET = (your JWT secret key)
```

**Note:** PORT is automatically set by Render, you don't need to set it manually.

### 4. Root Directory
Should be: `.` (root of repository)

---

## Why This Matters

- `npm run dev` → Runs BOTH frontend dev server AND backend (for local development)
- `npm start` → Runs ONLY backend in production mode, serving the built frontend

In production:
- Frontend is built into static files during build phase
- Backend serves these static files
- Only ONE server needs to run (backend on port 10000)
- Backend binds to `0.0.0.0` so Render can route traffic to it

---

## Quick Checklist

- [ ] Set Start Command to `npm start` (not `npm run dev`)
- [ ] Set Build Command to `npm run build`  
- [ ] Add `NODE_ENV=production` environment variable
- [ ] Add `MONGODB_URI` environment variable
- [ ] Add `JWT_SECRET` environment variable
- [ ] Click "Save Changes"
- [ ] Trigger a new deployment (or it will auto-deploy)

---

## After Fixing

Once you update the start command and redeploy, the logs should show:

```
==> Running 'npm start'
> cd Backend && npm start
> node server.js
🚀 Server running in production mode on port 10000
📡 Listening on 0.0.0.0:10000
✅ MongoDB Connected
==> Your service is live 🎉
```

NOT:
```
==> Running 'npm run dev'  ❌ WRONG!
> concurrently "npm run server" "npm run client"  ❌ WRONG!
```
