import { JournalEntry } from "@/utils/journalApi";

export function calculateStreak(entries: JournalEntry[]): number {
  if (entries.length === 0) return 0;

  const sorted = [...entries].sort((a, b) => (a.date < b.date ? 1 : -1));
  let streak = 1;

  for (let i = 1; i < sorted.length; i += 1) {
    const prevDate = new Date(sorted[i - 1].date);
    const currDate = new Date(sorted[i].date);
    const diffDays = Math.round(
      (prevDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diffDays === 1) {
      streak += 1;
    } else {
      break;
    }
  }

  return streak;
}

export function getMostCommonMood(
  entries: JournalEntry[]
): JournalEntry["mood"] | null {
  if (entries.length === 0) return null;
  const counts: Record<JournalEntry["mood"], number> = {
    amazing: 0,
    good: 0,
    okay: 0,
    challenging: 0,
    difficult: 0,
  };

  entries.forEach((entry) => {
    counts[entry.mood] += 1;
  });

  const [mood] = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  return mood as JournalEntry["mood"];
}


