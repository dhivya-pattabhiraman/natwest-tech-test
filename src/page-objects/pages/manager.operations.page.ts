import { Page } from '@playwright/test'

import AddCustomerForm from '@src/page-objects/components/add.customer'
import ViewCustomersTable from '@src/page-objects/components/view.customers'

class ManagerOperationsPage {
  private readonly page: Page
  private readonly addCustomerForm: AddCustomerForm
  private readonly viewCustomersTable: ViewCustomersTable

  constructor(page: Page) {
    this.page = page
    this.addCustomerForm = new AddCustomerForm(this.page)
    this.viewCustomersTable = new ViewCustomersTable(this.page)
  }

  // Elements in the page
  get heading() {
    return this.page.getByText('XYZ Bank')
  }
  get homeButton() {
    return this.page.getByRole('button', { name: 'Home' })
  }

  get addCustomerButton() {
    return this.page.getByRole('button', { name: 'Add Customer' }).first()
  }
  get openAccountButton() {
    return this.page.getByRole('button', { name: 'Open Account' })
  }
  get customersButton() {
    return this.page.getByRole('button', { name: 'Customers' })
  }

  get addNewCustomerForm() {
    return this.addCustomerForm
  }
  get customersTable() {
    return this.viewCustomersTable
  }

  // Element interactions
  clickHomeButton() {
    return this.homeButton.click()
  }

  clickAddCustomerButton() {
    return this.addCustomerButton.click()
  }

  clickOpenAccountButton() {
    return this.openAccountButton.click()
  }

  clickCustomersButton() {
    return this.customersButton.click()
  }
}

export default ManagerOperationsPage
