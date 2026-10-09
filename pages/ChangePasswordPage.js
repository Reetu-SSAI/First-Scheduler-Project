// Settings -> Change Password. "Save" is never clicked by the tests (it would change the test user's password).
class ChangePasswordPage {
  constructor(page) {
    this.page = page;
    this.logoutNotice = page.getByText(
      'You will be logged out after updating your password.',
    );
    // The old password is checked by the server while typing; the new boxes open only when it is right
    this.oldPasswordInput = page.getByPlaceholder('Old Password');
    this.newPasswordInput = page.getByPlaceholder('New Password', {
      exact: true,
    });
    this.confirmPasswordInput = page.getByPlaceholder('Confirm New Password');
    this.wrongOldPasswordMessage = page.getByText('Password is incorrect!');
    this.saveButton = page.getByRole('button', { name: 'Save' });
  }

  async open() {
    await this.page.goto('/schedule/settings/change-password');
  }

  // The tick box of one password rule, e.g. rule('Minimum 8 Characters')
  rule(ruleText) {
    return this.page
      .getByText(ruleText, { exact: true })
      .locator('..')
      .getByRole('checkbox');
  }
}

module.exports = ChangePasswordPage;
