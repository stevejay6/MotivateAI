import { render, screen } from "@testing-library/react";
import { JournalStats } from "@/app/journal/page";
import { JournalEntry } from "@/utils/journalApi";

const entries: JournalEntry[] = [
  {
    id: "1",
    date: "2025-11-30",
    mood: "good",
    gratitude: ["focus"],
    highlights: "Deep work",
    reflection: "Flow day",
  },
  {
    id: "2",
    date: "2025-11-29",
    mood: "good",
    gratitude: ["family"],
    highlights: "Call home",
    reflection: "Rested",
  },
  {
    id: "3",
    date: "2025-11-28",
    mood: "amazing",
    gratitude: ["team"],
    highlights: "Launch day",
    reflection: "Grateful",
  },
];

describe("JournalStats", () => {
  it("shows total entries count", () => {
    render(<JournalStats entries={entries} isLoading={false} />);
    const totalCard = screen.getByTestId("stats-total-entries");
    expect(totalCard).toHaveTextContent("3");
  });

  it("renders most common mood icon with correct color", () => {
    render(<JournalStats entries={entries} isLoading={false} />);
    const icon = screen.getByTestId("mood-icon");
    expect(icon).toHaveClass("text-green-500");
  });

  it("exposes mood distribution percentages", () => {
    render(<JournalStats entries={entries} isLoading={false} />);
    const bar = screen.getByTestId("mood-bar-good");
    expect(bar).toHaveAttribute("data-percentage", "67");
  });
});


