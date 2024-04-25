import { IMebel } from './mebels'

export interface IDashboardSlider {
  items: IMebel[]
  spinner: boolean
  goToMebelPage?: boolean
}

export interface ICartAlertProps {
  count: number
  closeAlert: VoidFunction
}
