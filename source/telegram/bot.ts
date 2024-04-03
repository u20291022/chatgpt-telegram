import { Telegraf, Telegram } from "telegraf";
import { Models } from "../types/openai";
import { commands } from "./commands/commands";
import { Listener } from "./listener";
import { logs } from "../utils/logs";

export class TelegramBotWithAI {
  public me: Telegraf;
  public methods: Telegram;
  private models: Models;
  private listener: Listener;

  public constructor(token: string, models: Models) {
    this.me = new Telegraf(token);
    this.methods = this.me.telegram;
    this.models = models;
    this.listener = new Listener(this.me, this.models);
  }

  public launch(): void {
    this.setBotCommands();
    this.listener.listen();
    this.me.launch();
    logs.write("Bot succesfully started!");
  }

  private setBotCommands(): void {
    this.methods.setMyCommands(commands.get());
  }
}