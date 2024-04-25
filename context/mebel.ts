import { IMebel } from '@/types/mebels'
import { createDomain } from 'effector-next'

const mebel = createDomain()

export const setMebel = mebel.createEvent<IMebel>()

export const $mebel = mebel
  .createStore<IMebel>({} as IMebel)
  .on(setMebel, (_, mebels) => mebels)
