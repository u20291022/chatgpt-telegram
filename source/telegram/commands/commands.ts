import { BotCommand } from "telegraf/typings/core/types/typegram";
import { Command } from "../../types/commands";

class Commands {
  private list: BotCommand[] = [
    { command: Command.START, description: "Запускает бота." },
    { command: Command.IMAGE, description: "Генерирует изображение по заданному запросу: /image запрос" },
    { command: Command.CLEAR, description: "Очищает историю диалога." },
    // i dont describe admin command, because i hide it from users
  ];

  public get() {
    return this.list;
  }
}

export const commands: Commands = new Commands();