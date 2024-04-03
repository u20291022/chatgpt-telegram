import { TelegramBotWithAI } from "./telegram/bot";
import { TextGenerator } from "./openai/text-generator";
import { ImageGenerator } from "./openai/image-generator";
import { Models } from "./types/openai";
import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

function main() {
  const telegramToken = process.env.TELEGRAM_TOKEN;
  const openaiToken = process.env.OPENAI_TOKEN;

  if (!telegramToken) throw new Error("Enter your telegram bot token to .env file! (TELEGRAM_TOKEN=*)");
  if (!openaiToken) throw new Error("Enter your OpenAI API token to .env file! (OPENAI_TOKEN=*)");

  const openai = new OpenAI({ "apiKey": openaiToken });
  const textGenerator = new TextGenerator(openai);
  const imageGenerator = new ImageGenerator(openai);
  const models: Models = { textGenerator, imageGenerator };

  const bot = new TelegramBotWithAI(telegramToken, models);

  bot.launch();
}

main();