'use client';

export type Message = {
  role: "user" | "ai";
  content: string;
  timestamp: string;
};

