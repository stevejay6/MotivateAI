import { NextResponse } from "next/server";

const YOUTUBE_SPEECHES = [
  {
    title: "Make Your Bed – Admiral McRaven",
    speaker: "University of Texas",
    description: "Admiral McRaven shares the mindset lessons that shaped his SEAL career.",
    url: "https://www.youtube.com/watch?v=pxBQLFLei70",
    category: "Morning Motivation",
  },
  {
    title: "Les Brown – It's Not Over Until You Win",
    speaker: "Les Brown",
    description: "A six-minute segment on resilience and taking responsibility for your dreams.",
    url: "https://www.youtube.com/watch?v=GLcJHC9J7l4",
    category: "Life Purpose",
  },
  {
    title: "No Excuses – Ben Lionel Scott",
    speaker: "Ben Lionel Scott",
    description: "A relentless push to act now and stop negotiating with your potential.",
    url: "https://www.youtube.com/watch?v=4QSiYGRbP7k",
    category: "Take Action",
  },
  {
    title: "Mindset – Unshakeable",
    speaker: "Team Fearless",
    description: "A compilation of voices reminding you to stay focused when life hits hardest.",
    url: "https://www.youtube.com/watch?v=OdwWcH7p0cE",
    category: "Mindset",
  },
  {
    title: "Jim Rohn – Change Your Life",
    speaker: "Jim Rohn",
    description: "A classic Jim Rohn talk on discipline, motivation, and daily standards.",
    url: "https://www.youtube.com/watch?v=AUjP6t5Q1GU",
    category: "Life Transformation",
  },
  {
    title: "I Will Win – Powerful Speech",
    speaker: "Motiversity",
    description: "A 6‑minute declaration of belief, grit, and a champion’s mindset.",
    url: "https://www.youtube.com/watch?v=QW7waeomnUc",
    category: "Success",
  },
  {
    title: "Fearless – Conquer Your Fear",
    speaker: "Team Fearless",
    description: "Direct coaching on facing fear head-on and moving anyway.",
    url: "https://www.youtube.com/watch?v=Nb0p1_7bP7k",
    category: "Mindset",
  },
];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const prompt: string = body.prompt ?? "";

    const normalizedPrompt = prompt.toLowerCase();
    const filtered = YOUTUBE_SPEECHES.filter((speech) =>
      speech.title.toLowerCase().includes(normalizedPrompt) ||
      speech.category.toLowerCase().includes(normalizedPrompt) ||
      speech.speaker.toLowerCase().includes(normalizedPrompt)
    );

    const pool = filtered.length > 0 ? filtered : YOUTUBE_SPEECHES;
    const suggestions = pool.slice(0, 3);

    return NextResponse.json({ speeches: suggestions });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to fetch AI speeches" }, { status: 500 });
  }
}

