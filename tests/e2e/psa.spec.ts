import { test, expect } from '@playwright/test'

test('PSA Sensitivity', async ({ page }) => {
  await page.goto('http://localhost:3000/#/psa')
  await page.locator('[placeholder="Sensitivity"]').click()
  await page.locator('[placeholder="Sensitivity"]').fill('6')
  await page.locator('button:has-text("Higher")').click()
  await page.locator('button:has-text("Higher")').click()
  await page.locator('button:has-text("Lower")').click()
  await page.locator('button:has-text("Lower")').click()
  await page.locator('button:has-text("Higher")').click()
  await page.locator('button:has-text("Lower")').click()

  const sens = page.locator('id=sens')
  await expect(sens).toContainText('6.67')
})
