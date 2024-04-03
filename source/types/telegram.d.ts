import { Telegraf, Telegram } from "telegraf";
import OpenAI from "openai";

export interface TextMessage {
  text: string,
  from: { id: number }
}

export type UserId = number | string;