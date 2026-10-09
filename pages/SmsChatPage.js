// Chats -> SMS Chat: SMS conversations with the drivers (the messages go to real phones)
class SmsChatPage {
  constructor(page) {
    this.page = page;
    this.chatsMenu = page.getByRole('button', { name: 'Chats' });
    this.searchInput = page.getByRole('textbox', { name: 'Search' });
    this.broadcastButton = page.getByRole('button', {
      name: 'Broadcast Message',
    });
    this.filtersButton = page.getByRole('button', { name: 'Filters' });
    this.newGroupButton = page.getByRole('button', { name: 'Start New Group' });
    this.recentChatsTitle = page.getByText('Recent Chats');
    this.noChatsFound = page.getByText('No chats found');
    // Shown on the right while no conversation is open
    this.selectChatText = page.getByText('Your messages will appear here');
    // The Filters panel
    this.resetButton = page.getByRole('button', { name: 'Reset' });
    this.applyFiltersButton = page.getByRole('button', {
      name: 'Apply Filters',
    });
    // The Broadcast message and New Group panels
    this.selectAllButton = page.getByRole('button', { name: 'Select all' });
    this.removeAllButton = page.getByRole('button', { name: 'Remove all' });
    this.createGroupButton = page.getByRole('button', { name: 'Create Group' });
  }

  async open() {
    await this.page.goto('/chat');
  }

  chat(name) {
    return this.page.getByText(name, { exact: true });
  }
}

module.exports = SmsChatPage;
