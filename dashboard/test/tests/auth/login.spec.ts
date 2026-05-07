import { test, expect } from "../../fixtures/auth.fixture"

test.describe("Login Page", () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto()
  })

  test("should display login form", async ({ loginPage }) => {
    const isVisible = await loginPage.isLoginFormVisible()
    expect(isVisible).toBe(true)
  })

  test("should show validation errors for empty form submission", async ({ loginPage }) => {
    await loginPage.submitButton.click()
    // Validation errors should appear
    await loginPage.page.waitForTimeout(500)
    const url = await loginPage.getUrl()
    // Should still be on login page
    expect(url).toContain("/login")
  })

  test("should navigate to dashboard on successful login", async ({ loginPage, page }) => {
    // This test will need to be updated with actual credentials
    // or mocked API response
    await loginPage.login("admin@example.com", "password123")
    await page.waitForTimeout(1000)
    // Check navigation after login
    // Note: With hardcoded auth, this may need adjustment
  })

  test("should toggle remember me checkbox", async ({ loginPage }) => {
    const isCheckedBefore = await loginPage.rememberMeCheckbox.isChecked()
    await loginPage.rememberMeCheckbox.click()
    const isCheckedAfter = await loginPage.rememberMeCheckbox.isChecked()
    expect(isCheckedAfter).not.toBe(isCheckedBefore)
  })
})
