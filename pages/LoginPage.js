// The login screen: where its elements are, and what a user can do on it
class LoginPage {
  constructor(page) {
    this.page = page;
    this.emailInput = page.getByPlaceholder('Email');
    this.passwordInput = page.getByPlaceholder('Password');
    // exact: true, because "Sign in with Google" and "Sign in with Apple" are buttons too
    this.signInButton = page.getByRole('button', {
      name: 'Login',
      exact: true,
    });
    // The message shown after a refused login, e.g. "Invalid Credentials"
    this.errorMessage = page.getByRole('alert');
  }

  async open() {
    await this.page.goto('/');
  }

  async login(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
  }
}

module.exports = LoginPage;
