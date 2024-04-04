import { Button, Keyboard, NavigationData } from "../../../types/inline-keyboards";
import { Query } from "../../../types/query.enum";

export class Navigation {
  private page = 0;
  private navigationType: Query;
  private maxValuesOnPage: number;

  constructor(navigationData: NavigationData) {
    this.navigationType = navigationData.navigationType;
    this.maxValuesOnPage = navigationData.maxValuesOnPage;
  }

  public nextPage(): void {
    this.page++;
  }

  public prevPage(): void {
    this.page--;
  }

  public getPageData(keyboard: Keyboard): Keyboard {
    const startIndex = this.page * this.maxValuesOnPage;
    const navButtons = this.getButtons(keyboard.length);
    const pageData = keyboard.slice(startIndex, startIndex + this.maxValuesOnPage);
    return [...pageData, navButtons];
  }

  private getButtons(keyboardLength: number): Button[] {
    if (this.isCurrentPageFirst()) {
      if (this.nextPageHaveItems(keyboardLength)) return [this.getForwardButton()];
    }
    else if (this.isCurrentPageLast(keyboardLength)) return [this.getBackButton()];
    else return [this.getBackButton(), this.getForwardButton()];
    return []; 
  }

  private getForwardButton(): Button {
    return { text: ">>", callback_data: `navigation|${this.navigationType}|forward` };
  }

  private getBackButton(): Button {
    return { text: "<<", callback_data: `navigation|${this.navigationType}|back` };
  }

  private nextPageHaveItems(keyboardLength: number): boolean {
    return keyboardLength > (this.page * this.maxValuesOnPage + this.maxValuesOnPage);
  }

  private isCurrentPageFirst(): boolean {
    return this.page === 0;
  }

  private isCurrentPageLast(keyboardLength: number): boolean {
    return ((this.page * this.maxValuesOnPage) + this.maxValuesOnPage) >= keyboardLength;
  }
}