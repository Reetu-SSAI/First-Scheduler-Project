const { test } = require('@playwright/test');

// Gives a test the login of the test user (token and account_id)
async function loginAsTestUser() {
  // Shown as one step "Log in as the test user" in the reports
  return test.step('Log in as the test user', async () => {
    // global-setup.js logged in once for the whole run: every test reuses that login
    return {
      token: process.env.TEST_USER_TOKEN,
      account_id: process.env.TEST_USER_ACCOUNT_ID,
    };
  });
}

module.exports = loginAsTestUser;
