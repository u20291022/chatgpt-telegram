import { Telegram } from "telegraf";
import { TextMessageData } from "../types/telegram";
import { auth } from "../utils/auth";
import OpenAI from "openai";

class TextMessagesHandler {
  public async handle(data: TextMessageData, openai: OpenAI, methods: Telegram): Promise<void> {
    const { text, from } = data;
    const userId = from.id;
    const userName = from.first_name;

    if (!auth.isUserCanUseBot(userId)) {
      if (auth.isTokenAvailable(text)) {
        auth.createNewUser(userId, {
          name: userName,
          token: text,
          admin: false,
          authorized: false
        });

        auth.authorizeUser(userId, text);

        await methods.sendMessage(userId, "Вы были авторизованы!").catch(() => {});
      }
      else {
        await methods.sendMessage(userId, "Отправь мне действительный токен!").catch(() => {});
      }
      return;
    }

    methods.sendChatAction(userId, "typing").catch(() => {});

    const request = await openai.completions.create({
      "model": "gpt-3.5-turbo-instruct",
      "prompt": text + ". You can write only text, emojis, code and links, but not images and etc",
      "max_tokens": 4000
    }).catch(() => {})

    if (request) {
      const answer = request.choices[0].text;
      await methods.sendMessage(userId, answer).catch(() => {});
      return;
    }
    
    await methods.sendMessage(userId, "Произошла ошибка!").catch(() => {});
  }
}

export const textMessagesHandler = new TextMessagesHandler();