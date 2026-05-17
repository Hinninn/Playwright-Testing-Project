
import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/LoginPage";
import logoutData from "../data/logoutData.json";
import { logTitle } from "../../helpers/Logger";
import { LogoutPage } from "../../pages/LogoutPage";

test.describe('Logout Page Tests', () => {
    let logoutPage: LogoutPage;

    test.beforeEach(async ({ page }) => {
    logoutPage = new LogoutPage(page);
    await logoutPage.goto(logoutData.URL);

    const loginPage = new LoginPage(page);
    await loginPage.login(
        logoutData.VALID.EMAIL,
        logoutData.VALID.PASSWORD);
    });
    test('TC01: Logout successful', async () => {
        logTitle("TC01: Logout successful");
        await logoutPage.logout();
        const title = await logoutPage.getTitle();
        expect(title).toBe(logoutData.TITLE);
        await logoutPage.page.waitForTimeout(4000);
    });
    test("TC02: Access My Account after logout", async () => {
        logTitle("TC02: Access My Account after logout");
        const myAccountUrl = "https://demo.nopcommerce.com/customer/info";
        await logoutPage.logout();
        await logoutPage.page.goto(myAccountUrl);
        const title = await logoutPage.getTitle();
        await expect(logoutPage.page).toHaveURL(/login/);
        await logoutPage.page.waitForTimeout(4000);
    });
    test("TC03: Logout then press Back", async () => {
        logTitle("TC03: Logout then press Back");
        await logoutPage.logout();
        await logoutPage.page.goBack();
        await logoutPage.page.reload();
        const title = await logoutPage.getTitle();
        await expect(logoutPage.page).toHaveURL("https://demo.nopcommerce.com/");
        await logoutPage.page.waitForTimeout(4000);
    });
    test("TC04: Logout one tab, check another tab", async ({ context }) => {
        logTitle("TC04: Logout one tab, check another tab");
        const tabB = await context.newPage();
        await tabB.goto(logoutData.URL);
        await logoutPage.logout();
        await tabB.reload();
        const title = await tabB.title();
        await expect(tabB).toHaveURL(/demo.nopcommerce.com/);
        await tabB.waitForTimeout(4000);
    });
});
