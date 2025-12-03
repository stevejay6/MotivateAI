"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { format } from "date-fns";
import { BookOpen, Calendar, Heart, Sparkles, TrendingUp } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { calculateStreak, getMostCommonMood } from "@/lib/journalUtils";
import {
  JournalEntry,
  createJournalEntry,
  deleteJournalEntry,
  listJournalEntries,
  updateJournalEntry,
} from "@/utils/journalApi";

type ViewMode = "timeline" | "stats";

const VIEW_OPTIONS: ViewMode[] = ["timeline", "stats"];

export default function JournalPage() {
  const clientRef = useRef<QueryClient>();
  if (!clientRef.current) {
    clientRef.current = new QueryClient();
  }
  return (
    <QueryClientProvider client={clientRef.current}>
      <JournalPageShell />
    </QueryClientProvider>
  );
}

function JournalPageShell() {
  const [view, setView] = useState<ViewMode>("timeline");
  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);

  const queryClient = useQueryClient();
  const { data: entries = [], isLoading } = useQuery({
    queryKey: ["journalEntries"],
    queryFn: listJournalEntries,
  });

  const today = format(new Date(), "yyyy-MM-dd");
  const todaysEntry = entries.find((entry) => entry.date === today);
  const ctaLabel = todaysEntry ? "Edit Today’s Entry" : "Today’s Entry";

  const mutationOptions = {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journalEntries"] });
      setShowForm(false);
      setEditingEntry(null);
    },
  };

  const createMutation = useMutation({
    mutationFn: createJournalEntry,
    ...mutationOptions,
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Omit<JournalEntry, "id">;
    }) => updateJournalEntry(id, payload),
    ...mutationOptions,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteJournalEntry,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["journalEntries"] }),
  });

  const handleFormSubmit = useCallback(
    (payload: Omit<JournalEntry, "id">) => {
      if (editingEntry) {
        updateMutation.mutate({ id: editingEntry.id, payload });
      } else {
        createMutation.mutate(payload);
      }
    },
    [createMutation, editingEntry, updateMutation]
  );

  const handleDeleteEntry = useCallback(
    (id: string) => {
      if (deleteMutation.isPending) return;
      if (!confirm("Delete this journal entry?")) return;
      deleteMutation.mutate(id);
    },
    [deleteMutation]
  );

  const handleStartEntry = () => {
    if (todaysEntry) {
      setEditingEntry(todaysEntry);
    } else {
      setEditingEntry(null);
    }
    setShowForm(true);
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-teal-50 to-green-50 px-4 py-12">
      <div className="pointer-events-none absolute -top-16 right-[-6rem] h-96 w-96 rounded-full bg-blue-200/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-10rem] left-[-8rem] h-[28rem] w-[28rem] rounded-full bg-green-200/20 blur-[140px]" />

      <div className="relative mx-auto flex max-w-5xl flex-col gap-10">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 rounded-3xl bg-white/70 p-8 shadow-lg backdrop-blur"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-blue-600">
            <BookOpen className="h-4 w-4" />
            Daily Reflection
          </div>
          <div>
            <h1 className="text-4xl font-semibold bg-gradient-to-r from-blue-600 via-teal-600 to-green-600 bg-clip-text text-transparent">
              Your Journal
            </h1>
            <p className="mt-2 text-sm text-blue-800">
              Toggle the view, review your recent entries, and capture how today felt.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex gap-2 rounded-full bg-white/60 p-1 backdrop-blur">
              {VIEW_OPTIONS.map((mode) => (
                <button
                  key={mode}
                  type="button"
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    view === mode
                      ? "bg-teal-500 text-white shadow"
                      : "bg-white/60 text-gray-600"
                  }`}
                  onClick={() => setView(mode)}
                >
                  {mode === "timeline" ? "Timeline" : "Insights"}
                </button>
              ))}
            </div>

            <button
              type="button"
              className="rounded-full bg-gradient-to-r from-teal-500 to-green-500 px-6 py-2 text-sm font-semibold text-white shadow-lg transition hover:opacity-90"
              onClick={handleStartEntry}
            >
              {ctaLabel}
            </button>
          </div>
        </motion.header>

        <section className="grid gap-6 lg:grid-cols-2">
          <AnimatePresence mode="wait">
            {showForm ? (
              <motion.div
                key="journal-form"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <JournalForm
                  today={today}
                  entry={editingEntry ?? null}
                  onSubmit={handleFormSubmit}
                  onCancel={() => {
                    setShowForm(false);
                    setEditingEntry(null);
                  }}
                  isSaving={isSaving}
                />
              </motion.div>
            ) : (
              <motion.div
                key="form-placeholder"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="rounded-3xl bg-white/80 p-6 text-blue-800 shadow-lg backdrop-blur"
              >
                <p className="text-sm font-semibold uppercase tracking-wide text-blue-400">
                  Journal Form Hidden
                </p>
                <p className="mt-3 text-sm">
                  Tap “{ctaLabel}” to open the entry form for today or jump into the list to edit an
                  earlier note.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {view === "timeline" ? (
              <motion.div
                key="timeline"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <JournalTimeline
                  entries={entries}
                  isLoading={isLoading}
                  onEdit={(entry) => {
                    setEditingEntry(entry);
                    setShowForm(true);
                  }}
                  onDelete={handleDeleteEntry}
                  deletingId={deleteMutation.variables}
                />
              </motion.div>
            ) : (
              <motion.div
                key="stats"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <JournalStats entries={entries} isLoading={isLoading} />
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>
    </div>
  );
}

type JournalFormProps = {
  today: string;
  entry: JournalEntry | null;
  onSubmit: (payload: Omit<JournalEntry, "id">) => void;
  onCancel: () => void;
  isSaving: boolean;
};

const MOODS: JournalEntry["mood"][] = ["amazing", "good", "okay", "challenging", "difficult"];

type FormState = {
  date: string;
  mood: JournalEntry["mood"];
  highlights?: string;
  reflection?: string;
};

function JournalForm({ today, entry, onSubmit, onCancel, isSaving }: JournalFormProps) {
  const [formState, setFormState] = useState<FormState>(() =>
    entry
      ? {
          date: entry.date,
          mood: entry.mood,
          highlights: entry.highlights ?? "",
          reflection: entry.reflection ?? "",
        }
      : {
          date: today,
          mood: "good",
          highlights: "",
          reflection: "",
        }
  );
  const [gratitudeInput, setGratitudeInput] = useState<string>(
    () => (entry?.gratitude ?? []).join(", ")
  );

  useEffect(() => {
    if (entry) {
      setFormState({
        date: entry.date,
        mood: entry.mood,
        highlights: entry.highlights ?? "",
        reflection: entry.reflection ?? "",
      });
      setGratitudeInput((entry.gratitude ?? []).join(", "));
    } else {
      setFormState({
        date: today,
        mood: "good",
        highlights: "",
        reflection: "",
      });
      setGratitudeInput("");
    }
  }, [entry, today]);

  const handleChange = (
    field: keyof FormState,
    value: string
  ) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const parsedGratitude = gratitudeInput
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    onSubmit({
      date: formState.date,
      mood: formState.mood,
      gratitude: parsedGratitude,
      highlights: formState.highlights?.trim(),
      reflection: formState.reflection?.trim(),
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl bg-white/80 p-6 text-blue-900 shadow-lg backdrop-blur"
    >
      <p className="text-sm font-semibold uppercase tracking-wide text-teal-500">
        {entry ? "Edit Entry" : "New Entry"}
      </p>

      <div className="mt-4 space-y-4">
        <label className="block text-sm font-semibold text-blue-700">
          Date
          <input
            type="date"
            value={formState.date}
            onChange={(event) => handleChange("date", event.target.value)}
            className="mt-1 w-full rounded-2xl border border-blue-200 px-3 py-2 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </label>

        <div className="space-y-2">
          <p className="text-sm font-semibold text-blue-700">Mood</p>
          <div className="grid gap-2 sm:grid-cols-3">
            {MOODS.map((mood) => {
              const active = formState.mood === mood;
              const styles = MOOD_STYLES[mood];
              return (
                <button
                  key={mood}
                  type="button"
                  data-testid={`mood-card-${mood}`}
                  onClick={() => handleChange("mood", mood)}
                  className={`rounded-2xl border px-3 py-2 text-xs font-semibold transition ${styles.cardBg} ${styles.cardText} ${
                    active ? "border-transparent ring-2 ring-teal-500" : "border-blue-100"
                  }`}
                >
                  {styles.label}
                </button>
              );
            })}
          </div>
        </div>

        <label className="block text-sm font-semibold text-blue-700">
          Gratitude (comma separated)
          <input
            type="text"
            value={gratitudeInput}
            onChange={(event) => setGratitudeInput(event.target.value)}
            className="mt-1 w-full rounded-2xl border border-blue-200 px-3 py-2 text-blue-900 focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
        </label>

        <label className="block text-sm font-semibold text-blue-700">
          Highlights
          <textarea
            rows={2}
            value={formState.highlights ?? ""}
            onChange={(event) => handleChange("highlights", event.target.value)}
            className="mt-1 w-full rounded-2xl border border-blue-200 px-3 py-2 text-blue-900 focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
        </label>

        <label className="block text-sm font-semibold text-blue-700">
          Reflection
          <textarea
            rows={3}
            value={formState.reflection ?? ""}
            onChange={(event) => handleChange("reflection", event.target.value)}
            className="mt-1 w-full rounded-2xl border border-blue-200 px-3 py-2 text-blue-900 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </label>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          type="submit"
          disabled={isSaving}
          className="w-full rounded-full bg-gradient-to-r from-green-500 to-teal-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition disabled:opacity-60"
        >
          {isSaving ? "Saving..." : entry ? "Update Entry" : "Save Entry"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="w-full rounded-full border border-blue-100 px-6 py-3 text-sm font-semibold text-blue-600 hover:bg-blue-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

type JournalTimelineProps = {
  entries: JournalEntry[];
  isLoading: boolean;
  onEdit: (entry: JournalEntry) => void;
  onDelete: (id: string) => void;
  deletingId: unknown;
};

function JournalTimeline({ entries, isLoading, onEdit, onDelete, deletingId }: JournalTimelineProps) {
  const sortedEntries = useMemo(
    () => [...entries].sort((a, b) => (a.date < b.date ? 1 : -1)),
    [entries]
  );

  return (
    <div data-testid="journal-timeline" className="rounded-3xl bg-white/80 p-6 shadow-lg backdrop-blur">
      <p className="text-sm font-semibold uppercase tracking-wide text-blue-500">Timeline</p>
      {isLoading ? (
        <div className="mt-6 flex items-center gap-3 text-teal-700">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-teal-500 border-t-transparent" />
          <span className="text-sm">Loading entries...</span>
        </div>
      ) : sortedEntries.length === 0 ? (
        <div className="mt-6 flex flex-col items-center gap-2 rounded-2xl border border-blue-100 bg-blue-50/80 p-6 text-center text-blue-700">
          <BookOpen className="h-8 w-8 text-blue-400" />
          <p className="text-sm font-semibold">Your journal is waiting.</p>
          <p className="text-xs">Capture today’s thoughts to begin the timeline.</p>
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {sortedEntries.map((entry, index) => (
            <JournalEntryCard
              key={entry.id}
              entry={entry}
              index={index}
              onEdit={() => onEdit(entry)}
              onDelete={() => onDelete(entry.id)}
              isDeleting={deletingId === entry.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}

type JournalStatsProps = {
  entries: JournalEntry[];
  isLoading: boolean;
};

function JournalStats({ entries, isLoading }: JournalStatsProps) {
  const stats = useMemo(() => {
    const totals: Record<JournalEntry["mood"], number> = {
      amazing: 0,
      good: 0,
      okay: 0,
      challenging: 0,
      difficult: 0,
    };
    const gratitudeTags: string[] = [];

    entries.forEach((entry) => {
      totals[entry.mood] += 1;
      gratitudeTags.push(...(entry.gratitude ?? []));
    });

    return {
      totals,
      streak: calculateStreak(entries),
      mostCommonMood: getMostCommonMood(entries),
      gratitudeTags: gratitudeTags.slice(0, 30),
    };
  }, [entries]);

  return (
    <div data-testid="journal-stats" className="rounded-3xl bg-white/80 p-6 shadow-lg backdrop-blur">
      <p className="text-sm font-semibold uppercase tracking-wide text-teal-500">Insights</p>
      {isLoading ? (
        <p className="mt-4 text-sm text-teal-700">Loading insights...</p>
      ) : (
        <div className="mt-4 space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <StatsCard
              icon={<Calendar className="h-6 w-6 text-teal-500" />}
              label="Total Entries"
              value={entries.length.toString()}
              className="bg-teal-50 text-teal-900"
              testId="stats-total-entries"
            />
            <StatsCard
              icon={<TrendingUp className="h-6 w-6 text-blue-500" />}
              label="Current Streak"
              value={`${stats.streak} day${stats.streak === 1 ? "" : "s"}`}
              className="bg-blue-50 text-blue-900"
              testId="stats-current-streak"
            />
            <StatsCard
              icon={<MoodIcon mood={stats.mostCommonMood} />}
              label="Most Common Mood"
              value={stats.mostCommonMood ? MOOD_STYLES[stats.mostCommonMood].label : "—"}
              className="bg-amber-50 text-amber-900"
              testId="stats-most-common"
            />
          </div>

          <div className="rounded-2xl border border-teal-100 bg-white/80 p-4">
            <p className="text-sm font-semibold uppercase tracking-wide text-teal-500">
              Mood distribution
            </p>
            <div className="mt-3 space-y-3">
              {MOODS.map((mood) => {
                const count = stats.totals[mood];
                const percentage =
                  entries.length === 0 ? 0 : Math.round((count / entries.length) * 100);
                return (
                  <div key={`mood-bar-${mood}`}>
                    <div className="flex items-center justify-between text-xs font-semibold text-teal-700">
                      <span>{MOOD_STYLES[mood].label}</span>
                      <span>{percentage}%</span>
                    </div>
                    <div className="mt-1 h-2 rounded-full bg-teal-100">
                      <motion.div
                        data-testid={`mood-bar-${mood}`}
                        data-percentage={percentage}
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.6 }}
                        className="h-full rounded-full bg-teal-500"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-teal-100 bg-white/80 p-4">
            <p className="text-sm font-semibold uppercase tracking-wide text-teal-500">
              Gratitude cloud
            </p>
            {stats.gratitudeTags.length === 0 ? (
              <p className="mt-3 text-sm text-teal-700">Add gratitude notes to see them here.</p>
            ) : (
              <div className="mt-3 flex flex-wrap gap-2">
                {stats.gratitudeTags.map((tag, idx) => (
                  <span
                    key={`gratitude-${idx}-${tag}`}
                    className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-gray-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

type StatsCardProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
  className: string;
  testId?: string;
};

function StatsCard({ icon, label, value, className, testId }: StatsCardProps) {
  return (
    <div data-testid={testId} className={`rounded-2xl p-4 shadow-sm ${className}`}>
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-white/70 p-2">{icon}</div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );
}

function MoodIcon({ mood }: { mood: JournalEntry["mood"] | null }) {
  if (!mood) {
    return <Heart className="h-6 w-6 text-gray-400" />;
  }
  return <Heart data-testid="mood-icon" className={`h-6 w-6 ${MOOD_STYLES[mood].icon}`} />;
}

type JournalEntryCardProps = {
  entry: JournalEntry;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
  isDeleting: boolean;
};

const MOOD_STYLES: Record<
  JournalEntry["mood"],
  { label: string; badge: string; cardBg: string; cardText: string; icon: string }
> = {
  amazing: {
    label: "Amazing",
    badge: "bg-green-600",
    cardBg: "bg-yellow-50",
    cardText: "text-yellow-500",
    icon: "text-yellow-500",
  },
  good: {
    label: "Good",
    badge: "bg-teal-500",
    cardBg: "bg-green-50",
    cardText: "text-green-500",
    icon: "text-green-500",
  },
  okay: {
    label: "Okay",
    badge: "bg-blue-500",
    cardBg: "bg-blue-50",
    cardText: "text-blue-500",
    icon: "text-blue-500",
  },
  challenging: {
    label: "Challenging",
    badge: "bg-amber-500",
    cardBg: "bg-amber-50",
    cardText: "text-amber-500",
    icon: "text-gray-500",
  },
  difficult: {
    label: "Difficult",
    badge: "bg-rose-500",
    cardBg: "bg-purple-50",
    cardText: "text-purple-500",
    icon: "text-purple-500",
  },
};

function JournalEntryCard({ entry, index, onEdit, onDelete, isDeleting }: JournalEntryCardProps) {
  const mood = MOOD_STYLES[entry.mood];
  const formattedDate = format(new Date(entry.date), "PPP");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="rounded-2xl border border-blue-100 bg-white p-5 text-blue-900 shadow-sm"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-blue-50 pb-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-400">
            {formattedDate}
          </p>
          <p className="text-base font-semibold">
            {entry.highlights?.trim() || "Untitled entry"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold text-white ${mood.badge}`}
          >
            <span className="h-2 w-2 rounded-full bg-white/80" />
            {mood.label}
          </span>
          <button
            type="button"
            onClick={onEdit}
            className="rounded-full border border-blue-100 px-3 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-50"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={onDelete}
            disabled={isDeleting}
            className="rounded-full border border-teal-100 px-3 py-1 text-xs font-semibold text-teal-600 hover:bg-teal-50 disabled:opacity-60"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>

      {entry.gratitude && entry.gratitude.length > 0 && (
        <div className="mt-4 rounded-2xl border border-teal-100 bg-teal-50 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-teal-700">
            <Heart className="h-4 w-4 text-teal-500" />
            Gratitude
          </div>
          <ul className="mt-2 list-disc pl-5 text-sm text-teal-800">
            {entry.gratitude.map((item, idx) => (
              <li key={`${entry.id}-gratitude-${idx}`}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {entry.highlights && (
        <div className="mt-4 rounded-2xl border border-amber-100 bg-amber-50 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-amber-700">
            <Sparkles className="h-4 w-4 text-amber-500" />
            Highlights
          </div>
          <p className="mt-2 text-sm text-amber-800">{entry.highlights}</p>
        </div>
      )}

      {entry.reflection && (
        <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50 p-4">
          <p className="text-sm font-semibold text-blue-700">Reflection</p>
          <p className="mt-2 text-sm text-blue-800">{entry.reflection}</p>
        </div>
      )}
    </motion.div>
  );
}



