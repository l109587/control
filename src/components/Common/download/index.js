import React, { useRef, useState } from 'react'
import {
  DatePicker,
  Form,
  Button,
  Divider,
  Input,
  Spin,
  Progress,
  message,
} from 'antd'
import { post } from '@/services/https'
import axios from 'axios'
import store from 'store'
import { stringify } from 'qs'
import { fetchAuth } from '@/utils/common';
let cancel = null
const Download = (props) => {
  const {
    text,                   //按钮文字
    api,                    //接口
    params,                 //参数
    setLoading,             //loading
    downstep = true,        //是否分布下载
    isLasting = false,      //第三步下载是否加入表单参数
    icon,                   //下载icon
    buttonType = 'default', //下载按钮类型
    filename,               //不是分布下载传入的下载文件名
  } = props
  const writable = fetchAuth()
  const [size, setSize] = useState(0) //文件大小
  const [loadedSize, setLoadedSize] = useState(0) //下载文件大小
  const [progress, setProgress] = useState(0) //下载进度
  const [dspeed, setDspeed] = useState('') //下载速度
  const [leftTime, setLeftTime] = useState(0) //剩余时间
  const [isShow, setIsShow] = useState(false) //是否展示进度条
  const [downable, setDownable] = useState(true) //下载按钮是否禁用
  let exportTimer = ''
  

  let lastTime = 0 // 上一次计算时间
  let lastSize = 0 // 上一次计算的文件大小
  //格式化大小
  const sizeTostr = (size,issub) => {
    let data = ''
    if (size < 1 * 1024) {
      //如果小于1KB转化成Bz
      data = size.toFixed(2) + 'B'
    } else if (size < 1 * 1024 * 1024) {
      //如果小于1MB转化成KB
      data = (size / 1024).toFixed(2) + 'KB'
    } else if (size < 1 * 1024 * 1024 * 1024) {
      //如果小于1GB转化成MB
      data = (size / (1024 * 1024)).toFixed(2) + 'MB'
    } else {
      //其他转化成GB
      data = (size / (1024 * 1024 * 1024)).toFixed(2) + 'GB'
    }
    const sizestr = data + ''
    const len = sizestr.indexOf('.')
    const dec = sizestr.substr(len + 1, 2)
    if (dec == '00'&& issub) {
      //当小数点后为00时 去掉小数部分
      return sizestr.substring(0, len) + sizestr.substr(len + 3, 2)
    }
    return sizestr
  }

  //格式化剩余时间
  const formatTime =(remainTime)=>{
    if (remainTime < 60) {
        return remainTime.toFixed(1) + "秒";
      } else {
        var min_total = Math.floor(remainTime.toFixed(0) / 60) || 0; // 分钟
        var sec = Math.floor(remainTime.toFixed(0) % 60) || 0; // 余秒
        if (min_total < 60) {
          return min_total + "分钟" + sec + "秒";
        } else {
          var hour_total = Math.floor(min_total / 60) || 0; // 小时数
          var min = Math.floor(min_total % 60) || 0; // 余分钟
          return hour_total + "小时" + min + "分钟" + sec + "秒";
        }
      }
  }
  //计算进度、剩余时间
  let timer = null
  const onDownloadProgress = (progressEvent) => {
    setSize(progressEvent.total)
    let process = ((progressEvent.loaded / progressEvent.total) * 100) | 0
    setProgress(process)
    setLoadedSize(progressEvent.loaded)
    if(process==100){
      message.success('下载完成')
    }
    if (lastTime == 0) {
      lastTime = new Date().getTime()
      lastSize = progressEvent.loaded
      return
    }

    /*计算间隔*/
    const nowTime = new Date().getTime()
    const intervalTime = (nowTime - lastTime) / 1000 // 时间单位为毫秒，需转化为秒
    const intervalSize = progressEvent.loaded - lastSize

    /*重新赋值以便于下次计算*/
    lastTime = nowTime
    lastSize = progressEvent.loaded

    /*计算速度*/
    let speed = intervalSize / intervalTime
    
    

    const bSpeed = speed // 保存以b/s为单位的速度值，方便计算剩余时间
    let units = 'b/s' // 单位名称

    if (speed / 1024 > 1) {
      speed = speed / 1024
      units = 'k/s'
    }

    if (speed / 1024 > 1) {
      speed = speed / 1024
      units = 'M/s'
    }

    setDspeed(`${speed.toFixed(1)}${units}`)

    /*计算剩余时间*/
    var leftime = (progressEvent.total - progressEvent.loaded) / bSpeed
    
    if(!timer){
        timer = setTimeout(() => {
            setLeftTime(leftime)
            timer = null
        }, 1000);
    }
    
  }
  //   /* 统一封装文件下载  */
  
  const fileDown = (file,data) => {
    setIsShow(true)
    setDownable(false)
    axios({
      url: URL + api,
      method: 'post',
      data: stringify({
        token: store.get('token'),
        ...data,
      }),
      responseType: 'blob',
      timeout: 1000 * 60 * 30,
      onDownloadProgress: onDownloadProgress,
      cancelToken: new axios.CancelToken(function executor(c) {
        // executor 函数接收一个 cancel 函数作为参数
        cancel = c;
      })
    })
      .then((res) => {
        setDownable(true)
        let link = document.createElement('a')
        let href = window.URL.createObjectURL(new Blob([res.data]))
        link.href = href
        link.download = file.file ? file.file : file
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(href)
      })
      .catch((err) => {
        console.log(err)
      })
  }
  const down = () =>{
    return downstep ? exportfile() : downFile(filename)
  }
  const exportfile = () => {
    setIsShow(false)
    setLoadedSize(0)
    setSize(0)
    setProgress(0)
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
    setLoading && setLoading(true)
    post(
      api,
      isLasting
        ? {
            ...params,
            op: 'rdnext',
          }
        : { op: 'rdnext' }
    )
      .then((res) => {
        if (res.success) {
          if (res.code === 202) {
            exportTimer = setTimeout(() => {
              rdnextExport()
            }, 1000)
          } else if (res.code === 200) {
            setLoading && setLoading(false)
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
    if (downstep) {
      data = isLasting
        ? { op: 'dnload', dnname: file, ...params }
        : { op: 'dnload', dnname: file }
    } else {
      data = file
    }
    fileDown(file,data)
  }
  return (
    <div>
      <Button onClick={down} icon={icon} type={buttonType} disabled={!writable||!downable}>{text}</Button>
      {isShow && size > 1024 * 1024 * 5 && !progress==100 && (
        <div>
          <Progress percent={progress} size="small" style={{ width: 260 }} />
          
          <div>
            <span>
              下载进度：{sizeTostr(loadedSize,false)}/{sizeTostr(size,true)}
            </span>
            {progress!==100&&<Button type='link' onClick={()=>{
              cancel()
              setDownable(true)
              setIsShow(false)
            }}>取消</Button>}
            {progress==100&&<span>，下载完成</span>}
            
          </div>
        </div>
      )}
    </div>
  )
}

export default Download
