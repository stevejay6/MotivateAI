'use client';

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Flame, Send, Zap } from "lucide-react";
import { useEffect, useRef, useState, type ChangeEvent, type KeyboardEvent } from "react";

import type { ChatMessage } from "@/app/ai-motivate-me-now/types";
import { SESSION_LIMIT } from "@/app/ai-motivate-me-now/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { buildActionCoachPrompt, fetchCoachReply } from "@/lib/aiMotivateMeNow";

type AIMotivateMeNowViewProps = {
  initialMessages?: ChatMessage[];
  initialIsLoading?: boolean;
  initialSessionComplete?: boolean;
  initialAiMessageCount?: number;
};

const FINAL_CHALLENGE_MESSAGE = "You've got your fire back. Now GO. Take action. No more talking - DO IT! 🔥";
const ERROR_MESSAGE = "Coach couldn't reach the fire pit. Reload and try again.";

export default function AIMotivateMeNowView({
  initialMessages = [],
  initialIsLoading = false,
  initialSessionComplete = false,
  initialAiMessageCount = 0,
}: AIMotivateMeNowViewProps = {}) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(initialIsLoading);
  const [sessionComplete, setSessionComplete] = useState(initialSessionComplete);
  const [aiMessageCount, setAiMessageCount] = useState(initialAiMessageCount);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView?.({ behavior: "smooth" });
  }, [messages]);

  const startNewSession = () => {
    setMessages([]);
    setInputMessage("");
    setAiMessageCount(0);
    setSessionComplete(false);
    setIsLoading(false);
    messagesEndRef.current?.scrollIntoView?.({ behavior: "smooth" });
  };

  const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setInputMessage(event.target.value);
  };

  const handleSendMessage = async () => {
    const trimmedMessage = inputMessage.trim();
    if (!trimmedMessage || isLoading || sessionComplete) {
      return;
    }

    const userMessage: ChatMessage = {
      role: "user",
      content: trimmedMessage,
      timestamp: new Date().toISOString(),
    };

    const historyBeforeSend = [...messages];

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const fullPrompt = buildActionCoachPrompt(historyBeforeSend, trimmedMessage);
      const reply = await fetchCoachReply(fullPrompt);

      const aiMessage: ChatMessage = {
        role: "ai",
        content: reply.trim(),
        timestamp: new Date().toISOString(),
      };

      const nextCount = aiMessageCount + 1;

      setMessages((prev) => {
        const updated = [...prev, aiMessage];
        if (nextCount >= SESSION_LIMIT) {
          return [
            ...updated,
            {
              role: "ai",
              content: FINAL_CHALLENGE_MESSAGE,
              timestamp: new Date().toISOString(),
            },
          ];
        }
        return updated;
      });

      setAiMessageCount(nextCount);
      if (nextCount >= SESSION_LIMIT) {
        setSessionComplete(true);
      }
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: ERROR_MESSAGE,
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void handleSendMessage();
    }
  };

  const isSendDisabled = isLoading || inputMessage.trim() === "" || sessionComplete;

  const isEmptyState = messages.length === 0 && !isLoading;
  const loadingDots = [0, 1, 2];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-rose-50">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute right-[-4rem] top-[-4rem] h-72 w-72 rounded-full bg-orange-200/20 blur-3xl" />
        <div className="absolute bottom-[-4rem] left-[-4rem] h-80 w-80 rounded-full bg-red-200/20 blur-3xl" />
      </div>

      <div className="relative min-h-screen flex flex-col">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.header className="space-y-4 text-center">
              <div className="inline-flex items-center justify-center gap-2 rounded-full border border-orange-100 bg-white/80 px-4 py-1 text-sm font-semibold text-orange-700 shadow-sm">
                <Flame className="h-4 w-4" />
                <span>Action Coach</span>
              </div>

              <div className="space-y-3">
                <h1 className="text-4xl font-bold leading-tight text-balance bg-gradient-to-r from-orange-600 via-red-600 to-rose-600 bg-clip-text text-transparent">
                  AI Motivate Me Now
                </h1>
                <p className="text-base text-orange-900/80">
                  No excuses. No tomorrow. Just ACTION. Get the push you need to start NOW.
                </p>
              </div>

              <div className="mx-auto inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-red-600 shadow">
                <Zap className="h-4 w-4" />
                <span>
                  {aiMessageCount}/{SESSION_LIMIT} pushes
                </span>
              </div>
            </motion.header>
          </motion.div>

          <motion.section
            className="space-y-6"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            <Card className="rounded-2xl border-none bg-white/90 p-4 shadow-2xl backdrop-blur sm:p-6">
              <CardContent className="space-y-4 p-0">
                <div className="h-[500px] overflow-y-auto rounded-2xl border border-orange-100/80 bg-white/70 p-4">
                  {isEmptyState ? (
                    <div className="flex h-full flex-col items-center justify-center gap-4 text-center text-orange-900/80">
                      <Flame className="h-16 w-16 text-orange-400" />
                      <div className="space-y-2">
                        <p className="text-lg font-semibold">What&apos;s holding you back? Say it.</p>
                        <p className="text-sm text-gray-600">Be honest. Your coach is listening.</p>
                      </div>
                    </div>
                  ) : (
                    <AnimatePresence initial={false}>
                      {messages.map((message) => {
                        const isUser = message.role === "user";
                        return (
                          <motion.div
                            key={message.timestamp}
                            data-testid="message-row"
                            data-role={message.role}
                            className={`mb-2 flex ${isUser ? "justify-end" : "justify-start"}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div
                              data-testid="message-bubble"
                              data-role={message.role}
                              className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm shadow ${
                                isUser
                                  ? "rounded-br-sm bg-gradient-to-r from-orange-500 to-red-500 text-white"
                                  : "rounded-bl-sm border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-red-50 font-semibold text-gray-900"
                              }`}
                            >
                              {message.content}
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {isLoading && (
                  <div className="flex items-center gap-2 rounded-xl border border-orange-100/80 bg-orange-50/70 p-3 text-xs font-medium text-orange-900/80">
                    Thinking
                    {loadingDots.map((dot) => (
                      <motion.span
                        key={dot}
                        data-testid="loading-dot"
                        className="h-2 w-2 rounded-full bg-orange-500"
                        animate={{ opacity: [0.3, 1, 0.3], y: [0, -4, 0] }}
                        transition={{
                          duration: 0.8,
                          repeat: Infinity,
                          delay: dot * 0.15,
                          ease: "easeInOut",
                        }}
                      />
                    ))}
                  </div>
                )}

                {sessionComplete && (
                  <div className="flex flex-col items-center gap-4 rounded-2xl border border-orange-100/80 bg-orange-50/70 p-4 text-center">
                    <CheckCircle2 className="h-10 w-10 text-orange-500" />
                    <p className="text-base font-semibold text-orange-900/90">You&apos;re fired up. Now ACT!</p>
                    <Button
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white shadow hover:from-orange-600 hover:to-red-600"
                      onClick={startNewSession}
                    >
                      <Flame className="h-4 w-4" />
                      Get Another Push
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="inline-flex items-center gap-2 rounded-full border border-rose-100/80 bg-white/90 px-4 py-2 text-sm font-semibold text-rose-600 shadow">
              <Zap className="h-4 w-4" />
              <span>
                {aiMessageCount}/{SESSION_LIMIT} pushes
              </span>
            </div>

            {!sessionComplete && (
              <Card className="rounded-3xl border border-rose-100/70 bg-white/90 shadow-xl backdrop-blur">
                <CardContent className="space-y-4 p-6 sm:p-8">
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-rose-900/80">Your next move</p>
                    <Textarea
                      placeholder="What are you avoiding? What excuse are you making?"
                      className="min-h-[80px] resize-none border-orange-100/80 focus-visible:ring-orange-200"
                      value={inputMessage}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyDown}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-600 to-red-600 text-white shadow hover:from-orange-700 hover:to-red-700"
                      disabled={isSendDisabled}
                      onClick={handleSendMessage}
                    >
                      <Send className="h-4 w-4" />
                      Send push
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.section>

          <motion.p
            className="text-center text-sm text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            🔥 Stop planning. Start doing. Your coach believes you can do more.
          </motion.p>
        </div>
      </div>
    </div>
  );
}

export type { AIMotivateMeNowViewProps };

