import { tokensManager } from "../../../auth/tokens-manager";
import { Token } from "../../../types/auth";
import { Keyboard, Button } from "../../../types/inline-keyboards";
import { Query } from "../../../types/query.enum";
import { Navigation } from "./navigation";

class TokensInlineKeyboards {
  public navigation: Navigation;

  constructor() {
    this.navigation = new Navigation({navigationType: Query.VIEW_TOKENS, maxValuesOnPage: 5});
  }

  public getTokensListKeyboard(): Keyboard {
    const tokensKeyboard: Keyboard = this.getKeyboardFromTokens();
    const withCreateButton: Keyboard = [[this.getCreateTokenButton()], ...tokensKeyboard];
    const withNavigation: Keyboard = this.navigation.getPageData(withCreateButton);
    return withNavigation;
  }

  private getKeyboardFromTokens(): Keyboard {
    const tokens = tokensManager.getTokens();
    return tokens.map(token => [this.getButtonFromToken(token)]);
  }

  private getButtonFromToken(token: Token): Button {
    return { text: token, callback_data: `token|${token}` };
  }

  private getCreateTokenButton(): Button {
    // TODO
    return { text: "Создать токен", callback_data: "create_token" };
  }
}

export const tokensKeyboard = new TokensInlineKeyboards();