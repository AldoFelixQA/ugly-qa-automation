#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Colores para output
const colors = {
  blue: '\x1b[34m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'blue') {
  const timestamp = new Date().toISOString();
  console.log(`${colors[color]}[${timestamp}] ${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

// Function to extract orderId from log output
function extractOrderIdFromLog(logOutput) {
  const lines = logOutput.split('\n');
  
  // Search for "Order ID:" pattern
  for (const line of lines) {
    if (line.includes('Order ID:')) {
      const match = line.match(/Order ID:\s*([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i);
      if (match && match[1]) {
        return match[1].trim();
      }
    }
  }
  
  // Search for JSON pattern with orderId
  for (const line of lines) {
    if (line.includes('"orderId"')) {
      const jsonMatch = line.match(/"orderId":\s*"([^"]+)"/);
      if (jsonMatch && jsonMatch[1]) {
        const orderId = jsonMatch[1].trim();
        if (orderId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
          return orderId;
        }
      }
    }
  }
  
  // Search for any UUID in the output
  const uuidMatches = logOutput.match(/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/gi);
  if (uuidMatches && uuidMatches.length > 0) {
    // Return the first valid UUID found
    for (const uuid of uuidMatches) {
      if (uuid.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
        return uuid;
      }
    }
  }
  
  throw new Error('Could not extract orderId from log output');
}

// Function to update cash payment test data with real order ID
function updateCashPaymentTestDataWithRealOrder(orderId) {
  const testDataPath = path.join(__dirname, '../src/fixtures/cash-payment-test-data.ts');
  
  if (!fs.existsSync(testDataPath)) {
    throw new Error(`cash-payment-test-data.ts file not found at: ${testDataPath}`);
  }
  
  let content = fs.readFileSync(testDataPath, 'utf8');
  
  // Validate that orderId is a valid UUID
  if (!orderId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
    throw new Error(`Invalid OrderId: ${orderId}. Must be a valid UUID.`);
  }
  
  // Replace any existing UUIDs in URLs with the new orderId
  const uuidPattern = /([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/gi;
  content = content.replace(uuidPattern, orderId);
  
  // Also replace placeholder if it exists
  content = content.replace(/placeholder/g, orderId);
  
  fs.writeFileSync(testDataPath, content, 'utf8');
  logSuccess(`Cash payment test data updated with real orderId: ${orderId}`);
  
  // Verify that the replacement was successful
  const updatedContent = fs.readFileSync(testDataPath, 'utf8');
  if (!updatedContent.includes(orderId)) {
    throw new Error('Error: OrderId was not updated correctly in the cash payment test data file');
  }
  
  // Additional verification - check that URLs contain the orderId
  const urlPattern = new RegExp(`https://test\\.pay\\.felixpago\\.com/${orderId}/`, 'g');
  const urlMatches = updatedContent.match(urlPattern);
  if (!urlMatches || urlMatches.length < 3) {
    throw new Error(`Error: Not all URLs were updated correctly. Expected at least 3 URLs with orderId ${orderId}`);
  }
  
  logSuccess(`Verified ${urlMatches.length} URLs updated with orderId: ${orderId}`);
  return orderId;
}

// Function to simulate order creation log (for testing)
function simulateOrderCreationLog() {
  // This simulates the log output from a real order creation
  const mockOrderId = 'fe2cb863-128d-4066-8855-f02b1b9001e5'; // From your previous log
  
  return `
🚀 Starting cash payment order creation...
📋 Cash payment order data: {
  "phoneNumber": "5526535283",
  "phoneCountryCode": "52",
  "conversationId": "8c18e4cb-1ee4-4238-9e6d-4d91e1b1737a",
  "userId": "749f7f6e-bb1a-458e-b277-ea116d99fb08",
  "beneficiaryId": "b59c68b7-34e4-4757-abf2-ce6b631f0f13",
  "deliveryMethodId": "0e6a5d26-2440-4b2a-ad58-c5cee737a3a6",
  "originAmount": 60,
  "destinationAmount": 450,
  "finalAmount": 450,
  "deliveryMethodType": "BANK",
  "fxRate": 18.35,
  "promotionId": "7c1fa89d-54a1-4283-aeed-c207a01ba2db"
}
✅ Order created successfully!
📊 Result: {"orderId": "${mockOrderId}", "workflowId": "workflow-123", "success": true}

🎯 ORDER CREATION SUCCESSFUL
================================
Order ID: ${mockOrderId}
Workflow ID: workflow-123
================================
`;
}

// Main function
async function main() {
  try {
    logInfo('🎯 Starting Order ID Extraction and Update...');
    logInfo('==========================================');
    
    // Get order ID from command line argument or simulate
    const orderIdArg = process.argv[2];
    let orderId;
    
    if (orderIdArg) {
      // Use order ID from command line
      orderId = orderIdArg;
      logInfo(`Using order ID from command line: ${orderId}`);
    } else {
      // Simulate extracting from log (for testing)
      logInfo('No order ID provided, simulating log extraction...');
      const mockLog = simulateOrderCreationLog();
      orderId = extractOrderIdFromLog(mockLog);
      logInfo(`Extracted order ID from simulated log: ${orderId}`);
    }
    
    // Update the test data file
    logInfo('Updating cash-payment-test-data.ts...');
    updateCashPaymentTestDataWithRealOrder(orderId);
    
    logSuccess('🎉 Order ID extraction and update completed successfully!');
    logInfo('==========================================');
    logInfo(`Updated order ID: ${orderId}`);
    logInfo('File updated: src/fixtures/cash-payment-test-data.ts');
    logInfo('All URLs now point to the new order');
    
  } catch (error) {
    logError('💥 Order ID extraction and update failed');
    logError('==========================================');
    logError(`Error: ${error.message}`);
    process.exit(1);
  }
}

// Execute if called directly
if (require.main === module) {
  main();
}

module.exports = { 
  main, 
  extractOrderIdFromLog, 
  updateCashPaymentTestDataWithRealOrder,
  simulateOrderCreationLog 
};
