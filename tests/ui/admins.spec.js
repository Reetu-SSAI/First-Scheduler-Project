const { test, expect } = require('@playwright/test');
const LoginPage = require('../../pages/LoginPage');
const AdminsPage = require('../../pages/AdminsPage');

// Settings -> Admins screen. Read only: nothing is saved (the "Add Admin" window is closed with Cancel).

// ---------- Opening the screen ----------

test(
  'TC-01: Verify that a logged-out user opening Admins is sent to the login page',
  { tag: ['@smoke', '@regression', '@pr'] },
  async ({ page }) => {
    const adminsPage = new AdminsPage(page);
    await adminsPage.open();

    const loginPage = new LoginPage(page);
    await expect(loginPage.signInButton).toBeVisible();
    await expect(page).not.toHaveURL(/settings\/admins/);
  },
);

test(
  'TC-02: Verify that a logged-in user can open Admins',
  { tag: ['@smoke', '@regression', '@pr'] },
  async ({ page }) => {
    // Log in and open Settings -> Admins (every UI test starts logged out)
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(process.env.LOGIN_EMAIL, process.env.LOGIN_PASSWORD);
    await expect(page).toHaveURL(/lmdmax\.com\/schedule/, { timeout: 30000 });

    const adminsPage = new AdminsPage(page);
    await adminsPage.open();
    await expect(adminsPage.rows.first()).toBeVisible();

    await expect(page).toHaveURL(/settings\/admins/);
    await expect(adminsPage.title).toBeVisible();
    await expect(adminsPage.searchBox).toBeVisible();
    await expect(adminsPage.addAdminButton).toBeVisible();
    for (const column of ['Name', 'Email', 'Phone', 'Station Code', 'Action']) {
      await expect(page.getByText(column, { exact: true })).toBeVisible();
    }
  },
);

test(
  'TC-03: Verify that the number next to the title matches the rows in the list',
  { tag: ['@regression', '@pr'] },
  async ({ page }) => {
    // Log in and open Settings -> Admins (every UI test starts logged out)
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(process.env.LOGIN_EMAIL, process.env.LOGIN_PASSWORD);
    await expect(page).toHaveURL(/lmdmax\.com\/schedule/, { timeout: 30000 });

    const adminsPage = new AdminsPage(page);
    await adminsPage.open();
    await expect(adminsPage.rows.first()).toBeVisible();

    const rowCount = await adminsPage.rows.count();
    await expect(adminsPage.count).toHaveText('(' + rowCount + ')');
  },
);

// ---------- Action buttons ----------

test(
  'TC-04: Verify that the owner cannot be edited, deleted or given permissions',
  { tag: ['@regression', '@pr'] },
  async ({ page }) => {
    // Log in and open Settings -> Admins (every UI test starts logged out)
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(process.env.LOGIN_EMAIL, process.env.LOGIN_PASSWORD);
    await expect(page).toHaveURL(/lmdmax\.com\/schedule/, { timeout: 30000 });

    const adminsPage = new AdminsPage(page);
    await adminsPage.open();
    await expect(adminsPage.rows.first()).toBeVisible();

    const ownerRow = adminsPage.row('(owner)');
    await expect(
      ownerRow.getByRole('button', { name: 'Edit Admin' }),
    ).toBeDisabled();
    await expect(
      ownerRow.getByRole('button', { name: 'Delete Admin' }),
    ).toBeDisabled();
    await expect(
      ownerRow.getByRole('button', { name: 'Set Permission' }),
    ).toBeDisabled();
  },
);

test(
  'TC-05: Verify that a driver promoted to admin has "Remove Admin Role" instead of "Delete Admin"',
  { tag: ['@regression'] },
  async ({ page }) => {
    // Log in and open Settings -> Admins (every UI test starts logged out)
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(process.env.LOGIN_EMAIL, process.env.LOGIN_PASSWORD);
    await expect(page).toHaveURL(/lmdmax\.com\/schedule/, { timeout: 30000 });

    const adminsPage = new AdminsPage(page);
    await adminsPage.open();
    await expect(adminsPage.rows.first()).toBeVisible();

    const promotedRow = adminsPage.row('Driver promoted to admin');
    await expect(
      promotedRow.getByRole('button', { name: 'Remove Admin Role' }),
    ).toBeEnabled();
    await expect(
      promotedRow.getByRole('button', { name: 'Delete Admin' }),
    ).toHaveCount(0);
    await expect(
      promotedRow.getByRole('button', { name: 'Edit Admin' }),
    ).toBeEnabled();
  },
);

// ---------- Search ----------

test(
  'TC-06: Verify that searching by name shows only that admin',
  { tag: ['@smoke', '@regression', '@pr'] },
  async ({ page }) => {
    // Log in and open Settings -> Admins (every UI test starts logged out)
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(process.env.LOGIN_EMAIL, process.env.LOGIN_PASSWORD);
    await expect(page).toHaveURL(/lmdmax\.com\/schedule/, { timeout: 30000 });

    const adminsPage = new AdminsPage(page);
    await adminsPage.open();
    await expect(adminsPage.rows.first()).toBeVisible();
    // The last admin in the list, so the test does not depend on one fixed name
    const name = await adminsPage.nameOf(adminsPage.rows.last()).innerText();

    await adminsPage.search(name);

    await expect(adminsPage.rows.first()).toContainText(name);
    for (const row of await adminsPage.rows.all()) {
      await expect(adminsPage.nameOf(row)).toContainText(name);
    }
  },
);

test(
  'TC-07: Verify that a search with no match shows "No Admin Found" and (0)',
  { tag: ['@regression', '@pr'] },
  async ({ page }) => {
    // Log in and open Settings -> Admins (every UI test starts logged out)
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(process.env.LOGIN_EMAIL, process.env.LOGIN_PASSWORD);
    await expect(page).toHaveURL(/lmdmax\.com\/schedule/, { timeout: 30000 });

    const adminsPage = new AdminsPage(page);
    await adminsPage.open();
    await expect(adminsPage.rows.first()).toBeVisible();

    await adminsPage.search('zzzz-no-such-admin');

    await expect(adminsPage.noAdminFound).toBeVisible();
    await expect(adminsPage.count).toHaveText('(0)');
    await expect(adminsPage.rows).toHaveCount(0);
  },
);

test(
  'TC-08: Verify that clearing the search shows all admins again',
  { tag: ['@regression'] },
  async ({ page }) => {
    // Log in and open Settings -> Admins (every UI test starts logged out)
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(process.env.LOGIN_EMAIL, process.env.LOGIN_PASSWORD);
    await expect(page).toHaveURL(/lmdmax\.com\/schedule/, { timeout: 30000 });

    const adminsPage = new AdminsPage(page);
    await adminsPage.open();
    await expect(adminsPage.rows.first()).toBeVisible();
    const allRows = await adminsPage.rows.count();

    await adminsPage.search('zzzz-no-such-admin');
    await expect(adminsPage.rows).toHaveCount(0);
    await adminsPage.search('');

    await expect(adminsPage.rows).toHaveCount(allRows);
  },
);

// ---------- "Add Admin" window (nothing is saved) ----------

test(
  'TC-09: Verify that the "Add Admin" window opens with all fields and station PSD',
  { tag: ['@smoke', '@regression', '@pr'] },
  async ({ page }) => {
    // Log in and open Settings -> Admins (every UI test starts logged out)
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(process.env.LOGIN_EMAIL, process.env.LOGIN_PASSWORD);
    await expect(page).toHaveURL(/lmdmax\.com\/schedule/, { timeout: 30000 });

    const adminsPage = new AdminsPage(page);
    await adminsPage.open();
    await expect(adminsPage.rows.first()).toBeVisible();

    await adminsPage.addAdminButton.click();

    await expect(adminsPage.addWindow).toContainText('Add Admin');
    await expect(adminsPage.nameInput).toBeEmpty();
    await expect(adminsPage.emailInput).toBeEmpty();
    await expect(adminsPage.phoneInput).toBeEmpty();
    await expect(adminsPage.stationSelect).toHaveText('PSD');
    await expect(adminsPage.passwordInput).toBeEmpty();
    await expect(adminsPage.confirmPasswordInput).toBeEmpty();
    await expect(adminsPage.saveButton).toBeVisible();
    await expect(adminsPage.cancelButton).toBeVisible();
  },
);

test(
  'TC-10: Verify that "Add Admin" with empty fields does not save and asks to fill the name',
  { tag: ['@regression', '@pr'] },
  async ({ page }) => {
    // Log in and open Settings -> Admins (every UI test starts logged out)
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(process.env.LOGIN_EMAIL, process.env.LOGIN_PASSWORD);
    await expect(page).toHaveURL(/lmdmax\.com\/schedule/, { timeout: 30000 });

    const adminsPage = new AdminsPage(page);
    await adminsPage.open();
    await expect(adminsPage.rows.first()).toBeVisible();
    await adminsPage.addAdminButton.click();

    await adminsPage.saveButton.click();

    // The browser shows "Please fill out this field." under the empty Name box
    await expect(adminsPage.addWindow).toBeVisible();
    expect(
      await adminsPage.nameInput.evaluate((box) => box.validity.valueMissing),
    ).toBe(true);
  },
);

test(
  'TC-11: Verify that wrong email, phone and confirm password show error messages',
  { tag: ['@regression', '@pr'] },
  async ({ page }) => {
    // Log in and open Settings -> Admins (every UI test starts logged out)
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(process.env.LOGIN_EMAIL, process.env.LOGIN_PASSWORD);
    await expect(page).toHaveURL(/lmdmax\.com\/schedule/, { timeout: 30000 });

    const adminsPage = new AdminsPage(page);
    await adminsPage.open();
    await expect(adminsPage.rows.first()).toBeVisible();
    await adminsPage.addAdminButton.click();

    await adminsPage.nameInput.fill('QA Admin Check');
    await adminsPage.emailInput.fill('not-an-email');
    await adminsPage.phoneInput.fill('123');
    await adminsPage.passwordInput.fill('Abc@12345');
    await adminsPage.confirmPasswordInput.fill('Abc@99999');
    await adminsPage.saveButton.click();

    await expect(adminsPage.addWindow).toContainText(
      'Please enter a valid email',
    );
    await expect(adminsPage.addWindow).toContainText(
      'Please enter a valid phone number',
    );
    await expect(adminsPage.addWindow).toContainText('Passwords do not match');
    await expect(adminsPage.addWindow).toBeVisible();
  },
);

test(
  'TC-12: Verify that Cancel closes the "Add Admin" window without adding an admin',
  { tag: ['@regression', '@pr'] },
  async ({ page }) => {
    // Log in and open Settings -> Admins (every UI test starts logged out)
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(process.env.LOGIN_EMAIL, process.env.LOGIN_PASSWORD);
    await expect(page).toHaveURL(/lmdmax\.com\/schedule/, { timeout: 30000 });

    const adminsPage = new AdminsPage(page);
    await adminsPage.open();
    await expect(adminsPage.rows.first()).toBeVisible();
    const countBefore = await adminsPage.count.innerText();
    await adminsPage.addAdminButton.click();
    await adminsPage.nameInput.fill('QA Admin Cancel');

    await adminsPage.cancelButton.click();

    await expect(adminsPage.addWindow).toBeHidden();
    await expect(adminsPage.count).toHaveText(countBefore);
    await expect(adminsPage.row('QA Admin Cancel')).toHaveCount(0);
  },
);
