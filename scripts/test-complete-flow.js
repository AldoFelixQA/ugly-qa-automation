#!/usr/bin/env node

const { extractOrderId, updateTestData } = require('./integration-test.js');

// Simular el flujo completo
async function testCompleteFlow() {
  console.log('🔍 TESTING: Flujo completo de extracción y actualización...');
  console.log('==========================================');
  
  // Simular el output problemático
  const problematicOutput = `🚀 Starting test order creation...
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
📊 Result: { "orderId": "e2a2f653-0410-4be1-8523-4e95d7773246", "workflowId": "e2a2f653-0410-4be1-8523-4e95d7773246", "message": "Order created and process started successfully" }

🎯 ORDER CREATION SUCCESSFUL
================================
Order ID: e2a2f653-0410-4be1-8523-4e95d7773246, Workflow ID: e2a2f653-0410-4be1-8523-4e95d7773246
================================`;

  try {
    // Paso 1: Extraer orderId
    console.log('📋 PASO 1: Extrayendo orderId...');
    const orderId = extractOrderId(problematicOutput);
    console.log(`✅ OrderId extraído: ${orderId}`);
    
    // Paso 2: Actualizar test-data.ts
    console.log('\n📋 PASO 2: Actualizando test-data.ts...');
    updateTestData(orderId);
    
    console.log('\n🎯 FLUJO COMPLETADO');
    console.log('==========================================');
    
  } catch (error) {
    console.log('❌ ERROR:', error.message);
  }
}

if (require.main === module) {
  testCompleteFlow();
}

module.exports = { testCompleteFlow };
