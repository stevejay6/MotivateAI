import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { JournalForm } from "@/app/journal/page";
import { JournalEntry } from "@/utils/journalApi";

const baseEntry: JournalEntry = {
  id: "entry-1",
  date: "2025-11-30",
  mood: "good",
  gratitude: ["sunrise"],
  highlights: "Morning run",
  reflection: "Felt energized",
};

describe("JournalForm", () => {
  it("renders mood cards with correct classes and selection ring", async () => {
    const onSubmit = jest.fn();
    const onCancel = jest.fn();
    render(
      <JournalForm
        today="2025-11-30"
        entry={baseEntry}
        onSubmit={onSubmit}
        onCancel={onCancel}
        isSaving={false}
      />
    );

    const amazingCard = screen.getByTestId("mood-card-amazing");
    expect(amazingCard).toHaveClass("bg-yellow-50");
    expect(amazingCard).toHaveClass("text-yellow-500");

    await userEvent.click(amazingCard);
    expect(amazingCard).toHaveClass("ring-teal-500");
  });

  it("updates gratitude array and calls onSubmit with trimmed values", async () => {
    const onSubmit = jest.fn();
    const onCancel = jest.fn();
    render(
      <JournalForm today="2025-11-30" entry={null} onSubmit={onSubmit} onCancel={onCancel} isSaving={false} />
    );

    const gratitudeInput = screen.getByLabelText(/Gratitude/i);
    await userEvent.clear(gratitudeInput);
    await userEvent.type(gratitudeInput, "sunrise, tea , focus");

    const highlightsInput = screen.getByLabelText(/Highlights/i);
    await userEvent.type(highlightsInput, "Deep work block");

    const reflectionInput = screen.getByLabelText(/Reflection/i);
    await userEvent.type(reflectionInput, "Stayed in flow");

    const submitButton = screen.getByRole("button", { name: "Save Entry" });
    await userEvent.click(submitButton);

    expect(onSubmit).toHaveBeenCalledWith({
      date: "2025-11-30",
      mood: "good",
      gratitude: ["sunrise", "tea", "focus"],
      highlights: "Deep work block",
      reflection: "Stayed in flow",
    });
  });
});


