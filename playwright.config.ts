import { defineConfig, devices } from '@playwright/test';

const isUAT = process.env.TEST_ENV === 'uat';

export default defineConfig({
  testDir: './tests',
  timeout: 600000,
  expect: { timeout: isUAT ? 30000 : 15000 },
  reporter: [['list']],
  use: {
    actionTimeout: isUAT ? 30000 : 15000,
    navigationTimeout: isUAT ? 120000 : 60000,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});
