# Installation Commands

Run these commands in PowerShell to get started:

## Step 1: Navigate to Project Directory
```powershell
cd c:\Users\user\Desktop\topCollec\FullstackApp\topcollec-app
```

## Step 2: Install Dependencies
```powershell
npm install
```

This will install all required packages including:
- Next.js 15
- React 19
- Supabase client
- Tailwind CSS
- TypeScript
- React Markdown
- And all other dependencies

**Time**: ~2-3 minutes depending on internet speed

## Step 3: Set Up Environment Variables
```powershell
# Copy the example file
Copy-Item .env.local.example .env.local

# Open in editor (use your preferred editor)
notepad .env.local
```

Fill in your Supabase credentials in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=TopCollec
```

## Step 4: Set Up Supabase Database

### Create Supabase Project:
1. Go to https://supabase.com
2. Sign up/Sign in
3. Click "New Project"
4. Fill in details:
   - Name: TopCollec
   - Database Password: (choose a strong password)
   - Region: (choose closest to you)
5. Click "Create new project"
6. Wait ~2 minutes for setup

### Run Database Schema:
1. In Supabase Dashboard, click "SQL Editor" in left sidebar
2. Click "New Query"
3. Open `supabase/schema.sql` in this project
4. Copy ALL content from that file
5. Paste into Supabase SQL Editor
6. Click "Run" or press Ctrl+Enter
7. Wait for "Success" message (takes ~10 seconds)

### Get API Credentials:
1. In Supabase Dashboard, go to Settings (gear icon)
2. Click "API" in left sidebar
3. Under "Project API keys", copy:
   - Project URL (looks like: https://xxxxx.supabase.co)
   - anon public key (starts with eyJhbGc...)
   - service_role key (click "Reveal" first, then copy)
4. Paste these into your `.env.local` file

## Step 5: Seed Sample Data (Optional but Recommended)
```powershell
npm run seed
```

This creates:
- 2 test author accounts
- 6 example blog posts
- 12 tags

**Login credentials:**
- Email: `author1@topcollec.com`
- Password: `password123`

## Step 6: Start Development Server
```powershell
npm run dev
```

You should see:
```
  ▲ Next.js 15.0.2
  - Local:        http://localhost:3000
  - Network:      http://192.168.x.x:3000

 ✓ Ready in 2.5s
```

## Step 7: Open in Browser

Open your browser and go to:
**http://localhost:3000**

You should see the TopCollec homepage with sample posts!

## What to Try Next

1. **Browse the site**: Click around, view posts
2. **Search**: Try the search functionality
3. **View tags**: Browse posts by tag
4. **Sign in**: Go to http://localhost:3000/login
   - Email: author1@topcollec.com
   - Password: password123
5. **Admin area**: After signing in, go to http://localhost:3000/admin
6. **Create a post**: Click "Manage Posts" → "New Post"

## Troubleshooting

### If `npm install` fails:
```powershell
# Clear npm cache
npm cache clean --force

# Try again
npm install
```

### If you see TypeScript/ESLint errors:
These are expected before running `npm install`. They'll disappear after installation.

### If the dev server won't start:
```powershell
# Make sure no other process is using port 3000
# Kill any process using port 3000:
netstat -ano | findstr :3000
# Then kill the process (replace PID with the actual process ID):
taskkill /PID <PID> /F

# Try starting again
npm run dev
```

### If database connection fails:
1. Check your `.env.local` file has correct credentials
2. Verify no extra spaces or quotes around values
3. Make sure Supabase project is active (not paused)
4. Try running the schema SQL again

### If seed script fails:
```powershell
# Make sure you ran the schema SQL first
# Check Supabase Dashboard → SQL Editor for any errors
# Try the seed again:
npm run seed
```

## Build for Production

When you're ready to build:
```powershell
npm run build
```

Then start production server:
```powershell
npm start
```

## Deploy to Vercel

```powershell
# Install Vercel CLI globally
npm install -g vercel

# Login
vercel login

# Deploy
vercel
```

Follow the prompts and add your environment variables when asked.

## Useful Commands

```powershell
# Development
npm run dev          # Start dev server

# Production
npm run build        # Build for production
npm start           # Run production build

# Code Quality
npm run lint        # Run ESLint

# Database
npm run seed        # Seed database with sample data

# Deployment
vercel              # Deploy to Vercel
vercel --prod       # Deploy to production
```

## Project Structure

```
topcollec-app/
├── app/              # Next.js pages and routes
├── components/       # React components
├── lib/              # Utilities, actions, Supabase clients
├── scripts/          # Database seeding
├── supabase/         # Database schema
├── public/           # Static assets
├── *.config.*        # Configuration files
└── *.md              # Documentation
```

## Need Help?

1. Read [README.md](./README.md) for detailed documentation
2. Check [QUICKSTART.md](./QUICKSTART.md) for step-by-step setup
3. See [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment guides
4. Review [CONTRIBUTING.md](./CONTRIBUTING.md) for development info

## Success Checklist

- [ ] Dependencies installed (`npm install`)
- [ ] Supabase project created
- [ ] Database schema executed
- [ ] Environment variables configured
- [ ] Seed data loaded
- [ ] Dev server running
- [ ] Can view homepage at localhost:3000
- [ ] Can sign in with test credentials
- [ ] Can access admin area

---

**Once you complete these steps, you'll have a fully functional blog platform running!** 🚀

For questions or issues, check the documentation files or the code comments.

Happy coding! 😊
