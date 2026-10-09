const { test, expect } = require('@playwright/test');
const LoginPage = require('../../pages/LoginPage');
const SmsChatPage = require('../../pages/SmsChatPage');

// Chats -> SMS Chat screen. Read only: no conversation is opened (it could mark messages as read), and
// Broadcast Message, Start New Group and Apply Filters are not clicked (SMS go to real phones, see docs/notes.md).

// A driver of station PSD with an SMS chat, used for the search
const DRIVER_NAME = 'Alvin Adkins';

test(
  'TC-01: Verify that SMS Chat shows search, the chat buttons and the recent chats',
  { tag: ['@smoke', '@regression', '@pr'] },
  async ({ page }) => {
    // Log in and open Chats -> SMS Chat (every UI test starts logged out)
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(process.env.LOGIN_EMAIL, process.env.LOGIN_PASSWORD);
    await expect(page).toHaveURL(/lmdmax\.com\/schedule/, { timeout: 30000 });

    const smsChatPage = new SmsChatPage(page);
    await smsChatPage.open();
    await expect(smsChatPage.recentChatsTitle).toBeVisible();

    await expect(smsChatPage.searchInput).toBeVisible();
    await expect(smsChatPage.broadcastButton).toBeVisible();
    await expect(smsChatPage.filtersButton).toBeVisible();
    await expect(smsChatPage.newGroupButton).toBeVisible();
    await expect(smsChatPage.chat(DRIVER_NAME)).toBeVisible();
    await expect(smsChatPage.selectChatText).toBeVisible();
  },
);

test(
  'TC-02: Verify that the Chats menu opens SMS Chat and In-App Chat',
  { tag: ['@regression'] },
  async ({ page }) => {
    // Log in first (every UI test starts logged out)
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(process.env.LOGIN_EMAIL, process.env.LOGIN_PASSWORD);
    await expect(page).toHaveURL(/lmdmax\.com\/schedule/, { timeout: 30000 });

    const smsChatPage = new SmsChatPage(page);
    await smsChatPage.chatsMenu.click();
    await page.getByRole('menuitem', { name: 'SMS Chat' }).click();
    await expect(page).toHaveURL(/lmdmax\.com\/chat/);
    await smsChatPage.chatsMenu.click();
    await page.getByRole('menuitem', { name: 'In-App Chat' }).click();
    await expect(page).toHaveURL(/lmdmax\.com\/inapp-chat/);
  },
);

test(
  'TC-03: Verify that search by driver name shows only that chat',
  { tag: ['@regression', '@pr'] },
  async ({ page }) => {
    // Log in and open Chats -> SMS Chat (every UI test starts logged out)
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(process.env.LOGIN_EMAIL, process.env.LOGIN_PASSWORD);
    await expect(page).toHaveURL(/lmdmax\.com\/schedule/, { timeout: 30000 });

    const smsChatPage = new SmsChatPage(page);
    await smsChatPage.open();
    await expect(smsChatPage.recentChatsTitle).toBeVisible();

    await smsChatPage.searchInput.fill(DRIVER_NAME);

    await expect(smsChatPage.chat(DRIVER_NAME)).toBeVisible();
    // Other chats, e.g. the "Andrew ..." ones, are hidden
    await expect(page.getByText(/^Andrew/)).toHaveCount(0);
  },
);

test(
  'TC-04: Verify that a search with no match shows "No chats found"',
  { tag: ['@regression', '@pr'] },
  async ({ page }) => {
    // Log in and open Chats -> SMS Chat (every UI test starts logged out)
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(process.env.LOGIN_EMAIL, process.env.LOGIN_PASSWORD);
    await expect(page).toHaveURL(/lmdmax\.com\/schedule/, { timeout: 30000 });

    const smsChatPage = new SmsChatPage(page);
    await smsChatPage.open();
    await expect(smsChatPage.recentChatsTitle).toBeVisible();

    await smsChatPage.searchInput.fill('zzzznotadriver');

    await expect(smsChatPage.noChatsFound).toBeVisible();
    await expect(smsChatPage.chat(DRIVER_NAME)).toHaveCount(0);
  },
);

test(
  'TC-05: Verify that Filters opens with Reset and Apply Filters',
  { tag: ['@regression'] },
  async ({ page }) => {
    // Log in and open Chats -> SMS Chat (every UI test starts logged out)
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(process.env.LOGIN_EMAIL, process.env.LOGIN_PASSWORD);
    await expect(page).toHaveURL(/lmdmax\.com\/schedule/, { timeout: 30000 });

    const smsChatPage = new SmsChatPage(page);
    await smsChatPage.open();
    await expect(smsChatPage.recentChatsTitle).toBeVisible();

    await smsChatPage.filtersButton.click();

    await expect(smsChatPage.resetButton).toBeVisible();
    await expect(smsChatPage.applyFiltersButton).toBeVisible();
    // Closed without applying
    await page.keyboard.press('Escape');
  },
);

test(
  'TC-06: Verify that Broadcast Message opens with no driver selected',
  { tag: ['@regression'] },
  async ({ page }) => {
    // Log in and open Chats -> SMS Chat (every UI test starts logged out)
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(process.env.LOGIN_EMAIL, process.env.LOGIN_PASSWORD);
    await expect(page).toHaveURL(/lmdmax\.com\/schedule/, { timeout: 30000 });

    const smsChatPage = new SmsChatPage(page);
    await smsChatPage.open();
    await expect(smsChatPage.recentChatsTitle).toBeVisible();

    await smsChatPage.broadcastButton.click();

    await expect(page.getByText('Broadcast message').first()).toBeVisible();
    await expect(page.getByText('00 Driver selected')).toBeVisible();
    await expect(smsChatPage.selectAllButton).toBeVisible();
    await expect(smsChatPage.removeAllButton).toBeVisible();
    // Closed without selecting or sending
    await page.keyboard.press('Escape');
  },
);

test(
  'TC-07: Verify that Start New Group opens with only the logged-in user selected and Create Group disabled',
  { tag: ['@regression'] },
  async ({ page }) => {
    // Log in and open Chats -> SMS Chat (every UI test starts logged out)
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(process.env.LOGIN_EMAIL, process.env.LOGIN_PASSWORD);
    await expect(page).toHaveURL(/lmdmax\.com\/schedule/, { timeout: 30000 });

    const smsChatPage = new SmsChatPage(page);
    await smsChatPage.open();
    await expect(smsChatPage.recentChatsTitle).toBeVisible();

    await smsChatPage.newGroupButton.click();

    await expect(page.getByText('01 selected')).toBeVisible();
    await expect(
      page.getByRole('button', { name: /^managers \(\d+\)$/ }),
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: /^drivers \(\d+\)$/ }),
    ).toBeVisible();
    await expect(smsChatPage.createGroupButton).toBeDisabled();
    // Closed without selecting or creating
    await page.keyboard.press('Escape');
  },
);
