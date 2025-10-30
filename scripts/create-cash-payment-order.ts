#!/usr/bin/env ts-node

import { SimpleOverseerClient } from '../lib/overseer-client/simple-client';
import { overseerConfig, validateConfig } from '../lib/overseer-client/config';
import { OrderCreationData, OrderResult } from '../lib/overseer-client/types';

// Cash payment specific order data
const cashPaymentOrderData: OrderCreationData = {
  phoneNumber: "5526535283",
  phoneCountryCode: "52",
  conversationId: "8c18e4cb-1ee4-4238-9e6d-4d91e1b1737a",
  userId: "749f7f6e-bb1a-458e-b277-ea116d99fb08",
  beneficiaryId: "b59c68b7-34e4-4757-abf2-ce6b631f0f13",
  deliveryMethodId: "0e6a5d26-2440-4b2a-ad58-c5cee737a3a6",
  originAmount: 60.0,
  destinationAmount: 450.00, 
  finalAmount: 450.00, 
  deliveryMethodType: "BANK",
  fxRate: 18.35,
  promotionId: "7c1fa89d-54a1-4283-aeed-c207a01ba2db",
};

async function createCashPaymentOrder(): Promise<OrderResult> {
  try {
    validateConfig();
    console.log('🚀 Starting cash payment order creation...');
    console.log('📋 Cash payment order data:', JSON.stringify(cashPaymentOrderData, null, 2));
    
    const client = new SimpleOverseerClient(overseerConfig);
    const result = await client.createAndStartOrder(cashPaymentOrderData);
    
    console.log('✅ Cash payment order created successfully!');
    console.log('📊 Result:', JSON.stringify(result, null, 2));
    return result;
  } catch (error) {
    console.error('❌ Error creating cash payment order:', error);
    throw error;
  }
}

async function main() {
  try {
    const result = await createCashPaymentOrder();
    console.log('\n🎯 CASH PAYMENT ORDER CREATION SUCCESSFUL');
    console.log('==========================================');
    console.log(`Order ID: ${result.orderId}`);
    console.log(`Workflow ID: ${result.workflowId}`);
    console.log('==========================================');
    process.exit(0);
  } catch (error) {
    console.error('\n💥 CASH PAYMENT ORDER CREATION FAILED');
    console.error('==========================================');
    console.error(`Error Message: ${(error as Error).message}`);
    console.error('==========================================');
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export { createCashPaymentOrder, cashPaymentOrderData };
