import { Telegram } from "telegraf";
import { Command, CommandData } from "../../types/commands";
import { StartCommand } from "./start-command";
import { ClearCommand } from "./clear-command";
import { ImageCommand } from "./image-command";
import { AdminCommand } from "./admin-command";
import { Models } from "../../types/openai";

export class CommandsHandler {
  private methods: Telegram;
  private startCommand: StartCommand;
  private imageCommand: ImageCommand;
  private clearCommand: ClearCommand;
  private adminCommand: AdminCommand;

  constructor(methods: Telegram, models: Models) {
    this.methods = methods;
    this.startCommand = new StartCommand(this.methods);
    this.imageCommand = new ImageCommand(this.methods, models.imageGenerator);
    this.clearCommand = new ClearCommand(this.methods);
    this.adminCommand = new AdminCommand(this.methods);
  }

  public handle(commandData: CommandData): void {
    const command = commandData.command;

    switch(command) {
      case Command.START: {
        this.startCommand.execute(commandData);
        break;
      }
      case Command.IMAGE: {
        this.imageCommand.execute(commandData);
        break;
      }
      case Command.CLEAR: {
        this.clearCommand.execute(commandData);
        break;
      }
      case Command.ADMIN: {
        this.adminCommand.execute(commandData);
        break;
      }
    }
  }
}