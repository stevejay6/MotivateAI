import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import QuotesPage from "@/app/quotes/page";
import { getQuotesPaginated } from "@/lib/supabase";

jest.mock("@/components/SearchBar", () => ({
  __esModule: true,
  default: ({ searchQuery, onSearchChange }: { searchQuery: string; onSearchChange: (value: string) => void }) => (
    <input data-testid="search-bar" value={searchQuery} onChange={(event) => onSearchChange(event.target.value)} />
  ),
}));

jest.mock("@/components/QCategoryButtons", () => ({
  __esModule: true,
  default: ({ onSelect }: { onSelect: (value: string | null) => void }) => (
    <button type="button" onClick={() => onSelect("wisdom")} data-testid="category-selector">
      Select Wisdom
    </button>
  ),
}));

jest.mock("@/components/QuoteCard", () => ({
  __esModule: true,
  default: ({ quote }: { quote: { quotetext: string } }) => (
    <div data-testid="quote-card">{quote.quotetext}</div>
  ),
}));

jest.mock("@/lib/supabase", () => ({
  getQuotesPaginated: jest.fn(),
}));

const mockedGetQuotesPaginated = getQuotesPaginated as jest.MockedFunction<typeof getQuotesPaginated>;

describe("QuotesPage", () => {
  beforeEach(() => {
    mockedGetQuotesPaginated.mockResolvedValue({
      quotes: [
        {
          quoteid: 100,
          categoryid: 1,
          subcategoryid: 1,
          quotetext: "Inspiration is everywhere.",
          author: "Someone",
          created_at: "",
          updated_at: "",
          likes_count: 0,
          flag_count: 0,
          rand: 0,
          quotenumber: null,
          tags: null,
          is_active: true,
        },
      ],
      hasMore: false,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("displays quotes and refreshes when a category is selected", async () => {
    render(<QuotesPage />);

    expect(screen.getByText("Loading quotes...")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText("Loading quotes...")).not.toBeInTheDocument();
    });

    expect(screen.getByRole("heading", { name: "Quotes Discovery" })).toBeInTheDocument();
    expect(screen.getByTestId("quote-card")).toHaveTextContent("Inspiration is everywhere.");
    expect(mockedGetQuotesPaginated).toHaveBeenCalledTimes(1);

    const categoryButtons = screen.getAllByTestId("category-selector");
    await userEvent.click(categoryButtons[0]);

    await waitFor(() => {
      expect(mockedGetQuotesPaginated).toHaveBeenCalledTimes(2);
    });
  });
});


