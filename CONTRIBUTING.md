# Contributing to TopCollec

Thank you for your interest in contributing to TopCollec! This document provides guidelines and instructions for contributing.

## 🤝 Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Give constructive feedback
- Focus on what's best for the community

## 🐛 Bug Reports

### Before Submitting
- Check existing issues
- Try the latest version
- Check the documentation

### Submitting a Bug Report
Include:
- **Description**: Clear description of the bug
- **Steps to Reproduce**: Numbered steps to reproduce
- **Expected Behavior**: What should happen
- **Actual Behavior**: What actually happens
- **Environment**: OS, Node version, browser
- **Screenshots**: If applicable

## ✨ Feature Requests

We love new ideas! When requesting a feature:
- Check if it already exists or has been requested
- Explain the problem it solves
- Describe your proposed solution
- Consider implementation complexity

## 💻 Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/your-username/topcollec.git
   cd topcollec-app
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Set Up Environment**
   - Copy `.env.local.example` to `.env.local`
   - Add your Supabase credentials
   - Run `npm run seed` for sample data

4. **Start Development**
   ```bash
   npm run dev
   ```

## 🔧 Development Workflow

1. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

2. **Make Changes**
   - Write clean, readable code
   - Follow existing code style
   - Add comments for complex logic
   - Keep commits atomic and focused

3. **Test Your Changes**
   ```bash
   npm run build
   npm run lint
   ```

4. **Commit**
   ```bash
   git add .
   git commit -m "feat: add awesome feature"
   ```

   Use conventional commit messages:
   - `feat:` new feature
   - `fix:` bug fix
   - `docs:` documentation
   - `style:` formatting
   - `refactor:` code restructuring
   - `test:` adding tests
   - `chore:` maintenance

5. **Push and Create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

## 📝 Pull Request Guidelines

### Before Submitting
- [ ] Code builds without errors
- [ ] No linting errors
- [ ] Tested in development
- [ ] Documentation updated if needed
- [ ] Commit messages are clear

### PR Description Should Include
- **What**: What does this PR do?
- **Why**: Why is this change necessary?
- **How**: How does it work?
- **Testing**: How was it tested?
- **Screenshots**: If UI changes

### Review Process
1. Maintainer reviews your PR
2. Changes may be requested
3. Once approved, we'll merge!

## 🎨 Code Style

### TypeScript
- Use TypeScript strict mode
- Define types explicitly
- Avoid `any` when possible
- Use interfaces for object shapes

```typescript
// ✅ Good
interface Post {
  id: string
  title: string
  content: string
}

// ❌ Avoid
const post: any = { ... }
```

### React Components
- Use functional components
- Keep components small and focused
- Extract reusable logic to hooks
- Use Server Components when possible

```typescript
// ✅ Server Component (default)
export default async function PostPage() {
  const posts = await getPosts()
  return <PostList posts={posts} />
}

// ✅ Client Component (when needed)
'use client'
export default function CommentForm() {
  const [comment, setComment] = useState('')
  // ...
}
```

### File Organization
```
feature/
├── page.tsx          # Page component
├── layout.tsx        # Layout (if needed)
├── loading.tsx       # Loading state
├── error.tsx         # Error boundary
└── components/       # Feature-specific components
    ├── FeatureCard.tsx
    └── FeatureList.tsx
```

### Naming Conventions
- **Components**: PascalCase (`PostCard.tsx`)
- **Utilities**: camelCase (`formatDate.ts`)
- **Constants**: UPPER_SNAKE_CASE (`POSTS_PER_PAGE`)
- **Server Actions**: descriptive verbs (`getPublishedPosts`)

## 🧪 Testing

We welcome tests! Currently:
- Structure is in place
- Testing libraries need to be added
- Help us add comprehensive tests!

## 📚 Documentation

- Update README.md for user-facing changes
- Add JSDoc comments for complex functions
- Update DEPLOYMENT.md for deployment changes
- Keep inline comments clear and concise

## 🌟 Areas We Need Help With

### High Priority
- [ ] Admin post editor UI
- [ ] Media library management
- [ ] Email notifications
- [ ] Comprehensive tests

### Medium Priority
- [ ] MDX support
- [ ] Multi-language support (i18n)
- [ ] Advanced search filters
- [ ] User profiles

### Nice to Have
- [ ] Mobile app (React Native)
- [ ] WordPress import tool
- [ ] Comment threading
- [ ] Social media integrations

## 💬 Questions?

- Open a GitHub Discussion
- Comment on relevant issues
- Check existing documentation

## 🎖️ Recognition

Contributors will be:
- Listed in README.md
- Mentioned in release notes
- Given credit in documentation

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for making TopCollec better! 🚀
