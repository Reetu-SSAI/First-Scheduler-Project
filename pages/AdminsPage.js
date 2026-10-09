// Settings -> Admins: the admin list, the search, and the "Add Admin" window
class AdminsPage {
  constructor(page) {
    this.page = page;
    this.title = page.getByText('Admins', { exact: true }).last();
    // The number next to the title, e.g. "(31)"
    this.count = page.getByText(/^\(\d+\)$/);
    this.searchBox = page.getByRole('textbox', { name: 'Search' });
    this.addAdminButton = page.getByRole('button', { name: '+ Add Admin' });
    // Every admin is one row with id "admin-<user id>"
    this.rows = page.locator('[id^="admin-"]');
    this.noAdminFound = page.getByText('No Admin Found');

    // The "Add Admin" window. Its boxes have no label linked to them, so they are found by their order.
    this.addWindow = page.getByRole('dialog');
    this.nameInput = this.addWindow.getByRole('textbox').nth(0);
    this.emailInput = this.addWindow.getByRole('textbox').nth(1);
    this.phoneInput = this.addWindow.getByRole('spinbutton');
    this.stationSelect = this.addWindow.getByRole('combobox');
    this.passwordInput = this.addWindow.getByRole('textbox').nth(2);
    this.confirmPasswordInput = this.addWindow.getByRole('textbox').nth(3);
    this.saveButton = this.addWindow.getByRole('button', {
      name: 'Add Admin',
    });
    this.cancelButton = this.addWindow.getByRole('button', { name: 'Cancel' });
  }

  async open() {
    await this.page.goto('/schedule/settings/admins');
  }

  // Fills the "Add Admin" window (station stays PSD) and clicks "Add Admin"
  async addAdmin(admin) {
    await this.addAdminButton.click();
    await this.nameInput.fill(admin.name);
    await this.emailInput.fill(admin.email);
    await this.phoneInput.fill(admin.phone);
    await this.passwordInput.fill(admin.password);
    await this.confirmPasswordInput.fill(admin.password);
    await this.saveButton.click();
  }

  async search(text) {
    await this.searchBox.fill(text);
  }

  // The row of one admin (name, email, phone, station code and the 3 action buttons)
  row(adminName) {
    return this.rows.filter({ hasText: adminName }).first();
  }

  // The name in a row (the first text of the row)
  nameOf(row) {
    return row.locator('p').first();
  }
}

module.exports = AdminsPage;
