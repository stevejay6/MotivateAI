import type { Message } from "@/app/emotional-coach/types";

export const SYSTEM_PROMPT =
  "Act as my emotional AI coach. Give calm, supportive reflections (2–4 sentences). Ask gentle follow-ups and guide my thoughts. Respond with empathy and clarity.";

export function buildCoachPrompt(history: Message[], currentUserMessage: string): string {
  const historyText = history
    .map((message) => (message.role === "user" ? `Me: ${message.content}` : `Coach: ${message.content}`))
    .join("\n");

  const historySection = historyText ? `${historyText}\n\n` : "";
  const trimmedMessage = currentUserMessage.trim();

  return `${SYSTEM_PROMPT}\n\nConversation so far:\n${historySection}Me: ${trimmedMessage}\n\nCoach:`;
}

export async function fetchCoachReply(fullPrompt: string): Promise<string> {
  const response = await fetch("/api/emotional-coach", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: fullPrompt }),
  });

  if (!response.ok) {
    throw new Error("Unable to reach emotional coach.");
  }

  const data: unknown = await response.json();
  if (!data || typeof (data as { reply?: unknown }).reply !== "string") {
    throw new Error("Invalid response from emotional coach.");
  }

  return (data as { reply: string }).reply;
}

