import { getBestsellersOrNewMebelFx } from '@/app/api/mebels'
import CartAlert from '@/components/modules/DashboardPage/CartAlert'
import DashboardSlider from '@/components/modules/DashboardPage/DashboardSlider'
import { $mode } from '@/context/mode'
import { $shoppingCart } from '@/context/shopping-cart'
import styles from '@/styles/dashboard/index.module.scss'
import { IMebels } from '@/types/mebels'
import { useStore } from 'effector-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
const DashboardPage = () => {
  const [newMebels, setNewMebel] = useState<IMebels>({} as IMebels)
  const [bestsellers, setBestsellers] = useState<IMebels>({} as IMebels)
  const [spinner, setSpinner] = useState(false)
  const shoppingCart = useStore($shoppingCart)
  const [showAlert, setShowAlert] = useState(!!shoppingCart.length)
  const mode = useStore($mode)
  const darkModeClass = mode === 'dark' ? `${styles.dark_mode}` : ''
  useEffect(() => {
    loadMebels()
  }, [])
  const loadMebels = async () => {
    try {
      setSpinner(true)
      const bestsellers = await getBestsellersOrNewMebelFx(
        '/mebels/bestsellers'
      )
      const newMebels = await getBestsellersOrNewMebelFx('/mebels/new')
      setNewMebel(newMebels)
      setBestsellers(bestsellers)
    } catch (error) {
      toast.error((error as Error).message)
    } finally {
      setSpinner(false)
    }
  }
  const closeAlert = () => setShowAlert(false)
  return (
    <section className={styles.dashboard}>
      <div className={`container ${styles.dashboard__container}`}>
        <AnimatePresence>
          {showAlert && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`${styles.dashboard__alert} ${darkModeClass}`}
            >
              <CartAlert count={shoppingCart.length} closeAlert={closeAlert} />
            </motion.div>
          )}
        </AnimatePresence>
        <h2 className={`${styles.dashboard__title} ${darkModeClass}`}>
          Мебель для офиса
        </h2>
        <div className={styles.dashboard__mebels}>
          <h3 className={`${styles.dashboard__mebels__title} ${darkModeClass}`}>
            Хиты продаж
          </h3>
          <DashboardSlider items={bestsellers.rows || []} spinner={spinner} />
        </div>
        <div className={styles.dashboard__mebels}>
          <h3 className={`${styles.dashboard__mebels__title} ${darkModeClass}`}>
            Новинка
          </h3>
          <DashboardSlider items={newMebels.rows || []} spinner={spinner} />
        </div>
        <div className={styles.dashboard__about}>
          <h3 className={`${styles.dashboard__mebels__title} ${darkModeClass}`}>
            О компании
          </h3>
          <p className={`${styles.dashboard__about__text} ${darkModeClass}`}>
            Добро пожаловать в мир уютных интерьеров и неповторимого стиля! Мы -
            молодая и динамично развивающаяся компания из прекрасного города
            Актау. Наша страсть заключается в создании пространств, которые
            вдохновляют, поддерживают продуктивность и способствуют
            благополучию. Специализируясь на продаже офисной мебели, мы уверены,
            что правильно организованное рабочее окружение - это не только ключ
            к успеху бизнеса, но и качественной жизни.
          </p>
        </div>
      </div>
    </section>
  )
}

export default DashboardPage
