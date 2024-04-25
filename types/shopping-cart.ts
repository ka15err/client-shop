export interface IShoppingCartItem {
  id: number
  name: string
  price: number
  image: string
  in_stock: number
  type: string
  mebel_manufacturer: string
  count: number
  total_price: number
  userId: number
  mebelId: number
}

export interface IAddToCartFx {
  url: string
  username: string
  mebelId: number
}

export interface IUpdateCartItemFx {
  url: string
  payload: {
    total_price?: number
    count?: number
  }
}

export interface ICartItemCounterProps {
  totalCount: number
  mebelId: number
  initialCount: number
  increasePrice: VoidFunction
  decreasePrice: VoidFunction
}
