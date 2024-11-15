import { test } from '@playwright/test'
const { expect } = test

test('The user is shown an error when metamask is not installed.', {
  tag: '@regression',
}, async ({page}) => {
  await page.goto('/');
  await expect(page.getByText('Metamask not found!')).toBeVisible();
})
