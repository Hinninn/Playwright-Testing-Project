// 06_checkout.spec.ts
import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/LoginPage";
import { CartPage } from "../../pages/CartPage";
import { CheckoutPage } from "../../pages/CheckoutPage";
import loginData from "../data/loginData.json";
import checkoutData from "../data/checkoutData.json";
import { logTitle } from "../../helpers/Logger";
import { config } from "../../config";
import { NativeAlertHelper } from "../../helpers/NativeAlertHelper";

test.describe('Checkout Page Tests', () => {
    let checkoutPage: CheckoutPage;
    let cartPage: CartPage;
    let loginPage: LoginPage;
    let nativeAlert: NativeAlertHelper;

    test.beforeEach(async ({ page }) => {
        checkoutPage = new CheckoutPage(page);
        cartPage = new CartPage(page);
        loginPage = new LoginPage(page);
        nativeAlert = new NativeAlertHelper(page);

        await page.goto(`${config.baseURL}/login`);
        await loginPage.login(loginData.VALID.EMAIL, loginData.VALID.PASSWORD);
        await cartPage.openBooksPage();
        await cartPage.addFirstProductToCart();
        await cartPage.openCart();
        await cartPage.acceptTerms();
        await cartPage.clickCheckout();
    });
    test.only("Checkout-001: Checkout successfully", async () => {
        logTitle("Checkout-001: Checkout successfully");

        const billing = {
            firstName: checkoutData.VALID.FIRST_NAME,
            lastName: checkoutData.VALID.LAST_NAME,
            email: checkoutData.VALID.EMAIL,
            company: "",
            country: checkoutData.VALID.COUNTRY,
            state: checkoutData.VALID.STATE,
            city: checkoutData.VALID.CITY,
            address1: checkoutData.VALID.ADDRESS1,
            address2: "",
            zip: checkoutData.VALID.ZIP_CODE,
            phone: checkoutData.VALID.PHONE,
        };

        await checkoutPage.fillBillingAddress(billing);
        await checkoutPage.clickBillingContinue();
        await checkoutPage.clickShippingMethodContinue();
        await checkoutPage.clickPaymentMethodContinue();
        await checkoutPage.clickPaymentInfoContinue();
        await checkoutPage.clickConfirmOrder();

        await expect(checkoutPage.page.locator('h1')).toHaveText(/Thank you/i, { timeout: 15000 });
        await checkoutPage.clickOrderCompletedContinue();
    });

    test.only("Checkout-003: Leave First name empty", async () => {
        logTitle("Checkout-003: Leave First name empty");
        const billing = {
            firstName: checkoutData.VALID.FIRST_NAME,
            lastName: checkoutData.VALID.LAST_NAME,
            email: checkoutData.VALID.EMAIL,
            company: "",
            country: checkoutData.VALID.COUNTRY,
            state: checkoutData.VALID.STATE,
            city: checkoutData.VALID.CITY,
            address1: checkoutData.VALID.ADDRESS1,
            address2: "",
            zip: checkoutData.VALID.ZIP_CODE,
            phone: checkoutData.VALID.PHONE,
        };
        await checkoutPage.fillBillingAddress(billing);
        await checkoutPage.clearFirstName();

        const alertMsg = await nativeAlert.runActionAndGetMessage(async () => {
            await checkoutPage.clickBillingContinue({ timeout: 1500 });
        }, 1500);
        if (alertMsg) {
            expect(alertMsg).toContain(checkoutData.ERROR_MSG.firstNameRequired);
        } else {
            const validation = await checkoutPage.getValidationMessage();
            expect(validation).toContain(checkoutData.ERROR_MSG.firstNameRequired);
        }

        await checkoutPage.page.waitForTimeout(1500);
    });

    test.only("Checkout-004: Leave Last name empty", async () => {
        logTitle("Checkout-004: Leave Last name empty");

        const billing = {
            firstName: checkoutData.VALID.FIRST_NAME,
            lastName: checkoutData.INVALID.LAST_NAME_SPACE,
            email: checkoutData.VALID.EMAIL,
            company: "",
            country: checkoutData.VALID.COUNTRY,
            state: checkoutData.VALID.STATE,
            city: checkoutData.VALID.CITY,
            address1: checkoutData.VALID.ADDRESS1,
            address2: "",
            zip: checkoutData.VALID.ZIP_CODE,
            phone: checkoutData.VALID.PHONE,
        };

        await checkoutPage.fillBillingAddress(billing);
        await checkoutPage.clearLastName();

        const alertMsg = await nativeAlert.runActionAndGetMessage(async () => {
            await checkoutPage.clickBillingContinue({ timeout: 1500 });
        }, 1500);

        if (alertMsg) {
            expect(alertMsg).toContain(checkoutData.ERROR_MSG.lastNameRequired);
        } else {
            const validation = await checkoutPage.getValidationMessage();
            expect(validation).toContain(checkoutData.ERROR_MSG.lastNameRequired);
        }

        await checkoutPage.page.waitForTimeout(1500);
    });

    test.only("Checkout-005: Leave Email empty", async () => {
        logTitle("Checkout-005: Leave Email empty");

        const billing = {
            firstName: checkoutData.VALID.FIRST_NAME,
            lastName: checkoutData.VALID.LAST_NAME,
            email: checkoutData.INVALID.EMAIL_SPACE,
            company: "",
            country: checkoutData.VALID.COUNTRY,
            state: checkoutData.VALID.STATE,
            city: checkoutData.VALID.CITY,
            address1: checkoutData.VALID.ADDRESS1,
            address2: "",
            zip: checkoutData.VALID.ZIP_CODE,
            phone: checkoutData.VALID.PHONE,
        };

        await checkoutPage.fillBillingAddress(billing);
        await checkoutPage.clearEmail();

        const alertMsg = await nativeAlert.runActionAndGetMessage(async () => {
            await checkoutPage.clickBillingContinue({ timeout: 1500 });
        }, 1500);

        if (alertMsg) {
            expect(alertMsg).toContain(checkoutData.ERROR_MSG.emailRequired);
        } else {
            const validation = await checkoutPage.getValidationMessage();
            expect(validation).toContain(checkoutData.ERROR_MSG.emailRequired);
        }

        await checkoutPage.page.waitForTimeout(1500);
    });

    test("Checkout-006: Input invalid Email format", async () => {
        logTitle("Checkout-006: Input invalid Email format");

        const billing = {
            firstName: checkoutData.VALID.FIRST_NAME,
            lastName: checkoutData.VALID.LAST_NAME,
            email: checkoutData.INVALID.EMAIL_FORMAT,
            company: "",
            country: checkoutData.VALID.COUNTRY,
            state: checkoutData.VALID.STATE,
            city: checkoutData.VALID.CITY,
            address1: checkoutData.VALID.ADDRESS1,
            address2: "",
            zip: checkoutData.VALID.ZIP_CODE,
            phone: checkoutData.VALID.PHONE,
        };

        await checkoutPage.fillBillingAddress(billing);

        const alertMsg = await nativeAlert.runActionAndGetMessage(async () => {
            await checkoutPage.clickBillingContinue({ timeout: 1500 });
        }, 1500);

        if (alertMsg) {
            expect(alertMsg).toContain(checkoutData.ERROR_MSG.invalidEmail);
        } else {
            const validation = await checkoutPage.getValidationMessage();
            expect(validation).toContain(checkoutData.ERROR_MSG.invalidEmail);
        }

        await checkoutPage.page.waitForTimeout(1500);
    });

    test("Checkout-007: Do not select a country", async () => {
        logTitle("Checkout-007: Do not select a country");

        const billing = {
            firstName: checkoutData.VALID.FIRST_NAME,
            lastName: checkoutData.VALID.LAST_NAME,
            email: checkoutData.VALID.EMAIL,
            company: "",
            country: "",
            state: undefined,
            city: checkoutData.VALID.CITY,
            address1: checkoutData.VALID.ADDRESS1,
            address2: "",
            zip: checkoutData.VALID.ZIP_CODE,
            phone: checkoutData.VALID.PHONE,
        };

        await checkoutPage.fillBillingAddress(billing);

        const alertMsg = await nativeAlert.runActionAndGetMessage(async () => {
            await checkoutPage.clickBillingContinue({ timeout: 1500 });
        }, 1500);

        if (alertMsg) {
            expect(alertMsg).toContain(checkoutData.ERROR_MSG.countryRequired);
        } else {
            const validation = await checkoutPage.getValidationMessage();
            expect(validation).toContain(checkoutData.ERROR_MSG.countryRequired);
        }

        await checkoutPage.page.waitForTimeout(1500);
    });

    test("Checkout-008: Leave City empty", async () => {
        logTitle("Checkout-008: Leave City empty");

        const billing = {
            firstName: checkoutData.VALID.FIRST_NAME,
            lastName: checkoutData.VALID.LAST_NAME,
            email: checkoutData.VALID.EMAIL,
            company: "",
            country: checkoutData.VALID.COUNTRY,
            state: checkoutData.VALID.STATE,
            city: checkoutData.INVALID.CITY_SPACE,
            address1: checkoutData.VALID.ADDRESS1,
            address2: "",
            zip: checkoutData.VALID.ZIP_CODE,
            phone: checkoutData.VALID.PHONE,
        };

        await checkoutPage.fillBillingAddress(billing);

        const alertMsg = await nativeAlert.runActionAndGetMessage(async () => {
            await checkoutPage.clickBillingContinue({ timeout: 1500 });
        }, 1500);

        if (alertMsg) {
            expect(alertMsg).toContain(checkoutData.ERROR_MSG.cityRequired);
        } else {
            const validation = await checkoutPage.getValidationMessage();
            expect(validation).toContain(checkoutData.ERROR_MSG.cityRequired);
        }

        await checkoutPage.page.waitForTimeout(1500);
    });

    test("Checkout-009: Leave Address 1 empty", async () => {
        logTitle("Checkout-009: Leave Address 1 empty");

        const billing = {
            firstName: checkoutData.VALID.FIRST_NAME,
            lastName: checkoutData.VALID.LAST_NAME,
            email: checkoutData.VALID.EMAIL,
            company: "",
            country: checkoutData.VALID.COUNTRY,
            state: checkoutData.VALID.STATE,
            city: checkoutData.VALID.CITY,
            address1: checkoutData.INVALID.ADDRESS1_SPACE,
            address2: "",
            zip: checkoutData.VALID.ZIP_CODE,
            phone: checkoutData.VALID.PHONE,
        };

        await checkoutPage.fillBillingAddress(billing);

        const alertMsg = await nativeAlert.runActionAndGetMessage(async () => {
            await checkoutPage.clickBillingContinue({ timeout: 1500 });
        }, 1500);

        if (alertMsg) {
            expect(alertMsg).toContain(checkoutData.ERROR_MSG.streetAddressRequired);
        } else {
            const validation = await checkoutPage.getValidationMessage();
            expect(validation).toContain(checkoutData.ERROR_MSG.streetAddressRequired);
        }

        await checkoutPage.page.waitForTimeout(1500);
    });

    test("Checkout-010: Input alphabetic characters in Zip", async () => {
        logTitle("Checkout-010: Input alphabetic characters in Zip");

        const billing = {
            firstName: checkoutData.VALID.FIRST_NAME,
            lastName: checkoutData.VALID.LAST_NAME,
            email: checkoutData.VALID.EMAIL,
            company: "",
            country: checkoutData.VALID.COUNTRY,
            state: checkoutData.VALID.STATE,
            city: checkoutData.VALID.CITY,
            address1: checkoutData.VALID.ADDRESS1,
            address2: "",
            zip: checkoutData.INVALID.ZIP_ALPHA,
            phone: checkoutData.VALID.PHONE,
        };

        await checkoutPage.fillBillingAddress(billing);

        const alertMsg = await nativeAlert.runActionAndGetMessage(async () => {
            await checkoutPage.clickBillingContinue({ timeout: 1500 });
        }, 1500);

        if (alertMsg) {
            expect(alertMsg).toContain(checkoutData.ERROR_MSG.zipCodeNumeric);
        } else {
            const validation = await checkoutPage.getValidationMessage();
            expect(validation).toContain(checkoutData.ERROR_MSG.zipCodeNumeric);
        }

        await checkoutPage.page.waitForTimeout(1500);
    });

    test("Checkout-011: Input special characters in Zip", async () => {
        logTitle("Checkout-011: Input special characters in Zip");

        const billing = {
            firstName: checkoutData.VALID.FIRST_NAME,
            lastName: checkoutData.VALID.LAST_NAME,
            email: checkoutData.VALID.EMAIL,
            company: "",
            country: checkoutData.VALID.COUNTRY,
            state: checkoutData.VALID.STATE,
            city: checkoutData.VALID.CITY,
            address1: checkoutData.VALID.ADDRESS1,
            address2: "",
            zip: checkoutData.INVALID.ZIP_SPECIAL,
            phone: checkoutData.VALID.PHONE,
        };

        await checkoutPage.fillBillingAddress(billing);

        const alertMsg = await nativeAlert.runActionAndGetMessage(async () => {
            await checkoutPage.clickBillingContinue({ timeout: 1500 });
        }, 1500);

        if (alertMsg) {
            expect(alertMsg).toContain(checkoutData.ERROR_MSG.zipCodeNumeric);
        } else {
            const validation = await checkoutPage.getValidationMessage();
            expect(validation).toContain(checkoutData.ERROR_MSG.zipCodeNumeric);
        }

        await checkoutPage.page.waitForTimeout(1500);
    });

    test("Checkout-012: Leave Zip/postal code empty", async () => {
        logTitle("Checkout-012: Leave Zip/postal code empty");

        const billing = {
            firstName: checkoutData.VALID.FIRST_NAME,
            lastName: checkoutData.VALID.LAST_NAME,
            email: checkoutData.VALID.EMAIL,
            company: "",
            country: checkoutData.VALID.COUNTRY,
            state: checkoutData.VALID.STATE,
            city: checkoutData.VALID.CITY,
            address1: checkoutData.VALID.ADDRESS1,
            address2: "",
            zip: checkoutData.INVALID.ZIP_SPACE,
            phone: checkoutData.VALID.PHONE,
        };

        await checkoutPage.fillBillingAddress(billing);

        const alertMsg = await nativeAlert.runActionAndGetMessage(async () => {
            await checkoutPage.clickBillingContinue({ timeout: 1500 });
        }, 1500);

        if (alertMsg) {
            expect(alertMsg).toContain(checkoutData.ERROR_MSG.zipCodeRequired);
        } else {
            const validation = await checkoutPage.getValidationMessage();
            expect(validation).toContain(checkoutData.ERROR_MSG.zipCodeRequired);
        }

        await checkoutPage.page.waitForTimeout(1500);
    });

    test("Checkout-014: Input special characters in Phone", async () => {
        logTitle("Checkout-014: Input special characters in Phone");

        const billing = {
            firstName: checkoutData.VALID.FIRST_NAME,
            lastName: checkoutData.VALID.LAST_NAME,
            email: checkoutData.VALID.EMAIL,
            company: "",
            country: checkoutData.VALID.COUNTRY,
            state: checkoutData.VALID.STATE,
            city: checkoutData.VALID.CITY,
            address1: checkoutData.VALID.ADDRESS1,
            address2: "",
            zip: checkoutData.VALID.ZIP_CODE,
            phone: checkoutData.INVALID.PHONE_SPECIAL,
        };

        await checkoutPage.fillBillingAddress(billing);

        const alertMsg = await nativeAlert.runActionAndGetMessage(async () => {
            await checkoutPage.clickBillingContinue({ timeout: 1500 });
        }, 1500);

        if (alertMsg) {
            expect(alertMsg).toContain(checkoutData.ERROR_MSG.phoneInvalidFormat);
        } else {
            const validation = await checkoutPage.getValidationMessage();
            expect(validation).toContain(checkoutData.ERROR_MSG.phoneInvalidFormat);
        }

        await checkoutPage.page.waitForTimeout(1500);
    });

    test("Checkout-015: Input invalid phone length short", async () => {
        logTitle("Checkout-015: Input invalid phone length short");

        const billing = {
            firstName: checkoutData.VALID.FIRST_NAME,
            lastName: checkoutData.VALID.LAST_NAME,
            email: checkoutData.VALID.EMAIL,
            company: "",
            country: checkoutData.VALID.COUNTRY,
            state: checkoutData.VALID.STATE,
            city: checkoutData.VALID.CITY,
            address1: checkoutData.VALID.ADDRESS1,
            address2: "",
            zip: checkoutData.VALID.ZIP_CODE,
            phone: checkoutData.INVALID.PHONE_SHORT,
        };

        await checkoutPage.fillBillingAddress(billing);

        const alertMsg = await nativeAlert.runActionAndGetMessage(async () => {
            await checkoutPage.clickBillingContinue({ timeout: 1500 });
        }, 1500);

        if (alertMsg) {
            expect(alertMsg).toContain(checkoutData.ERROR_MSG.phoneLength);
        } else {
            const validation = await checkoutPage.getValidationMessage();
            expect(validation).toContain(checkoutData.ERROR_MSG.phoneLength);
        }

        await checkoutPage.page.waitForTimeout(1500);
    });

    test("Checkout-016: Input invalid phone length long", async () => {
        logTitle("Checkout-016: Input invalid phone length long");

        const billing = {
            firstName: checkoutData.VALID.FIRST_NAME,
            lastName: checkoutData.VALID.LAST_NAME,
            email: checkoutData.VALID.EMAIL,
            company: "",
            country: checkoutData.VALID.COUNTRY,
            state: checkoutData.VALID.STATE,
            city: checkoutData.VALID.CITY,
            address1: checkoutData.VALID.ADDRESS1,
            address2: "",
            zip: checkoutData.VALID.ZIP_CODE,
            phone: checkoutData.INVALID.PHONE_LONG,
        };

        await checkoutPage.fillBillingAddress(billing);

        const alertMsg = await nativeAlert.runActionAndGetMessage(async () => {
            await checkoutPage.clickBillingContinue({ timeout: 1500 });
        }, 1500);

        if (alertMsg) {
            expect(alertMsg).toContain(checkoutData.ERROR_MSG.phoneLength);
        } else {
            const validation = await checkoutPage.getValidationMessage();
            expect(validation).toContain(checkoutData.ERROR_MSG.phoneLength);
        }

        await checkoutPage.page.waitForTimeout(1500);
    });

    test("Checkout-017: Leave Phone empty", async () => {
        logTitle("Checkout-017: Leave Phone empty");

        const billing = {
            firstName: checkoutData.VALID.FIRST_NAME,
            lastName: checkoutData.VALID.LAST_NAME,
            email: checkoutData.VALID.EMAIL,
            company: "",
            country: checkoutData.VALID.COUNTRY,
            state: checkoutData.VALID.STATE,
            city: checkoutData.VALID.CITY,
            address1: checkoutData.VALID.ADDRESS1,
            address2: "",
            zip: checkoutData.VALID.ZIP_CODE,
            phone: "",
        };

        await checkoutPage.fillBillingAddress(billing);

        const alertMsg = await nativeAlert.runActionAndGetMessage(async () => {
            await checkoutPage.clickBillingContinue({ timeout: 1500 });
        }, 1500);

        if (alertMsg) {
            expect(alertMsg).toContain(checkoutData.ERROR_MSG.phoneRequired);
        } else {
            const validation = await checkoutPage.getValidationMessage();
            expect(validation).toContain(checkoutData.ERROR_MSG.phoneRequired);
        }

        await checkoutPage.page.waitForTimeout(1500);
    });
});