import { authManager } from "../auth/auth-manager";
import { tokensManager } from "../auth/tokens-manager";
import { textHistory } from "../openai/text-history";
import { Models } from "../types/openai";

class Loader {
  public loadAll(models: Models): void {
    textHistory.loadHistoryData();
    authManager.loadUsersData();
    tokensManager.loadTokensData();
    models.textGenerator.loadModelData();
  }
}

export const loader = new Loader();