const { test, expect } = require('@playwright/test');
const LoginPage = require('../../pages/LoginPage');
const InAppChatPage = require('../../pages/InAppChatPage');

// Chats -> In-App Chat screen. Read only: no conversation is opened (it could mark messages as read), and
// Create Groups and Broadcasts is not clicked (see docs/notes.md).

test(
  'TC-01: Verify that In-App Chat shows PSD Chat, Individual Chat, search and the 8 tabs',
  { tag: ['@smoke', '@regression', '@pr'] },
  async ({ page }) => {
    // Log in and open Chats -> In-App Chat (every UI test starts logged out)
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(process.env.LOGIN_EMAIL, process.env.LOGIN_PASSWORD);
    await expect(page).toHaveURL(/lmdmax\.com\/schedule/, { timeout: 30000 });

    const inAppChatPage = new InAppChatPage(page);
    await inAppChatPage.open();
    await expect(inAppChatPage.tab('All')).toBeVisible();

    await expect(inAppChatPage.stationChatButton).toBeVisible();
    await expect(inAppChatPage.individualChatButton).toBeVisible();
    await expect(inAppChatPage.searchInput).toBeVisible();
    await expect(inAppChatPage.createGroupButton).toBeVisible();
    for (const name of [
      'Active',
      'Inactive',
      'Broadcasts',
      'Groups',
      'Unread',
      'Last Driver Message',
      'Suspended',
    ]) {
      await expect(inAppChatPage.tab(name)).toBeVisible();
    }
    await expect(inAppChatPage.selectChatText).toBeVisible();
  },
);

test(
  'TC-02: Verify that a tab with (0) chats shows "No chats found"',
  { tag: ['@regression'] },
  async ({ page }) => {
    // Log in and open Chats -> In-App Chat (every UI test starts logged out)
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(process.env.LOGIN_EMAIL, process.env.LOGIN_PASSWORD);
    await expect(page).toHaveURL(/lmdmax\.com\/schedule/, { timeout: 30000 });

    const inAppChatPage = new InAppChatPage(page);
    await inAppChatPage.open();
    await expect(inAppChatPage.tab('All')).toBeVisible();

    // Station PSD has no inactive chats
    await expect(inAppChatPage.tab('Inactive')).toHaveText('Inactive (0)');
    await inAppChatPage.tab('Inactive').click();

    await expect(inAppChatPage.noChatsFound).toBeVisible();
  },
);

test(
  'TC-03: Verify that search by driver name shows only that chat',
  { tag: ['@regression', '@pr'] },
  async ({ page }) => {
    // Log in and open Chats -> In-App Chat (every UI test starts logged out)
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(process.env.LOGIN_EMAIL, process.env.LOGIN_PASSWORD);
    await expect(page).toHaveURL(/lmdmax\.com\/schedule/, { timeout: 30000 });

    const inAppChatPage = new InAppChatPage(page);
    await inAppChatPage.open();
    await expect(inAppChatPage.tab('All')).toBeVisible();

    // A driver of station PSD with an in-app chat
    await inAppChatPage.searchInput.fill('Bella Ford');

    await expect(inAppChatPage.chat('Bella Ford')).toBeVisible();
    await expect(inAppChatPage.chat('Alvin Adkins')).toHaveCount(0);
  },
);

test(
  'TC-04: Verify that Individual Chat shows the tabs for each type of person',
  { tag: ['@regression'] },
  async ({ page }) => {
    // Log in and open Chats -> In-App Chat (every UI test starts logged out)
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(process.env.LOGIN_EMAIL, process.env.LOGIN_PASSWORD);
    await expect(page).toHaveURL(/lmdmax\.com\/schedule/, { timeout: 30000 });

    const inAppChatPage = new InAppChatPage(page);
    await inAppChatPage.open();
    await expect(inAppChatPage.tab('All')).toBeVisible();

    await inAppChatPage.individualChatButton.click();

    for (const name of [
      'All',
      'Drivers',
      'Groups',
      'Broadcasts',
      'Managers',
      'Technicians',
      'Vendors',
      'CSRs',
      'Unread',
    ]) {
      await expect(inAppChatPage.tab(name)).toBeVisible();
    }
  },
);

test(
  'TC-05: Verify that Create Groups and Broadcasts offers Create Group and Create Broadcast',
  { tag: ['@regression'] },
  async ({ page }) => {
    // Log in and open Chats -> In-App Chat (every UI test starts logged out)
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(process.env.LOGIN_EMAIL, process.env.LOGIN_PASSWORD);
    await expect(page).toHaveURL(/lmdmax\.com\/schedule/, { timeout: 30000 });

    const inAppChatPage = new InAppChatPage(page);
    await inAppChatPage.open();
    await expect(inAppChatPage.tab('All')).toBeVisible();

    await inAppChatPage.createGroupButton.click();

    await expect(page.getByRole('menuitem')).toHaveText([
      'Create Group',
      'Create Broadcast',
    ]);
    // Closed without choosing
    await page.keyboard.press('Escape');
  },
);
