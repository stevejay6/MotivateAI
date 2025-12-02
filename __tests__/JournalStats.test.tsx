import { render, screen } from "@testing-library/react";
import { format, subDays } from "date-fns";

import type { JournalEntry } from "@/app/ai-kick-in-the-pants/types";
import { JournalStats } from "@/components/JournalStats";

describe("JournalStats", () => {
  it("renders zero states when no entries exist", () => {
    render(<JournalStats entries={[]} isLoading={false} />);

    expect(screen.getByText("0-day streak")).toBeInTheDocument();
    expect(screen.getByText("No entries yet")).toBeInTheDocument();
    expect(screen.getByText(/Share your gratitude/)).toBeInTheDocument();

    const moodBars = screen.getAllByTestId("mood-bar");
    expect(moodBars).toHaveLength(5);
  });

  it("displays stats for existing entries", () => {
    const today = format(new Date(), "yyyy-MM-dd");
    const yesterday = format(subDays(new Date(), 1), "yyyy-MM-dd");
    const threeDaysAgo = format(subDays(new Date(), 3), "yyyy-MM-dd");

    const entries: JournalEntry[] = [
      {
        id: "1",
        date: today,
        mood: "good",
        gratitude: ["coffee", "sunshine"],
        highlights: "Launch day",
        reflection: "Proud of the work",
      },
      {
        id: "2",
        date: yesterday,
        mood: "good",
        gratitude: ["team"],
        highlights: "Great standup",
        reflection: "Motivated",
      },
      {
        id: "3",
        date: threeDaysAgo,
        mood: "amazing",
        gratitude: ["family"],
        highlights: "Celebrated together",
        reflection: "Feeling loved",
      },
    ];

    render(<JournalStats entries={entries} isLoading={false} />);

    expect(screen.getByText("3")).toBeInTheDocument(); // total entries
    expect(screen.getByText("2-day streak")).toBeInTheDocument();
    expect(screen.getAllByText(/good/i).length).toBeGreaterThan(0); // most common mood

    const moodBars = screen.getAllByTestId("mood-bar");
    expect(moodBars).toHaveLength(5);

    const goodBar = moodBars.find((bar) => bar.getAttribute("data-mood") === "good");
    const difficultBar = moodBars.find((bar) => bar.getAttribute("data-mood") === "difficult");
    expect(goodBar?.querySelector("[data-width]")?.getAttribute("data-width")).toBe("100");
    expect(difficultBar?.querySelector("[data-width]")?.getAttribute("data-width")).toBe("0");
  });
});
