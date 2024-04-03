import { Telegram } from "telegraf";
import { TextMessage, UserId } from "../types/telegram";
import { authManager } from "../auth/auth-manager";
import { tokensManager } from "../auth/tokens-manager";
import { TextGenerator } from "../openai/text-generator";
import { textHistory } from "../openai/text-history";

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
    const interval = setInterval(() => this.setBotStateToTypingForUser(userId), 1000);
    const response = await this.textGenerator.generate(text, userId);
    clearInterval(interval);
    textHistory.addUserMessage(text, userId);
    textHistory.addAssistantMessage(response, userId);
    await this.sendResponseToUser(response, userId);
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

  private async sendResponseToUser(response: string, userId: UserId): Promise<void> {
    await this.methods.sendMessage(userId, response, {"parse_mode": "Markdown"}).catch(() => {});
  }
}