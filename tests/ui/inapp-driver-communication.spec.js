const { test, expect } = require('@playwright/test');
const LoginPage = require('../../pages/LoginPage');
const InAppDriverCommunicationPage = require('../../pages/InAppDriverCommunicationPage');

// Settings -> In-app Driver Communication screen. Read only: the switches save at once, so they are not clicked.

test(
  'TC-01: Verify that In-app Driver Communication shows the chat options and the 3 calling apps',
  { tag: ['@smoke', '@regression', '@pr'] },
  async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(process.env.LOGIN_EMAIL, process.env.LOGIN_PASSWORD);
    await expect(page).toHaveURL(/lmdmax\.com\/schedule/, { timeout: 30000 });

    const communicationPage = new InAppDriverCommunicationPage(page);
    await communicationPage.open();

    await expect(communicationPage.title).toBeVisible();
    for (const option of communicationPage.options) {
      await expect(page.getByText(option, { exact: true })).toBeVisible();
    }
    for (const app of communicationPage.apps) {
      await expect(page.getByRole('img', { name: app })).toBeVisible();
    }
    // Exactly one app is chosen to receive calls
    await expect(communicationPage.appChoices).toHaveCount(3);
    await expect(page.getByRole('radio', { checked: true })).toHaveCount(1);
  },
);
