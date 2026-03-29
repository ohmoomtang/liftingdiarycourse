"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { updateWorkout } from "@/data/workouts";

const updateWorkoutSchema = z.object({
  workoutId: z.number().int().positive(),
  name: z.string().min(1, "Name is required"),
  startedAt: z.coerce.date(),
});

export async function updateWorkoutAction(params: {
  workoutId: number;
  name: string;
  startedAt: Date;
}) {
  const parsed = updateWorkoutSchema.safeParse(params);
  if (!parsed.success) {
    throw new Error("Invalid input");
  }

  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const workout = await updateWorkout(
    parsed.data.workoutId,
    userId,
    parsed.data.name,
    parsed.data.startedAt
  );

  if (!workout) {
    throw new Error("Workout not found");
  }

  return workout;
}
