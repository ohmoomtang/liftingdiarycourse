# Data Mutation

## CRITICAL RULES

### 1. All Database Mutations Go in `/data`

Database mutations MUST be written as helper functions inside the `/data` directory using **Drizzle ORM**.

- **NEVER** write raw SQL strings
- **NEVER** mutate the database directly from a Server Action, page, or component
- **ALWAYS** create a helper function in `/data` and call it from your Server Action

```
src/
  data/
    workouts.ts      # e.g. createWorkout, updateWorkout, deleteWorkout
    exercises.ts     # e.g. createExercise, deleteExercise
    ...
```

```ts
// ✅ CORRECT — /data/workouts.ts
import { db } from "@/db";
import { workouts } from "@/db/schema";

export async function createWorkout(userId: string, startedAt: Date) {
  const result = await db
    .insert(workouts)
    .values({ userId, startedAt })
    .returning();
  return result[0];
}
```

```ts
// ❌ WRONG — mutating the database directly inside a Server Action
"use server";
import { db } from "@/db";
import { workouts } from "@/db/schema";

export async function createWorkoutAction() {
  await db.insert(workouts).values(...); // NEVER DO THIS
}
```

---

### 2. All Mutations MUST Go Through Server Actions

ALL data mutations MUST be triggered via **Server Actions** — never via Route Handlers or any client-side mechanism.

- **NEVER** mutate data in Route Handlers (`src/app/api/`)
- **NEVER** call Drizzle helpers directly from Client Components
- **ONLY** trigger mutations by calling a Server Action

---

### 3. Server Actions Live in Colocated `actions.ts` Files

Server Actions MUST be defined in a file named `actions.ts` colocated with the route or feature that uses them. Do not create a single global actions file.

```
src/app/
  dashboard/
    create-workout/
      page.tsx
      actions.ts     # ✅ colocated Server Actions for this route
```

Every `actions.ts` file MUST start with the `"use server"` directive.

```ts
// ✅ CORRECT — src/app/dashboard/create-workout/actions.ts
"use server";

export async function createWorkoutAction(...) { ... }
```

```ts
// ❌ WRONG — defining Server Actions inside a component file
"use server";
// src/app/dashboard/create-workout/page.tsx — don't put actions here
```

---

### 4. Server Action Parameters MUST Be Typed — No `FormData`

All Server Action parameters MUST use explicit TypeScript types. `FormData` is prohibited as a parameter type.

```ts
// ✅ CORRECT — typed parameters
export async function createWorkoutAction(params: { startedAt: Date }) { ... }
```

```ts
// ❌ WRONG — FormData parameter
export async function createWorkoutAction(formData: FormData) { ... }
```

---

### 5. ALL Server Actions MUST Validate Arguments with Zod

Every Server Action MUST validate its inputs using **Zod** before doing anything else. Never trust caller-supplied data.

```ts
// ✅ CORRECT — src/app/dashboard/create-workout/actions.ts
"use server";

import { z } from "zod";
import { auth } from "@/lib/auth";
import { createWorkout } from "@/data/workouts";

const createWorkoutSchema = z.object({
  startedAt: z.coerce.date(),
});

export async function createWorkoutAction(params: { startedAt: Date }) {
  const parsed = createWorkoutSchema.safeParse(params);
  if (!parsed.success) {
    throw new Error("Invalid input");
  }

  const session = await auth();
  return createWorkout(session.user.id, parsed.data.startedAt);
}
```

```ts
// ❌ WRONG — no validation
export async function createWorkoutAction(params: { startedAt: Date }) {
  const session = await auth();
  return createWorkout(session.user.id, params.startedAt); // params not validated
}
```

---

### 6. Users Can ONLY Mutate Their Own Data

Every mutation MUST be scoped to the authenticated user's ID, derived from the **server-side session** — never from a parameter supplied by the client.

```ts
// ✅ CORRECT — user ID comes from the session
const session = await auth();
await deleteWorkout(parsed.data.workoutId, session.user.id);
```

```ts
// ❌ WRONG — trusting a userId from the caller
export async function deleteWorkoutAction(params: { workoutId: string; userId: string }) {
  await deleteWorkout(params.workoutId, params.userId); // NEVER trust client-supplied userId
}
```

---

### 7. Never Use `redirect` Inside Server Actions — Redirect Client-Side Instead

Do **not** call `redirect()` from `next/navigation` inside a Server Action. Instead, return from the action and perform the redirect in the Client Component using `router.push()` after the action resolves.

```ts
// ✅ CORRECT — action returns, page redirects
// actions.ts
export async function createWorkoutAction(params: { ... }) {
  // ...
  return workout; // return the result, do not redirect
}

// page.tsx
async function handleSubmit(...) {
  await createWorkoutAction(params);
  router.push("/dashboard"); // redirect client-side after action resolves
}
```

```ts
// ❌ WRONG — redirecting inside the Server Action
import { redirect } from "next/navigation";

export async function createWorkoutAction(params: { ... }) {
  // ...
  redirect("/dashboard"); // NEVER DO THIS
}
```

---

The corresponding `/data` helper MUST also enforce ownership:

```ts
// ✅ CORRECT — /data/workouts.ts
export async function deleteWorkout(workoutId: string, userId: string) {
  await db
    .delete(workouts)
    .where(and(eq(workouts.id, workoutId), eq(workouts.userId, userId)));
}
```
