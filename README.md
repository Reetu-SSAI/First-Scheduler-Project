# Scheduler Regression Suite

Automated tests for the LMDmax **Scheduler** web app (<https://staging.scheduler.lmdmax.com>) and its
API. They run on the **staging** environment. Same structure, tools and rules as the LMDmax
Regression Suite.

- **API tests** send requests straight to the server (like Postman or curl) and check the answers.
- **UI tests** open Chrome, use the web app like a person would, and check what is on the screen.

The tests use [Playwright](https://playwright.dev), a free testing tool, and are written in
JavaScript. You do not need to be a programmer: most new tests are made by copying an existing test
and changing a few values.

## Words used in this guide

| Word          | Meaning                                                                                                     |
| ------------- | ----------------------------------------------------------------------------------------------------------- |
| **API**       | The server the web app talks to. Each API has an address, e.g. `/lmd/usrsrv/users/v1/user/scheduler_login`. |
| **Test**      | A short script that does one thing (e.g. log in with a wrong password) and checks the result.               |
| **Assertion** | One check inside a test, written `expect(...)`. If it is not true, the test fails.                          |
| **Tag**       | A label on a test, e.g. `@smoke`. Used to run a group of tests.                                             |
| **Report**    | A web page that shows which tests passed or failed, and why.                                                |
| **CI**        | GitHub runs the tests by itself (on every pull request, every day, ...). See [CI](#ci).                     |
| **Known bug** | A bug we found that is not fixed yet. Its tests fail on purpose until it is fixed.                          |

## Setup (once)

1. Install [Node.js 22](https://nodejs.org) and [VS Code](https://code.visualstudio.com).
2. Open this folder in VS Code. Open a terminal (**Terminal → New Terminal**) and run:

   ```bash
   npm install                       # downloads the tools this project needs
   npx playwright install chromium   # downloads the browser for UI tests
   cp .env.example .env.staging      # creates your settings file
   ```

3. Open `.env.staging` and fill in `LOGIN_EMAIL` and `LOGIN_PASSWORD` (the test user, the owner of
   station PSD). Keep `TEST_STATION_ID=645`: the tests are written for the data of station PSD.
   This file holds a password, so git ignores it. Never share it.
4. When VS Code offers to install the recommended extensions (ESLint, Prettier, Playwright),
   click **Install**.
5. In VS Code, open the **Testing** view (the flask icon on the left). In its **Playwright** panel,
   check that **Run global setup on each run** is ticked. Then every run from VS Code starts with a
   fresh login, like in the terminal (see [Login once per run](#login-once-per-run)).

## Run the tests

| Command                   | What it runs                                                           |
| ------------------------- | ---------------------------------------------------------------------- |
| `npm test`                | All tests (API + UI), except `@adds-data`                              |
| `npm run test:api`        | API tests only, except `@adds-data`                                    |
| `npm run test:ui`         | UI tests only, except `@adds-data`                                     |
| `npm run test:headed`     | UI tests, with the browser visible on your screen, except `@adds-data` |
| `npm run test:smoke`      | Tests tagged `@smoke`                                                  |
| `npm run test:pr`         | Tests tagged `@pr`                                                     |
| `npm run test:regression` | Tests tagged `@regression` (every test)                                |
| `npm run test:knownbug`   | Tests tagged `@knownbug` (they fail on purpose)                        |

To run only part of the tests:

- One file: `npx playwright test tests/ui/schedule.spec.js`
- One test: `npx playwright test tests/ui/schedule.spec.js -g "TC-02"` (`-g` = "title contains")
- A test tagged `@adds-data`, on purpose (it adds data): name its file, e.g.
  `npx playwright test tests/ui/add-admin-journey.spec.js --headed`
- In VS Code: click the green ▶ next to a test (needs the Playwright extension).

> **Right now 2 tests fail on purpose.** They show open bugs (see [Known bugs](#known-bugs)). Any
> **other** failure is new and needs a look. Run `npm run test:knownbug` to see only these:
>
> - **schedule:** schedule TC-07 (BUG-UI-002). `npm test` runs it.
> - **admins:** add admin journey TC-02 (BUG-UI-001). It is also `@adds-data`, so `npm test` skips
>   it.

Tests run at the same time (in parallel), so a full run takes about 5 minutes. When staging is slow,
some screens are still empty after 15 seconds and a few tests fail: run again, or run fewer tests at
the same time with `npx playwright test --workers=2` (see [docs/notes.md](docs/notes.md)).

## Read the results

The terminal shows ✓ (passed) or ✘ (failed) for each test, then the error of each failed test:

```
✘ TC-07: Verify that the Biweekly label shows the dates of both weeks (BUG-UI-002) @regression @knownbug
    Expected substring: "Oct 04 - Oct 17"
    Received string:    "W:41/42 Oct 04 - Oct 10"
```

**Expected** is what the test wanted. **Received** is what the app really showed.

Every run also creates two reports (web pages):

| Report          | Open it with     | Good for                                            |
| --------------- | ---------------- | --------------------------------------------------- |
| Playwright HTML | `npm run report` | Each test with its steps and its error              |
| Allure          | `npm run allure` | An overview with charts, handy to share with others |

For a failed test, both reports also have a **screenshot** (UI tests) and a **trace**: a
step-by-step replay of the test. Open the trace and click through the steps to see what happened.
The report opens in your browser. Press `Ctrl+C` in the terminal when you are done with it.

Every API test also has an **API call** attachment (in Allure: open the test → **Test body** →
**API call**): the address with its parameters, the status and the answer. Tokens and personal
data (email, phone, address, date of birth) are shown as `*** hidden ***`.

## Folders

```
tests/api/            API tests, one folder per area (none yet: the Scheduler API is different from
                      the LMDmax API, see docs/notes.md)
tests/ui/             UI tests, one file per screen:
                      login                     Login
                      schedule                  Schedule
                      sms-chat, inapp-chat      Chats → SMS Chat, In-App Chat
                      leave-management, restricted-dates, vto-management
                                                Time Off Request → its 3 tabs
                      user-company-details, change-password, admins, add-admin-journey,
                      reminders, inapp-driver-communication, message-channel
                                                Settings → ACCOUNT
                      manage-scorecard, role-management, export-settings
                                                Settings → PREFERENCES
                      time-format, week-start-day, view-preferences
                                                Settings → DASHBOARD
                      driver-availability, timeoff-threshold, driver-rating
                                                Settings → DRIVER
api/endpoints.js      The address of every API, in one place
api/auth.js           loginAsTestUser(): gives a test the login (token and account_id)
api/schema.js         getSchemaErrors(): compares a response with its schema
api/report.js         addToReport(): adds an API call to the report, with secrets hidden
api/dates.js          daysAgo(): a day as the API expects it ("YYYY-MM-DD"), e.g. yesterday
schemas/              The expected shape of each API response (see "Schema tests")
pages/                One file per screen: its elements and actions (LoginPage.js, SchedulePage.js,
                      AdminsPage.js, ...)
test-files/           Files the tests upload (none yet)
docs/known-bugs/      Details of every known bug
docs/notes.md         What is not tested yet and why, open questions, test data added on staging
docs/postman/         The exported Postman collection of the Scheduler API (when it is shared)
.env.example          Template for your settings file
.env.staging          Your settings: addresses and test login (never commit or share it)
playwright.config.js  Playwright settings: where the tests are, browser, reports
global-setup.js       Before each run: deletes the old Allure results, logs in once, selects the station
.github/workflows/    CI settings (see "CI")

playwright-report/, allure-results/, test-results/   Made by each run (reports, screenshots,
                                                     traces). Git ignores them.
```

## How a test is written

This is a complete test from `tests/ui/login.spec.js`:

```js
test(
  'TC-02: Verify that wrong password keeps the user on the login page',
  { tag: ['@regression', '@pr'] },
  async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(process.env.LOGIN_EMAIL, 'WrongPassword@123');

    await expect(loginPage.errorMessage).toContainText('Invalid Credentials');
    await expect(loginPage.signInButton).toBeVisible();
    await expect(page).not.toHaveURL(/lmdmax\.com\/schedule/);
  },
);
```

A test has three parts:

1. **Title:** the test ID and what it checks.
2. **Tags:** the groups the test belongs to (see [Tags](#tags)).
3. **Steps:** everything inside `async ({ page }) => { ... }`. `page` is a browser tab. API tests
   get `request` instead: Playwright's tool for calling APIs.

The steps open the login page, log in with a wrong password, then check the screen.
`process.env.LOGIN_EMAIL` is the `LOGIN_EMAIL` value from your `.env.staging` file.
Each `expect(...)` line is one check. The first check that is not true stops the test and marks it
failed.

| Code                                                  | Meaning                                                                                                       |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `await`                                               | Wait for this step to finish. Needed before page actions, requests and `expect(page)`.                        |
| `new LoginPage(page)`                                 | The page file of a screen (see [Add a UI test](#add-a-ui-test)): its elements and actions                     |
| `page.goto('/schedule')`                              | Open an address of the web app (added to `UI_BASE_URL`)                                                       |
| `click()` / `fill('text')`                            | Click an element / type text into a box                                                                       |
| `page.getByRole('button', { name: 'Save' })`          | The element a user sees as the button "Save". Also `'link'`, `'textbox'`, `'checkbox'`, `'radio'`, ...        |
| `page.getByText('Recent Chats', { exact: true })`     | The element that shows exactly this text                                                                      |
| `.first()` / `.last()`                                | When several elements match: the first one / the last one (e.g. a page title that is also a link in the menu) |
| `page.reload()`                                       | Load the page again, to see what the server saved                                                             |
| `page.keyboard.press('Escape')`                       | Press Esc, e.g. to close a list without choosing                                                              |
| `toBeVisible()` / `toBeHidden()`                      | UI checks: the element is on the screen / is not                                                              |
| `toBeEnabled()` / `toBeDisabled()`                    | The button or box can / cannot be used (e.g. Save stays grey until something changes)                         |
| `toHaveText('PSD')` / `toContainText('PSD')`          | The element's text is exactly `PSD` / contains `PSD`                                                          |
| `toHaveCount(7)`                                      | Exactly 7 elements match (`toHaveCount(0)`: nothing matches, e.g. the row is gone)                            |
| `toHaveURL(/settings\/admins/)`                       | The address in the browser matches the pattern                                                                |
| `{ timeout: 30000 }`                                  | Wait up to 30 seconds (30000 ms) for this check, e.g. after the login                                         |
| `faker.person.firstName()`                            | A realistic first name, different every run (from the faker library)                                          |
| `for (const name of ['Pending', 'Declined']) { ... }` | Do the steps inside `{ }` once for every item of the list                                                     |
| `request.get(address, { headers, params })`           | API tests: send a GET request. `params` are added to the address after `?`                                    |
| `response.status()`                                   | API tests: the status code: 200 OK, 400 bad input, 401 not logged in, 404 not found                           |
| `/lmdmax\.com\/schedule/`                             | A pattern that means "contains lmdmax.com/schedule" (`\.` is a real dot, `\/` a real slash)                   |
| `// ...`                                              | A comment: a note for people, ignored when the test runs                                                      |

## Add an API test

There are no API tests yet: the Scheduler API is different from the LMDmax API (see
[docs/notes.md](docs/notes.md)). When the Scheduler API is shared, the tests are written exactly like
in the LMDmax Regression Suite:

1. Add the address of the API to `api/endpoints.js`, e.g.
   `admins: '/lmd/schsrv/scheduler_user/v1/all_user_permissions',`.
2. Tests are grouped by area in `tests/api/`, one file per API (e.g.
   `tests/api/settings/admins.spec.js`). Copy the `require` lines from the top of an LMDmax API test
   file. (`require` loads another file, so this file can use it. `npm run lint` tells you if one is
   not used, so you can delete it.)
3. Copy the LMDmax test that is most like yours. Change the ID, the title, the tags, the request and
   the expected values.
4. Run it: `npx playwright test tests/api/settings/admins.spec.js -g "TC-01"`.

### APIs that need login

Most APIs need two headers, both taken from the login response:

| Header           | Value                   |
| ---------------- | ----------------------- |
| `x-access-token` | `token` from login      |
| `x-access-user`  | `account_id` from login |

`loginAsTestUser()` (in `api/auth.js`) gives back the login of the test user. The test then sends
both headers itself:

```js
const user = await loginAsTestUser();

const response = await request.get(endpoints.admins, {
  headers: { 'x-access-token': user.token, 'x-access-user': user.account_id },
});
await addToReport(response);
```

Every API request also sends the headers `app-type: 8` (8 = Scheduler), `client-time-zone` and
`Origin`, like the web app does. They are set once in `playwright.config.js`.

### Login once per run

Before the first test starts, `global-setup.js`:

1. logs in once as the test user (`/lmd/usrsrv/users/v1/user/scheduler_login`), and
2. selects station PSD (`TEST_STATION_ID=645`), like the station menu at the top right of the web
   app.

API tests then reuse this login through `loginAsTestUser()`. Why:

- **Staging limits the number of logins** (status 429 = too many logins). Every **UI** test still
  logs in on the login screen, because every UI test starts logged out.
- **A login opens the station the account used last.** The expected values in the tests (drivers,
  admins, time off requests) are from station PSD. Selecting the station first makes every run use
  the same data.

If the login or the station selection fails, no test runs and the terminal shows why (see
[When something goes wrong](#when-something-goes-wrong)).

> **Tip:** to see exactly what the web app sends, log in, open DevTools → **Network** tab,
> right-click a request → **Copy as cURL**. Always check the real request before writing tests.

## Add a UI test

UI tests use **page files** in `pages/`. A page file says where the elements of one screen are
(e.g. the email box) and which actions a user can do there (e.g. `login(email, password)`).
Tests then read like steps: `await loginPage.login(...)`.

1. If the screen is new, create `pages/<Screen>Page.js` by copying `pages/LoginPage.js`.
   To find the elements, run `npx playwright codegen https://staging.scheduler.lmdmax.com`.
   Click around in the browser that opens, and Playwright writes the matching code for you.
2. Copy `tests/ui/schedule.spec.js` to a new file in `tests/ui/`. Change the title, the tags and
   the steps. Keep the "Log in" lines at the start of every test: every UI test starts logged out.
   To check what the server saved, reload the page (`page.reload()`), like
   `tests/ui/add-admin-journey.spec.js`.
3. Run it and watch the browser: `npx playwright test tests/ui/<file>.spec.js --headed`.

## Rules for every test

- **A test must work on its own.** Tests run at the same time and in any order, so a test must
  never depend on another test. Only the login of the API tests is shared (see
  [Login once per run](#login-once-per-run)).
- **Write `await`** before page actions (`page.goto`, `click`, `fill`), requests and
  `expect(page)`. `npm run lint` finds a missing `await` before `expect`, but **not** before page
  actions.
- **Every test has** a TC ID that is unique in its file, a title that starts with
  "Verify that ...", and tags.
- **Never leave `test.only` in a file.** It makes Playwright run only that test. `npm run lint`
  reports it as an error.
- **Never let personal data into the reports.** When a check fails, Playwright prints the value it
  checked, and the CI reports can be downloaded by anyone with access to the repo. Check one field
  or one row, never a whole list of people.
- **Most tests must not save data.** The settings on staging are shared by the whole station PSD,
  and many buttons reach real drivers (SMS, chats, shifts, time off). A test that has to add data
  gets the `@adds-data` tag and uses realistic values (a faker name, a yopmail email, a phone with
  area code 555). The UI tests do not click Save on the Settings screens, the switches (they save at
  once), shifts, Publish, sending messages, Approve/Decline of time off, or Add VTO. The full list,
  and why, is in [docs/notes.md](docs/notes.md). The only test file that saves data is
  `tests/ui/add-admin-journey.spec.js`: each test adds an admin to station PSD (the admins stay).

## Tags

| Tag           | When it runs                                                        | Which tests                                                                                                 |
| ------------- | ------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `@smoke`      | Every push to `main`: "is the app alive?"                           | The main happy path of each screen                                                                          |
| `@pr`         | Every pull request: fast but meaningful                             | Happy paths and key negative cases                                                                          |
| `@regression` | Every day, and before a release                                     | Every test                                                                                                  |
| `@knownbug`   | Only when you ask for it                                            | Tests that fail because of an open bug                                                                      |
| `@adds-data`  | Every day (it is also `@regression`), or when you run it on purpose | Tests that save data: new admins (they stay). `npm test`, `test:api`, `test:ui` and `test:headed` skip them |

Tags go in the second part of a test, e.g. `{ tag: ['@regression', '@pr'] }`. Every test gets
`@regression`. `npm run test:pr` runs every test that has `@pr` among its tags.

## Known bugs

A known-bug test checks the **correct** behaviour, so it **fails** until the bug is fixed. It is
never skipped: when the developers fix the bug, the test starts to pass and tells us.

A known-bug test has the bug ID at the end of its title and the `@knownbug` tag:

```js
test(
  'TC-07: Verify that the Biweekly label shows the dates of both weeks (BUG-UI-002)',
  { tag: ['@regression', '@knownbug'] },
  async ({ page }) => {
```

**Found a new bug?**

1. Add it to `docs/known-bugs/api-bugs.md` or `docs/known-bugs/ui-bugs.md` (`ui-bugs.md` ends with a
   template).
2. Write it so that everybody can understand it, also a BA who does not know the code: simple
   words, a summary, the steps on the screen (menu → page → button), the expected result, the actual
   result and the business impact.
3. Write a test for the correct behaviour. Add `@knownbug` to its tags and the bug ID to its title.

**A bug was fixed?** Run `npm run test:knownbug`, or only the bug's tests, for example
`npx playwright test --grep "BUG-UI-002"`. For each test that now passes, remove `@knownbug` and the
bug ID from it. Then set the bug's **Status** to Fixed in the docs.

Open bugs: [API bugs](docs/known-bugs/api-bugs.md) · [UI bugs](docs/known-bugs/ui-bugs.md)

## Schema tests

A **schema** describes the expected shape of an API response: which fields must be there
(`required`) and what kind of value each one holds (`type`: `string`, `number`, `boolean`,
`object` or `array`). The schemas go in `schemas/` (none yet: they come with the API tests).

TC-02 of each API test file compares the real response with its schema:

```js
expect(getSchemaErrors(body, loginSchema)).toBe('No errors');
```

If a field is missing or has the wrong type, the test fails and lists every difference
(`-` is what the test expected, `+` is what it found):

```
- No errors
+ response/data/token must be string
+ response/data must have required property 'account_id'
```

When the API changes **on purpose**, update the schema file.

## Code quality (ESLint and Prettier)

- **ESLint** finds mistakes, like a missing `await` or a forgotten `test.only`.
- **Prettier** lays out the code the same way everywhere (spaces, quotes, line breaks).

| Command                | What it does                                |
| ---------------------- | ------------------------------------------- |
| `npm run lint`         | Find mistakes                               |
| `npm run lint:fix`     | Fix the mistakes ESLint can fix by itself   |
| `npm run format`       | Lay out all files with Prettier             |
| `npm run format:check` | Check the layout, without changing any file |

With the recommended VS Code extensions, a file is laid out automatically every time you save it.
Before you push, run `npm run lint` and `npm run format:check`: CI runs both and stops if one
fails. Fix every **error**. **Warnings** are advice.

## CI

`.github/workflows/tests.yml` tells GitHub what to run: first lint and the format check, then the
tests.

| When                                         | Tests         |
| -------------------------------------------- | ------------- |
| Pull request to `main`                       | `@pr`         |
| Push to `main`                               | `@smoke`      |
| Every day at 08:00 IST                       | `@regression` |
| Manually: **Actions → Tests → Run workflow** | You choose    |

- CI skips the known-bug tests, so a red run means a **new** failure. To run them on GitHub, choose
  `knownbug` in **Run workflow**. The daily `@regression` run also runs the `@adds-data` tests, so it adds 2 admins to station PSD every day.
- On CI a failed test is run one more time before it counts as failed.
- CI reports have the same traces and API calls as on your computer. A trace can contain the
  test user's token or password, so **keep the repo private**: anyone with access to the repo can
  download the reports.
- **Reports:** open the run → **Artifacts** → download `reports-<number>` and unzip it. Then
  double-click `allure-report/index.html` or `playwright-report/index.html`.
- **Login:** the repo secrets `LOGIN_EMAIL` and `LOGIN_PASSWORD`
  (**Settings → Secrets and variables → Actions**). The addresses and the station are in the
  workflow file.

## Other environments

Create `.env.<name>` from `.env.example` (e.g. `.env.qa`) with the addresses, login and station of
that environment, then run with `TEST_ENV=<name>`:

```bash
TEST_ENV=qa npm test
```

## When something goes wrong

| Message                                                      | What to do                                                                                                |
| ------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------- |
| `LOGIN_EMAIL not set. Create .env.staging from .env.example` | Do steps 2 and 3 of [Setup](#setup-once)                                                                  |
| `Login failed with status 401 ...`                           | The test user cannot log in: check `LOGIN_EMAIL` and `LOGIN_PASSWORD` in `.env.staging`                   |
| `Login failed with status 429 ...`                           | Too many logins. Wait 10 minutes, then run again                                                          |
| `Could not select station ...`                               | Check `TEST_STATION_ID` in `.env.staging` (`645` = station PSD)                                           |
| A screen is empty and several UI tests fail at once          | Staging is slow. Run again, or run `npx playwright test --workers=2` (see [docs/notes.md](docs/notes.md)) |
| `Executable doesn't exist ...`                               | Run `npx playwright install chromium`                                                                     |
| A UI test fails and you cannot see why                       | Run it with `--headed`, or open its trace                                                                 |
