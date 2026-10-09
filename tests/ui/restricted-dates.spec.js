const { test, expect } = require('@playwright/test');
const LoginPage = require('../../pages/LoginPage');
const RestrictedDatesPage = require('../../pages/RestrictedDatesPage');

// Time Off Request -> Restricted Dates screen. Read only: + Add Restricted Dates, Edit and Delete are not
// clicked (they change when drivers can ask for time off, see docs/notes.md).

test(
  'TC-01: Verify that Restricted Dates shows the add button and the restricted dates with their date',
  { tag: ['@smoke', '@regression', '@pr'] },
  async ({ page }) => {
    // Log in and open Time Off Request -> Restricted Dates (every UI test starts logged out)
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(process.env.LOGIN_EMAIL, process.env.LOGIN_PASSWORD);
    await expect(page).toHaveURL(/lmdmax\.com\/schedule/, { timeout: 30000 });

    const restrictedPage = new RestrictedDatesPage(page);
    await restrictedPage.open();

    await expect(restrictedPage.addButton).toBeEnabled();
    await expect(restrictedPage.dates.first()).toBeVisible();
  },
);

test(
  'TC-02: Verify that the "Date Restriction" window opens on today with Submit disabled and Cancel closes it',
  { tag: ['@regression', '@pr'] },
  async ({ page }) => {
    // Log in and open Time Off Request -> Restricted Dates (every UI test starts logged out)
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(process.env.LOGIN_EMAIL, process.env.LOGIN_PASSWORD);
    await expect(page).toHaveURL(/lmdmax\.com\/schedule/, { timeout: 30000 });

    const restrictedPage = new RestrictedDatesPage(page);
    await restrictedPage.open();
    await expect(restrictedPage.addButton).toBeEnabled();
    // Today, as the window shows it, e.g. "Oct 09, 2026"
    const today = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });

    await restrictedPage.addButton.click();

    await expect(restrictedPage.addWindow).toContainText('Date Restriction');
    await expect(
      restrictedPage.addWindow.getByRole('button', { name: today }),
    ).toBeVisible();
    await expect(restrictedPage.titleInput).toBeEmpty();
    await expect(restrictedPage.submitButton).toBeDisabled();

    // Nothing typed, nothing saved
    await restrictedPage.cancelButton.click();
    await expect(restrictedPage.addWindow).toBeHidden();
  },
);
