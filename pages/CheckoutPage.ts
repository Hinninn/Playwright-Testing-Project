// CheckoutPage.ts
import { Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { logStep } from "../helpers/Logger";

export class CheckoutPage extends BasePage {

    // locators
    private firstNameInput = this.page.locator('#BillingNewAddress_FirstName');
    private lastNameInput = this.page.locator('#BillingNewAddress_LastName');
    private emailInput = this.page.locator('#BillingNewAddress_Email');
    private companyInput = this.page.locator('#BillingNewAddress_Company');

    private countryDropdown = this.page.locator('#BillingNewAddress_CountryId');
    private stateDropdown = this.page.locator('#BillingNewAddress_StateProvinceId');

    private cityInput = this.page.locator('#BillingNewAddress_City');
    private addressInput = this.page.locator('#BillingNewAddress_Address1');
    private address2Input = this.page.locator('#BillingNewAddress_Address2');
    private zipInput = this.page.locator('#BillingNewAddress_ZipPostalCode');
    private phoneInput = this.page.locator('#BillingNewAddress_PhoneNumber');

    private billingContinueButton = this.page.locator('(//button[@name="save"])[1]');
    private shippingMethodContinueButton = this.page.locator("//button[contains(@class,'shipping-method-next-step-button')]");
    private paymentMethodContinueButton = this.page.locator("//button[contains(@class,'payment-method-next-step-button')]");
    private paymentInfoContinueButton = this.page.locator("//button[contains(@class,'payment-info-next-step-button')]");
    private confirmOrderButton = this.page.locator("//button[contains(@class,'confirm-order-next-step-button')]");
    private orderCompletedContinueButton = this.page.locator("//button[contains(@class,'order-completed-continue-button')]");

    private validationMessage = this.page.locator(
        'span.field-validation-error, div.validation-summary-errors, .validation-summary-errors li'
    );

    constructor(page: Page) {
        super(page);    }

    async ensureCheckoutPageLoaded(): Promise<void> {
        logStep('Ensuring Checkout Page is loaded');
        await this.page.locator('#opc-billing, #checkout-step-billing').first().waitFor({
            state: 'visible',
            timeout: 15000,
        });
        await this.billingContinueButton.waitFor({ state: 'visible', timeout: 15000 });
    }
    async getValidationMessage(): Promise<string> {
        if (await this.validationMessage.isVisible({ timeout: 3000 })) {
            return (await this.validationMessage.textContent())?.trim() || '';
        } else {
            return '';
        }
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
        logStep('Filling Billing Address');
        await this.firstNameInput.fill(data.firstName, { force: true });
        await this.lastNameInput.fill(data.lastName, { force: true });
        await this.emailInput.fill(data.email, { force: true });
        await this.companyInput.fill(data.company ?? '', { force: true });
        await this.selectCountryAndState(data.country, data.state);
        await this.cityInput.fill(data.city, { force: true });
        await this.addressInput.fill(data.address1, { force: true });
        await this.address2Input.fill(data.address2 ?? '', { force: true });
        await this.zipInput.fill(data.zip, { force: true });
        await this.phoneInput.fill(data.phone, { force: true });
        await this.page.waitForTimeout(500);
    }
    async clickBillingContinue(options?: { timeout?: number }): Promise<boolean> {
        const timeout = options?.timeout ?? 15000;
        logStep('Clicking Billing Continue Button');
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
        logStep('Clicking Shipping Method Continue Button');
        await this.clickElement(this.shippingMethodContinueButton, 'Shipping Method Continue Button');

        await this.paymentMethodContinueButton.waitFor({
        state: 'visible',
        timeout: 15000
    });
    }

    async clickPaymentMethodContinue(): Promise<void> {
        logStep('Clicking Payment Method Continue Button');
        await this.clickElement(this.paymentMethodContinueButton, 'Payment Method Continue Button');

        await this.paymentInfoContinueButton.waitFor({
        state: 'visible',
        timeout: 15000
    });
    }

    async clickPaymentInfoContinue(): Promise<void> {
        logStep('Clicking Payment Info Continue Button');
        await this.clickElement(this.paymentInfoContinueButton, 'Payment Info Continue Button');

        await this.paymentInfoContinueButton.waitFor({
        state: 'visible',
        timeout: 15000
    });
    }

    async clickConfirmOrder(): Promise<void> {
        logStep('Clicking Confirm Order Button');
        await this.clickElement(this.confirmOrderButton, 'Confirm Order Button');

        await this.orderCompletedContinueButton.waitFor({
        state: 'visible',
        timeout: 15000
    });
    }

    async clickOrderCompletedContinue(): Promise<void> {
        logStep('Clicking Order Completed Continue Button');
        await this.clickElement(this.orderCompletedContinueButton, 'Order Completed Continue Button');
        await this.page.waitForTimeout(1000);
    }
    private async selectCountryAndState(country: string, state?: string): Promise<void> {
        await this.countryDropdown.selectOption({ label: country });
        await this.page.waitForTimeout(1000);
        if (state) {
            await this.stateDropdown.selectOption({ label: state });
            await this.page.waitForTimeout(1000);
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