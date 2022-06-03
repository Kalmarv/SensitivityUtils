import { test, expect } from '@playwright/test'

// Convert one game to another
test('Convert Sensitivity', async ({ page }) => {
  await page.goto('http://localhost:3000/#/convert')
  await page
    .locator('text=FromOverwatchFortniteCounter StrikeQuake ChampionsIn-Game SensDPI >> select')
    .selectOption('2')
  await page.locator('[placeholder="Sensitivity"]').click()
  await page.locator('[placeholder="Sensitivity"]').fill('1.4')
  await page.locator('text=In-Game SensDPI >> [placeholder="DPI"]').click()
  await page.locator('text=In-Game SensDPI >> [placeholder="DPI"]').fill('800')
  await page.locator('text=ToOverwatchFortniteCounter StrikeQuake ChampionsDPI >> select').selectOption('0')
  await page.locator('text=ToOverwatchFortniteCounter StrikeQuake ChampionsDPI >> [placeholder="DPI"]').click()
  await page.locator('text=ToOverwatchFortniteCounter StrikeQuake ChampionsDPI >> [placeholder="DPI"]').fill('800')

  const sens = page.locator('id=sens')
  const game = page.locator('id=game')
  const dpi = page.locator('id=dpi')
  const cm = page.locator('id=cm')

  await expect(sens).toContainText('4.67 in Overwatch')
  await expect(game).toContainText('Counter Strike → Overwatch')
  await expect(dpi).toContainText('DPI: 800 → 800')
  await expect(cm).toContainText('37.08 CM/360')
})
