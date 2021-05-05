import variables from '@/styles/variables.scss'
import Cookies from 'js-cookie'
const themeColor = 'themeColor'

export function getThemeColor() {
  return Cookies.get(themeColor) || variables.menuActiveText
}

export function setThemeColor(value) {
  return Cookies.set(themeColor, value)
}

export function removeThemeColor() {
  return Cookies.remove(themeColor)
}
