import { defineWalletSetup } from '@synthetixio/synpress';
import { MetaMask } from '@synthetixio/synpress/playwright';

const SEED_PHRASE = process.env.SEED_PHRASE;
const PASSWORD = process.env.METAMASK_PASSWORD;
const BASE_URL = process.env.BASE_URL;

if (!SEED_PHRASE || !PASSWORD || !BASE_URL) {
  throw new Error("Environment variables not defined properly");
}

export default defineWalletSetup(PASSWORD, async (context, walletPage) => {
  const metamask = new MetaMask(context, walletPage, PASSWORD);
  await metamask.importWallet(SEED_PHRASE);
});