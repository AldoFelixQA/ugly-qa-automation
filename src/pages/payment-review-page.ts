import { Page, Locator, FrameLocator, expect } from '@playwright/test';
import { BasePage } from './base-page';

export class PaymentReviewPage extends BasePage {
  // URL
  //private readonly paymentReviewUrl = '/9771ff88-35a5-4c2d-b638-e3557b21793d/payment/review?overseer=true';

  // Locators
  private readonly headerLogo: Locator;
  private readonly sendAmountLabel: Locator;
  private readonly sendAmountValue: Locator;
  private readonly beneficiaryAmountLabel: Locator;
  private readonly beneficiaryAmountValue: Locator;
  private readonly sendNowButton: Locator;
  private readonly cvvIframe: FrameLocator;
  private readonly cvvInput: Locator;
  private readonly confirmPaymentButton: Locator;
  private readonly paymentMethodSection: Locator;
  private readonly changePaymentMethodLink: Locator;
  
  // Cash payment specific locators
  private readonly createBarcodeButton: Locator;
  private readonly cashPaymentMethod: Locator;

  constructor(page: Page) {
    super(page);

    // Initialize locators
    this.headerLogo = page.locator('img[alt="HEADER LOGO"]');
    this.sendAmountLabel = page.locator('p:has-text("Tú envías")');
    this.sendAmountValue = page.locator('p:has-text("Tú envías") + p');
    this.beneficiaryAmountLabel = page.locator('p:has-text("Tu beneficiario recibe")');
    this.beneficiaryAmountValue = page.locator('p:has-text("Tu beneficiario recibe") + p');
    this.sendNowButton = page.getByRole('button', { name: 'Enviar ahora' });
    this.cvvIframe = page.frameLocator('iframe[name*="cvv"]');
    this.cvvInput = this.cvvIframe.locator('[data-testid="Yuno-input__input"]');
    this.confirmPaymentButton = page.getByRole('button', { name: 'Confirmar pago' });
    this.paymentMethodSection = page.locator('p:has-text("Estás pagando con")');
    this.changePaymentMethodLink = page.getByRole('link', { name: 'Cambiar' });
    
    // Initialize cash payment locators
    this.createBarcodeButton = page.getByRole('button', { name: 'Crear código de barras' });
    this.cashPaymentMethod = page.locator('img[alt="Walgreens"]').locator('..');
  }

  async navigateToPaymentReview(url: string): Promise<void> {
    await this.navigateTo(url);
    await this.waitForPageLoad();
  }

  async getSendAmount(): Promise<string> {
    await this.waitForElement(this.sendAmountValue);
    return await this.getText(this.sendAmountValue);
  }

  async getBeneficiaryAmount(): Promise<string> {
    await this.waitForElement(this.beneficiaryAmountValue);
    return await this.getText(this.beneficiaryAmountValue);
  }

  async clickSendNow(): Promise<void> {
    await this.sendNowButton.waitFor({ state: 'visible' });
    await expect(this.sendNowButton).toBeEnabled();
    await this.clickElement(this.sendNowButton);
  }
  /*
    async waitForCvvIframe(): Promise<void> {
      await this.waitForElement(this.cvvIframe);
    }
  */
  async enterCvv(cvv: string): Promise<void> {
    await this.cvvInput.fill(cvv);
  }

  async clickConfirmPayment(): Promise<void> {
    await this.waitForElement(this.confirmPaymentButton);
    await this.clickElement(this.confirmPaymentButton);
  }

  async waitForPaymentProcessing(): Promise<void> {
    // Espera a que el botón tenga el atributo 'disabled'
    await expect(this.confirmPaymentButton).toHaveAttribute('disabled', '');
  }

  async isPaymentMethodVisible(): Promise<boolean> {
    return await this.isElementVisible(this.paymentMethodSection);
  }

  async takePaymentReviewScreenshot(): Promise<void> {
    await this.takeScreenshot('payment-review-page');
  }

  async waitForPageElements(): Promise<void> {
    await this.waitForElement(this.headerLogo);
    await this.waitForElement(this.sendAmountLabel);
    await this.waitForElement(this.beneficiaryAmountLabel);
    await this.waitForElement(this.sendNowButton);
  }

  // Cash payment methods - extending existing functionality
  async clickChangePaymentMethod(): Promise<void> {
    await this.waitForElement(this.changePaymentMethodLink);
    await this.clickElement(this.changePaymentMethodLink);
  }

  async isCreateBarcodeButtonVisible(): Promise<boolean> {
    // Try multiple locators for the create barcode button
    const barcodeButtonLocators = [
      this.createBarcodeButton,
      this.page.getByRole('button', { name: 'Crear código de barras' }),
      this.page.getByText('Crear código de barras'),
      this.page.locator('button:has-text("Crear código de barras")'),
      this.page.locator('button:has-text("Crear")'),
      this.page.locator('button:has-text("código de barras")')
    ];

    for (const locator of barcodeButtonLocators) {
      try {
        if (await this.isElementVisible(locator)) {
          return true;
        }
      } catch (error) {
        // Continue to next locator
        continue;
      }
    }
    return false;
  }

  async clickCreateBarcode(): Promise<void> {
    // Try multiple locators for the create barcode button
    const barcodeButtonLocators = [
      this.createBarcodeButton,
      this.page.getByRole('button', { name: 'Crear código de barras' }),
      this.page.getByText('Crear código de barras'),
      this.page.locator('button:has-text("Crear código de barras")'),
      this.page.locator('button:has-text("Crear")'),
      this.page.locator('button:has-text("código de barras")')
    ];

    let buttonFound = false;
    for (const locator of barcodeButtonLocators) {
      try {
        if (await this.isElementVisible(locator)) {
          await this.clickElement(locator);
          buttonFound = true;
          break;
        }
      } catch (error) {
        // Continue to next locator
        continue;
      }
    }

    if (!buttonFound) {
      throw new Error('Create barcode button not found with any locator');
    }
  }

  async isCashPaymentMethodSelected(): Promise<boolean> {
    return await this.isElementVisible(this.cashPaymentMethod);
  }

  async waitForCashPaymentMethod(): Promise<void> {
    await this.waitForElement(this.cashPaymentMethod);
  }

  async validateCashPaymentMethod(): Promise<boolean> {
    const methodText = await this.getText(this.cashPaymentMethod);
    return methodText.includes('Efectivo en Walgreens') || methodText.includes('Walgreens');
  }
} 