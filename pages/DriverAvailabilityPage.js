// Settings -> Driver -> Driver Availability: can drivers request a change in their availability
class DriverAvailabilityPage {
  constructor(page) {
    this.page = page;
    // last(): the left menu has a link with the same name
    this.title = page.getByText('Driver Availability', { exact: true }).last();
    this.description = page.getByText(
      'Decide whether the driver can request their own availability.',
    );
    this.optionText = page.getByText(
      'Allow driver to request a change in availability',
    );
    this.switch = page.getByRole('checkbox');
    this.saveButton = page.getByRole('button', { name: 'Save' });
  }

  async open() {
    await this.page.goto('/schedule/settings/driver-availability');
  }
}

module.exports = DriverAvailabilityPage;
