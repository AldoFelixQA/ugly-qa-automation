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

// Simular el output real que está causando el problema
const realOutput = `🚀 Starting test order creation...
📋 Order data: {
  "phoneNumber": "5526535283",
  "phoneCountryCode": "52",
  "conversationId": "8c18e4cb-1ee4-4238-9e6d-4d91e1b1737a",
  "userId": "749f7f6e-bb1a-458e-b277-ea116d99fb08",
  "beneficiaryId": "b59c68b7-34e4-4757-abf2-ce6b631f0f13",
  "deliveryMethodId": "0e6a5d26-2440-4b2a-ad58-c5cee737a3a6",
  "originAmount": 60.0,
  "destinationAmount": 1101.00,
  "finalAmount": 1101.00,
  "deliveryMethodType": "BANK",
  "fxRate": 18.35,
  "promotionId": "7c1fa89d-54a1-4283-aeed-c207a01ba2db"
}
✅ Order created successfully!
📊 Result: { "orderId": "52497f3e-ce60-4c50-b3e5-f8247b5eb056", "workflowId": "52497f3e-ce60-4c50-b3e5-f8247b5eb056", "message": "Order created and process started successfully" }

🎯 ORDER CREATION SUCCESSFUL
================================
Order ID: 52497f3e-ce60-4c50-b3e5-f8247b5eb056, Workflow ID: 52497f3e-ce60-4c50-b3e5-f8247b5eb056
================================`;

async function testRealOutput() {
  logInfo('🧪 Probando con output real del problema...');
  
  try {
    const result = extractOrderId(realOutput);
    
    logInfo(`📋 Output extraído: ${result}`);
    
    // Validar que sea solo UUID
    if (result.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
      logSuccess(`✅ UUID válido: ${result}`);
    } else {
      logError(`❌ UUID inválido: ${result}`);
    }
    
    // Verificar que no contenga texto adicional
    if (result.includes('Workflow') || result.includes('%20') || result.includes(',')) {
      logError(`❌ Contiene texto adicional: ${result}`);
    } else {
      logSuccess(`✅ Solo contiene UUID: ${result}`);
    }
    
    // Verificar longitud
    if (result.length === 36) {
      logSuccess(`✅ Longitud correcta: ${result.length} caracteres`);
    } else {
      logError(`❌ Longitud incorrecta: ${result.length} caracteres (esperado: 36)`);
    }
    
  } catch (error) {
    logError(`❌ Error: ${error.message}`);
  }
}

if (require.main === module) {
  testRealOutput();
}

module.exports = { testRealOutput };
