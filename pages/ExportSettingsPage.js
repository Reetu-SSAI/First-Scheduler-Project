// Settings -> Preferences -> Export Settings: which fields are in the downloaded CSV and Excel files
class ExportSettingsPage {
  constructor(page) {
    this.page = page;
    // last(): the left menu has a link with the same name
    this.title = page.getByText('Export Settings', { exact: true }).last();
    this.description = page.getByText(
      'Select the specific fields you want in your downloaded file.',
    );
    this.csvTitle = page.getByText('CSV', { exact: true });
    this.excelTitle = page.getByText('Excel', { exact: true });
    this.selectAllText = page.getByText('Select All', { exact: true });
    // The checkboxes have no linked label, so they can only be counted (see docs/notes.md, 2)
    this.checkboxes = page.getByRole('checkbox');
    this.saveButton = page.getByRole('button', { name: 'Save' });
  }

  async open() {
    await this.page.goto('/schedule/settings/export-settings');
  }
}

module.exports = ExportSettingsPage;
