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
    if (!authManager.isUserAuthorized(userId)) return;
    await this.setBotStateToUploadingPhotoeForUser(userId);
    const response = await this.imageGenerator.generate(prompt);
    await this.sendImageToUser(userId, response);
  }

  private async setBotStateToUploadingPhotoeForUser(userId: UserId): Promise<void> {
    await this.methods.sendChatAction(userId, "upload_photo");
  }

  private async sendImageToUser(userId: UserId, imageData: string): Promise<void> {
    await this.methods.sendPhoto(userId, imageData);
  }
}