import { auth } from "@clerk/nextjs/server";
import { getWorkoutsForUser } from "@/data/workouts";
import { WorkoutList } from "./workout-list";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { userId } = await auth();
  const { date: dateParam } = await searchParams;

  const date = dateParam ? new Date(`${dateParam}T00:00:00`) : new Date();
  const workouts = await getWorkoutsForUser(userId!, date);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            Workout Diary
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            View your logged workouts by date
          </p>
        </div>

        <WorkoutList workouts={workouts} selectedDate={date} />
      </div>
    </div>
  );
}
