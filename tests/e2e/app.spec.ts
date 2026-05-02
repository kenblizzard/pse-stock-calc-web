import { expect, test } from '@playwright/test'

test('supports the main calculator flows', async ({ page }) => {
  await page.goto('/#/price-profit')

  await page.getByTestId('price-profit-shares').fill('100')
  await page.getByTestId('price-profit-buy-price').fill('10')
  await page.getByTestId('price-profit-sell-price').fill('12')

  await expect(page.getByText('₱1,022.55')).toBeVisible()
  await expect(page.getByText('₱1,176.22')).toBeVisible()

  await page.getByRole('link', { name: 'Buying Power' }).click()
  await page.getByTestId('buying-power-budget').fill('5000')
  await page.getByTestId('buying-power-price').fill('12')

  await expect(page.getByText('400')).toBeVisible()
  await expect(page.getByText('₱4,823.12')).toBeVisible()

  await page.getByRole('link', { name: 'Multiple Buys' }).click()
  await page.getByRole('button', { name: 'Add buy entry' }).click()

  const shareInputs = page.locator('input[inputmode="numeric"]')
  const priceInputs = page.locator('input[inputmode="decimal"]')

  await shareInputs.nth(0).fill('100')
  await priceInputs.nth(0).fill('10')
  await shareInputs.nth(1).fill('200')
  await priceInputs.nth(1).fill('12')

  await expect(page.getByText('₱3,445.31')).toBeVisible()
})

test('keeps mobile navigation and ad slots usable', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/#/price-profit')

  await expect(page.getByRole('link', { name: 'Price & Profit' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Buying Power' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Multiple Buys' })).toBeVisible()
  await expect(page.getByText('Reserved top banner ad')).toBeVisible()

  await page.getByTestId('price-profit-shares').fill('100')
  await page.getByTestId('price-profit-buy-price').fill('10')
  await page.getByTestId('price-profit-sell-price').fill('12')

  await expect(page.getByText('₱1,176.22')).toBeVisible()
})
