import { Telegram } from "telegraf";
import { TextMessageData } from "../types/telegram";
import { auth } from "../utils/auth";
import OpenAI from "openai";
import { chatgptHistory } from "../utils/chatgpt-history";
import { RateLimitError } from "openai/error";

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
    
    const interval = setInterval(() => {
      methods.sendChatAction(userId, "typing").catch(() => {});
    }, 1000);

    const request = await openai.chat.completions.create({
      "model": "gpt-3.5-turbo",
      "max_tokens": 4000,
      "messages": [
        { "role": "system", "content": "You are answering in telegram chat. Parse mode is HTML. You must use HTML styling and emojis. Use bold style to mark important info. Answer on the same language as last user request. Answer in a clear and concise manner. Answer only on last user content, because all above is chat history" },
        ...chatgptHistory.get(userId),
        { "role": "user", "content": text }
      ],
      "seed": Math.round(Math.random() * 0xfffffff)
    }).catch((error: RateLimitError) => {
      if (error.code === "rate_limit_exceed") {
        methods.sendMessage(userId, "Превышен лимит сообщений!\nПопробуйте позже.").catch(() => {}); 
      }
    })

    clearInterval(interval);

    if (request) {
      const answer = request.choices[0].message.content;

      if (answer) {
        chatgptHistory.addMessage(userId, text, "user");
        chatgptHistory.addMessage(userId, answer, "assistant");

        await methods.sendMessage(userId, answer, { "parse_mode": "HTML" }).catch(() => {});
      }
      else {
        await methods.sendMessage(userId, "Произошла ошибка при обработке запроса!").catch(() => {});
      }

      return;
    }
    
    await methods.sendMessage(userId, "Произошла неизвестная ошибка!").catch(() => {});
  }
}

export const textMessagesHandler = new TextMessagesHandler();