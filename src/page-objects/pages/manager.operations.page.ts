import { Page } from '@playwright/test'

import AddCustomerForm from '@src/page-objects/components/add.customer.form'
import OpenAccountForm from '@src/page-objects/components/open.account.form'
import CustomersTable from '@src/page-objects/components/customers.table'

class ManagerOperationsPage {
  private readonly page: Page
  private readonly addCustomerForm: AddCustomerForm
  private readonly openAccountForm: OpenAccountForm
  private readonly customersTable: CustomersTable

  constructor(page: Page) {
    this.page = page
    this.addCustomerForm = new AddCustomerForm(this.page)
    this.openAccountForm = new OpenAccountForm(this.page)
    this.customersTable = new CustomersTable(this.page)
  }

  // Elements in the page
  get heading() {
    return this.page.getByText('XYZ Bank')
  }
  get homeButton() {
    return this.page.getByRole('button', { name: 'Home' })
  }

  get addCustomerTab() {
    return this.page.getByRole('button', { name: 'Add Customer' }).first()
  }
  get addNewCustomerForm() {
    return this.addCustomerForm
  }

  get openAccountTab() {
    return this.page.getByRole('button', { name: 'Open Account' })
  }
  get openNewAccountForm() {
    return this.openAccountForm
  }

  get customersTab() {
    return this.page.getByRole('button', { name: 'Customers' })
  }
  get allCustomersTable() {
    return this.customersTable
  }

  // Element interactions
  clickHomeButton() {
    return this.homeButton.click()
  }

  clickAddCustomerTab() {
    return this.addCustomerTab.click()
  }

  clickOpenAccountTab() {
    return this.openAccountTab.click()
  }

  clickCustomersTab() {
    return this.customersTab.click()
  }
}

export default ManagerOperationsPage
