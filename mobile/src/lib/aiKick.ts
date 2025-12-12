import { format } from "date-fns";

export type JournalEntry = {
  id: string;
  date: string;
  title: string;
  note: string;
};

let store: JournalEntry[] = [];

const uid = () => Math.random().toString(36).slice(2);

export function listEntries(): JournalEntry[] {
  return [...store];
}

export function upsertEntry(data: Omit<JournalEntry, "id"> & { id?: string }): JournalEntry {
  const id = data.id ?? uid();
  const existing = store.find((e) => e.id === id);
  const entry: JournalEntry = {
    id,
    date: data.date || format(new Date(), "yyyy-MM-dd"),
    title: data.title,
    note: data.note,
  };
  if (existing) {
    store = store.map((e) => (e.id === id ? entry : e));
  } else {
    store = [entry, ...store];
  }
  return entry;
}

export function deleteEntry(id: string) {
  store = store.filter((e) => e.id !== id);
}

