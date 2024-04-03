import dotenv from "dotenv";
import { TelegramBot } from "./telegram/bot";
dotenv.config();

function main() {
  const telegramToken = process.env.TELEGRAM_TOKEN;
  const openaiToken = process.env.OPENAI_TOKEN;

  if (!telegramToken) return console.error("Enter your telegram bot token to .env file! (TELEGRAM_TOKEN=*)");
  if (!openaiToken) return console.error("Enter your OpenAI API token to .env file! (OPENAI_TOKEN=*)");

  const bot = new TelegramBot(telegramToken, openaiToken);
  bot.launch();
}

main();