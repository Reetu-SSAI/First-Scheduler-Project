# Known bugs — UI (screens)

This document lists the bugs that our automated tests found on the LMDmax Scheduler **screens** (the web app at
<https://staging.scheduler.lmdmax.com>). It is written for everybody: QA, developers, BAs and
managers. Bugs in the server (the API) are in [api-bugs.md](api-bugs.md), which also explains the
[words used](api-bugs.md#words-used).

## Summary

| ID                                                                                           | Title                                                               | Screen            | Severity | Priority | Status | Automated tests                            |
| -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- | ----------------- | -------- | -------- | ------ | ------------------------------------------ |
| [BUG-UI-001](#bug-ui-001-admins-a-new-admin-is-not-shown-until-the-page-is-reloaded)         | Admins: a new admin is not shown until the page is reloaded         | Settings → Admins | Medium   | P2       | Open   | `tests/ui/add-admin-journey.spec.js` TC-02 |
| [BUG-UI-002](#bug-ui-002-schedule-the-biweekly-label-shows-only-the-dates-of-the-first-week) | Schedule: the Biweekly label shows only the dates of the first week | Schedule          | Low      | P3       | Fixed  | `tests/ui/schedule.spec.js` TC-07          |

**Severity** (how bad it is for the business): **High** = wrong data is saved or shown, or a feature
does not work · **Medium** = something works wrong, but there is a way around it · **Low** = a small
problem, for example a spelling mistake.
**Priority** (how soon to fix it): **P1** = fix next · **P2** = fix soon · **P3** = fix later · **P4**
= fix when there is time.
**Status:** **Open** → **In progress** → **Fixed** (checked with the tests) → **Closed**.

---

## BUG-UI-001: Admins: a new admin is not shown until the page is reloaded

|                     |                                            |
| ------------------- | ------------------------------------------ |
| **Screen**          | Settings → Admins                          |
| **Severity**        | Medium                                     |
| **Priority**        | P2                                         |
| **Status**          | Open                                       |
| **Found on**        | 2026-10-08 (staging, station PSD)          |
| **Browser**         | Chrome                                     |
| **Automated tests** | `tests/ui/add-admin-journey.spec.js` TC-02 |

**Summary:** after the owner adds an admin, the web app says "Admin added to station(s): PSD
successfully.", but the new admin is not in the list and the number next to "Admins" does not change.
The new admin only shows after the page is reloaded.

**Before you start:** log in to the Scheduler web app as the owner and choose station PSD.

**Steps to replicate**

1. Open **Settings → Admins**. Note the number next to "Admins", for example (31).
2. Click **+ Add Admin**.
3. Fill in Name (letters only, for example "Olivia Bennett"), Email (for example
   olivia.bennett.1@yopmail.com), Phone (for example 5550000001), Password and Confirm Password
   (for example Test@12345). Keep station PSD.
4. Click **Add Admin**.
5. Wait 15 seconds and look at the list.
6. Reload the page.

**After the test:** the new admin stays (there is no need to delete it).

**Expected result:** right after step 4 the new admin is in the list and the number next to "Admins"
is 1 higher, for example (32).

**Actual result:** the message "Admin added to station(s): PSD successfully." is shown and the window
closes, but the list and the number stay the same. Only after the reload (step 6) is the new admin in
the list.

**Screenshot / trace:** attach the screenshot or the trace from the Playwright or Allure report.

**Business impact:** the owner thinks the admin was not added and may add the same person again, or
ask support why the admin is missing.

**How to check the fix:** run `npx playwright test --grep "BUG-UI-001"`. The test passes when the bug
is fixed. Then QA removes `@knownbug` and `(BUG-UI-001)` from it.

---

## BUG-UI-002: Schedule: the Biweekly label shows only the dates of the first week

|                     |                                   |
| ------------------- | --------------------------------- |
| **Screen**          | Schedule                          |
| **Severity**        | Low                               |
| **Priority**        | P3                                |
| **Status**          | Fixed (checked on 2026-10-09)     |
| **Found on**        | 2026-10-09 (staging, station PSD) |
| **Browser**         | Chrome                            |
| **Automated tests** | `tests/ui/schedule.spec.js` TC-07 |

**Summary:** in the Biweekly view the schedule shows 2 weeks (14 days), but the date label above it
shows only the dates of the first week, for example "W:41/42 Oct 04 - Oct 10" instead of
"W:41/42 Oct 04 - Oct 17".

**Before you start:** log in to the Scheduler web app as the owner and choose station PSD.

**Steps to replicate**

1. Open **Schedule** (it opens after login, in the Weekly view). Note the label next to the arrows, for
   example "W:41 Oct 04 - Oct 10".
2. Click the **Biweekly** icon (the third icon next to "Employee View").
3. Look at the day columns and at the label next to the arrows.

**After the test:** click the **Weekly** icon to go back to the normal view. Nothing is saved.

**Expected result:** the label shows the first and the last day of the 14 days shown, for example
"W:41/42 Oct 04 - Oct 17".

**Actual result:** the 14 days Sun 04 … Sat 17 are shown, but the label is "W:41/42 Oct 04 - Oct 10"
(the last day of the first week only).

**Screenshot / trace:** attach the screenshot or the trace from the Playwright or Allure report.

**Business impact:** a manager planning 2 weeks can read the label as one week and miss that the
second week is shown too, for example when talking about the dates with drivers.

**How to check the fix:** run `npx playwright test --grep "BUG-UI-002"`. The test passes when the bug
is fixed. Then QA removes `@knownbug` and `(BUG-UI-002)` from it.

---

## Adding a new bug

1. **Check that it is a real bug.** Try it again, on staging, with station PSD. Note exactly what you
   clicked.
2. **Copy the template below**, give it the next ID (BUG-UI-001, BUG-UI-002, ...), and add a row to
   the summary table.
3. **Write a test** for the correct behaviour: add `@knownbug` to its tags and the bug ID to the end of
   its title, for example `'TC-02: Verify that ... (BUG-UI-001)'`.
4. **Use simple words.** Write for a reader who does not know the code: which menu, which page, which
   button, what you saw, and what you expected to see.

```markdown
## BUG-UI-00X: <Screen>: <what is wrong, in simple words>

|                     |                                              |
| ------------------- | -------------------------------------------- |
| **Screen**          | <menu → page>, for example Settings → Admins |
| **Severity**        | High / Medium / Low                          |
| **Priority**        | P1 / P2 / P3 / P4                            |
| **Status**          | Open                                         |
| **Found on**        | YYYY-MM-DD (staging, station PSD)            |
| **Browser**         | Chrome                                       |
| **Automated tests** | `tests/ui/<file>.spec.js` TC-XX              |

**Summary:** what is wrong, in one or two short sentences.

**Before you start:** the login, the station and the test data (for example a test driver).

**Steps to replicate**

1. Open **<menu> → <page>**.
2. Click **<button>** ...
3. ...

**After the test:** how to put the data back.

**Expected result:** what should happen.

**Actual result:** what happens.

**Screenshot / trace:** attach the screenshot or the trace from the Playwright or Allure report.

**Business impact:** why it matters: for the manager, the drivers, the numbers, money, the law or
security.

**How to check the fix:** run `npx playwright test --grep "BUG-UI-00X"`. The test passes when the bug
is fixed. Then QA removes `@knownbug` and `(BUG-UI-00X)` from it.
```
