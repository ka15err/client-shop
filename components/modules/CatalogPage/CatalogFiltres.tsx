import { useMediaQuery } from '@/hooks/useMediaQuery'
import CatalogFiltresDesktop from './CatalogFiltersDesktop'
import { ICatalogFiltersProps } from '@/types/catalog'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import {
  $mebelManufacturers,
  $mebelType,
  setFileredMebels,
} from '@/context/mebels'
import { useStore } from 'effector-react'
import { useRouter } from 'next/router'
import { getMebelsFx } from '@/app/api/mebels'
import CatalogFiltersMobile from './CatalogFiltersMobile'

const CatalogFiltres = ({
  priceRange,
  setPriceRange,
  setIsPriceRangeChanged,
  resetFilterBtnDisabled,
  resetFilters,
  isPriceRangeChanged,
  currentPage,
  setIsFilterInQuery,
  closePopup,
  filtersMobileOpen,
}: ICatalogFiltersProps) => {
  const isMobile = useMediaQuery(820)
  const [spinner, setSpinner] = useState(false)
  const mebelManufacturers = useStore($mebelManufacturers)
  const typeMebel = useStore($mebelType)
  const router = useRouter()

  async function updateParamsAndFitlters<T>(updateParams: T, path: string) {
    const params = router.query
    delete params.mebelsManu
    delete params.mebelsType
    delete params.priceFrom
    delete params.priceTo

    router.push(
      {
        query: {
          ...params,
          ...updateParams,
        },
      },
      undefined,
      { shallow: true }
    )
    const data = await getMebelsFx(`/mebels?limit=20&offset=${path}`)

    setFileredMebels(data)
  }
  const applyFilters = async () => {
    setIsFilterInQuery(true)
    try {
      setSpinner(true)
      const priceFrom = Math.ceil(priceRange[0])
      const priceTo = Math.ceil(priceRange[1])
      const priceQuery = isPriceRangeChanged
        ? `&priceFrom=${priceFrom}&priceTo=${priceTo}`
        : ''

      const mebelsManu = mebelManufacturers
        .filter((item) => item.checked)
        .map((item) => item.title)
      const mebelsType = typeMebel
        .filter((item) => item.checked)
        .map((item) => item.title)

      const encodedMebelManuQuery = encodeURIComponent(
        JSON.stringify(mebelsManu)
      )
      const encodedMebelTypeQuery = encodeURIComponent(
        JSON.stringify(mebelsType)
      )
      const mebelManuQuery = `&mebel_manufacturer=${encodedMebelManuQuery}`
      const mebelTypeQuery = `&type=${encodedMebelTypeQuery}`

      const initialPage = currentPage > 0 ? 0 : currentPage

      if (mebelsManu.length && mebelsType.length && isPriceRangeChanged) {
        updateParamsAndFitlters(
          {
            mebelsManu: encodedMebelManuQuery,
            mebelsType: encodedMebelTypeQuery,
            priceFrom,
            priceTo,
            offset: initialPage + 1,
          },
          `${initialPage}${priceQuery}${mebelManuQuery}${mebelTypeQuery}`
        )
        return
      }

      if (isPriceRangeChanged) {
        updateParamsAndFitlters(
          {
            priceFrom,
            priceTo,
            offset: initialPage + 1,
          },
          `${initialPage}${priceQuery}`
        )
      }

      if (mebelsManu.length && mebelsType.length) {
        updateParamsAndFitlters(
          {
            mebelsManu: encodedMebelManuQuery,
            mebelsType: encodedMebelTypeQuery,
            offset: initialPage + 1,
          },
          `${initialPage}${mebelManuQuery}${mebelTypeQuery}`
        )

        return
      }

      if (mebelsManu.length) {
        updateParamsAndFitlters(
          {
            mebelsManu: encodedMebelManuQuery,
            offset: initialPage + 1,
          },
          `${initialPage}${mebelManuQuery}`
        )
      }
      if (mebelsType.length) {
        updateParamsAndFitlters(
          {
            mebelsType: encodedMebelTypeQuery,
            offset: initialPage + 1,
          },
          `${initialPage}${mebelTypeQuery}`
        )
      }
      if (mebelsType.length && isPriceRangeChanged) {
        updateParamsAndFitlters(
          {
            mebelsType: encodedMebelManuQuery,
            priceFrom,
            priceTo,
            offset: initialPage + 1,
          },
          `${initialPage}${mebelTypeQuery}${priceQuery}`
        )

        return
      }
      if (mebelsManu.length && isPriceRangeChanged) {
        updateParamsAndFitlters(
          {
            mebelsManu: encodedMebelTypeQuery,
            priceFrom,
            priceTo,
            offset: initialPage + 1,
          },
          `${initialPage}${mebelManuQuery}${priceQuery}`
        )

        return
      }
    } catch (error) {
      toast.error((error as Error).message)
    } finally {
      setSpinner(false)
    }
  }
  return (
    <>
      {isMobile ? (
        <CatalogFiltersMobile
          closePopup={closePopup}
          spinner={spinner}
          resetFilterBtnDisabled={resetFilterBtnDisabled}
          resetFilters={resetFilters}
          applyFilters={applyFilters}
          setIsPriceRangeChanged={setIsPriceRangeChanged}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          filtersMobileOpen={filtersMobileOpen}
        />
      ) : (
        <CatalogFiltresDesktop
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          setIsPriceRangeChanged={setIsPriceRangeChanged}
          resetFilterBtnDisabled={resetFilterBtnDisabled}
          spinner={spinner}
          resetFilters={resetFilters}
          applyFilters={applyFilters}
        />
      )}
    </>
  )
}

export default CatalogFiltres
