import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";

class FileSystem {
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
    const stringifiedData = JSON.stringify(data, null, "\t");
    this.write(path, stringifiedData);
  }

  public readText(path: string): string {
    if (!this.exists(path)) return "";

    const text = readFileSync(path, {"encoding": "utf8"});
    return text;
  }

  public readJson(path: string): object {
    if (!this.exists(path)) return {};

    const text = this.readText(path);

    try {
      const data = JSON.parse(text);
      return data;
    }
    catch(error) {
      console.error("Some error occured on json parsing!\n" + error);
      return {};
    }
  }

}

export const filesystem = new FileSystem();