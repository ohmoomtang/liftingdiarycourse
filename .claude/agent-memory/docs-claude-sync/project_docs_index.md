---
name: docs-claude-sync index
description: Tracks which /docs files are referenced in CLAUDE.md and the formatting conventions used
type: project
---

All /docs references live in named sections under CLAUDE.md's top-level headings (before `## Architecture`). Each section follows this pattern:

```
## <Topic>

> **See `docs/<filename>.md` for full rules.** Summary:
> - bullet summary of critical rules
```

## Currently referenced docs files (as of 2026-03-30)

| File | CLAUDE.md section | Purpose |
|------|-------------------|---------|
| `docs/data-fetching.md` | `## Data Fetching` | Rules for Server Component-only data fetching with Drizzle ORM |
| `docs/data-mutation.md` | `## Data Mutation` | Rules for Server Actions, Zod validation, and scoped mutations |
| `docs/server-components.md` | `## Server Components` | Rules for async pages, awaiting params/searchParams, notFound() |
| `docs/routing.md` | `## Routing` | Rules for /dashboard nesting, Clerk middleware in src/proxy.ts, dynamic params |

**Why:** Keeping this index prevents duplicate entries and ensures the formatting convention is applied consistently.
**How to apply:** Before adding a new entry, check this table. If the file is already listed, no CLAUDE.md edit is needed.
