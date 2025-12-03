import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import AIMotivateMeNowPage from "@/app/ai-motivate-me-now/page";
import AIMotivateMeNowView from "@/app/ai-motivate-me-now/AIMotivateMeNowView";
import SiteNavDropdown from "@/components/SiteNavDropdown";
import { fetchCoachReply } from "@/lib/aiMotivateMeNow";

jest.mock("@/lib/aiMotivateMeNow", () => {
  const actual = jest.requireActual("@/lib/aiMotivateMeNow");
  return {
    ...actual,
    fetchCoachReply: jest.fn(),
  };
});

const mockedFetchCoachReply = fetchCoachReply as jest.MockedFunction<typeof fetchCoachReply>;

describe("AIMotivateMeNowPage", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the hero title, badge, subtitle, and footer", () => {
    render(<AIMotivateMeNowPage />);

    expect(screen.getByText("AI Motivate Me Now")).toBeInTheDocument();
    expect(screen.getByText("Action Coach")).toBeInTheDocument();
    expect(screen.getByText("No excuses. No tomorrow. Just ACTION. Get the push you need to start NOW.")).toBeInTheDocument();
    expect(screen.getByText("🔥 Stop planning. Start doing. Your coach believes you can do more.")).toBeInTheDocument();
  });

  it("shows zero pushes in the progress counter on initial render", () => {
    render(<AIMotivateMeNowPage />);

    const counters = screen.getAllByText("0/8 pushes");
    expect(counters.length).toBeGreaterThan(0);
  });

  it("renders the textarea and send button before the session completes", () => {
    render(<AIMotivateMeNowPage />);

    expect(
      screen.getByPlaceholderText("What are you avoiding? What excuse are you making?")
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /send push/i })).toBeInTheDocument();
  });

  it("disables the send button when the input is empty", () => {
    render(<AIMotivateMeNowPage />);

    expect(screen.getByRole("button", { name: /send push/i })).toBeDisabled();
  });

  it("prevents sending when the session is complete", () => {
    render(<AIMotivateMeNowView initialSessionComplete initialAiMessageCount={8} />);

    expect(screen.queryByRole("button", { name: /send push/i })).not.toBeInTheDocument();
  });

  it("shows the empty state texts when there are no messages and not loading", () => {
    render(<AIMotivateMeNowPage />);

    expect(screen.getByText("What's holding you back? Say it.")).toBeInTheDocument();
    expect(screen.getByText("Be honest. Your coach is listening.")).toBeInTheDocument();
  });

  it("renders three loading dots while the coach is thinking", () => {
    render(<AIMotivateMeNowView initialIsLoading />);

    expect(screen.getAllByTestId("loading-dot")).toHaveLength(3);
  });

  it("renders the completion UI when the session is complete", () => {
    render(
      <AIMotivateMeNowView
        initialSessionComplete
        initialMessages={[{ role: "ai", content: "Session done.", timestamp: "ai-final" }]}
        initialAiMessageCount={8}
      />
    );

    expect(screen.queryByPlaceholderText("What are you avoiding? What excuse are you making?")).not.toBeInTheDocument();
    expect(screen.getByText("You're fired up. Now ACT!")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /get another push/i })).toBeInTheDocument();
  });

  it("resets the session when clicking Get Another Push", async () => {
    render(
      <AIMotivateMeNowView
        initialSessionComplete
        initialMessages={[{ role: "ai", content: "Done", timestamp: "ai-final" }]}
        initialAiMessageCount={8}
      />
    );

    await userEvent.click(screen.getByRole("button", { name: /get another push/i }));

    await waitFor(() => {
      expect(screen.getByPlaceholderText("What are you avoiding? What excuse are you making?")).toBeInTheDocument();
    });
    expect(screen.getAllByText("0/8 pushes").length).toBeGreaterThan(0);
    expect(screen.queryByText("You're fired up. Now ACT!")).not.toBeInTheDocument();
  });

  it("appends user and ai messages when sending a reflection", async () => {
    mockedFetchCoachReply.mockResolvedValue("Test reply");
    render(<AIMotivateMeNowPage />);

    const textarea = screen.getByPlaceholderText("What are you avoiding? What excuse are you making?");
    await userEvent.type(textarea, "I keep delaying my workout");
    await userEvent.keyboard("{Enter}");

    await waitFor(() => {
      expect(screen.getAllByTestId("message-bubble")).toHaveLength(2);
    });

    const userBubble = screen.getAllByTestId("message-bubble")[0];
    const aiBubble = screen.getAllByTestId("message-bubble")[1];

    expect(userBubble).toHaveTextContent("I keep delaying my workout");
    expect(aiBubble).toHaveTextContent("Test reply");
    expect(screen.getAllByText(/pushes/)[0]).toHaveTextContent("1/8");
  });

  it("marks the session complete after eight AI pushes", async () => {
    mockedFetchCoachReply.mockResolvedValue("Keep pushing.");
    render(<AIMotivateMeNowPage />);

    for (let index = 0; index < 8; index += 1) {
      const textarea = screen.getByPlaceholderText("What are you avoiding? What excuse are you making?");
      await userEvent.type(textarea, `Excuse ${index}`);
      await userEvent.keyboard("{Enter}");

      // wait for each AI response before continuing
      // (index + 1) user messages + (index + 1) ai messages
      await waitFor(() => {
        expect(mockedFetchCoachReply).toHaveBeenCalledTimes(index + 1);
      });
    }

    await waitFor(() => {
      expect(screen.getByText("You've got your fire back. Now GO. Take action. No more talking - DO IT! 🔥")).toBeInTheDocument();
    });
    expect(screen.queryByPlaceholderText("What are you avoiding? What excuse are you making?")).not.toBeInTheDocument();
  });

  it("auto-scrolls to the latest message", async () => {
    const originalScrollIntoView = window.HTMLElement.prototype.scrollIntoView;
    const scrollIntoViewMock = jest.fn();
    window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;

    try {
      mockedFetchCoachReply.mockResolvedValue("Scroll test reply");
      render(<AIMotivateMeNowPage />);

      scrollIntoViewMock.mockClear();

      const textarea = screen.getByPlaceholderText("What are you avoiding? What excuse are you making?");
      await userEvent.type(textarea, "Testing scroll");
      await userEvent.keyboard("{Enter}");

      await waitFor(() => {
        expect(scrollIntoViewMock).toHaveBeenCalled();
      });
    } finally {
      window.HTMLElement.prototype.scrollIntoView = originalScrollIntoView;
    }
  });

  it("applies the correct gradients and border to user and ai messages", () => {
    render(
      <AIMotivateMeNowView
        initialMessages={[
          { role: "user", content: "Test user", timestamp: "u" },
          { role: "ai", content: "Test ai", timestamp: "a" },
        ]}
      />
    );

    const bubbles = screen.getAllByTestId("message-bubble");
    const userBubble = bubbles.find((bubble) => bubble.getAttribute("data-role") === "user");
    const aiBubble = bubbles.find((bubble) => bubble.getAttribute("data-role") === "ai");
    expect(userBubble).toHaveClass("from-orange-500", "to-red-500", "text-white");
    expect(aiBubble).toHaveClass("from-orange-50", "to-red-50", "border-orange-200");
  });
});

describe("SiteNavDropdown navigation link", () => {
  it("includes the AI Motivate Me Now link pointing to the new route", async () => {
    render(<SiteNavDropdown />);

    await userEvent.click(screen.getByRole("button", { name: /navigate/i }));

    const link = await screen.findByRole("link", { name: "AI Motivate Me Now" });
    expect(link).toHaveAttribute("href", "/ai-motivate-me-now");
  });
});


