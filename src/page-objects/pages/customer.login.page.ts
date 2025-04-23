import { Page } from '@playwright/test'

class CustomerLoginPage {
  private readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  // Elements in the page
  get heading() {
    return this.page.getByText('XYZ Bank')
  }
  get homeButton() {
    return this.page.getByRole('button', { name: 'Home' })
  }

  get customerLabel() {
    return this.page.locator('label').filter({ hasText: 'Your Name :' })
  }
  get customerDropdown() {
    return this.page.locator('select[name="userSelect"]')
  }
  get loginButton() {
    return this.page.getByRole('button', { name: 'Login' })
  }

  // Element interactions
  load(path: string) {
    return this.page.goto(path)
  }

  async selectCustomer(name: string) {
    await this.customerDropdown.click()
    return this.customerDropdown.selectOption({ label: name })
  }

  clickLoginButton() {
    return this.loginButton.click()
  }
}

export default CustomerLoginPage
