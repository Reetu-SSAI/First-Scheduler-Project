// Settings -> Preferences -> Role Creation & Assignment: the role types drivers can have
class RoleManagementPage {
  constructor(page) {
    this.page = page;
    // last(): the left menu has a link with the same name
    this.title = page
      .getByText('Role Creation & Assignment', { exact: true })
      .last();
    this.description = page.getByText(
      'Add, Edit and Assign Role types as per your preferences',
    );
    this.createRoleButton = page.getByRole('button', { name: '+ Create Role' });
    this.existingRolesTitle = page.getByText('Existing Role Types');
    // Every role shows its number of drivers, e.g. "(217 Drivers)"
    this.driverCounts = page.getByText(/^\d+ Drivers$/);
    // The "Create Role" window
    this.createWindow = page.getByRole('dialog');
    this.roleNameInput = page.getByRole('textbox', { name: 'Role name' });
    this.addMoreButton = page.getByRole('button', { name: '+ Add More' });
    this.saveButton = page.getByRole('button', { name: 'Save' });
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
  }

  async open() {
    await this.page.goto('/schedule/settings/role-management');
  }
}

module.exports = RoleManagementPage;
