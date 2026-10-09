const { test, expect } = require('@playwright/test');
const LoginPage = require('../../pages/LoginPage');
const TimeFormatPage = require('../../pages/TimeFormatPage');

// Settings -> Dashboard -> Time Format screen.
// Read only: the format is a setting of the whole station, so no option is clicked (see docs/notes.md).

test(
  'TC-01: Verify that Time Format shows 12 and 24 hour formats with one selected and Save disabled',
  { tag: ['@smoke', '@regression', '@pr'] },
  async ({ page }) => {
    // Log in and open Settings -> Dashboard -> Time Format (every UI test starts logged out)
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(process.env.LOGIN_EMAIL, process.env.LOGIN_PASSWORD);
    await expect(page).toHaveURL(/lmdmax\.com\/schedule/, { timeout: 30000 });

    const timeFormatPage = new TimeFormatPage(page);
    await timeFormatPage.open();
    await expect(timeFormatPage.title).toBeVisible();

    await expect(timeFormatPage.description).toBeVisible();
    await expect(timeFormatPage.formats).toHaveCount(2);
    await expect(timeFormatPage.format12).toBeVisible();
    await expect(timeFormatPage.format24).toBeVisible();
    await expect(page.getByRole('radio', { checked: true })).toHaveCount(1);
    await expect(timeFormatPage.saveButton).toBeDisabled();
  },
);

test(
  'TC-02: Verify that the Dashboard menu opens each of its 3 screens',
  { tag: ['@regression'] },
  async ({ page }) => {
    // Log in and open Settings -> Dashboard -> Time Format (every UI test starts logged out)
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(process.env.LOGIN_EMAIL, process.env.LOGIN_PASSWORD);
    await expect(page).toHaveURL(/lmdmax\.com\/schedule/, { timeout: 30000 });

    const timeFormatPage = new TimeFormatPage(page);
    await timeFormatPage.open();
    await expect(timeFormatPage.title).toBeVisible();

    await page.getByRole('link', { name: 'Week Start Day' }).click();
    await expect(page).toHaveURL(/settings\/week-start-day/);
    await page.getByRole('link', { name: 'Default Landing Page' }).click();
    await expect(page).toHaveURL(/settings\/view-preferences/);
    await page.getByRole('link', { name: 'Time Format' }).click();
    await expect(page).toHaveURL(/settings\/time-format/);
  },
);
