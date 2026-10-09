// Settings -> Driver -> Driver Performance Rating: show drivers a rating based on their performance.
// There is no Save button: the switch saves at once, so tests do not click it.
class DriverRatingPage {
  constructor(page) {
    this.page = page;
    // last(): the left menu has a link with the same name
    this.title = page
      .getByText('Driver Performance Rating', { exact: true })
      .last();
    this.question = page.getByText(
      'Would you like to display the performance rating for driver?',
    );
    this.optionText = page.getByText('Allow driver rating as per performance');
    this.switch = page.getByRole('checkbox');
    this.saveButton = page.getByRole('button', { name: 'Save' });
  }

  async open() {
    await this.page.goto('/schedule/settings/driver-rating');
  }
}

module.exports = DriverRatingPage;
