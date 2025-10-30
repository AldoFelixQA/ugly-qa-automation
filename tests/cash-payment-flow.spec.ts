import { test, expect } from '../src/fixtures/test-fixtures';
import { PaymentReviewPage } from '../src/pages/payment-review-page';
import { CashPaymentPage } from '../src/pages/cash-payment-page';
import { BarcodeGenerationPage } from '../src/pages/barcode-generation-page';
import { createCashPaymentTestData, defaultCashPaymentTestData, cashPaymentValidations } from '../src/fixtures/cash-payment-test-data';

test.describe('Cash Payment Flow - Walgreens Barcode Generation', () => {
  let paymentReviewPage: PaymentReviewPage;
  let cashPaymentPage: CashPaymentPage;
  let barcodeGenerationPage: BarcodeGenerationPage;

  // Force sequential execution - no parallelization
  test.describe.configure({ mode: 'serial' });

  test.beforeEach(async ({ page }) => {
    paymentReviewPage = new PaymentReviewPage(page);
    cashPaymentPage = new CashPaymentPage(page);
    barcodeGenerationPage = new BarcodeGenerationPage(page);
  });

  test('Complete Cash Payment Flow - Walgreens Barcode Generation', async ({ page }) => {
    console.log('🚀 Starting Cash Payment Flow Test...');

    // Get cash payment test data (using default data with working order)
    const cashPaymentData = defaultCashPaymentTestData;
    
    // Step 1: Navigate to payment review page
    console.log('📍 Step 1: Navigating to payment review page...');
    await paymentReviewPage.navigateToPaymentReview(cashPaymentData.paymentReviewUrl);
    await paymentReviewPage.waitForPageElements();
    await paymentReviewPage.takePaymentReviewScreenshot();
    
    // Validate initial page load
    expect(await paymentReviewPage.isPaymentMethodVisible()).toBe(true);
    console.log('✅ Step 1 completed: Payment review page loaded');

    // Step 2: Click "Cambiar" to change payment method
    console.log('📍 Step 2: Clicking "Cambiar" to change payment method...');
    await paymentReviewPage.clickChangePaymentMethod();
    
    // Wait for payment methods page
    await cashPaymentPage.waitForPaymentMethodsPage();
    await cashPaymentPage.takeStoreSelectionScreenshot();
    console.log('✅ Step 2 completed: Payment methods page opened');

    // Step 3: Scroll to bottom to see cash payment option
    console.log('📍 Step 3: Scrolling to bottom to see cash payment options...');
    await paymentReviewPage.scrollToBottom();
    await page.waitForTimeout(1000); // Small delay to ensure scroll completed
    console.log('✅ Step 3 completed: Scrolled to bottom');

    // Step 4: Click "Pagar con efectivo en tienda"
    console.log('📍 Step 4: Selecting "Pagar con efectivo en tienda"...');
    await cashPaymentPage.clickCashPaymentInStore();
    
    // Wait for store selection page
    await cashPaymentPage.waitForCashPaymentPage();
    await cashPaymentPage.takeCashPaymentScreenshot();
    console.log('✅ Step 4 completed: Store selection page opened');

    // Validate store options are available
    expect(await cashPaymentPage.validateStoreOptionsAvailable()).toBe(true);
    expect(await cashPaymentPage.isWalgreensVisible()).toBe(true);
    console.log('✅ Store options validated');

    // Step 5: Select Walgreens (first option)
    console.log('📍 Step 5: Selecting Walgreens store...');
    await cashPaymentPage.selectWalgreens();
    
    // Wait for return to payment review page
    await paymentReviewPage.waitForPageElements();
    await paymentReviewPage.waitForCashPaymentMethod();
    await paymentReviewPage.takePaymentReviewScreenshot();
    console.log('✅ Step 5 completed: Walgreens selected, returned to payment review');

    // Validate cash payment method is selected
    expect(await paymentReviewPage.isCashPaymentMethodSelected()).toBe(true);
    expect(await paymentReviewPage.validateCashPaymentMethod()).toBe(true);
    console.log('✅ Cash payment method validated');

    // Step 6: Click "Crear código de barras"
    console.log('📍 Step 6: Clicking "Crear código de barras"...');
    expect(await paymentReviewPage.isCreateBarcodeButtonVisible()).toBe(true);
    await paymentReviewPage.clickCreateBarcode();
    console.log('✅ Step 6 completed: Barcode generation initiated');

    // Step 7-11: Wait for barcode generation and validate all elements
    console.log('📍 Steps 7-11: Waiting for barcode generation and validating elements...');
    await barcodeGenerationPage.waitForBarcodePage();
    await barcodeGenerationPage.waitForBarcodeGeneration();
    await barcodeGenerationPage.takeBarcodeScreenshot();
    console.log('✅ Barcode generation completed');

    // Validate all required elements
    const validationResults = await barcodeGenerationPage.validateCompleteBarcodeFlow();
    
    // Step 8: Validate "Enseña este código" in header
    expect(validationResults.headerText).toBe(true);
    expect(await barcodeGenerationPage.getHeaderText()).toBe(cashPaymentValidations.headerText);
    console.log('✅ Step 8: Header text "Enseña este código" validated');

    // Step 9: Validate code length (30 characters)
    expect(validationResults.codeLength).toBe(true);
    expect(validationResults.generatedCode.length).toBe(cashPaymentValidations.codeLength);
    console.log(`✅ Step 9: Code length validated (${validationResults.generatedCode.length} characters)`);
    console.log(`📋 Generated code: ${validationResults.generatedCode}`);

    // Step 10: Validate final legend
    expect(validationResults.finalLegend).toBe(true);
    expect(await barcodeGenerationPage.getFinalLegend()).toBe(cashPaymentValidations.finalLegend);
    console.log('✅ Step 10: Final legend validated');

    // Additional validations
    expect(validationResults.walgreensLogo).toBe(true);
    console.log('✅ Walgreens logo validated');

    // Validate URL
    expect(await barcodeGenerationPage.validateBarcodeUrl()).toBe(true);
    console.log('✅ Barcode page URL validated');

    // Validate all required elements are present
    expect(await barcodeGenerationPage.validateAllRequiredElements()).toBe(true);
    console.log('✅ All required elements validated');

    // Take final screenshot
    await barcodeGenerationPage.takeBarcodeCodeScreenshot();
    console.log('📸 Final screenshot taken');

    console.log('🎉 Cash Payment Flow Test completed successfully!');
    console.log(`📋 Summary:`);
    console.log(`   - Generated Code: ${validationResults.generatedCode}`);
    console.log(`   - Code Length: ${validationResults.generatedCode.length} characters`);
    console.log(`   - Header Text: ${await barcodeGenerationPage.getHeaderText()}`);
    console.log(`   - Final Legend: ${await barcodeGenerationPage.getFinalLegend()}`);
  });

  test('Cash Payment Flow - Validate Store Options', async ({ page }) => {
    console.log('🚀 Starting Store Options Validation Test...');

    // Get cash payment test data
    const cashPaymentData = defaultCashPaymentTestData;

    // Navigate to payment review page
    await paymentReviewPage.navigateToPaymentReview(cashPaymentData.paymentReviewUrl);
    await paymentReviewPage.waitForPageElements();

    // Click change payment method
    await paymentReviewPage.clickChangePaymentMethod();
    await cashPaymentPage.waitForPaymentMethodsPage();

    // Scroll to bottom
    await paymentReviewPage.scrollToBottom();
    await page.waitForTimeout(1000);

    // Click cash payment
    await cashPaymentPage.clickCashPaymentInStore();
    await cashPaymentPage.waitForCashPaymentPage();

    // Validate all store options are visible
    expect(await cashPaymentPage.isWalgreensVisible()).toBe(true);
    expect(await cashPaymentPage.isCVSVisible()).toBe(true);
    expect(await cashPaymentPage.isSevenElevenVisible()).toBe(true);
    expect(await cashPaymentPage.isWalmartVisible()).toBe(true);
    expect(await cashPaymentPage.isCaseysVisible()).toBe(true);
    expect(await cashPaymentPage.isOfficeDepotVisible()).toBe(true);

    console.log('✅ All store options validated successfully');
  });

  test('Cash Payment Flow - Barcode Validation Only', async ({ page }) => {
    console.log('🚀 Starting Barcode Validation Test...');

    // Get cash payment test data
    const cashPaymentData = createCashPaymentTestData(''); // Will be updated by integration script

    // Navigate directly to barcode page (simulating completed flow)
    await barcodeGenerationPage.navigateTo(cashPaymentData.barcodeUrl);
    
    // Wait for barcode page
    await barcodeGenerationPage.waitForBarcodePage();
    
    // Validate barcode elements
    expect(await barcodeGenerationPage.validateHeaderText()).toBe(true);
    expect(await barcodeGenerationPage.validateCodeLength(cashPaymentValidations.codeLength)).toBe(true);
    expect(await barcodeGenerationPage.validateFinalLegend()).toBe(true);
    expect(await barcodeGenerationPage.validateWalgreensLogo()).toBe(true);
    
    // Get generated code
    const generatedCode = await barcodeGenerationPage.getGeneratedCode();
    expect(generatedCode.length).toBe(cashPaymentValidations.codeLength);
    expect(/^\d{30}$/.test(generatedCode)).toBe(true);
    
    console.log(`✅ Barcode validation completed - Code: ${generatedCode}`);
  });
});
