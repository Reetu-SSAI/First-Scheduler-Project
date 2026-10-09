const { test, expect } = require('@playwright/test');
const LoginPage = require('../../pages/LoginPage');
const SchedulePage = require('../../pages/SchedulePage');

// The Schedule screen. Read only: the tests only change what is shown (week, view, search), and open the
// Filter, Sort, Other Options, station and "Add Driver" windows and close them without choosing or saving.
// Shifts, Copy, Mark Extras, Publish and Auto schedule are not clicked (see docs/notes.md).

// A driver of station PSD, used for the search
const DRIVER_NAME = 'Alvin Adkins';

test(
  'TC-01: Verify that the Schedule shows the week with 7 days, the shift counts and the drivers',
  { tag: ['@smoke', '@regression', '@pr'] },
  async ({ page }) => {
    // Log in; the Schedule open right after login (every UI test starts logged out)
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(process.env.LOGIN_EMAIL, process.env.LOGIN_PASSWORD);
    await expect(page).toHaveURL(/lmdmax\.com\/schedule/, { timeout: 30000 });

    const schedulePage = new SchedulePage(page);
    await expect(schedulePage.weekLabel).toBeVisible({ timeout: 30000 });

    await expect(schedulePage.viewSelect).toBeVisible();
    await expect(schedulePage.dayHeaders).toHaveCount(7);
    for (const name of [
      'Unpublished',
      'Published',
      'Pending',
      'Accepted',
      'Declined',
    ]) {
      await expect(schedulePage.countLabel(name)).toBeVisible();
    }
    await expect(schedulePage.openShiftsRow).toBeVisible();
    await expect(schedulePage.driver(DRIVER_NAME)).toBeVisible();
    await expect(schedulePage.addDriverButton).toBeVisible();
  },
);

test(
  'TC-02: Verify that next and previous week change the week shown',
  { tag: ['@regression', '@pr'] },
  async ({ page }) => {
    // Log in; the Schedule open right after login (every UI test starts logged out)
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(process.env.LOGIN_EMAIL, process.env.LOGIN_PASSWORD);
    await expect(page).toHaveURL(/lmdmax\.com\/schedule/, { timeout: 30000 });

    const schedulePage = new SchedulePage(page);
    await expect(schedulePage.weekLabel).toBeVisible({ timeout: 30000 });
    const thisWeek = await schedulePage.weekLabel.innerText();

    await schedulePage.nextWeekButton.click();
    await expect(schedulePage.weekLabel).not.toHaveText(thisWeek);
    await schedulePage.previousWeekButton.click();
    await expect(schedulePage.weekLabel).toHaveText(thisWeek);
  },
);

test(
  'TC-03: Verify that Daily shows today, Biweekly 14 days and Weekly 7 days',
  { tag: ['@regression'] },
  async ({ page }) => {
    // Log in; the Schedule open right after login (every UI test starts logged out)
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(process.env.LOGIN_EMAIL, process.env.LOGIN_PASSWORD);
    await expect(page).toHaveURL(/lmdmax\.com\/schedule/, { timeout: 30000 });

    const schedulePage = new SchedulePage(page);
    await expect(schedulePage.weekLabel).toBeVisible({ timeout: 30000 });

    await schedulePage.dailyButton.click();
    await expect(schedulePage.dayButton(new Date())).toBeVisible();
    await expect(schedulePage.dayHeaders).toHaveCount(0);

    await schedulePage.biweeklyButton.click();
    await expect(schedulePage.weekLabel).toContainText('/');
    await expect(schedulePage.dayHeaders).toHaveCount(14);

    await schedulePage.weeklyButton.click();
    await expect(schedulePage.dayHeaders).toHaveCount(7);
  },
);

test(
  'TC-04: Verify that search by driver name shows only that driver',
  { tag: ['@regression', '@pr'] },
  async ({ page }) => {
    // Log in; the Schedule open right after login (every UI test starts logged out)
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(process.env.LOGIN_EMAIL, process.env.LOGIN_PASSWORD);
    await expect(page).toHaveURL(/lmdmax\.com\/schedule/, { timeout: 30000 });

    const schedulePage = new SchedulePage(page);
    await expect(schedulePage.weekLabel).toBeVisible({ timeout: 30000 });

    await schedulePage.searchInput.fill(DRIVER_NAME);
    await expect(schedulePage.driver(DRIVER_NAME)).toBeVisible();
    // Other drivers, e.g. the "Andrew ..." ones, are hidden
    await expect(page.getByText(/^Andrew/)).toHaveCount(0);
  },
);

test(
  'TC-05: Verify that search with an unknown name shows no drivers',
  { tag: ['@regression'] },
  async ({ page }) => {
    // Log in; the Schedule open right after login (every UI test starts logged out)
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(process.env.LOGIN_EMAIL, process.env.LOGIN_PASSWORD);
    await expect(page).toHaveURL(/lmdmax\.com\/schedule/, { timeout: 30000 });

    const schedulePage = new SchedulePage(page);
    await expect(schedulePage.weekLabel).toBeVisible({ timeout: 30000 });

    await schedulePage.searchInput.fill('zzzznotadriver');
    await expect(schedulePage.driver(DRIVER_NAME)).toHaveCount(0);
    await expect(schedulePage.openShiftsRow).toHaveCount(0);
  },
);

test(
  'TC-06: Verify that the view list shows Employee View, All Schedule and Add New Schedule',
  { tag: ['@regression'] },
  async ({ page }) => {
    // Log in; the Schedule open right after login (every UI test starts logged out)
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(process.env.LOGIN_EMAIL, process.env.LOGIN_PASSWORD);
    await expect(page).toHaveURL(/lmdmax\.com\/schedule/, { timeout: 30000 });

    const schedulePage = new SchedulePage(page);
    await expect(schedulePage.weekLabel).toBeVisible({ timeout: 30000 });

    await schedulePage.viewSelect.click();
    await expect(schedulePage.viewOption('All Schedule')).toBeVisible();
    // Written "+ Add new schedule" (the screen shows it in capitals)
    await expect(schedulePage.viewOption('+ Add new schedule')).toBeVisible();
    await expect(schedulePage.viewOption('Employee View').last()).toBeVisible();
  },
);

test(
  'TC-07: Verify that the Biweekly label shows the dates of both weeks',
  { tag: ['@regression'] },
  async ({ page }) => {
    // Log in; the Schedule open right after login (every UI test starts logged out)
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(process.env.LOGIN_EMAIL, process.env.LOGIN_PASSWORD);
    await expect(page).toHaveURL(/lmdmax\.com\/schedule/, { timeout: 30000 });

    const schedulePage = new SchedulePage(page);
    await expect(schedulePage.weekLabel).toBeVisible({ timeout: 30000 });
    // "W:41 Oct 04 - Oct 10" -> first day "Oct 04", last day "Oct 10"
    const dates = /(\w{3} \d{2}) - (\w{3} \d{2})/;

    // The first day of this week and the last day of next week
    const firstDay = (await schedulePage.weekLabel.innerText()).match(dates)[1];
    await schedulePage.nextWeekButton.click();
    await expect(schedulePage.weekLabel).not.toContainText(firstDay);
    const lastDay = (await schedulePage.weekLabel.innerText()).match(dates)[2];
    await schedulePage.previousWeekButton.click();
    await expect(schedulePage.weekLabel).toContainText(firstDay);

    await schedulePage.biweeklyButton.click();
    await expect(schedulePage.dayHeaders).toHaveCount(14);
    // e.g. "W:41/42 Oct 04 - Oct 17" (BUG-UI-002, fixed: "W:41/42 Oct 04 - Oct 10")
    await expect(schedulePage.weekLabel).toContainText(
      firstDay + ' - ' + lastDay,
    );
  },
);

test(
  'TC-08: Verify that Filter shows the Status, Rating, Van Type and Role filters',
  { tag: ['@regression'] },
  async ({ page }) => {
    // Log in; the Schedule opens right after login (every UI test starts logged out)
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(process.env.LOGIN_EMAIL, process.env.LOGIN_PASSWORD);
    await expect(page).toHaveURL(/lmdmax\.com\/schedule/, { timeout: 30000 });

    const schedulePage = new SchedulePage(page);
    await expect(schedulePage.weekLabel).toBeVisible({ timeout: 30000 });

    await schedulePage.filterButton.click();

    for (const title of ['STATUS', 'RATING', 'VAN TYPE', 'ROLE']) {
      await expect(page.getByText(title, { exact: true })).toBeVisible();
    }
    await expect(page.getByText(/^Active \(\d+\)$/)).toBeVisible();
    await expect(page.getByText('ALL 5 STARS')).toBeVisible();
    await expect(page.getByText('Cargo Van')).toBeVisible();
    // Closed without choosing
    await page.keyboard.press('Escape');
  },
);

test(
  'TC-09: Verify that Sort has A-Z, Z-A and both orders of hours, rank and rating',
  { tag: ['@regression'] },
  async ({ page }) => {
    // Log in; the Schedule opens right after login (every UI test starts logged out)
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(process.env.LOGIN_EMAIL, process.env.LOGIN_PASSWORD);
    await expect(page).toHaveURL(/lmdmax\.com\/schedule/, { timeout: 30000 });

    const schedulePage = new SchedulePage(page);
    await expect(schedulePage.weekLabel).toBeVisible({ timeout: 30000 });

    await schedulePage.sortButton.click();

    // Each of the last three twice: up arrow and down arrow
    await expect(page.getByRole('menuitem')).toHaveText([
      'A-Z',
      'Z-A',
      'Working Hours',
      'Working Hours',
      'Scorecard Rank',
      'Scorecard Rank',
      'Driver Rating',
      'Driver Rating',
    ]);
    // Closed without choosing
    await page.keyboard.press('Escape');
  },
);

test(
  'TC-10: Verify that Other Options shows the Exports, Import and Options buttons',
  { tag: ['@regression'] },
  async ({ page }) => {
    // Log in; the Schedule opens right after login (every UI test starts logged out)
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(process.env.LOGIN_EMAIL, process.env.LOGIN_PASSWORD);
    await expect(page).toHaveURL(/lmdmax\.com\/schedule/, { timeout: 30000 });

    const schedulePage = new SchedulePage(page);
    await expect(schedulePage.weekLabel).toBeVisible({ timeout: 30000 });

    await schedulePage.otherOptionsButton.click();

    for (const name of [
      'Export as Excel',
      'Export as PDF',
      'Export as CSV',
      'Export Backup Shifts',
      'Import Amazon Weekly Roster',
      'Save Schedule Template',
      'Load Schedule Template',
      'Bulk Actions',
      'Schedule Settings',
    ]) {
      await expect(page.getByRole('button', { name })).toBeVisible();
    }
    // Closed without choosing
    await page.keyboard.press('Escape');
  },
);

test(
  'TC-11: Verify that the station menu lists stations PSD and PTD',
  { tag: ['@regression'] },
  async ({ page }) => {
    // Log in; the Schedule opens right after login (every UI test starts logged out)
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(process.env.LOGIN_EMAIL, process.env.LOGIN_PASSWORD);
    await expect(page).toHaveURL(/lmdmax\.com\/schedule/, { timeout: 30000 });

    const schedulePage = new SchedulePage(page);
    await expect(schedulePage.weekLabel).toBeVisible({ timeout: 30000 });

    await schedulePage.stationButton.click();

    await expect(page.getByText('PTD', { exact: true })).toBeVisible();
    await expect(page.getByText('PSD', { exact: true }).last()).toBeVisible();
    // Closed without choosing (choosing would change the station of the test user)
    await page.keyboard.press('Escape');
  },
);

test(
  'TC-12: Verify that the "Add Driver" window opens empty with station PSD and Cancel closes it',
  { tag: ['@regression', '@pr'] },
  async ({ page }) => {
    // Log in; the Schedule opens right after login (every UI test starts logged out)
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(process.env.LOGIN_EMAIL, process.env.LOGIN_PASSWORD);
    await expect(page).toHaveURL(/lmdmax\.com\/schedule/, { timeout: 30000 });

    const schedulePage = new SchedulePage(page);
    await expect(schedulePage.weekLabel).toBeVisible({ timeout: 30000 });

    await schedulePage.addDriverButton.click();

    await expect(schedulePage.addDriverWindow).toContainText('Add Driver');
    await expect(schedulePage.driverNameInput).toBeEmpty();
    await expect(schedulePage.driverEmailInput).toBeEmpty();
    await expect(schedulePage.driverPhoneInput).toBeEmpty();
    await expect(schedulePage.transporterIdInput).toBeEmpty();
    await expect(
      schedulePage.addDriverWindow.getByRole('combobox').last(),
    ).toHaveText('PSD');

    // Nothing typed, nothing saved
    await schedulePage.cancelButton.click();
    await expect(schedulePage.addDriverWindow).toBeHidden();
  },
);

test(
  'TC-13: Verify that Other Options -> Bulk Actions lists the 7 bulk actions',
  { tag: ['@regression'] },
  async ({ page }) => {
    // Log in; the Schedule opens right after login (every UI test starts logged out)
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(process.env.LOGIN_EMAIL, process.env.LOGIN_PASSWORD);
    await expect(page).toHaveURL(/lmdmax\.com\/schedule/, { timeout: 30000 });

    const schedulePage = new SchedulePage(page);
    await expect(schedulePage.weekLabel).toBeVisible({ timeout: 30000 });

    await schedulePage.otherOptionsButton.click();
    // Opens the list only; none of the actions is clicked (the list has Delete All Shifts)
    await page.getByRole('button', { name: 'Bulk Actions' }).click();

    for (const name of [
      'Delete All Shifts',
      'Delete Empty Shifts',
      'Send Schedule Details',
      'Bulk Action: Driver Reliability Rating',
      'Bulk Action: Set Availability',
      'Bulk Action: Driver Classification',
      'Bulk Action: Edit Shift',
    ]) {
      await expect(page.getByText(name, { exact: true })).toBeVisible();
    }
    // Closed without choosing
    await page.keyboard.press('Escape');
  },
);

test(
  'TC-14: Verify that the "Save Schedule Template" window shows the week, the shift totals and the fields, and Cancel closes it',
  { tag: ['@regression'] },
  async ({ page }) => {
    // Log in; the Schedule opens right after login (every UI test starts logged out)
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(process.env.LOGIN_EMAIL, process.env.LOGIN_PASSWORD);
    await expect(page).toHaveURL(/lmdmax\.com\/schedule/, { timeout: 30000 });

    const schedulePage = new SchedulePage(page);
    await expect(schedulePage.weekLabel).toBeVisible({ timeout: 30000 });

    await schedulePage.otherOptionsButton.click();
    await page.getByRole('button', { name: 'Save Schedule Template' }).click();

    const templateWindow = page.getByRole('dialog');
    await expect(templateWindow).toContainText('Save Schedule Template');
    for (const label of [
      'Total Shifts:',
      'Shift Assigned:',
      'TEMPLATE NAME',
      'SELECT SCHEDULE',
      'TEMPLATE DESCRIPTION',
    ]) {
      await expect(templateWindow).toContainText(label);
    }
    // The name is filled in with the week, e.g. "W41/42 : Oct 04 - Oct 10"
    await expect(templateWindow.getByRole('textbox').first()).not.toBeEmpty();
    await expect(templateWindow.getByRole('combobox')).toHaveText(
      'All Schedules',
    );

    // Nothing saved
    await templateWindow.getByRole('button', { name: 'Cancel' }).click();
    await expect(templateWindow).toBeHidden();
  },
);

test(
  'TC-15: Verify that "Load Schedule Template" shows "No Schedule Template found" and Close closes it',
  { tag: ['@regression'] },
  async ({ page }) => {
    // Log in; the Schedule opens right after login (every UI test starts logged out)
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(process.env.LOGIN_EMAIL, process.env.LOGIN_PASSWORD);
    await expect(page).toHaveURL(/lmdmax\.com\/schedule/, { timeout: 30000 });

    const schedulePage = new SchedulePage(page);
    await expect(schedulePage.weekLabel).toBeVisible({ timeout: 30000 });

    await schedulePage.otherOptionsButton.click();
    await page.getByRole('button', { name: 'Load Schedule Template' }).click();

    const templateWindow = page.getByRole('dialog');
    await expect(templateWindow).toContainText('Load Schedule Template');
    // Station PSD has no saved template
    await expect(templateWindow).toContainText('No Schedule Template found');

    await templateWindow.getByRole('button', { name: 'Close' }).click();
    await expect(templateWindow).toBeHidden();
  },
);

test(
  'TC-16: Verify that "Schedule Settings" shows the 4 tabs, Add Schedule and the schedules, and Close closes it',
  { tag: ['@regression'] },
  async ({ page }) => {
    // Log in; the Schedule opens right after login (every UI test starts logged out)
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(process.env.LOGIN_EMAIL, process.env.LOGIN_PASSWORD);
    await expect(page).toHaveURL(/lmdmax\.com\/schedule/, { timeout: 30000 });

    const schedulePage = new SchedulePage(page);
    await expect(schedulePage.weekLabel).toBeVisible({ timeout: 30000 });

    await schedulePage.otherOptionsButton.click();
    await page.getByRole('button', { name: 'Schedule Settings' }).click();

    const settingsWindow = page.getByRole('dialog');
    await expect(page).toHaveURL(/edit-schedule=0&active=daySpecific/);
    for (const name of [
      'Day Specific Schedule',
      'Flexible Shift Schedule',
      'Template messages',
      'Reorder',
      '+ Add Schedule',
    ]) {
      await expect(settingsWindow.getByRole('button', { name })).toBeVisible();
    }
    await expect(
      settingsWindow.getByText(/^QA Schedule/).first(),
    ).toBeVisible();

    // Nothing added or changed
    await settingsWindow.getByRole('button', { name: 'Close' }).click();
    await expect(settingsWindow).toBeHidden();
  },
);

test(
  'TC-17: Verify that "Export Backup Shifts" shows "No shifts to export" with Download disabled, and Cancel closes it',
  { tag: ['@regression'] },
  async ({ page }) => {
    // Log in; the Schedule opens right after login (every UI test starts logged out)
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(process.env.LOGIN_EMAIL, process.env.LOGIN_PASSWORD);
    await expect(page).toHaveURL(/lmdmax\.com\/schedule/, { timeout: 30000 });

    const schedulePage = new SchedulePage(page);
    await expect(schedulePage.weekLabel).toBeVisible({ timeout: 30000 });

    await schedulePage.otherOptionsButton.click();
    await page.getByRole('button', { name: 'Export Backup Shifts' }).click();

    const exportWindow = page.getByRole('dialog');
    await expect(exportWindow).toContainText('Export Backup Shifts');
    await expect(
      exportWindow.getByRole('button', { name: /^W:\d+/ }),
    ).toBeVisible();
    // This week has no backup shifts
    await expect(
      exportWindow.getByRole('heading', { name: 'No shifts to export' }),
    ).toBeVisible();
    await expect(
      exportWindow.getByRole('button', { name: 'Download' }),
    ).toBeDisabled();

    await exportWindow.getByRole('button', { name: 'Cancel' }).click();
    await expect(exportWindow).toBeHidden();
  },
);
