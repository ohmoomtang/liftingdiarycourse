# Authentication

This app uses **Clerk** (`@clerk/nextjs`) for all authentication. Do not implement custom auth, sessions, or JWT handling.

## Setup

`ClerkProvider` wraps the app in `src/app/layout.tsx`. The Clerk middleware runs on every request via `src/proxy.ts` (which exports `clerkMiddleware()`).

## CRITICAL RULES

### 1. Always Use Clerk — Never Roll Your Own Auth

- **NEVER** implement custom session handling, JWTs, or cookies for auth
- **NEVER** use NextAuth, next-auth, or any other auth library
- **ALWAYS** use Clerk's provided functions and components

### 2. Getting the Authenticated User's ID (Server)

In Server Components and server-side code, get the user ID from Clerk's `auth()`:

```ts
import { auth } from "@clerk/nextjs/server";

export default async function MyPage() {
  const { userId } = await auth();
  // userId is null if not signed in
}
```

- **NEVER** trust a `userId` passed from the client — always derive it server-side via `auth()`
- This integrates directly with the data fetching rules in `data-fetching.md`: always pass `userId` to `/data` helpers to scope queries

### 3. Protecting Routes

Use `clerkMiddleware()` in `src/proxy.ts` as the Next.js middleware to protect routes. To require authentication on a route, use `protect()` inside the middleware or use Clerk's route protection helpers:

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

### 4. UI Components

Use Clerk's built-in components for sign-in/sign-up UI. Do not build custom auth forms.

```tsx
import { SignInButton, SignUpButton, UserButton, Show } from "@clerk/nextjs";

// Show sign-in/sign-up only when signed out
<Show when="signed-out">
  <SignInButton mode="modal" />
  <SignUpButton mode="modal" />
</Show>

// Show user avatar/menu only when signed in
<Show when="signed-in">
  <UserButton />
</Show>
```

### 5. Checking Auth State in Client Components

In Client Components, use Clerk's `useAuth()` or `useUser()` hooks — never store auth state yourself:

```tsx
"use client";
import { useAuth } from "@clerk/nextjs";

export function MyClientComponent() {
  const { userId, isSignedIn } = useAuth();
  // ...
}
```

## Import Reference

| What you need | Import from |
|---|---|
| `auth()` (server-side user ID) | `@clerk/nextjs/server` |
| `clerkMiddleware` | `@clerk/nextjs/server` |
| `ClerkProvider`, `SignInButton`, `SignUpButton`, `UserButton`, `Show` | `@clerk/nextjs` |
| `useAuth()`, `useUser()` (client hooks) | `@clerk/nextjs` |
