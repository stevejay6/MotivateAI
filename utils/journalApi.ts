export type JournalEntry = {
  id: string;
  date: string; // YYYY-MM-DD
  mood: "amazing" | "good" | "okay" | "challenging" | "difficult";
  gratitude?: string[];
  highlights?: string;
  reflection?: string;
};

type JournalEntryInput = Omit<JournalEntry, "id">;

let journalStore: JournalEntry[] = [
  {
    id: "journal-1",
    date: "2025-11-28",
    mood: "good",
    gratitude: ["sunrise", "tea break"],
    highlights: "Wrapped the affirmations layout.",
    reflection: "Slow mornings help me stay grounded.",
  },
  {
    id: "journal-2",
    date: "2025-11-27",
    mood: "okay",
    gratitude: ["walk outside"],
    highlights: "Reviewed new navigation work.",
    reflection: "Momentum builds when I focus on one tiny task.",
  },
];

const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

export async function listJournalEntries(): Promise<JournalEntry[]> {
  await delay();
  return [...journalStore].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function createJournalEntry(
  input: JournalEntryInput
): Promise<JournalEntry> {
  await delay();
  const entry: JournalEntry = {
    id: crypto.randomUUID?.() ?? `journal-${Date.now()}`,
    ...input,
  };
  journalStore = [entry, ...journalStore];
  return entry;
}

export async function updateJournalEntry(
  id: string,
  input: JournalEntryInput
): Promise<JournalEntry> {
  await delay();
  let updated: JournalEntry | null = null;
  journalStore = journalStore.map((entry) => {
    if (entry.id === id) {
      updated = { ...entry, ...input };
      return updated;
    }
    return entry;
  });
  if (!updated) {
    throw new Error("Journal entry not found");
  }
  return updated;
}

export async function deleteJournalEntry(id: string): Promise<void> {
  await delay();
  journalStore = journalStore.filter((entry) => entry.id !== id);
}



