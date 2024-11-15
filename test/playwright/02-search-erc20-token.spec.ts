import { testWithSynpress } from '@synthetixio/synpress'
import { MetaMask, metaMaskFixtures } from '@synthetixio/synpress/playwright'
import basicSetup from '../wallet-setup/basic.setup'
import { HomePage } from '../pages/HomePage'

const test = testWithSynpress(metaMaskFixtures(basicSetup))
let homePage: HomePage
let metamask: MetaMask
const { expect } = test

test.beforeEach(async ({ context, metamaskPage, page, extensionId }) => {
  test.setTimeout(60000)
  metamask = new MetaMask(context, metamaskPage, basicSetup.walletPassword, extensionId)
  homePage = new HomePage(page, metamask);
});


test('The user can search for an existing ERC20 token and see his balance and deposit history for the selected token', {
  tag: '@regression',
}, async () => {
  await metamask.switchNetwork('sepolia', true);
  await homePage.visitAndConnectTodApp();
  await homePage.searchForToken('0x9982f9A3bA28c34aD03737745d956EC0668ea440');
  await homePage.checkBalanceAndDepositHistory();
})

test('The user enter an invalid ERC20 token address', async () => {
  await metamask.switchNetwork('sepolia', true);
  await homePage.visitAndConnectTodApp();
  await homePage.searchForToken('0x9982f9A3bA28c', true);
  await expect(homePage.submitButton).toBeDisabled();
})

test('The user clicks the example token link and he will be able to see his balance and deposit history.', {
  tag: '@regression',
}, async () => {
  await metamask.switchNetwork('sepolia', true);
  await homePage.visitAndConnectTodApp();
  await homePage.exampleTokenLink.click();
  await homePage.checkBalanceAndDepositHistory();
})