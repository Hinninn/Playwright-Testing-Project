import { Locator, Page } from "@playwright/test";
import { logStep } from "./Logger";

export class DialogHelper {
    private page: Page;
    private dialog: Locator;
    private dialogContent: Locator;
    private dialogCloseBtn: Locator;

    constructor(page: Page) {
        this.page = page;
        this.dialog = page.getByRole("dialog");
        this.dialogContent = this.dialog.locator("p").first();
        this.dialogCloseBtn = this.dialog.getByRole("button", { name: /close/i });
    }

    async waitForDialogVisible(): Promise<void> {
        logStep("Waiting for UI dialog");
        await this.dialog.waitFor({ state: "visible", timeout: 10000 });
    }

    async getDialogMessage(): Promise<string> {
        logStep("Getting UI dialog message");
        const text = await this.dialogContent.textContent();
        return (text ?? "").trim();
    }

    async closeDialog(): Promise<void> {
        logStep("Closing UI dialog");
        await this.dialogCloseBtn.click();
        await this.page.waitForTimeout(500);
    }
}
