'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen, LineChart } from 'lucide-react';
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { JournalForm } from '@/components/JournalForm';
import { JournalTimeline } from '@/components/JournalTimeline';
import { JournalStats } from '@/components/JournalStats';
import type { JournalEntry } from '@/app/ai-kick-in-the-pants/types';
import {
  createJournalEntry,
  deleteJournalEntry,
  listJournalEntries,
  updateJournalEntry,
} from '@/lib/aiKickJournal';

const VIEW_TABS = [
  { id: 'timeline', label: 'Timeline', icon: BookOpen },
  { id: 'stats', label: 'Insights', icon: LineChart },
];

export default function AIKickInThePantsPage() {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <AIKickInThePantsContent />
    </QueryClientProvider>
  );
}

function AIKickInThePantsContent() {
  const [view, setView] = useState<'timeline' | 'stats'>('timeline');
  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  const queryClient = useQueryClient();

  const { data: entries = [], isLoading: entriesLoading } = useQuery({
    queryKey: ['journalEntries'],
    queryFn: listJournalEntries,
  });

  const createEntryMutation = useMutation({
    mutationFn: createJournalEntry,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['journalEntries'] }),
  });

  const updateEntryMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<JournalEntry> }) =>
      updateJournalEntry(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['journalEntries'] }),
  });

  const deleteEntryMutation = useMutation({
    mutationFn: deleteJournalEntry,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['journalEntries'] }),
  });

  const today = format(new Date(), 'yyyy-MM-dd');
  const todayEntry = entries.find((entry) => entry.date === today) ?? null;
  const entryCtaLabel = todayEntry ? "Edit Today's Entry" : "Today's Entry";
  const isMutating = createEntryMutation.isPending || updateEntryMutation.isPending || deleteEntryMutation.isPending;

  const handleEntryButtonClick = () => {
    setEditingEntry(todayEntry ?? null);
    setShowForm(true);
  };

  const handleEditEntry = (entry: JournalEntry) => {
    setEditingEntry(entry);
    setShowForm(true);
  };

  const handleDeleteEntry = async (id: string) => {
    try {
      await deleteEntryMutation.mutateAsync(id);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFormSubmit = async (data: Omit<JournalEntry, 'id'>) => {
    if (editingEntry) {
      try {
        await updateEntryMutation.mutateAsync({ id: editingEntry.id, data });
      } catch (error) {
        console.error(error);
        return;
      }
    } else {
      try {
        await createEntryMutation.mutateAsync(data);
      } catch (error) {
        console.error(error);
        return;
      }
    }
    setShowForm(false);
    setEditingEntry(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingEntry(null);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-green-50">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute right-[-5rem] top-[-5rem] h-64 w-64 rounded-full bg-blue-200/20 blur-3xl" />
        <div className="absolute bottom-[-5rem] left-[-5rem] h-72 w-72 rounded-full bg-green-200/20 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-4xl flex-col gap-6 px-4 py-10">
        <motion.div className="space-y-4 text-center sm:text-left" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="inline-flex items-center justify-center gap-2 rounded-full border border-blue-100 bg-white/80 px-4 py-1 text-sm font-medium text-blue-700 shadow-sm">
            <BookOpen className="h-4 w-4" />
            <span>Daily Reflection</span>
          </div>

          <div>
            <h1 className="text-4xl font-bold leading-tight text-balance bg-gradient-to-r from-blue-600 via-teal-600 to-green-600 bg-clip-text text-transparent">
              AI Kick in the Pants
            </h1>
            <p className="mt-2 text-base text-slate-700">
              A quick daily push to reflect, reset, and refocus your energy.
            </p>
          </div>
        </motion.div>

        <motion.div
          className="flex flex-col gap-6"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="mx-auto flex w-fit flex-wrap items-center justify-center gap-3 text-center sm:justify-between">
            <div className="flex items-center gap-2 rounded-full bg-white/60 p-1 text-sm font-medium text-slate-700 shadow-lg backdrop-blur">
              {VIEW_TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = view === tab.id;
                return (
                  <Button
                    key={tab.id}
                    variant="ghost"
                    className={`flex items-center gap-2 rounded-full px-4 py-2 transition-all ${
                      isActive ? 'bg-teal-500 text-white shadow-sm' : 'bg-white/60 text-gray-700 hover:bg-white/80'
                    }`}
                    onClick={() => setView(tab.id as 'timeline' | 'stats')}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </Button>
                );
              })}
            </div>

            <Button
              variant="outline"
              className="rounded-full border-blue-100 bg-white/80 text-blue-700 shadow-sm hover:bg-white"
              onClick={handleEntryButtonClick}
              disabled={entriesLoading || isMutating}
            >
              {entryCtaLabel}
            </Button>
          </div>

          <div className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-xl backdrop-blur">
            <AnimatePresence mode="wait">
              {view === 'timeline' ? (
                <motion.div
                  key="timeline-view"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <JournalTimeline
                    entries={entries}
                    isLoading={entriesLoading}
                    onEdit={handleEditEntry}
                    onDelete={handleDeleteEntry}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="insights-view"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <JournalStats entries={entries} isLoading={entriesLoading} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {showForm && (
              <motion.div
                key="journal-form"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
              >
                <JournalForm
                  entry={editingEntry}
                  onSubmit={handleFormSubmit}
                  onCancel={handleCancel}
                  isLoading={isMutating}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}

