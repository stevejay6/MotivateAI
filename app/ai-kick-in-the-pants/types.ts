export type Mood = "amazing" | "good" | "okay" | "challenging" | "difficult";

export type JournalEntry = {
  id: string;
  date: string; // YYYY-MM-DD
  mood: Mood;
  gratitude?: string[];
  reflection?: string;
  highlights?: string;
};

