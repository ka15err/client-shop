import { getMebelsFx } from '@/app/api/mebels'
import FilterSelect from '@/components/modules/CatalogPage/FilterSelect'
import FiltersBlock from '@/components/modules/CatalogPage/FiltersBlock'
import {
  $filteredMebels,
  $mebelManufacturers,
  $mebelType,
  $mebels,
  setMebelManufacturers,
  setMebelType,
  setMebels,
  updateMebelManufacturers,
  updateMebelType,
} from '@/context/mebels'
import { $mode } from '@/context/mode'
import styles from '@/styles/catalog/index.module.scss'
import { useStore } from 'effector-react'
import { AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import skeletonStyles from '@/styles/skeleton/index.module.scss'
import CatalogItem from '@/components/modules/CatalogPage/CatalogItem'
import ReactPaginate from 'react-paginate'
import { IQueryParams } from '@/types/catalog'
import { useRouter } from 'next/router'
import { IMebel, IMebels } from '@/types/mebels'
import CatalogFiltres from '@/components/modules/CatalogPage/CatalogFiltres'
import { usePopup } from '@/hooks/usePoup'
import FilterSvg from '@/components/elements/FilterSvg/FilterSvg'

const CatalogPage = ({ query }: { query: IQueryParams }) => {
  const mode = useStore($mode)
  const mebelManufacturers = useStore($mebelManufacturers)
  const typeMebel = useStore($mebelType)

  const filteredMebels = useStore($filteredMebels)
  const [isFilterInQuery, setIsFilterInQuery] = useState(false)

  const darkModeClass = mode === 'dark' ? `${styles.dark_mode}` : ' '
  const mebels = useStore($mebels)
  const [spinner, setSpinner] = useState(false)
  const [priceRange, setPriceRange] = useState([100000, 500000])
  const [isPriceRangeChanged, setIsPriceRangeChanged] = useState(false)
  const pagesCount = Math.ceil(mebels.count / 20)
  const isValidOffset =
    query.offset && !isNaN(+query.offset) && +query.offset > 0
  const [currentPage, setCurrentPage] = useState(
    isValidOffset ? +query.offset - 1 : 0
  )

  const router = useRouter()
  const isAnyMebelManufacturerChecked = mebelManufacturers.some(
    (item) => item.checked
  )
  const isAnyMebelTypeChecked = typeMebel.some((item) => item.checked)
  const resetFilterBtnDisabled = !(
    isPriceRangeChanged ||
    isAnyMebelTypeChecked ||
    isAnyMebelManufacturerChecked
  )
  const { toggleOpen, open, closePopup } = usePopup()
  useEffect(() => {
    loadMebels()
  }, [filteredMebels, isFilterInQuery])

  const loadMebels = async () => {
    try {
      setSpinner(true)
      const data = await getMebelsFx('/mebels?limit=20&offset=0')
      if (!isValidOffset) {
        router.replace({
          query: {
            offset: 1,
          },
        })
        resetPagination(data)
        return
      }
      if (isValidOffset) {
        if (+query.offset > Math.ceil(data.count / 20)) {
          router.push(
            {
              query: {
                ...query,
                offset: 1,
              },
            },
            undefined,
            { shallow: true }
          )

          setCurrentPage(0)
          setMebels(isFilterInQuery ? filteredMebels : data)
          return
        }
        const offset = +query.offset - 1
        const result = await getMebelsFx(`/mebels?limit=20&offset=${offset}`)
        setCurrentPage(offset)
        setMebels(isFilterInQuery ? filteredMebels : data)
        return
      }
      setCurrentPage(0)
      setMebels(isFilterInQuery ? filteredMebels : data)
    } catch (error) {
      toast.error((error as Error).message)
    } finally {
      setSpinner(false)
    }
  }

  const resetPagination = (data: IMebels) => {
    setCurrentPage(0)
    setMebels(data)
  }
  console.log(mebels)

  const hendlePageChange = async ({ selected }: { selected: number }) => {
    try {
      setSpinner(true)
      const data = await getMebelsFx('/mebels?limit=20&offset=0')
      if (selected > pagesCount) {
        resetPagination(data)
        return
      }
      if (isValidOffset && +query.offset > Math.ceil(data.count / 2)) {
        resetPagination(isFilterInQuery ? filteredMebels : data)
        return
      }
      const result = await getMebelsFx(
        `/mebels?limit=20&offset=${selected}${
          isFilterInQuery && router.query.mebelsManu
            ? `&mebel_manufacturer=${router.query.mebelsManu}`
            : ''
        }${
          isFilterInQuery && router.query.mebelsType
            ? `&type=${router.query.mebelsType}`
            : ''
        }${
          isFilterInQuery && router.query.priceFrom && router.query.priceTo
            ? `&priceFrom=${router.query.priceFrom}&priceTo=${router.query.priceTo}`
            : ''
        }`
      )

      router.push(
        {
          query: {
            ...router.query,
            offset: selected + 1,
          },
        },
        undefined,
        { shallow: true }
      )

      setCurrentPage(selected)
      setMebels(result)
    } catch (error) {
      toast.error((error as Error).message)
    } finally {
      setTimeout(() => setSpinner(false), 1000)
    }
  }

  const resetFilters = async () => {
    try {
      const data = await getMebelsFx('/mebels?limit=20&offset=0')
      const params = router.query
      delete params.mebelsManu
      delete params.mebelsType
      delete params.priceFrom
      delete params.priceTo

      params.first = 'cheap'

      router.push({ query: { ...params } }, undefined, { shallow: true })
      setMebelManufacturers(
        mebelManufacturers.map((item) => ({ ...item, checked: false }))
      )
      setMebelType(typeMebel.map((item) => ({ ...item, checked: false })))

      setMebels(data)
      setPriceRange([1000, 10000])
      setIsPriceRangeChanged(false)
    } catch (error) {
      toast.error((error as Error).message)
    }
  }

  return (
    <section className={styles.catalog}>
      <div className={`container ${styles.catalog__container}`}>
        <h2 className={`${styles.catalog__title} ${darkModeClass}`}>
          Каталог товаров
        </h2>
        <div className={`${styles.catalog__top} ${darkModeClass}`}>
          <AnimatePresence>
            {isAnyMebelManufacturerChecked && (
              <FiltersBlock
                title="Производитель мебели"
                event={updateMebelManufacturers}
                manufacturersList={mebelManufacturers}
              />
            )}
          </AnimatePresence>
          <AnimatePresence>
            {isAnyMebelTypeChecked && (
              <FiltersBlock
                title="Тип мебелиы"
                event={updateMebelType}
                manufacturersList={typeMebel}
              />
            )}
          </AnimatePresence>
          <div className={styles.catalog__top__inner}>
            <button
              className={`${styles.catalog__top__reset} ${darkModeClass}`}
              disabled={resetFilterBtnDisabled}
              onClick={resetFilters}
            >
              Сбросить фильтр
            </button>
            <button
              className={styles.catalog__top__mobile_btn}
              onClick={toggleOpen}
            >
              <span className={styles.catalog__top__mobile_btn__svg}>
                <FilterSvg />
              </span>
              <span className={styles.catalog__top__mobile_btn__text}>
                Фильтр
              </span>
            </button>
            <FilterSelect setSpinner={setSpinner} />
          </div>
        </div>
        <div className={`${styles.catalog__bottom} ${darkModeClass}`}>
          <div className={styles.catalog__bottom__inner}>
            <CatalogFiltres
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              setIsPriceRangeChanged={setIsPriceRangeChanged}
              resetFilterBtnDisabled={resetFilterBtnDisabled}
              resetFilters={resetFilters}
              isPriceRangeChanged={isPriceRangeChanged}
              currentPage={currentPage}
              setIsFilterInQuery={setIsFilterInQuery}
              closePopup={closePopup}
              filtersMobileOpen={open}
            />
            {spinner ? (
              <ul className={skeletonStyles.skeleton}>
                {Array.from(new Array(20)).map((_, i) => (
                  <li
                    key={i}
                    className={`${skeletonStyles.skeleton__item} ${
                      mode === 'dark' ? `${skeletonStyles.dark_mode}` : ''
                    }`}
                  >
                    <div className={skeletonStyles.skeleton__item__light} />
                  </li>
                ))}
              </ul>
            ) : (
              <ul className={styles.catalog__list}>
                {mebels.rows?.length ? (
                  mebels.rows.map((item) => (
                    <CatalogItem item={item} key={item.id} />
                  ))
                ) : (
                  <span>Список товаров пуст</span>
                )}
              </ul>
            )}
          </div>
          <ReactPaginate
            containerClassName={styles.catalog__bottom__list}
            pageClassName={styles.catalog__bottom__list__item}
            pageLinkClassName={styles.catalog__bottom__list__item__link}
            previousClassName={styles.catalog__bottom__list__prev}
            nextClassName={styles.catalog__bottom__list__next}
            breakClassName={styles.catalog__bottom__list__break}
            breakLinkClassName={`${styles.catalog__bottom__list__break__link} ${darkModeClass}`}
            breakLabel="..."
            pageCount={pagesCount}
            forcePage={currentPage}
            onPageChange={hendlePageChange}
          />
        </div>
      </div>
    </section>
  )
}
export default CatalogPage
