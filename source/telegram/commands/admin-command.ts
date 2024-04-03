import { Telegram } from "telegraf";
import { CommandData } from "../../types/commands";

export class AdminCommand {
  private methods: Telegram;
  
  constructor(methods: Telegram) {
    this.methods = methods;
  }

  public execute(commandData: CommandData): void {
    
  }
}