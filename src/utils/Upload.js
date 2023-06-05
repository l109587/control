import { createElement } from 'react'
import { Upload, message } from 'antd'
import { post, Update } from '@/services/https'
import { openNotificationWithIcon } from '@/utils/helper'
const h = createElement

const SUFFIX = /.+(.w+)$/,
  BYTE = 1024,
  ACCEPT = {
    zip:
      'application/zip,application/x-zip,application/x-zip-compressed,application/gzip,application/x-tar',
    pdf: 'application/pdf',
    excel:
      'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    image: 'image/jpeg,image/bmp,image/png,image/gif',
    txt: '',
  },
  getAccepts = (accept) =>
    (Array.isArray(accept) ? accept : [accept])
      .map((ac) => ACCEPT[ac])
      .join(','),
  beforeCheck = (config, file) => {
    let { accept, max = Number.MAX_VALUE } = config || {},
      { size, type } = file,
      accepts = getAccepts(accept).split(',')
    //大小限制(M)
    if(Math.pow(BYTE, 2) * max < size) {
      message.info(`文件不能超过${max}M`)
      return false
    }
  }

const UploadComponent = (props) => {
  let { children, config, paramentUpload } = props,
    { accept } = config,
    attrs = {}
  //不能在props对象上直接添加属性，只能再定义一个attrs对象
  Object.assign(attrs, {
    action: '',
    accept: getAccepts(accept),
    beforeUpload: (file) => beforeCheck(config, file),
    customRequest: (opts) => {
      let { file, onSuccess, onProgress, onError } = opts,
        { uid, name, type } = file
      name = `${uid}${name.replace(SUFFIX, '$1')}`
      //判断上传的文件是否是图片，若不是图片，前端可自行根据isImg来控制是否可预览文件
      if(getAccepts(accept).indexOf(type) > -1) file.isImg = true
      const formData = new FormData()
      formData.append('file', file)
      //添加接口条件传参
      if(paramentUpload) {
        for(const key in paramentUpload) {
          formData.append(key, paramentUpload[key])
        }
      }
      Update(config.url, formData, {
        onUploadProgress: ({ total, loaded }) => {
          onProgress(
            { percent: Math.round((loaded / total) * 100).toFixed(2) },
            file
          )
        },
      }).then((res) => {
        if(!res.success) {
          onSuccess(res);
        } else {
          onSuccess(res);
        }
      }).catch((e) => {
        console.log(e)
      })
    },
  })

  return h(Upload, { ...props, ...attrs }, children)
}

export default UploadComponent
