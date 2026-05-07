import { type Page, type Locator } from "@playwright/test"

export class BasePage {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  async navigate(path: string) {
    await this.page.goto(path)
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState("networkidle")
  }

  async getTitle(): Promise<string> {
    return await this.page.title()
  }

  async getUrl(): Promise<string> {
    return this.page.url()
  }

  async waitForElement(selector: string): Promise<Locator> {
    const element = this.page.locator(selector)
    await element.waitFor({ state: "visible" })
    return element
  }

  async clickElement(selector: string) {
    await this.page.click(selector)
  }

  async fillInput(selector: string, value: string) {
    await this.page.fill(selector, value)
  }

  async getText(selector: string): Promise<string> {
    return await this.page.locator(selector).textContent() ?? ""
  }
}
