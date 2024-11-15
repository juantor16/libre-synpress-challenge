import { defineWalletSetup } from '@synthetixio/synpress';
import { MetaMask } from '@synthetixio/synpress/playwright';

// Leer las variables desde el entorno
const SEED_PHRASE = process.env.SEED_PHRASE;
const PASSWORD = process.env.METAMASK_PASSWORD;

if (!SEED_PHRASE || !PASSWORD) {
  throw new Error("Seed phrase or password not defined in environment variables");
}

export default defineWalletSetup(PASSWORD, async (context, walletPage) => {
  const metamask = new MetaMask(context, walletPage, PASSWORD);

  await metamask.importWallet(SEED_PHRASE);
});