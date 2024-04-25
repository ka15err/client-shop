import {
  $mebels,
  setMebelsByPopularity,
  setMebelsCheapFirst,
  setMebelsExpensiveFirst,
} from '@/context/mebels'
import { $mode } from '@/context/mode'
import {
  controlStyles,
  menuStyles,
  selectStyles,
} from '@/styles/catalog/select'
import { optionStyles } from '@/styles/searchInput'
import { IOption, SelectOptionType } from '@/types/common'
import { createSelectOption } from '@/utils/common'
import { categoriesOptions } from '@/utils/selectContents'
import { useStore } from 'effector-react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
// import { InputActionMeta } from 'react-select'
import Select from 'react-select'

const FilterSelect = ({
  setSpinner,
}: {
  setSpinner: (arg0: boolean) => void
}) => {
  const mode = useStore($mode)
  const mebels = useStore($mebels)
  const [categoryOption, setCategoryOption] = useState<SelectOptionType>(null)
  const router = useRouter()

  useEffect(() => {
    if (mebels.rows) {
      switch (router.query.first) {
        case 'cheap':
          updateCategoryOption('Сначала дешевые')
          setMebelsCheapFirst()
          break
        case 'expensive':
          updateCategoryOption('Сначала дорогие')
          setMebelsExpensiveFirst()
          break
        case 'popular':
          updateCategoryOption('По популярности')
          setMebelsByPopularity()
          break
        default:
          updateCategoryOption('Сначала дешевые')
          setMebelsCheapFirst()
          break
      }
    }
  }, [mebels.rows, router.query.first])

  const updateCategoryOption = (value: string) =>
    setCategoryOption({ value, label: value })

  const updateRoteParam = (first: string) =>
    router.push(
      {
        query: {
          ...router.query,
          first,
        },
      },
      undefined,
      { shallow: true }
    )

  const handleSearchOptionChange = (selectedOption: SelectOptionType) => {
    setSpinner(true)
    setCategoryOption(categoryOption)
    switch ((selectedOption as IOption).value) {
      case 'Сначала дешевые':
        setMebelsCheapFirst()
        updateRoteParam('cheap')
        break
      case 'Сначала дорогие':
        setMebelsExpensiveFirst()
        updateRoteParam('expensive')
        break
      case 'По популярности':
        setMebelsByPopularity()
        updateRoteParam('popularity')
        break
      default:
        break
    }
    setTimeout(() => setSpinner(false), 1000)
  }
  return (
    <Select
      placeholder="Я ищу..."
      value={categoryOption || createSelectOption('Сначала дешевые')}
      onChange={handleSearchOptionChange}
      styles={{
        ...selectStyles,
        // container: (defaultStyles) => ({
        //   ...defaultStyles,
        //   ...onMenuOpenContainerStyles,
        // }),
        control: (defaultStyles) => ({
          ...controlStyles(defaultStyles, mode),
          // backgroundColor: mode === 'dark' ? '#2d2d2d' : '#ffffff',
          // zIndex,
          // transition: 'none',
          // ...onMenuOpenControlStyles,
        }),
        input: (defaultStyles) => ({
          ...defaultStyles,
          color: mode === 'dark' ? '#f2f2f2' : '#222222',
        }),
        menu: (defaultStyles) => ({
          ...menuStyles(defaultStyles, mode),
          // zIndex,
          // marginTop: '-1px',
        }),
        option: (defaultStyles, state) => ({
          ...optionStyles(defaultStyles, state, mode),
        }),
      }}
      isSearchable={false}
      options={categoriesOptions}
    />
  )
}

export default FilterSelect
