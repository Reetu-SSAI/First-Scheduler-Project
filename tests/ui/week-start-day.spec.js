const { test, expect } = require('@playwright/test');
const LoginPage = require('../../pages/LoginPage');
const WeekStartDayPage = require('../../pages/WeekStartDayPage');

// Settings -> Dashboard -> Week Start Day screen.
// Read only: the day is a setting of the whole station, so no option is clicked (see docs/notes.md).

test(
  'TC-01: Verify that Week Start Day shows the 7 days with one selected and Save disabled',
  { tag: ['@smoke', '@regression', '@pr'] },
  async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(process.env.LOGIN_EMAIL, process.env.LOGIN_PASSWORD);
    await expect(page).toHaveURL(/lmdmax\.com\/schedule/, { timeout: 30000 });

    const weekStartPage = new WeekStartDayPage(page);
    await weekStartPage.open();

    await expect(weekStartPage.title).toBeVisible();
    await expect(weekStartPage.description).toBeVisible();
    await expect(weekStartPage.days).toHaveCount(7);
    await expect(weekStartPage.day('Sunday')).toBeVisible();
    await expect(weekStartPage.day('Saturday')).toBeVisible();
    await expect(page.getByRole('radio', { checked: true })).toHaveCount(1);
    await expect(weekStartPage.saveButton).toBeDisabled();
  },
);
