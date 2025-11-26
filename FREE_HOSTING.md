# Free Hosting Guide - Railway / Render

This guide will help you deploy to free hosting platforms. No domain needed - you'll get a free URL!

## Option 1: Railway (Recommended - Easiest)

### Step 1: Create Railway Account
1. Go to https://railway.app
2. Sign up with GitHub (free)

### Step 2: Deploy
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Connect your repository
4. Railway will auto-detect Node.js and deploy

### Step 3: Set Environment Variables
In Railway dashboard:
1. Go to your project → Variables
2. Add:
   - `PORT` = `3000` (Railway sets this automatically, but add it)
   - `JWT_SECRET` = (generate a random string)
   - `NODE_ENV` = `production`

Generate JWT_SECRET:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 4: Get Your URL
1. Railway will give you a URL like: `https://your-app-name.up.railway.app`
2. Share this URL - anyone can play!

### Step 5: Update Frontend API URL (if needed)
The code already uses `window.location.origin`, so it should work automatically!

---

## Option 2: Render (Alternative)

### Step 1: Create Render Account
1. Go to https://render.com
2. Sign up (free)

### Step 2: Deploy
1. Click "New +" → "Web Service"
2. Connect your GitHub repo
3. Settings:
   - **Name**: sadhguru-quotes
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

### Step 3: Environment Variables
Add in Render dashboard:
- `PORT` = `10000` (Render uses 10000)
- `JWT_SECRET` = (your random string)
- `NODE_ENV` = `production`

### Step 4: Update server.js for Render
Render uses port 10000, but our code should auto-detect. If issues, update:

```javascript
const PORT = process.env.PORT || 10000;
```

### Step 5: Get Your URL
Render gives you: `https://your-app-name.onrender.com`

---

## Option 3: Fly.io (Free Tier)

### Step 1: Install Fly CLI
```bash
curl -L https://fly.io/install.sh | sh
```

### Step 2: Login
```bash
fly auth login
```

### Step 3: Create App
```bash
fly launch
```

### Step 4: Deploy
```bash
fly deploy
```

### Step 5: Get URL
```bash
fly open
```

---

## Quick Deploy Script

Create a `railway.json` for Railway:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

---

## Testing After Deployment

1. Visit your free URL (e.g., `https://your-app.up.railway.app`)
2. Click "Sign Up" - create a test account
3. Play the game
4. Check "Leaderboard" - your score should appear
5. Share the URL with others!

---

## Important Notes

- **Free tiers have limitations:**
  - Railway: 500 hours/month free (plenty for <100 users)
  - Render: Spins down after 15 min inactivity (first request may be slow)
  - Fly.io: 3 shared VMs free

- **Database:**
  - SQLite file persists on Railway/Render
  - For production, consider upgrading to PostgreSQL later

- **No Domain Needed:**
  - The free URL works perfectly
  - You can add a custom domain later if needed

---

## Troubleshooting

**App won't start:**
- Check logs in Railway/Render dashboard
- Verify environment variables are set
- Ensure `package.json` has correct start script

**Database errors:**
- SQLite should work, but if issues occur, check file permissions
- Railway/Render handle this automatically

**CORS issues:**
- Already handled in `server.js` with CORS middleware

---

## Recommended: Railway

For your use case (<100 users), **Railway is the best choice**:
- ✅ Easiest setup
- ✅ No credit card needed
- ✅ Persistent storage (SQLite works)
- ✅ Auto-deploys from GitHub
- ✅ Free tier is generous

Just push your code to GitHub and connect it to Railway!

