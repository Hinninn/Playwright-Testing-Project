import { expect, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class LoginPage extends BasePage {
  // selectors
  private emailInput = this.page.locator("xpath=//input[@name='Email']");
  readonly passwordInput = this.page.locator("//input[@id='Password']");
  private rememberMeCheckbox = this.page.locator("//input[@id='RememberMe']");
  private loginButton = this.page.locator("xpath=//button[@type='submit' and contains(@class, 'login-button')]");
  // private logoutButton = this.page.locator("xpath=//a[@id='logout']");
  private errorEmailLocator = this.page.locator("//span[@id='Email-error']");
  private errorMessage = this.page.locator("//div[contains(@class,'message-error validation-summary-errors')]");
  readonly eyeClosed = this.page.locator("//span[@class='password-eye']");
  private loginLink = this.page.locator("//a[normalize-space()='Log in']");
  private forgotPasswordLink = this.page.locator("//a[normalize-space()='Forgot password?']");

  constructor(page: Page) {
    super(page);
  }


  // Method to perform login action
  async login(email: string, password: string) {
    await this.inputText(this.emailInput, email, 'Email');
    await this.page.waitForTimeout(1000);
    await this.inputText(this.passwordInput, password, 'Password');
    await this.page.waitForTimeout(1000);
    await this.clickElement(this.loginButton, 'Login Button');
  }

  async loginWithRemember(email: string, password: string) {
    await this.inputText(this.emailInput, email, 'Email');
    await this.inputText(this.passwordInput, password, 'Password');
    await this.rememberMeCheckbox.check();
    await this.clickElement(this.loginButton, 'Login Button');
  }

  async loginWithEnter(email: string, password: string) {
    await this.inputText(this.emailInput, email, 'Email');
    await this.inputText(this.passwordInput, password, 'Password');
    await this.passwordInput.press('Enter');
  }
  async clickOutside() {
    await this.page.click("body");
    }

  async getPasswordType() {
    return (await this.passwordInput.getAttribute('type')) || '';
  }
  async clickTogglePassword() {
    await this.eyeClosed.click();
  }
  async getErrorMessage(): Promise<string> {
    if (await this.errorEmailLocator.isVisible({ timeout: 3000 })) {
      return (await this.errorEmailLocator.textContent())?.trim() || '';
    }
    if (await this.errorMessage.isVisible({ timeout: 3000 })) {
      return (await this.errorMessage.textContent())?.trim() || '';
    }
    return '';
  }
  async clickLoginLink() {
    await this.clickElement(this.loginLink, 'Login Link');
  }

  async clickForgotPassword() {
    await this.clickElement(this.forgotPasswordLink, 'Forgot Password Link');
  }
}