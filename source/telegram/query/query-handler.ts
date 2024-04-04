import { Telegram } from "telegraf";
import { QueryData } from "../../types/query";
import { Query, SubQuery } from "../../types/query.enum";
import { Models } from "../../types/openai";
import { ReloadCallback } from "./callbacks/reload-callback";
import { ViewTokensCallback } from "./callbacks/tokens/view-tokens-callback";
import { ModelSettingsCallback } from "./callbacks/model-settings-callback";
import { ViewUsersCallback } from "./callbacks/view-users-callback";
import { NavigationQueryHandler } from "./navigation/navigation-query-handler";
import { CreateTokenCallback } from "./callbacks/tokens/create-token-callback";
import { TokensCallback } from "./callbacks/tokens/tokens-callback";
import { TokensMenuCallback } from "./callbacks/tokens/tokens-menu-callback";

export class QueryHandler {
  private methods: Telegram;
  private models: Models;
  private modelSettingsCallback: ModelSettingsCallback;
  private viewUsersCallback: ViewUsersCallback;
  private viewTokensCallback: ViewTokensCallback;
  private reloadCallback: ReloadCallback;
  private navigationQueryHandler: NavigationQueryHandler;
  private createTokenCallback: CreateTokenCallback;
  private tokensCallback: TokensCallback;
  private tokensMenuCallback: TokensMenuCallback;

  constructor (methods: Telegram, models: Models) {
    this.methods = methods;
    this.models = models;
    this.modelSettingsCallback = new ModelSettingsCallback(this.methods)
    this.viewUsersCallback = new ViewUsersCallback(this.methods);
    this.viewTokensCallback = new ViewTokensCallback(this.methods);
    this.reloadCallback = new ReloadCallback(this.methods, this.models);
    this.navigationQueryHandler = new NavigationQueryHandler(this.methods);
    this.createTokenCallback = new CreateTokenCallback(this.methods, this.viewTokensCallback);
    this.tokensCallback = new TokensCallback(this.methods);
    this.tokensMenuCallback = new TokensMenuCallback(this.methods, this.tokensCallback);
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
      case Query.CREATE_TOKEN: {
        this.createTokenCallback.answer(queryData);
        break;
      }
    }

    const subQuery: SubQuery = query.split("|")[0] as SubQuery;
    if (subQuery === SubQuery.TOKEN) this.tokensCallback.answer(queryData);
    if (subQuery === SubQuery.TOKEN_MENU) this.tokensMenuCallback.answer(queryData);
    if (subQuery === SubQuery.NAVIGATION) this.navigationQueryHandler.handle(queryData);
  }
}