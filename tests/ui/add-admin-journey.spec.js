// SCENARIO: the owner adds a new admin to station PSD.
// Tested on the real screens (UI).
//
// TC-01
// 1. Owner, in the web app: Settings -> Admins
//    - "+ Add Admin" -> name, email, phone, password and confirm password (station stays PSD) -> "Add Admin"
//    CHECK: "Admin added to station(s): PSD successfully."
//    CHECK: the window closes
// 2. Owner reloads the page (the list comes from the server again)
//    CHECK: the list has more admins than before
//    CHECK: the new admin's row shows the name, email, phone and station PSD
//    CHECK: Edit Admin, Delete Admin and Set Permission are enabled for the new admin
//
// TC-02 (BUG-UI-001)
// 1. Owner adds an admin as in TC-01
//    CHECK: without a reload, the new admin is in the list and the number next to the title is 1 higher
//
// Each test adds one new admin every run (daily regression only: @adds-data). The admins are not deleted.
// Realistic names (faker); a name can contain only letters, spaces, hyphens and apostrophes.
// Safe contacts: yopmail inbox, area code 555 (no real phones).

const { test, expect } = require('@playwright/test');
const { faker } = require('@faker-js/faker');
const LoginPage = require('../../pages/LoginPage');
const AdminsPage = require('../../pages/AdminsPage');

test(
  'TC-01: Verify that an admin added in the web app is saved and shown in the admin list',
  { tag: ['@regression', '@adds-data'] },
  async ({ page }) => {
    // A new admin every run: name and email must not exist yet
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const runNumber = String(Date.now());
    const newAdmin = {
      // 5 letters made from the run number (no digits allowed in a name)
      name:
        firstName +
        ' ' +
        lastName +
        ' ' +
        runNumber
          .slice(-5)
          .split('')
          .map((digit) => 'ABCDEFGHIJ'[digit])
          .join(''),
      email:
        (firstName + '.' + lastName).toLowerCase().replace(/[^a-z.]/g, '') +
        '.' +
        runNumber.slice(-6) +
        '@yopmail.com',
      phone: '555' + runNumber.slice(-7),
      password: 'Test@12345',
    };

    // 1. Owner: logs in, opens Settings -> Admins and adds the admin
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(process.env.LOGIN_EMAIL, process.env.LOGIN_PASSWORD);
    await expect(page).toHaveURL(/lmdmax\.com\/schedule/, { timeout: 30000 });

    const adminsPage = new AdminsPage(page);
    await adminsPage.open();
    await expect(adminsPage.rows.first()).toBeVisible();
    const countBefore = await adminsPage.rows.count();

    await adminsPage.addAdmin(newAdmin);
    await expect(
      page.getByText('Admin added to station(s): PSD successfully.').first(),
    ).toBeVisible();
    await expect(adminsPage.addWindow).toBeHidden();

    // 2. Reload: the saved admin comes from the server
    await page.reload();
    const row = adminsPage.row(newAdmin.name);
    await expect(row).toBeVisible();
    // Higher than before (other tests may add admins at the same time)
    expect(await adminsPage.rows.count()).toBeGreaterThan(countBefore);
    await expect(row).toContainText(newAdmin.name);
    await expect(row).toContainText(newAdmin.email);
    await expect(row).toContainText(newAdmin.phone);
    await expect(row).toContainText('PSD');
    await expect(row.getByRole('button', { name: 'Edit Admin' })).toBeEnabled();
    await expect(
      row.getByRole('button', { name: 'Delete Admin' }),
    ).toBeEnabled();
    await expect(
      row.getByRole('button', { name: 'Set Permission' }),
    ).toBeEnabled();
  },
);

test(
  'TC-02: Verify that a new admin shows in the list without reloading the page (BUG-UI-001)',
  { tag: ['@regression', '@adds-data', '@knownbug'] },
  async ({ page }) => {
    // A new admin every run: name and email must not exist yet
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const runNumber = String(Date.now());
    const newAdmin = {
      // 5 letters made from the run number (no digits allowed in a name)
      name:
        firstName +
        ' ' +
        lastName +
        ' ' +
        runNumber
          .slice(-5)
          .split('')
          .map((digit) => 'ABCDEFGHIJ'[digit])
          .join(''),
      email:
        (firstName + '.' + lastName).toLowerCase().replace(/[^a-z.]/g, '') +
        '.' +
        runNumber.slice(-6) +
        '@yopmail.com',
      phone: '555' + runNumber.slice(-7),
      password: 'Test@12345',
    };

    // Log in and open Settings -> Admins
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(process.env.LOGIN_EMAIL, process.env.LOGIN_PASSWORD);
    await expect(page).toHaveURL(/lmdmax\.com\/schedule/, { timeout: 30000 });

    const adminsPage = new AdminsPage(page);
    await adminsPage.open();
    await expect(adminsPage.rows.first()).toBeVisible();
    const countBefore = await adminsPage.rows.count();

    await adminsPage.addAdmin(newAdmin);
    await expect(
      page.getByText('Admin added to station(s): PSD successfully.').first(),
    ).toBeVisible();

    // No reload: the list should update by itself
    await expect(adminsPage.row(newAdmin.name)).toBeVisible();
    await expect(adminsPage.count).toHaveText('(' + (countBefore + 1) + ')');
  },
);
