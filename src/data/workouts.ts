import { db } from "@/db";
import { workouts } from "@/db/schema";
import { eq, and, gte, lt } from "drizzle-orm";

export async function getWorkoutById(workoutId: number, userId: string) {
  const result = await db
    .select()
    .from(workouts)
    .where(and(eq(workouts.id, workoutId), eq(workouts.userId, userId)));
  return result[0] ?? null;
}

export async function updateWorkout(
  workoutId: number,
  userId: string,
  name: string,
  startedAt: Date
) {
  const result = await db
    .update(workouts)
    .set({ name, startedAt, updatedAt: new Date() })
    .where(and(eq(workouts.id, workoutId), eq(workouts.userId, userId)))
    .returning();
  return result[0] ?? null;
}

export async function createWorkout(
  userId: string,
  name: string,
  startedAt: Date
) {
  const result = await db
    .insert(workouts)
    .values({ userId, name, startedAt })
    .returning();
  return result[0];
}

export async function getWorkoutsForUser(userId: string, date: Date) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);

  return db
    .select()
    .from(workouts)
    .where(
      and(
        eq(workouts.userId, userId),
        gte(workouts.startedAt, start),
        lt(workouts.startedAt, end)
      )
    );
}
