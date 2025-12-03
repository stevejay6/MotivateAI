import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import AIJournalPage from "@/app/ai-journal/page";

describe("AIJournalPage", () => {
  const originalScrollIntoView = window.HTMLElement.prototype.scrollIntoView;
  const originalFetch = global.fetch;

  beforeEach(() => {
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
    window.HTMLElement.prototype.scrollIntoView = originalScrollIntoView;
    global.fetch = originalFetch;
  });

  it("completes the journaling session after eight AI reflections without errors", async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ message: "Thank you for sharing more. What else is present?" }),
    } as Response);
    global.fetch = fetchMock as typeof global.fetch;

    render(<AIJournalPage />);

    for (let index = 0; index < 8; index += 1) {
      const textarea = screen.getByLabelText("Journal entry");
      await userEvent.type(textarea, `Reflection ${index + 1}`);
      await userEvent.click(screen.getByRole("button", { name: /send reflection/i }));

      await waitFor(() => {
        expect(fetchMock).toHaveBeenCalledTimes(index + 1);
      });
    }

    await waitFor(() => {
      expect(
        screen.getByText("Your 8-turn reflection is complete. See you tomorrow. 🌙")
      ).toBeInTheDocument();
    });

    expect(screen.getByRole("button", { name: /start new session/i })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /send reflection/i })).not.toBeInTheDocument();
  });
});


