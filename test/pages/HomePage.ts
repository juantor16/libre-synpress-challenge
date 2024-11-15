import { Page, Locator, expect } from "@playwright/test";
import { MetaMask } from '@synthetixio/synpress/playwright'
import { Utils } from '../utils/Utils'

let utils: Utils

export class HomePage {
    
    readonly metamask: MetaMask
    readonly page: Page;
    readonly connectButton: Locator;
    readonly connectedAddressDiv: Locator;
    readonly networkErrorDiv: Locator;
    readonly addressInputField: Locator;
    readonly submitButton: Locator;
    readonly balanceDiv: Locator;
    readonly depositHistoryTable: Locator;
    readonly exampleTokenLink: Locator;
    readonly totalAmount: Locator;
    readonly inputErrorMessage: Locator;
    readonly depositButton: Locator;
    readonly mintMoreTokensLink: Locator;
    readonly depositInputField: Locator;

    readonly noTokensLeftMessage = "The deposit is disabled because you don't have any token left in your account.";

    constructor(page: Page, metamask: MetaMask) {
        this.metamask = metamask;
        this.page = page;
        utils = new Utils(this.page);
        this.connectButton = page.locator('[data-test="MetaMaskConnector__Button__connect"]');
        this.connectedAddressDiv = page.locator('[data-test="MetaMaskConnector__Div__connect"]');
        this.networkErrorDiv = page.locator('[data-test="MetaMaskConnector__Div__error"]');
        this.addressInputField = page.locator('[data-test="InputAddress__Input__addressValue"]');
        this.submitButton = page.getByRole('button', { name: 'Submit' });
        this.balanceDiv = page.locator('[data-test="TokenBalance__Div__balanceAmount"]');
        this.depositHistoryTable = page.locator('table[data-test="DepositHistory__Table__history"]');
        this.exampleTokenLink = page.locator('[data-test="InputAddress__Span__exampleTokenLink"]');
        this.totalAmount = page.locator('td[class="text-right"]');
        this.inputErrorMessage = page.locator('[data-test="DepositToken__Div__error"]');
        this.depositButton = page.locator('button[data-test="DepositToken__Button__deposit"]');
        this.mintMoreTokensLink = page.locator('[data-test="TokenBalance__Div__getMoreExampleTokensAction"]');
        this.depositInputField = page.locator('[data-test="DepositToken__Input__depositAmount"]');
    }

    async visit() {
        await this.page.goto('/');
    }

    async visitAndConnectTodApp() {
        await this.visit();
        await this.metamask.connectToDapp();
        const walletAddress = await this.metamask.getAccountAddress();
        await expect(this.connectedAddressDiv).toContainText(walletAddress.toLowerCase());
        await expect(this.addressInputField).toBeVisible();
        await expect(this.networkErrorDiv).not.toBeVisible();
    }

    async checkDepositHistoryAmount(expectedText: string) {
        await expect(this.depositHistoryTable.locator(this.totalAmount).first()).toContainText(expectedText);
    }

    async checkCurrentBalance(expectedBalance: string) {
        await expect(this.balanceDiv).toContainText(expectedBalance);
    }

    async getCurrentBalance() {
        return await this.balanceDiv.innerText();
    }

    async searchForToken(tokenAddress: string, isForced: boolean = false) {
        await this.addressInputField.fill(tokenAddress);
        await this.submitButton.click({ force: isForced });
    }

    async checkBalanceAndDepositHistory() {
        await expect(this.balanceDiv).toBeVisible();
        await expect(this.depositHistoryTable).toBeVisible();
    }

    async successfullyMintTokens() {
        await this.exampleTokenLink.click();
        await this.page.waitForTimeout(5000);
        await this.mintMoreTokensLink.click();
        const currentBalance = await this.getCurrentBalance();
        await this.metamask.confirmTransactionAndWaitForMining();
        await this.page.waitForTimeout(5000);
        console.log('currentBalance', currentBalance);
        console.log('getCurrentBalance', await this.getCurrentBalance());
        expect(parseInt(currentBalance)).toBeLessThan(parseInt(await this.getCurrentBalance()));
    }

    async successfullyDepositAllTokens(isExampleToken: boolean = true) {
        if (isExampleToken) {
            await this.exampleTokenLink.click();
        }
        await this.page.waitForTimeout(5000);
        const getCurrentBalance = await this.getCurrentBalance();
        await this.depositInputField.fill(getCurrentBalance);
        await this.depositButton.click();
        await this.metamask.approveTokenPermission({ spendLimit: parseInt(getCurrentBalance) });
        await this.page.waitForTimeout(5000);
        await this.metamask.confirmTransaction();
        await this.page.waitForTimeout(10000);
        await this.page.reload();
        await this.exampleTokenLink.click();
        await this.page.waitForTimeout(5000);
        await this.checkCurrentBalance('0')
    }
    
    async checkNoTokensLeftMessage() {
        expect(utils.checkTextIsDisplayed(this.noTokensLeftMessage));
    }
}