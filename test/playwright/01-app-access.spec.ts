import { testWithSynpress } from '@synthetixio/synpress'
import { MetaMask, metaMaskFixtures } from '@synthetixio/synpress/playwright'
import basicSetup from '../wallet-setup/basic.setup'
import { HomePage } from '../pages/homePage'
import * as dotenv from 'dotenv';

dotenv.config(); // Cargar variables de entorno

const test = testWithSynpress(metaMaskFixtures(basicSetup))
let homePage: HomePage
let metamask: MetaMask
const { expect } = test

test.beforeEach(async ({ context, metamaskPage, page, extensionId }) => {
  test.setTimeout(60000)
  metamask = new MetaMask(context, metamaskPage, basicSetup.walletPassword, extensionId)
  homePage = new HomePage(page, metamask);
});

test('The user accesses the page with Metamask connected to Sepolia network', {
  tag: '@regression',
}, async () => {
  await metamask.switchNetwork('sepolia', true)
  await homePage.visitAndConnectTodApp();
})

test('The user accesses the page with Metamask connected to Mainnet network', async () => {
  await homePage.visit();
  await metamask.switchNetwork('Ethereum Mainnet')
  await expect(homePage.networkErrorDiv).toBeVisible();
  await expect(homePage.connectButton).toBeVisible();
  await expect(homePage.connectedAddressDiv).not.toBeVisible();
  await expect(homePage.addressInputField).not.toBeVisible();
})

test('The user accesses the page with Metamask connected to Mainnet network and uses the switch network button', async ({ page }) => {
  await homePage.visit();
  await metamask.connectToDapp();
  await metamask.switchNetwork('Ethereum Mainnet')
  await homePage.connectButton.click();
  await metamask.approveSwitchNetwork();
  await page.reload();
  await expect(homePage.connectedAddressDiv).toBeVisible();
  await expect(homePage.addressInputField).toBeVisible();
})