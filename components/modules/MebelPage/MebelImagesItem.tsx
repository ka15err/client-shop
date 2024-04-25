import { IMebelImagesItemProps } from '@/types/mebel'
import styles from '@/styles/mebel/index.module.scss'

const MebelImagesItem = ({ src, callback, alt }: IMebelImagesItemProps) => {
  const changeMainImage = () => callback(src)

  return (
    <li className={styles.mebel__images__list__item} onClick={changeMainImage}>
      <img src={src} alt={alt} />
    </li>
  )
}

export default MebelImagesItem
