const { test, expect } = require('@playwright/test');
const LoginPage = require('../../pages/LoginPage');
const TimeOffThresholdPage = require('../../pages/TimeOffThresholdPage');

// Settings -> Driver -> Set Time Off Threshold screen.
// Read only: the switch changes a setting of the whole station, so it is not clicked (see docs/notes.md).

test(
  'TC-01: Verify that Set Time Off Threshold shows the 1-366 days rule, its switch and Save',
  { tag: ['@smoke', '@regression', '@pr'] },
  async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(process.env.LOGIN_EMAIL, process.env.LOGIN_PASSWORD);
    await expect(page).toHaveURL(/lmdmax\.com\/schedule/, { timeout: 30000 });

    const thresholdPage = new TimeOffThresholdPage(page);
    await thresholdPage.open();

    await expect(thresholdPage.title).toBeVisible();
    await expect(thresholdPage.description).toBeVisible();
    await expect(thresholdPage.optionText).toBeVisible();
    await expect(thresholdPage.switch).toHaveCount(1);
    await expect(thresholdPage.saveButton).toBeVisible();
  },
);
