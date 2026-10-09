// Settings -> Preferences -> Manage Driver Performance Metrics: the 5 metrics shown while assigning shifts
class ManageScorecardPage {
  constructor(page) {
    this.page = page;
    this.title = page.getByText('Managing Performance', { exact: true });
    this.description = page.getByText(
      'Select any five options which will be displayed while shift assignment',
    );
    // The checkboxes have no linked label, so they can only be counted (see docs/notes.md, 2)
    this.metrics = page.getByRole('checkbox');
    this.saveButton = page.getByRole('button', { name: 'Save' });
  }

  async open() {
    await this.page.goto('/schedule/settings/manage-scorecard');
  }

  // The name shown next to a metric's checkbox
  metricName(name) {
    return this.page.getByText(name, { exact: true });
  }
}

module.exports = ManageScorecardPage;
