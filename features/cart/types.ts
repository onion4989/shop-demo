export type CartCatalogItem = {
  productId: string
  name: string
  price: number
  thumbnailUrl: string
  categoryId: string
  categoryName: string
  shippingAvailable: boolean
}

export type CartLine = {
  productId: string
  qty: number
}
