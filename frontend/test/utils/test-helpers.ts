import { type Page } from "@playwright/test"

/**
 * Wait for network to be idle
 */
export async function waitForNetworkIdle(page: Page) {
  await page.waitForLoadState("networkidle")
}

/**
 * Take a screenshot with a descriptive name
 */
export async function takeScreenshot(page: Page, name: string) {
  await page.screenshot({ path: `test-results/screenshots/${name}.png` })
}

/**
 * Mock API response
 */
export async function mockApiResponse(
  page: Page,
  url: string,
  response: unknown,
  status = 200
) {
  await page.route(url, (route) =>
    route.fulfill({
      status,
      contentType: "application/json",
      body: JSON.stringify(response),
    })
  )
}

/**
 * Clear local storage
 */
export async function clearLocalStorage(page: Page) {
  await page.evaluate(() => localStorage.clear())
}

/**
 * Set auth token in local storage
 */
export async function setAuthToken(page: Page, token: string) {
  await page.evaluate((t) => localStorage.setItem("token", t), token)
}
