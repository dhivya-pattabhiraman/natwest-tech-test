import { Page } from '@playwright/test'

class CustomerDepositForm {
  private readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  // Elements in the page
  get form() {
    return this.page.getByRole('form')
  }

  get amountToBeDepositedLabel() {
    return this.page.locator('label').filter({ hasText: 'Amount to be Deposited :' })
  }
  get amountField() {
    return this.page.getByPlaceholder('amount')
  }

  get depositButton() {
    return this.page.locator('button[type="submit"]')
  }

  get depositSuccessfulMessage() {
    return this.page.getByText('Deposit Successful')
  }

  // Element interactions
  enterAmount(amount: number) {
    return this.amountField.fill(String(amount))
  }

  clickDepositButton() {
    return this.depositButton.click()
  }
}

export default CustomerDepositForm
