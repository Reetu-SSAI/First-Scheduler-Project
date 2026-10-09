// Settings -> Reminders: birthday and work anniversary messages. The switches save at once, so tests do not click them.
class RemindersPage {
  constructor(page) {
    this.page = page;
    this.title = page.getByText('Reminder', { exact: true });
    this.description = page.getByText(
      'Set up automatic reminders to send messages on birthdays and work anniversaries.',
    );
    this.timeZoneSelect = page.getByRole('combobox');
    this.birthdayText = page.getByText('Send Automatic Birthday Message');
    this.anniversaryText = page.getByText(
      'Send Automatic Work Anniversary Message',
    );
    // The 2 switches (they have no label linked to them, so they are found by their role)
    this.switches = page.getByRole('checkbox');
  }

  async open() {
    await this.page.goto('/schedule/settings/reminders');
  }
}

module.exports = RemindersPage;
