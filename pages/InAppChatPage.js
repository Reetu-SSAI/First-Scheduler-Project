// Chats -> In-App Chat: conversations in the LMD Drive app, for the station (PSD Chat) or per person (Individual Chat)
class InAppChatPage {
  constructor(page) {
    this.page = page;
    this.stationChatButton = page.getByRole('button', { name: 'PSD Chat' });
    this.individualChatButton = page.getByRole('button', {
      name: 'Individual Chat',
    });
    this.searchInput = page.getByRole('textbox', { name: 'Search' });
    this.createGroupButton = page.getByRole('button', {
      name: 'Create Groups and Broadcasts',
    });
    this.noChatsFound = page.getByText('No chats found');
    // Shown on the right while no conversation is open
    this.selectChatText = page.getByText('Your messages will appear here');
  }

  async open() {
    await this.page.goto('/inapp-chat');
  }

  // A tab above the list with its number of chats, e.g. "Active (11)"
  tab(name) {
    return this.page.getByText(new RegExp('^' + name + ' \\(\\d+\\)$'));
  }

  chat(name) {
    return this.page.getByText(name, { exact: true });
  }
}

module.exports = InAppChatPage;
