// Time Off Request -> Restricted Dates: dates on which drivers cannot ask for time off
class RestrictedDatesPage {
  constructor(page) {
    this.page = page;
    this.addButton = page.getByRole('button', {
      name: '+ Add Restricted Dates',
    });
    // The date under each name, e.g. "(Sep 17, 2026)"
    this.dates = page.getByText(/^\(\w{3} \d{2}, \d{4}\)$/);
    // The "Date Restriction" window
    this.addWindow = page.getByRole('dialog');
    this.titleInput = this.addWindow.getByRole('textbox');
    this.submitButton = page.getByRole('button', { name: 'Submit' });
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
  }

  async open() {
    await this.page.goto('/time-off-request/restricted-dates');
  }
}

module.exports = RestrictedDatesPage;
