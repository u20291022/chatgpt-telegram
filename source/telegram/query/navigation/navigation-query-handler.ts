import { Telegram } from "telegraf";
import { QueryData } from "../../../types/query";
import { Query } from "../../../types/query.enum";
import { tokensKeyboard } from "../inline-keyboards/tokens-inline-keyboards";
import { ViewTokensCallback } from "../callbacks/tokens/view-tokens-callback";
import { Direction } from "../../../types/inline-keyboards";

export class NavigationQueryHandler {
  private methods: Telegram;
  private viewTokensCallback: ViewTokensCallback;

  constructor(methods: Telegram) {
    this.methods = methods;
    this.viewTokensCallback = new ViewTokensCallback(this.methods);
  }

  public handle(queryData: QueryData): void {
    this.methods.answerCbQuery(queryData.id);
    const query = queryData.data;
    const querySplitted = query.split("|");
    const keyboardType: Query = querySplitted[1] as Query;
    const direction: Direction = querySplitted[2] as Direction;
    if (!keyboardType || !direction) return;

    switch(keyboardType) {
      case Query.VIEW_USERS: {
        break;
      }
      case Query.VIEW_TOKENS: {
        if (direction === "forward") tokensKeyboard.navigation.nextPage();
        if (direction === "back") tokensKeyboard.navigation.prevPage();
        this.viewTokensCallback.editInlineKeyboardToTokensList(queryData);
        break;
      }
    }  
  }
}