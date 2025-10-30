//import { test, expect } from '@playwright/test';
import { test, expect } from '../src/fixtures/test-fixtures';
import { PaymentReviewPage } from '../src/pages/payment-review-page';
import { PaymentStatusPage } from '../src/pages/payment-status-page';
import { Homepage } from '../src/pages/homepage';
//import { paymentTestData, successMessages, homepageData } from '../src/fixtures/test-data';

test.describe('Combined Payment Scenarios', () => {
  let paymentReviewPage: PaymentReviewPage;
  let paymentStatusPage: PaymentStatusPage;
  let homepage: Homepage;

  test.beforeEach(async ({ page }) => {
    paymentReviewPage = new PaymentReviewPage(page);
    paymentStatusPage = new PaymentStatusPage(page);
    homepage = new Homepage(page);
  });

  // Force sequential execution to ensure Scenario 1 runs before Scenario 2
  // This prevents parallel execution and ensures proper test order
  test.describe.configure({ mode: 'serial' });

  test('01 - Scenario 1: Successful payment flow', async ({ page, paymentData, successMessages }) => {
    // Navigate to payment review page
    await paymentReviewPage.navigateToPaymentReview(paymentData.paymentReviewUrl);
    await paymentReviewPage.waitForPageElements();
    await paymentReviewPage.takePaymentReviewScreenshot();
    /*
        // Get and validate amounts
        const sendAmount = await paymentReviewPage.getSendAmount();
        const beneficiaryAmount = await paymentReviewPage.getBeneficiaryAmount();
        expect(sendAmount).toBe(paymentData.sendAmount);
        expect(beneficiaryAmount).toBe(paymentData.beneficiaryAmount);
     */
    // Complete payment process
    await paymentReviewPage.clickSendNow();
    await paymentReviewPage.enterCvv(paymentData.cvv);
    await paymentReviewPage.clickConfirmPayment();
    await paymentReviewPage.waitForPaymentProcessing();

    // Validate success page with robust waiting
    console.log('🎯 Waiting for success page...');
    await paymentStatusPage.waitForSuccessPage(45000); // 45 seconds timeout
    console.log('✅ Success page loaded correctly');
    
    await paymentStatusPage.takeSuccessScreenshot();

    // Validate success conditions
    expect(await paymentStatusPage.validateSuccessUrl()).toBe(true);
    expect(await paymentStatusPage.getSuccessMessage()).toBe(successMessages.successTitle);
    expect(await paymentStatusPage.getBeneficiaryMessage()).toBe(successMessages.beneficiaryMessage);
    expect(await paymentStatusPage.isBackToWhatsAppButtonVisible()).toBe(true);
    
    // Small delay to ensure proper separation between tests
    await page.waitForTimeout(1000);
  });

  test('02 - Scenario 2: Expired link redirects to homepage', async ({ page, paymentData, homepageData }) => {
    // Navigate to payment review page (should redirect due to expired link)
    await paymentReviewPage.navigateToPaymentReview(paymentData.paymentReviewUrl);

    // Wait for redirect to homepage
    await page.waitForURL(homepageData.expectedUrlPattern, { timeout: 15000 });
    //await page.pause();
    // Validate homepage
    await homepage.waitForHomepageLoad();
    await homepage.waitForHomepageElements();
    await homepage.takeHomepageScreenshot();

    // Validate homepage conditions  
    expect(await homepage.isHomepageLoaded()).toBe(true);
    expect(await homepage.validateHomepageUrl()).toBe(true);
    expect(await homepage.getPageTitle()).toBe(homepageData.expectedTitle);
    expect(await homepage.isCalculatorFormVisible()).toBe(true);
    expect(await homepage.isFirstSendFreeButtonVisible()).toBe(true);
  });
}); 