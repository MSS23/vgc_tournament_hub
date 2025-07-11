import { FullConfig } from '@playwright/test';

async function globalTeardown(config: FullConfig) {
  console.log('🧹 E2E Test Environment Cleanup Complete');
  
  // Add any cleanup logic here
  // For example, cleaning up test data, stopping services, etc.
}

export default globalTeardown; 