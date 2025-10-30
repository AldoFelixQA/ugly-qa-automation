#!/usr/bin/env node

const { extractOrderId } = require('./integration-test.js');

// Colores para output
const colors = {
  blue: '\x1b[34m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  reset: '\x1b[0m'
};

function log(message, color = 'blue') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

// Casos de prueba para la extracción de orderId
const testCases = [
  {
    name: 'JSON con orderId',
    output: `🚀 Starting test order creation...
📋 Order data: { ... }
✅ Order created successfully!
📊 Result: { "orderId": "00c803e0-b5a5-4162-a673-17c37649ec08", "workflowId": "715958c4-c2f1-4562-b0c5-05f9792ade78", "message": "Order created and process started successfully" }

🎯 ORDER CREATION SUCCESSFUL
================================
Order ID: 00c803e0-b5a5-4162-a673-17c37649ec08
Workflow ID: 715958c4-c2f1-4562-b0c5-05f9792ade78
================================`,
    expected: '00c803e0-b5a5-4162-a673-17c37649ec08'
  },
  {
    name: 'Solo línea Order ID',
    output: `🎯 ORDER CREATION SUCCESSFUL
================================
Order ID: 9e176ea4-61d6-4e29-939f-0f9976e31e33
Workflow ID: 715958c4-c2f1-4562-b0c5-05f9792ade78
================================`,
    expected: '9e176ea4-61d6-4e29-939f-0f9976e31e33'
  },
  {
    name: 'Output con texto adicional',
    output: `✅ Order created successfully!
📊 Result: { "orderId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890", "workflowId": "f1e2d3c4-b5a6-9870-fedc-ba0987654321" }`,
    expected: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
  },
  {
    name: 'Caso real del problema reportado',
    output: `🚀 Starting test order creation...
📋 Order data: { ... }
✅ Order created successfully!
📊 Result: { "orderId": "9e176ea4-61d6-4e29-939f-0f9976e31e33", "workflowId": "715958c4-c2f1-4562-b0c5-05f9792ade78", "message": "Order created and process started successfully" }

🎯 ORDER CREATION SUCCESSFUL
================================
Order ID: 9e176ea4-61d6-4e29-939f-0f9976e31e33
Workflow ID: 715958c4-c2f1-4562-b0c5-05f9792ade78
================================`,
    expected: '9e176ea4-61d6-4e29-939f-0f9976e31e33'
  },
  {
    name: 'Problema actual con texto codificado en URL',
    output: `🚀 Starting test order creation...
📋 Order data: { ... }
✅ Order created successfully!
📊 Result: { "orderId": "52497f3e-ce60-4c50-b3e5-f8247b5eb056", "workflowId": "52497f3e-ce60-4c50-b3e5-f8247b5eb056", "message": "Order created and process started successfully" }

🎯 ORDER CREATION SUCCESSFUL
================================
Order ID: 52497f3e-ce60-4c50-b3e5-f8247b5eb056, Workflow ID: 52497f3e-ce60-4c50-b3e5-f8247b5eb056
================================`,
    expected: '52497f3e-ce60-4c50-b3e5-f8247b5eb056'
  }
];

async function testOrderIdExtraction() {
  logInfo('🧪 Probando extracción de orderId...');
  
  let passed = 0;
  let failed = 0;
  
  for (const testCase of testCases) {
    try {
      logInfo(`\n📋 Probando: ${testCase.name}`);
      
      const result = extractOrderId(testCase.output);
      
      if (result === testCase.expected) {
        logSuccess(`✅ Correcto: ${result}`);
        passed++;
      } else {
        logError(`❌ Incorrecto: Esperado "${testCase.expected}", obtenido "${result}"`);
        failed++;
      }
    } catch (error) {
      logError(`❌ Error: ${error.message}`);
      failed++;
    }
  }
  
  logInfo(`\n📊 Resultados:`);
  logSuccess(`✅ Pasaron: ${passed}`);
  if (failed > 0) {
    logError(`❌ Fallaron: ${failed}`);
  }
  
  if (failed === 0) {
    logSuccess('🎉 Todas las pruebas pasaron!');
  } else {
    logError('💥 Algunas pruebas fallaron');
    process.exit(1);
  }
}

if (require.main === module) {
  testOrderIdExtraction();
}

module.exports = { testOrderIdExtraction };
