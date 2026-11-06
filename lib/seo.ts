export const siteName = 'Sugar Alice'

export const siteDesc =
  'Sugar Alice はケーキ店のデモです。カップケーキやアイスケーキを見て、カートで疑似購入できます。'

export const siteOrigin = new URL('https://cakeshop.see-u-soon.design')

export const siteOg = {
  type: 'website' as const,
  locale: 'ja_JP',
  siteName,
  title: siteName,
  description: siteDesc,
}
