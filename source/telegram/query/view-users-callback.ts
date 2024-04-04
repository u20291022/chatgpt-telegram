import { Telegram } from "telegraf";
import { QueryData } from "../../types/query";

export class ViewUsersCallback {
  private methods: Telegram;

  constructor(methods: Telegram) {
    this.methods = methods;
  }

  public async answer(queryData: QueryData): Promise<void> {
    await this.methods.answerCbQuery(queryData.id);
  }
}