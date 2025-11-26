# 🚀 Quick Deploy Guide

## For Free Hosting (No Domain Needed)

**Recommended: Railway** (Easiest, 5 minutes)

1. **Push code to GitHub**
2. **Go to https://railway.app** → Sign up with GitHub
3. **Click "New Project"** → "Deploy from GitHub repo"
4. **Add environment variable:**
   - `JWT_SECRET` = (generate random string)
5. **Get your free URL** (e.g., `https://your-app.up.railway.app`)
6. **Done!** Share the URL - anyone can play!

See `DEPLOY_RAILWAY.md` for detailed steps.

---

## Alternative Free Options

- **Render**: https://render.com (see `FREE_HOSTING.md`)
- **Fly.io**: https://fly.io (see `FREE_HOSTING.md`)

---

## Local Testing First

Before deploying, test locally:

```bash
npm install
cp .env.example .env
# Edit .env and set JWT_SECRET
npm start
# Open http://localhost:3000
```

---

## What Works After Deployment

✅ Game playable by anyone with the URL
✅ User registration and login
✅ Leaderboard (global, all users)
✅ Score saving
✅ No domain needed - free URL works!

---

**For detailed instructions, see:**
- `DEPLOY_RAILWAY.md` - Railway deployment (recommended)
- `FREE_HOSTING.md` - Other free hosting options

