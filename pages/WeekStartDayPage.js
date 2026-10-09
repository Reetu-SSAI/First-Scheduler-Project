// Settings -> Dashboard -> Week Start Day: the first day of the schedule week
class WeekStartDayPage {
  constructor(page) {
    this.page = page;
    // last(): the left menu has a link with the same name
    this.title = page.getByText('Week Start Day', { exact: true }).last();
    this.description = page.getByText(
      'This establishes the starting day of the schedule and also defines the default week period',
    );
    this.days = page.getByRole('radio');
    this.saveButton = page.getByRole('button', { name: 'Save' });
  }

  async open() {
    await this.page.goto('/schedule/settings/week-start-day');
  }

  day(name) {
    return this.page.getByRole('radio', { name, exact: true });
  }
}

module.exports = WeekStartDayPage;
