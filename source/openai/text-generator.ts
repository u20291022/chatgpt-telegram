import OpenAI from "openai";
import { textHistory } from "./text-history";
import { ChatCompletionMessageParam } from "openai/resources";
import { UserId } from "../types/telegram";
import { APIPromise } from "openai/core";
import { filesystem } from "../utils/filesystem";
import { TextModelInfo } from "../types/openai";
import { FileName } from "../types/files.enum";

export class TextGenerator {
  private openai: OpenAI;
  private modelDataFilePath = `${filesystem.getDataDirectoryPath()}/${FileName.MODEL_DATA}`;
  private modelInfo: TextModelInfo = { model: "gpt-3.5-turbo", "maxTokens": 0, "maxHistory": 0, "rules": "" };

  constructor(openai: OpenAI) {
    this.openai = openai;
    if (filesystem.exists(this.modelDataFilePath)) this.loadModelData();
    else filesystem.writeJson(this.modelDataFilePath, this.getDefaultModelInfo());
    textHistory.setHistorySize(this.modelInfo.maxHistory);
  }

  public setTextModelRules(rules: string): void {
    this.modelInfo.rules = rules;
  }

  public getTextModelRules(): string {
    return this.modelInfo.rules;
  }

  public async generate(prompt: string, historyUserId: UserId): Promise<string> {
    try {
      const response = await this.sendRequest(prompt, historyUserId);
      const generatedText = response.choices[0].message.content;
      if (generatedText) return generatedText;
      else return "Something went wrong!";
    }
    catch(error) {
      throw error;
    }
  }

  private sendRequest(prompt: string, historyUserId: UserId): APIPromise<OpenAI.Chat.Completions.ChatCompletion> {
    const messages = this.getPreviousMessagesWithUserPromptAndRules(prompt, historyUserId);
    return this.openai.chat.completions.create({
      "model": this.modelInfo.model,
      "max_tokens": this.modelInfo.maxTokens,
      "messages": messages
    })
  }

  private getPreviousMessagesWithUserPromptAndRules(prompt: string, historyUserId: UserId): ChatCompletionMessageParam[] {
    const allRules = this.getTextModelRules() + textHistory.getHistoryRule();
    const rulesMessage: ChatCompletionMessageParam = { "role": "system", "content": allRules };
    const previousMessages: ChatCompletionMessageParam[] = textHistory.getHistory(historyUserId);
    const userMessage: ChatCompletionMessageParam = { "role": "user", "content": prompt };
    return [rulesMessage, ...previousMessages, userMessage]
  }

  private getDefaultModelInfo(): TextModelInfo {
    const defaultRules = (
      "Отвечай на вопросы развёрнуто, грамотно, вежливо и приветливо. " +
      "В конце сообщения пиши, что готов помочь с новыми вопросами. " +
      "Ты можешь использовать emoji. " +
      "Форматируй свой ответ так, чтобы важные детали были выделены жирным шрифтом. " + 
      "Ты можешь использовать Markdown форматирование. " +
      "Перепроверяй свои ответы и анализируй то, как будет выполняться код, который ты написал. " +
      "Код не должен содержать ошибок. " +
      "Если ты используешь в своём коде какие-либо библиотеки или функции, код которых ты не написал, " +
      "то ты должен будешь рассказать о них в своём ответе."
    );

    return {
      model: "gpt-3.5-turbo",
      maxTokens: 4000,
      maxHistory: 12,
      rules: defaultRules
    }
  }

  public loadModelData(): void {
    this.modelInfo = filesystem.readJson(this.modelDataFilePath) as TextModelInfo;
  }

  private saveModelData(): void {
    filesystem.writeJson(this.modelDataFilePath, this.modelInfo);
  }
}