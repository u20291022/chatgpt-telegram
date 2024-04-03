import { Telegraf, Telegram } from "telegraf";
import { CommandsHandler } from "./commands/commands-handler";
import { Models } from "../types/openai";
import { message } from "telegraf/filters";
import { TextMessagesHandler } from "./text-messages-handler";
import { Command } from "../types/command.enum";
import { CommandData } from "../types/commands";

export class Listener {
  private bot: Telegraf;
  private methods: Telegram;
  private models: Models;
  private commandsHandler: CommandsHandler;

  constructor (bot: Telegraf, models: Models) {
    this.bot = bot;
    this.methods = this.bot.telegram;
    this.models = models;
    this.commandsHandler = new CommandsHandler(this.methods, models);
  }

  public listen(): void {
    this.listenForStartCommand();
    this.listenForImageCommand();
    this.listenForClearCommand();
    this.listenForAdminCommand();
    this.listenForTextMessages();
  }

  private listenForStartCommand(): void {
    this.bot.start(context => {
      const commandData: CommandData = context;
      this.commandsHandler.handle(commandData);
    });
  }

  private listenForImageCommand(): void {
    this.bot.command(Command.IMAGE, context => {
      const commandData: CommandData = context;
      this.commandsHandler.handle(commandData);
    })
  }

  private listenForClearCommand(): void {
    this.bot.command(Command.CLEAR, context => {
      const commandData: CommandData = context;
      this.commandsHandler.handle(commandData);
    })
  }

  private listenForAdminCommand(): void {
    this.bot.command(Command.ADMIN, context => {
      const commandData: CommandData = context;
      this.commandsHandler.handle(commandData);
    })
  }

  private listenForTextMessages(): void {
    this.bot.on(message("text"), context => {
      const textMessagesHandler = new TextMessagesHandler(this.models.textGenerator, this.methods);
      const message = context.message;
      textMessagesHandler.handle(message);
    });
  }
}