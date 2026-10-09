const { test, expect } = require('@playwright/test');
const LoginPage = require('../../pages/LoginPage');
const ManageScorecardPage = require('../../pages/ManageScorecardPage');

// Settings -> Preferences -> Manage Driver Performance Metrics screen.
// Read only: the metrics are a setting of the whole station, so no checkbox is clicked (see docs/notes.md).

test(
  'TC-01: Verify that Manage Driver Performance Metrics lists the 28 metrics and Save is disabled without a change',
  { tag: ['@smoke', '@regression', '@pr'] },
  async ({ page }) => {
    // Log in and open Settings -> Preferences -> Manage Driver Performance Metrics (every UI test starts logged out)
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(process.env.LOGIN_EMAIL, process.env.LOGIN_PASSWORD);
    await expect(page).toHaveURL(/lmdmax\.com\/schedule/, { timeout: 30000 });

    const scorecardPage = new ManageScorecardPage(page);
    await scorecardPage.open();
    await expect(scorecardPage.title).toBeVisible();

    await expect(scorecardPage.description).toBeVisible();
    await expect(scorecardPage.metrics).toHaveCount(28);
    await expect(scorecardPage.metricName('Overall Tier')).toBeVisible();
    await expect(scorecardPage.metricName('Rescue Refused')).toBeVisible();
    await expect(scorecardPage.saveButton).toBeDisabled();
  },
);

test(
  'TC-02: Verify that the Preferences menu opens each of its 3 screens',
  { tag: ['@regression'] },
  async ({ page }) => {
    // Log in and open Settings -> Preferences -> Manage Driver Performance Metrics (every UI test starts logged out)
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(process.env.LOGIN_EMAIL, process.env.LOGIN_PASSWORD);
    await expect(page).toHaveURL(/lmdmax\.com\/schedule/, { timeout: 30000 });

    const scorecardPage = new ManageScorecardPage(page);
    await scorecardPage.open();
    await expect(scorecardPage.title).toBeVisible();

    await page
      .getByRole('link', { name: 'Role Creation & Assignment' })
      .click();
    await expect(page).toHaveURL(/settings\/role-management/);
    await page.getByRole('link', { name: 'Export Settings' }).click();
    await expect(page).toHaveURL(/settings\/export-settings/);
    await page
      .getByRole('link', { name: 'Manage Driver Performance Metrics' })
      .click();
    await expect(page).toHaveURL(/settings\/manage-scorecard/);
  },
);
