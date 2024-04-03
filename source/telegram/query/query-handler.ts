import { Telegram } from "telegraf";
import { QueryData } from "../../types/query";
import { Query } from "../../types/query.enum";
import { Models } from "../../types/openai";
import { ReloadCallback } from "./reload-callback";
import { ViewTokensCallback } from "./view-tokens-callback";

export class QueryHandler {
  private methods: Telegram;
  private models: Models;
  private viewTokensCallback: ViewTokensCallback;
  private reloadCallback: ReloadCallback;

  constructor (methods: Telegram, models: Models) {
    this.methods = methods;
    this.models = models;
    this.viewTokensCallback = new ViewTokensCallback(this.methods);
    this.reloadCallback = new ReloadCallback(this.methods, this.models);
  }

  public handle(queryData: QueryData): void {
    const query = queryData.data;

    switch (query) {
      case Query.MODEL_SETTINGS: {
        break;
      }
      case Query.VIEW_USERS: {
        break;
      }
      case Query.VIEW_TOKENS: {
        this.viewTokensCallback.answer(queryData);
        break;
      }
      case Query.RELOAD: {
        this.reloadCallback.answer(queryData);
        break;
      }
    }
  }
}