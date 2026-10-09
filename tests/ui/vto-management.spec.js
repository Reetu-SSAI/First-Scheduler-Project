const { test, expect } = require('@playwright/test');
const LoginPage = require('../../pages/LoginPage');
const VtoManagementPage = require('../../pages/VtoManagementPage');

// Time Off Request -> VTO Management screen. Read only: + Add New VTO is not clicked (VTO is offered to real
// drivers, see docs/notes.md).

test(
  'TC-01: Verify that VTO Management shows search, This Week, Add New VTO and "Add VTO to proceed!"',
  { tag: ['@smoke', '@regression', '@pr'] },
  async ({ page }) => {
    // Log in and open Time Off Request -> VTO Management (every UI test starts logged out)
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(process.env.LOGIN_EMAIL, process.env.LOGIN_PASSWORD);
    await expect(page).toHaveURL(/lmdmax\.com\/schedule/, { timeout: 30000 });

    const vtoPage = new VtoManagementPage(page);
    await vtoPage.open();

    await expect(vtoPage.searchInput).toBeVisible();
    await expect(vtoPage.weekButton).toBeVisible();
    await expect(vtoPage.addVtoButton).toBeEnabled();
    // Station PSD has no VTO this week
    await expect(vtoPage.noVtoTitle).toBeVisible();
  },
);

test(
  'TC-02: Verify that the "Add VTO" window shows its fields with Next disabled and Cancel closes it',
  { tag: ['@regression', '@pr'] },
  async ({ page }) => {
    // Log in and open Time Off Request -> VTO Management (every UI test starts logged out)
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(process.env.LOGIN_EMAIL, process.env.LOGIN_PASSWORD);
    await expect(page).toHaveURL(/lmdmax\.com\/schedule/, { timeout: 30000 });

    const vtoPage = new VtoManagementPage(page);
    await vtoPage.open();
    await expect(vtoPage.addVtoButton).toBeEnabled();

    await vtoPage.addVtoButton.click();

    await expect(vtoPage.addWindow).toContainText('Add VTO');
    for (const label of [
      'Select Date',
      'Select Schedule',
      "Enter No. of VTO's",
      'Select Drivers',
    ]) {
      await expect(vtoPage.addWindow).toContainText(label);
    }
    await expect(vtoPage.nextButton).toBeDisabled();

    // Nothing chosen, nothing saved
    await vtoPage.cancelButton.click();
    await expect(vtoPage.addWindow).toBeHidden();
  },
);
