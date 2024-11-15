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

test('The user try to deposit a ERC20 token with an empty balance', async () => {
  await metamask.switchNetwork('sepolia', true);
  await homePage.visitAndConnectTodApp();
  await homePage.searchForToken('0xCD85B9a767eF2277E264A4B9A14a2deACAB82FfB');
  await homePage.checkBalanceAndDepositHistory();
  await homePage.checkCurrentBalance('0')
})

test('The user mint example token using the web application', {
  tag: '@regression',
}, async () => {
  await metamask.switchNetwork('sepolia', true);
  await homePage.visitAndConnectTodApp();
  await homePage.successfullyMintTokens()
  await expect(homePage.depositButton).toBeVisible();
})


test('The user deposit example token', {
  tag: '@regression',
}, async () => {
  await metamask.switchNetwork('sepolia', true);
  await homePage.visitAndConnectTodApp();
  await homePage.successfullyDepositAllTokens()
  await homePage.checkCurrentBalance('0')
})