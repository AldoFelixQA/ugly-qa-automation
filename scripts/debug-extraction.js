#!/usr/bin/env node

const { extractOrderId } = require('./integration-test.js');

// Simular el output exacto que está causando el problema
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

async function debugExtraction() {
  console.log('🔍 DEBUGGING: Simulando el output problemático...');
  console.log('==========================================');
  
  try {
    const result = extractOrderId(problematicOutput);
    console.log('==========================================');
    console.log(`🎯 RESULTADO FINAL: ${result}`);
    
    // Verificar si contiene texto adicional
    if (result.includes('%20') || result.includes('Workflow') || result.includes(',')) {
      console.log('❌ PROBLEMA: El resultado contiene texto adicional');
      console.log(`❌ Resultado problemático: ${result}`);
    } else {
      console.log('✅ ÉXITO: El resultado está limpio');
      console.log(`✅ Resultado correcto: ${result}`);
    }
    
  } catch (error) {
    console.log('❌ ERROR:', error.message);
  }
}

if (require.main === module) {
  debugExtraction();
}

module.exports = { debugExtraction };
