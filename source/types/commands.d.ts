export interface CommandData {
  command: string,
  args: string[],
  from: { id: number }
}

export interface OpenAiError {
  status: number,
  error: {
    message: string,
    type: string,
    param: any,
    code: string
  }
}