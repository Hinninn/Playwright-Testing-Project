import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/LoginPage";
import loginData from "../data/loginData.json";
import { logTitle } from "../../helpers/Logger";
import { config } from "../../config";

test.describe('Login Page Tests', () => {
    let loginPage: LoginPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await loginPage.goto("https://demo.nopcommerce.com/login");
        // await loginPage.goto(loginData.URL);
    });
    test('TC001: Login successful', async () => {
        logTitle("TC001: Login successful");
        await loginPage.login(config.valid_email, config.valid_password);
        const title = await loginPage.getTitle();
        expect(title).toBe(loginData.TITLE);
        await loginPage.page.waitForTimeout(9000);
    });
    test("TC002: Input a valid Email address with leading and/or trailing spaces", async () => {
        logTitle("TC002: Input a valid Email address with leading and/or trailing spaces");
        await loginPage.login(` ${loginData.VALID.EMAIL} `, loginData.VALID.PASSWORD);
        const title = await loginPage.getTitle();
        expect(title).toBe(loginData.TITLE);
        await loginPage.page.waitForTimeout(4000);
    });
    test("TC003: Input email uppercase/lowercase", async () => {
        logTitle("TC003: Input email uppercase/lowercase");
        await loginPage.login(loginData.VALID.EMAIL.toUpperCase(), loginData.VALID.PASSWORD);
        const title = await loginPage.getTitle();
        expect(title).toBe(loginData.TITLE);
        await loginPage.page.waitForTimeout(4000);
    });
    test("TC004: Leave Email empty", async () => {
        logTitle("TC004: Leave Email empty");
        await loginPage.login("", loginData.VALID.PASSWORD);
        const errorMessage = await loginPage.getErrorMessage();
        expect(errorMessage).toBe(loginData.ERROR_MSG.emptyEmail);
        await loginPage.page.waitForTimeout(4000);
    });
    test("TC005: Input unregistered email", async () => {
        logTitle("TC005: Input unregistered email");
        await loginPage.login(loginData.INVALID.EMAIL, loginData.INVALID.WRONG_PASSWORD);
        const errorMessage = await loginPage.getErrorMessage();
        expect(errorMessage).toBe(loginData.ERROR_MSG.loginUnsuccessful);
        await loginPage.page.waitForTimeout(4000);
    });
    test("TC006: Email without @", async () => {
        logTitle("TC006: Email without @");
        await loginPage.login(loginData.INVALID.EMAIL_MISSING_AT, loginData.VALID.PASSWORD);
        await loginPage.clickOutside();
        const errorMessage = await loginPage.getErrorMessage();
        expect(errorMessage).toContain(loginData.ERROR_MSG.invalidEmailFormat);
        await loginPage.page.waitForTimeout(4000);
    });
    test("TC007: Email contains space", async () => {
        logTitle("TC007: Email contains space");
        await loginPage.login(loginData.INVALID.EMAIL_WITH_SPACE, loginData.VALID.PASSWORD);
        await loginPage.clickOutside();
        const errorMessage = await loginPage.getErrorMessage();
        expect(errorMessage).toContain(loginData.ERROR_MSG.invalidEmailFormat);
        await loginPage.page.waitForTimeout(4000);
    });
    test.only("TC008: Input email exceeding maximum length", async () => {
        logTitle("TC008: Input email exceeding maximum length");
        await loginPage.login(loginData.INVALID.LONG_EMAIL, loginData.VALID.PASSWORD);
        const errorMessage = await loginPage.getErrorMessage();
        expect(errorMessage).toContain(loginData.ERROR_MSG.emailMaxLength);
        await loginPage.page.waitForTimeout(4000);
    });
    test("TC009: Input email containing '#'", async () => {
        logTitle("TC009: Input email containing '#'");
        await loginPage.login(loginData.INVALID.EMAIL_WITH_SPECIAL_CHAR, loginData.VALID.PASSWORD);
        await loginPage.clickOutside();
        const errorMessage = await loginPage.getErrorMessage();
        expect(errorMessage).toContain(loginData.ERROR_MSG.invalidEmailFormat);
        await loginPage.page.waitForTimeout(4000);
    });
    test("TC010: Email containing only @ characters", async () => {
        logTitle("TC010: Email containing only @ characters");
        await loginPage.login(loginData.INVALID.EMAIL_ONLY_AT, loginData.VALID.PASSWORD);
        await loginPage.clickOutside();
        const errorMessage = await loginPage.getErrorMessage();
        expect(errorMessage).toContain(loginData.ERROR_MSG.invalidEmailFormat);
        await loginPage.page.waitForTimeout(4000);
    });
    test("TC011: Leave Password empty", async () => {
        logTitle("TC011: Leave Password empty");
        await loginPage.login(loginData.VALID.EMAIL, "");
        const errorMessage = await loginPage.getErrorMessage();
        expect(errorMessage).toBe(loginData.ERROR_MSG.emptyPassword);
        await loginPage.page.waitForTimeout(4000);
    });
    test("TC012: Input wrong password", async () => {
        logTitle("TC012: Input wrong password");
        await loginPage.login(loginData.VALID.EMAIL, loginData.INVALID.WRONG_PASSWORD);
        const errorMessage = await loginPage.getErrorMessage();
        expect(errorMessage).toBe(loginData.ERROR_MSG.wrongPassword);
        await loginPage.page.waitForTimeout(4000); // Wait for potential error message to appear
    });
    test("TC013: Input password exceeding maximum length", async () => {
        logTitle("TC013: Input password exceeding maximum length");
        await loginPage.login(loginData.VALID.EMAIL, loginData.INVALID.LONG_PASSWORD);
        const errorMessage = await loginPage.getErrorMessage();
        expect(errorMessage).toBe(loginData.ERROR_MSG.passwordMaxLength);
        await loginPage.page.waitForTimeout(4000); // Wait for potential error message to appear
    });
    test("TC014: Input wrong password >3 times", async () => {
        logTitle("TC014: Input wrong password >3 times");
        for (let i = 0; i < 3; i++) {
            await loginPage.login(loginData.VALID.EMAIL, loginData.INVALID.WRONG_PASSWORD);
            await loginPage.goto(loginData.URL);
        }
        const errorMessage = await loginPage.getErrorMessage();
        expect(errorMessage).toBe(loginData.ERROR_MSG.accountLocked);
        await loginPage.page.waitForTimeout(4000); // Wait for potential error message to appear
    });
    test("TC015: Login with Enter key", async () => {
        logTitle("TC015: Login with Enter key");
        await loginPage.loginWithEnter(loginData.VALID.EMAIL, loginData.VALID.PASSWORD);
        const title = await loginPage.getTitle();
        expect(title).toBe(loginData.TITLE);
        await loginPage.page.waitForTimeout(4000);
    });
    test("TC016: Check Remember Me", async ({ context }) => {
        logTitle("TC016: Check Remember Me");
        await loginPage.loginWithRemember(loginData.VALID.EMAIL, loginData.VALID.PASSWORD);
        const title = await loginPage.getTitle();
        expect(title).toBe(loginData.TITLE);
    });
    test("TC018: Login unsuccessful with empty fields", async () => {
        logTitle("TC018: Login unsuccessful with empty fields");
        await loginPage.login("", "");
        const errorMessage = await loginPage.getErrorMessage();
        expect(errorMessage).toBe(loginData.ERROR_MSG.emptyEmail);
        await loginPage.page.waitForTimeout(4000);
    });
});
