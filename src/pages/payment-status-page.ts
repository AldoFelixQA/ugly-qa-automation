import { Page, Locator } from '@playwright/test';
import { BasePage } from './base-page';

export class PaymentStatusPage extends BasePage {
  // URL pattern
  private readonly successUrlPattern = /.*\/payment\/status\?status=APPROVED&overseer=true/;

  // Locators
  private readonly successIcon: Locator;
  private readonly successMessage: Locator;
  private readonly beneficiaryMessage: Locator;
  private readonly backToWhatsAppButton: Locator;
  private readonly headerLogo: Locator;

  constructor(page: Page) {
    super(page);
    
    // Initialize locators
    this.successIcon = page.locator('img[alt="status"]');
    this.successMessage = page.getByRole('heading', { name: '¡Listo! Tu pago se completó con éxito.' });
    this.beneficiaryMessage = page.locator('p:has-text("💸 Aldo Card Card recibirá")');
    this.backToWhatsAppButton = page.getByRole('button', { name: 'Volver a WhatsApp' });
    this.headerLogo = page.locator('img[alt="HEADER LOGO"]');
  }

  async waitForSuccessPage(timeout: number = 30000): Promise<void> {
    try {
      // Check if page is still open before starting
      if (this.page.isClosed()) {
        throw new Error('Page has been closed before waiting for success page');
      }
      
      // Wait for URL to change to success page with extended timeout
      await this.page.waitForURL(this.successUrlPattern, { timeout });
      
      // Check if page is still open after URL change
      if (this.page.isClosed()) {
        throw new Error('Page was closed after URL change');
      }
      
      // Quick check if elements are already visible (no need to wait)
      const elementsAlreadyVisible = await this.checkIfElementsAlreadyVisible();
      if (elementsAlreadyVisible) {
        console.log('✅ Success elements already visible, skipping wait');
        await this.verifySuccessPageReady();
        return;
      }
      
      // Wait for DOM to be ready (more reliable than networkidle)
      await this.page.waitForLoadState('domcontentloaded', { timeout: 3000 });
      
      // Check if page is still open after DOM load
      if (this.page.isClosed()) {
        throw new Error('Page was closed after DOM load');
      }
      
      // Wait for critical elements to be visible with retries
      await this.waitForSuccessElementsWithRetry();
      
      // Verify that the page is actually ready
      await this.verifySuccessPageReady();
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.log(`⚠️  Error in waitForSuccessPage: ${errorMessage}`);
      
      // Only attempt recovery if page is still open
      if (!this.page.isClosed()) {
        console.log('🔄 Attempting recovery...');
        try {
          await this.waitForSuccessElementsWithRetry();
        } catch (recoveryError) {
          const recoveryErrorMessage = recoveryError instanceof Error ? recoveryError.message : String(recoveryError);
          console.log(`❌ Recovery failed: ${recoveryErrorMessage}`);
          throw recoveryError;
        }
      } else {
        console.log('❌ Page is closed, cannot attempt recovery');
        throw new Error('Page was closed during success page wait');
      }
    }
  }

  async checkIfElementsAlreadyVisible(): Promise<boolean> {
    try {
      // Check if page is still open
      if (this.page.isClosed()) {
        return false;
      }
      
      // Quick check if all critical elements are already visible
      const checks = await Promise.all([
        this.successIcon.isVisible().catch(() => false),
        this.successMessage.isVisible().catch(() => false),
        this.beneficiaryMessage.isVisible().catch(() => false)
      ]);
      
      return checks.every(result => result === true);
    } catch (error) {
      return false;
    }
  }

  async isSuccessMessageVisible(): Promise<boolean> {
    return await this.isElementVisible(this.successMessage);
  }

  async getSuccessMessage(): Promise<string> {
    return await this.getText(this.successMessage);
  }

  async getBeneficiaryMessage(): Promise<string> {
    return await this.getText(this.beneficiaryMessage);
  }

  async isBackToWhatsAppButtonVisible(): Promise<boolean> {
    return await this.isElementVisible(this.backToWhatsAppButton);
  }

  async clickBackToWhatsApp(): Promise<void> {
    await this.clickElement(this.backToWhatsAppButton);
  }

  async takeSuccessScreenshot(): Promise<void> {
    await this.takeScreenshot('payment-success-page');
  }

  async waitForSuccessElements(): Promise<void> {
    await this.waitForElement(this.successIcon);
    await this.waitForElement(this.successMessage);
    await this.waitForElement(this.beneficiaryMessage);
  }

  async waitForSuccessElementsWithRetry(maxRetries: number = 3, baseTimeout: number = 5000): Promise<void> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`🔄 Attempt ${attempt}/${maxRetries} - Waiting for success elements...`);
        
        // Check if page is still open before proceeding
        if (this.page.isClosed()) {
          throw new Error('Page has been closed during wait');
        }
        
        // Shorter timeout for faster detection
        const timeout = baseTimeout;
        
        // Wait for critical elements with shorter timeout
        await Promise.all([
          this.waitForElement(this.successIcon, 'visible', timeout),
          this.waitForElement(this.successMessage, 'visible', timeout),
          this.waitForElement(this.beneficiaryMessage, 'visible', timeout)
        ]);
        
        console.log(`✅ Success elements found on attempt ${attempt}`);
        return;
        
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.log(`❌ Attempt ${attempt} failed: ${errorMessage}`);
        
        if (attempt === maxRetries) {
          throw new Error(`Could not find success elements after ${maxRetries} attempts`);
        }
        
        // Shorter wait between attempts
        if (!this.page.isClosed()) {
          try {
            await this.page.waitForTimeout(1000);
          } catch (timeoutError) {
            const timeoutErrorMessage = timeoutError instanceof Error ? timeoutError.message : String(timeoutError);
            console.log(`⚠️ Page closed during timeout wait: ${timeoutErrorMessage}`);
            throw new Error('Page was closed during retry wait');
          }
        } else {
          throw new Error('Page was closed during retry wait');
        }
      }
    }
  }

  async verifySuccessPageReady(): Promise<void> {
    // Check if page is still open before verification
    if (this.page.isClosed()) {
      throw new Error('Page was closed during verification');
    }
    
    try {
      // Verify that elements are actually visible and functional
      const checks = [
        this.isSuccessMessageVisible(),
        this.isBackToWhatsAppButtonVisible()
      ];
      
      const results = await Promise.all(checks);
      
      if (!results.every(result => result)) {
        throw new Error('Success page is not completely ready');
      }
      
      console.log('✅ Success page verified and ready');
      
    } catch (error) {
      // Check if error is due to page being closed
      if (this.page.isClosed()) {
        throw new Error('Page was closed during verification');
      }
      throw error;
    }
  }

  async validateSuccessUrl(): Promise<boolean> {
    const currentUrl = await this.getCurrentUrl();
    return this.successUrlPattern.test(currentUrl);
  }

  async validateBeneficiaryMessage(expectedSendAmount: string, expectedReceiveAmount: string): Promise<boolean> {
    const message = await this.getBeneficiaryMessage();
    return message.includes(expectedReceiveAmount) && message.includes(expectedSendAmount);
  }
} 