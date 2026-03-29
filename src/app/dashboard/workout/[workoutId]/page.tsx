import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getWorkoutById } from "@/data/workouts";
import { EditWorkoutForm } from "./edit-workout-form";

export default async function EditWorkoutPage({
  params,
}: {
  params: Promise<{ workoutId: string }>;
}) {
  const { workoutId } = await params;
  const id = Number(workoutId);

  if (!Number.isInteger(id) || id <= 0) {
    notFound();
  }

  const { userId } = await auth();
  const workout = await getWorkoutById(id, userId!);

  if (!workout) {
    notFound();
  }

  return <EditWorkoutForm workout={workout} />;
}
