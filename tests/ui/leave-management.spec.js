const { test, expect } = require('@playwright/test');
const LoginPage = require('../../pages/LoginPage');
const LeaveManagementPage = require('../../pages/LeaveManagementPage');

// Time Off Request -> Leave Management screen. Read only: + Time Off Request, Approve, Decline and
// Move To Declined are not clicked (they change the drivers' time off, see docs/notes.md).

test(
  'TC-01: Verify that Leave Management shows the 4 status cards and the Pending list',
  { tag: ['@smoke', '@regression', '@pr'] },
  async ({ page }) => {
    // Log in and open Time Off Request -> Leave Management (every UI test starts logged out)
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(process.env.LOGIN_EMAIL, process.env.LOGIN_PASSWORD);
    await expect(page).toHaveURL(/lmdmax\.com\/schedule/, { timeout: 30000 });

    const leavePage = new LeaveManagementPage(page);
    await leavePage.open();
    await expect(leavePage.addTimeOffButton).toBeVisible();

    for (const name of [
      'Pending',
      'Declined',
      'Approved',
      'Deleted by Driver',
    ]) {
      await expect(leavePage.cardCount(name)).toHaveText(/^\d+$/);
    }
    await expect(leavePage.selectDateButton).toBeVisible();
    await expect(leavePage.sortButton).toHaveText(
      'Applied Date (Newest First)',
    );
    await expect(leavePage.searchInput).toBeVisible();
  },
);

test(
  'TC-02: Verify that the Time Off Request tabs open each of the 3 screens',
  { tag: ['@regression'] },
  async ({ page }) => {
    // Log in first (every UI test starts logged out)
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(process.env.LOGIN_EMAIL, process.env.LOGIN_PASSWORD);
    await expect(page).toHaveURL(/lmdmax\.com\/schedule/, { timeout: 30000 });

    await page.getByRole('link', { name: 'Time Off Request' }).click();
    await expect(page).toHaveURL(/time-off-request\/leave-management/);
    await page.getByRole('link', { name: 'Restricted Dates' }).click();
    await expect(page).toHaveURL(/time-off-request\/restricted-dates/);
    await page.getByRole('link', { name: 'VTO Management' }).click();
    await expect(page).toHaveURL(/time-off-request\/vto-dashboard/);
    await page.getByRole('link', { name: 'Leave Management' }).click();
    await expect(page).toHaveURL(/time-off-request\/leave-management/);
  },
);

test(
  'TC-03: Verify that the Approved card lists as many requests as its number',
  { tag: ['@regression', '@pr'] },
  async ({ page }) => {
    // Log in and open Time Off Request -> Leave Management (every UI test starts logged out)
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(process.env.LOGIN_EMAIL, process.env.LOGIN_PASSWORD);
    await expect(page).toHaveURL(/lmdmax\.com\/schedule/, { timeout: 30000 });

    const leavePage = new LeaveManagementPage(page);
    await leavePage.open();
    await expect(leavePage.addTimeOffButton).toBeVisible();
    const approved = Number(await leavePage.cardCount('Approved').innerText());

    await leavePage.card('Approved').click();

    await expect(leavePage.moveToDeclinedButtons).toHaveCount(approved);
  },
);

test(
  'TC-04: Verify that the sort list has the 4 sort orders',
  { tag: ['@regression'] },
  async ({ page }) => {
    // Log in and open Time Off Request -> Leave Management (every UI test starts logged out)
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(process.env.LOGIN_EMAIL, process.env.LOGIN_PASSWORD);
    await expect(page).toHaveURL(/lmdmax\.com\/schedule/, { timeout: 30000 });

    const leavePage = new LeaveManagementPage(page);
    await leavePage.open();
    await expect(leavePage.addTimeOffButton).toBeVisible();

    await leavePage.sortButton.click();

    await expect(page.getByRole('menuitem')).toHaveText([
      'Applied Date (Newest First)',
      'Applied Date (Oldest First)',
      'Leave Date (Upcoming First)',
      'Leave Date (Farthest First)',
    ]);
    await page.keyboard.press('Escape');
  },
);

test(
  'TC-05: Verify that a search with no match shows "No Approved Leaves"',
  { tag: ['@regression', '@pr'] },
  async ({ page }) => {
    // Log in and open Time Off Request -> Leave Management (every UI test starts logged out)
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(process.env.LOGIN_EMAIL, process.env.LOGIN_PASSWORD);
    await expect(page).toHaveURL(/lmdmax\.com\/schedule/, { timeout: 30000 });

    const leavePage = new LeaveManagementPage(page);
    await leavePage.open();
    await expect(leavePage.addTimeOffButton).toBeVisible();
    await leavePage.card('Approved').click();

    await leavePage.searchInput.fill('zzzznotadriver');

    await expect(leavePage.emptyMessage('Approved')).toBeVisible();
    await expect(leavePage.moveToDeclinedButtons).toHaveCount(0);
  },
);

test(
  'TC-06: Verify that the "Time Off Request" window opens on today with Apply disabled and Cancel closes it',
  { tag: ['@regression', '@pr'] },
  async ({ page }) => {
    // Log in and open Time Off Request -> Leave Management (every UI test starts logged out)
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(process.env.LOGIN_EMAIL, process.env.LOGIN_PASSWORD);
    await expect(page).toHaveURL(/lmdmax\.com\/schedule/, { timeout: 30000 });

    const leavePage = new LeaveManagementPage(page);
    await leavePage.open();
    await expect(leavePage.addTimeOffButton).toBeVisible();
    // Today, as the window shows it, e.g. "Oct 09, 2026"
    const today = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });

    await leavePage.addTimeOffButton.click();

    await expect(leavePage.requestWindow).toContainText('Time Off Request');
    await expect(
      leavePage.requestWindow.getByRole('button', { name: today }),
    ).toBeVisible();
    await expect(leavePage.requestWindow).toContainText('Select Drivers');
    await expect(leavePage.requestWindow).toContainText('0 / 250');
    await expect(leavePage.applyButton).toBeDisabled();

    // Nothing chosen, nothing saved
    await leavePage.cancelButton.click();
    await expect(leavePage.requestWindow).toBeHidden();
  },
);

test(
  'TC-07: Verify that Select Date opens a calendar with today selected',
  { tag: ['@regression'] },
  async ({ page }) => {
    // Log in and open Time Off Request -> Leave Management (every UI test starts logged out)
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(process.env.LOGIN_EMAIL, process.env.LOGIN_PASSWORD);
    await expect(page).toHaveURL(/lmdmax\.com\/schedule/, { timeout: 30000 });

    const leavePage = new LeaveManagementPage(page);
    await leavePage.open();
    await expect(leavePage.addTimeOffButton).toBeVisible();

    await leavePage.selectDateButton.click();

    await expect(leavePage.selectedDay).toHaveText(
      String(new Date().getDate()),
    );
    // Closed without choosing a day
    await page.keyboard.press('Escape');
  },
);
