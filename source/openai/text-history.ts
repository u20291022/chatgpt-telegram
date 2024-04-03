import { ChatCompletionMessageParam } from "openai/resources";
import { UserId } from "../types/telegram";
import { filesystem } from "../utils/filesystem";
import { UsersHistory } from "../types/text-history";
import { FileName } from "../types/files.enum";

class TextHistory {
  private historyFilePath = `${filesystem.getDataDirectoryPath()}/${FileName.HISTORY}`;
  private history: UsersHistory = {};
  private historyRule = ". Answer only on last user content, because all above is chat history";
  private historySize = 12;

  constructor() {
    filesystem.exists(this.historyFilePath) ?
      this.loadHistoryData() : this.saveHistoryData();
  }

  public setHistorySize(historySize: number): void {
    this.historySize = historySize;
  }

  public getHistoryRule(): string {
    return this.historyRule;
  }

  public getHistory(historyUserId: UserId): ChatCompletionMessageParam[] {
    return this.history[historyUserId] || [];
  }

  public clearHistory(historyUserId: string | number): void {
    this.history[historyUserId] = [];
    this.saveHistoryData();
  }

  public addUserMessage(text: string, historyUserId: UserId): void {
    const message: ChatCompletionMessageParam = { role: "user", content: text };
    this.addMessage(message, historyUserId);
  }

  public addAssistantMessage(text: string, historyUserId: UserId): void {
    const message: ChatCompletionMessageParam = { role: "assistant", content: text };
    this.addMessage(message, historyUserId);
  }

  private addMessage(message: ChatCompletionMessageParam, historyUserId: UserId): void {
    if (this.isUserHasHistory(historyUserId)) this.history[historyUserId].push(message);
    else this.history[historyUserId] = [message];
    if (this.history[historyUserId].length > this.historySize) this.history[historyUserId].shift();
    this.saveHistoryData();
  }

  private isUserHasHistory(historyUserId: UserId): boolean {
    return !!this.history[historyUserId];
  }

  public loadHistoryData(): void {
    this.history = <UsersHistory>filesystem.readJson(this.historyFilePath);
  }

  private saveHistoryData(): void {
    filesystem.writeJson(this.historyFilePath, this.history);
  }
}

export const textHistory = new TextHistory();