import { test, expect, Page } from '@playwright/test'

import LoginPage from '@src/page-objects/pages/login.page'
import ManagerOperationsPage from '@src/page-objects/pages/manager.operations.page'

import AddCustomerForm from '@src/page-objects/components/add.customer.form'
import OpenAccountForm from '@src/page-objects/components/open.account.form'
import CustomersTable from '@src/page-objects/components/customers.table'

function verifyDialog(page: Page, text: string) {
  page.on('dialog', async (dialog) => {
    expect(dialog.message()).toContain(text)
    await dialog.accept()
  })
}

async function verifyManagerOperationsPage(managerOperationsPage: ManagerOperationsPage) {
  await expect(managerOperationsPage.heading).toBeVisible()
  await expect(managerOperationsPage.homeButton).toBeVisible()
  await expect(managerOperationsPage.addCustomerTab).toBeVisible()
  await expect(managerOperationsPage.openAccountTab).toBeVisible()
  await expect(managerOperationsPage.customersTab).toBeVisible()
}

async function verifyAddNewCustomerForm(addNewCustomerForm: AddCustomerForm) {
  await expect(addNewCustomerForm.firstNameLabel).toBeVisible()
  await expect(addNewCustomerForm.lastNameLabel).toBeVisible()
  await expect(addNewCustomerForm.postCodeLabel).toBeVisible()
  await expect(addNewCustomerForm.addCustomerButton).toBeVisible()
}

async function verifyOpenNewAccountForm(openNewAccountForm: OpenAccountForm) {
  await expect(openNewAccountForm.customerLabel).toBeVisible()
  await expect(openNewAccountForm.currencyLabel).toBeVisible()
  await expect(openNewAccountForm.processButton).toBeVisible()
}

async function verifyCustomersTable(customersTable: CustomersTable) {
  await expect(customersTable.searchBar).toBeVisible()
  await expect(customersTable.tableHeaders).toHaveText([
    'First Name',
    'Last Name',
    'Post Code',
    'Account Number',
    'Delete Customer'
  ])
}

async function addNewCustomer(
  addNewCustomerForm: AddCustomerForm,
  firstName: string,
  lastName: string,
  postCode: string
) {
  await addNewCustomerForm.enterFirstName(firstName)
  await addNewCustomerForm.enterLastName(lastName)
  await addNewCustomerForm.enterPostCode(postCode)
  await addNewCustomerForm.clickAddCustomerButton()
}

async function openNewAccount(openNewAccountForm: OpenAccountForm, fullName: string, currency: string) {
  await openNewAccountForm.selectCustomer(fullName)
  await openNewAccountForm.selectCurrency(currency)
  await openNewAccountForm.clickProcessButton()
}

async function verifyCustomerRecordInTable(
  customersTable: CustomersTable,
  firstName: string,
  lastName: string,
  postcode: string,
  accountNumber: string
) {
  await customersTable.searchFor(firstName)
  await expect(customersTable.tableData).toHaveText([firstName, lastName, postcode, accountNumber, 'Delete'])
}

test.describe('As the Bank manager', () => {
  test.beforeEach(async ({ page }) => {
    // Load the login page
    const loginPage = new LoginPage(page)

    await loginPage.load('/angularJs-protractor/BankingProject/#/login')

    await expect(page).toHaveTitle('XYZ Bank')
    await expect(loginPage.heading).toBeVisible()
    await expect(loginPage.bankManagerLoginButton).toBeVisible()

    // Login as a Bank manager
    await loginPage.clickBankManagerLoginButton()
    await expect(page).toHaveTitle('XYZ Bank')
  })

  test('I can add a new bank customer', async ({ page }) => {
    const managerOperationsPage = new ManagerOperationsPage(page)
    const { addNewCustomerForm, allCustomersTable: customersTable } = managerOperationsPage

    const CUSTOMER_FIRST_NAME = 'Luna'
    const CUSTOMER_LAST_NAME = 'Lovegood'
    const CUSTOMER_POST_CODE = 'LO12 HO34'

    // Verify the manager operations page
    await verifyManagerOperationsPage(managerOperationsPage)

    // Verify the add new customer form and add a new customer
    await managerOperationsPage.clickAddCustomerTab()
    await verifyAddNewCustomerForm(addNewCustomerForm)
    verifyDialog(page, 'Customer added successfully with customer id :')
    await addNewCustomer(addNewCustomerForm, CUSTOMER_FIRST_NAME, CUSTOMER_LAST_NAME, CUSTOMER_POST_CODE)

    // Verify the customer has been added successfully in the customers table
    await managerOperationsPage.clickCustomersTab()
    await verifyCustomersTable(customersTable)
    await verifyCustomerRecordInTable(customersTable, CUSTOMER_FIRST_NAME, CUSTOMER_LAST_NAME, CUSTOMER_POST_CODE, '')
  })

  test('I cannot add a duplicate customer', async ({ page }) => {
    const managerOperationsPage = new ManagerOperationsPage(page)
    const { addNewCustomerForm, allCustomersTable: customersTable } = managerOperationsPage

    const CUSTOMER_FIRST_NAME = 'Parvati'
    const CUSTOMER_LAST_NAME = 'Patel'
    const CUSTOMER_POST_CODE = 'LO56 DOW79'

    // Add a new customer
    await managerOperationsPage.clickAddCustomerTab()
    await addNewCustomer(addNewCustomerForm, CUSTOMER_FIRST_NAME, CUSTOMER_LAST_NAME, CUSTOMER_POST_CODE)

    // Verify the customer has been added
    await managerOperationsPage.clickCustomersTab()
    await verifyCustomerRecordInTable(customersTable, CUSTOMER_FIRST_NAME, CUSTOMER_LAST_NAME, CUSTOMER_POST_CODE, '')

    // Add the same customer again and verify an error is thrown to show the customer maybe a duplicate
    await managerOperationsPage.clickAddCustomerTab()
    verifyDialog(page, 'Please check the details. Customer may be duplicate.')
    await addNewCustomer(addNewCustomerForm, CUSTOMER_FIRST_NAME, CUSTOMER_LAST_NAME, CUSTOMER_POST_CODE)
  })

  test('I cannot add a customer without providing all the mandatory details', async ({ page }) => {
    const managerOperationsPage = new ManagerOperationsPage(page)
    const { addNewCustomerForm } = managerOperationsPage

    const CUSTOMER_FIRST_NAME = 'Padma'
    const CUSTOMER_LAST_NAME = 'Patel'
    const CUSTOMER_POST_CODE = 'BIR 123123'

    // Verify that the form necessitates the mandatory fields to be filled in
    await managerOperationsPage.clickAddCustomerTab()

    await expect(addNewCustomerForm.form).not.toHaveClass(/ng-valid ng-valid-required/)
    await expect(addNewCustomerForm.firstNameInput).not.toHaveClass(/ng-valid ng-valid-required/)
    await expect(addNewCustomerForm.lastNameInput).not.toHaveClass(/ng-valid ng-valid-required/)
    await expect(addNewCustomerForm.postCodeInput).not.toHaveClass(/ng-valid ng-valid-required/)

    // Enter values in all the fields
    await addNewCustomerForm.enterFirstName(CUSTOMER_FIRST_NAME)
    await addNewCustomerForm.enterLastName(CUSTOMER_LAST_NAME)
    await addNewCustomerForm.enterPostCode(CUSTOMER_POST_CODE)

    await expect(addNewCustomerForm.form).toHaveClass(/ng-valid ng-valid-required/)
    await expect(addNewCustomerForm.firstNameInput).toHaveClass(/ng-valid ng-valid-required/)
    await expect(addNewCustomerForm.lastNameInput).toHaveClass(/ng-valid ng-valid-required/)
    await expect(addNewCustomerForm.postCodeInput).toHaveClass(/ng-valid ng-valid-required/)
  })

  test('I can open a new account', async ({ page }) => {
    const managerOperationsPage = new ManagerOperationsPage(page)

    const { addNewCustomerForm, openNewAccountForm, allCustomersTable: customersTable } = managerOperationsPage

    const CUSTOMER_FIRST_NAME = 'Ginny'
    const CUSTOMER_LAST_NAME = 'Weasley'
    const CUSTOMER_POST_CODE = '123 WER 345345'

    // Add a new customer
    await managerOperationsPage.clickAddCustomerTab()
    await addNewCustomer(addNewCustomerForm, CUSTOMER_FIRST_NAME, CUSTOMER_LAST_NAME, CUSTOMER_POST_CODE)

    // Open a new account for the newly added customer
    await managerOperationsPage.clickOpenAccountTab()
    await verifyOpenNewAccountForm(openNewAccountForm)

    // Verify the dialog upon account opening and also extract the account number from it
    let accountNumber = ''
    page.on('dialog', async (dialog) => {
      const dialogMessage = dialog.message()
      const regExpArray = dialogMessage.match(/\d+/)
      if (regExpArray) accountNumber = regExpArray[0]

      expect(dialogMessage).toContain(`Account created successfully with account Number :${accountNumber}`)
      await dialog.accept()
    })
    await openNewAccount(openNewAccountForm, `${CUSTOMER_FIRST_NAME} ${CUSTOMER_LAST_NAME}`, 'Dollar')

    // Verify the account number has been opened successfully in the customers table
    await managerOperationsPage.clickCustomersTab()
    await verifyCustomerRecordInTable(
      customersTable,
      CUSTOMER_FIRST_NAME,
      CUSTOMER_LAST_NAME,
      CUSTOMER_POST_CODE,
      accountNumber
    )
  })
})
