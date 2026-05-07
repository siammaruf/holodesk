import { test, expect } from "@playwright/test"

test.describe("Employees Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/admin/employees")
    await page.waitForLoadState("networkidle")
  })

  test("should display employees list", async ({ page }) => {
    const heading = page.locator("h2").filter({ hasText: "Employees" })
    await expect(heading).toBeVisible()
  })

  test("should display employee table", async ({ page }) => {
    // Check for table headers
    const nameHeader = page.locator("text=Name").first()
    const positionHeader = page.locator("text=Position").first()
    const emailHeader = page.locator("text=Email").first()

    await expect(nameHeader).toBeVisible()
    await expect(positionHeader).toBeVisible()
    await expect(emailHeader).toBeVisible()
  })

  test("should have search functionality", async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Search"]')
    await expect(searchInput).toBeVisible()

    // Test search
    await searchInput.fill("John")
    await page.waitForTimeout(300)

    // Results should be filtered
    const johnRow = page.locator("text=John Doe")
    await expect(johnRow).toBeVisible()
  })

  test("should have pagination", async ({ page }) => {
    const previousButton = page.locator("button").filter({ hasText: "Previous" })
    const nextButton = page.locator("button").filter({ hasText: "Next" })

    await expect(previousButton).toBeVisible()
    await expect(nextButton).toBeVisible()
  })

  test("should navigate to create employee page", async ({ page }) => {
    const addButton = page.locator("a").filter({ hasText: "Add Employee" })
    await expect(addButton).toBeVisible()

    await addButton.click()
    await page.waitForURL("**/employees/create")
    expect(page.url()).toContain("/employees/create")
  })

  test("should paginate through results", async ({ page }) => {
    const nextButton = page.locator("button").filter({ hasText: "Next" })

    // Get initial page indicator
    const pageInfo = page.locator("text=/Page \\d+ of \\d+/")
    const initialText = await pageInfo.textContent()

    // Click next
    await nextButton.click()
    await page.waitForTimeout(300)

    // Page should change
    const newText = await pageInfo.textContent()
    expect(newText).not.toBe(initialText)
  })
})
