import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import AISpeechesPage, {
  CATEGORIES,
  HARDCODED_SPEECHES,
  __resetSpeechStores,
  type Speech,
} from "@/app/ai-speeches/page";
import SiteNavDropdown from "@/components/SiteNavDropdown";

describe("AISpeechesPage", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    __resetSpeechStores();
    global.fetch = originalFetch;
  });

  afterEach(() => {
    global.fetch = originalFetch;
    jest.clearAllMocks();
  });

  it("renders the hero title and badge", () => {
    render(<AISpeechesPage />);

    expect(screen.getByText("Motivational Speeches")).toBeInTheDocument();
    expect(screen.getByText("Power Speeches")).toBeInTheDocument();
  });

  it("applies the gradient background and subtitle", () => {
    render(<AISpeechesPage />);

    expect(screen.getByText("Powerful 6-minute speeches to ignite your fire, fuel your ambition, and inspire action.")).toBeInTheDocument();
    expect(screen.getByTestId("ai-speeches-root")).toHaveClass("bg-gradient-to-br", "from-rose-50", "via-orange-50", "to-amber-50");
  });

  it("has eight predefined speeches with the expected categories", () => {
    expect(HARDCODED_SPEECHES).toHaveLength(8);
    const categories = HARDCODED_SPEECHES.map((speech) => speech.category);
    expect(categories).toEqual([
      "Morning Motivation",
      "Morning Motivation",
      "Life Purpose",
      "Take Action",
      "Success",
      "Mindset",
      "Epic Collection",
      "Life Transformation",
    ]);
  });

  it("combines presets with user speeches correctly", () => {
    const mockUserSpeeches: Speech[] = [
      {
        id: "user-1",
        title: "User Speech 1",
        speaker: "User Speaker",
        url: "https://example.com/user-1",
        category: "Other",
      },
    ];
    const combined = [...HARDCODED_SPEECHES, ...mockUserSpeeches];
    expect(combined).toHaveLength(HARDCODED_SPEECHES.length + mockUserSpeeches.length);
  });

  it("defaults to the All category", () => {
    render(<AISpeechesPage />);
    expect(screen.getByRole("button", { name: "All" })).toHaveClass("bg-gradient-to-r");
  });

  it("filters speeches when selecting a category", async () => {
    render(<AISpeechesPage />);

    expect(screen.getByText("5 Minutes to Start Your Day Right")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Life Purpose" }));

    expect(screen.getByText("Six Minute Eternity")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByText("5 Minutes to Start Your Day Right")).not.toBeInTheDocument();
    });
    expect(screen.getAllByTestId("speech-card")).toHaveLength(1);
  });

  it("shows an empty state when no speeches match the category", async () => {
    render(<AISpeechesPage />);

    await userEvent.click(screen.getByRole("button", { name: "Other" }));

    expect(screen.getByText("No speeches in this category")).toBeInTheDocument();
    expect(screen.getByText("Try selecting a different category.")).toBeInTheDocument();
  });

  it(
    "adds a new speech through the form",
    async () => {
      render(<AISpeechesPage />);
      const initialCards = await screen.findAllByTestId("speech-card");
      const initialCount = initialCards.length;

      await userEvent.click(screen.getByRole("button", { name: /add your speech/i }));
      await userEvent.type(screen.getByLabelText("Title"), "User Added Speech");
    await userEvent.type(screen.getByLabelText("Speaker"), "User Speaker");
    await userEvent.type(screen.getByLabelText("URL"), "https://example.com/user");
      await userEvent.click(screen.getByRole("combobox", { name: "Category" }));
      await userEvent.click(screen.getByRole("option", { name: "Success" }));
      await userEvent.click(screen.getByRole("button", { name: "Teal-Green" }));
      await userEvent.click(screen.getByRole("button", { name: /save speech/i }));

      await screen.findByText("User Added Speech");
      await waitFor(() => {
        expect(screen.getAllByTestId("speech-card")).toHaveLength(initialCount + 1);
      });
    },
    15000
  );

  it(
    "allows editing an existing user speech",
    async () => {
      render(<AISpeechesPage />);

      await userEvent.click(screen.getByRole("button", { name: /add your speech/i }));
      await userEvent.type(screen.getByLabelText("Title"), "Original Speech");
      await userEvent.type(screen.getByLabelText("Speaker"), "User Speaker");
      await userEvent.type(screen.getByLabelText("URL"), "https://example.com/original");
      await userEvent.click(screen.getByRole("button", { name: "Indigo-Purple" }));
      await userEvent.click(screen.getByRole("button", { name: /save speech/i }));
      await screen.findByText("Original Speech");

      await userEvent.click(screen.getByRole("button", { name: /edit/i }));
      const titleInput = screen.getByLabelText("Title");
      await userEvent.clear(titleInput);
      await userEvent.type(titleInput, "Edited Speech");
      await userEvent.click(screen.getByRole("combobox", { name: "Category" }));
      await userEvent.click(screen.getByRole("option", { name: "Mindset" }));
      await userEvent.click(screen.getByRole("button", { name: /save speech/i }));

      await screen.findByText("Edited Speech");
    },
    15000
  );

  it("shows gradient UI elements", () => {
    render(<AISpeechesPage />);
    expect(screen.getByRole("button", { name: "All" }).className).toContain("from-rose-500");
    expect(screen.getAllByTestId("speech-gradient-bar")[0].className).toContain("from-orange-400");
  });

  it(
    "fetches AI suggestions and displays them",
    async () => {
    const mockResponse = {
        speeches: [
          {
            title: "AI Suggested Power",
            speaker: "AI Mentor",
            description: "AI-generated motivational speech.",
            url: "https://example.com/ai-speech",
            category: "Mindset",
          },
        ],
      };

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      render(<AISpeechesPage />);

      await userEvent.type(screen.getByPlaceholderText("Topic, speaker, or vibe..."), "Les Brown");
      await userEvent.click(screen.getByRole("button", { name: /ask ai for speeches/i }));

      await screen.findByText("AI Suggested Power");
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/ai-speeches",
        expect.objectContaining({
          body: expect.stringContaining("Les Brown"),
        })
      );
    },
    10000
  );

  it("reveals the form when clicking Add Your Speech and hides the button", async () => {
    render(<AISpeechesPage />);

    const addButton = screen.getByRole("button", { name: /add your speech/i });
    await userEvent.click(addButton);

    expect(screen.getByText("Add New Speech")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /add your speech/i })).not.toBeInTheDocument();
  });
});

describe("Navigation link for AI Speeches", () => {
  it("includes the AI Speeches entry in the dropdown", async () => {
    render(<SiteNavDropdown />);

    await userEvent.click(screen.getByRole("button", { name: /navigate/i }));

    const link = screen.getByRole("link", { name: "AI Speeches" });
    expect(link).toHaveAttribute("href", "/ai-speeches");
  });
});


