import { Telegram } from "telegraf";
import { CommandData } from "../../types/commands";
import { UserId } from "../../types/telegram";
import { authManager } from "../../auth/auth-manager";
import { textHistory } from "../../openai/text-history";

export class ClearCommand {
  private methods: Telegram;

  constructor(methods: Telegram) {
    this.methods = methods;
  }

  public async execute(commandData: CommandData): Promise<void> {
    const userId = commandData.from.id;
    if (!authManager.isUserAuthorized(userId)) return;
    textHistory.clearHistory(userId);
    await this.sendSuccessMessageToUser(userId);
  }

  private async sendSuccessMessageToUser(userId: UserId): Promise<void> {
    await this.methods.sendMessage(userId, "Вы успешно очистили историю диалога!");
  }
}