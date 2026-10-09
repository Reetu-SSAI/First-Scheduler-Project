// Schedule -> Other Options -> Import Amazon Weekly Roster: bulk upload of the Amazon weekly roster (Excel)
class RosterUploadPage {
  constructor(page) {
    this.page = page;
    // The week the roster is imported into, e.g. "W:41 Oct 04 - Oct 10"
    this.weekLabel = page.getByRole('button', { name: /^W:\d+/ });
    this.previousWeekButton = page.getByRole('button', { name: 'week-prev' });
    this.nextWeekButton = page.getByRole('button', { name: 'week-next' });
    this.dropZoneText = page.getByText('Drag file to upload');
    this.chooseFileButton = page.getByRole('button', { name: 'Choose File' });
    // The hidden file box behind "Choose File"
    this.fileInput = page.locator('input[type="file"]');
    this.stepsTitle = page.getByText('Steps to Import Rostering Report');
    // "Step 1:" ... "Step 11:"
    this.stepLabels = page.getByText(/^Step\s+\d+:/);
  }

  async open() {
    await this.page.goto('/schedule/roster-upload');
  }
}

module.exports = RosterUploadPage;
