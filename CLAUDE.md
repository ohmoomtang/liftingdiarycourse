# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> **IMPORTANT: Before generating any code, always first check the `/docs` directory for a relevant documentation file and follow its guidance.**

@AGENTS.md

## Commands

```bash
pnpm dev        # Start development server at http://localhost:3000
pnpm build      # Production build
pnpm start      # Start production server
pnpm lint       # Run ESLint
```

## Stack

- **Next.js 16** with App Router (`src/app/`)
- **React 19**
- **TypeScript**
- **Tailwind CSS v4** (via `@tailwindcss/postcss`)
- Package manager: **pnpm**

## Data Fetching

> **See `docs/data-fetching.md` for full rules.** Summary:
> - ALL data fetching MUST be done in Server Components — never in Client Components, Route Handlers, or via `fetch` on the client
> - ALL database queries MUST use Drizzle ORM helper functions in the `/data` directory — never raw SQL
> - EVERY query MUST be scoped to the authenticated user's ID — users must never access other users' data

## Data Mutation

> **See `docs/data-mutation.md` for full rules.** Summary:
> - ALL mutations MUST use Drizzle ORM helper functions in the `/data` directory — never raw SQL or direct db calls in actions
> - ALL mutations MUST be triggered via Server Actions in colocated `actions.ts` files — never Route Handlers
> - Server Action params MUST be typed — `FormData` is prohibited
> - ALL Server Actions MUST validate inputs with Zod before doing anything else
> - EVERY mutation MUST be scoped to the authenticated user's ID from the server-side session

## Server Components

> **See `docs/server-components.md` for full rules.** Summary:
> - ALL page components MUST be `async`
> - `params` and `searchParams` are Promises — MUST be awaited before accessing properties
> - Type them as `Promise<{...}>`, never as plain objects
> - Validate and coerce dynamic route params before use; call `notFound()` for invalid values

## Routing

> **See `docs/routing.md` for full rules.** Summary:
> - ALL app routes MUST be nested under `/dashboard`
> - Route protection MUST be handled in middleware (`src/proxy.ts`) via Clerk — never in page components
> - Dynamic route params MUST be awaited and validated; call `notFound()` for invalid values

## Architecture

This is a Next.js App Router project. All routes live under `src/app/` using file-based routing. The entry point is `src/app/page.tsx` with layout at `src/app/layout.tsx`.

> Before writing any Next.js code, read the relevant guide in `node_modules/next/dist/docs/` — this version has breaking changes from older Next.js.
