import { expect, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class WishlistPage extends BasePage {
    private wishlistTitle = this.page.locator("//h1[normalize-space()='Wishlist']");
    private qtyInput = this.page.locator("//input[contains(@name,'itemquantity')]");
    private updateWishlistButton = this.page.locator("//button[@id='updatecart']");
    private addToCartCheckbox = this.page.locator("//input[contains(@id,'addtocart')]");
    private addToCartButton = this.page.locator("//button[normalize-space()='Add to cart']");
    private removeButton = this.page.locator("//button[@class='remove-btn']");
    private emptyWishlistMessage = this.page.locator("//div[@class='no-data']");
    constructor(page: Page) {
        super(page);
    }

    async openWishlist(url: string) {
        await this.goto(url);
    }

    async verifyWishlistPageLoaded() {
        await expect(this.wishlistTitle).toHaveText("Wishlist");
    }

    async verifyProductDisplayed(productName: string) {
        await expect(this.page.getByText(productName)).toBeVisible();
    }

    async verifyProductNotDisplayed(productName: string) {
        await expect(this.page.getByText(productName)).not.toBeVisible();
    }

    async removeProduct() {
        await this.clickElement(this.removeButton, "Remove Product Button");
    }

    async selectProductToAddCart() {
        await this.clickElement(this.addToCartCheckbox.first(), "Add to Cart Checkbox");
    }

    async clickAddToCart() {
        await this.clickElement(this.addToCartButton, "Add to Cart Button");
    }

    async updateWishlist() {
        await this.clickElement(this.updateWishlistButton, "Update Wishlist Button");
    }

    async setQuantity(qty: string) {
        await this.qtyInput.fill("");
        await this.qtyInput.fill(qty);
    }

    async verifyQuantity(qty: string) {
        await expect(this.qtyInput).toHaveValue(qty);
    }

    async verifyWishlistEmpty() {
        await expect(this.emptyWishlistMessage).toContainText("The wishlist is empty!");
    }

}