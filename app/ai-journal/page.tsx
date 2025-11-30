"use client";

import {
  KeyboardEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { motion } from "framer-motion";

type MessageRole = "guide" | "journaler";

interface Message {
  id: string;
  role: MessageRole;
  content: string;
}

const initialMessages: Message[] = [
  {
    id: "m1",
    role: "guide",
    content:
      "Welcome back. Take a breath and share the highlight of your day so far.",
  },
  {
    id: "m2",
    role: "journaler",
    content:
      "I felt proud finishing a daunting task, but a lingering worry kept tapping my shoulder.",
  },
  {
    id: "m3",
    role: "guide",
    content:
      "Let’s explore that worry. What’s the story you’re telling yourself underneath it?",
  },
];

const systemPrompt = `You are a compassionate journaling companion named "Reflective Guide."
- Respond with warmth, curiosity, and psychological safety.
- Use one or two short paragraphs (2-4 sentences) plus an optional reflective prompt.
- Encourage self-awareness, values alignment, and insight without giving prescriptive advice.
- If the user reaches eight AI reflections, affirm their effort and invite them to review their insights.`;

const bubbleStyles: Record<MessageRole, string> = {
  guide: "self-start bg-purple-50 text-purple-900 border border-purple-100",
  journaler: "self-end bg-white text-gray-900 border border-gray-100",
};

export default function AIJournalPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [aiMessageCount, setAiMessageCount] = useState(0);
  const [sessionComplete, setSessionComplete] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const sessionStatusCopy = useMemo(() => {
    if (sessionComplete) {
      return "Session complete · summary ready";
    }
    return `${aiMessageCount} / 8 AI reflections logged`;
  }, [aiMessageCount, sessionComplete]);

  const sendAIMessage = useCallback(
    async (history: Message[]): Promise<string> => {
      const formattedHistory = history.map((message) => ({
        role: message.role === "guide" ? "assistant" : "user",
        content: message.content,
      }));

      const response = await fetch("/api/ai-journal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          systemPrompt,
          messages: formattedHistory,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to reach AI journal API.");
      }

      const data = await response.json();
      return data?.message ?? "I’m here with you. Tell me more.";
    },
    []
  );

  const handleSend = useCallback(async () => {
    if (sessionComplete || isLoading) return;
    const trimmed = inputMessage.trim();
    if (!trimmed) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "journaler",
      content: trimmed,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    const history = [...messages, userMessage];

    try {
      const aiContent = await sendAIMessage(history);
      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        role: "guide",
        content: aiContent,
      };
      setMessages((prev) => [...prev, aiMessage]);
      setAiMessageCount((prev) => {
        const next = prev + 1;
        if (next >= 8) {
          setSessionComplete(true);
        }
        return next;
      });
    } catch (error) {
      console.error(error);
      const fallbackMessage: Message = {
        id: `ai-error-${Date.now()}`,
        role: "guide",
        content:
          "I’m having a little trouble connecting right now, but I’m still here with you. Let’s pick up where we left off.",
      };
      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [
    aiMessageCount,
    inputMessage,
    isLoading,
    messages,
    sendAIMessage,
    sessionComplete,
  ]);

  const resetSession = useCallback(() => {
    setMessages([]);
    setInputMessage("");
    setIsLoading(false);
    setAiMessageCount(0);
    setSessionComplete(false);
  }, []);

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 py-12 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        <motion.header
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="text-center space-y-2"
          >
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-purple-500">
            Daily Reflection
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Reflective Journaling
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            A gentle space to unpack today’s story. Share up to eight thoughts
            with your AI journaling guide, then receive a completion summary.
          </p>
        </motion.header>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
          className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-[0_20px_45px_rgba(15,23,42,0.1)] border border-white/60"
        >
          <div className="px-6 py-4 border-b border-white/70 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-purple-600">
                {sessionComplete ? "Session closed" : "Session in progress"}
              </p>
              <p className="text-xs text-gray-500">{sessionStatusCopy}</p>
            </div>
            <span className="text-xs font-medium px-3 py-1 rounded-full bg-purple-100 text-purple-700">
              Guided mode
            </span>
          </div>

          <div className="px-6 py-8">
            <div className="h-[500px] overflow-y-auto space-y-4 pr-2">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className={`max-w-[80%] rounded-2xl px-5 py-3 text-sm leading-relaxed shadow-sm ${
                    bubbleStyles[message.role]
                  }`}
                >
                  <p className="mb-1 text-xs uppercase tracking-wide font-semibold text-gray-400">
                    {message.role === "guide" ? "AI Guide" : "You"}
                  </p>
                  <p className="text-base text-gray-800">{message.content}</p>
                </motion.div>
              ))}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="self-start inline-flex items-center gap-2 rounded-2xl bg-purple-50 px-4 py-2 text-sm text-purple-700 border border-purple-100"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500" />
                  </span>
                  AI is reflecting…
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {!sessionComplete ? (
              <div className="mt-8 border-t border-gray-100 pt-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <textarea
                    aria-label="Journal entry"
                    placeholder="Capture what’s alive for you right now..."
                    value={inputMessage}
                    onChange={(event) => setInputMessage(event.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 resize-none rounded-2xl border border-gray-200 bg-white/70 px-4 py-3 text-sm text-gray-900 shadow-inner focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 disabled:opacity-60"
                    rows={3}
                    disabled={sessionComplete}
                  />
                  <button
                    type="button"
                    onClick={handleSend}
                    disabled={sessionComplete || isLoading}
                    className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:from-purple-600 hover:to-pink-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-purple-400 disabled:opacity-60"
                  >
                    {sessionComplete ? "Session complete" : "Send reflection"}
                  </button>
                </div>
                <p className="mt-3 text-xs text-gray-500">
                  Prompt idea: “Today I noticed… and it made me feel…”
                </p>
              </div>
            ) : (
              <div className="mt-10 border-t border-gray-100 pt-8 text-center space-y-4">
                <div className="inline-flex items-center gap-3 text-sm font-semibold text-green-600 bg-green-50 border border-green-100 rounded-full px-5 py-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M21.707 5.293a1 1 0 0 1 0 1.414l-11 11a1 1 0 0 1-1.414 0l-5-5a1 1 0 0 1 1.414-1.414L10 15.586 20.293 5.293a1 1 0 0 1 1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Reflection complete
                </div>
                <p className="text-lg font-medium text-gray-800">
                  Your 8-turn reflection is complete. See you tomorrow. 🌙
                </p>
                <button
                  type="button"
                  onClick={resetSession}
                  className="inline-flex items-center justify-center rounded-2xl border border-purple-200 bg-white px-6 py-3 text-sm font-semibold text-purple-600 shadow-sm transition hover:bg-purple-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
                >
                  Start New Session
                </button>
              </div>
            )}
          </div>
        </motion.section>
      </div>
    </div>
  );
}

