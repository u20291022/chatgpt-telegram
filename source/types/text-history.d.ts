import { ChatCompletionMessageParam } from "openai/resources";

export interface UsersHistory {
  [userId: string]: ChatCompletionMessageParam[];
}
