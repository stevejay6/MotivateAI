import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { SpeechCard } from "@/components/SpeechCard";
import { HARDCODED_SPEECHES } from "@/app/ai-speeches/page";

describe("SpeechCard", () => {
  const baseSpeech = HARDCODED_SPEECHES[0];

  beforeEach(() => {
    jest.spyOn(window, "open").mockImplementation(() => null);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders the speech details", () => {
    render(<SpeechCard speech={baseSpeech} />);

    expect(screen.getByText(baseSpeech.title)).toBeInTheDocument();
    expect(screen.getByText(`by ${baseSpeech.speaker}`)).toBeInTheDocument();
    expect(screen.getByText(baseSpeech.description!)).toBeInTheDocument();
    expect(screen.getByText(baseSpeech.category)).toBeInTheDocument();
    expect(screen.getByText(baseSpeech.duration!)).toBeInTheDocument();
  });

  it("opens the speech link when clicking Watch Speech", async () => {
    render(<SpeechCard speech={baseSpeech} />);

    await userEvent.click(screen.getByRole("button", { name: /watch speech/i }));
    expect(window.open).toHaveBeenCalledWith(baseSpeech.url, "_blank", "noopener,noreferrer");
  });

  it("renders gradient header and edit button when allowed", async () => {
    const onEdit = jest.fn();
    render(<SpeechCard speech={baseSpeech} canEdit onEdit={onEdit} />);

    expect(screen.getByTestId("speech-gradient-bar").className).toContain(baseSpeech.gradient!.split(" ")[0]);
    await userEvent.click(screen.getByRole("button", { name: /edit/i }));
    expect(onEdit).toHaveBeenCalled();
  });
});

