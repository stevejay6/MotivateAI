import { format } from "date-fns";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit2, Heart, Sparkles, Trash2 } from "lucide-react";

import type { JournalEntry } from "@/app/ai-kick-in-the-pants/types";
import { moodIcons } from "@/lib/moodIcons";

type JournalEntryCardProps = {
  entry: JournalEntry;
  index: number;
  onEdit: (entry: JournalEntry) => void;
  onDelete: (id: string) => void;
};

export function JournalEntryCard({ entry, index, onEdit, onDelete }: JournalEntryCardProps) {
  const moodConfig = moodIcons[entry.mood];
  const MoodIcon = moodConfig.icon;

  return (
    <motion.div
      data-testid="journal-entry-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className="space-y-4 rounded-2xl border border-blue-100 bg-white/95 p-5 shadow-md">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">{format(new Date(entry.date), "PP")}</p>
            <div
              data-testid={`mood-pill-${entry.mood}`}
              className={`mt-2 inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold capitalize ${moodConfig.bg} ${moodConfig.color}`}
            >
              <MoodIcon className="h-4 w-4" />
              {entry.mood}
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-blue-600 hover:text-blue-700"
              onClick={() => onEdit(entry)}
              aria-label="Edit entry"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-rose-600 hover:text-rose-700"
              onClick={() => onDelete(entry.id)}
              aria-label="Delete entry"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {entry.gratitude && entry.gratitude.length > 0 && (
          <div className="rounded-lg bg-teal-50 p-4">
            <div className="mb-2 flex items-center gap-2 text-teal-700">
              <Heart className="h-4 w-4" />
              <p className="text-sm font-semibold">Gratitude</p>
            </div>
            <ul className="list-disc space-y-1 pl-5 text-sm text-teal-900">
              {entry.gratitude.map((item, idx) => (
                <li key={`${entry.id}-gratitude-${idx}`}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {entry.highlights && (
          <div className="flex items-start gap-3 rounded-lg border border-yellow-100 bg-yellow-50/80 p-4 text-sm text-slate-800">
            <Sparkles className="h-4 w-4 text-yellow-500" />
            <p>{entry.highlights}</p>
          </div>
        )}

        {entry.reflection && (
          <div className="rounded-lg bg-blue-50 p-4 text-sm text-slate-700">
            <p>{entry.reflection}</p>
          </div>
        )}
      </Card>
    </motion.div>
  );
}

