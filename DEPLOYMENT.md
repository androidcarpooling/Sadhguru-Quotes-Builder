# Deployment Guide - Sadhguru Quotes Builder

This guide will help you deploy the game to a domain with authentication and leaderboard functionality.

## Prerequisites

- Node.js (v14 or higher)
- A domain name
- A VPS/Cloud server (DigitalOcean, AWS, Linode, etc.) or hosting service
- Basic knowledge of Linux commands

## Step 1: Install Dependencies

On your server, install Node.js and npm:

```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Or use nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
```

## Step 2: Upload Files

Upload all project files to your server:

```bash
# Using SCP
scp -r * user@your-server-ip:/var/www/sadhguru-quotes

# Or use Git
git clone your-repo-url /var/www/sadhguru-quotes
```

## Step 3: Install Project Dependencies

```bash
cd /var/www/sadhguru-quotes
npm install
```

## Step 4: Configure Environment

Create a `.env` file:

```bash
cp .env.example .env
nano .env
```

Set these values:
```
PORT=3000
JWT_SECRET=your-super-secret-random-string-here-change-this
NODE_ENV=production
```

Generate a secure JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Step 5: Set Up Process Manager (PM2)

Install PM2 to keep the server running:

```bash
npm install -g pm2
pm2 start server.js --name sadhguru-quotes
pm2 save
pm2 startup
```

## Step 6: Configure Nginx (Reverse Proxy)

Install Nginx:

```bash
sudo apt-get update
sudo apt-get install nginx
```

Create Nginx configuration:

```bash
sudo nano /etc/nginx/sites-available/sadhguru-quotes
```

Add this configuration:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/sadhguru-quotes /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Step 7: Set Up SSL with Let's Encrypt

Install Certbot:

```bash
sudo apt-get install certbot python3-certbot-nginx
```

Get SSL certificate:

```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Follow the prompts. Certbot will automatically configure Nginx for HTTPS.

## Step 8: Configure Firewall

```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

## Step 9: Domain DNS Configuration

In your domain registrar's DNS settings, add:

- **A Record**: `@` → Your server IP address
- **A Record**: `www` → Your server IP address

Wait for DNS propagation (can take up to 48 hours, usually much faster).

## Step 10: Test Deployment

1. Visit `http://yourdomain.com` - should redirect to HTTPS
2. Test registration and login
3. Play a game and check if scores are saved
4. Check leaderboard functionality

## Maintenance Commands

```bash
# View logs
pm2 logs sadhguru-quotes

# Restart server
pm2 restart sadhguru-quotes

# Stop server
pm2 stop sadhguru-quotes

# View status
pm2 status
```

## Database Backup

Backup the SQLite database:

```bash
# Create backup
cp game.db game.db.backup

# Or use cron for automatic backups
0 2 * * * cp /var/www/sadhguru-quotes/game.db /var/www/sadhguru-quotes/backups/game-$(date +\%Y\%m\%d).db
```

## Alternative: Deploy to Cloud Platforms

### Heroku

```bash
heroku create your-app-name
heroku config:set JWT_SECRET=your-secret
git push heroku main
```

### Railway

1. Connect your GitHub repo
2. Set environment variables
3. Deploy automatically

### Vercel/Netlify

For static frontend only (requires separate backend API):
- Deploy frontend to Vercel/Netlify
- Deploy backend to Railway/Heroku
- Update `API_BASE_URL` in `auth.js`

## Troubleshooting

- **Port already in use**: Change PORT in `.env` or kill process using port 3000
- **Database errors**: Check file permissions on `game.db`
- **CORS issues**: Ensure CORS is enabled in `server.js`
- **SSL issues**: Check Certbot logs: `sudo certbot certificates`

## Security Checklist

- [ ] Changed JWT_SECRET to a strong random string
- [ ] Set NODE_ENV=production
- [ ] SSL/HTTPS enabled
- [ ] Firewall configured
- [ ] Database file permissions set correctly
- [ ] Regular backups scheduled
- [ ] PM2 auto-restart enabled

## Support

For issues, check:
- PM2 logs: `pm2 logs`
- Nginx logs: `sudo tail -f /var/log/nginx/error.log`
- Application logs in console

