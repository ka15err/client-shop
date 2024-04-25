import {
  $mebelManufacturers,
  $mebelType,
  setMebelManufacturers,
  setMebelType,
  updateMebelManufacturers,
  updateMebelType,
} from '@/context/mebels'
import { $mode } from '@/context/mode'
import { useStore } from 'effector-react'
import FilterManufacturerAccordion from './FilterManufacturerAccordion'
import Accordion from '@/components/elements/Accordion/Accordion'
import PriceRange from './PriceRange'
import { ICatalogFilterDesktopProps } from '@/types/catalog'
import styles from '@/styles/catalog/index.module.scss'
import spinnerStyles from '@/styles/spinner/index.module.scss'
const CatalogFiltresDesktop = ({
  priceRange,
  setPriceRange,
  setIsPriceRangeChanged,
  resetFilterBtnDisabled,
  spinner,
  resetFilters,
  applyFilters,
}: ICatalogFilterDesktopProps) => {
  const mode = useStore($mode)
  const mebelManufacturers = useStore($mebelManufacturers)
  const typeMebel = useStore($mebelType)
  const darkModeClass = mode === 'dark' ? `${styles.dark_mode}` : ' '
  return (
    <div className={`${styles.catalog__bottom__filters} ${darkModeClass}`}>
      <h3
        className={`${styles.catalog__bottom__filters__title} ${darkModeClass}`}
      >
        Фильтры
      </h3>
      <div className={styles.filters__mebel_manufacturers}>
        <FilterManufacturerAccordion
          manufacturersList={mebelManufacturers}
          title="Производители мебели"
          setManufacturer={setMebelManufacturers}
          updateManufacturer={updateMebelManufacturers}
        />
      </div>
      <div className={styles.filter__price}>
        <Accordion
          title="Цена"
          titleClass={`${styles.filters__manufacturer__btn} ${darkModeClass}`}
          arrowOpenClass={styles.open}
        >
          <div className={styles.filters__manufacturer__inner}>
            <PriceRange
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              setIsPriceRangeChanged={setIsPriceRangeChanged}
              resetFilterBtnDisabled={resetFilterBtnDisabled}
              resetFilters={resetFilters}
            />
          </div>
        </Accordion>
      </div>
      <div className={styles.filters__mebel_manufacturers}>
        <FilterManufacturerAccordion
          manufacturersList={typeMebel}
          title="Тип мебели"
          setManufacturer={setMebelType}
          updateManufacturer={updateMebelType}
        />
      </div>
      <div className={styles.filters__actions}>
        <button
          className={styles.filters__actions__show}
          disabled={spinner || resetFilterBtnDisabled}
          onClick={applyFilters}
        >
          {spinner ? (
            <span
              className={spinnerStyles.spinner}
              style={{ top: 6, left: '47%' }}
            />
          ) : (
            'Показать'
          )}
        </button>
        <button
          className={styles.filters__actions__reset}
          disabled={resetFilterBtnDisabled}
          onClick={resetFilters}
        >
          Сбросить
        </button>
      </div>
    </div>
  )
}

export default CatalogFiltresDesktop
