import { Token, TokenData, Tokens } from "../types/auth";
import { FileName } from "../types/files.enum";
import { filesystem } from "../utils/filesystem";
import { logs } from "../utils/logs";
import md5 from "md5";

class TokensManager {
  private tokensFilePath = `${filesystem.getDataDirectoryPath()}/${FileName.TOKENS}`;
  private tokens: Tokens = {};

  constructor() {
    filesystem.exists(this.tokensFilePath) ?
      this.loadTokensData() : this.saveTokensData();
  }

  public isTokenAvailable(token: Token): boolean {
    return !!this.tokens[token];
  }

  public getTokenData(token: Token): TokenData {
    return this.tokens[token];
  }

  public createUserToken(): void {
    const tokenData: TokenData = { isAdmin: false, isAuthorized: true };
    this.createToken(tokenData);
  }

  public createAdminToken(): void {
    const tokenData: TokenData = { isAdmin: true, isAuthorized: true };
    this.createToken(tokenData);
  }

  private createToken(tokenData: TokenData): void {
    const token: Token = this.generateToken();
    this.tokens[token] = tokenData;
    this.saveTokensData();
    logs.write(`Succefully created token: "${token}" for ${tokenData.isAdmin ? "admin" : "user"}`);
  }

  private generateToken(): Token {
    return md5(`${Math.random() * 0xffffff}${Math.random() * 0xffffff}`);
  }

  public getTokens(): Token[] {
    return Object.keys(this.tokens);
  }

  public loadTokensData(): void {
    this.tokens = filesystem.readJson(this.tokensFilePath) as Tokens;
  }

  private saveTokensData(): void {
    filesystem.writeJson(this.tokensFilePath, this.tokens);
  }
}

export const tokensManager = new TokensManager();