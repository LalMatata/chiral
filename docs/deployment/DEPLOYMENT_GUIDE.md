# CHIRAL Website Deployment Guide

## Server Setup for Your IP Address

### Prerequisites
- Linux server (Ubuntu 20.04+ recommended)
- Root or sudo access
- Domain name pointing to your IP
- SSL certificate (Let's Encrypt recommended)

## Step 1: Server Preparation

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install nginx for reverse proxy
sudo apt install nginx -y

# Install certbot for SSL
sudo apt install certbot python3-certbot-nginx -y
```

## Step 2: Upload Website Files

```bash
# Create application directory
sudo mkdir -p /var/www/chiral
sudo chown $USER:$USER /var/www/chiral

# Upload files (replace with your method)
scp -r /path/to/chiral_repo/* user@your-ip:/var/www/chiral/
# OR use git clone if repo is public
# git clone https://github.com/your-repo/chiral.git /var/www/chiral
```

## Step 3: Install Dependencies

```bash
cd /var/www/chiral

# Install dependencies
npm install

# Build production version
npm run build

# Create environment file
nano .env
```

### Environment Variables (.env file):
```bash
RESEND_API_KEY=your_resend_api_key_here
SALES_EMAIL=sales@chiral-robotics.com
PORT=3001
NODE_ENV=production
```

## Step 4: Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/chiral
```

### Nginx Configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    
    # Serve static files from dist
    location / {
        root /var/www/chiral/dist;
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
    # Proxy API requests to Node.js backend
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Enable Site:
```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/chiral /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Restart nginx
sudo systemctl restart nginx
```

## Step 5: SSL Certificate

```bash
# Get SSL certificate (replace with your domain)
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Verify auto-renewal
sudo certbot renew --dry-run
```

## Step 6: Start Backend Service

### Create systemd service:
```bash
sudo nano /etc/systemd/system/chiral-backend.service
```

### Service Configuration:
```ini
[Unit]
Description=CHIRAL Backend API
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/chiral
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production
EnvironmentFile=/var/www/chiral/.env

# Output to journald
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
```

### Start Service:
```bash
# Reload systemd
sudo systemctl daemon-reload

# Enable and start service
sudo systemctl enable chiral-backend
sudo systemctl start chiral-backend

# Check status
sudo systemctl status chiral-backend

# Check logs
sudo journalctl -u chiral-backend -f
```

## Step 7: Firewall Configuration

```bash
# Enable firewall
sudo ufw enable

# Allow SSH, HTTP, HTTPS
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'

# Check status
sudo ufw status
```

## Step 8: Monitor and Maintain

### Check Services:
```bash
# Check nginx
sudo systemctl status nginx

# Check backend
sudo systemctl status chiral-backend

# Check disk space
df -h

# Check memory usage
free -h
```

### Log Locations:
- Nginx access: `/var/log/nginx/access.log`
- Nginx error: `/var/log/nginx/error.log`
- Backend logs: `sudo journalctl -u chiral-backend`

### Backup Strategy:
```bash
# Daily backup script
#!/bin/bash
tar -czf /backup/chiral-$(date +%Y%m%d).tar.gz \
  /var/www/chiral \
  /etc/nginx/sites-available/chiral \
  /etc/systemd/system/chiral-backend.service

# Keep only last 7 days
find /backup -name "chiral-*.tar.gz" -mtime +7 -delete
```

## Troubleshooting

### Common Issues:

1. **Website not loading**
   ```bash
   sudo nginx -t
   sudo systemctl status nginx
   ```

2. **Forms not working**
   ```bash
   sudo systemctl status chiral-backend
   sudo journalctl -u chiral-backend -n 50
   ```

3. **SSL issues**
   ```bash
   sudo certbot certificates
   sudo systemctl status certbot.timer
   ```

4. **High memory usage**
   ```bash
   pm2 start server.js --name chiral-backend
   pm2 monit
   ```

## Security Checklist

- [ ] SSL certificate installed and auto-renewing
- [ ] Firewall configured (only SSH, HTTP, HTTPS)
- [ ] Regular system updates enabled
- [ ] Nginx security headers configured
- [ ] Environment variables secured (not in git)
- [ ] Regular backups configured
- [ ] Monitoring setup (optional: UptimeRobot, Pingdom)

## Performance Optimization

### Enable Gzip Compression:
```nginx
# Add to nginx.conf
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
```

### Enable HTTP/2:
```nginx
# Modify server block
listen 443 ssl http2;
```

---

**Your CHIRAL website will be live at your domain with:**
- ✅ Professional SSL certificate
- ✅ Lead capture working with email notifications
- ✅ WhatsApp integration
- ✅ Full analytics tracking
- ✅ Production-ready performance

**Need the IP address?** Just provide it and I'll help update any domain-specific configurations!