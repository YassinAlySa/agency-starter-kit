# 🚀 Agency Starter Kit

> Professional Supabase + Next.js template for building scalable applications.
> **Optimized for Google Antigravity IDE**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Quick Start

```bash
# 1. Clone this template
git clone https://github.com/YassinAlySa/agency-starter-kit.git my-project
cd my-project

# 2. Remove git history (fresh start for your project)
rm -rf .git
git init

# 3. Install dependencies
npm install

# 4. Setup Supabase
npx supabase link --project-ref YOUR_PROJECT_ID

# 5. Generate types
npm run typegen

# 6. Start development
npm run dev
```

## 📁 Project Structure

```
├── .agent/workflows/         # Antigravity AI rules
│   └── ai-rules.md          # AI enforcer instructions
├── .github/workflows/        # CI/CD pipelines
├── docs/                     # Documentation
│   └── ARCHITECTURE.md       # Full SOP
├── src/
│   ├── app/                  # Next.js App Router
│   ├── components/
│   │   ├── ui/              # Shadcn components
│   │   ├── forms/           # Form components
│   │   └── features/        # Feature-specific
│   ├── hooks/               # TanStack Query hooks
│   ├── lib/
│   │   ├── services/        # Supabase service layer
│   │   └── supabase/        # Client setup
│   └── types/               # TypeScript definitions
├── supabase/
│   ├── migrations/          # SQL migrations
│   ├── functions/           # Edge functions
│   │   └── _shared/         # Shared utilities
│   └── seed/                # Seed data
└── tests/                   # Test suites
```

## 🔗 Links

- [Full SOP Documentation](./docs/ARCHITECTURE.md)
- [AI Instructions](./.agent/workflows/ai-rules.md)

## 🤖 Antigravity Integration

This template includes AI rules at `.agent/workflows/ai-rules.md` that:

- Enforce the 3-layer architecture
- Prevent code duplication
- Ensure type safety from database to components
- Guide AI to follow project conventions

## 📋 Pre-flight Checklist

- [ ] Update project name in `package.json`
- [ ] Create Supabase project
- [ ] Add environment variables to `.env.local`
- [ ] Run initial migration: `npx supabase db push`
- [ ] Generate TypeScript types: `npm run typegen`

## 🛡️ Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
```

## 📜 Available Scripts

| Command                 | Description                        |
| ----------------------- | ---------------------------------- |
| `npm run dev`           | Start development server           |
| `npm run build`         | Build for production               |
| `npm run typegen`       | Generate Supabase TypeScript types |
| `npm run test`          | Run tests                          |
| `npm run lint`          | Run ESLint                         |
| `npm run docs:generate` | Generate API documentation         |

## 🏗️ Architecture

This template follows the **Three-Layer Architecture**:

```
UI Components → Custom Hooks (TanStack Query) → Service Layer → Supabase
```

See [ARCHITECTURE.md](./docs/ARCHITECTURE.md) for full documentation.

## 📄 License

MIT
