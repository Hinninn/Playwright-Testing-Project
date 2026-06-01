import { test, expect } from "@playwright/test";
import { RegisterPage } from "../../pages/RegisterPage";
import registerData from "../data/registerData.json";
import { logTitle } from "../../helpers/Logger";

test.describe('Registration Page Tests', () => {
  let registerPage: RegisterPage;

  test.beforeEach(async ({ page }) => {
    registerPage = new RegisterPage(page);
    await registerPage.gotoRegister();
  });

  test('TC001: Register successfully with required fields only', async () => {
    logTitle('TC001: Register successfully with required fields only');

    await registerPage.fillFirstName(registerData.VALID.FIRST_NAME);
    await registerPage.fillLastName(registerData.VALID.LAST_NAME);
    await registerPage.fillEmail(registerData.VALID.EMAIL);
    await registerPage.fillPassword(registerData.VALID.PASSWORD);
    await registerPage.fillConfirmPassword(registerData.VALID.PASSWORD);
    await registerPage.clickRegister();

    const successMessage = await registerPage.getSuccessMessage();
    expect(successMessage).toContain(registerData.SUCCESS_MSG.registrationComplete);
  });
});
