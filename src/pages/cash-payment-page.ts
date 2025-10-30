import { Page, Locator } from '@playwright/test';
import { BasePage } from './base-page';

export class CashPaymentPage extends BasePage {
  // URL patterns
  private readonly cashPaymentUrlPattern = /.*\/new-cash\/3\?only_user_info=false&overseer=true/;
  private readonly paymentMethodsUrlPattern = /.*\/payment\/change-payment-method\?overseer=true/;

  // Locators
  private readonly headerLogo: Locator;
  private readonly backButton: Locator;
  private readonly pageTitle: Locator;
  private readonly walgreensOption: Locator;
  private readonly cvsOption: Locator;
  private readonly sevenElevenOption: Locator;
  private readonly walmartOption: Locator;
  private readonly caseysOption: Locator;
  private readonly officeDepotOption: Locator;
  private readonly cashPaymentButton: Locator;

  constructor(page: Page) {
    super(page);

    // Initialize locators
    this.headerLogo = page.locator('img[alt="HEADER LOGO"]');
    this.backButton = page.locator('button').filter({ hasText: 'left arrow' });
    this.pageTitle = page.getByRole('heading', { name: '¿Dónde quieres pagar?' });
    this.walgreensOption = page.getByText('Walgreens Min: $20 - Max: $500 $');
    this.cvsOption = page.getByText('CVS Pharmacy Min: $20 - Max: $500 $');
    this.sevenElevenOption = page.getByText('7Eleven Min: $20 - Max: $500 $');
    this.walmartOption = page.getByText('Walmart Min: $20 - Max: $500 $');
    this.caseysOption = page.getByText('Caseys Min: $20 - Max: $500 $');
    this.officeDepotOption = page.getByText('Office Depot OfficeMax Min: $20 - Max: $500 $');
    this.cashPaymentButton = page.getByRole('button', { name: 'Pagar con efectivo en tienda' });
  }

  // Navigation methods
  async waitForCashPaymentPage(): Promise<void> {
    await this.page.waitForURL(this.cashPaymentUrlPattern, { timeout: 15000 });
    await this.waitForPageElements();
  }

  async waitForPaymentMethodsPage(): Promise<void> {
    await this.page.waitForURL(this.paymentMethodsUrlPattern, { timeout: 15000 });
    await this.waitForCashPaymentButton();
  }

  // Store selection methods
  async selectWalgreens(): Promise<void> {
    await this.waitForElement(this.walgreensOption);
    await this.clickElement(this.walgreensOption);
  }

  async selectCVS(): Promise<void> {
    await this.waitForElement(this.cvsOption);
    await this.clickElement(this.cvsOption);
  }

  async selectSevenEleven(): Promise<void> {
    await this.waitForElement(this.sevenElevenOption);
    await this.clickElement(this.sevenElevenOption);
  }

  async selectWalmart(): Promise<void> {
    await this.waitForElement(this.walmartOption);
    await this.clickElement(this.walmartOption);
  }

  async selectCaseys(): Promise<void> {
    await this.waitForElement(this.caseysOption);
    await this.clickElement(this.caseysOption);
  }

  async selectOfficeDepot(): Promise<void> {
    await this.waitForElement(this.officeDepotOption);
    await this.clickElement(this.officeDepotOption);
  }

  // Cash payment method selection
  async clickCashPaymentInStore(): Promise<void> {
    await this.waitForElement(this.cashPaymentButton);
    await this.clickElement(this.cashPaymentButton);
  }

  // Validation methods
  async isWalgreensVisible(): Promise<boolean> {
    return await this.isElementVisible(this.walgreensOption);
  }

  async isCVSVisible(): Promise<boolean> {
    return await this.isElementVisible(this.cvsOption);
  }

  async isSevenElevenVisible(): Promise<boolean> {
    return await this.isElementVisible(this.sevenElevenOption);
  }

  async isWalmartVisible(): Promise<boolean> {
    return await this.isElementVisible(this.walmartOption);
  }

  async isCaseysVisible(): Promise<boolean> {
    return await this.isElementVisible(this.caseysOption);
  }

  async isOfficeDepotVisible(): Promise<boolean> {
    return await this.isElementVisible(this.officeDepotOption);
  }

  async isCashPaymentButtonVisible(): Promise<boolean> {
    return await this.isElementVisible(this.cashPaymentButton);
  }

  async validateStoreOptionsAvailable(): Promise<boolean> {
    const checks = await Promise.all([
      this.isWalgreensVisible(),
      this.isCVSVisible(),
      this.isSevenElevenVisible(),
      this.isWalmartVisible(),
      this.isCaseysVisible(),
      this.isOfficeDepotVisible()
    ]);
    return checks.every(result => result === true);
  }

  // Wait methods
  async waitForStoreOptions(): Promise<void> {
    await this.waitForElement(this.walgreensOption);
    await this.waitForElement(this.cvsOption);
    await this.waitForElement(this.sevenElevenOption);
  }

  async waitForCashPaymentButton(): Promise<void> {
    await this.waitForElement(this.cashPaymentButton);
  }

  async waitForPageElements(): Promise<void> {
    await this.waitForElement(this.headerLogo);
    await this.waitForElement(this.pageTitle);
    await this.waitForStoreOptions();
  }

  // Screenshot methods
  async takeCashPaymentScreenshot(): Promise<void> {
    await this.takeScreenshot('cash-payment-page');
  }

  async takeStoreSelectionScreenshot(): Promise<void> {
    await this.takeScreenshot('store-selection-page');
  }

  // URL validation
  async validateCashPaymentUrl(): Promise<boolean> {
    const currentUrl = await this.getCurrentUrl();
    return this.cashPaymentUrlPattern.test(currentUrl);
  }

  async validatePaymentMethodsUrl(): Promise<boolean> {
    const currentUrl = await this.getCurrentUrl();
    return this.paymentMethodsUrlPattern.test(currentUrl);
  }
}
