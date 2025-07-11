import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Navigate to the app and wait for it to be ready
  await page.goto('http://localhost:5173');
  
  // Wait for the app to load
  await page.waitForSelector('text=Login', { timeout: 30000 });
  
  console.log('✅ E2E Test Environment Setup Complete');
  
  await browser.close();
}

export default globalSetup; 