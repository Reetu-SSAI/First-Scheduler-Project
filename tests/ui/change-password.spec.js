const { test, expect } = require('@playwright/test');
const LoginPage = require('../../pages/LoginPage');
const ChangePasswordPage = require('../../pages/ChangePasswordPage');

// Settings -> Change Password screen. "Save" is never clicked: it would change the test user's password.

// The 6 password rules shown under the boxes
const rules = [
  'Minimum 8 Characters',
  'Maximum 16 Characters',
  '1 Upper Case Letter',
  '1 Lower Case Letter',
  'Special Character (!@#$%^&*()+={}[]|;:"<>,./?)',
  'At least one numeric',
];

// ---------- Opening the screen ----------

test(
  'TC-01: Verify that Change Password opens with only the old password box enabled',
  { tag: ['@smoke', '@regression', '@pr'] },
  async ({ page }) => {
    // Log in and open Settings -> Change Password (every UI test starts logged out)
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(process.env.LOGIN_EMAIL, process.env.LOGIN_PASSWORD);
    await expect(page).toHaveURL(/lmdmax\.com\/schedule/, { timeout: 30000 });

    const changePasswordPage = new ChangePasswordPage(page);
    await changePasswordPage.open();
    await expect(changePasswordPage.oldPasswordInput).toBeVisible();

    await expect(changePasswordPage.logoutNotice).toBeVisible();
    await expect(changePasswordPage.oldPasswordInput).toBeEnabled();
    await expect(changePasswordPage.newPasswordInput).toBeDisabled();
    await expect(changePasswordPage.confirmPasswordInput).toBeDisabled();
    await expect(changePasswordPage.saveButton).toBeDisabled();
    for (const rule of rules) {
      await expect(changePasswordPage.rule(rule)).toBeVisible();
    }
  },
);

// ---------- Old password ----------

test(
  'TC-02: Verify that a wrong old password shows "Password is incorrect!" and keeps the new boxes closed',
  { tag: ['@regression', '@pr'] },
  async ({ page }) => {
    // Log in and open Settings -> Change Password (every UI test starts logged out)
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(process.env.LOGIN_EMAIL, process.env.LOGIN_PASSWORD);
    await expect(page).toHaveURL(/lmdmax\.com\/schedule/, { timeout: 30000 });

    const changePasswordPage = new ChangePasswordPage(page);
    await changePasswordPage.open();
    await expect(changePasswordPage.oldPasswordInput).toBeVisible();

    await changePasswordPage.oldPasswordInput.fill('WrongPassword@123');

    await expect(changePasswordPage.wrongOldPasswordMessage).toBeVisible();
    await expect(changePasswordPage.newPasswordInput).toBeDisabled();
    await expect(changePasswordPage.confirmPasswordInput).toBeDisabled();
  },
);

test(
  'TC-03: Verify that the right old password opens the new password boxes',
  { tag: ['@smoke', '@regression', '@pr'] },
  async ({ page }) => {
    // Log in, open Settings -> Change Password and type the right old password (opens the new password boxes)
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(process.env.LOGIN_EMAIL, process.env.LOGIN_PASSWORD);
    await expect(page).toHaveURL(/lmdmax\.com\/schedule/, { timeout: 30000 });

    const changePasswordPage = new ChangePasswordPage(page);
    await changePasswordPage.open();
    await expect(changePasswordPage.oldPasswordInput).toBeVisible();
    await changePasswordPage.oldPasswordInput.fill(process.env.LOGIN_PASSWORD);
    await expect(changePasswordPage.newPasswordInput).toBeEnabled();

    await expect(changePasswordPage.wrongOldPasswordMessage).toBeHidden();
    await expect(changePasswordPage.newPasswordInput).toBeEnabled();
    await expect(changePasswordPage.confirmPasswordInput).toBeEnabled();
    await expect(changePasswordPage.saveButton).toBeDisabled();
  },
);

// ---------- Password rules ----------

test(
  'TC-04: Verify that each password rule is ticked only when the new password follows it',
  { tag: ['@regression', '@pr'] },
  async ({ page }) => {
    // Log in, open Settings -> Change Password and type the right old password (opens the new password boxes)
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(process.env.LOGIN_EMAIL, process.env.LOGIN_PASSWORD);
    await expect(page).toHaveURL(/lmdmax\.com\/schedule/, { timeout: 30000 });

    const changePasswordPage = new ChangePasswordPage(page);
    await changePasswordPage.open();
    await expect(changePasswordPage.oldPasswordInput).toBeVisible();
    await changePasswordPage.oldPasswordInput.fill(process.env.LOGIN_PASSWORD);
    await expect(changePasswordPage.newPasswordInput).toBeEnabled();

    // "abc": short, lower case only
    await changePasswordPage.newPasswordInput.fill('abc');
    await expect(
      changePasswordPage.rule('Minimum 8 Characters'),
    ).not.toBeChecked();
    await expect(
      changePasswordPage.rule('Maximum 16 Characters'),
    ).toBeChecked();
    await expect(
      changePasswordPage.rule('1 Upper Case Letter'),
    ).not.toBeChecked();
    await expect(changePasswordPage.rule('1 Lower Case Letter')).toBeChecked();
    await expect(changePasswordPage.rule(rules[4])).not.toBeChecked();
    await expect(
      changePasswordPage.rule('At least one numeric'),
    ).not.toBeChecked();

    // "Abcdef1!": follows every rule
    await changePasswordPage.newPasswordInput.fill('Abcdef1!');
    for (const rule of rules) {
      await expect(changePasswordPage.rule(rule)).toBeChecked();
    }
  },
);

test(
  'TC-05: Verify that a new password longer than 16 characters breaks the maximum rule',
  { tag: ['@regression'] },
  async ({ page }) => {
    // Log in, open Settings -> Change Password and type the right old password (opens the new password boxes)
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(process.env.LOGIN_EMAIL, process.env.LOGIN_PASSWORD);
    await expect(page).toHaveURL(/lmdmax\.com\/schedule/, { timeout: 30000 });

    const changePasswordPage = new ChangePasswordPage(page);
    await changePasswordPage.open();
    await expect(changePasswordPage.oldPasswordInput).toBeVisible();
    await changePasswordPage.oldPasswordInput.fill(process.env.LOGIN_PASSWORD);
    await expect(changePasswordPage.newPasswordInput).toBeEnabled();

    // 17 characters
    await changePasswordPage.newPasswordInput.fill('Abcdefghijklmn1!X');

    await expect(
      changePasswordPage.rule('Maximum 16 Characters'),
    ).not.toBeChecked();
    await expect(changePasswordPage.rule('Minimum 8 Characters')).toBeChecked();
    await expect(changePasswordPage.saveButton).toBeDisabled();
  },
);

// ---------- Save button ----------

test(
  'TC-06: Verify that Save stays disabled when the confirm password does not match',
  { tag: ['@regression', '@pr'] },
  async ({ page }) => {
    // Log in, open Settings -> Change Password and type the right old password (opens the new password boxes)
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(process.env.LOGIN_EMAIL, process.env.LOGIN_PASSWORD);
    await expect(page).toHaveURL(/lmdmax\.com\/schedule/, { timeout: 30000 });

    const changePasswordPage = new ChangePasswordPage(page);
    await changePasswordPage.open();
    await expect(changePasswordPage.oldPasswordInput).toBeVisible();
    await changePasswordPage.oldPasswordInput.fill(process.env.LOGIN_PASSWORD);
    await expect(changePasswordPage.newPasswordInput).toBeEnabled();

    await changePasswordPage.newPasswordInput.fill('Abcdef1!');
    await changePasswordPage.confirmPasswordInput.fill('Abcdef1?');

    await expect(changePasswordPage.saveButton).toBeDisabled();
  },
);

test(
  'TC-07: Verify that Save is enabled when all rules pass and both new passwords match',
  { tag: ['@regression', '@pr'] },
  async ({ page }) => {
    // Log in, open Settings -> Change Password and type the right old password (opens the new password boxes)
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(process.env.LOGIN_EMAIL, process.env.LOGIN_PASSWORD);
    await expect(page).toHaveURL(/lmdmax\.com\/schedule/, { timeout: 30000 });

    const changePasswordPage = new ChangePasswordPage(page);
    await changePasswordPage.open();
    await expect(changePasswordPage.oldPasswordInput).toBeVisible();
    await changePasswordPage.oldPasswordInput.fill(process.env.LOGIN_PASSWORD);
    await expect(changePasswordPage.newPasswordInput).toBeEnabled();

    await changePasswordPage.newPasswordInput.fill('Abcdef1!');
    await changePasswordPage.confirmPasswordInput.fill('Abcdef1!');

    // Not clicked: it would change the test user's password
    await expect(changePasswordPage.saveButton).toBeEnabled();
  },
);
