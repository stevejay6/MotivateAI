import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { format } from "date-fns";

import AIKickInThePantsPage from "@/app/ai-kick-in-the-pants/page";
import type { JournalEntry } from "@/app/ai-kick-in-the-pants/types";
import SiteNavDropdown from "@/components/SiteNavDropdown";
import { listJournalEntries } from "@/lib/aiKickJournal";

jest.mock("@/lib/aiKickJournal", () => ({
  listJournalEntries: jest.fn(),
  createJournalEntry: jest.fn(),
  updateJournalEntry: jest.fn(),
  deleteJournalEntry: jest.fn(),
}));

const mockedList = listJournalEntries as jest.MockedFunction<typeof listJournalEntries>;

describe("AIKickInThePantsPage", () => {
  beforeEach(() => {
    mockedList.mockResolvedValue([]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the main title", async () => {
    render(<AIKickInThePantsPage />);
    expect(await screen.findByRole("heading", { name: "AI Kick in the Pants" })).toBeInTheDocument();
  });

  it("shows the navigation link for the page", async () => {
    render(<SiteNavDropdown />);
    const toggleButton = screen.getByRole("button", { name: /navigate/i });
    await userEvent.click(toggleButton);

    const link = screen.getByRole("link", { name: "AI Kick in the Pants" });
    expect(link).toHaveAttribute("href", "/ai-kick-in-the-pants");
  });

  it("shows the today's entry button when no entry exists for today", async () => {
    mockedList.mockResolvedValue([]);
    render(<AIKickInThePantsPage />);

    expect(await screen.findByRole("button", { name: "Today's Entry" })).toBeInTheDocument();
  });

  it("shows the edit today's entry button when an entry exists for today", async () => {
    const today = format(new Date(), "yyyy-MM-dd");
    const entry: JournalEntry = {
      id: "today-entry",
      date: today,
      mood: "good",
    };
    mockedList.mockResolvedValue([entry]);

    render(<AIKickInThePantsPage />);
    expect(await screen.findByRole("button", { name: "Edit Today's Entry" })).toBeInTheDocument();
  });

  it("toggles between timeline and insights views", async () => {
    render(<AIKickInThePantsPage />);

    expect(await screen.findByText("Your journal is waiting.")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: /insights/i }));
    expect(await screen.findByText("Total Entries")).toBeInTheDocument();
    expect(screen.queryByText("Your journal is waiting.")).not.toBeInTheDocument();
  });

  it("shows and hides the journal form when toggled", async () => {
    render(<AIKickInThePantsPage />);

    await userEvent.click(await screen.findByRole("button", { name: "Today's Entry" }));
    expect(await screen.findByRole("button", { name: "Save Entry" })).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    await waitFor(() => {
      expect(screen.queryByRole("button", { name: "Save Entry" })).not.toBeInTheDocument();
    });
  });
});

