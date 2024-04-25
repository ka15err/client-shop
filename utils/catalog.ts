import { updateCartItemFx } from '@/app/api/shopping-cart'
import { idGenerator } from './common'
import { updateCartItemTotalPrice } from '@/context/shopping-cart'

const createManufacturerCheckbovObj = (title: string) => ({
  title,
  checked: false,
  id: idGenerator(),
})

export const mebelManufacturers = [
  'DISTRILAB',
  'АИНА ИНКОМ',
  'КАРТ БЛАНШ',
  'СЫР ЖИХАЗЫ KZ',
  'Союз Мебель',
  'Алматинская Мебельная Фабрика',
  'Фурнитрейд',
  'ДАР-МЕБЕЛЬ',
  'Комфорт',
].map(createManufacturerCheckbovObj)
export const typeMebel = [
  'Столы',
  'Стулья',
  'Кресла',
  'Шкафы',
  'Файловые ящики',
  'Компьютерные стойки',
  'Конференц-столы',
  'Ресепшн-стойки',
  'Мягкая мебель',
  'Полки',
].map(createManufacturerCheckbovObj)
