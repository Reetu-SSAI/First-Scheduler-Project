const { test, expect } = require('@playwright/test');
const LoginPage = require('../../pages/LoginPage');
const MessageChannelPage = require('../../pages/MessageChannelPage');

// Settings -> Message Channel Configuration screen. Read only: the switches save at once, so they are not clicked.

test(
  'TC-01: Verify that Message Channel Configuration shows SMS Chat and In-App Chat',
  { tag: ['@smoke', '@regression', '@pr'] },
  async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(process.env.LOGIN_EMAIL, process.env.LOGIN_PASSWORD);
    await expect(page).toHaveURL(/lmdmax\.com\/schedule/, { timeout: 30000 });

    const messageChannelPage = new MessageChannelPage(page);
    await messageChannelPage.open();

    await expect(messageChannelPage.title).toBeVisible();
    await expect(messageChannelPage.description).toBeVisible();
    await expect(messageChannelPage.smsChat).toBeVisible();
    await expect(messageChannelPage.inAppChat).toBeVisible();
    await expect(messageChannelPage.switches).toHaveCount(2);
  },
);
