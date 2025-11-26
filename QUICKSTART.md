# Quick Start Guide

## Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment:**
   ```bash
   cp .env.example .env
   # Edit .env and set JWT_SECRET to a random string
   ```

3. **Start the server:**
   ```bash
   npm start
   # Or for development with auto-reload:
   npm run dev
   ```

4. **Open in browser:**
   ```
   http://localhost:3000
   ```

## Features Added

✅ **User Authentication**
- Register new accounts
- Login/Logout
- JWT token-based authentication
- Secure password hashing (bcrypt)

✅ **Leaderboard System**
- Save scores automatically when logged in
- View top players
- See your rank
- Track quotes completed and levels

✅ **Database**
- SQLite database (no setup required)
- Automatic table creation
- User and score storage

## Testing Locally

1. Start the server: `npm start`
2. Open `http://localhost:3000`
3. Click "Sign Up" to create an account
4. Play the game - scores will be saved automatically
5. Click "🏆 Leaderboard" to see top scores

## Production Deployment

See `DEPLOYMENT.md` for detailed instructions on:
- Setting up a domain
- Configuring Nginx
- SSL/HTTPS setup
- PM2 process management
- Database backups

