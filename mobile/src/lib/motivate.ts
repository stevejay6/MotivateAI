export const ACTION_COACH_PROMPT = `
You are a no-nonsense action coach. Respond with 2-4 powerful sentences that:
- Call out hesitation directly
- Challenge immediate action in the next 5 minutes
- Be bold, direct, and motivating (not mean)
- End with a specific action challenge
`;

export function craftMotivateReply(userMessage: string): string {
  const lower = userMessage.toLowerCase();
  if (lower.includes("tired") || lower.includes("stuck")) {
    return "Being tired is real, but action creates energy. Stand up, set a 5-minute timer, and ship a tiny win right now.";
  }
  if (lower.includes("procrast")) {
    return "Procrastination is just a habit loop. Break it: pick one 5-minute task, start it, and send a note when it's done.";
  }
  return "Stop thinking, start doing. Pick one tiny action you can finish in five minutes and do it now. Report back when it's done.";
}

