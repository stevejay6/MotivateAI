import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { format } from "date-fns";

import type { JournalEntry } from "@/app/ai-kick-in-the-pants/types";
import { JournalTimeline } from "@/components/JournalTimeline";

const baseEntries: JournalEntry[] = [
  {
    id: "entry-2",
    date: "2025-02-01",
    mood: "amazing",
    gratitude: ["coffee"],
    highlights: "Big win",
    reflection: "Feeling energized",
  },
  {
    id: "entry-1",
    date: "2025-01-15",
    mood: "good",
    gratitude: ["team"],
    highlights: "Great standup",
    reflection: "Optimistic",
  },
];

describe("JournalTimeline", () => {
  it("shows spinner when loading", () => {
    render(<JournalTimeline entries={[]} isLoading onEdit={jest.fn()} onDelete={jest.fn()} />);
    expect(screen.getByRole("status", { name: /loading/i })).toBeInTheDocument();
  });

  it("shows empty state when there are no entries", () => {
    render(<JournalTimeline entries={[]} isLoading={false} onEdit={jest.fn()} onDelete={jest.fn()} />);
    expect(screen.getByText("Your journal is waiting.")).toBeInTheDocument();
  });

  it("renders entries sorted by date with mood styles", () => {
    render(<JournalTimeline entries={baseEntries} isLoading={false} onEdit={jest.fn()} onDelete={jest.fn()} />);

    const cards = screen.getAllByTestId("journal-entry-card");
    expect(cards).toHaveLength(2);
    const expectedFirstDate = format(new Date("2025-02-01"), "PP");
    expect(cards[0]).toHaveTextContent(expectedFirstDate);

    const moodPill = within(cards[0]).getByTestId("mood-pill-amazing");
    expect(moodPill).toHaveClass("text-yellow-500");
  });

  it("fires edit and delete callbacks", async () => {
    const onEdit = jest.fn();
    const onDelete = jest.fn();
    render(<JournalTimeline entries={baseEntries} isLoading={false} onEdit={onEdit} onDelete={onDelete} />);

    const cards = screen.getAllByTestId("journal-entry-card");
    const firstCard = cards[0];

    await userEvent.click(within(firstCard).getByLabelText("Edit entry"));
    expect(onEdit).toHaveBeenCalledWith(baseEntries[0]);

    await userEvent.click(within(firstCard).getByLabelText("Delete entry"));
    expect(onDelete).toHaveBeenCalledWith(baseEntries[0].id);
  });
});

