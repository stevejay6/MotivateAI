import type { ComponentType } from "react";
import { Cloud, Frown, Meh, Smile, Sun } from "lucide-react";

import type { Mood } from "@/app/ai-kick-in-the-pants/types";

export type MoodDisplayConfig = {
  icon: ComponentType<{ className?: string }>;
  color: string;
  bg: string;
};

export const moodIcons: Record<Mood, MoodDisplayConfig> = {
  amazing: { icon: Sun, color: "text-yellow-500", bg: "bg-yellow-50" },
  good: { icon: Smile, color: "text-green-500", bg: "bg-green-50" },
  okay: { icon: Meh, color: "text-blue-500", bg: "bg-blue-50" },
  challenging: { icon: Cloud, color: "text-gray-500", bg: "bg-gray-50" },
  difficult: { icon: Frown, color: "text-purple-500", bg: "bg-purple-50" },
};

