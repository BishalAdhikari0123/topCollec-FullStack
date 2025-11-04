# Quick Start Guide - TopCollec

Get up and running in 5 minutes! ⚡

## 1. Install Dependencies

```bash
cd topcollec-app
npm install
```

This will take 2-3 minutes.

## 2. Set Up Supabase

### Create Project
1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Choose a name and password
4. Wait 2 minutes for setup

### Run Schema
1. Open Supabase Dashboard
2. Go to **SQL Editor**
3. Copy all content from `supabase/schema.sql`
4. Paste and click **Run**
5. Wait for "Success" message

### Get Credentials
1. Go to **Settings** → **API**
2. Copy three things:
   - Project URL
   - anon public key
   - service_role key (click "Reveal")

## 3. Configure Environment

```bash
# Copy example file
cp .env.local.example .env.local

# Edit .env.local and paste your Supabase credentials
```

Your `.env.local` should look like:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=TopCollec
```

## 4. Seed Sample Data

```bash
npm run seed
```

This creates:
- 2 authors
- 6 example posts
- 12 tags

**Login credentials:**
- Email: `author1@topcollec.com`
- Password: `password123`

## 5. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🎉 You're Done!

### What to Try
1. **Browse posts** at homepage
2. **Click a post** to read
3. **Search** for keywords
4. **Sign in** at `/login` with credentials above
5. **Create a post** in `/admin`

### Next Steps
- Read the full [README.md](./README.md)
- Check [DEPLOYMENT.md](./DEPLOYMENT.md) to deploy
- Customize branding in `lib/constants.ts`

### Troubleshooting

**"Cannot find module '@supabase/...'"**
- Run `npm install` again

**"Invalid API key"**
- Check your `.env.local` file
- Make sure keys are correct
- No extra spaces or quotes

**"Table doesn't exist"**
- Run the schema SQL in Supabase again
- Check SQL Editor for errors

**Seed fails**
- Make sure schema was run successfully
- Check Supabase project is active

### Need Help?
- Check [README.md](./README.md) for detailed docs
- Review [CONTRIBUTING.md](./CONTRIBUTING.md)
- Open a GitHub Issue

---

**That's it! Start building your blog.** 🚀
