import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import JournalPage from "@/app/journal/page";
import {
  listJournalEntries,
  createJournalEntry,
  updateJournalEntry,
  deleteJournalEntry,
} from "@/utils/journalApi";

jest.mock("@/utils/journalApi", () => ({
  listJournalEntries: jest.fn(),
  createJournalEntry: jest.fn(() =>
    Promise.resolve({
      id: "mock-create",
      date: "2025-11-30",
      mood: "good",
      gratitude: [],
      highlights: "",
      reflection: "",
    })
  ),
  updateJournalEntry: jest.fn(() =>
    Promise.resolve({
      id: "mock-update",
      date: "2025-11-30",
      mood: "good",
      gratitude: [],
      highlights: "",
      reflection: "",
    })
  ),
  deleteJournalEntry: jest.fn(() => Promise.resolve()),
}));

const mockedList = listJournalEntries as jest.MockedFunction<typeof listJournalEntries>;

describe("JournalPage", () => {
  let dateSpy: jest.SpyInstance<number, []>;

  beforeEach(() => {
    (createJournalEntry as jest.MockedFunction<typeof createJournalEntry>).mockResolvedValue({
      id: "mock",
      date: "2025-11-30",
      mood: "good",
      gratitude: [],
      highlights: "",
      reflection: "",
    });
    (updateJournalEntry as jest.MockedFunction<typeof updateJournalEntry>).mockResolvedValue({
      id: "mock",
      date: "2025-11-30",
      mood: "good",
      gratitude: [],
      highlights: "",
      reflection: "",
    });
    (deleteJournalEntry as jest.MockedFunction<typeof deleteJournalEntry>).mockResolvedValue();
    dateSpy = jest.spyOn(Date, "now").mockReturnValue(new Date("2025-11-30T00:00:00Z").valueOf());
  });

  afterEach(() => {
    dateSpy.mockRestore();
    jest.clearAllMocks();
  });

  it("renders gradient header text", async () => {
    mockedList.mockResolvedValue([]);
    render(<JournalPage />);

    const heading = await screen.findByRole("heading", { name: "Your Journal" });
    expect(heading).toHaveClass("bg-gradient-to-r");
    expect(heading).toHaveClass("from-blue-600");
    expect(heading).toHaveClass("via-teal-600");
    expect(heading).toHaveClass("to-green-600");
  });

  it("toggles between Timeline and Insights views", async () => {
    mockedList.mockResolvedValue([]);
    render(<JournalPage />);
    await waitFor(() => expect(mockedList).toHaveBeenCalled());
    expect(screen.getByTestId("journal-timeline")).toBeInTheDocument();

    const insightsButton = screen.getByRole("button", { name: "Insights" });
    await userEvent.click(insightsButton);

    await waitFor(() => {
      expect(screen.getByTestId("journal-stats")).toBeInTheDocument();
    });
  });

  it("shows 'Today’s Entry' when no entry exists for today", async () => {
    mockedList.mockResolvedValue([]);
    render(<JournalPage />);

    const cta = await screen.findByRole("button", { name: "Today’s Entry" });
    expect(cta).toBeInTheDocument();
  });

  it("shows 'Edit Today’s Entry' when an entry exists for today", async () => {
    mockedList.mockResolvedValue([
      {
        id: "entry-1",
        date: "2025-11-30",
        mood: "good",
        gratitude: [],
        highlights: "",
        reflection: "",
      },
    ]);
    render(<JournalPage />);

    const cta = await screen.findByRole("button", { name: "Edit Today’s Entry" });
    expect(cta).toBeInTheDocument();
  });
});


