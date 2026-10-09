// Runs once before all tests: clears old Allure results, logs in and selects the test station
const fs = require('fs');
const path = require('path');
const { request } = require('@playwright/test');
const endpoints = require('./api/endpoints');

module.exports = async () => {
  fs.rmSync(path.join(__dirname, 'allure-results'), {
    recursive: true,
    force: true,
  });

  const api = await request.newContext({
    baseURL: process.env.API_BASE_URL,
    extraHTTPHeaders: { 'app-type': '8', Origin: process.env.UI_BASE_URL },
  });

  // One login for the whole run
  const loginResponse = await api.post(endpoints.login, {
    data: {
      email: process.env.LOGIN_EMAIL,
      password: process.env.LOGIN_PASSWORD,
    },
  });
  if (loginResponse.status() !== 200) {
    throw new Error(
      'Login failed with status ' +
        loginResponse.status() +
        '. Check LOGIN_EMAIL and LOGIN_PASSWORD (429 = too many logins: wait 10 minutes).',
    );
  }
  const login = await loginResponse.json();

  // A login opens the station the account used last, so select the station the tests are written for
  const stationResponse = await api.get(
    endpoints.selectStation + process.env.TEST_STATION_ID,
    {
      headers: {
        'x-access-token': login.data.token,
        'x-access-user': login.data.account_id,
      },
    },
  );
  if (stationResponse.status() !== 200) {
    throw new Error(
      'Could not select station ' +
        process.env.TEST_STATION_ID +
        ' (status ' +
        stationResponse.status() +
        '). Check TEST_STATION_ID.',
    );
  }
  const station = await stationResponse.json();
  await api.dispose();

  // Every test gets this login from loginAsTestUser() in api/auth.js
  process.env.TEST_USER_TOKEN = station.data.token;
  process.env.TEST_USER_ACCOUNT_ID = station.data.account_id;
};
