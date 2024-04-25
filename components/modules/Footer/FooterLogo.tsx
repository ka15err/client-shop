/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'
import styles from '@/styles/footer/index.module.scss'

const FooterLogo = () => {
  return (
    <div className={styles.footer__top__item}>
      <Link href="/dashboard" passHref legacyBehavior>
        <a className={styles.footer__top__item__logo}>
          <img src="/img/blue-fon-logo.svg" alt="logo" />
        </a>
      </Link>
    </div>
  )
}

export default FooterLogo
