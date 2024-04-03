import { ChatGPTMessage, Role, UsersHistory } from "../types/chatgpt-history";
import { filesystem } from "./filesystem";

class ChatGPTHistory {
  private dataDirectoryPath = "data";
  private historyFilePath = this.dataDirectoryPath + "/history.json";
  private history: UsersHistory = {};

  constructor() {
    filesystem.mkdir(this.dataDirectoryPath);
    if (!filesystem.exists(this.historyFilePath)) {
      this.writeDefaultHistoryData();
    }
    else {
      this.loadHistoryData();
    }
  }

  public addMessage(userId: string | number, message: string, role: Role): void {
    if (!this.history[userId]) {
      this.history[userId] = [];
    }
    
    this.history[userId].push({ "role": role, "content": message });

    if (this.history[userId].length > 8) {
      this.history[userId].shift();
    }

    this.updateJson();
  }

  public get(userId: string | number): ChatGPTMessage[] {
    return this.history[userId] || [];
  }

  public clear(userId: string | number): void {
    this.history[userId] = [];
    this.updateJson();
  }

  private writeDefaultHistoryData(): void {
    filesystem.writeJson(this.historyFilePath, {});
  }

  private loadHistoryData(): void {
    this.history = <UsersHistory>filesystem.readJson(this.historyFilePath);
  }

  private updateJson(): void {
    filesystem.writeJson(this.historyFilePath, this.history);
  }
}

export const chatgptHistory = new ChatGPTHistory();