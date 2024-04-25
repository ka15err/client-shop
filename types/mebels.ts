export interface IMebel {
  id: number
  mebel_manufacturer: string
  price: number
  type: string
  vendor_code: string
  name: string
  description: string
  images: string
  in_stock: number
  bestseller: boolean
  new: boolean
  popularity: number
}

export interface IMebels {
  count: number
  rows: IMebel[]
}
