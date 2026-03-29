# Server Components

## CRITICAL RULES

### 1. All Page Components MUST Be `async`

Server Components that fetch data or access `params`/`searchParams` MUST be declared as `async` functions.

```tsx
// ✅ CORRECT
export default async function WorkoutPage({ params }: { params: Promise<{ workoutId: string }> }) {
  const { workoutId } = await params;
  // ...
}
```

```tsx
// ❌ WRONG — not async, cannot await params
export default function WorkoutPage({ params }: { params: Promise<{ workoutId: string }> }) {
  const { workoutId } = params.workoutId; // runtime error
}
```

---

### 2. `params` and `searchParams` MUST Be Awaited

In this version of Next.js, `params` and `searchParams` are **Promises**. You MUST `await` them before accessing any properties. Accessing properties directly without awaiting will cause a runtime error.

```tsx
// ✅ CORRECT — await params before accessing properties
export default async function WorkoutPage({
  params,
}: {
  params: Promise<{ workoutId: string }>;
}) {
  const { workoutId } = await params;
  // use workoutId
}
```

```tsx
// ✅ CORRECT — await searchParams before accessing properties
export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { date } = await searchParams;
  // use date
}
```

```tsx
// ❌ WRONG — destructuring params directly without awaiting
export default async function WorkoutPage({
  params: { workoutId },
}: {
  params: Promise<{ workoutId: string }>;
}) {
  // workoutId is undefined — params was never awaited
}
```

```tsx
// ❌ WRONG — accessing params.workoutId without awaiting
export default async function WorkoutPage({
  params,
}: {
  params: Promise<{ workoutId: string }>;
}) {
  const id = params.workoutId; // params is a Promise, not a plain object
}
```

---

### 3. Type `params` and `searchParams` as Promises

The TypeScript type for `params` and `searchParams` MUST be written as `Promise<{...}>`, not as a plain object type.

```tsx
// ✅ CORRECT
type Props = {
  params: Promise<{ workoutId: string }>;
  searchParams: Promise<{ date?: string }>;
};
```

```tsx
// ❌ WRONG — plain object type does not reflect the actual runtime shape
type Props = {
  params: { workoutId: string };
  searchParams: { date?: string };
};
```

---

### 4. Never Pass `params` or `searchParams` to Client Components

Await `params`/`searchParams` in the Server Component and pass only the resolved primitive values down to any Client Components.

```tsx
// ✅ CORRECT — pass resolved value
const { workoutId } = await params;
return <EditWorkoutForm workoutId={workoutId} />;
```

```tsx
// ❌ WRONG — passing the unresolved Promise to a Client Component
return <EditWorkoutForm params={params} />;
```

---

### 5. Validate Dynamic Route Params Before Use

Dynamic route segments (e.g. `[workoutId]`) are always strings. Validate and coerce them before use, and call `notFound()` for invalid values.

```tsx
// ✅ CORRECT
const { workoutId } = await params;
const id = Number(workoutId);

if (!Number.isInteger(id) || id <= 0) {
  notFound();
}
```

```tsx
// ❌ WRONG — using a raw string param as a number without validation
const { workoutId } = await params;
const workout = await getWorkoutById(Number(workoutId), userId); // NaN if invalid
```
