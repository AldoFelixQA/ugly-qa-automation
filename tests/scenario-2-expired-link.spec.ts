import { test, expect } from '@playwright/test';
import { PaymentReviewPage } from '../src/pages/payment-review-page';
import { Homepage } from '../src/pages/homepage';
import { paymentTestData, homepageData } from '../src/fixtures/test-data';

test.describe('Scenario 2: Link expires and redirects to homepage', () => {
  let paymentReviewPage: PaymentReviewPage;
  let homepage: Homepage;

  test.beforeEach(async ({ page }) => {
    paymentReviewPage = new PaymentReviewPage(page);
    homepage = new Homepage(page);
  });

  test('should redirect to homepage when link expires', async ({ page }) => {
    // Step 1: Navigate to the same payment review URL
    await paymentReviewPage.navigateToPaymentReview();

    // Step 2: Wait for redirect to homepage
    await page.waitForURL(homepageData.expectedUrlPattern, { timeout: 15000 });
    
    // Step 3: Wait for homepage to load
    await homepage.waitForHomepageLoad();
    await homepage.waitForHomepageElements();
    await homepage.takeHomepageScreenshot();

    // Step 4: Validate that we're on the homepage
    const isHomepageLoaded = await homepage.isHomepageLoaded();
    expect(isHomepageLoaded).toBe(true);

    // Step 5: Validate the URL is correct
    const isHomepageUrlValid = await homepage.validateHomepageUrl();
    expect(isHomepageUrlValid).toBe(true);

    // Step 6: Validate page title
    const pageTitle = await homepage.getPageTitle();
    expect(pageTitle).toBe(homepageData.expectedTitle);

    // Step 7: Validate that calculator form is visible
    const isCalculatorFormVisible = await homepage.isCalculatorFormVisible();
    expect(isCalculatorFormVisible).toBe(true);

    // Step 8: Validate that first send free button is visible
    const isFirstSendFreeButtonVisible = await homepage.isFirstSendFreeButtonVisible();
    expect(isFirstSendFreeButtonVisible).toBe(true);

    // Step 9: Validate current URL matches expected pattern
    const currentUrl = await homepage.getCurrentUrl();
    expect(currentUrl).toMatch(/https:\/\/www\.felixpago\.com\/\?ref_source=Web_homepage_wa/);
  });
}); 