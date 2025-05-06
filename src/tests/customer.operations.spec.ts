import { test, expect, Page } from '@playwright/test'

import CustomerLoginPage from '@src/page-objects/pages/customer.login.page'
import CustomerOperationsPage from '@src/page-objects/pages/customer.operations.page'

import CustomerDepositForm from '@src/page-objects/components/customer.deposit.form'
import CustomerTransactionsTable from '@src/page-objects/components/customer.transactions.table'

const CUSTOMER_NAME = 'Neville Longbottom'

async function verifyCustomerOperationsPage(customerOperationsPage: CustomerOperationsPage) {
  await expect(customerOperationsPage.heading).toBeVisible()
  await expect(customerOperationsPage.homeButton).toBeVisible()
  await expect(customerOperationsPage.logoutButton).toBeVisible()
  await expect(customerOperationsPage.greetingsMessageFor(CUSTOMER_NAME)).toBeVisible()
}

async function extractCustomerAccountDetails(customerOperationsPage: CustomerOperationsPage) {
  let accountNumber: string = ''
  let accountBalance: string = ''
  let currency: string = ''

  const accountDetails = await customerOperationsPage.getAccountDetails()
  const regExpArray = accountDetails.match(/Account Number : ([\d]+) , Balance : ([\d]+) , Currency : ([\w]+)/)

  if (regExpArray) {
    accountNumber = regExpArray[1]
    accountBalance = regExpArray[2]
    currency = regExpArray[3]
  }

  return { accountNumber, accountBalance, currency }
}

async function verifyDepositForm(depositForm: CustomerDepositForm) {
  await expect(depositForm.amountToBeDepositedLabel).toBeVisible()
  await expect(depositForm.depositButton).toBeVisible()
}

async function makeDeposit(depositForm: CustomerDepositForm, amount: number) {
  const dateTime = new Date()
  const dateStringArray = dateTime.toDateString().split(' ')
  const month = dateStringArray[1]
  const date = Number(dateStringArray[2]).toString()
  const year = dateStringArray[3]
  const time = dateTime.toLocaleTimeString()

  const constructedDateTimeString = `${month} ${date}, ${year} ${time}`

  await depositForm.enterAmount(amount)
  await depositForm.clickDepositButton()

  return constructedDateTimeString
}

async function verifyTransactionsTable(transactionsTable: CustomerTransactionsTable, page: Page) {
  await expect(transactionsTable.backButton).toBeVisible()
  await expect(transactionsTable.resetButton).toBeVisible()
  await expect(transactionsTable.tableHeaders).toHaveText(['Date-Time', 'Amount', 'Transaction Type'])

  // If the table has not been refreshed, reload the page
  const transactionRecords = await transactionsTable.tableRows.count()

  if (transactionRecords === 0) {
    await page.waitForTimeout(2 * 1000)
    await page.reload()
  }
}

async function verifyTransactionRecordInTable(
  transactionsTable: CustomerTransactionsTable,
  datetime: string,
  amount: number,
  transactionType: string
) {
  await expect(transactionsTable.getTableDataFor(datetime)).toHaveText([datetime, amount.toString(), transactionType])
}

test.describe('As a Bank customer', () => {
  test.beforeEach(async ({ page }) => {
    // Load the customer login page
    const loginPage = new CustomerLoginPage(page)

    await loginPage.load('/angularJs-protractor/BankingProject/#/customer')

    await expect(page).toHaveTitle('XYZ Bank')
    await expect(loginPage.heading).toBeVisible()
    await expect(loginPage.customerLabel).toBeVisible()

    await loginPage.selectCustomer(CUSTOMER_NAME)
    await expect(loginPage.loginButton).toBeVisible()
    await loginPage.clickLoginButton()
  })

  test('I can make a deposit to my account', async ({ page }) => {
    const customerOperationsPage = new CustomerOperationsPage(page)
    const { depositForm, transactionsTable } = customerOperationsPage

    const customerAccountNumber = '1013'
    const startingAccountBalance = 0
    const amountDeposited = 1000
    const customerAccountCurrency = 'Dollar'

    // Verify customer operations page
    await verifyCustomerOperationsPage(customerOperationsPage)

    // Extract customer account details
    const { accountNumber, accountBalance, currency } = await extractCustomerAccountDetails(customerOperationsPage)

    // Verify customer account details
    expect(accountNumber).toContain(customerAccountNumber)
    expect(accountBalance).toContain(startingAccountBalance.toString())
    expect(currency).toContain(customerAccountCurrency)

    // Verify the deposit form and deposit some amount
    await customerOperationsPage.clickDepositTab()
    await verifyDepositForm(depositForm)
    const depositDateTime = await makeDeposit(depositForm, amountDeposited)

    // Verify the amount has been deposited successfully
    await expect(depositForm.depositSuccessfulMessage).toBeVisible()
    const { accountBalance: newAccountBalance } = await extractCustomerAccountDetails(customerOperationsPage)
    expect(newAccountBalance).toContain((startingAccountBalance + amountDeposited).toString())

    // Verify the record added to the transactions table
    await customerOperationsPage.clickTransactionsTab()
    await verifyTransactionsTable(transactionsTable, page)
    await verifyTransactionRecordInTable(
      transactionsTable,
      depositDateTime,
      startingAccountBalance + amountDeposited,
      'Credit'
    )
  })

  test('I cannot make an empty deposit to my account', async ({ page }) => {
    const customerOperationsPage = new CustomerOperationsPage(page)
    const depositForm = customerOperationsPage.depositForm

    // Verify that the amount field cannot be empty
    await customerOperationsPage.clickDepositTab()
    await depositForm.clickDepositButton()

    await expect(depositForm.form).not.toHaveClass(/ng-valid ng-valid-required/)
    await expect(depositForm.amountField).not.toHaveClass(/ng-valid ng-valid-required/)

    // Enter value in the field
    await depositForm.enterAmount(200)

    // Verify the classes are present
    await expect(depositForm.form).toHaveClass(/ng-valid ng-valid-required/)
    await expect(depositForm.amountField).toHaveClass(/ng-valid ng-valid-required/)
  })
})
