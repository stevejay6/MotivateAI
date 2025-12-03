import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { SpeechForm } from "@/components/SpeechForm";
import { HARDCODED_SPEECHES, type Speech } from "@/app/ai-speeches/page";

describe("SpeechForm", () => {
  const baseSpeech = HARDCODED_SPEECHES[2];

  it("pre-populates fields when an initial speech is provided", () => {
    render(
      <SpeechForm
        initialSpeech={baseSpeech}
        isLoading={false}
        onSubmit={jest.fn()}
        onCancel={jest.fn()}
      />
    );

    expect(screen.getByLabelText("Title")).toHaveValue(baseSpeech.title);
    expect(screen.getByLabelText("Speaker")).toHaveValue(baseSpeech.speaker);
    expect(screen.getByLabelText("URL")).toHaveValue(baseSpeech.url);
    expect(screen.getByLabelText("Duration")).toHaveValue(baseSpeech.duration);
    expect(screen.getByLabelText("Description")).toHaveValue(baseSpeech.description);
  });

  it("prevents submission when required fields are missing", async () => {
    const onSubmit = jest.fn();
    render(<SpeechForm initialSpeech={null} onSubmit={onSubmit} onCancel={jest.fn()} isLoading={false} />);

    await userEvent.click(screen.getByRole("button", { name: /save speech/i }));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it(
    "sends the selected gradient and category on submit",
    async () => {
    const onSubmit = jest.fn();
    render(<SpeechForm initialSpeech={null} onSubmit={onSubmit} onCancel={jest.fn()} isLoading={false} />);

    await userEvent.type(screen.getByLabelText("Title"), "Test Speech");
    await userEvent.type(screen.getByLabelText("Speaker"), "Test Speaker");
    await userEvent.type(screen.getByLabelText("URL"), "https://example.com");
    await userEvent.click(screen.getByRole("combobox", { name: "Category" }));
    await waitFor(() => {
      expect(screen.getByRole("option", { name: "Success" })).toBeInTheDocument();
    });
    await userEvent.click(screen.getByRole("option", { name: "Success" }));
    await userEvent.click(screen.getByRole("button", { name: "Green-Emerald" }));
    await userEvent.click(screen.getByRole("button", { name: /save speech/i }));

      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Test Speech",
          speaker: "Test Speaker",
          url: "https://example.com",
          category: "Success",
          gradient: "from-green-400 to-emerald-400",
        })
      );
    },
    10000
  );
});


