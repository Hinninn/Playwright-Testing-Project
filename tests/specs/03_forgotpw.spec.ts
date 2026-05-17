import { test, expect } from "@playwright/test";
import { ForgotpwPage } from "../../pages/ForgotpwPage";
import ForgotpwData from "../data/forgotpwData.json";
import { logTitle } from "../../helpers/Logger";
import { LoginPage } from "../../pages/LoginPage";


test.describe('Forgot Password Page Tests', () => {
    let forgotpwPage: ForgotpwPage;
    test.beforeEach(async ({ page }) => {
    forgotpwPage = new ForgotpwPage(page);
    await forgotpwPage.goto(ForgotpwData.URL);
    });
    test("TC01: Input valid email", async () => {
        logTitle("TC01: Input valid email");
        await forgotpwPage.inputEmail(ForgotpwData.VALID.EMAIL);
        await forgotpwPage.submit();
        const message = await forgotpwPage.getMessage();
        expect(message).toContain(ForgotpwData.MSG.instructionsSent);
        await forgotpwPage.page.waitForTimeout(4000);
    });
    test("TC02: Input a valid Email address with leading and/or trailing spaces", async () => {
        logTitle("TC02: Input a valid Email address with leading and/or trailing spaces");
        await forgotpwPage.inputEmail(` ${ForgotpwData.VALID.EMAIL} `);
        await forgotpwPage.submit();
        const message = await forgotpwPage.getMessage();
        expect(message).toContain(ForgotpwData.MSG.instructionsSent);
        await forgotpwPage.page.waitForTimeout(4000);
    });
    test("TC03: Input email uppercase/lowercase", async () => {
        logTitle("TC03: Input email uppercase/lowercase");
        const upper = ForgotpwData.VALID.EMAIL.toUpperCase();
        await forgotpwPage.inputEmail(upper);
        await forgotpwPage.submit();
        const message = await forgotpwPage.getMessage();
        expect(message).toContain(ForgotpwData.MSG.instructionsSent);
        await forgotpwPage.page.waitForTimeout(4000);
    });
    test("TC04: Input unregistered email", async () => {
        logTitle("TC04: Input unregistered email");
        await forgotpwPage.inputEmail(ForgotpwData.INVALID.EMAIL);
        await forgotpwPage.submit();
        const message = await forgotpwPage.getMessage();
        expect(message).toContain(ForgotpwData.MSG.emailNotFound);
        await forgotpwPage.page.waitForTimeout(4000);
    });
    test("TC05: Leave Email empty", async () => {
        logTitle("TC05: Leave Email empty");
        await forgotpwPage.inputEmail('');
        await forgotpwPage.submit();
        const message = await forgotpwPage.getMessage();
        expect(message).toContain(ForgotpwData.MSG.enterEmail);
        await forgotpwPage.page.waitForTimeout(4000);
    });
    test("TC06: Email without @", async () => {
        logTitle("TC06: Email without @");
        await forgotpwPage.inputEmail(ForgotpwData.INVALID.EMAIL_MISSING_AT);
        await forgotpwPage.submit();
        const message = await forgotpwPage.getMessage();
        expect(message).toContain(ForgotpwData.MSG.validEmail);
        await forgotpwPage.page.waitForTimeout(4000);
    });
    test("TC07: Email contains space", async () => {
        logTitle("TC07: Email contains space");
        await forgotpwPage.inputEmail(ForgotpwData.INVALID.EMAIL_WITH_SPACE);
        await forgotpwPage.submit();
        const message = await forgotpwPage.getMessage();
        expect(message).toContain(ForgotpwData.MSG.validEmail);
        await forgotpwPage.page.waitForTimeout(4000);
    });
    test("TC08: Click link Forgot Password", async ({ page }) => {
        logTitle("TC08: Click link Forgot Password");
        const loginPage = new LoginPage(page);
        const forgotpwPage = new ForgotpwPage(page);
        await page.goto('https://demo.nopcommerce.com/');
        await loginPage.clickLoginLink();
        await loginPage.clickForgotPassword();
        await expect(page).toHaveURL(/passwordrecovery/);
        const title = await forgotpwPage.getTitle();
        expect(title).toBe(ForgotpwData.TITLE);
    });
});
