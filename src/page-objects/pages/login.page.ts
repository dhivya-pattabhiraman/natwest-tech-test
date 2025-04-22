import { Page } from '@playwright/test'

class LoginPage {
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

  get customerLoginButton() {
    return this.page.getByRole('button', { name: 'Customer Login' })
  }
  get bankManagerLoginButton() {
    return this.page.getByRole('button', { name: 'Bank Manager Login' })
  }

  // Element interactions
  load(path: string) {
    return this.page.goto(path)
  }

  clickHomeButton() {
    return this.homeButton.click()
  }

  clickCustomerLoginButton() {
    return this.customerLoginButton.click()
  }

  clickBankManagerLoginButton() {
    return this.bankManagerLoginButton.click()
  }
}

export default LoginPage
