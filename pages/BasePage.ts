import { Page } from "@playwright/test";
import { Locator } from "playwright";
import { logStep } from "../helpers/Logger";
import UIHelpers from "../helpers/UIHelpers";
export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(url: string) {
    console.log(`Navigating to ${url}`);
    await this.page.goto(url);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async getTitle() {
    console.log(`Getting title`);
    return this.page.title();
  }

  async clickElement(selector: Locator, elementName: string) {
    logStep(`Clicking element: ${elementName}`);
    await UIHelpers.waitForVisible(selector, elementName);
    await selector.click();
  }

  async inputText(selector: Locator, text: string, elementName: string) {
    logStep(`Inputting ${text} into element: ${elementName}`);
    await UIHelpers.waitForVisible(selector, elementName);
    await selector.fill(text);
    }
}