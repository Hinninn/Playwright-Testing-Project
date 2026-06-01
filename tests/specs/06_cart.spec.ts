// import { test, expect } from "@playwright/test";
// import loginData from "../data/loginData.json";
// import cartData from "../data/cartData.json";
// import { logTitle } from "../../helpers/Logger";
// import { config } from "../../config";
// import { CartPage } from "../../pages/CartPage";
// import { LoginPage } from "../../pages/LoginPage";
// import { DialogHelper } from "../../helpers/DialogHelper";

// test.describe('Cart Page Tests', () => {
//     let cartPage: CartPage;
//     let loginPage: LoginPage;
//     let uiDialog: DialogHelper;


//     test.beforeEach(async ({ page }) => {
//         cartPage = new CartPage(page);
//         loginPage = new LoginPage(page);
//         uiDialog = new DialogHelper(page);

//         await page.goto(`${config.baseURL}/login`);
//         await loginPage.login(
//             loginData.VALID.EMAIL,
//             loginData.VALID.PASSWORD
//         );
//         await cartPage.openCart();
//     });
//     test("TC02: Leave T&C unchecked", async ({ page }) => {
//         logTitle("TC02: Leave T&C unchecked");
//         await cartPage.clickCheckout();
//         await uiDialog.waitForDialogVisible();
//         const message = await uiDialog.getDialogMessage();
//         expect(message).toContain(cartData.ERROR_MSG.termsOfServiceRequired);
//         await uiDialog.closeDialog();
//         await page.waitForTimeout(4000);
//     });
// });
