import { Page, Locator } from '@playwright/test';
import { BasePage } from './base-page';

export class Homepage extends BasePage {
  // URL
  private readonly homepageUrl = 'https://www.felixpago.com/';
  private readonly expectedUrlPattern = /https:\/\/www\.felixpago\.com\/\?ref_source=Web_homepage_wa/;

  // Locators
  private readonly felixLogo: Locator;
  private readonly sendMoneyTitle: Locator;
  private readonly firstSendFreeButton: Locator;
  private readonly calculatorForm: Locator;
  private readonly sendToMexicoOption: Locator;
  private readonly sendAmountInput: Locator;
  private readonly beneficiaryAmountInput: Locator;
  private readonly whatsappInput: Locator;
  private readonly startSendButton: Locator;

  constructor(page: Page) {
    super(page);
    
    // Initialize locators
    this.felixLogo = page.getByRole('link', { name: 'home' });
    this.sendMoneyTitle = page.getByRole('heading', { name: 'Envía dinero por WhatsApp' });
    this.firstSendFreeButton = page.getByRole('button', { name: 'Tu primer envío sin comisión' });
    this.calculatorForm = page.getByRole('form', { name: 'Calculator form' });
    this.sendToMexicoOption = page.locator('text=Enviar a México');
    this.sendAmountInput = page.getByRole('spinbutton', { name: 'Tu envías USD' });
    this.beneficiaryAmountInput = page.getByRole('textbox', { name: 'Tu beneficiario recibe MXN' });
    this.whatsappInput = page.getByRole('textbox', { name: '201-555-0123' });
    this.startSendButton = page.getByRole('button', { name: 'Empezar envío gratis' });
  }

  async navigateToHomepage(): Promise<void> {
    await this.navigateTo(this.homepageUrl);
    await this.waitForPageLoad();
  }

  async waitForHomepageLoad(): Promise<void> {
    await this.waitForElement(this.felixLogo);
    await this.waitForElement(this.sendMoneyTitle);
  }

  async isHomepageLoaded(): Promise<boolean> {
    return await this.isElementVisible(this.felixLogo) && 
           await this.isElementVisible(this.sendMoneyTitle);
  }

  async validateHomepageUrl(): Promise<boolean> {
    const currentUrl = await this.getCurrentUrl();
    return this.expectedUrlPattern.test(currentUrl) || currentUrl === this.homepageUrl;
  }

  async isCalculatorFormVisible(): Promise<boolean> {
    return await this.isElementVisible(this.calculatorForm);
  }

  async isFirstSendFreeButtonVisible(): Promise<boolean> {
    return await this.isElementVisible(this.firstSendFreeButton);
  }

  async takeHomepageScreenshot(): Promise<void> {
    await this.takeScreenshot('homepage-expired-link');
  }

  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  async waitForHomepageElements(): Promise<void> {
    await this.waitForElement(this.felixLogo);
    await this.waitForElement(this.sendMoneyTitle);
    await this.waitForElement(this.calculatorForm);
  }
} 