import { test, expect } from "@playwright/test";
import { ProductDetailPage } from "../../pages/ProductDetailPage";
import productDetailData from "../data/productDetailData.json";
import { logTitle } from "../../helpers/Logger";

test.describe("Product Detail Page Tests", () => {
    let productDetailPage: ProductDetailPage;

    test.beforeEach(async ({ page }) => {
        productDetailPage = new ProductDetailPage(page);
    });

    test("TC001: Verify Product Detail page displays correctly", async () => {
        logTitle("TC001: Verify Product Detail page displays correctly");

        await productDetailPage.openProduct(productDetailData.URLS.APPLE_ICAM);
        await productDetailPage.verifyProductDetailPage();
    });

    test("TC002: Add product to cart with default quantity", async () => {
        logTitle("TC002: Add product to cart with default quantity");

        await productDetailPage.openProduct(productDetailData.URLS.APPLE_ICAM);
        await productDetailPage.addToCart();

        const message = await productDetailPage.getSuccessMessage();
        expect(message).toContain(productDetailData.SUCCESS_MSG.addToCart);
    });

    test("TC003: Change quantity then add product to cart", async () => {
        logTitle("TC003: Change quantity then add product to cart");

        await productDetailPage.openProduct(productDetailData.URLS.APPLE_ICAM);
        await productDetailPage.setQuantity(productDetailData.QUANTITY.VALID);
        await productDetailPage.addToCart();

        const message = await productDetailPage.getSuccessMessage();
        expect(message).toContain(productDetailData.SUCCESS_MSG.addToCart);
    });

    test("TC004: Fill gift card information then add product to cart", async () => {
        logTitle("TC004: Fill gift card information then add product to cart");

        await productDetailPage.openProduct(productDetailData.URLS.GIFT_CARD);

        await productDetailPage.fillGiftCardInfo(
            productDetailData.GIFT_CARD.RECIPIENT_NAME,
            productDetailData.GIFT_CARD.YOUR_NAME,
        );

        await productDetailPage.addToCart();

        const message = await productDetailPage.getSuccessMessage();
        expect(message).toContain(productDetailData.SUCCESS_MSG.addToCart);
    });

    test.only("TC005: Add product to Wishlist from Product Detail page", async () => {
        logTitle("TC005: Add product to Wishlist from Product Detail page");

        await productDetailPage.openProduct(productDetailData.URLS.APPLE_ICAM);
        await productDetailPage.addToWishlist();

        const message = await productDetailPage.getSuccessMessage();
        expect(message).toContain(productDetailData.SUCCESS_MSG.addToWishlist);
    });
});