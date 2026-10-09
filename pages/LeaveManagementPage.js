// Time Off Request -> Leave Management: the drivers' time off requests, by status
class LeaveManagementPage {
  constructor(page) {
    this.page = page;
    this.addTimeOffButton = page.getByRole('button', {
      name: '+ Time Off Request',
    });
    this.selectDateButton = page.getByRole('button', { name: 'Select Date' });
    this.sortButton = page.getByRole('button', {
      name: /^Applied Date|^Leave Date/,
    });
    this.searchInput = page.getByRole('textbox', { name: 'Search' });
    // The "Time Off Request" window
    this.requestWindow = page.getByRole('dialog');
    this.applyButton = page.getByRole('button', { name: 'Apply' });
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
    // The calendar of Select Date: the day that is selected
    this.selectedDay = page.getByRole('gridcell', { selected: true });
    // Every request in the Approved list has this button
    this.moveToDeclinedButtons = page.getByText('Move To Declined', {
      exact: true,
    });
  }

  async open() {
    await this.page.goto('/time-off-request/leave-management');
  }

  // A status card at the top, e.g. "Approved" with its number.
  // first(): the list below the cards has the same title
  card(name) {
    return this.page.getByText(name, { exact: true }).first();
  }

  cardCount(name) {
    return this.card(name).locator('..').getByText(/^\d+$/);
  }

  // e.g. "No Pending Leaves"
  emptyMessage(name) {
    return this.page.getByText('No ' + name + ' Leaves', { exact: true });
  }
}

module.exports = LeaveManagementPage;
