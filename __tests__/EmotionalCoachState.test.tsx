import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import {
  SESSION_COMPLETION_MESSAGE,
  useEmotionalCoachState,
} from "@/app/emotional-coach/useEmotionalCoachState";
import { fetchCoachReply } from "@/lib/emotionalCoach";

jest.mock("@/lib/emotionalCoach", () => {
  const actual = jest.requireActual("@/lib/emotionalCoach");
  return {
    ...actual,
    fetchCoachReply: jest.fn(),
  };
});

const mockedFetchCoachReply = fetchCoachReply as jest.MockedFunction<typeof fetchCoachReply>;

const HookHarness = () => {
  const {
    messages,
    inputMessage,
    setInputMessage,
    handleSendMessage,
    aiMessageCount,
    sessionComplete,
    startNewSession,
    messagesEndRef,
  } = useEmotionalCoachState();

  return (
    <div>
      <textarea
        data-testid="coach-input"
        value={inputMessage}
        onChange={(event) => setInputMessage(event.target.value)}
      />
      <button data-testid="coach-send" onClick={handleSendMessage}>
        Send
      </button>
      <button data-testid="coach-reset" onClick={startNewSession}>
        Reset
      </button>
      <div data-testid="coach-ai-count">{aiMessageCount}</div>
      <div data-testid="coach-session-complete">{sessionComplete ? "true" : "false"}</div>
      <ul data-testid="coach-messages">
        {messages.map((message) => (
          <li key={message.timestamp} data-role={message.role}>
            {message.content}
          </li>
        ))}
      </ul>
      <div data-testid="coach-scroll-anchor" ref={messagesEndRef} />
    </div>
  );
};

describe("useEmotionalCoachState", () => {
  const sendMessage = async (text: string) => {
    await act(async () => {
      await userEvent.clear(screen.getByTestId("coach-input"));
      await userEvent.type(screen.getByTestId("coach-input"), text);
      await userEvent.click(screen.getByTestId("coach-send"));
    });
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("handleSendMessage appends user and ai messages", async () => {
    mockedFetchCoachReply.mockResolvedValue("Thank you for sharing that. How does it feel to say it out loud?");
    render(<HookHarness />);

    await sendMessage("I'm feeling overwhelmed.");

    await waitFor(() => {
      expect(screen.getAllByRole("listitem")).toHaveLength(2);
    });
    await waitFor(() => {
      expect(screen.getByTestId("coach-ai-count").textContent).toBe("1");
    });

    const messages = screen.getAllByRole("listitem");
    expect(messages[0]).toHaveAttribute("data-role", "user");
    expect(messages[1]).toHaveAttribute("data-role", "ai");
    expect(mockedFetchCoachReply).toHaveBeenCalledTimes(1);
  });

  it(
    "enforces the 12-message limit and marks the session complete",
    async () => {
    mockedFetchCoachReply.mockResolvedValue("I'm here with you. What's one gentle step forward?");
    render(<HookHarness />);

    for (let index = 0; index < 12; index += 1) {
      await sendMessage(`Reflection ${index}`);

      await waitFor(() => {
        expect(screen.getByTestId("coach-ai-count").textContent).toBe(String(index + 1));
      });
    }

      expect(screen.getByTestId("coach-session-complete").textContent).toBe("true");
      expect(screen.getByText(SESSION_COMPLETION_MESSAGE)).toBeInTheDocument();
      expect(mockedFetchCoachReply).toHaveBeenCalledTimes(12);
    },
    10000
  );

  it("resets the session state when starting a new session", async () => {
    mockedFetchCoachReply.mockResolvedValue("Let's keep breathing together.");
    render(<HookHarness />);

    for (let index = 0; index < 12; index += 1) {
      await sendMessage(`Reflection ${index}`);
    }

    await waitFor(() => {
      expect(screen.getByTestId("coach-session-complete").textContent).toBe("true");
    });

    await userEvent.click(screen.getByTestId("coach-reset"));

    await waitFor(() => {
      expect(screen.getByTestId("coach-ai-count").textContent).toBe("0");
      expect(screen.getByTestId("coach-session-complete").textContent).toBe("false");
    });
    expect(screen.queryByText(SESSION_COMPLETION_MESSAGE)).not.toBeInTheDocument();
    expect(screen.queryAllByRole("listitem")).toHaveLength(0);
  });

  it("auto-scrolls to the newest message", async () => {
    const originalScrollIntoView = window.HTMLElement.prototype.scrollIntoView;
    const scrollIntoViewMock = jest.fn();
    window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;

    mockedFetchCoachReply.mockResolvedValue("I'm listening. Tell me more.");
    render(<HookHarness />);

    await userEvent.type(screen.getByTestId("coach-input"), "Testing scroll");
    await userEvent.click(screen.getByTestId("coach-send"));

    await waitFor(() => {
      expect(scrollIntoViewMock).toHaveBeenCalled();
    });

    window.HTMLElement.prototype.scrollIntoView = originalScrollIntoView;
  });
});

