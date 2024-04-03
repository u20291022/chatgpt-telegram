export type Role = "assistant" | "user";

export interface ChatGPTMessage {
  role: Role,
  content: string
}

export interface UsersHistory {
  [userId: string]: ChatGPTMessage[];
}