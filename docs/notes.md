# Notes

Things that are skipped for now, open questions, and things to remember. Not bugs (those are in
[known-bugs/](known-bugs/)).

## Skipped for now

### 1. Switch tests on the Settings screens

- **Screens:** Settings → Reminders, Settings → In-app Driver Communication, Settings → Message Channel
  Configuration.
- **What:** tests that turn a switch on or off, check it is saved, and put it back.
- **Why skipped:** the switches save as soon as they are clicked and control real messages and calls to
  drivers (for example the automatic birthday message, or SMS Chat). While a switch is changed, real
  drivers could get messages.
- **If added later:** tag them `@regression @adds-data` and always put the switch back at the end of
  the test.

### 1b. Settings → Driver: switches, Save and the 1-366 days box

- **Screens:** Driver Availability, Set Time Off Threshold, Driver Performance Rating.
- **Not tested yet:**
  - Driver Availability: flip the switch → Save becomes enabled; flip it back → Save is disabled again
    (no Save clicked).
  - Set Time Off Threshold: turn the switch on → a box for the number of days appears (to check);
    values 0, 367, -5, 12.5 must be refused, 1 and 366 accepted ("between 1-366 days").
  - Driver Performance Rating: the switch has no Save button, so it saves at once.
- **Why skipped:** these settings are for the whole station. Flipping a switch on the shared staging
  station, even without Save, was blocked on 2026-10-08 (Claude Code permission check) and needs your
  OK. If allowed: only flip, never click Save (except in an `@adds-data` test that puts the old value
  back), and reload at the end.
- **Noticed:** on Set Time Off Threshold the Save button is enabled even when nothing was changed; on
  Driver Availability it is disabled until something changes. Ask if this is on purpose.

### 1c. Settings → Preferences and Settings → Dashboard: options, Save, roles

- **Screens:** Manage Driver Performance Metrics, Role Creation & Assignment, Export Settings, Time Format,
  Week Start Day, Default Landing Page.
- **Not tested yet:**
  - Ticking/unticking a metric or export field, or picking another time format / week day / landing
    page → Save becomes enabled (no Save clicked).
  - Manage Driver Performance Metrics: "Select any five options" → what happens with a 6th tick?
  - Role Creation & Assignment: saving a new role, Edit and Delete of a role (the "Create Role"
    window is only opened and cancelled).
- **Why skipped:** same as 1b, these are settings of the whole station. Needs your OK.
- **Noticed:** while Export Settings is still loading, the page shows only an enabled Save button; when
  the fields arrive, Save becomes disabled. Ask if Save should be disabled while loading.
- **Question:** Manage Driver Performance Metrics says "Select any five options", but on station PSD
  only 4 are ticked (Weekly Hours Scheduled, Overall Tier, Callouts - Last 30 days, Writeups - Last 30
  days). Is fewer than 5 allowed?

### 1d. Schedule screen

- **Tested (read only):** week shown with 7 days, the shift counts, next/previous week, Daily / Weekly /
  Biweekly, search by driver name, the view list. Opened and closed without choosing anything: Filter,
  Sort, Other Options, the station menu, the "Add Driver" window (Cancel). None of these send a save to
  the server (checked on 2026-10-09).
- **Not tested yet:** adding, moving or deleting shifts, Copy, Mark Extras, Publish, the Route Count
  button, applying a filter or sort, saving a new driver, Auto schedule, All Schedule, Add new
  schedule. These add or change data that drivers can see. Needs your OK and the app flow.
- **Bulk upload (Import Amazon Weekly Roster):** `tests/ui/roster-upload.spec.js` checks, read only, that
  Other Options opens the page `/schedule/roster-upload`, the upload box, Choose File (Excel only:
  .xls, .xlsx, several files allowed), the 11 steps and the week arrows. `schedule.spec.js` TC-13 opens
  Other Options → Bulk Actions and checks its 7 actions without clicking one.
- **Bulk upload, not tested yet:** choosing and importing a roster file (it adds the roster to the
  schedule of station PSD), a wrong file (e.g. .csv, .pdf, an empty or broken Excel file), the
  mismatch review (steps 8–11), and the 7 Bulk Actions (Delete All Shifts, Delete Empty Shifts, Send
  Schedule Details, Driver Reliability Rating, Set Availability, Driver Classification, Edit Shift).
  Needs your OK, a sample Amazon roster file for `test-files/`, and a week without real shifts.
- **Bug:** the Biweekly label shows only the dates of the first week → logged as
  [BUG-UI-002](known-bugs/ui-bugs.md) (confirmed by you on 2026-10-09). Fixed by the developers the
  same day: the label now shows "W:41/42 Oct 04 - Oct 17", and TC-07 is a normal test again.
- **Noticed:** in Biweekly, the next-week arrow moves 1 week (W:41/42 → W:42/43), not 2. Ask if this is
  on purpose.
- **Noticed:** a search with no match shows an empty list without a message like "No drivers found".

### 1e. Chats (SMS Chat and In-App Chat)

- **Tested (read only):** the pages open, the Chats menu, search, "No chats found", the Filters panel
  (closed without applying), the In-App Chat tabs and the Individual Chat tabs. Opened and closed
  without choosing anything: Broadcast Message, Start New Group, Create Groups and Broadcasts. None of
  these send a save to the server (checked on 2026-10-09).
- **Not tested yet:** opening a conversation (it may mark messages as read), sending a message or a
  broadcast, creating a group, Apply Filters. SMS go to real phones. Needs your OK, and test drivers
  whose phones reach no real person.
- **Noticed:** the SMS chat list shows the welcome message with the driver's login email (the password
  is hidden with ###). Ask if showing the email there is on purpose.

### 1f. Time Off Request (Leave Management, Restricted Dates, VTO Management)

- **Tested (read only):** the 4 status cards and their lists, the Approved number matches the requests
  listed, the 4 sort orders, search, the 3 tabs, the Restricted Dates list, the VTO screen. Opened and
  closed without filling anything: the "Time Off Request", "Date Restriction" and "Add VTO" windows
  (Cancel), and the Select Date calendar. None of these send a save to the server (checked on
  2026-10-09).
- **Not tested yet:** submitting a Time Off Request, Approve, Decline, Move To Declined, adding a
  restricted date and its Edit/Delete, adding a VTO. They change the drivers' time off or offer VTO to
  real drivers. Needs your OK and the app flow.
- **Data on staging:** Restricted Dates already has many "QA Restricted ..." entries from earlier test
  runs (Sep 17, 2026), and one named just "134".

### 2. Boxes and switches without a linked label (possible BUG-UI-003)

- **Where:** the "Add Admin" window (Settings → Admins → + Add Admin): Name, Email, Phone, Password,
  Confirm Password. Also the switches on Reminders, In-app Driver Communication and Message Channel
  Configuration, and the checkboxes on Manage Driver Performance Metrics and Export Settings.
- **What:** the text above or next to each box ("NAME *", "EMAIL *", "Send Automatic Birthday Message",
  ...) is not linked to the box or switch in the code. The boxes have no placeholder either.
- **Effect on the tests:** `getByLabel('Name')` does not work, so `pages/AdminsPage.js` finds the boxes
  by their order (`getByRole('textbox').nth(0)` = Name, `nth(1)` = Email, ...). If a developer adds a
  box or changes the order, the tests fill the wrong boxes. The switches can only be counted, not told
  apart.
- **Effect on users:** screen readers announce the boxes and switches without saying what they are for
  (accessibility).
- **Fix (developers):** link each label to its box (`label` of the MUI TextField, or `aria-label`).
  Then the tests can use `getByLabel(...)`.
- **Suggested if logged:** BUG-UI-003, Severity Low, Priority P3.

### 3. API tests

- The scheduler API is different from the LMDmax API, so the suite has no API tests yet (`tests/api/`
  is empty).
- The Postman collection is in a private workspace and cannot be opened without logging in. Export it
  (Collection → ⋯ → Export → Collection v2.1) into [postman/](postman/). Remove real passwords and
  tokens from an exported environment.
- 2026-10-09: no Scheduler API is available yet. The API tests wait until it is shared.

### 4. Documents

- `README.md` is written in the full LMDmax format (2026-10-09), after all main screens got tests.
- `docs/known-bugs/api-bugs.md` will be written in the full LMDmax format when the API tests come.
- CI: `.github/workflows/tests.yml` did not set `TEST_STATION_ID`, so `global-setup.js` could not
  select the station on GitHub. Added `TEST_STATION_ID: '645'` like the LMDmax workflow (2026-10-09).
  The repo secrets `LOGIN_EMAIL` and `LOGIN_PASSWORD` were added on GitHub on 2026-10-09.
- CI changes on 2026-10-09 (not in LMDmax): the `@knownbug` tests are skipped unless you choose
  `knownbug` in Run workflow, and on CI the tests run one at a time (staging is too slow with more).
  The repo is at <https://github.com/Reetu-SSAI/First-Scheduler-Project>. It is **public**: make it
  private, because the reports can contain the test login.

## Never clicked by the tests

| Screen                                                                 | What                                            | Why                                                 |
| ---------------------------------------------------------------------- | ----------------------------------------------- | --------------------------------------------------- |
| Settings → Change Password                                             | Save                                            | It changes the test user's password and logs it out |
| Settings → User/Company Details                                        | Save (after Edit)                               | It changes the owner's name or phone                |
| Settings → Admins                                                      | Delete Admin, Remove Admin Role, Set Permission | Not covered yet                                     |
| Reminders, In-app Driver Communication, Message Channel                | the switches, the time zone                     | They save at once (see 1)                           |
| Driver Availability, Set Time Off Threshold, Driver Performance Rating | the switches, Save                              | Settings of the whole station (see 1b)              |
| Preferences and Dashboard screens                                      | checkboxes, options, Save                       | Settings of the whole station (see 1c)              |
| Role Creation & Assignment                                             | + Create Role, Edit, Delete                     | Not covered yet (see 1c)                            |
| Schedule                                                               | shifts, Copy, Mark Extras, Publish, Add Driver  | They change the schedule drivers see (see 1d)       |
| SMS Chat, In-App Chat                                                  | a conversation, send, Broadcast, new group      | Messages reach real drivers (see 1e)                |
| Leave Management, Restricted Dates, VTO Management                     | add, approve, decline, edit, delete, Add VTO    | They change the drivers' time off (see 1f)          |

## Test data added on staging

- **Admins:** every run of `tests/ui/add-admin-journey.spec.js` adds 2 admins to station PSD (realistic
  name + 5 capital letters, e.g. "Olivia Bennett CJFFA", yopmail email, 555 phone). They are not
  deleted. 6 were added on 2026-10-08 while the tests were written.

## Good to know

- Staging is sometimes slow. Then, in a full run with 4 tests at the same time, some screens (Schedule,
  Role Creation & Assignment, Export Settings, Restricted Dates) are still empty after 15 seconds and
  about 7 tests fail. Run again, or run fewer at a time: `npx playwright test --workers=2` (about 8
  minutes). On 2026-10-09 one run failed this way and the next run passed. On GitHub it happened too,
  so CI now runs one test at a time.

- The old password on Change Password is checked by the server while typing
  (`/lmd/usrsrv/users/v1/confirm_password`). New Password opens only when the old password is right.
- A name in "Add Admin" can contain only letters, spaces, hyphens and apostrophes (no digits).
- The site address contains "scheduler", so a URL check must use `/lmdmax\.com\/schedule/`, not
  `/schedule/` (that also matches the login page).
- Some page titles are also links in the left Settings menu (e.g. "Admins", "Message Channel
  Configuration"): the page objects use `.last()` for the title.
