import { buildCoachPrompt, fetchCoachReply } from "@/lib/emotionalCoach";
import type { Message } from "@/app/emotional-coach/types";

describe("buildCoachPrompt", () => {
  it("formats conversation with Me and Coach prefixes", () => {
    const history: Message[] = [
      { role: "user", content: "I feel anxious", timestamp: "1" },
      { role: "ai", content: "I'm here for you", timestamp: "2" },
    ];

    const prompt = buildCoachPrompt(history, "Thank you");
    expect(prompt).toContain("Me: I feel anxious");
    expect(prompt).toContain("Coach: I'm here for you");
    expect(prompt.trim().endsWith("Coach:")).toBe(true);
  });
});

describe("fetchCoachReply", () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  it("posts to the emotional coach API and returns the reply text", async () => {
    const mockResponse = { ok: true, json: async () => ({ reply: "Gentle reflection." }) };
    const mockFetch = jest.fn().mockResolvedValue(mockResponse);
    global.fetch = mockFetch as unknown as typeof global.fetch;

    const reply = await fetchCoachReply("Prompt text");
    expect(mockFetch).toHaveBeenCalledWith(
      "/api/emotional-coach",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: "Prompt text" }),
      })
    );
    expect(reply).toBe("Gentle reflection.");
  });
});

