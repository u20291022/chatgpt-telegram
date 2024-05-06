import { filesystem } from "./filesystem";

class Logs {
  public error<Data extends { toString(): string }>(data: Data): void {
    this.write(`[Error] ${data}`);
  }

  public write<Data extends { toString(): string }>(data: Data): void {
    const logPath = this.getLogPath();
    const message = this.formatMessage(data.toString());
    console.log(message);
    filesystem.append(logPath, message);
  }

  private getLogPath(): string {
    const dateString = this.getCurrentDateString();
    return `${filesystem.getLogsDirectoryPath()}/${dateString}.txt`;
  }

  private formatMessage(text: string): string {
    const timeString = this.getCurrentTimeString();
    return `[${timeString}] ${text}`;
  }

  private getCurrentDateString(): string {
    const date = new Date();
    const dateString = date.toLocaleDateString("ru-RU",  { timeZone: "Asia/Krasnoyarsk" });
    return dateString.replace(/\./g, "-");
  }

  private getCurrentTimeString(): string {
    const date = new Date();
    return date.toLocaleTimeString("ru-RU");
  }
}

export const logs = new Logs();