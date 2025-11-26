# Deploy to Railway (Free) - 5 Minutes!

## Step-by-Step Guide

### 1. Push Code to GitHub (if not already)
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### 2. Sign Up for Railway
1. Go to https://railway.app
2. Click "Start a New Project"
3. Sign up with GitHub (free, no credit card needed)

### 3. Deploy
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your repository
4. Railway will auto-detect Node.js and start deploying!

### 4. Set Environment Variables
1. Click on your project
2. Go to "Variables" tab
3. Add these:
   - `JWT_SECRET` = (generate one: run `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` locally)
   - `NODE_ENV` = `production`

### 5. Get Your Public URL
1. Click "Settings" in your project
2. Under "Domains", Railway gives you a free URL like:
   - `https://your-app-name.up.railway.app`
3. **That's it!** Share this URL with anyone!

### 6. Test It
1. Visit your Railway URL
2. Click "Sign Up" and create an account
3. Play the game
4. Check the Leaderboard - it works!

---

## That's All!

Your game is now live and accessible to anyone with the URL. The leaderboard will work globally, and all scores will be saved.

**No domain setup needed** - the free Railway URL works perfectly!

---

## Tips

- Railway auto-deploys when you push to GitHub
- Free tier: 500 hours/month (plenty for <100 users)
- SQLite database persists automatically
- Check logs in Railway dashboard if issues occur

---

## Need Help?

Check Railway logs:
1. Go to your project dashboard
2. Click "Deployments"
3. View logs for any errors

