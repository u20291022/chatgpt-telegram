export enum Command {
  START = "start",
  IMAGE = "image",
  CLEAR = "clear",
  ADMIN = "admin"
}

export interface CommandData {
  command: string,
  args: string[],
  from: { id: number }
}