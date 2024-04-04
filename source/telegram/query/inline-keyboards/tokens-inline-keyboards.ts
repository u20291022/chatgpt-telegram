import { tokensManager } from "../../../auth/tokens-manager";
import { Token } from "../../../types/auth";
import { Keyboard, Button } from "../../../types/inline-keyboards";
import { Query } from "../../../types/query.enum";
import { Navigation } from "../navigation/navigation";

class TokensInlineKeyboards {
  public navigation: Navigation;

  constructor() {
    this.navigation = new Navigation({navigationType: Query.VIEW_TOKENS, maxValuesOnPage: 5});
  }

  public getTokenMenuKeyborad(token: Token): Keyboard {
    if (!tokensManager.isTokenAvailable(token)) return [];
    const tokenData = tokensManager.getTokenData(token);
    return [
      [{ text: `Установить тип ${tokenData.isAdmin ? "пользователя" : "админитратора"}`, callback_data: `token_menu|switch|${token}` }],
      [{ text: "Удалить токен", callback_data: `token_menu|delete|${token}` }],
    ]
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
    return { text: "Создать токен", callback_data: "create_token" };
  }
}

export const tokensKeyboard = new TokensInlineKeyboards();