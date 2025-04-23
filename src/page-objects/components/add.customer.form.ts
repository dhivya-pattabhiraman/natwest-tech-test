import { Page } from '@playwright/test'

class AddCustomerForm {
  private readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  // Elements in the page
  get form() {
    return this.page.getByRole('form')
  }

  get firstNameLabel() {
    return this.page.locator('label').filter({ hasText: 'First Name :' })
  }
  get firstNameInput() {
    return this.page.locator('input[placeholder="First Name"]')
  }

  get lastNameLabel() {
    return this.page.locator('label').filter({ hasText: 'Last Name :' })
  }
  get lastNameInput() {
    return this.page.locator('input[placeholder="Last Name"]')
  }

  get postCodeLabel() {
    return this.page.locator('label').filter({ hasText: 'Post Code :' })
  }
  get postCodeInput() {
    return this.page.locator('input[placeholder="Post Code"]')
  }

  get addCustomerButton() {
    return this.page.locator('button[type="submit"]')
  }

  // Element interactions
  enterFirstName(name: string) {
    return this.firstNameInput.fill(name)
  }

  enterLastName(name: string) {
    return this.lastNameInput.fill(name)
  }

  enterPostCode(postCode: string) {
    return this.postCodeInput.fill(postCode)
  }

  clickAddCustomerButton() {
    return this.addCustomerButton.click()
  }
}

export default AddCustomerForm
