# Insufficiency Reminder

A small Express application for tracking candidate BGV insufficiencies and sending reminders. It includes a browser UI and a JSON API for listing, creating, resolving, and reminding insufficiencies.

## Hackathon Context

This repository is the Phase 2 submission for the SDET hackathon. It contains automated regression tests for the five bugs accepted in Phase 1. The optional production fixes for those bugs are also included.

## Accepted Bugs

| Bug | Regression coverage | Status |
| --- | --- | --- |
| BUG-05-01 | Verifies that creating an insufficiency without a non-empty `candidateName` returns HTTP 400. | Fixed |
| BUG-05-02 | Verifies that resolving a nonexistent insufficiency returns HTTP 404. | Fixed |
| BUG-05-03 | Verifies that reminding a `RESOLVED` insufficiency returns HTTP 400. | Fixed |
| BUG-05-09 | Compares `OPEN` and `open` status-filter responses to verify case-insensitive filtering. | Fixed |
| BUG-05-15 | Verifies that a successful reminder returns the updated `reminderCount` of 3. | Fixed |

## Testing

The regression tests were written to fail against the original buggy implementation. After the optional production fixes were applied, all five tests pass.

```text
$ npm test

ℹ tests 5
ℹ pass 5
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
```

The test process starts the application locally on port `3105`. Each test uses a separate Supertest agent and calls the application's `/api/reset` utility so state does not leak between cases.

## Setup

Install dependencies:

```bash
npm install
```

Run the regression suite:

```bash
npm test
```

Start the application:

```bash
npm start
```

The server uses port `3005` by default and respects the `PORT` environment variable.

## Tools

- JavaScript and Node.js
- Express 4
- Node.js `node:test`
- Supertest
- Git and GitHub

## Project Structure

```text
server.js                    Express server and API routes
data.js                      Seed insufficiency data
isolation.js                 Cookie-scoped in-memory store and reset support
public/index.html            Browser UI markup
public/app.js                Browser UI behavior
public/style.css             UI styles
public/report-widget.js      Hackathon reporting widget
test/accepted-bugs.test.js   Five accepted-bug API regression tests
package.json                 Scripts and dependencies
package-lock.json            Locked dependency versions
```

## Fixes

The optional production fixes are included in `server.js`:

- Normalize status query values before filtering.
- Reject reminders for resolved insufficiencies with HTTP 400.
- Return HTTP 404 when resolving an unknown ID.
- Validate trimmed `candidateName` and `reason` values.
- Return the updated reminder count in the reminder response.

Fix commit:

```text
3fb9685 - Fix accepted bugs and pass regression tests
```
