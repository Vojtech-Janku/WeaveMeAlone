import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  // Playwright starts this command before the test run and stops it after —
  // no need to manually `python3 -m http.server` yourself before testing.
  webServer: {
    command: 'python3 -m http.server 8000',
    url: 'http://localhost:8000',
    reuseExistingServer: !process.env.CI,
  },

  use: {
    baseURL: 'http://localhost:8000',
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});
