import { Telegram } from "telegraf";
import { QueryData } from "../../../../types/query";
import { tokensManager } from "../../../../auth/tokens-manager";
import { ViewTokensCallback } from "./view-tokens-callback";

export class CreateTokenCallback {
  private methods: Telegram;
  private viewTokensCallback: ViewTokensCallback;

  constructor(methods: Telegram, viewTokensCallback: ViewTokensCallback) {
    this.methods = methods;
    this.viewTokensCallback = viewTokensCallback;
  }
  
  public async answer(queryData: QueryData): Promise<void> {
    tokensManager.createUserToken();
    await this.viewTokensCallback.editInlineKeyboardToTokensList(queryData);
    await this.methods.answerCbQuery(queryData.id);
  }
}