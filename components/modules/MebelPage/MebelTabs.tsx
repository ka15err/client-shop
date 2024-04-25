/* eslint-disable @next/next/no-img-element */
import { useStore } from 'effector-react'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { $mebel } from '@/context/mebel'
import { $mode } from '@/context/mode'
import styles from '@/styles/mebel/index.module.scss'

const MebelTabs = () => {
  const mode = useStore($mode)
  const mebel = useStore($mebel)
  const darkModeClass = mode === 'dark' ? `${styles.dark_mode}` : ''
  const [showDescription, setShowDescription] = useState(false)

  const handleShowDescription = () => {
    setShowDescription(false)
  }

  return (
    <div className={styles.mebel__tabs}>
      <div className={`${styles.mebel__tabs__controls} ${darkModeClass}`}>
        <button
          className={showDescription ? styles.active : ''}
          onClick={handleShowDescription}
        >
          Описание
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={styles.mebel__tabs__content}
      >
        <h3
          className={`${styles.mebel__tabs__content__title} ${darkModeClass}`}
        >
          {mebel.name}
        </h3>
        <p className={`${styles.mebel__tabs__content__text} ${darkModeClass}`}>
          {mebel.description}
        </p>
      </motion.div>
    </div>
  )
}

export default MebelTabs
