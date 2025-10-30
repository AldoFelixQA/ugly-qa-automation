import { Page, Locator, expect } from '@playwright/test';

export class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigateTo(url: string): Promise<void> {
    await this.page.goto(url);
  }

  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
  }

  async waitForPageStable(timeout: number = 10000): Promise<void> {
    // Wait for no network activity for a period
    await this.page.waitForLoadState('networkidle', { timeout });
    
    // Wait a bit more to ensure stability
    await this.page.waitForTimeout(1000);
  }

async takeScreenshot(name: string): Promise<void> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  await this.page.screenshot({ path: `screenshots/${timestamp}_${name}.png`, fullPage: true });
}

async waitForElement(locator: Locator, state: 'attached' | 'visible' | 'hidden' = 'visible', timeout = 10000): Promise<void> {
  // Check if page is still open before waiting
  if (this.page.isClosed()) {
    throw new Error('Page has been closed before waiting for element');
  }
  
  try {
    await locator.waitFor({ state, timeout });
  } catch (error) {
    // Check if error is due to page being closed
    if (this.page.isClosed()) {
      throw new Error('Page was closed while waiting for element');
    }
    throw error;
  }
}

async waitForElementWithRetry(locator: Locator, state: 'attached' | 'visible' | 'hidden' = 'visible', maxRetries: number = 3, baseTimeout: number = 10000): Promise<void> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const timeout = baseTimeout * attempt;
      await locator.waitFor({ state, timeout });
      return;
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }
      await this.page.waitForTimeout(1000);
    }
  }
}

  async isElementVisible(locator: Locator): Promise<boolean> {
    return await locator.isVisible();
  }

  async getText(locator: Locator): Promise<string> {
    return await locator.textContent() || '';
  }

  async clickElement(locator: Locator, timeout = 10000): Promise<void> {
    await expect(locator).toBeVisible({ timeout });
    await expect(locator).toBeEnabled({ timeout });
    await locator.click();
  }

  async fillInput(locator: Locator, text: string): Promise<void> {
    await locator.fill(text);
  }

  async waitForUrl(url: string): Promise<void> {
    await this.page.waitForURL(url);
  }

  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  async getTextByLabel(labelText: string): Promise<string> {
    const locator = this.page.locator(`text=${labelText}`);
    await locator.waitFor({ state: 'visible' });
    return await locator.innerText();
  }
  async assertText(locator: Locator, expected: string): Promise<void> {
  await expect(locator).toHaveText(expected);
}
async expectUrlToContain(path: string): Promise<void> {
  await expect(this.page).toHaveURL(new RegExp(`${path}`));
}

// Generic scroll methods
async scrollToBottom(): Promise<void> {
  await this.page.keyboard.press('End');
}

async scrollToTop(): Promise<void> {
  await this.page.keyboard.press('Home');
}

// Generic text validation methods
async waitForElementWithText(text: string, timeout = 10000): Promise<void> {
  const locator = this.page.locator(`text=${text}`);
  await this.waitForElement(locator, 'visible', timeout);
}

async validateTextInHeader(text: string): Promise<boolean> {
  const headerLocator = this.page.locator('main').first();
  const textLocator = headerLocator.locator(`text=${text}`);
  return await this.isElementVisible(textLocator);
}

// Generic validation methods for cash payment flow
async validateElementContainsText(locator: Locator, expectedText: string): Promise<boolean> {
  const actualText = await this.getText(locator);
  return actualText.includes(expectedText);
}

async validateCodeLength(locator: Locator, expectedLength: number): Promise<boolean> {
  const code = await this.getText(locator);
  return code.length === expectedLength;
}
} 