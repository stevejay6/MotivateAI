import { useEffect, useMemo, useState, type ComponentType } from "react";
import { format } from "date-fns";
import { Cloud, Frown, Meh, Smile, Sun } from "lucide-react";

import type { JournalEntry, Mood } from "@/app/ai-kick-in-the-pants/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const MOOD_OPTIONS: { value: Mood; label: string; icon: ComponentType<{ className?: string }>; colors: string }[] = [
  { value: "amazing", label: "Amazing", icon: Sun, colors: "bg-yellow-50 text-yellow-500" },
  { value: "good", label: "Good", icon: Smile, colors: "bg-green-50 text-green-500" },
  { value: "okay", label: "Okay", icon: Meh, colors: "bg-blue-50 text-blue-500" },
  { value: "challenging", label: "Challenging", icon: Cloud, colors: "bg-gray-50 text-gray-500" },
  { value: "difficult", label: "Difficult", icon: Frown, colors: "bg-purple-50 text-purple-500" },
];

type JournalFormProps = {
  entry: JournalEntry | null;
  onSubmit: (data: Omit<JournalEntry, "id">) => void;
  onCancel: () => void;
  isLoading: boolean;
};

export function JournalForm({ entry, onSubmit, onCancel, isLoading }: JournalFormProps) {
  const today = useMemo(() => format(new Date(), "yyyy-MM-dd"), []);
  const [date, setDate] = useState(today);
  const [mood, setMood] = useState<Mood | "">("");
  const [gratitude, setGratitude] = useState<string[]>(["", "", ""]);
  const [highlights, setHighlights] = useState("");
  const [reflection, setReflection] = useState("");

  useEffect(() => {
    if (entry) {
      setDate(entry.date);
      setMood(entry.mood);
      setGratitude([entry.gratitude?.[0] ?? "", entry.gratitude?.[1] ?? "", entry.gratitude?.[2] ?? ""]);
      setHighlights(entry.highlights ?? "");
      setReflection(entry.reflection ?? "");
    } else {
      setDate(today);
      setMood("");
      setGratitude(["", "", ""]);
      setHighlights("");
      setReflection("");
    }
  }, [entry, today]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!date || !mood) {
      return;
    }
    const filteredGratitude = gratitude.map((value) => value.trim()).filter(Boolean);
    onSubmit({
      date,
      mood,
      gratitude: filteredGratitude,
      highlights: highlights.trim() || undefined,
      reflection: reflection.trim() || undefined,
    });
  };

  const canSubmit = Boolean(date && mood && !isLoading);

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-2xl border border-blue-100 bg-white/90 p-6 shadow-2xl backdrop-blur"
    >
      <div className="flex flex-wrap gap-4">
        <div className="flex flex-1 flex-col gap-2 min-w-[160px]">
          <label className="text-sm font-semibold text-slate-600">Date</label>
          <Input type="date" value={date} onChange={(event) => setDate(event.target.value)} required />
        </div>

        <div className="flex-1">
          <p className="mb-2 text-sm font-semibold text-slate-600">Mood</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            {MOOD_OPTIONS.map((option) => {
              const Icon = option.icon;
              const isActive = mood === option.value;
              return (
                <button
                  type="button"
                  key={option.value}
                  onClick={() => setMood(option.value)}
                  className={`flex flex-col items-center gap-2 rounded-2xl border border-transparent px-3 py-3 text-center text-sm font-medium transition-all ${option.colors} ${
                    isActive ? "ring-2 ring-teal-500" : "hover:border-teal-200"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-semibold text-slate-600">What are you grateful for?</p>
        <div className="grid gap-3 sm:grid-cols-3">
          {gratitude.map((value, index) => (
            <Input
              key={`gratitude-${index}`}
              placeholder={`Gratitude ${index + 1}`}
              value={value}
              onChange={(event) => {
                const next = [...gratitude];
                next[index] = event.target.value;
                setGratitude(next);
              }}
            />
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-slate-600">Highlights</label>
          <Textarea
            rows={4}
            placeholder="Call out your wins or meaningful moments."
            value={highlights}
            onChange={(event) => setHighlights(event.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-slate-600">Reflection</label>
          <Textarea
            rows={4}
            placeholder="What thoughts or lessons stood out today?"
            value={reflection}
            onChange={(event) => setReflection(event.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-wrap justify-end gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-gradient-to-r from-teal-500 to-green-500 text-white hover:from-teal-600 hover:to-green-600"
          disabled={!canSubmit}
        >
          {isLoading ? "Saving..." : "Save Entry"}
        </Button>
      </div>
    </form>
  );
}

