import { test, expect } from '@playwright/test'

test('Generate Random Sens', async ({ page }) => {
  await page.goto('http://localhost:3000/#/random')
  await page.locator('select').selectOption('2')
  await page.locator('[placeholder="DPI"]').click()
  await page.locator('[placeholder="DPI"]').fill('800')
  await page.locator('[placeholder="Minimum CM\\/360"]').click()
  await page.locator('[placeholder="Minimum CM\\/360"]').fill('20')
  await page.locator('[placeholder="Maximum CM\\/360"]').click()
  await page.locator('[placeholder="Maximum CM\\/360"]').fill('40')
  await page.locator('text=Regenerate').click()

  const sens = page.locator('id=sens')
  const sensText = await sens.innerText()
  const sensNum = Number(sensText.split(' ')[0])
  const cm = page.locator('id=cm')
  const cmText = await cm.innerText()
  const cmNum = Number(cmText.split(' ')[0])

  await expect(sens).toContainText('Counter Strike')
  expect(sensNum).toBeGreaterThanOrEqual(1.3)
  expect(sensNum).toBeLessThanOrEqual(2.6)
  expect(cmNum).toBeGreaterThanOrEqual(19.98)
  expect(cmNum).toBeLessThanOrEqual(39.97)
})
