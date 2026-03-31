"use client";

import { useRouter, usePathname } from "next/navigation";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { Workout } from "@/db/schema";

function formatDate(date: Date): string {
  const day = date.getDate();
  const ordinal =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
        ? "nd"
        : day % 10 === 3 && day !== 13
          ? "rd"
          : "th";

  return `${day}${ordinal} ${format(date, "MMM yyyy")}`;
}

export function WorkoutList({
  workouts,
  selectedDate,
}: {
  workouts: Workout[];
  selectedDate: Date;
}) {
  const router = useRouter();
  const pathname = usePathname();

  function handleDateSelect(d: Date | undefined) {
    if (!d) return;
    const params = new URLSearchParams();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    params.set("date", `${year}-${month}-${day}`);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <>
      <Popover>
        <PopoverTrigger className="inline-flex w-[220px] items-center justify-start gap-2 rounded-lg border border-border bg-background px-2.5 py-1.5 text-sm font-normal text-foreground hover:bg-muted">
          <CalendarIcon className="h-4 w-4 text-zinc-500" />
          {formatDate(selectedDate)}
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      <div className="space-y-3">
        <h2 className="text-sm font-medium text-zinc-500 uppercase tracking-wide">
          Workouts — {formatDate(selectedDate)}
        </h2>

        {workouts.length === 0 ? (
          <div className="rounded-lg border border-dashed border-zinc-200 dark:border-zinc-800 p-8 text-center">
            <p className="text-zinc-500 text-sm">
              No workouts logged for this date.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {workouts.map((workout) => (
              <div
                key={workout.id}
                className="flex items-center justify-between rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-3"
              >
                <div>
                  <p className="font-medium text-zinc-900 dark:text-zinc-50">
                    {workout.name}
                  </p>
                  <p className="text-sm text-zinc-500">
                    {format(workout.startedAt, "h:mm a")}
                  </p>
                </div>
                <span className="text-xs text-zinc-400">
                  {workout.completedAt
                    ? format(workout.completedAt, "h:mm a")
                    : "In progress"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
