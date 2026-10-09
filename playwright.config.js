const { defineConfig, devices } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

// Settings come from .env.staging (or .env.<TEST_ENV>). On CI they come from GitHub secrets.
const envName = process.env.TEST_ENV || 'staging';
const envFile = path.join(__dirname, '.env.' + envName);
if (fs.existsSync(envFile)) {
  process.loadEnvFile(envFile);
}
if (!process.env.LOGIN_EMAIL) {
  throw new Error(
    'LOGIN_EMAIL not set. Create .env.' + envName + ' from .env.example',
  );
}

module.exports = defineConfig({
  globalSetup: './global-setup.js', // before the run: clears old Allure results, logs in once, selects the station
  fullyParallel: true, // run tests at the same time, also the tests inside one file
  retries: process.env.CI ? 1 : 0, // on CI, run a failed test one more time
  workers: process.env.CI ? 1 : undefined, // on CI, one test at a time: staging gets too slow with more
  reporter: [
    ['list'], // progress in the terminal
    ['html', { open: 'never' }], // Playwright report -> npm run report
    ['allure-playwright', { resultsDir: 'allure-results' }], // Allure report -> npm run allure
  ],
  use: {
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure', // step-by-step replay of a failed test (keep the repo private)
  },

  projects: [
    {
      name: 'api',
      testDir: './tests/api',
      use: {
        baseURL: process.env.API_BASE_URL, // the paths in api/endpoints.js are added to this
        // Sent with every API request, like the web app does (app-type 8 = Scheduler)
        extraHTTPHeaders: {
          'app-type': '8',
          'client-time-zone': 'Asia/Calcutta',
          Origin: process.env.UI_BASE_URL,
        },
      },
    },
    {
      name: 'ui',
      testDir: './tests/ui',
      // UI journeys go through several screens (login, wizard, a second window). With the browser visible
      // and many tests at the same time, the screens are slower: 90 s per test, 15 s per check.
      timeout: 90 * 1000,
      expect: { timeout: 15 * 1000 },
      use: {
        ...devices['Desktop Chrome'], // a normal desktop Chrome window
        baseURL: process.env.UI_BASE_URL, // page.goto('/') opens this address
      },
    },
  ],
});
