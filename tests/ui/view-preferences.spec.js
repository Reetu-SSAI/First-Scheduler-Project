const { test, expect } = require('@playwright/test');
const LoginPage = require('../../pages/LoginPage');
const ViewPreferencesPage = require('../../pages/ViewPreferencesPage');

// Settings -> Dashboard -> Default Landing Page screen.
// Read only: the landing page is a setting of the whole station, so no option is clicked (see docs/notes.md).

test(
  'TC-01: Verify that Default Landing Page shows the 2 views with one selected and Save disabled',
  { tag: ['@smoke', '@regression', '@pr'] },
  async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(process.env.LOGIN_EMAIL, process.env.LOGIN_PASSWORD);
    await expect(page).toHaveURL(/lmdmax\.com\/schedule/, { timeout: 30000 });

    const viewPage = new ViewPreferencesPage(page);
    await viewPage.open();

    await expect(viewPage.title).toBeVisible();
    await expect(viewPage.description).toBeVisible();
    await expect(viewPage.views).toHaveCount(2);
    await expect(viewPage.allScheduleView).toBeVisible();
    await expect(viewPage.employeeView).toBeVisible();
    await expect(page.getByRole('radio', { checked: true })).toHaveCount(1);
    await expect(viewPage.saveButton).toBeDisabled();
  },
);
