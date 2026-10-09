// Settings -> Message Channel Configuration: SMS Chat or In-App Chat. The switches save at once, so tests do not click them.
class MessageChannelPage {
  constructor(page) {
    this.page = page;
    // last(): the left menu has a link with the same name
    this.title = page
      .getByText('Message Channel Configuration', { exact: true })
      .last();
    this.description = page.getByText(
      'Choose message channel for reminders/messages',
    );
    this.smsChat = page.getByText('SMS Chat', { exact: true });
    this.inAppChat = page.getByText('In-App Chat', { exact: true });
    this.switches = page.getByRole('checkbox');
  }

  async open() {
    await this.page.goto('/schedule/settings/message-channel');
  }
}

module.exports = MessageChannelPage;
