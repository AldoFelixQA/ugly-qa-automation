// src/fixtures/test-fixtures.ts
import { test as base } from '@playwright/test';

// Import the data and interfaces from the file 'test-data.ts'
import {
  PaymentData,
  createPaymentTestData,
  defaultPaymentTestData,
  SuccessMessages,
  successMessages,
  HomepageData,
  homepageData,
} from './test-data';

// Define a type for the new fixtures that you are going to create
type MyTestFixtures = {
  paymentData: PaymentData;
  successMessages: SuccessMessages;
  homepageData: HomepageData;
};

// Extend the object `test` of Playwright to include our fixtures
export const test = base.extend<MyTestFixtures>({
  // Define the fixture `paymentData` - this will be set dynamically
  paymentData: async ({}, use) => {
    // For now, use default data - this will be updated by the test runner
    await use(createPaymentTestData('29baa846-d781-4459-8268-b549bbcadf7f'));
  },

  // Define the fixture `successMessages`
  successMessages: async ({}, use) => {
    await use(successMessages);
  },

  // Define the fixture `homepageData`
  homepageData: async ({}, use) => {
    await use(homepageData);
  },
});

export { expect } from '@playwright/test';