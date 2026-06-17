const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const html = `<!DOCTYPE html>
<html>
<head>
<style>
  body { font-family: 'Segoe UI', Arial, sans-serif; margin: 40px; color: #222; line-height: 1.6; }
  h1 { color: #1a56db; border-bottom: 3px solid #1a56db; padding-bottom: 10px; font-size: 28px; }
  h2 { color: #1a56db; margin-top: 30px; font-size: 20px; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
  h3 { color: #333; margin-top: 20px; font-size: 16px; }
  code { background: #f0f4ff; padding: 2px 6px; border-radius: 4px; font-family: 'Consolas', monospace; font-size: 13px; color: #1a56db; }
  pre { background: #1e1e2e; color: #cdd6f4; padding: 15px; border-radius: 8px; font-family: 'Consolas', monospace; font-size: 13px; overflow-x: auto; }
  table { width: 100%; border-collapse: collapse; margin: 15px 0; }
  th { background: #1a56db; color: white; padding: 10px 12px; text-align: left; font-size: 14px; }
  td { padding: 8px 12px; border-bottom: 1px solid #e0e0e0; font-size: 13px; }
  tr:nth-child(even) { background: #f8f9ff; }
  .link { color: #1a56db; }
  .step { background: #f0f4ff; padding: 3px 10px; border-radius: 15px; font-weight: bold; color: #1a56db; display: inline-block; margin-bottom: 5px; }
  .note { background: #fff8e1; border-left: 4px solid #f59e0b; padding: 10px 15px; margin: 10px 0; border-radius: 4px; font-size: 13px; }
  .env-box { background: #f0fdf4; border: 1px solid #22c55e; border-radius: 8px; padding: 15px; margin: 15px 0; }
  .env-box.live { background: #fef2f2; border-color: #ef4444; }
  .env-label { font-weight: bold; font-size: 15px; margin-bottom: 8px; }
  .env-label.staging { color: #16a34a; }
  .env-label.live { color: #dc2626; }
  .page-break { page-break-before: always; }
</style>
</head>
<body>

<h1>Dyfana Playwright - Setup & Run Guide</h1>
<p style="color:#666; font-size:14px; margin-top:-10px;">Project: Dyfana E2E Booking Tests &nbsp;|&nbsp; Repository: github.com/anamsaeedtechnation-ai/Dyfana-Playwright</p>

<h2>Environments</h2>
<div style="display:flex; gap:15px;">
  <div class="env-box" style="flex:1;">
    <div class="env-label staging">Staging (Default)</div>
    <div><strong>URL:</strong> https://dev.dyfana.com</div>
    <div><strong>Command:</strong> <code>npx playwright test</code></div>
  </div>
  <div class="env-box live" style="flex:1;">
    <div class="env-label live">Live / Production</div>
    <div><strong>URL:</strong> https://www.dyfana.com</div>
    <div><strong>Command:</strong> <code>$env:TEST_ENV="live"; npx playwright test</code></div>
  </div>
</div>

<h2><span class="step">Step 1</span> Install Node.js</h2>
<p>Download and install Node.js from: <span class="link">https://nodejs.org</span> (LTS version recommended)</p>
<p>Verify installation:</p>
<pre>node -v
npm -v</pre>

<h2><span class="step">Step 2</span> Clone the Repository</h2>
<pre>git clone https://github.com/anamsaeedtechnation-ai/Dyfana-Playwright.git
cd Dyfana-Playwright</pre>

<h2><span class="step">Step 3</span> Install Dependencies</h2>
<pre>npm install</pre>

<h2><span class="step">Step 4</span> Install Playwright Browsers</h2>
<pre>npx playwright install</pre>
<p>This downloads Chromium, Firefox, and WebKit browsers needed to run tests.</p>

<h2><span class="step">Step 5</span> Run Tests</h2>

<h3>Run on Staging (default):</h3>
<pre>npx playwright test</pre>

<h3>Run on Live / Production:</h3>
<pre># PowerShell (VS Code terminal)
$env:TEST_ENV="live"; npx playwright test

# CMD / Git Bash
set TEST_ENV=live && npx playwright test</pre>

<h3>Run a specific test:</h3>
<pre>npx playwright test --grep "Umrah booking"
npx playwright test --grep "Custom Umrah booking"</pre>

<h3>Run a specific test on Live:</h3>
<pre>$env:TEST_ENV="live"; npx playwright test --grep "Hotel booking"</pre>

<h3>Run with browser visible (headed mode):</h3>
<pre>npx playwright test --headed</pre>

<h3>Run with Playwright UI:</h3>
<pre>npx playwright test --ui</pre>

<h3>View test report after run:</h3>
<pre>npx playwright show-report</pre>

<h2><span class="step">Step 6</span> Pull Latest Code from GitHub</h2>
<pre>git pull origin master</pre>

<div class="page-break"></div>

<h2>All Commands - Quick Reference</h2>
<table>
  <tr><th>Action</th><th>Command</th></tr>
  <tr><td>Install dependencies</td><td><code>npm install</code></td></tr>
  <tr><td>Install Playwright browsers</td><td><code>npx playwright install</code></td></tr>
  <tr><td>Run all tests (Staging)</td><td><code>npx playwright test</code></td></tr>
  <tr><td>Run all tests (Live)</td><td><code>$env:TEST_ENV="live"; npx playwright test</code></td></tr>
  <tr><td>Run specific test</td><td><code>npx playwright test --grep "test name"</code></td></tr>
  <tr><td>Run specific test (Live)</td><td><code>$env:TEST_ENV="live"; npx playwright test --grep "test name"</code></td></tr>
  <tr><td>Run with browser visible</td><td><code>npx playwright test --headed</code></td></tr>
  <tr><td>Open Playwright UI</td><td><code>npx playwright test --ui</code></td></tr>
  <tr><td>View HTML report</td><td><code>npx playwright show-report</code></td></tr>
  <tr><td>Pull latest code</td><td><code>git pull origin master</code></td></tr>
  <tr><td>Check git status</td><td><code>git status</code></td></tr>
  <tr><td>View git log</td><td><code>git log --oneline</code></td></tr>
</table>

<h2>All Tests (8 Total)</h2>
<table>
  <tr><th>#</th><th>Test Name</th><th>Run Command</th></tr>
  <tr><td>1</td><td>Umrah booking</td><td><code>npx playwright test --grep "Umrah booking"</code></td></tr>
  <tr><td>2</td><td>Transport booking</td><td><code>npx playwright test --grep "Transport booking"</code></td></tr>
  <tr><td>3</td><td>Guide booking</td><td><code>npx playwright test --grep "Guide booking"</code></td></tr>
  <tr><td>4</td><td>Explore Saudi booking</td><td><code>npx playwright test --grep "Explore Saudi"</code></td></tr>
  <tr><td>5</td><td>Hotel booking</td><td><code>npx playwright test --grep "Hotel booking"</code></td></tr>
  <tr><td>6</td><td>Offers booking</td><td><code>npx playwright test --grep "Offers booking"</code></td></tr>
  <tr><td>7</td><td>Custom Umrah booking</td><td><code>npx playwright test --grep "Custom Umrah"</code></td></tr>
  <tr><td>8</td><td>Umrah Badal booking</td><td><code>npx playwright test --grep "Umrah Badal"</code></td></tr>
</table>

<h2>Important Links</h2>
<table>
  <tr><th>Resource</th><th>URL</th></tr>
  <tr><td>GitHub Repository</td><td><span class="link">https://github.com/anamsaeedtechnation-ai/Dyfana-Playwright</span></td></tr>
  <tr><td>Staging Website</td><td><span class="link">https://dev.dyfana.com</span></td></tr>
  <tr><td>Live Website</td><td><span class="link">https://www.dyfana.com</span></td></tr>
  <tr><td>Node.js Download</td><td><span class="link">https://nodejs.org</span></td></tr>
  <tr><td>Playwright Docs</td><td><span class="link">https://playwright.dev</span></td></tr>
  <tr><td>Git Download</td><td><span class="link">https://git-scm.com</span></td></tr>
</table>

<h2>Project Structure</h2>
<pre>Dyfana-Playwright/
  tests/
    dyfana-booking.spec.ts    -- All 8 booking tests
  playwright.config.ts        -- Playwright configuration
  package.json                -- Project dependencies
  SETUP-GUIDE.md              -- This guide (markdown version)</pre>

<div class="note">
  <strong>Note:</strong> All tests use Stripe test card <code>4242 4242 4242 4242</code> (test mode). Tests take approximately 6 minutes to run. By default tests run on <strong>Staging</strong> (dev.dyfana.com). Set <code>TEST_ENV=live</code> to run on <strong>Live</strong> (www.dyfana.com).
</div>

</body>
</html>`;

  await page.setContent(html, { waitUntil: 'domcontentloaded' });

  const pdfPath = path.join(__dirname, 'Dyfana-Playwright-Setup-Guide.pdf');
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    margin: { top: '20px', bottom: '20px', left: '10px', right: '10px' },
    printBackground: true,
  });

  console.log('PDF created: ' + pdfPath);
  await browser.close();
})();
