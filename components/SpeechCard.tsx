'use client';

import { AnimatePresence, motion } from "framer-motion";
import { Clock, ExternalLink, Play } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Speech } from "@/app/ai-speeches/page";

type SpeechCardProps = {
  speech: Speech;
  index?: number;
  canEdit?: boolean;
  onEdit?: () => void;
};

export function SpeechCard({ speech, index = 0, canEdit = false, onEdit }: SpeechCardProps) {
  const gradient = speech.gradient ?? "from-rose-200 to-amber-200";

  const handleWatch = () => {
    window.open(speech.url, "_blank", "noopener,noreferrer");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="h-full"
    >
      <Card
        data-testid="speech-card"
        className="flex h-full flex-col overflow-hidden border border-rose-100/70 bg-white/90 shadow-xl backdrop-blur-sm"
      >
        <div data-testid="speech-gradient-bar" className={`h-2 w-full bg-gradient-to-r ${gradient}`} />
        <CardContent className="flex h-full flex-col gap-2 p-5">
          {speech.duration && (
            <span className="inline-flex w-max items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
              <Clock className="h-3.5 w-3.5" />
              {speech.duration}
            </span>
          )}

          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-xl font-bold text-gray-900">{speech.title}</h3>
              <p className="text-sm font-medium text-gray-600">by {speech.speaker}</p>
            </div>
            {canEdit && onEdit && (
              <Button variant="outline" size="sm" className="rounded-full" onClick={onEdit}>
                Edit
              </Button>
            )}
          </div>

          {speech.description && (
            <p className="flex-1 text-sm leading-relaxed text-gray-600">{speech.description}</p>
          )}

          <span className={`inline-block w-max rounded-full bg-gradient-to-r ${gradient} px-3 py-1 text-xs font-semibold text-white`}>
            {speech.category}
          </span>

          <Button
            className="mt-auto w-full bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 text-white hover:from-rose-600 hover:via-orange-600 hover:to-amber-600"
            onClick={handleWatch}
          >
            <Play className="h-4 w-4 fill-white" />
            Watch Speech
            <ExternalLink className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

