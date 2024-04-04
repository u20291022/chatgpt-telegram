import { Telegram } from "telegraf";
import { QueryData } from "../../../../types/query";
import { tokensKeyboard } from "../../inline-keyboards/tokens-inline-keyboards";

export class TokensCallback {
  private methods: Telegram;

  constructor(methods: Telegram) {
    this.methods = methods;
  }

  public async answer(queryData: QueryData): Promise<void> {
    await this.editMessageText(queryData);
    await this.editInlineKeyboardToTokenMenu(queryData);
    await this.methods.answerCbQuery(queryData.id);
  }

  private async editMessageText(queryData: QueryData): Promise<void> {
    const query = queryData.data;
    const token = query.split("|")[1];
    const userId = queryData.from.id;
    const messageId = queryData.message.message_id;
    await this.methods.editMessageText(userId, messageId, undefined, `Меню токена ${token}`).catch(() => {});
  }

  public async editInlineKeyboardToTokenMenu(queryData: QueryData): Promise<void> {
    const query = queryData.data;
    const querySpliited = query.split("|");
    const token = querySpliited.length === 2 ? querySpliited[1] : querySpliited[2];
    const userId = queryData.from.id;
    const messageId = queryData.message.message_id;
    const tokenMenuKeyboard = tokensKeyboard.getTokenMenuKeyborad(token);
    await this.methods.editMessageReplyMarkup(
      userId, messageId, undefined, {"inline_keyboard": tokenMenuKeyboard}
      ).catch(() => {});
  }
}