# Data Fetching

## CRITICAL RULES

### 1. Server Components ONLY

ALL data fetching in this app MUST be done via **React Server Components**.

- **NEVER** fetch data in Client Components (`"use client"`)
- **NEVER** fetch data in Route Handlers (`src/app/api/`)
- **NEVER** use `useEffect` + `fetch` or any client-side data fetching library (SWR, React Query, etc.)
- **ONLY** fetch data in Server Components by calling helper functions directly

```tsx
// ✅ CORRECT — Server Component fetching data
// src/app/dashboard/page.tsx
import { getWorkoutsForUser } from "@/data/workouts";
import { auth } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await auth();
  const workouts = await getWorkoutsForUser(session.user.id);
  return <WorkoutList workouts={workouts} />;
}
```

```tsx
// ❌ WRONG — Client Component fetching data
"use client";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [workouts, setWorkouts] = useState([]);
  useEffect(() => {
    fetch("/api/workouts").then(...); // NEVER DO THIS
  }, []);
}
```

```ts
// ❌ WRONG — Route Handler fetching data
// src/app/api/workouts/route.ts
export async function GET() {
  const workouts = await db.select()...; // NEVER DO THIS
}
```

---

### 2. All Database Queries Go in `/data`

Database queries MUST be written as helper functions inside the `/data` directory using **Drizzle ORM**.

- **NEVER** write raw SQL strings
- **NEVER** query the database directly from a page or component
- **ALWAYS** create a helper function in `/data` and call it from your Server Component

```
src/
  data/
    workouts.ts      # e.g. getWorkoutsForUser, getWorkoutById
    exercises.ts     # e.g. getExercisesForWorkout
    ...
```

```ts
// ✅ CORRECT — /data/workouts.ts
import { db } from "@/lib/db";
import { workouts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function getWorkoutsForUser(userId: string) {
  return db.select().from(workouts).where(eq(workouts.userId, userId));
}
```

```ts
// ❌ WRONG — raw SQL
export async function getWorkoutsForUser(userId: string) {
  return db.execute(sql`SELECT * FROM workouts WHERE user_id = ${userId}`);
}
```

---

### 3. Users Can ONLY Access Their Own Data

This is a **hard security requirement**. Every query that returns user-specific data MUST filter by the authenticated user's ID. A logged-in user must NEVER be able to access another user's data.

- Always retrieve the authenticated user's ID from the session inside the Server Component
- Always pass `userId` to the `/data` helper function
- Always include a `WHERE user_id = $userId` condition (via Drizzle's `eq`) in every query

```ts
// ✅ CORRECT — always scope queries to the authenticated user
export async function getWorkoutsForUser(userId: string) {
  return db.select().from(workouts).where(eq(workouts.userId, userId));
}

// ✅ CORRECT — verify ownership when fetching a single record
export async function getWorkoutById(workoutId: string, userId: string) {
  const result = await db
    .select()
    .from(workouts)
    .where(and(eq(workouts.id, workoutId), eq(workouts.userId, userId)));
  return result[0] ?? null;
}
```

```ts
// ❌ WRONG — no user scoping, exposes all users' data
export async function getWorkoutById(workoutId: string) {
  return db.select().from(workouts).where(eq(workouts.id, workoutId));
}
```

**Never** rely on the client to pass a `userId` to an API route as a security boundary — always derive the user ID from the server-side session.
