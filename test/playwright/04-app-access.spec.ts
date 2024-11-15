import { test } from '@playwright/test'
const { expect } = test

test('The user is shown an error when metamask is not installed.', async ({page}) => {
  await page.goto('/');
  await expect(page.getByText('Metamask not found!')).toBeVisible();
})
