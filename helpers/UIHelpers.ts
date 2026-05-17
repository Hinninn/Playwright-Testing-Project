import { expect, Locator } from "@playwright/test";
import { logStep } from "./Logger";

export default class UIHelpers {

  static async waitForVisible(locator: Locator, elementName: string, timeout = 5000) {
    logStep(`Waiting for ${elementName} to be visible...`);
    await expect(locator).toBeVisible({ timeout });
    logStep(`${elementName} is visible.`);
  }
}
