import { Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { config } from "../config";

export class RegisterPage extends BasePage {
  private firstNameInput = this.page.locator("//input[@id='FirstName']");
  private lastNameInput = this.page.locator("//input[@id='LastName']");
  private emailInput = this.page.locator("//input[@id='Email']");
  private passwordInput = this.page.locator("//input[@id='Password']");
  private confirmPasswordInput = this.page.locator("//input[@id='ConfirmPassword']");
  private registerButton = this.page.locator("//button[@id='register-button']");
  private resultMessage = this.page.locator("//div[@class='result']");

  constructor(page: Page) {
    super(page);
  }

  async gotoRegister() {
    await this.goto(`${config.baseURL}/register`);
    await this.page.waitForURL(/\/register/, { timeout: 15000 });
    await this.registerButton.waitFor({ state: 'visible', timeout: 10000 });
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

  async fillPassword(password: string) {
    await this.inputText(this.passwordInput, password, 'Password');
  }

  async fillConfirmPassword(confirmPassword: string) {
    await this.inputText(this.confirmPasswordInput, confirmPassword, 'Confirm Password');
  }

  async clickRegister() {
    await this.clickElement(this.registerButton, 'Register button');
  }

  async getSuccessMessage(): Promise<string> {
    await this.resultMessage.waitFor({ state: 'visible', timeout: 10000 });
    return (await this.resultMessage.textContent())?.trim() || '';
  }
}
