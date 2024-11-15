import { Page, expect } from "@playwright/test";

export class Utils {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async checkTextIsDisplayed(textToCheck: string) {
        await expect(this.page.getByText(textToCheck)).toBeAttached();
    }


}