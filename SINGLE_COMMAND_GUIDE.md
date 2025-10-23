# 🚨 RENDER DASHBOARD CONFIGURATION - STEP BY STEP

## Current Problem
Your logs show: `==> Running 'npm run dev'`  
This is **WRONG** ❌

It should show: `==> Running 'npm start'`  
This is **CORRECT** ✅

---

## How to Fix (5 Minutes)

### Step 1: Open Render Dashboard
Go to: https://dashboard.render.com/

### Step 2: Find Your Service
Click on: **frailty-detection** (your service name)

### Step 3: Go to Settings
Look at the left sidebar or tabs at the top
Click: **Settings**

### Step 4: Find "Build & Deploy" Section
Scroll down until you see a section called **"Build & Deploy"**

You will see two important fields:

#### Field 1: Build Command
Current: `npm run build` ✅ (This is correct, leave it)

#### Field 2: Start Command
Current: **`npm run dev`** ❌ THIS IS THE PROBLEM!

**CHANGE IT TO:** `npm start`

### Step 5: Find "Environment Variables" Section
Scroll down to **"Environment"** or **"Environment Variables"**

Click **"Add Environment Variable"** and add these THREE variables:

```
Key: NODE_ENV
Value: production
```

```
Key: MONGODB_URI  
Value: mongodb+srv://shantanunandaegra:UzerNhmrvkRW0Ejf@cluster0.lre3gsj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
```

```
Key: JWT_SECRET
Value: n3rf3fdbxnow78b8b2dhv3u7v
```

**DO NOT ADD PORT** - Render sets this automatically!

### Step 6: Save Changes
Scroll to the bottom and click **"Save Changes"**

### Step 7: Wait for Deployment
Render will automatically redeploy your service.

Watch the logs. You should see:
```
==> Running 'npm start'
> cd Backend && npm start
> node server.js
🚀 Server running in production mode on port 10000
📡 Listening on 0.0.0.0:10000
```

---

## What Each Command Does

### `npm run dev` (WRONG for production)
- Runs TWO processes: backend + frontend dev server
- Uses development ports (5001, 3000)  
- Doesn't work on Render because:
  - Frontend dev server can't run on Render
  - Wrong ports
  - Not optimized for production

### `npm start` (CORRECT for production)
- Runs ONE process: backend only
- Backend serves the built React app
- Uses Render's assigned port (usually 10000)
- Production optimized
- Everything on one server = no CORS issues

---

## Expected Logs After Fix

### BEFORE (Current - Wrong):
```
==> Running 'npm run dev'
[0] > cd Backend && npm run dev
[1] > cd frontend && npm start
[0] Server running in development mode on port 5001
[1] Something is already running on port 5001
```

### AFTER (Correct):
```
==> Running 'npm start'
> my-react-app@0.0.0 start
> cd Backend && npm start
> frailty-detection-backend@1.0.0 start
> node server.js
🚀 Server running in production mode on port 10000
📡 Listening on 0.0.0.0:10000
✅ MongoDB Connected
==> Your service is live 🎉
```

---

## Quick Checklist

- [ ] Logged into Render Dashboard
- [ ] Opened frailty-detection service
- [ ] Clicked Settings
- [ ] Changed Start Command from `npm run dev` to `npm start`
- [ ] Added NODE_ENV=production
- [ ] Added MONGODB_URI
- [ ] Added JWT_SECRET
- [ ] Clicked Save Changes
- [ ] Watched logs for successful deployment

---

## After It Works

Visit: https://frailty-detection.onrender.com

You should see your **React login page**, NOT the JSON API response!

🎉 **Your full-stack app will be live!**
