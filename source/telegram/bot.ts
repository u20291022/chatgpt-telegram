import { Telegraf, Telegram } from "telegraf";
import { message } from "telegraf/filters"
import { TextMessageData } from "../types/telegram";
import { textMessagesHandler } from "./text-messages-handler";
import { auth } from "../utils/auth";
import OpenAI from "openai";

export class TelegramBot {
  public me: Telegraf;
  public methods: Telegram;
  private openai: OpenAI;

  public constructor(token: string, openaiToken: string) {
    this.me = new Telegraf(token);
    this.methods = this.me.telegram;
    this.openai = new OpenAI({ "apiKey": openaiToken });
  }

  public launch(): void {
    this.setCommands();
    
    this.listenStartCommand();
    this.listenAuthCommand();
    this.listenTextMessages();

    this.me.launch();
    console.log("Bot succesfully was started!");
  }

  private listenStartCommand(): void {
    this.me.start(context => {
      const userId = context.chat.id;

      if (!auth.isUserCanUseBot(userId)) {
        return context.reply("Привет!\nОтправь мне специальный токен, чтобы пользоваться этим ботом!");
      }

      context.reply("Привет!\nОтправь мне свой вопрос и я на него отвечу.");
    })
  }

  private listenAuthCommand(): void {
    this.me.command("auth", context => {
      const userId = context.chat.id;

      if (!auth.isUserAdmin(userId)) {
        return context.reply("Тебе не дозволено использовать эту команду!");
      }
      
      const args = context.args;
      const [token, argsUserId, userName] = args;

      if (args.length === 0) {
        return context.reply("Использование: /auth токен [id_пользователя имя_пользователя]");
      }
      else if (!argsUserId) {
        auth.addToken(token);
        return context.reply("Вы добавили токен: " + token);
      }
      else {
        auth.createNewUser(argsUserId, { name: userName, token });
        auth.authorizeUser(argsUserId, token);
        return context.reply(`Вы добавили пользователя: [${argsUserId}] ${userName} - ${token}`);
      }
    });
  }

  private listenTextMessages(): void {
    this.me.on(message("text"), context => {
      const message = context.message;
      const messageData: TextMessageData = message;
      textMessagesHandler.handle(messageData, this.openai, this.methods);
    });
  }

  private setCommands(): void {
    this.methods.setMyCommands([
      { command: "start", description: "Запускает бота." },
      { command: "auth", description: "Для администраторов. Пример: /auth токен [id_пользователя имя_пользователя]" }
    ]);
  }
} 