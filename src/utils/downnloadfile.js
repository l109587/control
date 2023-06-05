import { post,fileDown } from '@/services/https'
import { message } from 'antd'
export default function download(api, params, setLoading,downstep = true,filename, isLasting = false) { // api：接口名称，params调用导出接口参数(对象)，setLoading：控制loading效果
  console.log(params)
  let exportTimer = ''
  const exportfile = () => {
    const newParams = { ...params, op: 'export' }
    post(api, newParams)
      .then((res) => {
        if (res.success) {
          rdnextExport()
        } else {
          res.msg && message.error(res.msg)
          return false
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }
  const rdnextExport = () => {
    setLoading&&setLoading(true)
    post(api, isLasting ? {
      ...params,
      op: 'rdnext',
    } : { op: 'rdnext' })
      .then((res) => {
        if (res.success) {
          if (res.code === 202) {
            exportTimer = setTimeout(() => {
                rdnextExport()
            }, 1000)
          } else if (res.code === 200) {
            setLoading&&setLoading(false)
            downFile(res.msg)
            clearTimeout(exportTimer)
          } else {
            message.error(res.msg)
            setLoading(false)
            return false
          }
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }
  const downFile = (file) => {
    let data = {}
    if(downstep){
      data = isLasting ? { op: 'dnload', dnname: file, ...params } : { op: 'dnload', dnname: file }
    }else{
      data = file
    }
    fileDown(api, data)
      .then((res) => {
        let link = document.createElement('a')
        let href = window.URL.createObjectURL(new Blob([res.data]))
        link.href = href
        link.download = file.file ? file.file : file
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(href)
      })
      .catch(() => {
        console.log('mistake')
      })
  }
  downstep?exportfile():downFile(filename)
}
