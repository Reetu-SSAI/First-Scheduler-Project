// Settings -> In-app Driver Communication: chat and calling options. The switches save at once, so tests do not click them.
class InAppDriverCommunicationPage {
  constructor(page) {
    this.page = page;
    // last(): the left menu has a link with the same name
    this.title = page
      .getByText('In-app Driver Communication', { exact: true })
      .last();
    this.options = [
      'Allow In app Chat',
      'Individual Messaging',
      'Allow drivers to view and message other drivers within the app',
      'Select the platform you prefer to get the call on',
      'Choose your preferred LMD app for receiving calls',
    ];
    // The 3 apps that can receive calls
    this.apps = ['Performance', 'RTS Checkout', 'LMD Scheduler'];
    this.appChoices = page.getByRole('radio');
  }

  async open() {
    await this.page.goto('/schedule/settings/inapp-driver-communication');
  }
}

module.exports = InAppDriverCommunicationPage;
