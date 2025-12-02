'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type KeyboardEvent,
  type RefObject,
  type SetStateAction,
} from "react";

import type { Message } from "@/app/emotional-coach/types";
import { buildCoachPrompt, fetchCoachReply } from "@/lib/emotionalCoach";

export type EmotionalCoachState = {
  messages: Message[];
  inputMessage: string;
  setInputMessage: Dispatch<SetStateAction<string>>;
  isLoading: boolean;
  sessionComplete: boolean;
  aiMessageCount: number;
  messagesEndRef: RefObject<HTMLDivElement>;
  handleSendMessage: () => Promise<void>;
  handleKeyPress: (event: KeyboardEvent<HTMLTextAreaElement>) => void;
  startNewSession: () => void;
};

export const SESSION_COMPLETION_MESSAGE =
  "You've completed this coaching session. Take a moment to breathe and be kind to yourself.";

export function useEmotionalCoachState(): EmotionalCoachState {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [aiMessageCount, setAiMessageCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView?.({ behavior: "smooth" });
  }, [messages]);

  const startNewSession = useCallback(() => {
    setMessages([]);
    setInputMessage("");
    setAiMessageCount(0);
    setSessionComplete(false);
    setIsLoading(false);
  }, []);

  const handleSendMessage = useCallback(async () => {
    const trimmedMessage = inputMessage.trim();
    if (!trimmedMessage || isLoading || sessionComplete) {
      return;
    }

    const historyBeforeSend = messages;
    const userMessage: Message = {
      role: "user",
      content: trimmedMessage,
      timestamp: `${Date.now()}-user`,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const fullPrompt = buildCoachPrompt(historyBeforeSend, trimmedMessage);
      const reply = await fetchCoachReply(fullPrompt);

      const aiMessage: Message = {
        role: "ai",
        content: reply.trim(),
        timestamp: `${Date.now()}-ai`,
      };

      const nextCount = aiMessageCount + 1;

      setMessages((prev) => {
        const updated = [...prev, aiMessage];
        if (nextCount >= 12) {
          return [
            ...updated,
            {
              role: "ai",
              content: SESSION_COMPLETION_MESSAGE,
              timestamp: `${Date.now()}-session-complete`,
            },
          ];
        }
        return updated;
      });

      setAiMessageCount(nextCount);
      if (nextCount >= 12) {
        setSessionComplete(true);
      }
    } catch (error) {
      const errorMessage: Message = {
        role: "ai",
        content: "I'm sorry, something went wrong. Let's pause and try sharing that again.",
        timestamp: `${Date.now()}-error`,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [inputMessage, isLoading, sessionComplete, messages, aiMessageCount]);

  const handleKeyPress = useCallback(
    (event: KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        void handleSendMessage();
      }
    },
    [handleSendMessage]
  );

  return {
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
  };
}

