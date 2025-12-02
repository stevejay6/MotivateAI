import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { format } from "date-fns";

import type { JournalEntry } from "@/app/ai-kick-in-the-pants/types";
import { JournalForm } from "@/components/JournalForm";

describe("JournalForm", () => {
  it("defaults to today's date and empty mood when no entry is provided", () => {
    const onSubmit = jest.fn();
    render(<JournalForm entry={null} onSubmit={onSubmit} onCancel={jest.fn()} isLoading={false} />);

    const expectedDate = format(new Date(), "yyyy-MM-dd");
    expect(screen.getByDisplayValue(expectedDate)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Amazing" })).not.toHaveClass("ring-teal-500");
  });

  it("populates fields when an entry is provided", () => {
    const entry: JournalEntry = {
      id: "entry-1",
      date: "2025-01-10",
      mood: "good",
      gratitude: ["coffee", "sunshine", "friends"],
      highlights: "Won a prize",
      reflection: "Felt grateful",
    };

    render(<JournalForm entry={entry} onSubmit={jest.fn()} onCancel={jest.fn()} isLoading={false} />);

    expect(screen.getByDisplayValue("2025-01-10")).toBeInTheDocument();
    expect(screen.getByText("Good")).toHaveClass("ring-teal-500");
    expect(screen.getByDisplayValue("coffee")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Won a prize")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Felt grateful")).toBeInTheDocument();
  });

  it("updates the selected mood styling", async () => {
    render(<JournalForm entry={null} onSubmit={jest.fn()} onCancel={jest.fn()} isLoading={false} />);

    const goodButton = screen.getByRole("button", { name: "Good" });
    await userEvent.click(goodButton);
    expect(goodButton).toHaveClass("ring-teal-500");
  });

  it("submits the form with the correct payload", async () => {
    const onSubmit = jest.fn();
    render(<JournalForm entry={null} onSubmit={onSubmit} onCancel={jest.fn()} isLoading={false} />);

    const dateInput = screen.getByDisplayValue(format(new Date(), "yyyy-MM-dd"));
    await userEvent.clear(dateInput);
    await userEvent.type(dateInput, "2025-02-01");

    await userEvent.click(screen.getByRole("button", { name: "Amazing" }));
    const gratitudeInputs = screen.getAllByPlaceholderText(/Gratitude/);
    await userEvent.type(gratitudeInputs[0], "Family");
    await userEvent.type(gratitudeInputs[1], "Health");

    await userEvent.type(screen.getByPlaceholderText("Call out your wins or meaningful moments."), "Got promoted");
    await userEvent.type(screen.getByPlaceholderText("What thoughts or lessons stood out today?"), "Stay humble");

    await userEvent.click(screen.getByRole("button", { name: "Save Entry" }));

    expect(onSubmit).toHaveBeenCalledWith({
      date: "2025-02-01",
      mood: "amazing",
      gratitude: ["Family", "Health"],
      highlights: "Got promoted",
      reflection: "Stay humble",
    });
  });

  it("prevents submission when required fields are missing", async () => {
    const onSubmit = jest.fn();
    render(<JournalForm entry={null} onSubmit={onSubmit} onCancel={jest.fn()} isLoading={false} />);

    await userEvent.click(screen.getByRole("button", { name: "Save Entry" }));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("trims gratitude and text inputs before submitting", async () => {
    const onSubmit = jest.fn();
    render(<JournalForm entry={null} onSubmit={onSubmit} onCancel={jest.fn()} isLoading={false} />);

    await userEvent.click(screen.getByRole("button", { name: "Amazing" }));
    const gratitudeInputs = screen.getAllByPlaceholderText(/Gratitude/);
    await userEvent.type(gratitudeInputs[0], "  Family  ");
    await userEvent.type(gratitudeInputs[1], " Health ");

    await userEvent.type(screen.getByPlaceholderText("Call out your wins or meaningful moments."), "  Growth  ");
    await userEvent.type(screen.getByPlaceholderText("What thoughts or lessons stood out today?"), " Stay curious ");

    await userEvent.click(screen.getByRole("button", { name: "Save Entry" }));

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        gratitude: ["Family", "Health"],
        highlights: "Growth",
        reflection: "Stay curious",
      })
    );
  });
});


