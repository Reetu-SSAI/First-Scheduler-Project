// Settings -> Driver -> Set Time Off Threshold: how many days ahead a driver can ask for time off (1-366)
class TimeOffThresholdPage {
  constructor(page) {
    this.page = page;
    // last(): the left menu has a link with the same name
    this.title = page
      .getByText('Set Time Off Threshold', { exact: true })
      .last();
    this.description = page.getByText(
      'Set Time Off Threshold between 1-366 days',
    );
    this.optionText = page.getByText('Time Off Threshold', { exact: true });
    this.switch = page.getByRole('checkbox');
    this.saveButton = page.getByRole('button', { name: 'Save' });
  }

  async open() {
    await this.page.goto('/schedule/settings/timeoff-threshold');
  }
}

module.exports = TimeOffThresholdPage;
