"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Heart, RotateCcw, Send, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useEmotionalCoachState } from "@/app/emotional-coach/useEmotionalCoachState";

const supportMessages = [
  {
    id: "welcome",
    role: "Coach",
    content: "Whenever you're ready, I'm here to listen without judgment.",
  },
  {
    id: "gentle-prompt",
    role: "Coach",
    content: "You can share as much or as little as feels comfortable right now.",
  },
];

export default function EmotionalCoachPage() {
  const {
    messages,
    inputMessage,
    setInputMessage,
    isLoading,
    sessionComplete,
    aiMessageCount,
    messagesEndRef,
    handleSendMessage,
    handleKeyPress,
    startNewSession,
  } = useEmotionalCoachState();

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute right-[-4rem] top-[-4rem] h-72 w-72 rounded-full bg-rose-200/30 blur-3xl" />
        <div className="absolute bottom-[-4rem] left-[-4rem] h-80 w-80 rounded-full bg-purple-200/30 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-3xl flex-col px-4 py-10">
        <motion.div
          className="space-y-4 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center justify-center gap-2 rounded-full border border-rose-100 bg-white/70 px-4 py-1 text-sm font-medium text-rose-600 shadow-sm">
            <Heart className="h-4 w-4" />
            <span>Emotional Support</span>
          </div>

          <h1 className="text-4xl font-bold leading-tight text-balance bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
            Emotional Coach
          </h1>

          <p className="text-base text-rose-900/70">
            Share what's on your heart. I'm here to listen, support, and guide you with empathy.
          </p>
        </motion.div>

        <section className="mt-10 flex flex-1 flex-col gap-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="rounded-2xl border-none bg-white/90 p-4 shadow-2xl backdrop-blur sm:p-6">
              <CardContent className="space-y-6 p-0 sm:p-0">
                <AnimatePresence>
                  {supportMessages.map((message, index) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -16 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <div className="flex items-start gap-4 rounded-2xl bg-rose-50/70 p-4 shadow-sm">
                        <div className="rounded-full bg-white p-2 text-rose-500 shadow">
                          <Sparkles className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-rose-700">{message.role}</p>
                          <p className="text-base text-rose-900/80">{message.content}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                <div className="rounded-2xl border border-dashed border-rose-100/80 bg-white/70 p-4 text-sm text-rose-900/80">
                  Sessions are capped at 12 thoughtful exchanges and stay within this browser session so you can reflect freely.
                </div>

                <div className="max-h-[500px] overflow-y-auto rounded-2xl border border-white/70 bg-white/80 p-4">
                  {messages.length === 0 && !isLoading ? (
                    <div className="flex flex-col items-center justify-center gap-3 py-10 text-center text-rose-900/80">
                      <Heart className="h-16 w-16 text-rose-300" />
                      <div className="space-y-1">
                        <p className="text-lg font-semibold text-rose-800">How are you feeling today?</p>
                        <p className="text-sm text-rose-900/70">Share whatever is on your mind</p>
                      </div>
                    </div>
                  ) : (
                    <AnimatePresence initial={false}>
                      {messages.map((message) => {
                        const isUser = message.role === "user";
                        return (
                          <motion.div
                            key={message.timestamp}
                            data-testid="message-wrapper"
                            data-role={message.role}
                            className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -12 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div
                              className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm shadow ${
                                isUser
                                  ? "rounded-br-sm bg-gradient-to-r from-rose-500 to-pink-500 text-white"
                                  : "rounded-bl-sm border border-rose-100 bg-gradient-to-r from-rose-50 to-pink-50 text-gray-700"
                              }`}
                            >
                              <p>{message.content}</p>
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  )}

                  {isLoading && (
                    <div className="mt-6 flex justify-start">
                      <div className="flex items-center gap-2" aria-label="Generating response">
                        {[0, 1, 2].map((index) => (
                          <motion.span
                            key={index}
                            data-testid="loading-dot"
                            className="h-2 w-2 rounded-full bg-rose-400"
                            animate={{ opacity: [0.3, 1, 0.3], y: [0, -6, 0] }}
                            transition={{ duration: 0.9, repeat: Infinity, delay: index * 0.15, ease: "easeInOut" }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {sessionComplete && (
                  <div className="rounded-2xl border border-rose-100/80 bg-rose-50/70 p-4 text-center text-rose-900/80">
                    <p className="text-sm">
                      You've completed this coaching session. Whenever you're ready, you can begin a new space for reflection.
                    </p>
                    <Button
                      className="mt-4 inline-flex items-center gap-2 bg-white text-rose-600 hover:bg-rose-100"
                      onClick={startNewSession}
                    >
                      <RotateCcw className="h-4 w-4" />
                      Start New Session
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {!sessionComplete && (
            <motion.div
              className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-lg backdrop-blur"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="mb-4 flex items-center gap-2 text-sm font-medium text-rose-600">
                <Sparkles className="h-4 w-4" />
                <span>{aiMessageCount}/12 reflections</span>
              </div>

              <label htmlFor="emotional-coach-input" className="mb-3 block text-sm font-medium text-rose-900/80">
                What would you like to share?
              </label>
              <Textarea
                id="emotional-coach-input"
                placeholder="Share what you're feeling..."
                className="min-h-[140px] resize-none border-rose-100/80 bg-white/80 text-base focus-visible:ring-rose-200"
                value={inputMessage}
                onChange={(event) => setInputMessage(event.target.value)}
                onKeyDown={handleKeyPress}
                disabled={isLoading}
              />

              <div className="mt-4 flex flex-wrap gap-3">
                <Button
                  className="gap-2 bg-rose-500 text-white hover:bg-rose-600"
                  disabled={isLoading || !inputMessage.trim()}
                  onClick={handleSendMessage}
                >
                  <Send className="h-4 w-4" />
                  Send
                </Button>
                <Button variant="ghost" className="gap-2 text-rose-600 hover:bg-rose-50" disabled>
                  <RotateCcw className="h-4 w-4" />
                  Reset Session
                </Button>
              </div>
            </motion.div>
          )}
        </section>
      </div>
    </div>
  );
}

