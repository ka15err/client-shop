import { IShoppingCartItem } from '@/types/shopping-cart'
import { createDomain } from 'effector-next'

const shoppingCart = createDomain()

export const setShoppingCart = shoppingCart.createEvent<IShoppingCartItem[]>()
export const updateShoppingCart = shoppingCart.createEvent<IShoppingCartItem>()
export const removeShoppingCartItem = shoppingCart.createEvent<number>()
export const setTotalPrice = shoppingCart.createEvent<number>()
export const setDisableCart = shoppingCart.createEvent<boolean>()
export const updateCartItemTotalPrice = shoppingCart.createEvent<{
  mebelId: number
  total_price: number
}>()
export const updateCartItemCount = shoppingCart.createEvent<{
  mebelId: number
  count: number
}>()

const remove = (cartItems: IShoppingCartItem[], mebelId: number) =>
  cartItems.filter((item) => item.mebelId !== mebelId)

function updateCartItem<T>(
  cartItems: IShoppingCartItem[],
  mebelId: number,
  payload: T
) {
  return cartItems.map((item) => {
    if (item.mebelId === mebelId) {
      return {
        ...item,
        ...payload,
      }
    }

    return item
  })
}

export const $shoppingCart = shoppingCart
  .createStore<IShoppingCartItem[]>([])
  .on(setShoppingCart, (_, shoppingCart) => shoppingCart)
  .on(updateShoppingCart, (state, cartItem) => [...state, cartItem])
  .on(removeShoppingCartItem, (state, mebelId) => [...remove(state, mebelId)])
  .on(updateCartItemTotalPrice, (state, { mebelId, total_price }) => [
    ...updateCartItem(state, mebelId, { total_price }),
  ])
  .on(updateCartItemCount, (state, { mebelId, count }) => [
    ...updateCartItem(state, mebelId, { count }),
  ])

export const $totalPrice = shoppingCart
  .createStore<number>(0)
  .on(setTotalPrice, (_, value) => value)

export const $disableCart = shoppingCart
  .createStore<boolean>(false)
  .on(setDisableCart, (_, value) => value)
