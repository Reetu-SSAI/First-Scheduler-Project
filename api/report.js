const { test } = require('@playwright/test');

// Fields that are hidden in the report: secrets and personal data
const hiddenFields = [
  'token',
  'device_session',
  'password',
  'email',
  'phone',
  'address',
  'date_of_birth',
];

// Returns a copy of the data with every hidden field replaced by "*** hidden ***"
function hideFields(data) {
  if (Array.isArray(data)) {
    return data.map(hideFields);
  }
  if (data && typeof data === 'object') {
    const copy = {};
    for (const key of Object.keys(data)) {
      copy[key] = hiddenFields.includes(key)
        ? '*** hidden ***'
        : hideFields(data[key]);
    }
    return copy;
  }
  return data;
}

// Adds the API call (address, status and answer) to the Playwright and Allure reports
async function addToReport(response) {
  let answer = await response.text();
  try {
    answer = JSON.stringify(hideFields(JSON.parse(answer)), null, 2);
  } catch {
    // The answer is not JSON: keep the text as it is
  }
  await test.info().attach('API call', {
    body:
      'Address: ' +
      response.url() +
      '\nStatus: ' +
      response.status() +
      '\n\nAnswer:\n' +
      answer,
    contentType: 'text/plain',
  });
}

module.exports = addToReport;
