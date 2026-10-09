const { test, expect } = require('@playwright/test');
const LoginPage = require('../../pages/LoginPage');
const ExportSettingsPage = require('../../pages/ExportSettingsPage');

// Settings -> Preferences -> Export Settings screen.
// Read only: the fields are a setting of the whole station, so no checkbox is clicked (see docs/notes.md).

test(
  'TC-01: Verify that Export Settings shows the CSV and Excel fields and Save is disabled without a change',
  { tag: ['@smoke', '@regression', '@pr'] },
  async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(process.env.LOGIN_EMAIL, process.env.LOGIN_PASSWORD);
    await expect(page).toHaveURL(/lmdmax\.com\/schedule/, { timeout: 30000 });

    const exportPage = new ExportSettingsPage(page);
    await exportPage.open();

    await expect(exportPage.title).toBeVisible();
    await expect(exportPage.description).toBeVisible();
    await expect(exportPage.csvTitle).toBeVisible();
    await expect(exportPage.excelTitle).toBeVisible();
    await expect(exportPage.selectAllText).toBeVisible();
    // CSV: Select All + 8 fields, Excel: 2 fields
    await expect(exportPage.checkboxes).toHaveCount(11);
    await expect(exportPage.saveButton).toBeDisabled();
  },
);
