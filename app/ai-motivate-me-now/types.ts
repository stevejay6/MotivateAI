export type Role = "user" | "ai";

export type ChatMessage = {
  role: Role;
  content: string;
  timestamp: string;
};

export const SESSION_LIMIT = 8;


