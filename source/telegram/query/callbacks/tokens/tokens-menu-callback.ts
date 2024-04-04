import { Telegram } from "telegraf";
import { QueryData } from "../../../../types/query";
import { TokenMethod } from "../../../../types/token-methods.enum";
import { TokensCallback } from "./tokens-callback";
import { tokensManager } from "../../../../auth/tokens-manager";
import { logs } from "../../../../utils/logs";
import { ViewTokensCallback } from "./view-tokens-callback";

export class TokensMenuCallback {
  private methods: Telegram;
  private tokensCallback: TokensCallback;
  private viewTokensCallback: ViewTokensCallback;

  constructor(methods: Telegram, tokensCallback: TokensCallback) {
    this.methods = methods;
    this.tokensCallback = tokensCallback;
    this.viewTokensCallback = new ViewTokensCallback(this.methods);
  }

  public async answer(queryData: QueryData): Promise<void> {
    await this.methods.answerCbQuery(queryData.id);

    const query = queryData.data;
    const querySplitted = query.split("|");
    const tokenMethod = querySplitted[1] as TokenMethod;
    const token = querySplitted[2];
    if (!tokenMethod || !token) return;

    switch(tokenMethod) {
      case TokenMethod.SWITCH: {
        this.tokenSwitch(queryData);
        break;
      }
      case TokenMethod.DELETE: {
        this.tokenDelete(queryData);
        break;
      }
    }
  }

  private tokenSwitch(queryData: QueryData): void {
    const query = queryData.data;
    const querySplitted = query.split("|");
    const token = querySplitted[2];
    tokensManager.switchTokenType(token);
    this.tokensCallback.editInlineKeyboardToTokenMenu(queryData);
    logs.write(`Token "${token}" type was switched!`);
  }

  private tokenDelete(queryData: QueryData): void {
    const query = queryData.data;
    const querySplitted = query.split("|");
    const token = querySplitted[2];
    tokensManager.deleteToken(token);
    this.viewTokensCallback.answer(queryData);
    logs.write(`Token "${token}" was deleted!`);
  }
}