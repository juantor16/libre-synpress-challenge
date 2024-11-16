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
  await metamask.switchNetwork('sepolia', true);
});

test('The user try to deposit a ERC20 token with an empty balance', async () => {
  await homePage.visitAndConnectTodApp();
  await homePage.searchForToken('0xCD85B9a767eF2277E264A4B9A14a2deACAB82FfB');
  await homePage.checkBalanceAndDepositHistory();
  await homePage.checkCurrentBalance('0')
})

test('The user mint example token using the web application', {
  tag: '@regression',
}, async () => {
  await homePage.visitAndConnectTodApp();
  await homePage.successfullyMintTokens()
  await expect(homePage.depositButton).toBeVisible();
})


test('The user deposit example token', {
  tag: '@regression',
}, async () => {
  await homePage.visitAndConnectTodApp();
  await homePage.mintIfBalanceIsZero();
  await homePage.visit();
  await homePage.successfullyDepositAllTokens()
  await homePage.visit()
  await homePage.exampleTokenLink.click();
  await homePage.checkCurrentBalance('0')
})

test('The user tries to mint tokens without having SepoliaETH', async ({ page }) => {
  await metamask.addNewAccount('Account 2');
  await metamask.switchAccount('Account 2');
  await homePage.visitAndConnectTodApp();

  let dialogMessage = '';
  const dialogPromise = page.waitForEvent('dialog').then(async (dialog) => {
    dialogMessage = dialog.message();
    await dialog.dismiss();
  });

  await homePage.exampleTokenLink.click();
  await homePage.mintMoreTokensLink.click();
  await metamask.rejectTransaction();
  await dialogPromise;
  expect(dialogMessage).toContain('User denied transaction signature');
});

test.fail('The user deposit ERC20 USDT token on sepolia network', {
  tag: '@regression',
}, async () => {
  await homePage.visitAndConnectTodApp();
  await homePage.searchForToken('0x0535208A1Db725f7a2f1ad2452fac4c177617f7e');
  const getCurrentBalance = parseInt(await homePage.getCurrentBalance());
  expect(getCurrentBalance).toBeGreaterThan(0);
  await homePage.successfullyDepositTokens(false, 1)
}
)

// user should not be asked to allow spending cap if already approved before
test.fail('The user deposit ERC20 USDT token on sepolia network without approving spending cap', async () => {
  test.setTimeout(120000)
  await homePage.visitAndConnectTodApp();
  await homePage.successfullyMintTokens()
  await expect(homePage.depositButton).toBeVisible();
  const getCurrentBalance = parseInt(await homePage.getCurrentBalance());
  expect(getCurrentBalance).toBeGreaterThan(0);
  await homePage.depositInputField.fill((getCurrentBalance / 2).toString());
  await homePage.depositButton.click();
  await homePage.page.waitForTimeout(5000);
  await homePage.metamask.approveTokenPermission({ spendLimit: 'max' });
  await homePage.page.waitForTimeout(4000);
  await homePage.metamask.confirmTransaction();
  await homePage.page.waitForTimeout(10000);
  await homePage.page.reload();
  await homePage.exampleTokenLink.click();
  await homePage.page.waitForTimeout(2000);
  await homePage.checkCurrentBalance((getCurrentBalance / 2).toString())
  await homePage.page.waitForTimeout(2000);
  const getBalanceLeft = await homePage.getCurrentBalance();
  await homePage.depositInputField.fill(getBalanceLeft);
  await homePage.depositButton.click();
  await homePage.page.waitForTimeout(5000);
  await homePage.metamask.confirmTransaction();
  await homePage.page.waitForTimeout(10000);
  await homePage.page.reload();
  await homePage.exampleTokenLink.click();
  await homePage.page.waitForTimeout(5000);
  await homePage.checkCurrentBalance('0')
})

test('The user can see max and minmum allowed amounts', async (page) => {
  await homePage.visitAndConnectTodApp();
  await homePage.exampleTokenLink.click();
  await expect(homePage.mintMoreTokensLink).toBeVisible();
  await homePage.page.waitForTimeout(2000);
  let getCurrentBalance = parseInt(await homePage.getCurrentBalance());
  if (getCurrentBalance === 0) {
    await homePage.page.reload()
    await homePage.successfullyMintTokens()
    getCurrentBalance = parseInt(await homePage.getCurrentBalance());
  }
  expect(getCurrentBalance).toBeGreaterThan(0);
  await utils.checkTextIsDisplayed('The amount value must be between 1 and ' + getCurrentBalance);
})

test('The user tries to deposit more tokens than he has', async () => {
  await homePage.visitAndConnectTodApp();
  await homePage.exampleTokenLink.click();
  await expect(homePage.depositButton).toBeVisible();
  await homePage.page.waitForTimeout(2000);
  let getCurrentBalance = parseInt(await homePage.getCurrentBalance());
  if (getCurrentBalance === 0) {
    await homePage.successfullyMintTokens()
    await homePage.page.waitForTimeout(3000);
    getCurrentBalance = parseInt(await homePage.getCurrentBalance());
  }
  expect(getCurrentBalance).toBeGreaterThan(0);
  await homePage.depositInputField.fill((getCurrentBalance + 1).toString());
  await expect(homePage.depositButton).toBeDisabled();
  await utils.checkTextIsDisplayed('The amount value must be between 1 and ' + getCurrentBalance);
})

test('The user tries to deposit less than 1 token', async () => {
  await homePage.visitAndConnectTodApp();
  await homePage.mintIfBalanceIsZero();
  await homePage.depositInputField.fill('0');
  const getCurrentBalance = await homePage.getCurrentBalance();
  await utils.checkTextIsDisplayed('The amount value must be between 1 and ' + getCurrentBalance);
})

test('The user tries to deposit a negative amount', async () => {
  await homePage.visitAndConnectTodApp();
  await homePage.mintIfBalanceIsZero();
  await homePage.depositInputField.fill('-1');
  const getCurrentBalance = await homePage.getCurrentBalance();
  await utils.checkTextIsDisplayed('The amount value must be between 1 and ' + getCurrentBalance);
})

//check Transaction history shows latest transaction
test('The user checks the transaction history', async () => {

  test.setTimeout(120000)
  await homePage.visitAndConnectTodApp();
  await homePage.successfullyMintTokens()
  await expect(homePage.depositButton).toBeVisible();
  const getCurrentBalance = parseInt(await homePage.getCurrentBalance());
  expect(getCurrentBalance).toBeGreaterThan(0);
  const currentTotalBalanceAmount = parseInt(await homePage.getTotalDepositAmount());
  await homePage.depositInputField.fill((getCurrentBalance / 2).toString());
  await homePage.depositButton.click();
  await homePage.page.waitForTimeout(5000);
  await homePage.metamask.approveTokenPermission({ spendLimit: 'max' });
  await homePage.page.waitForTimeout(4000);
  await homePage.metamask.confirmTransaction();
  await homePage.page.waitForTimeout(10000);
  await homePage.page.reload();
  await homePage.page.waitForTimeout(10000);
  await homePage.exampleTokenLink.click();
  const latestDepositAmount = await homePage.getLatestDepositAmount();
  expect(latestDepositAmount).toBe((getCurrentBalance / 2).toString());
  const newTotalBalanceAmount = parseInt(await homePage.getTotalDepositAmount());
  expect(newTotalBalanceAmount).toBeCloseTo(currentTotalBalanceAmount + (getCurrentBalance / 2), 1);
})