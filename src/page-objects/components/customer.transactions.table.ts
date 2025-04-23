import { Page } from '@playwright/test'

class CustomerTransactionsTable {
  private readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  // Elements in the page
  get backButton() {
    return this.page.getByRole('button', { name: 'Back' })
  }
  get resetButton() {
    return this.page.getByRole('button', { name: 'Reset' })
  }

  get tableHeaders() {
    return this.page.locator('table thead td')
  }
  get tableRows() {
    return this.page.locator('table tbody tr')
  }

  // Element interactions
  getTableHeaders() {
    return this.tableHeaders.allInnerTexts()
  }

  getTableDataFor(datetime: string) {
    return this.tableRows.filter({ hasText: datetime }).locator('td')
  }

  clickBackButton() {
    return this.backButton.click()
  }
}

export default CustomerTransactionsTable
