import type { JournalEntry } from "@/app/ai-kick-in-the-pants/types";

let journalEntries: JournalEntry[] = [];

const generateId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2);
};

export async function listJournalEntries(): Promise<JournalEntry[]> {
  return journalEntries;
}

export async function createJournalEntry(data: Omit<JournalEntry, "id">): Promise<JournalEntry> {
  const newEntry: JournalEntry = { ...data, id: generateId() };
  journalEntries = [newEntry, ...journalEntries];
  return newEntry;
}

export async function updateJournalEntry(id: string, data: Partial<JournalEntry>): Promise<JournalEntry> {
  journalEntries = journalEntries.map((entry) => (entry.id === id ? { ...entry, ...data } : entry));
  const updated = journalEntries.find((entry) => entry.id === id);
  if (!updated) {
    throw new Error("Entry not found");
  }
  return updated;
}

export async function deleteJournalEntry(id: string): Promise<void> {
  journalEntries = journalEntries.filter((entry) => entry.id !== id);
}

