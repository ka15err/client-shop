import { useStore } from 'effector-react'
import { toast } from 'react-toastify'
import { useEffect } from 'react'
import { $mebel } from '@/context/mebel'
import { $mode } from '@/context/mode'
import MebelImagesList from '@/components/modules/MebelPage/MebelImagesList'
import { formatPrice } from '@/utils/common'
import { $shoppingCart } from '@/context/shopping-cart'
import CartHoverCheckedSvg from '@/components/elements/CartHoverCheckedSvg/CartHoverCheckedSvg'
import CartHoverSvg from '@/components/elements/CartHoverSvg/CartHoverSvg'
import spinnerStyles from '@/styles/spinner/index.module.scss'
import { toggleCartItem } from '@/utils/shopping-cart'
import { $user } from '@/context/user'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import MebelTabs from '@/components/modules/MebelPage/MebelTabs'
import DashboardSlider from '@/components/modules/DashboardPage/DashboardSlider'
import { getMebelsFx } from '@/app/api/mebels'
import { $mebels, setMebels, setMebelsByPopularity } from '@/context/mebels'
import MebelAccordion from '@/components/modules/MebelPage/MebelAccordion'
import { removeFromCartFx } from '@/app/api/shopping-cart'
import styles from '@/styles/mebel/index.module.scss'

const MebelPage = () => {
  const mode = useStore($mode)
  const user = useStore($user)
  const isMobile = useMediaQuery(850)
  const mebel = useStore($mebel)
  const mebels = useStore($mebels)
  const cartItems = useStore($shoppingCart)
  const darkModeClass = mode === 'dark' ? `${styles.dark_mode}` : ''
  const isInCart = cartItems.some((item) => item.mebelId === mebel.id)
  const spinnerToggleCart = useStore(removeFromCartFx.pending)
  const spinnerSlider = useStore(getMebelsFx.pending)

  useEffect(() => {
    loadMebl()
  }, [])

  const loadMebl = async () => {
    try {
      const data = await getMebelsFx('/mebels?limit=20&offset=0')

      setMebels(data)
      setMebelsByPopularity()
    } catch (error) {
      toast.error((error as Error).message)
    }
  }

  const toggleToCart = () => toggleCartItem(user.username, mebel.id, isInCart)

  return (
    <section>
      <div className="container">
        <div className={`${styles.mebel__top} ${darkModeClass}`}>
          <h2 className={`${styles.mebel__title} ${darkModeClass}`}>
            {mebel.name}
          </h2>
          <div className={styles.mebel__inner}>
            <MebelImagesList />
            <div className={styles.mebel__info}>
              <span className={`${styles.mebel__info__price} ${darkModeClass}`}>
                {formatPrice(mebel.price || 0)} тг
              </span>
              <span className={styles.mebel__info__stock}>
                {mebel.in_stock > 0 ? (
                  <span className={styles.mebel__info__stock__success}>
                    Есть на складе
                  </span>
                ) : (
                  <span className={styles.mebel__info__stock__not}>
                    Нет на складе
                  </span>
                )}
              </span>
              <span className={styles.mebel__info__code}>
                Артикул: {mebel.vendor_code}
              </span>
              <button
                className={`${styles.mebel__info__btn} ${
                  isInCart ? styles.in_cart : ''
                }`}
                onClick={toggleToCart}
              >
                {spinnerToggleCart ? (
                  <span
                    className={spinnerStyles.spinner}
                    style={{ top: 10, left: '45%' }}
                  />
                ) : (
                  <>
                    <span className={styles.mebel__info__btn__icon}>
                      {isInCart ? <CartHoverCheckedSvg /> : <CartHoverSvg />}
                    </span>
                    {isInCart ? (
                      <span>Добавлено в карзину</span>
                    ) : (
                      <span>Положить в корзину</span>
                    )}
                  </>
                )}
              </button>
              {!isMobile && <MebelTabs />}
            </div>
          </div>
        </div>
        {isMobile && (
          <div className={styles.mebel__accordion}>
            <div className={styles.mebel__accordion__inner}>
              <MebelAccordion title="Описание">
                <div
                  className={`${styles.mebel__accordion__content} ${darkModeClass}`}
                >
                  <h3
                    className={`${styles.mebel__tabs__content__title} ${darkModeClass}`}
                  >
                    {mebel.name}
                  </h3>
                  <p
                    className={`${styles.mebel__tabs__content__text} ${darkModeClass}`}
                  >
                    {mebel.description}
                  </p>
                </div>
              </MebelAccordion>
            </div>
          </div>
        )}
        <div className={styles.mebel__bottom}>
          <h2 className={`${styles.mebel__title} ${darkModeClass}`}>
            Вам понравится
          </h2>
          <DashboardSlider
            goToMebelPage
            spinner={spinnerSlider}
            items={mebels.rows || []}
          />
        </div>
      </div>
    </section>
  )
}

export default MebelPage
