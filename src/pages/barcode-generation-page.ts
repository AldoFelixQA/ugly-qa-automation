import { Page, Locator } from '@playwright/test';
import { BasePage } from './base-page';

export class BarcodeGenerationPage extends BasePage {
  // URL pattern
  private readonly barcodeUrlPattern = /.*\/payment\/barcode\?overseer=true/;

  // Locators
  private readonly headerLogo: Locator;
  private readonly backButton: Locator;
  private readonly headerText: Locator;
  private readonly instructionText: Locator;
  private readonly barcodeImage: Locator;
  private readonly barcodeCode: Locator;
  private readonly expirationText: Locator;
  private readonly finalLegend: Locator;
  private readonly totalAmountSection: Locator;
  private readonly totalAmountValue: Locator;
  private readonly walgreensLogo: Locator;
  private readonly instructionsSection: Locator;
  private readonly instructionsList: Locator;
  private readonly cashDeliveredButton: Locator;
  private readonly loadingCoin: Locator;

  constructor(page: Page) {
    super(page);

    // Initialize locators
    this.headerLogo = page.locator('img[alt="HEADER LOGO"]');
    this.backButton = page.locator('button').filter({ hasText: 'left arrow' });
    this.headerText = page.getByRole('heading', { name: 'Enseña este código' });
    this.instructionText = page.locator('p:has-text("Enseña este código en Walgreens para realizar el depósito en efectivo.")');
    this.barcodeImage = page.locator('img').filter({ hasText: /^\d{30}$/ });
    this.barcodeCode = page.locator('generic').filter({ hasText: /^\d{30}$/ });
    this.expirationText = page.locator('p:has-text("Expira el")');
    this.finalLegend = page.locator('p:has-text("Toma una captura para tener el código a la mano. Recuerda que siempre puedes crear uno nuevo.")');
    this.totalAmountSection = page.locator('generic').filter({ hasText: 'Monto total:' });
    this.totalAmountValue = page.getByRole('heading', { name: '$450.00 USD' });
    this.walgreensLogo = page.locator('img[alt="Walgreens logo"]');
    this.instructionsSection = page.getByRole('heading', { name: 'Instrucciones :' });
    this.instructionsList = page.locator('list');
    this.cashDeliveredButton = page.getByRole('button', { name: 'Ya entregué el efectivo' });
    this.loadingCoin = page.locator('img').filter({ hasText: 'loading' });
  }

  // Navigation methods
  async waitForBarcodePage(): Promise<void> {
    await this.page.waitForURL(this.barcodeUrlPattern, { timeout: 15000 });
    await this.waitForPageElements();
  }

  // Barcode generation and validation methods
  async waitForBarcodeGeneration(): Promise<void> {
    // Wait for barcode image to be visible
    await this.waitForElement(this.barcodeImage, 'visible', 30000);
    
    // Wait for barcode code to be visible
    await this.waitForElement(this.barcodeCode, 'visible', 5000);
  }

  async waitForLoadingCoin(): Promise<void> {
    // Wait for loading coin to appear (if visible)
    try {
      await this.waitForElement(this.loadingCoin, 'visible', 5000);
    } catch (error) {
      // Loading coin might not always be visible, continue
      console.log('Loading coin not visible, continuing...');
    }
  }

  async getGeneratedCode(): Promise<string> {
    await this.waitForElement(this.barcodeCode);
    const codeText = await this.getText(this.barcodeCode);
    return codeText.trim();
  }

  async validateCodeLength(expectedLength: number = 30): Promise<boolean> {
    const code = await this.getGeneratedCode();
    return code.length === expectedLength;
  }

  async validateCodeFormat(): Promise<boolean> {
    const code = await this.getGeneratedCode();
    // Check if code contains only digits and is 30 characters long
    return /^\d{30}$/.test(code);
  }

  // Header and text validation methods
  async validateHeaderText(): Promise<boolean> {
    return await this.isElementVisible(this.headerText);
  }

  async getHeaderText(): Promise<string> {
    return await this.getText(this.headerText);
  }

  async validateInstructionText(): Promise<boolean> {
    return await this.isElementVisible(this.instructionText);
  }

  async validateFinalLegend(): Promise<boolean> {
    return await this.isElementVisible(this.finalLegend);
  }

  async getFinalLegend(): Promise<string> {
    return await this.getText(this.finalLegend);
  }

  // Amount validation methods
  async getTotalAmount(): Promise<string> {
    return await this.getText(this.totalAmountValue);
  }

  async validateTotalAmount(expectedAmount: string): Promise<boolean> {
    const actualAmount = await this.getTotalAmount();
    return actualAmount.includes(expectedAmount);
  }

  // Store validation methods
  async validateWalgreensLogo(): Promise<boolean> {
    return await this.isElementVisible(this.walgreensLogo);
  }

  // Instructions validation methods
  async validateInstructionsSection(): Promise<boolean> {
    return await this.isElementVisible(this.instructionsSection);
  }

  async validateInstructionsList(): Promise<boolean> {
    return await this.isElementVisible(this.instructionsList);
  }

  async getInstructionsText(): Promise<string> {
    return await this.getText(this.instructionsList);
  }

  // Button validation methods
  async isCashDeliveredButtonVisible(): Promise<boolean> {
    return await this.isElementVisible(this.cashDeliveredButton);
  }

  async clickCashDelivered(): Promise<void> {
    await this.waitForElement(this.cashDeliveredButton);
    await this.clickElement(this.cashDeliveredButton);
  }

  // Comprehensive validation methods
  async validateBarcodePageComplete(): Promise<boolean> {
    const checks = await Promise.all([
      this.validateHeaderText(),
      this.validateInstructionText(),
      this.validateCodeFormat(),
      this.validateFinalLegend(),
      this.validateWalgreensLogo(),
      this.validateInstructionsSection(),
      this.isCashDeliveredButtonVisible()
    ]);
    return checks.every(result => result === true);
  }

  async validateAllRequiredElements(): Promise<boolean> {
    const checks = await Promise.all([
      this.validateHeaderText(),
      this.validateCodeLength(30),
      this.validateFinalLegend(),
      this.validateWalgreensLogo()
    ]);
    return checks.every(result => result === true);
  }

  // Wait methods
  async waitForPageElements(): Promise<void> {
    await this.waitForElement(this.headerLogo);
    await this.waitForElement(this.headerText);
    await this.waitForElement(this.instructionText);
    await this.waitForElement(this.finalLegend);
  }

  async waitForBarcodeElements(): Promise<void> {
    await this.waitForElement(this.barcodeImage);
    await this.waitForElement(this.barcodeCode);
    await this.waitForElement(this.expirationText);
  }

  // Screenshot methods
  async takeBarcodeScreenshot(): Promise<void> {
    await this.takeScreenshot('barcode-generation-page');
  }

  async takeBarcodeCodeScreenshot(): Promise<void> {
    await this.takeScreenshot('barcode-code-generated');
  }

  // URL validation
  async validateBarcodeUrl(): Promise<boolean> {
    const currentUrl = await this.getCurrentUrl();
    return this.barcodeUrlPattern.test(currentUrl);
  }

  // Complete flow validation
  async validateCompleteBarcodeFlow(): Promise<{
    headerText: boolean;
    codeLength: boolean;
    finalLegend: boolean;
    walgreensLogo: boolean;
    generatedCode: string;
  }> {
    const generatedCode = await this.getGeneratedCode();
    
    return {
      headerText: await this.validateHeaderText(),
      codeLength: await this.validateCodeLength(30),
      finalLegend: await this.validateFinalLegend(),
      walgreensLogo: await this.validateWalgreensLogo(),
      generatedCode
    };
  }
}
