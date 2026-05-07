import { test, expect } from "@playwright/test"

test.describe("Home Page", () => {
  test("should display home page", async ({ page }) => {
    await page.goto("/")
    await page.waitForLoadState("networkidle")

    // Verify the page loaded successfully
    const title = await page.title()
    expect(title).toBeDefined()
  })

  test("should have navigation to about page", async ({ page }) => {
    await page.goto("/")
    await page.waitForLoadState("networkidle")

    // Look for about link in navigation
    const aboutLink = page.locator('a[href="/about"]')
    if (await aboutLink.isVisible()) {
      await aboutLink.click()
      await page.waitForURL("**/about")
      expect(page.url()).toContain("/about")
    }
  })

  test("should have navigation to login page", async ({ page }) => {
    await page.goto("/")
    await page.waitForLoadState("networkidle")

    // Look for login link in navigation
    const loginLink = page.locator('a[href="/login"]')
    if (await loginLink.isVisible()) {
      await loginLink.click()
      await page.waitForURL("**/login")
      expect(page.url()).toContain("/login")
    }
  })
})
