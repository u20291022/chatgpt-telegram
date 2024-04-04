import { Telegram } from "telegraf";
import { QueryData } from "../../../../types/query";
import { tokensKeyboard } from "../../inline-keyboards/tokens-inline-keyboards";

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
    await this.methods.editMessageText(userId, messageId, undefined, "Управление токенами:").catch(() => {});
  }

  public async editInlineKeyboardToTokensList(queryData: QueryData): Promise<void> {
    const userId = queryData.from.id;
    const messageId = queryData.message.message_id;
    const tokensInlineKeyboard = tokensKeyboard.getTokensListKeyboard();
    await this.methods.editMessageReplyMarkup(
      userId, messageId, undefined, {"inline_keyboard": tokensInlineKeyboard}
      ).catch(() => {});
  }
}
