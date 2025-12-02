import { BookOpen } from "lucide-react";

import type { JournalEntry } from "@/app/ai-kick-in-the-pants/types";
import { JournalEntryCard } from "@/components/JournalEntryCard";

type JournalTimelineProps = {
  entries: JournalEntry[];
  isLoading: boolean;
  onEdit: (entry: JournalEntry) => void;
  onDelete: (id: string) => void;
};

export function JournalTimeline({ entries, isLoading, onEdit, onDelete }: JournalTimelineProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-10" role="status" aria-label="Loading journal entries">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-teal-500 border-t-transparent" />
      </div>
    );
  }

  if (!entries.length) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-teal-200 bg-white/70 px-6 py-10 text-center text-slate-600">
        <BookOpen className="h-8 w-8 text-teal-500" />
        <p className="text-base font-semibold text-slate-700">Your journal is waiting.</p>
        <p className="text-sm text-slate-500">Capture today’s mood, gratitude, and reflections to build momentum.</p>
      </div>
    );
  }

  const sortedEntries = [...entries].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="space-y-4">
      {sortedEntries.map((entry, index) => (
        <JournalEntryCard key={entry.id} entry={entry} index={index} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}

