import { Telegram } from "telegraf";
import { CommandData } from "../../types/commands";
import { authManager } from "../../auth/auth-manager";
import { ImageGenerator } from "../../openai/image-generator";
import { UserId } from "../../types/telegram";

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
    const response = await this.imageGenerator.generate(prompt);
    clearInterval(interval);
    await this.sendImageToUser(userId, response);
  }

  private async setBotStateToUploadingPhotoeForUser(userId: UserId): Promise<void> {
    await this.methods.sendChatAction(userId, "upload_photo").catch(() => {});
  }

  private async sendImageToUser(userId: UserId, imageData: string): Promise<void> {
    await this.methods.sendPhoto(userId, imageData);
  }

  private isPromptValid(prompt: string): boolean {
    return prompt.length > 0 && prompt.replace(/\ /g, "").length > 0;
  }
}