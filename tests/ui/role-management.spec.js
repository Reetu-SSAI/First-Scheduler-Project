const { test, expect } = require('@playwright/test');
const LoginPage = require('../../pages/LoginPage');
const RoleManagementPage = require('../../pages/RoleManagementPage');

// Settings -> Preferences -> Role Creation & Assignment screen.
// Read only: the "Create Role" window is closed with Cancel, Edit and Delete are not clicked (see docs/notes.md).

test(
  'TC-01: Verify that Role Creation & Assignment shows Create Role and the existing roles with their drivers',
  { tag: ['@smoke', '@regression', '@pr'] },
  async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(process.env.LOGIN_EMAIL, process.env.LOGIN_PASSWORD);
    await expect(page).toHaveURL(/lmdmax\.com\/schedule/, { timeout: 30000 });

    const rolePage = new RoleManagementPage(page);
    await rolePage.open();

    await expect(rolePage.title).toBeVisible();
    await expect(rolePage.description).toBeVisible();
    await expect(rolePage.createRoleButton).toBeEnabled();
    await expect(rolePage.existingRolesTitle).toBeVisible();
    await expect(rolePage.driverCounts.first()).toBeVisible();
  },
);

test(
  'TC-02: Verify that the "Create Role" window opens with an empty role name and Cancel closes it',
  { tag: ['@regression', '@pr'] },
  async ({ page }) => {
    // Log in and open Settings -> Preferences -> Role Creation & Assignment (every UI test starts logged out)
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(process.env.LOGIN_EMAIL, process.env.LOGIN_PASSWORD);
    await expect(page).toHaveURL(/lmdmax\.com\/schedule/, { timeout: 30000 });

    const rolePage = new RoleManagementPage(page);
    await rolePage.open();
    await expect(rolePage.createRoleButton).toBeEnabled();

    await rolePage.createRoleButton.click();

    await expect(rolePage.createWindow).toContainText('Create Role');
    await expect(rolePage.roleNameInput).toBeEmpty();
    await expect(rolePage.addMoreButton).toBeVisible();
    await expect(rolePage.saveButton).toBeVisible();

    // Nothing typed, nothing saved
    await rolePage.cancelButton.click();
    await expect(rolePage.createWindow).toBeHidden();
  },
);
