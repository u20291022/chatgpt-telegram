import { Telegram } from "telegraf";
import { QueryData } from "../../types/query";
import { InlineKeyboardButton } from "telegraf/typings/core/types/typegram";
import { tokensManager } from "../../auth/tokens-manager";

export class ViewTokensCallback {
  private methods: Telegram;

  constructor(methods: Telegram) {
    this.methods = methods;
  }

  public async answer(queryData: QueryData): Promise<void> {
    await this.editMessageText(queryData);
    await this.editInlineKeyboardToTokensList(queryData);
    await this.methods.answerCbQuery(queryData.id);
  }

  private async editMessageText(queryData: QueryData): Promise<void> {
    const userId = queryData.from.id;
    const messageId = queryData.message.message_id;
    await this.methods.editMessageText(userId, messageId, undefined, "Свободные токены:");
  }

  private async editInlineKeyboardToTokensList(queryData: QueryData): Promise<void> {
    const userId = queryData.from.id;
    const messageId = queryData.message.message_id;
    await this.methods.editMessageReplyMarkup(userId, messageId, undefined, {
      "inline_keyboard": this.getInlineKeyboardWithTokensList()
    }).catch(() => {});
  }

  private getInlineKeyboardWithTokensList(): InlineKeyboardButton[][] {
    return tokensManager.getTokens().map(token => [ { text: token, callback_data: token } ]);
  }
}
