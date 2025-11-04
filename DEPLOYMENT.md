# Deployment Guide for TopCollec

This guide covers deploying TopCollec to various platforms.

## 📋 Pre-Deployment Checklist

- [ ] Supabase project created and schema deployed
- [ ] Environment variables documented
- [ ] Sample data seeded (optional)
- [ ] Code pushed to Git repository
- [ ] Production domain ready (optional)

## 🚀 Deploy to Vercel (Recommended)

Vercel is the creators of Next.js and provides the best experience.

### Method 1: Vercel Dashboard

1. **Push code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo>
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel auto-detects Next.js settings

3. **Add Environment Variables**
   In Vercel dashboard, add:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
   NEXT_PUBLIC_SITE_NAME=TopCollec
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Done! 🎉

### Method 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Follow prompts, add environment variables when asked

# Deploy to production
vercel --prod
```

### Custom Domain on Vercel

1. Go to Project Settings > Domains
2. Add your domain
3. Update DNS records as instructed
4. SSL is automatic!

## 🌐 Deploy to Netlify

1. **Create netlify.toml**
   ```toml
   [build]
     command = "npm run build"
     publish = ".next"

   [[plugins]]
     package = "@netlify/plugin-nextjs"
   ```

2. **Push to GitHub**

3. **Import to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - "New site from Git"
   - Select your repo
   - Build settings auto-detected

4. **Add Environment Variables**
   - Site Settings > Environment Variables
   - Add all variables from `.env.local.example`

5. **Deploy**
   - Netlify builds automatically on push

## 🚂 Deploy to Railway

1. **Push to GitHub**

2. **Import to Railway**
   - Go to [railway.app](https://railway.app)
   - "New Project" > "Deploy from GitHub repo"

3. **Add Environment Variables**
   - Settings > Variables
   - Add all env vars

4. **Deploy**
   - Railway builds and deploys automatically
   - Get your railway.app domain

## 🎨 Deploy to Render

1. **Create render.yaml**
   ```yaml
   services:
     - type: web
       name: topcollec
       env: node
       buildCommand: npm install && npm run build
       startCommand: npm start
       envVars:
         - key: NODE_VERSION
           value: 18
   ```

2. **Push to GitHub**

3. **Import to Render**
   - Go to [render.com](https://render.com)
   - "New" > "Web Service"
   - Connect GitHub repo

4. **Configure**
   - Environment: Node
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`

5. **Add Environment Variables**
   - Add all env vars from `.env.local.example`

6. **Deploy**

## ☁️ Deploy to AWS Amplify

1. **Push to GitHub**

2. **Create Amplify App**
   - AWS Console > Amplify
   - "New App" > "Host web app"
   - Connect GitHub

3. **Build Settings**
   Amplify auto-detects Next.js

4. **Environment Variables**
   - App Settings > Environment Variables
   - Add all variables

5. **Deploy**
   - Save and deploy
   - Get your amplifyapp.com URL

## 🐳 Docker Deployment

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine AS base

# Install dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Build
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

Update `next.config.js`:
```javascript
module.exports = {
  output: 'standalone',
  // ... rest of config
}
```

Build and run:
```bash
docker build -t topcollec .
docker run -p 3000:3000 --env-file .env.local topcollec
```

## 🖥️ Self-Hosted (VPS/Dedicated Server)

### Prerequisites
- Ubuntu 20.04+ or similar
- Node.js 18+
- Nginx (optional, for reverse proxy)
- PM2 (for process management)

### Setup

1. **Install Node.js**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

2. **Clone and Build**
   ```bash
   git clone <your-repo>
   cd topcollec-app
   npm install
   npm run build
   ```

3. **Install PM2**
   ```bash
   sudo npm install -g pm2
   ```

4. **Create ecosystem.config.js**
   ```javascript
   module.exports = {
     apps: [{
       name: 'topcollec',
       script: 'npm',
       args: 'start',
       env: {
         NODE_ENV: 'production',
         PORT: 3000,
       }
     }]
   }
   ```

5. **Start with PM2**
   ```bash
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup
   ```

6. **Setup Nginx (Optional)**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

7. **SSL with Certbot**
   ```bash
   sudo apt-get install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

## 🔒 Security Best Practices

### Environment Variables
- ✅ Never commit `.env.local` to Git
- ✅ Use different Supabase projects for dev/prod
- ✅ Rotate service role keys regularly
- ✅ Use environment variable secrets in CI/CD

### Supabase
- ✅ Enable RLS on all tables
- ✅ Review RLS policies regularly
- ✅ Enable 2FA on Supabase account
- ✅ Set up Supabase rate limiting

### Next.js
- ✅ Keep dependencies updated (`npm audit`)
- ✅ Use Content Security Policy headers
- ✅ Enable security headers in next.config.js

Example security headers:
```javascript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },
}
```

## 📊 Monitoring

### Vercel Analytics
- Built-in for Vercel deployments
- Enable in project settings

### Supabase Monitoring
- Dashboard > Database > Performance
- Monitor query performance
- Check storage usage

### Custom Monitoring
Consider adding:
- [Sentry](https://sentry.io) for error tracking
- [LogRocket](https://logrocket.com) for session replay
- [Plausible](https://plausible.io) for privacy-friendly analytics

## 🔄 CI/CD

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Build
        run: npm run build
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

## 🆘 Troubleshooting

### Build Fails
- Check Node.js version (needs 18+)
- Verify all dependencies installed
- Check for TypeScript errors

### Database Connection Issues
- Verify Supabase URL and keys
- Check RLS policies
- Verify network connectivity

### Images Not Loading
- Check Supabase Storage bucket is public
- Verify CORS settings
- Check image URLs in posts

### 404 Errors
- Run `npm run build` to regenerate pages
- Check dynamic routes syntax
- Verify slug formatting

## 📞 Support

Need help? Check:
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Vercel Support](https://vercel.com/support)

---

Happy deploying! 🚀
