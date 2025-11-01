// @ts-check
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './web',               // Folder for test files
  timeout: 30 * 1000,               
  retries: 0,                        
  reporter: 'html',                  
  use: {
    headless: true,                  
    viewport: { width: 1280, height: 720 },
    actionTimeout: 10 * 1000,        
    ignoreHTTPSErrors: true,         // Ignore HTTPS errors
    video: 'on-first-retry',        
    screenshot: 'only-on-failure',  
  },
  projects: [
    { name: 'Chromium', use: { browserName: 'chromium' } },
    
  ],
});
