import { Page } from '@playwright/test'

class CustomersTable {
  private readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  // Elements in the page
  get searchBar() {
    return this.page.locator('input[placeholder="Search Customer"]')
  }

  get tableHeaders() {
    return this.page.locator('table thead td')
  }
  get tableData() {
    return this.page.locator('table tbody td')
  }

  // Element interactions
  searchFor(name: string) {
    return this.searchBar.fill(name)
  }
}

export default CustomersTable
