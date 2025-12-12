const REFLECTION_TEMPLATES = [
  (feeling: string) =>
    `I hear how much "${feeling}" is weighing on you right now. It's completely okay to feel that.`,
  (feeling: string) =>
    `Thanks for sharing that you're experiencing "${feeling}". Your honesty is a brave step toward giving your emotions care.`,
  (feeling: string) =>
    `It sounds like "${feeling}" has been on your mind. Let's hold space for that together.`,
];

const FOLLOW_UPS = [
  "What feels most important to explore about this right now?",
  "When you notice these feelings, what helps you feel a bit more grounded?",
  "Would it feel supportive to name one small comfort you can offer yourself?",
];

function extractLatestReflection(history: string): string {
  const matches = history.match(/Me:\s*(.+)/g);
  if (!matches || matches.length === 0) return "what you're carrying";
  const last = matches[matches.length - 1];
  return last.replace(/^Me:\s*/, "").trim();
}

export function craftCoachReply(prompt: string): string {
  const reflection = extractLatestReflection(prompt);
  const template = REFLECTION_TEMPLATES[Math.floor(Math.random() * REFLECTION_TEMPLATES.length)];
  const followUp = FOLLOW_UPS[Math.floor(Math.random() * FOLLOW_UPS.length)];
  return `${template(reflection)} ${followUp}`;
}

