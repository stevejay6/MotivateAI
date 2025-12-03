import type { ChatMessage } from "@/app/ai-motivate-me-now/types";

export const SYSTEM_PROMPT = `

You are a no-nonsense action coach. Your job is to IGNITE action, eliminate excuses, and push people to DO something RIGHT NOW. Respond with 2-4 powerful sentences that:

- Call out any hesitation or excuses directly
- Challenge them to take immediate action
- Be bold, direct, and motivating (not mean, but firm)
- Focus on WHAT they can do in the next 5 minutes
- End with a specific action challenge


DO NOT be gentle. Be a coach who believes they can do more than they think.

`;

export function buildActionCoachPrompt(history: ChatMessage[], userMessage: string): string {
  const historyText =
    history.length === 0
      ? "None yet."
      : history
          .map((message) => (message.role === "user" ? `User: ${message.content}` : `Coach: ${message.content}`))
          .join("\n");

  const trimmedMessage = userMessage.trim();

  return `${SYSTEM_PROMPT}\n\nPrevious conversation:\n${historyText}\n\nUser's latest message: ${trimmedMessage}\n\nRespond with fire and urgency:`;
}

export async function fetchCoachReply(fullPrompt: string): Promise<string> {
  const response = await fetch("/api/ai-motivate-me-now", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: fullPrompt }),
  });

  if (!response.ok) {
    throw new Error("Unable to reach action coach.");
  }

  const data: unknown = await response.json();
  if (!data || typeof (data as { reply?: unknown }).reply !== "string") {
    throw new Error("Invalid response from action coach.");
  }

  return (data as { reply: string }).reply;
}


