import { test, expect } from '@playwright/test'

// Calculating current sens
test('Calculating Sens', async ({ page }) => {
  await page.goto('http://localhost:3000/#/current')
  await page.locator('select').selectOption('2')
  await page.locator('[placeholder="Sensitivity"]').click()
  await page.locator('[placeholder="Sensitivity"]').fill('1.4')
  await page.locator('[placeholder="DPI"]').click()
  await page.locator('[placeholder="DPI"]').fill('800')

  const sens = page.locator('id=sens')
  const dpi = page.locator('id=dpi')
  const cm = page.locator('id=cm')

  await expect(cm).toContainText('37.11 CM/360')
  await expect(sens).toContainText('1.4')
  await expect(dpi).toContainText('800')
})
