// Settings -> User/Company Details: the "User Details" and "Company Details" tabs, and Edit
class UserCompanyDetailsPage {
  constructor(page) {
    this.page = page;
    this.userTab = page.getByText('User Details', { exact: true });
    this.companyTab = page.getByText('Company Details', { exact: true });
    this.notice = page.getByText(
      'The User Details and Company Details are common and not according to the station selected.',
    );
    this.editButton = page.getByRole('button', { name: 'Edit', exact: true });
    this.saveButton = page.getByRole('button', { name: 'Save', exact: true });
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
    this.addStationButton = page.getByRole('button', {
      name: '+ Add Station',
    });
  }

  async open() {
    await this.page.goto('/schedule/settings/user-company-details');
  }

  // The value under a label, e.g. value('USERNAME') -> "psd"
  value(label) {
    return this.page
      .getByText(label, { exact: true })
      .locator('xpath=following-sibling::p[1]');
  }

  // The edit box under a label (after "Edit")
  input(label) {
    return this.page
      .getByText(label, { exact: true })
      .locator('xpath=following-sibling::*[1]')
      .getByRole('textbox');
  }

  // One station box on the Company Details tab, e.g. station('Station 1')
  station(stationName) {
    return this.page.getByText(stationName, { exact: true }).locator('../..');
  }
}

module.exports = UserCompanyDetailsPage;
