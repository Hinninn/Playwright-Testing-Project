import { test, expect } from "@playwright/test";
import { WishlistPage } from "../../pages/WishlistPage";
import { ProductDetailPage } from "../../pages/ProductDetailPage";
import { LoginPage } from "../../pages/LoginPage";
import { LogoutPage } from "../../pages/LogoutPage";
import wishlistData from "../data/wishlistData.json";
import loginData from "../data/loginData.json";
import { logTitle } from "../../helpers/Logger";

test.describe("Wishlist Page Tests", () => {
    let loginPage: LoginPage;
    let wishlistPage: WishlistPage;
    let productDetailPage: ProductDetailPage;
    let logoutPage: LogoutPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        wishlistPage = new WishlistPage(page);
        productDetailPage = new ProductDetailPage(page);
        logoutPage = new LogoutPage(page);

        await loginPage.goto(loginData.URL);
        await loginPage.login(loginData.VALID.EMAIL, loginData.VALID.PASSWORD);
    });

    test("TC001: Add product to Wishlist", async () => {
        logTitle("TC001: Add product to Wishlist");

        await productDetailPage.openProduct(wishlistData.URLS.FAHRENHEIT);
        await productDetailPage.addToWishlist();

        await wishlistPage.openWishlist(wishlistData.URLS.WISHLIST);
        await wishlistPage.verifyProductDisplayed(wishlistData.PRODUCTS.FAHRENHEIT);
    });

    test("TC002: Display Wishlist after adding multiple products", async () => {
        logTitle("TC002: Display Wishlist after adding multiple products");

        await productDetailPage.openProduct(wishlistData.URLS.FAHRENHEIT);
        await productDetailPage.addToWishlist();

        await productDetailPage.openProduct(wishlistData.URLS.APPLE_ICAM);
        await productDetailPage.addToWishlist();

        await wishlistPage.openWishlist(wishlistData.URLS.WISHLIST);
        await wishlistPage.verifyProductDisplayed(wishlistData.PRODUCTS.FAHRENHEIT);
        await wishlistPage.verifyProductDisplayed(wishlistData.PRODUCTS.APPLE_ICAM);
    });

    test("TC003: Remove product from Wishlist", async () => {
        logTitle("TC003: Remove product from Wishlist");

        await productDetailPage.openProduct(wishlistData.URLS.FAHRENHEIT);
        await productDetailPage.addToWishlist();

        await wishlistPage.openWishlist(wishlistData.URLS.WISHLIST);
        await wishlistPage.verifyProductDisplayed(wishlistData.PRODUCTS.FAHRENHEIT);

        await wishlistPage.removeProduct();
        await wishlistPage.verifyProductNotDisplayed(wishlistData.PRODUCTS.FAHRENHEIT);
    });

    test("TC004: Move product from Wishlist to Cart", async () => {
        logTitle("TC004: Move product from Wishlist to Cart");

        await productDetailPage.openProduct(wishlistData.URLS.FAHRENHEIT);
        await productDetailPage.addToWishlist();

        await wishlistPage.openWishlist(wishlistData.URLS.WISHLIST);
        await wishlistPage.selectProductToAddCart();
        await wishlistPage.clickAddToCart();

        await expect(wishlistPage.page).toHaveURL(/cart/);
    });

    test("TC005: Access Wishlist without login", async () => {
        logTitle("TC005: Access Wishlist without login");

        await logoutPage.logout();

        await wishlistPage.openWishlist(wishlistData.URLS.WISHLIST);
        await wishlistPage.verifyWishlistPageLoaded();
    });

    test("TC006: Empty Wishlist display", async () => {
        logTitle("TC006: Empty Wishlist display");

        await wishlistPage.openWishlist(wishlistData.URLS.WISHLIST);
        await wishlistPage.verifyWishlistEmpty();
    });

    test.only("TC007: Update quantity in Wishlist and Add to Cart", async () => {
        logTitle("TC007: Update quantity in Wishlist and Add to Cart");

        await productDetailPage.openProduct(wishlistData.URLS.FAHRENHEIT);
        await productDetailPage.addToWishlist();

        await wishlistPage.openWishlist(wishlistData.URLS.WISHLIST);
        await wishlistPage.setQuantity(wishlistData.QUANTITY.VALID);
        await wishlistPage.updateWishlist();
        await wishlistPage.verifyQuantity(wishlistData.QUANTITY.VALID);

        await wishlistPage.selectProductToAddCart();

        await wishlistPage.clickAddToCart();

        await expect(wishlistPage.page).toHaveURL(/cart/);
    });
});