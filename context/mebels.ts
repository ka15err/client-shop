import { IFilterCheckboxItem } from '@/types/catalog'
import { IMebels } from '@/types/mebels'
import { mebelManufacturers, typeMebel } from '@/utils/catalog'
import { createDomain } from 'effector-next'

const mebels = createDomain()

export const setMebels = mebels.createEvent<IMebels>()

export const setMebelsCheapFirst = mebels.createEvent()
export const setMebelsExpensiveFirst = mebels.createEvent()
export const setMebelsByPopularity = mebels.createEvent()

export const setFileredMebels = mebels.createEvent()

export const setMebelManufacturers = mebels.createEvent<IFilterCheckboxItem[]>()
export const updateMebelManufacturers =
  mebels.createEvent<IFilterCheckboxItem>()
export const setMebelType = mebels.createEvent<IFilterCheckboxItem[]>()
export const updateMebelType = mebels.createEvent<IFilterCheckboxItem>()

const updateManufacturer = (
  manufacturers: IFilterCheckboxItem[],
  id: string,
  payload: Partial<IFilterCheckboxItem>
) =>
  manufacturers.map((item) => {
    if (item.id === id) {
      return {
        ...item,
        ...payload,
      }
    }

    return item
  })

export const $mebels = mebels
  .createStore<IMebels>({} as IMebels)
  .on(setMebels, (_, mebels) => mebels)
  .on(setMebelsCheapFirst, (state) => ({
    ...state,
    rows: state.rows.sort((a, b) => a.price - b.price),
  }))
  .on(setMebelsExpensiveFirst, (state) => ({
    ...state,
    rows: state.rows.sort((a, b) => b.price - a.price),
  }))
  .on(setMebelsByPopularity, (state) => ({
    ...state,
    rows: state.rows.sort((a, b) => b.popularity - a.popularity),
  }))

export const $mebelManufacturers = mebels
  .createStore<IFilterCheckboxItem[]>(
    mebelManufacturers as IFilterCheckboxItem[]
  )
  .on(setMebelManufacturers, (_, mebels) => mebels)
  .on(updateMebelManufacturers, (state, payload) => [
    ...updateManufacturer(state, payload.id as string, {
      checked: payload.checked,
    }),
  ])

export const $mebelType = mebels
  .createStore<IFilterCheckboxItem[]>(typeMebel as IFilterCheckboxItem[])
  .on(setMebelType, (_, mebels) => mebels)
  .on(updateMebelType, (state, payload) => [
    ...updateManufacturer(state, payload.id as string, {
      checked: payload.checked,
    }),
  ])

export const $filteredMebels = mebels
  .createStore<IMebels>({} as IMebels)
  .on(setFileredMebels, (_, mebels) => mebels)
