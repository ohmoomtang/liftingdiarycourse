---
title: Routing
---

# Routing

This app uses Next.js App Router with file-based routing under `src/app/`.

## Route Structure

All application routes are nested under `/dashboard`. There is no top-level authenticated content outside of `/dashboard`.

```
/                          → public landing page
/dashboard                 → protected: user dashboard
/dashboard/workout/new     → protected: create a new workout
/dashboard/workout/[id]    → protected: view/edit a workout
```

## CRITICAL RULES

### 1. All App Routes Live Under `/dashboard`

- **NEVER** add authenticated/user-facing routes at the top level (e.g. `/profile`, `/settings`)
- **ALWAYS** nest new routes under `/dashboard` — e.g. `/dashboard/settings`, `/dashboard/profile`
- The root `/` page is public and is the only top-level route

### 2. Route Protection is Done in Middleware — Never in Pages

All `/dashboard` routes are protected via Next.js middleware (`src/proxy.ts`). **Do not** add auth guards inside individual page components.

The middleware uses Clerk's `clerkMiddleware()` and `createRouteMatcher` to protect all `/dashboard(.*)` routes:

```ts
// src/proxy.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) await auth.protect();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
```

- **NEVER** call `auth.protect()` or redirect to sign-in inside a page component
- **NEVER** use `if (!userId) redirect('/sign-in')` patterns in pages — middleware handles this
- **ALWAYS** add new protected route prefixes to the `createRouteMatcher` list if they are outside `/dashboard`

### 3. Middleware File Location

The Next.js middleware **must** live at `src/proxy.ts` (not `src/middleware.ts`). This is the file Next.js picks up as middleware for this project.

### 4. Dynamic Route Segments

Follow the rules in `docs/server-components.md` for dynamic segments:

- Await `params` before accessing properties
- Validate and coerce param values (e.g. parse IDs as numbers/UUIDs)
- Call `notFound()` for invalid or missing values

```ts
// src/app/dashboard/workout/[workoutId]/page.tsx
export default async function WorkoutPage({
  params,
}: {
  params: Promise<{ workoutId: string }>;
}) {
  const { workoutId } = await params;
  const id = Number(workoutId);
  if (isNaN(id)) notFound();
  // ...
}
```
