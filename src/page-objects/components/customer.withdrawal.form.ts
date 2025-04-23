import { Page } from '@playwright/test'

class CustomerWithdrawalForm {
  private readonly page: Page

  constructor(page: Page) {
    this.page = page
  }
}

export default CustomerWithdrawalForm
