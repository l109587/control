import { useLocation, useSelector } from 'umi'
import { language } from '@/utils/language'
export function fetchAuth (){
  const location = useLocation()
  const authsList = useSelector(({ app }) => app.authsList)
  const writable = authsList.filter((item) => item.route === location.pathname)[0]?.writable
  return writable
}

// 数字输入框输入范围校验提示
export function valiCompare (value, callback, minVal, maxVal) {
  if (value < minVal || value > maxVal) {
    callback(language('project.number.minAndMax',{ min: minVal, max: maxVal}))
  } else {
    callback()
  }
}