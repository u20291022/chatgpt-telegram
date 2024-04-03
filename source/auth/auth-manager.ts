import { Token, Users } from "../types/auth";
import { FileName } from "../types/files.enum";
import { UserId } from "../types/telegram";
import { filesystem } from "../utils/filesystem";
import { logs } from "../utils/logs";
import { tokensManager } from "./tokens-manager";

class AuthManager {
  private usersFilePath = `${filesystem.getDataDirectoryPath()}/${FileName.USERS}`;    
  private users: Users = {};

  constructor() {
    filesystem.exists(this.usersFilePath) ?
      this.loadUsersData() : this.saveUsersData();
  }

  public isUserAdmin(userId: UserId): boolean {
    return (this.users[userId] && this.users[userId].isAdmin) || this.userIsOwner(userId);
  }

  public isUserAuthorized(userId: UserId): boolean {
    return (this.users[userId] && this.users[userId].isAuthorized) || this.userIsOwner(userId);
  }

  public createUserFromToken(token: Token, userId: UserId): void {
    if (!tokensManager.isTokenAvailable(token)) return;
    this.users[userId] = tokensManager.getTokenData(token);
    this.saveUsersData();
    logs.write(`Succefully created user [${userId}] from token "${token}"`);
  }

  private userIsOwner(userId: UserId): boolean {
    return userId.toString() === this.getOwnerId();
  }

  private getOwnerId(): string {
    const ownerId = process.env.OWNER_ID;
    if (!ownerId) throw new Error("Enter your telegram user id to .env file! (OWNER_ID=*)");
    return ownerId;
  }

  private loadUsersData(): void {
    this.users = filesystem.readJson(this.usersFilePath) as Users;
  }

  private saveUsersData(): void {
    filesystem.writeJson(this.usersFilePath, this.users);
  }
}

export const authManager = new AuthManager();