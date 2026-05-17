// NativeAlertHelper.ts — popup alert() của trình duyệt (Playwright page.on('dialog')), KHÔNG phải ui-dialog.
import { Page } from "@playwright/test";
import { logStep } from "./Logger";

export class NativeAlertHelper {
    private page: Page;
    private lastMessage: string | null = null;

    constructor(page: Page) {
        this.page = page;
        page.on("dialog", async (browserDialog) => {
            this.lastMessage = browserDialog.message();
            logStep(`Native alert: ${this.lastMessage}`);
            await browserDialog.accept();
        });
    }

    clear(): void {
        this.lastMessage = null;
    }

    async runActionAndGetMessage(
        action: () => Promise<void>,
        settleMs = 1500
    ): Promise<string | null> {
        this.clear();
        await action();
        await this.page.waitForTimeout(settleMs);
        const message = this.lastMessage;
        this.clear();
        return message;
    }
}
