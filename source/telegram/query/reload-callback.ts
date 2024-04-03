import { Telegram } from "telegraf";
import { Models } from "../../types/openai";
import { loader } from "../../utils/loader";
import { logs } from "../../utils/logs";
import { QueryData } from "../../types/query";

export class ReloadCallback {
  private methods: Telegram;
  private models: Models;
  
  constructor(methods: Telegram, models: Models) {
    this.methods = methods;
    this.models = models;
  }

  public answer(queryData: QueryData): void {
    loader.loadAll(this.models);
    logs.write("Succesfully reloaded all data!");
    this.methods.answerCbQuery(queryData.id, "Все данные были успешно обновлены!")
  }
}