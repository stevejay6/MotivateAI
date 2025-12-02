import { useMemo, type ReactNode } from "react";
import { Calendar, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { format, subDays } from "date-fns";

import type { JournalEntry, Mood } from "@/app/ai-kick-in-the-pants/types";
import { moodIcons } from "@/lib/moodIcons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type JournalStatsProps = {
  entries: JournalEntry[];
  isLoading: boolean;
};

const MOOD_ORDER: Mood[] = ["amazing", "good", "okay", "challenging", "difficult"];

export function JournalStats({ entries, isLoading }: JournalStatsProps) {
  const totalEntries = entries.length;

  const streak = useMemo(() => {
    if (!entries.length) return 0;
    const entryDates = new Set(entries.map((entry) => entry.date));
    let count = 0;
    let current = new Date();
    while (entryDates.has(format(current, "yyyy-MM-dd"))) {
      count += 1;
      current = subDays(current, 1);
    }
    return count;
  }, [entries]);

  const moodCounts = useMemo(() => {
    return entries.reduce<Record<Mood, number>>(
      (acc, entry) => {
        acc[entry.mood] += 1;
        return acc;
      },
      { amazing: 0, good: 0, okay: 0, challenging: 0, difficult: 0 }
    );
  }, [entries]);

  const mostCommonMood = useMemo(() => {
    if (!entries.length) return null;
    return MOOD_ORDER.reduce<{ mood: Mood | null; count: number }>(
      (acc, mood) => {
        if (moodCounts[mood] > acc.count) {
          return { mood, count: moodCounts[mood] };
        }
        return acc;
      },
      { mood: null, count: -1 }
    ).mood;
  }, [entries.length, moodCounts]);

  const gratitudeWords = useMemo(() => {
    const flattened = entries.flatMap((entry) => entry.gratitude ?? []);
    return flattened.slice(0, 30);
  }, [entries]);

  const maxMoodCount = Math.max(...Object.values(moodCounts), 1);
  const MostCommonMoodIcon = mostCommonMood ? moodIcons[mostCommonMood].icon : null;

  if (isLoading) {
    return (
      <div className="flex justify-center py-10" role="status" aria-label="Loading stats">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          title="Total Entries"
          icon={<Calendar className="h-6 w-6 text-teal-500" />}
          background="bg-teal-50"
          value={totalEntries}
        />
        <StatCard
          title="Current Streak"
          icon={<TrendingUp className="h-6 w-6 text-blue-500" />}
          background="bg-blue-50"
          value={streak}
          suffix="-day streak"
        />
        <Card className="rounded-2xl border-none bg-amber-50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-amber-700">Most Common Mood</CardTitle>
            {mostCommonMood && MostCommonMoodIcon ? (
              <div className={`rounded-full p-1 ${moodIcons[mostCommonMood].bg}`}>
                <MostCommonMoodIcon className={`h-4 w-4 ${moodIcons[mostCommonMood].color}`} />
              </div>
            ) : null}
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold capitalize text-slate-900">
              {mostCommonMood ?? "No entries yet"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-600">Mood distribution</h3>
          <span className="text-xs text-slate-500">Last {entries.length || 0} entries</span>
        </div>
        <div className="space-y-3">
          {MOOD_ORDER.map((mood) => {
            const count = moodCounts[mood];
            const widthPercent = maxMoodCount ? Math.round((count / maxMoodCount) * 100) : 0;
            return (
              <div key={mood} data-testid="mood-bar" data-mood={mood}>
                <div className="flex items-center justify-between text-xs font-medium text-slate-500">
                  <span className="capitalize">{mood}</span>
                  <span>{count}</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-gray-100">
                  <motion.div
                    className="h-2 rounded-full bg-teal-500"
                    data-width={widthPercent}
                    initial={{ width: 0 }}
                    animate={{ width: `${widthPercent}%` }}
                    transition={{ duration: 0.6 }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-600">Gratitude cloud</h3>
        {gratitudeWords.length ? (
          <div className="mt-3">
            {gratitudeWords.map((word, index) => (
              <span
                key={`${word}-${index}`}
                data-testid="gratitude-tag"
                className="mr-2 mb-2 inline-block rounded-full bg-teal-50 px-3 py-1 text-xs text-gray-700"
              >
                {word}
              </span>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm text-slate-500">
            Share your gratitude entries to see them bloom here.
          </p>
        )}
      </div>
    </div>
  );
}

type StatCardProps = {
  title: string;
  icon: ReactNode;
  background: string;
  value: number;
  suffix?: string;
};

function StatCard({ title, icon, background, value, suffix }: StatCardProps) {
  return (
    <Card className={`rounded-2xl border-none shadow-sm ${background}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-600">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-semibold text-slate-900">
          {suffix ? `${value}${suffix}` : value}
        </p>
      </CardContent>
    </Card>
  );
}

