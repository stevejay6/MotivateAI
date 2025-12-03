'use client';

import { useEffect, useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

import type { Speech, SpeechCategory } from "@/app/ai-speeches/page";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const GRADIENT_OPTIONS = [
  { label: "Orange-Red", value: "from-orange-400 to-red-400" },
  { label: "Yellow-Orange", value: "from-yellow-400 to-orange-400" },
  { label: "Purple-Pink", value: "from-purple-400 to-pink-400" },
  { label: "Red-Rose", value: "from-red-400 to-rose-400" },
  { label: "Blue-Indigo", value: "from-blue-400 to-indigo-400" },
  { label: "Teal-Green", value: "from-teal-400 to-green-400" },
  { label: "Indigo-Purple", value: "from-indigo-400 to-purple-400" },
  { label: "Green-Emerald", value: "from-green-400 to-emerald-400" },
] as const;

type SpeechFormProps = {
  initialSpeech?: Speech | null;
  onSubmit: (data: Omit<Speech, "id">) => void;
  onCancel: () => void;
  isLoading: boolean;
};

export function SpeechForm({ initialSpeech, onSubmit, onCancel, isLoading }: SpeechFormProps) {
  const [title, setTitle] = useState("");
  const [speaker, setSpeaker] = useState("");
  const [url, setUrl] = useState("");
  const [duration, setDuration] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<SpeechCategory>("Other");
  const [gradient, setGradient] = useState(GRADIENT_OPTIONS[0].value);

  useEffect(() => {
    if (initialSpeech) {
      setTitle(initialSpeech.title);
      setSpeaker(initialSpeech.speaker);
      setUrl(initialSpeech.url);
      setDuration(initialSpeech.duration ?? "");
      setDescription(initialSpeech.description ?? "");
      setCategory(initialSpeech.category);
      setGradient(initialSpeech.gradient ?? GRADIENT_OPTIONS[0].value);
    } else {
      setTitle("");
      setSpeaker("");
      setUrl("");
      setDuration("");
      setDescription("");
      setCategory("Other");
      setGradient(GRADIENT_OPTIONS[0].value);
    }
  }, [initialSpeech]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim() || !speaker.trim() || !url.trim()) {
      return;
    }
    onSubmit({
      title: title.trim(),
      speaker: speaker.trim(),
      url: url.trim(),
      duration: duration.trim() || undefined,
      description: description.trim() || undefined,
      category,
      gradient,
    });
  };

  const isSubmitDisabled = isLoading || !title.trim() || !speaker.trim() || !url.trim();

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, height: 0 }}
      animate={{ opacity: 1, y: 0, height: "auto" }}
      className="overflow-hidden"
    >
      <Card className="border border-rose-100/70 bg-white/90 shadow-2xl backdrop-blur">
        <CardContent className="space-y-6 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-rose-500">{initialSpeech ? "Edit Speech" : "Add New Speech"}</p>
              <h2 className="text-2xl font-bold text-gray-900">{initialSpeech ? "Update your motivational speech" : "Share a motivational speech"}</h2>
            </div>
            <Button variant="ghost" className="rounded-full" onClick={onCancel}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="speech-title">Title</Label>
                <Input
                  id="speech-title"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Enter the speech title"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="speech-speaker">Speaker</Label>
                <Input
                  id="speech-speaker"
                  value={speaker}
                  onChange={(event) => setSpeaker(event.target.value)}
                  placeholder="Who delivers this speech?"
                  required
                />
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="speech-url">URL</Label>
                <Input
                  id="speech-url"
                  type="url"
                  value={url}
                  onChange={(event) => setUrl(event.target.value)}
                  placeholder="https://example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="speech-duration">Duration</Label>
                <Input
                  id="speech-duration"
                  value={duration}
                  onChange={(event) => setDuration(event.target.value)}
                  placeholder="e.g. 6 min"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="speech-category">Category</Label>
              <Select value={category} onValueChange={(value) => setCategory(value as SpeechCategory)}>
                <SelectTrigger id="speech-category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {[
                    "Morning Motivation",
                    "Life Purpose",
                    "Take Action",
                    "Success",
                    "Mindset",
                    "Epic Collection",
                    "Life Transformation",
                    "Other",
                  ].map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="speech-description">Description</Label>
              <Textarea
                id="speech-description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={4}
                placeholder="What makes this speech powerful?"
              />
            </div>

            <div className="space-y-3">
              <Label>Gradient Accent</Label>
              <div className="grid gap-2 sm:grid-cols-2">
                {GRADIENT_OPTIONS.map((option) => {
                  const isActive = gradient === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setGradient(option.value)}
                      className={`flex items-center justify-between rounded-2xl border px-4 py-2 text-sm font-medium transition ${
                        isActive ? "border-rose-400 bg-white shadow" : "border-gray-200 bg-white/60"
                      }`}
                    >
                      <span>{option.label}</span>
                      <span className={`h-6 w-16 rounded-full bg-gradient-to-r ${option.value}`} />
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-4 sm:flex-row">
              <Button
                type="submit"
                disabled={isSubmitDisabled}
                className="flex-1 rounded-full bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-lg hover:from-rose-600 hover:to-orange-600"
              >
                {isLoading ? "Saving..." : "Save Speech"}
              </Button>
              <Button type="button" variant="outline" className="flex-1 rounded-full border-gray-200" onClick={onCancel} disabled={isLoading}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}

