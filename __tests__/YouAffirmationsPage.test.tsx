import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import YouAffirmationsPage from "@/app/you-affirmations/page";
import { getYouAffirmationsPaginated } from "@/lib/supabase";

jest.mock("@/components/SearchBar", () => ({
  __esModule: true,
  default: ({ searchQuery, onSearchChange }: { searchQuery: string; onSearchChange: (value: string) => void }) => (
    <input data-testid="search-bar" value={searchQuery} onChange={(event) => onSearchChange(event.target.value)} />
  ),
}));

jest.mock("@/components/AffirmationCategoryButtons", () => ({
  __esModule: true,
  default: ({ onSelect }: { onSelect: (value: string | null) => void }) => (
    <button type="button" onClick={() => onSelect("courage")} data-testid="category-selector">
      Pick Courage
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
  getYouAffirmationsPaginated: jest.fn(),
}));

const mockedGetYouAffirmationsPaginated = getYouAffirmationsPaginated as jest.MockedFunction<typeof getYouAffirmationsPaginated>;

describe("YouAffirmationsPage", () => {
  beforeEach(() => {
    mockedGetYouAffirmationsPaginated.mockResolvedValue({
      affirmations: [
        {
          uaffid: 5,
          ucategoryid: 3,
          quotetext: "You bring light everywhere you go.",
          ucategoryname: "Encouragement",
        },
      ],
      hasMore: false,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders affirmations after loading and triggers refetch on category select", async () => {
    render(<YouAffirmationsPage />);

    expect(screen.getByText("Loading affirmations...")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText("Loading affirmations...")).not.toBeInTheDocument();
    });

    expect(screen.getByText("You - Affirmations")).toBeInTheDocument();
    expect(screen.getByTestId("affirmation-card")).toHaveTextContent("You bring light everywhere you go.");
    expect(mockedGetYouAffirmationsPaginated).toHaveBeenCalledTimes(1);

    const categoryButtons = screen.getAllByTestId("category-selector");
    await userEvent.click(categoryButtons[0]);

    await waitFor(() => {
      expect(mockedGetYouAffirmationsPaginated).toHaveBeenCalledTimes(2);
    });
  });
});


