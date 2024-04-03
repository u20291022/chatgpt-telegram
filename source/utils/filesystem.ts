import { existsSync, mkdirSync, readFileSync, writeFileSync, appendFileSync } from "fs";

class FileSystem {
  private dataDirectoryPath = "data";
  private logsDirectoryPath = `${this.dataDirectoryPath}/${this.dataDirectoryPath}`;

  constructor() {
    this.mkdir(this.dataDirectoryPath);
    this.mkdir(this.logsDirectoryPath);
  }

  public exists(path: string): boolean {
    return existsSync(path);
  }

  public mkdir(path: string): void {
    if (!this.exists(path)) {
      mkdirSync(path, {"recursive": true});
    }
  }

  public write<T extends { toString(): string }>(path: string, data: T): void {
    writeFileSync(path, data.toString());
  }

  public writeJson(path: string, data: any): void {
    const stringifiedData = JSON.stringify(data || {}, null, "\t");
    this.write(path, stringifiedData);
  }

  public append<T extends { toString(): string }>(path: string, data: T): void {
    appendFileSync(path, "\n" + data.toString());
  }

  public readText(path: string): string {
    return this.exists(path) ? readFileSync(path, {"encoding": "utf8"}) : "";
  }

  public readJson(path: string): object {
    try {
      const text = this.readText(path);
      return JSON.parse(text);
    }
    catch(error) {
      console.error("Some error occured on json parsing!\n" + error);
      return {};
    }
  }

  public getDataDirectoryPath(): string {
    return this.dataDirectoryPath;
  }
}

export const filesystem = new FileSystem();