// Settings -> Dashboard -> Default Landing Page: the schedule view that opens after login
class ViewPreferencesPage {
  constructor(page) {
    this.page = page;
    // last(): the left menu has a link with the same name
    this.title = page.getByText('Default Landing Page', { exact: true }).last();
    this.description = page.getByText(
      'You are free to customize your landing page according to your preferences.',
    );
    this.views = page.getByRole('radio');
    this.allScheduleView = page.getByRole('radio', {
      name: 'All Schedule View',
    });
    this.employeeView = page.getByRole('radio', { name: 'Employee View' });
    this.saveButton = page.getByRole('button', { name: 'Save' });
  }

  async open() {
    await this.page.goto('/schedule/settings/view-preferences');
  }
}

module.exports = ViewPreferencesPage;
