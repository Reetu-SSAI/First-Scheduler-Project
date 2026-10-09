// The Schedule screen: drivers on the left, days (or hours) across the top, and the shift counts
class SchedulePage {
  constructor(page) {
    this.page = page;
    this.viewSelect = page.getByRole('button', { name: 'Employee View' });
    this.dailyButton = page.getByRole('button', { name: 'Daily', exact: true });
    this.weeklyButton = page.getByRole('button', {
      name: 'Weekly',
      exact: true,
    });
    this.biweeklyButton = page.getByRole('button', {
      name: 'Biweekly',
      exact: true,
    });
    this.previousWeekButton = page.getByRole('button', { name: 'week-prev' });
    this.nextWeekButton = page.getByRole('button', { name: 'week-next' });
    // The week shown, e.g. "W:41 Oct 04 - Oct 10" (Biweekly: "W:41/42 ...")
    this.weekLabel = page.getByRole('button', { name: /^W:\d+/ });
    // Day columns, e.g. "Sun", "Mon" (none in Daily, which shows hours)
    this.dayHeaders = page.getByText(/^(Sun|Mon|Tue|Wed|Thu|Fri|Sat)$/);
    this.openShiftsRow = page.getByRole('button', {
      name: 'O/S Open / Empty Shifts',
    });
    this.searchInput = page.getByRole('textbox', { name: 'Search' });
    this.addDriverButton = page.getByRole('button', { name: '+ Add Driver' });
    this.filterButton = page.getByRole('button', { name: 'Filter' });
    // first(): the Sort button has a Sort button inside
    this.sortButton = page.getByRole('button', { name: 'Sort' }).first();
    this.otherOptionsButton = page.getByRole('button', {
      name: /Other Options/,
    });
    // The station menu at the top right, e.g. "PSD"
    this.stationButton = page.getByRole('button', { name: 'PSD' });
    // The "Add Driver" window
    this.addDriverWindow = page.getByRole('dialog');
    this.driverNameInput = page.getByRole('textbox', { name: 'Driver name' });
    this.driverEmailInput = page.getByRole('textbox', {
      name: 'Email address',
    });
    this.driverPhoneInput = page.getByRole('spinbutton', {
      name: 'Phone number',
    });
    this.transporterIdInput = page.getByRole('textbox', {
      name: 'Transporter ID',
    });
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
  }

  async open() {
    await this.page.goto('/schedule');
  }

  // A count in the bar under the toolbar, e.g. "Published".
  // first(): the day columns repeat the same names
  countLabel(name) {
    return this.page.getByText(name, { exact: true }).first();
  }

  driver(name) {
    return this.page.getByText(name, { exact: true });
  }

  // The day button shown in Daily, e.g. "Fri, October 09, 2026"
  dayButton(date) {
    const label = date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'long',
      day: '2-digit',
      year: 'numeric',
    });
    return this.page.getByRole('button', { name: label });
  }

  viewOption(name) {
    return this.page.getByText(name, { exact: true });
  }
}

module.exports = SchedulePage;
