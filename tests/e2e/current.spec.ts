import { test, expect } from '@playwright/test'

test('test', async ({ page }) => {
  // Go to http://localhost:3000/
  await page.goto('http://localhost:3000/')

  // Click text=Current >> nth=0
  await page.locator('text=Current').first().click()
  await expect(page).toHaveURL('http://localhost:3000/#/current')

  // Select 2
  await page.locator('select').selectOption('2')

  // Click [placeholder="Sensitivity"]
  await page.locator('[placeholder="Sensitivity"]').click()

  // Fill [placeholder="Sensitivity"]
  await page.locator('[placeholder="Sensitivity"]').fill('2.8')

  // Press Tab
  await page.locator('[placeholder="Sensitivity"]').press('Tab')

  // Fill [placeholder="DPI"]
  await page.locator('[placeholder="DPI"]').fill('800')

  // Click text=18.56 CM/360
  const finalSens = page.locator('text=18.56 CM/360')
  await expect(finalSens).toContainText('18.56 CM/360')
})
