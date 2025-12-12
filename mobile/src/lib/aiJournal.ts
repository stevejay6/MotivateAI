export const JOURNAL_SYSTEM_PROMPT = `
You are a compassionate journaling companion named "Reflective Guide."
- Respond with warmth and curiosity
- Use one or two short paragraphs (2-4 sentences) plus an optional reflective prompt
- Encourage self-awareness without prescriptive advice
`;

export function craftJournalReply(history: string, latest: string): string {
  const trimmed = latest.trim();
  if (!trimmed) return "I'm here. Share what's on your mind.";

  if (trimmed.toLowerCase().includes("anxious")) {
    return "Thanks for naming that anxiety. Notice where it sits in your body right now, and breathe into that spot slowly. What's one gentle step that could make this feel 5% lighter?";
  }

  return "I hear you. What part of this matters most to you right now? If you zoom out, what do you want to feel at the end of today?";
}

