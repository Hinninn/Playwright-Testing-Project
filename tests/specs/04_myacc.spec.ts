import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/LoginPage";
import { MyaccPage } from "../../pages/MyaccPage.ts";
import loginData from "../data/loginData.json";
import myaccData from "../data/myaccData.json";
import { logTitle } from "../../helpers/Logger";

test.describe('My Account Page Tests', () => {
    let loginPage: LoginPage;
    let myaccPage: MyaccPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        myaccPage = new MyaccPage(page);
        await loginPage.goto(loginData.URL);
        await loginPage.login(loginData.VALID.EMAIL, loginData.VALID.PASSWORD);
        await myaccPage.gotoMyAccount();
    });

    test('TC01: Update info successfully', async ({ page }) => {
        logTitle('TC01: Update info successfully');
        await myaccPage.fillFirstName(myaccData.VALID.FIRST_NAME);
        await myaccPage.fillLastName(myaccData.VALID.LAST_NAME);
        await myaccPage.fillEmail(myaccData.VALID.EMAIL);
        await myaccPage.clickSave();
        const successMessage = await myaccPage.getSuccessMessage();
        expect(successMessage).toContain(myaccData.ERROR_MSG.updatedSuccess);
    });
    test('TC02: Leave mandatory First name empty', async ({ page }) => {
        logTitle('TC02: Leave mandatory First name empty');
        await myaccPage.fillFirstName('');
        await myaccPage.fillLastName(myaccData.VALID.LAST_NAME);
        await myaccPage.fillEmail(myaccData.VALID.EMAIL);
        await myaccPage.clickSave();
        const fieldError = await myaccPage.getFieldError();
        expect(fieldError).toContain(myaccData.ERROR_MSG.firstNameRequired);
    });
    test('TC03: Leave mandatory Last name empty', async ({ page }) => {
        logTitle('TC03: Leave mandatory Last name empty');
        await myaccPage.fillFirstName(myaccData.VALID.FIRST_NAME);
        await myaccPage.fillLastName('');
        await myaccPage.fillEmail(myaccData.VALID.EMAIL);
        await myaccPage.clickSave();
        const fieldError = await myaccPage.getFieldError();
        expect(fieldError).toContain(myaccData.ERROR_MSG.lastNameRequired);
    });
    test('TC04: Leave mandatory Email empty', async ({ page }) => {
        logTitle('TC04: Leave mandatory Email empty');
        await myaccPage.fillFirstName(myaccData.VALID.FIRST_NAME);
        await myaccPage.fillLastName(myaccData.VALID.LAST_NAME);
        await myaccPage.fillEmail('');
        await myaccPage.clickSave();
        const fieldError = await myaccPage.getFieldError();
        expect(fieldError).toContain(myaccData.ERROR_MSG.emailRequired);
    });
    test('TC05: Input email exceeding maximum length', async ({ page }) => {
        logTitle('TC05: Input email exceeding maximum length');
        const longEmail = `${'x'.repeat(200)}@y.com`;
        await myaccPage.fillFirstName(myaccData.VALID.FIRST_NAME);
        await myaccPage.fillLastName(myaccData.VALID.LAST_NAME);
        await myaccPage.fillEmail(longEmail);
        await myaccPage.clickSave();
        const fieldError = await myaccPage.getFieldError();
        expect(fieldError).toContain(myaccData.ERROR_MSG.emailTooLong);
    });
    test('TC06: Input duplicated Email', async ({ page }) => {
        logTitle('TC06: Input duplicated Email');
        await myaccPage.fillFirstName(myaccData.VALID.FIRST_NAME);
        await myaccPage.fillLastName(myaccData.VALID.LAST_NAME);
        await myaccPage.fillEmail(myaccData.DUPLICATED.EMAIL);
        await myaccPage.clickSave();
        const fieldError = await myaccPage.getFieldError();
        expect(fieldError).toContain(myaccData.ERROR_MSG.emailInUse);
    });
    test('TC07: Input only spaces in First name', async ({ page }) => {
        logTitle('TC07: Input only spaces in First name');
        await myaccPage.fillFirstName('   ');
        await myaccPage.fillLastName(myaccData.VALID.LAST_NAME);
        await myaccPage.fillEmail(myaccData.VALID.EMAIL);
        await myaccPage.clickSave();
        const fieldError = await myaccPage.getFieldError();
        expect(fieldError).toContain(myaccData.ERROR_MSG.firstNameRequired);
    });
    test('TC09: Input email containing "#" character', async ({ page }) => {
        logTitle('TC09: Input email containing "#" character');
        await myaccPage.fillFirstName(myaccData.VALID.FIRST_NAME);
        await myaccPage.fillLastName(myaccData.VALID.LAST_NAME);
        await myaccPage.fillEmail('abc#@gmail.com');
        await myaccPage.clickSave();
        const fieldError = await myaccPage.getFieldError();
        expect(fieldError).toContain(myaccData.ERROR_MSG.validEmail);
    });
});