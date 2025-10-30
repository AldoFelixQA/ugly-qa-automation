import { chromium, FullConfig } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

async function globalSetup(config: FullConfig) {
  // Create necessary directories if they don't exist
  const directories = [
    'screenshots',
    'videos',
    'test-results'
  ];

  for (const dir of directories) {
    const dirPath = path.join(process.cwd(), dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  // Optional: Set up any global test data or configurations
  console.log('Global setup completed');
}

export default globalSetup; 