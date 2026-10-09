const { test, expect } = require('@playwright/test');
const LoginPage = require('../../pages/LoginPage');

// Login screen

test(
  'TC-01: Verify that login with valid credentials opens the schedule',
  { tag: ['@smoke', '@regression', '@pr'] },
  async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(process.env.LOGIN_EMAIL, process.env.LOGIN_PASSWORD);

    // Logging in can be slow, so wait up to 30 seconds (30000 ms)
    await expect(page).toHaveURL(/lmdmax\.com\/schedule/, { timeout: 30000 });
  },
);

test(
  'TC-02: Verify that wrong password keeps the user on the login page',
  { tag: ['@regression', '@pr'] },
  async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(process.env.LOGIN_EMAIL, 'WrongPassword@123');

    await expect(loginPage.errorMessage).toContainText('Invalid Credentials');
    await expect(loginPage.signInButton).toBeVisible();
    await expect(page).not.toHaveURL(/lmdmax\.com\/schedule/);
  },
);
