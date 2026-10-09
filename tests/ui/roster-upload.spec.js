const { test, expect } = require('@playwright/test');
const LoginPage = require('../../pages/LoginPage');
const SchedulePage = require('../../pages/SchedulePage');
const RosterUploadPage = require('../../pages/RosterUploadPage');

// Schedule -> Other Options -> Import Amazon Weekly Roster (bulk upload). Read only: no file is chosen or
// uploaded, because an import adds the roster to the schedule of station PSD (see docs/notes.md).

test(
  'TC-01: Verify that Other Options -> Import Amazon Weekly Roster opens the roster upload page',
  { tag: ['@smoke', '@regression', '@pr'] },
  async ({ page }) => {
    // Log in; the Schedule opens right after login (every UI test starts logged out)
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(process.env.LOGIN_EMAIL, process.env.LOGIN_PASSWORD);
    await expect(page).toHaveURL(/lmdmax\.com\/schedule/, { timeout: 30000 });

    const schedulePage = new SchedulePage(page);
    await expect(schedulePage.weekLabel).toBeVisible({ timeout: 30000 });

    await schedulePage.otherOptionsButton.click();
    await page
      .getByRole('button', { name: 'Import Amazon Weekly Roster' })
      .click();

    const rosterUploadPage = new RosterUploadPage(page);
    await expect(page).toHaveURL(/\/schedule\/roster-upload/);
    await expect(rosterUploadPage.chooseFileButton).toBeVisible();
  },
);

test(
  'TC-02: Verify that the roster upload page shows the week, the upload box and the 11 steps',
  { tag: ['@regression', '@pr'] },
  async ({ page }) => {
    // Log in and open the roster upload page (every UI test starts logged out)
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(process.env.LOGIN_EMAIL, process.env.LOGIN_PASSWORD);
    await expect(page).toHaveURL(/lmdmax\.com\/schedule/, { timeout: 30000 });

    const rosterUploadPage = new RosterUploadPage(page);
    await rosterUploadPage.open();

    await expect(rosterUploadPage.weekLabel).toBeVisible({ timeout: 30000 });
    await expect(rosterUploadPage.dropZoneText).toBeVisible();
    await expect(rosterUploadPage.chooseFileButton).toBeEnabled();
    await expect(rosterUploadPage.stepsTitle).toBeVisible();
    await expect(rosterUploadPage.stepLabels).toHaveCount(11);
    await expect(
      page.getByText(
        "From the dropdown menu, select 'Import Amazon Weekly Roster'.",
      ),
    ).toBeVisible();
  },
);

test(
  'TC-03: Verify that Choose File accepts only Excel files (.xls, .xlsx)',
  { tag: ['@regression', '@pr'] },
  async ({ page }) => {
    // Log in and open the roster upload page (every UI test starts logged out)
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(process.env.LOGIN_EMAIL, process.env.LOGIN_PASSWORD);
    await expect(page).toHaveURL(/lmdmax\.com\/schedule/, { timeout: 30000 });

    const rosterUploadPage = new RosterUploadPage(page);
    await rosterUploadPage.open();
    await expect(rosterUploadPage.chooseFileButton).toBeVisible({
      timeout: 30000,
    });

    // The file box only offers Excel files; no file is chosen
    await expect(rosterUploadPage.fileInput).toHaveAttribute(
      'accept',
      'application/vnd.ms-excel,.xls,.xlsx',
    );
  },
);

test(
  'TC-04: Verify that next and previous week change the week to import into',
  { tag: ['@regression'] },
  async ({ page }) => {
    // Log in and open the roster upload page (every UI test starts logged out)
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(process.env.LOGIN_EMAIL, process.env.LOGIN_PASSWORD);
    await expect(page).toHaveURL(/lmdmax\.com\/schedule/, { timeout: 30000 });

    const rosterUploadPage = new RosterUploadPage(page);
    await rosterUploadPage.open();
    await expect(rosterUploadPage.weekLabel).toBeVisible({ timeout: 30000 });
    const thisWeek = await rosterUploadPage.weekLabel.innerText();

    await rosterUploadPage.nextWeekButton.click();
    await expect(rosterUploadPage.weekLabel).not.toHaveText(thisWeek);
    await rosterUploadPage.previousWeekButton.click();
    await expect(rosterUploadPage.weekLabel).toHaveText(thisWeek);
  },
);
