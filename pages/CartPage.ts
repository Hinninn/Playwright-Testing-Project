import { Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { config } from "../config";

export class CartPage extends BasePage {
  // selectors
    private argee = this.page.locator("//input[@id='termsofservice']");
    private checkoutButton = this.page.locator("//button[normalize-space()='Checkout']");
    private addButton = this.page.locator("(//div[@class='item-box'])[1]//button[contains(@class,'add-to-cart')]");

    constructor(page: Page) {
        super(page);
    }

    async openCart() {
        await this.goto("https://demo.nopcommerce.com/cart");
    }

    async openBooksPage() {
        await this.goto(`${config.baseURL}/books`);
    }

    async addFirstProductToCart() {
        await this.clickElement(this.addButton, 'Add first product to cart');
        const notification = this.page.locator('.bar-notification.success');
        await notification.waitFor({ state: 'visible', timeout: 10000 });
        await this.page.waitForTimeout(500);
    }

    async acceptTerms() {
        if (!(await this.argee.isChecked())) {
            await this.clickElement(this.argee, 'Agree to terms checkbox');
        }
    }

    async uncheckTerms() {
        if (await this.argee.isChecked()) {
            await this.clickElement(this.argee, 'Uncheck terms checkbox');
        }
    }

    async clickCheckout() {
        await this.clickElement(this.checkoutButton, 'Checkout Button');
    }
}
