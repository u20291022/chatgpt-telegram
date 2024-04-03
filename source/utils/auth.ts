import { User, Users } from "../types/auth";
import { filesystem } from "./filesystem";

class Auth {
  private dataDirectoryPath = "data";
  private authFilePath = this.dataDirectoryPath + "/users.json";
  private tokensFilePath = this.dataDirectoryPath + "/tokens.json";
  private users: Users = {};
  private tokens: string[] = [];
  private oldAuthFileLength = 0;
  private oldTokensFileLength = 0;

  constructor() {
    filesystem.mkdir(this.dataDirectoryPath);
    if (!filesystem.exists(this.authFilePath)) {
      this.writeDefaultAuthData();
    }
    else {
      this.loadAuthData();
    }

    this.oldAuthFileLength = this.getAuthFileLength();
    this.oldTokensFileLength = this.getTokensFileLength();
  }
  
  public isUserAdmin(userId: string | number): boolean {
    if (this.isFilesDataWasUpdated()) {
      this.loadAuthData();
    }

    return this.users[userId] && !!this.users[userId].admin;
  } 

  public isUserCanUseBot(userId: string | number): boolean {
    if (this.isFilesDataWasUpdated()) {
      this.loadAuthData();
    }

    return this.users[userId] && !!this.users[userId].authorized;
  }

  public createNewUser(userId: string | number, user: User): void {
    this.users[userId] = user;
    this.updateJson();
    console.log("User " + userId + " was succesfully created!");
  }

  public isTokenAvailable(token: string): boolean {
    if (this.isFilesDataWasUpdated()) {
      this.loadAuthData();
    }
    return this.tokens.includes(token);
  }

  public authorizeUser(userId: string | number, token: string): void {
    if (this.checkIfUserTokenCorrect(userId, token)) {
      this.users[userId].authorized = true;
      this.tokens = this.tokens.filter(t => t != token);
      this.updateJson();
      console.log("User " + userId + " was succesfully authorized!");
    }
  }

  public addToken(token: string): void {
    this.tokens.push(token);
    this.updateJson();
  }

  private checkIfUserTokenCorrect(userId: string | number, token: string): boolean {
    return this.users[userId] && this.users[userId].token === token;
  }

  private updateJson(): void {
    filesystem.writeJson(this.authFilePath, this.users);
    filesystem.writeJson(this.tokensFilePath, this.tokens);
  }

  private getAuthFileLength(): number {
    return filesystem.readText(this.authFilePath).length;
  }

  private getTokensFileLength(): number {
    return filesystem.readText(this.tokensFilePath).length;
  }

  private writeDefaultAuthData(): void {
    filesystem.writeJson(this.authFilePath, {});
    filesystem.writeJson(this.tokensFilePath, []);
  }

  private isFilesDataWasUpdated(): boolean {
    return this.oldAuthFileLength != this.getAuthFileLength() ||
      this.oldTokensFileLength != this.getTokensFileLength();
  }

  private loadAuthData(): void {
    this.users = <Users>filesystem.readJson(this.authFilePath);
    this.tokens = <string[]>filesystem.readJson(this.tokensFilePath);
  }
}

export const auth = new Auth();