import { calculateStreak, getMostCommonMood } from "@/lib/journalUtils";
import { JournalEntry } from "@/utils/journalApi";

const sampleEntries: JournalEntry[] = [
  { id: "1", date: "2025-11-30", mood: "good" },
  { id: "2", date: "2025-11-29", mood: "amazing" },
  { id: "3", date: "2025-11-27", mood: "good" },
] as JournalEntry[];

describe("journal utils", () => {
  it("calculates streak for consecutive days", () => {
    const consecutive: JournalEntry[] = [
      { id: "1", date: "2025-11-30", mood: "good" },
      { id: "2", date: "2025-11-29", mood: "good" },
      { id: "3", date: "2025-11-28", mood: "good" },
    ] as JournalEntry[];
    expect(calculateStreak(consecutive)).toBe(3);
  });

  it("breaks streak on non-consecutive day", () => {
    expect(calculateStreak(sampleEntries)).toBe(2);
  });

  it("finds most common mood", () => {
    expect(getMostCommonMood(sampleEntries)).toBe("good");
  });

  it("returns null when no entries", () => {
    expect(getMostCommonMood([])).toBeNull();
    expect(calculateStreak([])).toBe(0);
  });
});


