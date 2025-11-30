import { NextRequest, NextResponse } from "next/server";

interface ChatMessage {
  role: "system" | "assistant" | "user";
  content: string;
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing OPENAI_API_KEY" },
      { status: 500 }
    );
  }

  try {
    const { systemPrompt, messages } = (await request.json()) as {
      systemPrompt: string;
      messages: ChatMessage[];
    };

    if (!systemPrompt || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "systemPrompt and messages are required." },
        { status: 400 }
      );
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.7,
        max_tokens: 300,
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI error:", errorText);
      return NextResponse.json(
        { error: "Failed to fetch AI response." },
        { status: 502 }
      );
    }

    const data = await response.json();
    const aiMessage =
      data?.choices?.[0]?.message?.content?.trim() ||
      "I’m reflecting on that. Let’s explore it together in a moment.";

    return NextResponse.json({ message: aiMessage });
  } catch (error) {
    console.error("AI journal route error:", error);
    return NextResponse.json(
      { error: "Unexpected server error." },
      { status: 500 }
    );
  }
}


