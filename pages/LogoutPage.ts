import { expect, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class LogoutPage extends BasePage {
  private logoutButton = this.page.locator("//a[normalize-space()='Log out']");

    constructor(page: Page) {
    super(page);
    }

  async logout() {
    await this.clickElement(this.logoutButton, 'Logout Button');
    await this.page.waitForURL('https://demo.nopcommerce.com/');
  }
}
