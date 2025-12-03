import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import IAffirmationsPage from "@/app/iaffirmations/page";
import { getAffirmationsPaginated } from "@/lib/supabase";

jest.mock("@/components/SearchBar", () => ({
  __esModule: true,
  default: ({ searchQuery, onSearchChange, placeholder }: { searchQuery: string; onSearchChange: (value: string) => void; placeholder?: string }) => (
    <input
      data-testid="search-bar"
      value={searchQuery}
      placeholder={placeholder}
      onChange={(event) => onSearchChange(event.target.value)}
    />
  ),
}));

jest.mock("@/components/AffirmationCategoryButtons", () => ({
  __esModule: true,
  default: ({ onSelect }: { onSelect: (value: string | null) => void }) => (
    <button type="button" onClick={() => onSelect("focus")} data-testid="category-selector">
      Choose Focus
    </button>
  ),
}));

jest.mock("@/components/AffirmationCard", () => ({
  __esModule: true,
  default: ({ affirmation }: { affirmation: { quotetext: string } }) => (
    <div data-testid="affirmation-card">{affirmation.quotetext}</div>
  ),
}));

jest.mock("@/lib/supabase", () => ({
  getAffirmationsPaginated: jest.fn(),
}));

const mockedGetAffirmationsPaginated = getAffirmationsPaginated as jest.MockedFunction<typeof getAffirmationsPaginated>;

describe("IAffirmationsPage", () => {
  beforeEach(() => {
    mockedGetAffirmationsPaginated.mockResolvedValue({
      affirmations: [
        {
          iaffid: 1,
          icategoryid: 2,
          quotetext: "I am centered and focused.",
          icategoryname: "Focus",
        },
      ],
      hasMore: false,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("loads affirmations and re-fetches when selecting another category", async () => {
    render(<IAffirmationsPage />);

    expect(screen.getByText("Loading affirmations...")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText("Loading affirmations...")).not.toBeInTheDocument();
    });

    expect(screen.getByText("I - Affirmations")).toBeInTheDocument();
    expect(screen.getByTestId("affirmation-card")).toHaveTextContent("I am centered and focused.");
    expect(mockedGetAffirmationsPaginated).toHaveBeenCalledTimes(1);

    const categoryButtons = screen.getAllByTestId("category-selector");
    await userEvent.click(categoryButtons[0]);

    await waitFor(() => {
      expect(mockedGetAffirmationsPaginated).toHaveBeenCalledTimes(2);
    });
  });
});


