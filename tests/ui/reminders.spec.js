const { test, expect } = require('@playwright/test');
const LoginPage = require('../../pages/LoginPage');
const RemindersPage = require('../../pages/RemindersPage');

// Settings -> Reminders screen. Read only: the switches save at once and would send real messages, so they are not clicked.

test(
  'TC-01: Verify that Reminders shows the birthday and work anniversary switches and the time zone',
  { tag: ['@smoke', '@regression', '@pr'] },
  async ({ page }) => {
    // Log in and open Settings -> Reminders (every UI test starts logged out)
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(process.env.LOGIN_EMAIL, process.env.LOGIN_PASSWORD);
    await expect(page).toHaveURL(/lmdmax\.com\/schedule/, { timeout: 30000 });

    const remindersPage = new RemindersPage(page);
    await remindersPage.open();
    await expect(remindersPage.title).toBeVisible();

    await expect(remindersPage.description).toBeVisible();
    await expect(remindersPage.birthdayText).toBeVisible();
    await expect(remindersPage.anniversaryText).toBeVisible();
    await expect(remindersPage.switches).toHaveCount(2);
    await expect(remindersPage.timeZoneSelect).toHaveText(/\(UTC -\d:00\)/);
    await expect(
      page.getByText('Select time zone for reminders'),
    ).toBeVisible();
  },
);

test(
  'TC-02: Verify that the time zone list has the 4 US time zones',
  { tag: ['@regression'] },
  async ({ page }) => {
    // Log in and open Settings -> Reminders (every UI test starts logged out)
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(process.env.LOGIN_EMAIL, process.env.LOGIN_PASSWORD);
    await expect(page).toHaveURL(/lmdmax\.com\/schedule/, { timeout: 30000 });

    const remindersPage = new RemindersPage(page);
    await remindersPage.open();
    await expect(remindersPage.title).toBeVisible();

    await remindersPage.timeZoneSelect.click();

    await expect(page.getByRole('option')).toHaveText([
      'Pacific Time (UTC -8:00)',
      'Mountain Time (UTC -7:00)',
      'Central Time (UTC -6:00)',
      'Eastern Time (UTC -5:00)',
    ]);
    // Closed without choosing (choosing would save)
    await page.keyboard.press('Escape');
  },
);
