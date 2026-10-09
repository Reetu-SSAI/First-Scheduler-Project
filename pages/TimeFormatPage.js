// Settings -> Dashboard -> Time Format: show times in 12 or 24 hour format
class TimeFormatPage {
  constructor(page) {
    this.page = page;
    // last(): the left menu has a link with the same name
    this.title = page.getByText('Time Format', { exact: true }).last();
    this.description = page.getByText(
      'Select Your Preferred Time Format (12/24 Hour) to Reflect on the Dashboard',
    );
    this.formats = page.getByRole('radio');
    this.format12 = page.getByRole('radio', { name: '12 hour format' });
    this.format24 = page.getByRole('radio', { name: '24 hour format' });
    this.saveButton = page.getByRole('button', { name: 'Save' });
  }

  async open() {
    await this.page.goto('/schedule/settings/time-format');
  }
}

module.exports = TimeFormatPage;
