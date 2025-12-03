import { NextResponse } from "next/server";

const FALLBACK_REPLY =
  "Quit overthinking. Pick one action you can finish in five minutes, start it now, and report back. No excuses.";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { prompt?: unknown };
    if (!body || typeof body.prompt !== "string" || body.prompt.trim() === "") {
      return NextResponse.json({ error: "Prompt is required." }, { status: 400 });
    }

    // Placeholder: hook up to your real AI provider here.
    return NextResponse.json({ reply: FALLBACK_REPLY });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to reach action coach." }, { status: 500 });
  }
}


