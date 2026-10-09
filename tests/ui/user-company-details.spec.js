const { test, expect } = require('@playwright/test');
const LoginPage = require('../../pages/LoginPage');
const UserCompanyDetailsPage = require('../../pages/UserCompanyDetailsPage');

// Settings -> User/Company Details screen. Read only: Edit is closed with Cancel, Save is never clicked.
// Company: PSD, with stations PSD and PTD (active) and 3RD (pending approval).

// ---------- User Details ----------

test(
  'TC-01: Verify that User Details shows the logged-in user as Owner',
  { tag: ['@smoke', '@regression', '@pr'] },
  async ({ page }) => {
    // Log in and open Settings -> User/Company Details (every UI test starts logged out)
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(process.env.LOGIN_EMAIL, process.env.LOGIN_PASSWORD);
    await expect(page).toHaveURL(/lmdmax\.com\/schedule/, { timeout: 30000 });

    const detailsPage = new UserCompanyDetailsPage(page);
    await detailsPage.open();
    await expect(detailsPage.value('USERNAME')).toBeVisible();

    await expect(detailsPage.notice).toBeVisible();
    await expect(detailsPage.value('USERNAME')).not.toBeEmpty();
    await expect(detailsPage.value('PHONE')).toHaveText(/^\d{10}$/);
    await expect(detailsPage.value('EMAIL')).toHaveText(
      process.env.LOGIN_EMAIL,
      { ignoreCase: true },
    );
    await expect(detailsPage.value('ROLE')).toHaveText('Owner');
  },
);

test(
  'TC-02: Verify that Edit allows changing only username and phone',
  { tag: ['@regression', '@pr'] },
  async ({ page }) => {
    // Log in and open Settings -> User/Company Details (every UI test starts logged out)
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(process.env.LOGIN_EMAIL, process.env.LOGIN_PASSWORD);
    await expect(page).toHaveURL(/lmdmax\.com\/schedule/, { timeout: 30000 });

    const detailsPage = new UserCompanyDetailsPage(page);
    await detailsPage.open();
    await expect(detailsPage.value('USERNAME')).toBeVisible();

    await detailsPage.editButton.click();

    await expect(detailsPage.input('USERNAME')).toBeEditable();
    await expect(detailsPage.input('PHONE')).toBeEditable();
    await expect(detailsPage.input('EMAIL')).toBeDisabled();
    await expect(detailsPage.input('ROLE')).toBeDisabled();
    await expect(detailsPage.saveButton).toBeVisible();
    await expect(detailsPage.cancelButton).toBeVisible();
  },
);

test(
  'TC-03: Verify that Cancel closes Edit without saving the change',
  { tag: ['@regression', '@pr'] },
  async ({ page }) => {
    // Log in and open Settings -> User/Company Details (every UI test starts logged out)
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(process.env.LOGIN_EMAIL, process.env.LOGIN_PASSWORD);
    await expect(page).toHaveURL(/lmdmax\.com\/schedule/, { timeout: 30000 });

    const detailsPage = new UserCompanyDetailsPage(page);
    await detailsPage.open();
    await expect(detailsPage.value('USERNAME')).toBeVisible();
    const username = await detailsPage.value('USERNAME').innerText();

    await detailsPage.editButton.click();
    await detailsPage.input('USERNAME').fill('Changed Name');
    await detailsPage.cancelButton.click();

    await expect(detailsPage.editButton).toBeVisible();
    await expect(detailsPage.value('USERNAME')).toHaveText(username);
  },
);

// ---------- Company Details ----------

test(
  'TC-04: Verify that Company Details shows company PSD',
  { tag: ['@smoke', '@regression', '@pr'] },
  async ({ page }) => {
    // Log in and open Settings -> User/Company Details (every UI test starts logged out)
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(process.env.LOGIN_EMAIL, process.env.LOGIN_PASSWORD);
    await expect(page).toHaveURL(/lmdmax\.com\/schedule/, { timeout: 30000 });

    const detailsPage = new UserCompanyDetailsPage(page);
    await detailsPage.open();
    await expect(detailsPage.value('USERNAME')).toBeVisible();

    await detailsPage.companyTab.click();

    await expect(detailsPage.value('COMPANY NAME')).toHaveText('PSD');
    await expect(detailsPage.value('DSP SHORT CODE')).toHaveText('PSD');
    await expect(detailsPage.value('STATION CODE')).toHaveText('PSD');
    // first(): the stations below also have an ADDRESS
    for (const label of ['OWNER', 'TWILIO NUMBER', 'ZIP CODE', 'ADDRESS']) {
      await expect(detailsPage.value(label).first()).toBeVisible();
    }
  },
);

test(
  'TC-05: Verify that Company Details lists the stations with their status',
  { tag: ['@regression', '@pr'] },
  async ({ page }) => {
    // Log in and open Settings -> User/Company Details (every UI test starts logged out)
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(process.env.LOGIN_EMAIL, process.env.LOGIN_PASSWORD);
    await expect(page).toHaveURL(/lmdmax\.com\/schedule/, { timeout: 30000 });

    const detailsPage = new UserCompanyDetailsPage(page);
    await detailsPage.open();
    await expect(detailsPage.value('USERNAME')).toBeVisible();

    await detailsPage.companyTab.click();

    await expect(detailsPage.addStationButton).toBeVisible();
    await expect(detailsPage.station('Station 1')).toContainText('PSD');
    await expect(detailsPage.station('Station 1')).toContainText('Active');
    await expect(detailsPage.station('Station 2')).toContainText('PTD');
    await expect(detailsPage.station('Station 2')).toContainText('Active');
    await expect(detailsPage.station('Station 3')).toContainText('3RD');
    await expect(detailsPage.station('Station 3')).toContainText(
      'Pending Approval',
    );
  },
);
