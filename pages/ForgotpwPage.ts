import { expect, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
export class ForgotpwPage extends BasePage {
  // selectors
  private emailInput = this.page.locator("//input[@name='Email']");
  private recoveryButton = this.page.locator("//button[contains(@class,'password-recovery-button')]");
  private messageText = this.page.locator("//div[@class='bar-notification success']");
  private emailNotFoundText = this.page.locator("//p[contains(text(),'Email not found.')]");
  private fieldValidationError = this.page.locator("//span[@class='field-validation-error']");

  constructor(page: Page) {
    super(page);
  }
  async inputEmail(email: string) {
    await this.inputText(this.emailInput, email, 'Email');
  }

  async submit() {
    await this.clickElement(this.recoveryButton, 'Recovery Button');
  }
  async getMessage(): Promise<string> {
    if (await this.fieldValidationError.isVisible({ timeout: 3000 })) {
      return (await this.fieldValidationError.textContent())?.trim() || '';
    }
    if (await this.emailNotFoundText.isVisible({ timeout: 3000 })) {
      return (await this.emailNotFoundText.textContent())?.trim() || '';
    }
    if (await this.messageText.isVisible({ timeout: 3000 })) {
      return (await this.messageText.textContent())?.trim() || '';
    }
    return '';
  }

}