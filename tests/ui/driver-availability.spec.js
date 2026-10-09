const { test, expect } = require('@playwright/test');
const LoginPage = require('../../pages/LoginPage');
const DriverAvailabilityPage = require('../../pages/DriverAvailabilityPage');

// Settings -> Driver -> Driver Availability screen.
// Read only: the switch changes a setting of the whole station, so it is not clicked (see docs/notes.md).

test(
  'TC-01: Verify that Driver Availability shows its switch and Save is disabled without a change',
  { tag: ['@smoke', '@regression', '@pr'] },
  async ({ page }) => {
    // Log in and open Settings -> Driver -> Driver Availability (every UI test starts logged out)
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(process.env.LOGIN_EMAIL, process.env.LOGIN_PASSWORD);
    await expect(page).toHaveURL(/lmdmax\.com\/schedule/, { timeout: 30000 });

    const availabilityPage = new DriverAvailabilityPage(page);
    await availabilityPage.open();
    await expect(availabilityPage.title).toBeVisible();

    await expect(availabilityPage.description).toBeVisible();
    await expect(availabilityPage.optionText).toBeVisible();
    await expect(availabilityPage.switch).toHaveCount(1);
    await expect(availabilityPage.saveButton).toBeDisabled();
  },
);

test(
  'TC-02: Verify that the Driver menu opens each of its 3 screens',
  { tag: ['@regression'] },
  async ({ page }) => {
    // Log in and open Settings -> Driver -> Driver Availability (every UI test starts logged out)
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(process.env.LOGIN_EMAIL, process.env.LOGIN_PASSWORD);
    await expect(page).toHaveURL(/lmdmax\.com\/schedule/, { timeout: 30000 });

    const availabilityPage = new DriverAvailabilityPage(page);
    await availabilityPage.open();
    await expect(availabilityPage.title).toBeVisible();

    await page.getByRole('link', { name: 'Set Time Off Threshold' }).click();
    await expect(page).toHaveURL(/settings\/timeoff-threshold/);
    await page.getByRole('link', { name: 'Driver Performance Rating' }).click();
    await expect(page).toHaveURL(/settings\/driver-rating/);
    await page.getByRole('link', { name: 'Driver Availability' }).click();
    await expect(page).toHaveURL(/settings\/driver-availability/);
  },
);
