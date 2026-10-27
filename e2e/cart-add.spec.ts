import { expect, test } from '@playwright/test'

test('Top からカートに入れてサイドカートが開く', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByText('おすすめ人気商品').first()).toBeVisible({
    timeout: 30_000,
  })

  await page.getByText('カップケーキ / Cup Cake').first().scrollIntoViewIfNeeded()
  const trigger = page.locator('button[aria-haspopup="dialog"]').first()
  await expect(trigger).toBeVisible()
  await trigger.click()

  const addBtn = page.getByRole('button', { name: 'カートに入れる' })
  await expect(addBtn).toBeVisible()
  await addBtn.click()

  const openCart = page.getByRole('button', { name: 'カートを開く' }).first()
  await expect(openCart).toBeVisible({ timeout: 15_000 })
  await openCart.click()

  await expect(page.getByRole('heading', { name: 'カート' })).toBeVisible()
  await expect(page.getByText('カートにはまだ商品がありません。')).toHaveCount(0)
})
