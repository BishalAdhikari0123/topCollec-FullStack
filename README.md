# TopCollec - Modern Blog CMS

A full-featured blog and CMS platform built with **Next.js 14+**, **Supabase**, and **TypeScript**. Inspired by WordPress but with modern JAMstack architecture, optimized for performance and developer experience.

![Next.js](https://img.shields.io/badge/Next.js-14+-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue?style=flat-square&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Latest-green?style=flat-square&logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3+-38bdf8?style=flat-square&logo=tailwind-css)

## ✨ Features

### Public Site
- 📝 **Paginated blog listing** with featured images, excerpts, and reading time
- 📖 **Single post pages** with full SEO optimization (meta tags, Open Graph, Twitter Cards, JSON-LD)
- 🏷️ **Tag and author pages** for content discovery
- 🔍 **Full-text search** powered by PostgreSQL full-text search
- 💬 **Comments system** with moderation support
- 📊 **RSS feed** and **sitemap.xml** for SEO
- ⚡ **SSG/ISR** for optimal performance
- 🎨 **Dark mode support** with Tailwind CSS
- 📱 **Fully responsive** design

### Admin Area
- 🔐 **Protected admin dashboard** with Supabase Auth
- ✍️ **Markdown editor** for content creation
- 🖼️ **Image upload** to Supabase Storage
- 🏷️ **Tag management**
- 💬 **Comment moderation** interface
- 👥 **User management**
- 📊 **Post analytics** (views, reading time)

### Developer Features
- ⚡ **Next.js App Router** with Server Components
- 🔄 **Server Actions** for data mutations
- 🔒 **Row Level Security (RLS)** in Supabase
- 📦 **TypeScript** throughout
- 🎨 **Tailwind CSS** with custom design system
- 🧪 **Ready for testing** (structure in place)
- 📱 **Image optimization** with next/image

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm/yarn/pnpm
- **Supabase account** (free tier works great)
- **Git** for version control

### 1. Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd topcollec-app

# Install dependencies
npm install
```

### 2. Set Up Supabase

1. Create a new Supabase project at [https://supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the schema from `supabase/schema.sql`
3. Go to **Storage** and verify the `post-images` bucket was created
4. Get your project credentials:
   - Go to **Settings > API**
   - Copy your **Project URL** and **anon public** key
   - Copy your **service_role** key (keep this secret!)

### 3. Configure Environment Variables

Create a `.env.local` file in the project root:

```bash
# Copy from example
cp .env.local.example .env.local
```

Edit `.env.local` with your Supabase credentials:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# App Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=TopCollec
```

### 4. Seed Sample Data (Optional)

```bash
npm run seed
```

This creates:
- 2 sample authors (author1@topcollec.com, author2@topcollec.com)
- 6 example posts (fantasy stories, sci-fi, lists)
- 12 tags
- All passwords: `password123`

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser!

## 📁 Project Structure

```
topcollec-app/
├── app/                        # Next.js App Router
│   ├── (auth)/                 # Authentication pages
│   ├── admin/                  # Admin dashboard
│   ├── api/                    # API routes
│   ├── posts/[slug]/           # Dynamic post pages
│   ├── tags/                   # Tag listing & pages
│   ├── search/                 # Search functionality
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Homepage
│   ├── globals.css             # Global styles
│   ├── rss/route.ts            # RSS feed
│   └── sitemap.ts              # Sitemap generation
├── components/                 # React components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── PostCard.tsx
│   ├── CommentForm.tsx
│   └── ...
├── lib/                        # Utilities & actions
│   ├── actions/                # Server actions
│   │   ├── posts.ts
│   │   └── comments.ts
│   ├── supabase/               # Supabase clients
│   │   ├── client.ts           # Browser client
│   │   ├── server.ts           # Server client
│   │   └── middleware.ts       # Auth middleware
│   ├── database.types.ts       # TypeScript types
│   ├── utils.ts                # Helper functions
│   └── constants.ts            # App constants
├── scripts/
│   └── seed.ts                 # Database seeding
├── supabase/
│   └── schema.sql              # Database schema
├── .env.local.example          # Environment variables template
├── middleware.ts               # Next.js middleware
├── next.config.js              # Next.js configuration
├── tailwind.config.ts          # Tailwind configuration
└── package.json
```

## 🗄️ Database Schema

The app uses Supabase (PostgreSQL) with these main tables:

- **profiles** - User profiles (extends Supabase auth.users)
- **posts** - Blog posts with markdown content
- **tags** - Content tags
- **post_tags** - Many-to-many relationship
- **comments** - User comments with moderation
- **bookmarks** - User saved posts (optional feature)

Full schema with RLS policies is in `supabase/schema.sql`.

## 🔒 Authentication

Uses **Supabase Auth** with email/password:

- Sign up/Sign in pages
- Protected admin routes via middleware
- Row-level security for data access
- Author and admin roles

### Default Test Accounts (after seeding):
```
Email: author1@topcollec.com
Password: password123

Email: author2@topcollec.com
Password: password123
```

## 🎨 Customization

### Branding
Edit `lib/constants.ts`:
```typescript
export const SITE_NAME = 'Your Blog Name'
export const SITE_DESCRIPTION = 'Your description'
```

### Styling
- Tailwind config: `tailwind.config.ts`
- Global styles: `app/globals.css`
- Color scheme: Primary colors in Tailwind config

### Content
- Markdown support out of the box
- Add custom React components with MDX (optional)
- Image optimization via next/image

## 📦 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

```bash
# Or use Vercel CLI
npm i -g vercel
vercel
```

### Deploy to Other Platforms

Works on any platform supporting Next.js:
- **Netlify** (with Next.js plugin)
- **Railway**
- **Render**
- **AWS Amplify**
- **Self-hosted** (Node.js server)

### Environment Variables for Production

Make sure to set these in your deployment platform:
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_SITE_URL (your production URL)
NEXT_PUBLIC_SITE_NAME
```

## 🧪 Testing

Structure is in place for testing. To add tests:

```bash
# Install testing libraries
npm install --save-dev @testing-library/react @testing-library/jest-dom jest

# Create tests in __tests__ directories
```

## 📝 Content Management

### Creating Posts
1. Sign in to `/admin`
2. Click "Manage Posts"
3. Click "New Post"
4. Write content in Markdown
5. Add tags, featured image, excerpt
6. Set status to "Published"
7. Submit!

### Moderating Comments
1. Go to `/admin/comments`
2. Review pending comments
3. Approve or delete

### Managing Images
- Upload via admin post editor
- Stored in Supabase Storage
- Automatically optimized by Next.js
- Public URLs generated automatically

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run seed         # Seed database with sample data
```

### Code Style
- **ESLint** for linting
- **Prettier** for formatting
- **TypeScript** strict mode

## 🚀 Performance

- **Lighthouse Score**: 90+ (all metrics)
- **SSG** for published posts (regenerate every hour)
- **Image optimization** with next/image
- **PostgreSQL full-text search** (fast!)
- **Edge caching** ready (via Vercel Edge)

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - feel free to use for personal or commercial projects

## 🆘 Support & Issues

- **Issues**: [GitHub Issues](your-repo-url/issues)
- **Discussions**: [GitHub Discussions](your-repo-url/discussions)
- **Supabase Docs**: [https://supabase.com/docs](https://supabase.com/docs)
- **Next.js Docs**: [https://nextjs.org/docs](https://nextjs.org/docs)

## 🎯 Roadmap

- [ ] MDX support for rich content
- [ ] Newsletter integration (Mailchimp/SendGrid)
- [ ] Advanced analytics dashboard
- [ ] Multi-author workflows
- [ ] Content scheduling
- [ ] Draft preview links
- [ ] WordPress import tool
- [ ] i18n (internationalization)
- [ ] E2E tests
- [ ] Automated backups

## 🙏 Acknowledgments

Built with these amazing technologies:
- [Next.js](https://nextjs.org/) - React framework
- [Supabase](https://supabase.com/) - Backend as a service
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [TypeScript](https://www.typescriptlang.org/) - Type safety

---

**Made with ❤️ for storytellers and content creators**

Happy blogging! 🚀
