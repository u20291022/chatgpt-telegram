import { Telegram } from "telegraf";
import { CommandData } from "../../types/commands";
import { UserId } from "../../types/telegram";
import { authManager } from "../../auth/auth-manager";

export class StartCommand {
  private methods: Telegram;

  constructor(methods: Telegram) {
    this.methods = methods;
  }

  public async execute(commandData: CommandData): Promise<void> {
    const userId = commandData.from.id;
    if (authManager.isUserAuthorized(userId)) await this.sendAuthorizedMessageToUser(userId) 
    else await this.sendUnauthorizedMessageToUser(userId);
  }

  private async sendAuthorizedMessageToUser(userId: UserId): Promise<void> {
    await this.methods.sendMessage(userId,
      "Привет! 👋\n" +
      "Я построен на модели ChatGPT 3.5-Turbo!\n" +
      "Отправь мне свой вопрос и я отвечу на него!"
      );
  }

  private async sendUnauthorizedMessageToUser(userId: UserId): Promise<void> {
    await this.methods.sendMessage(userId, "Привет! 👋\nОтправь мне токен, полученный от администратора.");
  }
}