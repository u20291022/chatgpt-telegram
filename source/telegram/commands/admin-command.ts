import { Telegram } from "telegraf";
import { CommandData } from "../../types/commands";
import { authManager } from "../../auth/auth-manager";
import { UserId } from "../../types/telegram";
import { InlineKeyboardButton, InlineKeyboardMarkup } from "telegraf/typings/core/types/typegram";
import { Query } from "../../types/query.enum";

export class AdminCommand {
  private methods: Telegram;
  
  constructor(methods: Telegram) {
    this.methods = methods;
  }

  public async execute(commandData: CommandData): Promise<void> {
    const userId = commandData.from.id;
    if (!authManager.isUserAuthorized(userId)) return;
    if (!authManager.isUserAdmin(userId)) return;
    await this.sendMessageWithInlineKeyboardToUser(userId);
  }

  private async sendMessageWithInlineKeyboardToUser(userId: UserId): Promise<void> {
    await this.methods.sendMessage(userId, "Панель администрирования 🛠", {"reply_markup": this.getReplyMarkupForAdminPanel()});
  }

  private getReplyMarkupForAdminPanel(): InlineKeyboardMarkup {
    return {"inline_keyboard": this.getInlineKeyboard()};
  }

  private getInlineKeyboard(): InlineKeyboardButton[][] {
    return [
      [ { text: "Настройки модели", "callback_data": Query.MODEL_SETTINGS } ],
      [ { text: "Пользователи", "callback_data": Query.VIEW_USERS }, { text: "Токены", "callback_data": Query.VIEW_TOKENS } ],
      [ { text: "Обновить данные", "callback_data": Query.RELOAD } ]
    ];
  }
}