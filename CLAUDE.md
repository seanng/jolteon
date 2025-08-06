# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

### Essential Commands
```bash
# Run all tests across the monorepo
pnpm test

# Run tests for a specific file
pnpm test path/to/file.test.tsx

# Type checking
pnpm typecheck

# Linting (uses Biome via ultracite)
pnpm lint

# Format code
pnpm format

# Clean all build artifacts and node_modules
pnpm clean
```

### Database Commands
```bash
# Run database migrations (formats schema, generates client, pushes to DB)
pnpm migrate
```

### Dependency Management
```bash
# Update all dependencies to latest versions
pnpm bump-deps

# Update shadcn/ui components
pnpm bump-ui
```

## Architecture Overview

This is a **Turborepo monorepo** using **pnpm workspaces** for a Next.js application ecosystem.

### Apps Structure
- **`apps/app`** - Main application with authentication and user features
- **`apps/api`** - Backend API with webhooks and cron jobs
- **`apps/web`** - Marketing/landing page with i18n
- **`apps/docs`** - Documentation site (Mintlify)
- **`apps/email`** - Email template development
- **`apps/storybook`** - Component documentation
- **`apps/studio`** - Content management studio

### Package Organization
All shared packages use the `@repo/*` namespace:
- **`@repo/auth`** - Clerk authentication wrapper
- **`@repo/database`** - Prisma client with Neon serverless
- **`@repo/design-system`** - UI components (shadcn/ui based)
- **`@repo/analytics`** - PostHog analytics
- **`@repo/observability`** - Sentry error tracking
- **`@repo/payments`** - Stripe integration
- **`@repo/collaboration`** - Liveblocks real-time features
- **`@repo/feature-flags`** - Feature flag management

### Key Architectural Patterns

#### Authentication Flow
- Uses **Clerk** for authentication
- Middleware composition in apps with `clerkMiddleware`
- Protected routes use `(authenticated)` layout groups
- Auth state checked with `currentUser()` from `@repo/auth/server`
- Webhooks handle user lifecycle events

#### Database Access
- **Prisma** with **Neon** serverless PostgreSQL
- Database client exported from `@repo/database`
- Uses `server-only` directive to prevent client-side usage
- Schema located at `packages/database/prisma/schema.prisma`

#### Environment Configuration
- Each package exports a `keys()` function defining its env vars
- Uses `@t3-oss/env-nextjs` for type-safe environment variables
- Env files follow `.env.*local` pattern

#### Communication Between Apps
- Apps deployed separately (different ports in dev)
- API exposes RESTful endpoints
- Shared functionality through workspace packages
- Webhook endpoints for external integrations

#### Provider Pattern
- Design system exports a root provider composing all providers
- Wraps Theme, Auth, Analytics, and other contexts
- Used in app root layouts

### Technology Stack
- **Next.js 15** with App Router and Server Components
- **TypeScript** with strict mode
- **Tailwind CSS v4** for styling
- **Biome** for linting/formatting (via ultracite)
- **Vitest** for testing with React Testing Library
- **Turbopack** for faster development builds

## Important Instructions
- Do NOT run `pnpm dev` or `pnpm build` after making a change. The user will perform the validation themselves.
