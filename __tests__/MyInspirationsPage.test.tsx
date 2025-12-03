import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import MyInspirationsPage from "@/app/my-inspirations/page";
import {
  listInspirations,
  createInspiration,
  updateInspiration,
  deleteInspiration,
} from "@/utils/customInspirationsApi";

jest.mock("@/utils/customInspirationsApi", () => ({
  listInspirations: jest.fn(),
  createInspiration: jest.fn(),
  updateInspiration: jest.fn(),
  deleteInspiration: jest.fn(),
}));

const mockedListInspirations = listInspirations as jest.MockedFunction<typeof listInspirations>;
const mockedCreateInspiration = createInspiration as jest.MockedFunction<typeof createInspiration>;
const mockedUpdateInspiration = updateInspiration as jest.MockedFunction<typeof updateInspiration>;
const mockedDeleteInspiration = deleteInspiration as jest.MockedFunction<typeof deleteInspiration>;

describe("MyInspirationsPage", () => {
  beforeEach(() => {
    mockedListInspirations.mockResolvedValue([
      {
        id: "demo",
        think: "Lead with generosity.",
        author: "Mentor",
        feel: "Warm and open",
        do: "Send a kind note",
      },
    ]);
    mockedCreateInspiration.mockResolvedValue({
      id: "created",
      think: "New idea",
      author: "You",
      feel: "Joyful",
      do: "Share gratitude",
    });
    mockedUpdateInspiration.mockResolvedValue({
      id: "demo",
      think: "Updated idea",
      author: "Mentor",
      feel: "Warm and open",
      do: "Send a kind note",
    });
    mockedDeleteInspiration.mockResolvedValue();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the saved inspirations and opens the form when requested", async () => {
    render(<MyInspirationsPage />);

    await waitFor(() => {
      expect(mockedListInspirations).toHaveBeenCalledTimes(1);
    });

    expect(await screen.findByText("Lead with generosity.")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "My Inspirations" })).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /add new inspiration/i }));

    expect(await screen.findByRole("heading", { name: "Capture Inspiration" })).toBeInTheDocument();
  });
});


