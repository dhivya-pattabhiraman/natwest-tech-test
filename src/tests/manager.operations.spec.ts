import { test, expect, Page } from '@playwright/test'

import LoginPage from '@src/page-objects/pages/login.page'
import ManagerOperationsPage from '@src/page-objects/pages/manager.operations.page'

function verifyDialog(page: Page, text: RegExp) {
  page.on('dialog', async (dialog) => {
    expect(dialog.message()).toContain(text)
    await dialog.accept()
  })
}

test.describe('As the Bank manager', () => {
  test.beforeEach(async ({ page }) => {
    // Load the login page
    const loginPage = new LoginPage(page)

    await loginPage.load('/angularJs-protractor/BankingProject/#/login')

    await expect(page).toHaveTitle('XYZ Bank')
    await expect(loginPage.heading).toBeVisible()
    await expect(loginPage.customerLoginButton).toBeVisible()
    await expect(loginPage.bankManagerLoginButton).toBeVisible()

    // Login as a Bank manager
    await loginPage.clickBankManagerLoginButton()
    await expect(page).toHaveTitle('XYZ Bank')
  })

  test('I can add a new bank customer', async ({ page }) => {
    const managerOperationsPage = new ManagerOperationsPage(page)

    await expect(managerOperationsPage.heading).toBeVisible()
    await expect(managerOperationsPage.homeButton).toBeVisible()
    await expect(managerOperationsPage.addCustomerButton).toBeVisible()
    await expect(managerOperationsPage.openAccountButton).toBeVisible()
    await expect(managerOperationsPage.customersButton).toBeVisible()

    // Add a new customer
    await managerOperationsPage.clickAddCustomerButton()

    await expect(managerOperationsPage.addNewCustomerForm.firstNameLabel).toBeVisible()
    await expect(managerOperationsPage.addNewCustomerForm.lastNameLabel).toBeVisible()
    await expect(managerOperationsPage.addNewCustomerForm.postCodeLabel).toBeVisible()
    await expect(managerOperationsPage.addNewCustomerForm.addCustomerButton).toBeVisible()

    await managerOperationsPage.addNewCustomerForm.enterFirstName('Luna')
    await managerOperationsPage.addNewCustomerForm.enterLastName('Lovegood')
    await managerOperationsPage.addNewCustomerForm.enterPostCode('LO12 HO34')

    await managerOperationsPage.addNewCustomerForm.clickAddCustomerButton()

    // Verify the customer has been added successfully
    verifyDialog(page, /Customer added successfully with customer id :\d/)

    await managerOperationsPage.clickCustomersButton()

    await expect(managerOperationsPage.customersTable.searchBar).toBeVisible()
    expect(await managerOperationsPage.customersTable.getTableHeaders()).toEqual([
      'First Name',
      'Last Name',
      'Post Code',
      'Account Number',
      'Delete Customer'
    ])

    await managerOperationsPage.customersTable.searchFor('Luna')
    await expect(managerOperationsPage.customersTable.tableData).toHaveText([
      'Luna',
      'Lovegood',
      'LO12 HO34',
      '',
      'Delete'
    ])
  })

  test('I cannot add a duplicate customer', async ({ page }) => {
    const managerOperationsPage = new ManagerOperationsPage(page)

    await expect(managerOperationsPage.heading).toBeVisible()

    // Add a new customer
    await managerOperationsPage.clickAddCustomerButton()

    await managerOperationsPage.addNewCustomerForm.enterFirstName('Parvati')
    await managerOperationsPage.addNewCustomerForm.enterLastName('Patel')
    await managerOperationsPage.addNewCustomerForm.enterPostCode('BU78 ROW78')

    await managerOperationsPage.addNewCustomerForm.clickAddCustomerButton()

    await managerOperationsPage.clickCustomersButton()
    await managerOperationsPage.customersTable.searchFor('Parvati')
    await expect(managerOperationsPage.customersTable.tableData).toHaveText([
      'Parvati',
      'Patel',
      'BU78 ROW78',
      '',
      'Delete'
    ])

    // Add the same customer again
    await managerOperationsPage.clickAddCustomerButton()

    await managerOperationsPage.addNewCustomerForm.enterFirstName('Parvati')
    await managerOperationsPage.addNewCustomerForm.enterLastName('Patel')
    await managerOperationsPage.addNewCustomerForm.enterPostCode('BU78 ROW78')

    await managerOperationsPage.addNewCustomerForm.clickAddCustomerButton()

    // Verify an error is thrown to show the customer maybe a duplicate
    verifyDialog(page, /Please check the details. Customer may be duplicate./)
  })

  test('I cannot add a customer without providing all the mandatory details', async ({ page }) => {
    const managerOperationsPage = new ManagerOperationsPage(page)

    await expect(managerOperationsPage.heading).toBeVisible()

    // Add a customer without providing any details
    await managerOperationsPage.clickAddCustomerButton()
    await managerOperationsPage.addNewCustomerForm.clickAddCustomerButton()

    await expect(page.getByText(/Please fill in this field/i)).toBeVisible()
  })
})
