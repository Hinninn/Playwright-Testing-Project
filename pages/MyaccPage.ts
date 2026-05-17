import { expect, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class MyaccPage extends BasePage {
  private myaccLink = this.page.locator("//a[contains(@class,'ico-account')]");
  private maleRadio = this.page.locator("//input[@id='gender-male']");
  private femaleRadio = this.page.locator("//input[@id='gender-female']");
  private firstNameInput = this.page.locator("//input[@id='FirstName']");
  private lastNameInput = this.page.locator("//input[@id='LastName']");
  private emailInput = this.page.locator("//input[@id='Email']");
  private companyInput = this.page.locator("//input[@id='Company']");
  private newsletterCheckbox = this.page.locator("//input[@id='Newsletter' or @name='Newsletter']");
  private saveButton = this.page.locator("//button[@id='save-info-button']");
  private successMessage = this.page.locator("//div[contains(@class,'result')] | //div[@class='result']");

  // Error locators (moved here so XPaths are declared at class top)
  private fieldValidationError = this.page.locator("//span[contains(@class,'field-validation-error')]");
  private validationSummaryItems = this.page.locator("//div[contains(@class,'validation-summary-errors')]//li");
  private messageError = this.page.locator("//div[contains(@class,'message-error')]");
  constructor(page: Page) {
    super(page);
  }

  async gotoMyAccount() {
    await this.myaccLink.waitFor({ state: 'visible', timeout: 15000 });
    await this.clickElement(this.myaccLink, 'My Account Link');
    await this.page.waitForURL(/\/customer\/info/, { timeout: 15000 });
  }

  async fillFirstName(firstName: string) {
    await this.inputText(this.firstNameInput, firstName, 'First name');
  }

  async fillLastName(lastName: string) {
    await this.inputText(this.lastNameInput, lastName, 'Last name');
  }

  async fillEmail(email: string) {
    await this.inputText(this.emailInput, email, 'Email');
  }

  async fillCompany(company: string) {
    await this.inputText(this.companyInput, company, 'Company');
  }

  async setNewsletter(subscribe: boolean) {
    if (await this.newsletterCheckbox.count() === 0) {
      return;
    }
    await this.newsletterCheckbox.setChecked(subscribe, { force: true });
  }

  async clickSave() {
    await this.clickElement(this.saveButton, 'Save button');
  }

  async getSuccessMessage(): Promise<string> {
    await expect(this.successMessage.first()).toBeVisible({ timeout: 10000 });
    return (await this.successMessage.first().textContent())?.trim() || '';
  }

  async getFieldError(): Promise<string> {
    const candidates = [
      this.fieldValidationError,
      this.validationSummaryItems,
      this.messageError,
    ];
    for (const locator of candidates) {
      const count = await locator.count();
      for (let i = 0; i < count; i++) {
        const item = locator.nth(i);
        if (await item.isVisible({ timeout: 3000 }).catch(() => false)) {
          const text = (await item.textContent())?.trim();
          if (text) {
            return text;
          }
        }
      }
    }
    return '';
  }
}
