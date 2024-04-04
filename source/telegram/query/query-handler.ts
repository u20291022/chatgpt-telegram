import { Telegram } from "telegraf";
import { QueryData } from "../../types/query";
import { Query } from "../../types/query.enum";
import { Models } from "../../types/openai";
import { ReloadCallback } from "./reload-callback";
import { ViewTokensCallback } from "./view-tokens-callback";
import { ModelSettingsCallback } from "./model-settings-callback";
import { ViewUsersCallback } from "./view-users-callback";
import { NavigationQueryHandler } from "./navigation-query-handler";

export class QueryHandler {
  private methods: Telegram;
  private models: Models;
  private modelSettingsCallback: ModelSettingsCallback;
  private viewUsersCallback: ViewUsersCallback;
  private viewTokensCallback: ViewTokensCallback;
  private reloadCallback: ReloadCallback;
  private navigationQueryHandler: NavigationQueryHandler;

  constructor (methods: Telegram, models: Models) {
    this.methods = methods;
    this.models = models;
    this.modelSettingsCallback = new ModelSettingsCallback(this.methods)
    this.viewUsersCallback = new ViewUsersCallback(this.methods);
    this.viewTokensCallback = new ViewTokensCallback(this.methods);
    this.reloadCallback = new ReloadCallback(this.methods, this.models);
    this.navigationQueryHandler = new NavigationQueryHandler(this.methods);
  }

  public handle(queryData: QueryData): void {
    const query = queryData.data;

    switch (query) {
      case Query.MODEL_SETTINGS: {
        this.modelSettingsCallback.answer(queryData);
        break;
      }
      case Query.VIEW_USERS: {
        this.viewUsersCallback.answer(queryData);
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

    if (query.includes("navigation")) this.navigationQueryHandler.handle(queryData);
  }
}