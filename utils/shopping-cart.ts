import { toast } from 'react-toastify'
import {
  addToCartFx,
  removeFromCartFx,
  updateCartItemFx,
} from '@/app/api/shopping-cart'
import {
  removeShoppingCartItem,
  updateCartItemTotalPrice,
  updateShoppingCart,
} from '@/context/shopping-cart'

export const toggleCartItem = async (
  username: string,
  mebelId: number,
  isInCart: boolean
) => {
  try {
    if (isInCart) {
      await removeFromCartFx(`/shopping-cart/one/${mebelId}`)
      removeShoppingCartItem(mebelId)
      return
    }

    const data = await addToCartFx({
      url: '/shopping-cart/add',
      username,
      mebelId,
    })

    updateShoppingCart(data)
  } catch (error) {
    toast.error((error as Error).message)
  }
}

export const removeItemFromCart = async (mebelId: number) => {
  try {
    await removeFromCartFx(`/shopping-cart/one/${mebelId}`)
    removeShoppingCartItem(mebelId)
  } catch (error) {
    toast.error((error as Error).message)
  }
}

export const updateTotalPrice = async (
  total_price: number,
  mebelId: number
) => {
  const data = await updateCartItemFx({
    url: `/shopping-cart/total-price/${mebelId}`,
    payload: { total_price },
  })

  updateCartItemTotalPrice({ mebelId, total_price: data.total_price })
}
