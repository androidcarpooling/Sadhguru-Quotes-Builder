# Database & Server Architecture

## Current Setup

### Server
- **Technology**: Node.js/Express
- **Hosting**: Railway (Cloud Platform)
- **Status**: ✅ Your computer can be closed - server runs in the cloud

### Database
- **Technology**: SQLite (file-based database)
- **File**: `game.db`
- **Location**: On Railway's server (not your computer)
- **Issue**: ⚠️ On Railway's free tier, the database file might be **ephemeral** (could be lost on redeploy)

## What Happens When You Close Your Computer?

✅ **Server continues running** - Railway hosts it in the cloud
✅ **Website stays online** - Users can still access it
⚠️ **Database data** - May be lost if Railway redeploys (on free tier)

## Current Database Storage

The SQLite database (`game.db`) stores:
- User accounts (if using authentication)
- Leaderboard scores
- Player game history

## Recommendations

### Option 1: Use Railway Persistent Volume (Recommended)
Add a persistent volume to keep the database file safe:

1. In Railway dashboard:
   - Go to your project
   - Click "New" → "Volume"
   - Mount it to `/data` or `/app/data`
   - Set `DATABASE_PATH=/data/game.db` in environment variables

### Option 2: Use Railway PostgreSQL (Better for Production)
Railway offers free PostgreSQL database:

1. In Railway dashboard:
   - Click "New" → "Database" → "Add PostgreSQL"
   - Railway will provide connection string
   - Update `server.js` to use PostgreSQL instead of SQLite

### Option 3: Use External Database Service (Most Reliable)
- **Supabase** (Free tier available)
- **PlanetScale** (Free tier available)
- **Neon** (Free tier available)

## Quick Check: Is Your Database Persistent?

Check your Railway dashboard:
1. Go to your project
2. Check if you have a "Volume" attached
3. If no volume → Database might be lost on redeploy
4. If volume exists → Database is safe ✅

## Backup Strategy

Even with persistent storage, it's good to backup:

1. **Manual Backup**: Download `game.db` periodically from Railway
2. **Automated Backup**: Set up a cron job to backup database daily
3. **Export Data**: Create an endpoint to export leaderboard data as JSON

## Summary

- ✅ **Server**: Runs on Railway cloud (independent of your computer)
- ⚠️ **Database**: May need persistent volume to prevent data loss
- 💡 **Recommendation**: Add a Railway volume or migrate to PostgreSQL

