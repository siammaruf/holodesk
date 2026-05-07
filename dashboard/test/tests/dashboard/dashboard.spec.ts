import { test, expect } from "@playwright/test"

test.describe("Dashboard Page", () => {
  // Note: These tests assume authentication is hardcoded to true
  // When real auth is implemented, these tests will need auth fixtures

  test("should display dashboard when authenticated", async ({ page }) => {
    await page.goto("/admin")
    await page.waitForLoadState("networkidle")

    // Verify dashboard content is visible
    const heading = page.locator("h2").filter({ hasText: "Welcome back" })
    await expect(heading).toBeVisible()
  })

  test("should display stats cards", async ({ page }) => {
    await page.goto("/admin")
    await page.waitForLoadState("networkidle")

    // Check for stats cards
    const totalOrdersCard = page.locator("text=Total Orders")
    const loyaltyPointsCard = page.locator("text=Loyalty Points")
    const favoriteCoffeeCard = page.locator("text=Favorite Coffee")

    await expect(totalOrdersCard).toBeVisible()
    await expect(loyaltyPointsCard).toBeVisible()
    await expect(favoriteCoffeeCard).toBeVisible()
  })

  test("should display recent orders section", async ({ page }) => {
    await page.goto("/admin")
    await page.waitForLoadState("networkidle")

    const recentOrdersHeading = page.locator("h3").filter({ hasText: "Recent Orders" })
    await expect(recentOrdersHeading).toBeVisible()
  })

  test("should have sidebar navigation", async ({ page }) => {
    await page.goto("/admin")
    await page.waitForLoadState("networkidle")

    // Check sidebar is visible
    const sidebar = page.locator("aside, nav").first()
    await expect(sidebar).toBeVisible()
  })
})
