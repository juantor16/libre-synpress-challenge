import { testWithSynpress } from '@synthetixio/synpress'
import { MetaMask, metaMaskFixtures } from '@synthetixio/synpress/playwright'
import basicSetup from '../wallet-setup/basic.setup'
import { HomePage } from '../pages/HomePage'
import { Utils } from '../utils/Utils'

const test = testWithSynpress(metaMaskFixtures(basicSetup))
let homePage: HomePage
let metamask: MetaMask
let utils: Utils
const { expect } = test

test.beforeEach(async ({ context, metamaskPage, page, extensionId }) => {
  test.setTimeout(60000)
  metamask = new MetaMask(context, metamaskPage, basicSetup.walletPassword, extensionId)
  homePage = new HomePage(page, metamask);
  utils = new Utils(page);
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

test('The user should not be able to search for an existing ERC721 token',  async () => {
  await metamask.switchNetwork('sepolia', true);
  await homePage.visitAndConnectTodApp();
  await homePage.searchForToken('0x61AAEcdbe9C2502a72fec63F2Ff510bE1b95DD97');
  await utils.checkTextIsDisplayed('The token you are trying to search is not an ERC20 token.');
})

test('The user should not be able to search for an existing ERC1155 token',  async () => {
  await metamask.switchNetwork('sepolia', true);
  await homePage.visitAndConnectTodApp();
  await homePage.searchForToken('0xE29BcBb8145B8A281BaBDd956e1595b1b76ddAfb');
  await utils.checkTextIsDisplayed('The token you are trying to search is not an ERC20 token.');
})