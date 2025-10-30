import { test, expect } from '@playwright/test';
import { PaymentReviewPage } from '../src/pages/payment-review-page';
import { PaymentStatusPage } from '../src/pages/payment-status-page';
import { paymentTestData, successMessages } from '../src/fixtures/test-data';

test.describe('Scenario 1: Send money successfully', () => {
  let paymentReviewPage: PaymentReviewPage;
  let paymentStatusPage: PaymentStatusPage;

  test.beforeEach(async ({ page }) => {
    paymentReviewPage = new PaymentReviewPage(page);
    paymentStatusPage = new PaymentStatusPage(page);
  });

  test('should complete payment successfully', async ({ page }) => {
    // Step 1: Navigate to payment review page
    await paymentReviewPage.navigateToPaymentReview();
    await paymentReviewPage.waitForPageElements();
    await paymentReviewPage.takePaymentReviewScreenshot();

    // Step 2: Save the amounts
    const sendAmount = await paymentReviewPage.getSendAmount();
    const beneficiaryAmount = await paymentReviewPage.getBeneficiaryAmount();

    // Assertions for amounts
    expect(sendAmount).toBe(paymentTestData.sendAmount);
    expect(beneficiaryAmount).toBe(paymentTestData.beneficiaryAmount);

    // Step 3: Click "Enviar ahora" button
    await paymentReviewPage.clickSendNow();

    // Step 4: Wait for CVV iframe and enter CVV
    await paymentReviewPage.enterCvv(paymentTestData.cvv);

    // Step 5: Click "Confirmar pago" button
    await paymentReviewPage.clickConfirmPayment();

    // Step 6: Wait for payment processing
    await paymentReviewPage.waitForPaymentProcessing();

    // Step 7: Wait for success page
    await paymentStatusPage.waitForSuccessPage();
    await paymentStatusPage.waitForSuccessElements();
    await paymentStatusPage.takeSuccessScreenshot();

    // Step 8: Validate success URL
    const isSuccessUrl = await paymentStatusPage.validateSuccessUrl();
    expect(isSuccessUrl).toBe(true);

    // Step 9: Validate success message
    const successMessage = await paymentStatusPage.getSuccessMessage();
    expect(successMessage).toBe(successMessages.successTitle);

    // Step 10: Validate beneficiary message
    const beneficiaryMessage = await paymentStatusPage.getBeneficiaryMessage();
    expect(beneficiaryMessage).toBe(successMessages.beneficiaryMessage);

    // Step 11: Validate that amounts match
    const isBeneficiaryMessageValid = await paymentStatusPage.validateBeneficiaryMessage(
      sendAmount,
      beneficiaryAmount
    );
    expect(isBeneficiaryMessageValid).toBe(true);

    // Step 12: Validate back to WhatsApp button is visible
    const isBackButtonVisible = await paymentStatusPage.isBackToWhatsAppButtonVisible();
    expect(isBackButtonVisible).toBe(true);
  });
}); 