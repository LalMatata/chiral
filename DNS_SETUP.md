# DNS Configuration for dami.homes

## Vercel Domain Setup

### Step 1: Add Domain in Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your **chiral** project
3. Navigate to **Settings** → **Domains**
4. Click **Add Domain**
5. Enter `dami.homes`
6. Select which deployment to assign:
   - For branch preview: Select `claude-code1` branch
   - For production: Select `Production`

### Step 2: Configure DNS Records

Depending on your DNS provider, add one of the following:

#### Option A: Using A Records (Recommended)
Add this A record to your DNS:
```
Type: A
Name: @ (or leave blank for root domain)
Value: 76.76.21.21
TTL: 300
```

#### Option B: Using CNAME (for subdomains)
If using www.dami.homes:
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 300
```

#### Option C: Using Vercel's Nameservers (Full DNS Management)
Change your domain's nameservers to:
```
ns1.vercel-dns.com
ns2.vercel-dns.com
```

### Step 3: Branch-Specific Configuration

To assign dami.homes specifically to claude-code1 branch:

1. In Vercel Dashboard → Settings → Domains
2. Click on `dami.homes` after adding
3. Select **Git Branch** → `claude-code1`
4. Save changes

### Step 4: SSL Certificate

Vercel automatically provisions SSL certificates. This process may take up to 24 hours.

## Common DNS Providers Setup

### Cloudflare
1. Log into Cloudflare
2. Select your domain
3. Go to DNS settings
4. Add A record pointing to `76.76.21.21`
5. **Important**: Set Proxy status to **DNS only** (grey cloud)

### GoDaddy
1. Log into GoDaddy Domain Manager
2. Select dami.homes
3. Click **Manage DNS**
4. Add A record with value `76.76.21.21`

### Namecheap
1. Log into Namecheap
2. Go to Domain List → Manage
3. Advanced DNS tab
4. Add A record with value `76.76.21.21`

### Google Domains
1. Log into Google Domains
2. Select dami.homes
3. Go to DNS → Custom records
4. Add A record with value `76.76.21.21`

## Verification

After DNS propagation (5-30 minutes typically):

1. Visit https://dami.homes
2. Check SSL certificate is active
3. Verify it shows your claude-code1 branch deployment

## Troubleshooting

### Domain Not Working
- Check DNS propagation: https://dnschecker.org
- Verify A record is correctly set
- Ensure no conflicting CNAME records exist

### SSL Certificate Issues
- Wait up to 24 hours for automatic provisioning
- Check domain is correctly configured in Vercel
- Ensure DNS is properly pointing to Vercel

### Wrong Branch Deployed
- In Vercel Dashboard → Settings → Git
- Verify branch configuration
- Check deployment settings for dami.homes

## Support

- Vercel Support: https://vercel.com/support
- DNS Propagation Check: https://dnschecker.org
- SSL Certificate Check: https://www.sslshopper.com/ssl-checker.html