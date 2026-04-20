const path = require('path');
const { expect, test } = require('@playwright/test');

const pageUrl = (fileName) =>
  `file:///${path.resolve(__dirname, '..', fileName).replace(/\\/g, '/')}`;

test.describe('portfolio browser smoke checks', () => {
  test('homepage loads with navigation and primary case-study CTA', async ({ page }) => {
    await page.goto(pageUrl('index.html'));

    await expect(page.getByRole('navigation')).toBeVisible();
    await expect(page.getByRole('heading', { name: /john adrian/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /view case studies/i }).first()).toBeVisible();
  });

  test('contact form loads with the submit CTA', async ({ page }) => {
    await page.goto(pageUrl('contact.html'));

    await expect(page.getByLabel(/your name/i)).toBeVisible();
    await expect(page.getByLabel(/email address/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /send (message|project brief)/i })).toBeVisible();
  });
});
