import { Page } from '@playwright/test'

class OpenAccountForm {
  private readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  // Elements in the page
  get form() {
    return this.page.getByRole('form')
  }

  get customerLabel() {
    return this.page.locator('label').filter({ hasText: 'Customer :' })
  }
  get customerDropdown() {
    return this.page.locator('select[name="userSelect"]')
  }

  get currencyLabel() {
    return this.page.locator('label').filter({ hasText: 'Currency :' })
  }
  get currencyDropdown() {
    return this.page.locator('select[name="currency"]')
  }

  get processButton() {
    return this.page.locator('button[type="submit"]')
  }

  // Element interactions
  async selectCustomer(name: string) {
    await this.customerDropdown.click()
    return this.customerDropdown.selectOption({ label: name })
  }

  async selectCurrency(currency: string) {
    await this.currencyDropdown.click()
    return this.currencyDropdown.selectOption({ label: currency })
  }

  clickProcessButton() {
    return this.processButton.click()
  }
}

export default OpenAccountForm
