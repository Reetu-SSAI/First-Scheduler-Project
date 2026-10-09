// Time Off Request -> VTO Management: voluntary time off (VTO) offered to drivers
class VtoManagementPage {
  constructor(page) {
    this.page = page;
    this.searchInput = page.getByRole('textbox', { name: 'Search' });
    this.weekButton = page.getByRole('button', { name: 'This Week' });
    this.addVtoButton = page.getByRole('button', { name: '+ Add New VTO' });
    // Shown while there is no VTO
    this.noVtoTitle = page.getByRole('heading', {
      name: 'Add VTO to proceed!',
    });
    // The "Add VTO" window
    this.addWindow = page.getByRole('dialog');
    this.nextButton = page.getByRole('button', { name: 'Next' });
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
  }

  async open() {
    await this.page.goto('/time-off-request/vto-dashboard');
  }
}

module.exports = VtoManagementPage;
