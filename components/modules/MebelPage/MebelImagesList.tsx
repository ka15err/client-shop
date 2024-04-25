/* eslint-disable @next/next/no-img-element */
import { useStore } from 'effector-react'
import { useState } from 'react'
import { $mebel } from '@/context/mebel'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import MebelImagesItem from './MebelImagesItem'
import styles from '@/styles/mebel/index.module.scss'

const MebelImagesList = () => {
  const mebel = useStore($mebel)
  const images = mebel.images ? (JSON.parse(mebel.images) as string[]) : []
  const [currentImgSrc, setCurrentImgSrc] = useState('')

  return (
    <div className={styles.mebel__images}>
      <div className={styles.mebel__images__main}>
        <img src={currentImgSrc || images[0]} alt={mebel.name} />
      </div>
      <ul className={styles.mebel__images__list}>
        {images.map((item, i) => (
          <MebelImagesItem
            key={i}
            alt={`image-${i + 1}`}
            callback={setCurrentImgSrc}
            src={item}
          />
        ))}
      </ul>
    </div>
  )
}

export default MebelImagesList
