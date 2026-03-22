# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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

## Architecture

This is a Next.js App Router project. All routes live under `src/app/` using file-based routing. The entry point is `src/app/page.tsx` with layout at `src/app/layout.tsx`.

> Before writing any Next.js code, read the relevant guide in `node_modules/next/dist/docs/` — this version has breaking changes from older Next.js.
