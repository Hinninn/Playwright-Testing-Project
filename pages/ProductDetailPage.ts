import { expect, Page } from "@playwright/test";
import { BasePage } from "./BasePage";


export class ProductDetailPage extends BasePage {
    private productName = this.page.locator("//h1[normalize-space()='Apple iCam']");
    private productDescription = this.page.locator("//div[@class='short-description']");
    private productPrice = this.page.locator("//span[contains(@id,'price-value')]");
    private quantityInput = this.page.locator("//input[contains(@id,'product_enteredQuantity')]");
    private addToCartButton = this.page.locator("//button[contains(@id,'add-to-cart-button')]");
    private addToWishlistButton = this.page.locator("//button[contains(@id,'add-to-wishlist-button')]");
    private successNotification = this.page.locator("//div[@id='bar-notification']");
    private mainImage = this.page.locator("//img[contains(@id,'main-product-img')]");
    private recipientNameInput = this.page.locator("//input[contains(@id,'RecipientName')]");
    private senderNameInput = this.page.locator("//input[contains(@id,'SenderName')]");

    constructor(page: Page) {
        super(page);
    }

    async openProduct(url: string) {
        await this.goto(url);
    }

    async verifyProductDetailPage() {
        await expect(this.productName).toBeVisible();
        await expect(this.productPrice).toBeVisible();
        await expect(this.quantityInput).toBeVisible();
        await expect(this.addToCartButton).toBeVisible();
        await expect(this.addToWishlistButton).toBeVisible();
        await expect(this.mainImage).toBeVisible();
        await expect(this.productDescription).toBeVisible();
    }

    async setQuantity(qty: string) {
        await this.quantityInput.fill("");
        await this.quantityInput.fill(qty);
    }

    async addToCart() {
        await this.clickElement(this.addToCartButton, "Add to Cart Button");
        await this.successNotification.waitFor({ state: "visible", timeout: 10000 });
    }

    async addToWishlist() {
        await this.clickElement(this.addToWishlistButton, "Add to Wishlist Button");
        await this.successNotification.waitFor({ state: "visible", timeout: 10000 });
    }

    async getSuccessMessage() {
        return (await this.successNotification.textContent())?.trim();
    }

    async fillGiftCardInfo(recipientName: string, senderName: string) {
    await this.inputText(this.recipientNameInput, recipientName, 'Recipient Name');
    await this.inputText(this.senderNameInput, senderName, 'Sender Name');
    }
    
}