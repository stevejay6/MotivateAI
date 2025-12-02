import { NextResponse } from "next/server";

const REFLECTION_TEMPLATES = [
  (feeling: string) =>
    `I hear how much "${feeling}" is weighing on you right now. It's completely okay to feel that, and I'm grateful you trusted me with it.`,
  (feeling: string) =>
    `Thank you for sharing that you're experiencing "${feeling}". Your honesty is a brave step toward giving your emotions the care they deserve.`,
  (feeling: string) =>
    `It sounds like "${feeling}" has been on your mind. Let's hold space for that together and move gently through what it brings up.`,
];

const FOLLOW_UPS = [
  "What feels most important to explore about this right now?",
  "When you notice these feelings, what helps you feel even a little more grounded?",
  "Would it feel supportive to name one small comfort you can offer yourself?",
];

function extractLatestReflection(prompt: string): string | null {
  const matches = prompt.match(/Me:\s*(.+)/g);
  if (!matches || matches.length === 0) {
    return null;
  }

  const lastMatch = matches[matches.length - 1];
  return lastMatch.replace(/^Me:\s*/, "").trim();
}

function craftSupportiveReply(prompt: string): string {
  const reflection = extractLatestReflection(prompt) ?? "what you're carrying";
  const template = REFLECTION_TEMPLATES[Math.floor(Math.random() * REFLECTION_TEMPLATES.length)];
  const followUp = FOLLOW_UPS[Math.floor(Math.random() * FOLLOW_UPS.length)];

  return `${template(reflection)} ${followUp}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const prompt = typeof body?.prompt === "string" ? body.prompt.trim() : "";

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required." }, { status: 400 });
    }

    const reply = craftSupportiveReply(prompt);
    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Emotional coach route error:", error);
    return NextResponse.json({ error: "Unable to process request." }, { status: 500 });
  }
}

