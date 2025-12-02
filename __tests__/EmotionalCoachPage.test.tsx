import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type React from "react";

import EmotionalCoachPage from "@/app/emotional-coach/page";
import { useEmotionalCoachState, type EmotionalCoachState, type Message } from "@/app/emotional-coach/useEmotionalCoachState";

jest.mock("@/app/emotional-coach/useEmotionalCoachState", () => ({
  useEmotionalCoachState: jest.fn(),
}));

const mockedUseEmotionalCoachState = useEmotionalCoachState as jest.MockedFunction<typeof useEmotionalCoachState>;

const createMockState = (overrides: Partial<EmotionalCoachState> = {}): EmotionalCoachState => ({
  messages: [],
  inputMessage: "",
  setInputMessage: jest.fn(),
  isLoading: false,
  sessionComplete: false,
  aiMessageCount: 0,
  messagesEndRef: { current: null },
  handleSendMessage: jest.fn().mockResolvedValue(undefined),
  handleKeyPress: jest.fn(),
  startNewSession: jest.fn(),
  ...overrides,
});

describe("EmotionalCoachPage", () => {
  beforeEach(() => {
    mockedUseEmotionalCoachState.mockReturnValue(createMockState());
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the page title", () => {
    render(<EmotionalCoachPage />);
    expect(screen.getByRole("heading", { name: "Emotional Coach" })).toBeInTheDocument();
  });

  it("shows the emotional support badge text", () => {
    render(<EmotionalCoachPage />);
    expect(screen.getByText("Emotional Support")).toBeInTheDocument();
  });

  it("shows the initial reflections counter", () => {
    render(<EmotionalCoachPage />);
    expect(screen.getByText("0/12 reflections")).toBeInTheDocument();
  });

  it("renders the input and send button while the session is active", () => {
    render(<EmotionalCoachPage />);
    expect(screen.getByPlaceholderText("Share what you're feeling...")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /send/i })).toBeInTheDocument();
  });

  it("invokes handleSendMessage when Enter is pressed without Shift", async () => {
    const handleSendMessage = jest.fn().mockResolvedValue(undefined);
    const handleKeyPress = jest.fn((event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === "Enter" && !event.shiftKey) {
        handleSendMessage();
      }
    });

    mockedUseEmotionalCoachState.mockReturnValue(
      createMockState({
        handleSendMessage,
        handleKeyPress,
      })
    );

    render(<EmotionalCoachPage />);
    const textarea = screen.getByPlaceholderText("Share what you're feeling...");
    fireEvent.keyDown(textarea, { key: "Enter", code: "Enter", shiftKey: false });

    expect(handleKeyPress).toHaveBeenCalledTimes(1);
    expect(handleSendMessage).toHaveBeenCalledTimes(1);
  });

  it("hides the input area and shows session completion actions when finished", async () => {
    const startNewSession = jest.fn();
    mockedUseEmotionalCoachState.mockReturnValue(
      createMockState({
        sessionComplete: true,
        startNewSession,
      })
    );

    render(<EmotionalCoachPage />);

    expect(screen.queryByPlaceholderText("Share what you're feeling...")).not.toBeInTheDocument();
    const restartButton = screen.getByRole("button", { name: /start new session/i });
    expect(restartButton).toBeInTheDocument();

    await userEvent.click(restartButton);
    expect(startNewSession).toHaveBeenCalledTimes(1);
  });

  it("shows the empty state prompt when no messages exist and not loading", () => {
    render(<EmotionalCoachPage />);
    expect(screen.getByText("How are you feeling today?")).toBeInTheDocument();
    expect(screen.getByText("Share whatever is on your mind")).toBeInTheDocument();
  });

  it("does not show the empty state prompt once messages exist", () => {
    mockedUseEmotionalCoachState.mockReturnValue(
      createMockState({
        messages: [{ role: "user", content: "Hello", timestamp: "1" }],
      })
    );

    render(<EmotionalCoachPage />);
    expect(screen.queryByText("How are you feeling today?")).not.toBeInTheDocument();
  });

  it("shows the loading indicator when awaiting a response", () => {
    mockedUseEmotionalCoachState.mockReturnValue(
      createMockState({
        isLoading: true,
      })
    );

    render(<EmotionalCoachPage />);
    expect(screen.getAllByTestId("loading-dot")).toHaveLength(3);
  });

  it("hides loading dots when not awaiting a response", () => {
    render(<EmotionalCoachPage />);
    expect(screen.queryByTestId("loading-dot")).not.toBeInTheDocument();
  });

  it("renders user and ai messages with correct alignment", () => {
    const messages: Message[] = [
      { role: "user", content: "I'm feeling overwhelmed.", timestamp: "user-1" },
      { role: "ai", content: "I'm here with you.", timestamp: "ai-1" },
    ];

    mockedUseEmotionalCoachState.mockReturnValue(
      createMockState({
        messages,
      })
    );

    render(<EmotionalCoachPage />);

    const wrappers = screen.getAllByTestId("message-wrapper");
    const userWrapper = wrappers.find((wrapper) => wrapper.getAttribute("data-role") === "user");
    const aiWrapper = wrappers.find((wrapper) => wrapper.getAttribute("data-role") === "ai");

    expect(userWrapper).toHaveClass("justify-end");
    expect(aiWrapper).toHaveClass("justify-start");
  });

  it("applies gradient classes for user and ai message bubbles", () => {
    const messages: Message[] = [
      { role: "user", content: "Thank you", timestamp: "user-1" },
      { role: "ai", content: "You're welcome", timestamp: "ai-1" },
    ];

    mockedUseEmotionalCoachState.mockReturnValue(
      createMockState({
        messages,
      })
    );

    render(<EmotionalCoachPage />);

    const wrappers = screen.getAllByTestId("message-wrapper");
    const userBubble = wrappers
      .find((wrapper) => wrapper.getAttribute("data-role") === "user")
      ?.querySelector("div");
    const aiBubble = wrappers
      .find((wrapper) => wrapper.getAttribute("data-role") === "ai")
      ?.querySelector("div");

    expect(userBubble).toHaveClass("bg-gradient-to-r", "from-rose-500", "to-pink-500", "text-white");
    expect(aiBubble).toHaveClass("bg-gradient-to-r", "from-rose-50", "to-pink-50", "border-rose-100");
  });
});

