import { Query } from "./query.enum";

export type Button = InlineKeyboardButton;
export type Keyboard = Button[][]; 

export interface NavigationData {
  navigationType: Query,
  maxValuesOnPage: number
}

export type Direction = "forward" | "back";