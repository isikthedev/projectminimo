import { test, expect } from '@playwright/test'

test.describe('Multi-tenant Middleware Routing', () => {
  test('should pass through requests on the main site', async ({ page }) => {
    // Navigate to homepage without subdomain
    await page.goto('http://localhost:3000/')
    await expect(page).toHaveTitle(/Payload Blank Template/)
    const heading = page.locator('h1').first()
    await expect(heading).toHaveText('Welcome to your new project.')
  })

  test('should pass through dashboard requests on the main site', async ({ page }) => {
    // Navigate to localhost:3000/dashboard
    // Since /dashboard has no page.tsx yet, it should return a 404
    // But it should NOT be rewritten to /sites/
    const response = await page.goto('http://localhost:3000/dashboard')
    expect(response?.status()).toBe(404)
  })

  test('should rewrite admin subdomain to /admin', async ({ page }) => {
    // Navigate to admin.localhost:3000
    // It should be rewritten to /admin, which redirects to admin login page
    await page.goto('http://admin.localhost:3000/')
    await expect(page).toHaveURL(/.*\/admin\/login.*/)
  })

  test('should rewrite standard subdomains to tenant custom sites', async ({ page }) => {
    // Navigate to me.localhost:3000
    // It should rewrite to /sites/me and render our mock page
    await page.goto('http://me.localhost:3000/')
    const body = page.locator('body')
    await expect(body).toContainText('Welcome to the site for subdomain: me')
  })
})
