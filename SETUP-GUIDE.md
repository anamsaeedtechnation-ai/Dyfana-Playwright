# Dyfana Playwright - Setup & Run Guide

## Step 1: Install Node.js

Download and install Node.js from: https://nodejs.org  
(LTS version recommended)

Verify installation:
```
node -v
npm -v
```

---

## Step 2: Clone the Repository

```
git clone https://github.com/anamsaeedtechnation-ai/Dyfana-Playwright.git
cd Dyfana-Playwright
```

---

## Step 3: Install Dependencies

```
npm install
```

---

## Step 4: Install Playwright Browsers

```
npx playwright install
```

This downloads Chromium, Firefox, and WebKit browsers.

---

## Step 5: Run Tests

### Staging (dev.dyfana.com) — Default
```
npx playwright test
```

### Live / Production (www.dyfana.com)
```powershell
# PowerShell (VS Code terminal)
$env:TEST_ENV="live"; npx playwright test
```
```bash
# Git Bash / CMD
set TEST_ENV=live && npx playwright test
```

**Run a specific test:**
```
npx playwright test --grep "Umrah booking"
npx playwright test --grep "Transport booking"
npx playwright test --grep "Guide booking"
npx playwright test --grep "Explore Saudi booking"
npx playwright test --grep "Hotel booking"
npx playwright test --grep "Offers booking"
npx playwright test --grep "Custom Umrah booking"
npx playwright test --grep "Umrah Badal booking"
```

**Run specific test on Live:**
```powershell
$env:TEST_ENV="live"; npx playwright test --grep "Hotel booking"
```

**Run tests with browser visible (headed mode):**
```
npx playwright test --headed
```

**Run tests with Playwright UI:**
```
npx playwright test --ui
```

**View test report after run:**
```
npx playwright show-report
```

---

## Step 6: Pull Latest Code from GitHub

```
git pull origin master
```

---

## Quick Reference - All Commands

| Action                        | Command                                              |
|-------------------------------|------------------------------------------------------|
| Install dependencies          | `npm install`                                        |
| Install browsers              | `npx playwright install`                             |
| Run all tests (Staging)       | `npx playwright test`                                |
| Run all tests (Live)          | `$env:TEST_ENV="live"; npx playwright test`          |
| Run specific test             | `npx playwright test --grep "test name"`             |
| Run specific test (Live)      | `$env:TEST_ENV="live"; npx playwright test --grep "test name"` |
| Run with browser visible      | `npx playwright test --headed`                       |
| Open Playwright UI            | `npx playwright test --ui`                           |
| View report                   | `npx playwright show-report`                         |
| Pull latest code              | `git pull origin master`                             |
| Check git status              | `git status`                                         |

---

## Test List (8 Tests)

1. Umrah booking
2. Transport booking
3. Guide booking
4. Explore Saudi booking
5. Hotel booking
6. Offers booking
7. Custom Umrah booking
8. Umrah Badal booking

## Environments

| Environment | URL                        | Command                                     |
|-------------|----------------------------|---------------------------------------------|
| Staging     | https://dev.dyfana.com     | `npx playwright test`                       |
| Live        | https://www.dyfana.com     | `$env:TEST_ENV="live"; npx playwright test` |
