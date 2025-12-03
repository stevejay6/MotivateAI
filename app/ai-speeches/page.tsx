'use client';

import { AnimatePresence, motion } from "framer-motion";
import { Mic2, Play, Plus, Zap } from "lucide-react";
import { useMemo, useState } from "react";
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SpeechCard } from "@/components/SpeechCard";
import { SpeechForm } from "@/components/SpeechForm";

type SpeechCategory =
  | "Morning Motivation"
  | "Life Purpose"
  | "Take Action"
  | "Success"
  | "Mindset"
  | "Epic Collection"
  | "Life Transformation"
  | "Other";

type Speech = {
  id: string;
  title: string;
  speaker: string;
  duration?: string;
  description?: string;
  url: string;
  category: SpeechCategory;
  gradient?: string;
};

const CATEGORIES = [
  "All",
  "Morning Motivation",
  "Life Purpose",
  "Take Action",
  "Success",
  "Mindset",
  "Epic Collection",
  "Life Transformation",
  "Other",
] as const;

const HARDCODED_SPEECHES: Speech[] = [
  {
    id: "preset-1",
    title: "5 Minutes to Start Your Day Right",
    speaker: "Admiral William H. McRaven",
    duration: "5 min",
    description: "A focused morning reset to build discipline and purpose.",
    url: "https://example.com/mcraven-morning",
    category: "Morning Motivation",
    gradient: "from-orange-400 to-red-400",
  },
  {
    id: "preset-2",
    title: "6 Minutes to Start Your Day Best",
    speaker: "Various Speakers",
    duration: "6 min",
    description: "High-energy morning motivation from multiple voices.",
    url: "https://example.com/morning-best",
    category: "Morning Motivation",
    gradient: "from-yellow-400 to-orange-400",
  },
  {
    id: "preset-3",
    title: "Six Minute Eternity",
    speaker: "Les Brown",
    duration: "6 min",
    description: "A reminder that one decision can transform your life.",
    url: "https://example.com/les-brown-eternity",
    category: "Life Purpose",
    gradient: "from-purple-400 to-pink-400",
  },
  {
    id: "preset-4",
    title: "NO EXCUSES",
    speaker: "Ben Lionel Scott",
    duration: "6 min",
    description: "A relentless challenge to stop delaying and start doing.",
    url: "https://example.com/no-excuses",
    category: "Take Action",
    gradient: "from-red-400 to-rose-400",
  },
  {
    id: "preset-5",
    title: "I WILL WIN",
    speaker: "Various Champions",
    duration: "6 min",
    description: "A declaration of belief, resilience, and inevitable victory.",
    url: "https://example.com/i-will-win",
    category: "Success",
    gradient: "from-blue-400 to-indigo-400",
  },
  {
    id: "preset-6",
    title: "UNSHAKEABLE",
    speaker: "Various Speakers",
    duration: "6 min",
    description: "Build an unshakable mindset when life hits hardest.",
    url: "https://example.com/unshakeable",
    category: "Mindset",
    gradient: "from-teal-400 to-green-400",
  },
  {
    id: "preset-7",
    title: "Top 10 Most Epic Motivational Speeches",
    speaker: "Goalcast Collection",
    duration: "10 x 6 min",
    description: "A legendary collection of the most epic motivational moments.",
    url: "https://example.com/epic-goalcast",
    category: "Epic Collection",
    gradient: "from-indigo-400 to-purple-400",
  },
  {
    id: "preset-8",
    title: "Watch This Everyday and Change Your Life",
    speaker: "Jim Rohn",
    duration: "6 min",
    description: "Timeless principles to quietly transform your entire life.",
    url: "https://example.com/jim-rohn-change",
    category: "Life Transformation",
    gradient: "from-green-400 to-emerald-400",
  },
];

const GRADIENT_CYCLE = [
  "from-orange-400 to-red-400",
  "from-yellow-400 to-orange-400",
  "from-purple-400 to-pink-400",
  "from-red-400 to-rose-400",
  "from-blue-400 to-indigo-400",
  "from-teal-400 to-green-400",
  "from-indigo-400 to-purple-400",
  "from-green-400 to-emerald-400",
];

const isTestEnv = process.env.NODE_ENV === "test";
const mockDelay = (ms = 150) =>
  new Promise((resolve) => setTimeout(resolve, isTestEnv ? 0 : ms));

type ApiSpeech = Speech;

let userSpeechesStore: ApiSpeech[] = [];
let aiSpeechesStore: ApiSpeech[] = [];

async function listSpeeches(): Promise<ApiSpeech[]> {
  await mockDelay();
  return [...userSpeechesStore];
}

async function listAISpeeches(): Promise<ApiSpeech[]> {
  await mockDelay();
  return [...aiSpeechesStore];
}

async function createSpeech(data: ApiSpeech): Promise<ApiSpeech> {
  await mockDelay();
  userSpeechesStore = [{ ...data }, ...userSpeechesStore];
  return data;
}

async function updateSpeech(data: ApiSpeech): Promise<ApiSpeech> {
  await mockDelay();
  userSpeechesStore = userSpeechesStore.map((speech) =>
    speech.id === data.id ? { ...speech, ...data } : speech
  );
  return data;
}

async function fetchAISpeeches(promptInput?: string): Promise<ApiSpeech[]> {
  const response = await fetch("/api/ai-speeches", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: promptInput }),
  });

  if (!response.ok) {
    throw new Error("Failed to reach AI speeches endpoint");
  }

  const data: { speeches?: ApiSpeech[] } = await response.json();
  return (
    data.speeches?.map((speech, index) => ({
      ...speech,
      id: speech.id ?? `ai-${Date.now()}-${index}`,
      duration: speech.duration ?? "6 min",
      category: CATEGORIES.includes(speech.category as (typeof CATEGORIES)[number])
        ? (speech.category as SpeechCategory)
        : "Other",
      gradient: speech.gradient ?? GRADIENT_CYCLE[index % GRADIENT_CYCLE.length],
    })) ?? []
  );
}

type AISpeechesContentProps = {
  initialCategory?: (typeof CATEGORIES)[number];
};

function AISpeechesContent({ initialCategory = "All" }: AISpeechesContentProps) {
  const [selectedCategory, setSelectedCategory] = useState<(typeof CATEGORIES)[number]>(initialCategory);
  const [showForm, setShowForm] = useState(false);
  const [editingSpeech, setEditingSpeech] = useState<Speech | null>(null);
  const [isAISpeechesLoading, setIsAISpeechesLoading] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const queryClient = useQueryClient();

  const { data: userSpeeches = [] } = useQuery({
    queryKey: ["speeches"],
    queryFn: listSpeeches,
  });

  const { data: aiSpeeches = [] } = useQuery({
    queryKey: ["ai-speeches"],
    queryFn: listAISpeeches,
  });

  const createSpeechMutation = useMutation({
    mutationFn: createSpeech,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["speeches"] });
      setShowForm(false);
    },
  });

  const updateSpeechMutation = useMutation({
    mutationFn: updateSpeech,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["speeches"] });
      setShowForm(false);
      setEditingSpeech(null);
    },
  });

  const allSpeeches = useMemo(() => {
    return [...HARDCODED_SPEECHES, ...aiSpeeches, ...userSpeeches];
  }, [userSpeeches, aiSpeeches]);
  const requestAISuggestions = async () => {
    try {
      setIsAISpeechesLoading(true);
      const promptText =
        aiPrompt.trim() ||
        "Suggest motivational speeches (5-6 min).";
      const suggestions = await fetchAISpeeches(promptText);
      aiSpeechesStore = [...suggestions, ...aiSpeechesStore];
      queryClient.invalidateQueries({ queryKey: ["ai-speeches"] });
    } catch (error) {
      console.error(error);
    } finally {
      setIsAISpeechesLoading(false);
    }
  };

  const handleEditSpeech = (speech: Speech) => {
    setEditingSpeech(speech);
    setShowForm(true);
  };

  const filteredSpeeches = useMemo(() => {
    if (selectedCategory === "All") {
      return allSpeeches;
    }
    return allSpeeches.filter((speech) => speech.category === selectedCategory);
  }, [selectedCategory, allSpeeches]);

  return (
    <div
      data-testid="ai-speeches-root"
      className="relative min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute right-[-4rem] top-[-4rem] h-72 w-72 rounded-full bg-orange-200/30 blur-3xl" />
        <div className="absolute bottom-[-4rem] left-[-4rem] h-80 w-80 rounded-full bg-rose-200/30 blur-3xl" />
      </div>

      <div className="relative min-h-screen">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10">
          <motion.header
            className="space-y-4 text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center justify-center gap-2 rounded-full border border-rose-100 bg-white/80 px-4 py-1 text-sm font-semibold text-rose-600 shadow-sm">
              <Mic2 className="h-4 w-4" />
              <span>Power Speeches</span>
            </div>

            <div className="space-y-2">
              <h1 className="text-4xl font-bold leading-tight text-balance bg-gradient-to-r from-rose-600 via-orange-600 to-amber-600 bg-clip-text text-transparent">
                Motivational Speeches
              </h1>
              <p className="text-base text-rose-900/80">
                Powerful 6-minute speeches to ignite your fire, fuel your ambition, and inspire action.
              </p>
            </div>
          </motion.header>

          <motion.section
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <div className="space-y-4 rounded-3xl border border-white/70 bg-white/80 p-4 shadow-lg backdrop-blur">
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((category, index) => {
                  const isActive = selectedCategory === category;
                  return (
                    <motion.div
                      key={category}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Button
                        variant="ghost"
                        className={`rounded-full px-6 py-3 text-sm font-medium transition ${
                          isActive
                            ? "bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-lg"
                            : "border border-gray-200 bg-white/60 text-gray-700 backdrop-blur-sm"
                        }`}
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category}
                      </Button>
                    </motion.div>
                  );
                })}
              </div>
              <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                {!showForm && (
                  <Button
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-rose-500 to-orange-500 px-6 py-3 text-white shadow-lg hover:from-rose-600 hover:to-orange-600"
                    onClick={() => {
                      setEditingSpeech(null);
                      setShowForm(true);
                    }}
                  >
                    <Plus className="h-4 w-4" />
                    Add Your Speech
                  </Button>
                )}
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={aiPrompt}
                    onChange={(event) => setAiPrompt(event.target.value)}
                    placeholder="Topic, speaker, or vibe..."
                    className="flex-1 rounded-full border border-gray-200 bg-white/70 px-4 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-orange-300"
                  />
                  <Button
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-3 text-white shadow-md hover:from-orange-600 hover:to-amber-600"
                    onClick={requestAISuggestions}
                    disabled={isAISpeechesLoading}
                  >
                    <Zap className="h-4 w-4" />
                    {isAISpeechesLoading ? "Getting AI suggestions..." : "Ask AI for Speeches"}
                  </Button>
                  {isAISpeechesLoading && <span className="text-sm font-medium text-rose-500">Getting AI suggestions...</span>}
                </div>
              </div>
            </div>

            {showForm && (
              <SpeechForm
                initialSpeech={editingSpeech}
                isLoading={createSpeechMutation.isPending || updateSpeechMutation.isPending}
                onCancel={() => {
                  setShowForm(false);
                  setEditingSpeech(null);
                }}
                onSubmit={(data) => {
                  if (editingSpeech) {
                    updateSpeechMutation.mutate({ ...editingSpeech, ...data });
                  } else {
                    createSpeechMutation.mutate({
                      id: `user-${Date.now()}`,
                      ...data,
                    });
                  }
                }}
              />
            )}

            {filteredSpeeches.length === 0 ? (
              <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-rose-100/80 bg-white/70 p-10 text-center text-rose-900/70">
                <Mic2 className="h-16 w-16 text-rose-300" />
                <p className="text-lg font-semibold">No speeches in this category</p>
                <p className="text-sm text-rose-800/80">Try selecting a different category.</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <AnimatePresence>
                  {filteredSpeeches.map((speech, index) => (
                    <SpeechCard
                      key={speech.id}
                      speech={speech}
                      index={index}
                      canEdit={speech.id.startsWith("user-")}
                      onEdit={() => handleEditSpeech(speech)}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </motion.section>
        </div>
      </div>
    </div>
  );
}

export default function AISpeechesPage() {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <AISpeechesContent />
    </QueryClientProvider>
  );
}

export function __resetSpeechStores() {
  userSpeechesStore = [];
  aiSpeechesStore = [];
}

export { CATEGORIES, HARDCODED_SPEECHES, type Speech, type SpeechCategory };
