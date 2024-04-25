import { useStore } from 'effector-react'
import { $mode } from '@/context/mode'
import { ICatalogFilterMobileProps } from '@/types/catalog'
import spinnerStyles from '@/styles/spinner/index.module.scss'
import FiltersPopupTop from './FiltersPopupTop'
import styles from '@/styles/catalog/index.module.scss'
import FiltersPopup from './FiltersPopup'
import {
  $mebelManufacturers,
  $mebelType,
  setMebelManufacturers,
  setMebelType,
  updateMebelManufacturers,
  updateMebelType,
} from '@/context/mebels'
import { useState } from 'react'
import Accordion from '@/components/elements/Accordion/Accordion'
import PriceRange from './PriceRange'
import { useMediaQuery } from '@/hooks/useMediaQuery'

const CatalogFiltersMobile = ({
  spinner,
  resetFilterBtnDisabled,
  resetFilters,
  closePopup,
  applyFilters,
  filtersMobileOpen,
  setIsPriceRangeChanged,
  priceRange,
  setPriceRange,
}: ICatalogFilterMobileProps) => {
  const mode = useStore($mode)
  const darkModeClass = mode === 'dark' ? `${styles.dark_mode}` : ''
  const mebelManufacturers = useStore($mebelManufacturers)
  const mebelType = useStore($mebelType)
  const [openMebels, setOpenMebels] = useState(false)
  const [openTypes, setOpenTypes] = useState(false)
  const handleOpenMebels = () => setOpenMebels(true)
  const handleCloseMebels = () => setOpenMebels(false)
  const handleOpenTypes = () => setOpenTypes(true)
  const handleCloseTypes = () => setOpenTypes(false)
  const isAnyBoilerManufacturerChecked = mebelManufacturers.some(
    (item) => item.checked
  )
  const isAnysMebelTypeChecked = mebelType.some((item) => item.checked)
  const isMobile = useMediaQuery(820)

  const resetAllMebelManufacturers = () =>
    setMebelManufacturers(
      mebelManufacturers.map((item) => ({ ...item, checked: false }))
    )

  const resetAllType = () =>
    setMebelType(mebelType.map((item) => ({ ...item, checked: false })))

  const applyFiltersAndClosePopup = () => {
    applyFilters()
    closePopup()
  }

  return (
    <div
      className={`${styles.catalog__bottom__filters} ${darkModeClass} ${
        filtersMobileOpen ? styles.open : ''
      }`}
    >
      <div className={styles.catalog__bottom__filters__inner}>
        <FiltersPopupTop
          resetBtnText="Сбросить все"
          title="Фильтры"
          resetFilters={resetFilters}
          resetFilterBtnDisabled={resetFilterBtnDisabled}
          closePopup={closePopup}
        />
        <div className={styles.filters__boiler_manufacturers}>
          <button
            className={`${styles.filters__manufacturer__btn} ${darkModeClass}`}
            onClick={handleOpenMebels}
          >
            Производитель мебели
          </button>
          <FiltersPopup
            title="Производитель мебели"
            resetFilterBtnDisabled={!isAnyBoilerManufacturerChecked}
            updateManufacturer={updateMebelManufacturers}
            setManufacturer={setMebelManufacturers}
            applyFilters={applyFiltersAndClosePopup}
            manufacturersList={mebelManufacturers}
            resetAllManufacturers={resetAllMebelManufacturers}
            handleClosePopup={handleCloseMebels}
            openPopup={openMebels}
          />
        </div>
        <div className={styles.filters__boiler_manufacturers}>
          <button
            className={`${styles.filters__manufacturer__btn} ${darkModeClass}`}
            onClick={handleOpenTypes}
          >
            Типы мебели
          </button>
          <FiltersPopup
            title="Типы мебели"
            resetFilterBtnDisabled={!isAnysMebelTypeChecked}
            updateManufacturer={updateMebelType}
            setManufacturer={setMebelType}
            applyFilters={applyFiltersAndClosePopup}
            manufacturersList={mebelType}
            resetAllManufacturers={resetAllType}
            handleClosePopup={handleCloseTypes}
            openPopup={openTypes}
          />
        </div>
        <div className={styles.filters__price}>
          <Accordion
            title="Цена"
            titleClass={`${styles.filters__manufacturer__btn} ${darkModeClass}`}
            hideArrowClass={styles.hide_arrow}
            isMobileForFilters={isMobile}
          >
            <div className={styles.filters__manufacturer__inner}>
              <PriceRange
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                setIsPriceRangeChanged={setIsPriceRangeChanged}
                resetFilterBtnDisabled={resetFilterBtnDisabled}
                resetFilters={resetFilters}
              />
              <div style={{ height: 24 }} />
            </div>
          </Accordion>
        </div>
      </div>
      <div className={styles.filters__actions}>
        <button
          className={styles.filters__actions__show}
          onClick={applyFiltersAndClosePopup}
          disabled={resetFilterBtnDisabled}
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
      </div>
    </div>
  )
}

export default CatalogFiltersMobile
