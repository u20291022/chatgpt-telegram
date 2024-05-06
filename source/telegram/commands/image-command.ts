import { Telegram } from "telegraf";
import { CommandData, OpenAiError } from "../../types/commands";
import { authManager } from "../../auth/auth-manager";
import { ImageGenerator } from "../../openai/image-generator";
import { UserId } from "../../types/telegram";
import { logs } from "../../utils/logs";

export class ImageCommand {
  private methods: Telegram;
  private imageGenerator: ImageGenerator;
  
  constructor(methods: Telegram, imageGenerator: ImageGenerator) {
    this.methods = methods;
    this.imageGenerator = imageGenerator;
  }

  public async execute(commandData: CommandData): Promise<void> {
    const userId = commandData.from.id;
    const prompt = commandData.args.join(" ");
    if (!this.isPromptValid(prompt)) return;
    if (!authManager.isUserAuthorized(userId)) return;
    const interval = setInterval(() => this.setBotStateToUploadingPhotoeForUser(userId), 1000);
    try {
      const response = await this.imageGenerator.generate(prompt);
      clearInterval(interval);
      await this.sendImageToUser(userId, response);
    }
    catch(error) {
      clearInterval(interval);

      const openAiError = error as OpenAiError;
      logs.error(`reason: ${openAiError.error.message} | status: ${openAiError.status}`)

      if (openAiError.status === 429) {
        await this.sendRateLimitMessageToUser(userId);
      }
    }
  }

  private async setBotStateToUploadingPhotoeForUser(userId: UserId): Promise<void> {
    await this.methods.sendChatAction(userId, "upload_photo").catch(() => {});
  }

  private async sendImageToUser(userId: UserId, imageData: string): Promise<void> {
    await this.methods.sendPhoto(userId, imageData).catch(() => {});
  }

  private isPromptValid(prompt: string): boolean {
    return prompt.length > 0 && prompt.replace(/\ /g, "").length > 0;
  }

  private async sendRateLimitMessageToUser(userId: UserId): Promise<void> {
    await this.methods.sendMessage(userId, "Достигнут общий лимит сообщений к боту!").catch(() => {});
  }
}