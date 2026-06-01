// CheckoutPage.ts
import { Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import fs from 'fs';

export class CheckoutPage extends BasePage {

    // locators
    private firstNameInput = this.page.locator("//input[@id='BillingNewAddress_FirstName']");
    private lastNameInput = this.page.locator("//input[@id='BillingNewAddress_LastName']");
    private emailInput = this.page.locator("//input[@id='BillingNewAddress_Email']");
    private companyInput = this.page.locator("//input[@id='BillingNewAddress_Company']");
    private countryDropdown = this.page.locator("//select[@id='BillingNewAddress_CountryId']");
    private stateDropdown = this.page.locator("//select[@id='BillingNewAddress_StateProvinceId']");
    private cityInput = this.page.locator("//input[@id='BillingNewAddress_City']");
    private addressInput = this.page.locator("//input[@id='BillingNewAddress_Address1']");
    private address2Input = this.page.locator("//input[@id='BillingNewAddress_Address2']");
    private zipInput = this.page.locator("//input[@id='BillingNewAddress_ZipPostalCode']");
    private phoneInput = this.page.locator("//input[@id='BillingNewAddress_PhoneNumber']");

    private billingContinueButton = this.page.locator('(//button[@name="save"])[1]');
    private shippingMethodContinueButton = this.page.locator("//button[contains(@class,'shipping-method-next-step-button')]");
    private paymentMethodContinueButton = this.page.locator("//button[contains(@class,'payment-method-next-step-button')]");
    private paymentInfoContinueButton = this.page.locator("//button[contains(@class,'payment-info-next-step-button')]");
    private confirmOrderButton = this.page.locator("//button[contains(@class,'confirm-order-next-step-button')]");
    private orderCompletedContinueButton = this.page.locator("//button[contains(@class,'order-completed-continue-button')]");

    constructor(page: Page) {
        super(page);    }

    async ensureCheckoutPageLoaded(): Promise<void> {
        await this.billingContinueButton.first().waitFor({
            state: 'visible',
            timeout: 15000
        });
    }
    async fillBillingAddress(data: {
        firstName: string;
        lastName: string;
        email: string;
        company?: string;
        country: string;
        state?: string;
        city: string;
        address1: string;
        address2?: string;
        zip: string;
        phone: string;
    }): Promise<void> {
        await this.inputText(this.firstNameInput, data.firstName, 'First Name');
        await this.inputText(this.lastNameInput, data.lastName, 'Last Name');
        await this.inputText(this.emailInput, data.email, 'Email');
        await this.inputText(this.companyInput, data.company ?? '', 'Company');

        await this.selectCountryAndState(data.country, data.state);

        await this.inputText(this.cityInput, data.city, 'City');
        await this.inputText(this.addressInput, data.address1, 'Address 1');
        await this.inputText(this.address2Input, data.address2 ?? '', 'Address 2');
        await this.inputText(this.zipInput, data.zip, 'Zip / Postal Code');
        await this.inputText(this.phoneInput, data.phone, 'Phone Number');

        await this.page.waitForTimeout(500);
    }
    async clickBillingContinue(options?: { timeout?: number }): Promise<boolean> {
        const timeout = options?.timeout ?? 15000;
        await this.clickElement(this.billingContinueButton, 'Billing Continue Button');

        try {
            await this.shippingMethodContinueButton.waitFor({
                state: 'visible',
                timeout,
            });
            return true;
        } catch {
            return false;
        }
    }

    async clickShippingMethodContinue(): Promise<void> {
        await this.clickElement(this.shippingMethodContinueButton, 'Shipping Method Continue Button');

        await this.paymentMethodContinueButton.waitFor({
        state: 'visible',
        timeout: 15000
    });
    }

    async clickPaymentMethodContinue(): Promise<void> {
        await this.clickElement(this.paymentMethodContinueButton, 'Payment Method Continue Button');

        await this.paymentInfoContinueButton.waitFor({
        state: 'visible',
        timeout: 15000
    });
    }

    async clickPaymentInfoContinue(): Promise<void> {
        await this.clickElement(this.paymentInfoContinueButton, 'Payment Info Continue Button');

        await this.confirmOrderButton.waitFor({
        state: 'visible',
        timeout: 15000
    });
    }

    async clickConfirmOrder(): Promise<void> {
        await this.clickElement(this.confirmOrderButton, 'Confirm Order Button');

        await this.orderCompletedContinueButton.waitFor({
        state: 'visible',
        timeout: 15000
    });
    }

    async clickOrderCompletedContinue(): Promise<void> {
        await this.clickElement(this.orderCompletedContinueButton, 'Order Completed Continue Button');
        await this.page.waitForTimeout(1000);
    }
    private async selectCountryAndState(country: string, state?: string): Promise<void> {
        if (country) {
            await this.countryDropdown.selectOption({ label: country });
            await this.page.waitForTimeout(1000);
            if (state) {
                await this.stateDropdown.selectOption({ label: state });
                await this.page.waitForTimeout(1000);
            }
        }
    }
    async clearFirstName() {
    await this.firstNameInput.fill('');
    }
    async clearLastName() {
    await this.lastNameInput.fill('');
    }
    async clearEmail() {
    await this.emailInput.fill('');
    }
}