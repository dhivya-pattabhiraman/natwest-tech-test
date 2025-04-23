import { Page } from '@playwright/test'

import CustomerTransactionsTable from '@src/page-objects/components/customer.transactions.table'
import CustomerDepositForm from '@src/page-objects/components/customer.deposit.form'
import CustomerWithdrawalForm from '@src/page-objects/components/customer.withdrawal.form'

class CustomerOperationsPage {
  private readonly page: Page
  private readonly customerTransactionsTable: CustomerTransactionsTable
  private readonly customerDepositForm: CustomerDepositForm
  private readonly customerWithdrawalForm: CustomerWithdrawalForm

  constructor(page: Page) {
    this.page = page
    this.customerTransactionsTable = new CustomerTransactionsTable(this.page)
    this.customerDepositForm = new CustomerDepositForm(this.page)
    this.customerWithdrawalForm = new CustomerWithdrawalForm(this.page)
  }

  // Elements in the page
  get heading() {
    return this.page.getByText('XYZ Bank')
  }
  get homeButton() {
    return this.page.getByRole('button', { name: 'Home' })
  }
  get logoutButton() {
    return this.page.getByRole('button', { name: 'Logout' })
  }

  get accountDropdown() {
    return this.page.locator('select[name="accountSelect"]')
  }

  get transactionsTab() {
    return this.page.getByRole('button', { name: 'Transactions' })
  }
  get transactionsTable() {
    return this.customerTransactionsTable
  }

  get depositTab() {
    return this.page.getByRole('button', { name: 'Deposit' })
  }
  get depositForm() {
    return this.customerDepositForm
  }

  get withdrawalTab() {
    return this.page.getByRole('button', { name: 'Withdrawl' })
  }
  get withdrawalForm() {
    return this.customerWithdrawalForm
  }

  // Element interactions
  greetingsMessageFor(name: string) {
    return this.page.getByText(`Welcome ${name} !!`)
  }
  clickHomeButton() {
    return this.homeButton.click()
  }
  clickLogoutButton() {
    return this.logoutButton.click()
  }

  selectAccount(accountNumber: string) {
    return this.accountDropdown.selectOption({ label: accountNumber })
  }
  getAccountDetails() {
    return this.page.getByText(/Account Number : /).innerText()
  }

  clickTransactionsTab() {
    return this.transactionsTab.click()
  }

  clickDepositTab() {
    return this.depositTab.click()
  }

  clickWithdrawalTab() {
    return this.withdrawalTab.click()
  }
}

export default CustomerOperationsPage
