const { test, expect } = require('@playwright/test');
const LoginPage = require('../../pages/LoginPage');
const DriverRatingPage = require('../../pages/DriverRatingPage');

// Settings -> Driver -> Driver Performance Rating screen.
// Read only: the switch saves at once and changes a setting of the whole station, so it is not clicked.

test(
  'TC-01: Verify that Driver Performance Rating shows its switch without a Save button',
  { tag: ['@smoke', '@regression', '@pr'] },
  async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(process.env.LOGIN_EMAIL, process.env.LOGIN_PASSWORD);
    await expect(page).toHaveURL(/lmdmax\.com\/schedule/, { timeout: 30000 });

    const ratingPage = new DriverRatingPage(page);
    await ratingPage.open();

    await expect(ratingPage.title).toBeVisible();
    await expect(ratingPage.question).toBeVisible();
    await expect(ratingPage.optionText).toBeVisible();
    await expect(ratingPage.switch).toHaveCount(1);
    // The switch saves at once
    await expect(ratingPage.saveButton).toHaveCount(0);
  },
);
