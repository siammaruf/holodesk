import { type Page, type Locator } from "@playwright/test"
import { BasePage } from "../base.page"

export class LoginPage extends BasePage {
  readonly usernameInput: Locator
  readonly passwordInput: Locator
  readonly rememberMeCheckbox: Locator
  readonly submitButton: Locator
  readonly errorMessage: Locator

  constructor(page: Page) {
    super(page)
    this.usernameInput = page.locator('input[name="username"]')
    this.passwordInput = page.locator('input[name="password"]')
    this.rememberMeCheckbox = page.locator('input[name="rememberMe"]')
    this.submitButton = page.locator('button[type="submit"]')
    this.errorMessage = page.locator('[data-testid="error-message"]')
  }

  async goto() {
    await this.navigate("/login")
  }

  async login(username: string, password: string, rememberMe = false) {
    await this.usernameInput.fill(username)
    await this.passwordInput.fill(password)
    if (rememberMe) {
      await this.rememberMeCheckbox.check()
    }
    await this.submitButton.click()
  }

  async getValidationErrors(): Promise<string[]> {
    const errors = await this.page.locator('[data-testid="field-error"]').allTextContents()
    return errors
  }

  async isLoginFormVisible(): Promise<boolean> {
    return await this.usernameInput.isVisible()
  }
}
