import { Telegraf, Telegram } from "telegraf";
import OpenAI from "openai";
import { InlineKeyboardButton } from "telegraf/typings/core/types/typegram";

export interface TextMessage {
  text: string,
  from: { id: number }
}

export type UserId = number | string;