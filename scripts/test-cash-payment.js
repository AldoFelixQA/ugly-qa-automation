#!/usr/bin/env node

/**
 * Cash Payment Flow Test Script
 * 
 * This script validates the complete cash payment flow implementation
 * by running the Playwright tests for the Walgreens barcode generation flow.
 * 
 * Usage:
 *   npm run test:cash-payment
 *   npm run test:cash-payment:headed
 *   npm run test:cash-payment:debug
 */

const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 Starting Cash Payment Flow Validation...');
console.log('📋 Testing Walgreens Barcode Generation Flow');
console.log('');

// Test configuration
const testFile = 'tests/cash-payment-flow.spec.ts';
const projectDir = __dirname;

// Available test commands - Chrome only, no parallelization, sequential execution
const testCommands = {
  'test:cash-payment': `playwright test ${testFile} --project=chromium --workers=1 --max-failures=1`,
  'test:cash-payment:headed': `playwright test ${testFile} --project=chromium --workers=1 --headed --max-failures=1`,
  'test:cash-payment:debug': `playwright test ${testFile} --project=chromium --workers=1 --debug --max-failures=1`,
  'test:cash-payment:ui': `playwright test ${testFile} --project=chromium --workers=1 --ui --max-failures=1`,
  'test:cash-payment:chrome': `playwright test ${testFile} --project=chromium --workers=1 --max-failures=1`
};

// Get command from arguments
const command = process.argv[2] || 'test:cash-payment';
const testCommand = testCommands[command];

if (!testCommand) {
  console.error('❌ Invalid command. Available commands:');
  Object.keys(testCommands).forEach(cmd => {
    console.log(`   - ${cmd}`);
  });
  process.exit(1);
}

console.log(`🎯 Running command: ${command}`);
console.log(`📁 Project directory: ${projectDir}`);
console.log(`📄 Test file: ${testFile}`);
console.log('');

  try {
    // Change to project directory (parent of scripts)
    const actualProjectDir = path.join(__dirname, '..');
    process.chdir(actualProjectDir);
    
    // Run the test command
    console.log('⏳ Executing Playwright tests...');
    console.log('');
    
    execSync(testCommand, { 
      stdio: 'inherit',
      cwd: actualProjectDir,
      env: { ...process.env, NODE_ENV: 'test' }
    });
  
  console.log('');
  console.log('✅ Cash Payment Flow tests completed successfully!');
  console.log('');
  console.log('📋 Test Summary:');
  console.log('   ✅ Complete cash payment flow');
  console.log('   ✅ Store options validation');
  console.log('   ✅ Barcode generation validation');
  console.log('   ✅ All locators and methods working');
  console.log('');
  console.log('🎉 Implementation validated successfully!');
  
} catch (error) {
  console.error('');
  console.error('❌ Test execution failed:');
  console.error(error.message);
  console.error('');
  console.error('🔧 Troubleshooting:');
  console.error('   1. Ensure all dependencies are installed: npm install');
  console.error('   2. Install Playwright browsers: npm run install-browsers');
  console.error('   3. Check test data configuration');
  console.error('   4. Verify network connectivity');
  console.error('');
  process.exit(1);
}
