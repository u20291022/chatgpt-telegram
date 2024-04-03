import { Telegram } from "telegraf";
import { TextMessage, UserId } from "../types/telegram";
import { authManager } from "../auth/auth-manager";
import { tokensManager } from "../auth/tokens-manager";
import { TextGenerator } from "../openai/text-generator";

export class TextMessagesHandler {
  private textGenerator: TextGenerator;
  private methods: Telegram;
  
  constructor(textGenerator: TextGenerator, methods: Telegram) {
    this.textGenerator = textGenerator;
    this.methods = methods;
  }

  public async handle(message: TextMessage): Promise<void> {
    const text = message.text;
    const userId = message.from.id;

    if (!authManager.isUserAuthorized(userId)) {
      if (tokensManager.isTokenAvailable(text)) {
        authManager.createUserFromToken(text, userId)
        this.sendAuthMessageToUser(userId);
      }
      else await this.sendWrongTokenMessageToUser(userId);  
      return;
    }

    await this.sendTextGeneratorResponse(message);
  }

  private async sendTextGeneratorResponse(message: TextMessage): Promise<void> {
    const text = message.text;
    const userId = message.from.id;
    await this.setBotStateToTypingForUser(userId);
    const response = await this.textGenerator.generate(text, userId);
    await this.methods.sendMessage(userId, response).catch(() => {});
  }

  private async setBotStateToTypingForUser(userId: UserId): Promise<void> {
    await this.methods.sendChatAction(userId, "typing").catch(() => {});
  }

  private async sendAuthMessageToUser(userId: UserId): Promise<void> {
    await this.methods.sendMessage(userId, "✅ Вы были успешно авторизованы!").catch(() => {});
  }

  private async sendWrongTokenMessageToUser(userId: UserId): Promise<void> {
    await this.methods.sendMessage(userId, "⚠️ Отправьте действительный токен, полученный у администратора!").catch(() => {});
  }
}