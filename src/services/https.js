import axios from 'axios'
import store from 'store'
import { stringify } from 'qs'
import { message } from 'antd'

let hide = null
const instance = axios.create({
  timeout: 1000*10, // 设置超时时间10s
  baseURL: process.env.NODE_ENV ==='development' ? URL : '',
  withCredentials: true, // 允许携带cookie
})

// 文档中的统一设置post请求头。下面会说到post请求的几种'Content-Type'
instance.defaults.withCredentials = false // 允许携带cookie

let httpCode = {
  400: '请求参数错误',
  401: '权限不足, 请重新登录',
  403: '服务器拒绝本次访问',
  404: '请求资源未找到',
  500: '内部服务器错误',
  501: '服务器不支持该请求中使用的方法',
  502: '网关错误',
  504: '网关超时',
}

/** 添加请求拦截器 **/
instance.interceptors.request.use(
  (config) => {
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    if (store.get('token')) {
      config.headers['token'] = store.get('token')
    }
    if (config.url.includes('pur/contract/export')) {
      config.headers['responseType'] = 'blob'
    }
    if (config.url.includes('upload?target')) {
      config.headers['Content-Type'] = 'authorization-text'
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

/** 添加响应拦截器  **/
instance.interceptors.response.use(
  (response) => {
    if (response.data.success) {
      return Promise.resolve(response.data)
    } else if (response.data.code == '300' || response.data.code == '100') {
      message.error(response.data.msg)
      return Promise.reject(response.data.message)
    } else if (response.data.code == '400') {
      message.error(response.data.msg)
      return Promise.reject(response.data.message)
    } else if (response.data.error == '-1') {
      message.error('格式不正确，请重新上传')
      return Promise.reject(response.data.message)
    } else if (response.data.type) {
      return Promise.resolve(response)
    } else if ( response.data.code == '421' || (response.data.code == '420' && response.data.success == false)) {
      store.set('login', false)
      store.set('luser', {})
      store.set('isInit', false)
      store.set('token', '')
      location.href = '/login'
    } else {
      return Promise.resolve(response.data)
    }
  },
  (error) => {
    if (error.config.url == '/cfg.php?controller=sys&action=checkRebootFinish') {
        let data = { error:'等待' }
        return Promise.resolve(data)
    } else {
      if (error.response) {
        // 根据请求失败的http状态码去给用户相应的提示
        let tips = error.response.status in httpCode
            ? httpCode[error.response.status] : error.response.data.message
        // message.error(tips)
        let arr = error.response.request.responseURL
        if (arr.substring(arr.lastIndexOf('/') + 1) == 'resumefactory') {
          store.set('login', false)
          store.set('luser', {})
          store.set('isInit', false)
          store.set('token', '')
          location.href = '/login'
        }
        if (error.response.status === 401) {
        }
        return Promise.reject(error)
      } else {
        return Promise.reject('请求超时, 请刷新重试')
      }
    }
  }
)

/* 统一封装get请求 */
export const get = (url, params, config = {}) => {
  return new Promise((resolve, reject) => {
    instance({
      method: 'get',
      url,
      params,
      ...config,
    })
    .then((response) => {
      resolve(response)
    })
    .catch((error) => {
      reject(error)
    })
  })
}

export const getAsync = (url, params, config = {}) => {
  return instance({
    method: 'get',
    url,
    data: stringify({
      token: store.get('token')
    }),
    ...config,
  })
}

/* 统一封装post请求  */
export const post = (url, data, config = {}) => {
  return new Promise((resolve, reject) => {
    instance({
      method: 'post',
      url,
      data: stringify({
        token: store.get('token'),
        ...data,
      }),
      ...config,
    })
    .then((response) => {
      resolve(response)
    })
    .catch((error) => {
      reject(error)
    })
  })
}

export const postAsync = (url, data, config = {}) => {
  return instance({
    method: 'post',
    url,
    data: stringify({
      token: store.get('token'),
      ...data,
    }),
    ...config,
  })
}

export const postGcert = (url, data, config = {}) => {
  return instance({
    method: 'post',
    url,
    data: stringify({
      ...data,
    }),
    ...config,
  })
}

/* 统一封装put请求  */
export const put = (url, data, config = {}) => {
  return new Promise((resolve, reject) => {
    instance({
      method: 'put',
      url,
      data,
      ...config,
    })
    .then((response) => {
      resolve(response)
    })
    .catch((error) => {
      reject(error)
    })
  })
}

/* 统一封装post请求上传  */
export const Update = (url, data, config) => {
  return new Promise((resolve, reject) => {
    instance({
      method: 'post',
      url,
      data,
      timeout: 10000 * 6 * 10,
      ...config,
    })
    .then((response) => {
      resolve(response)
    })
    .catch((error) => {
      reject(error)
    })
  })
}

/* 统一封装文件下载  */
export const fileDown = (url, data, config) => {
  return new Promise((resolve, reject) => {
    instance({
      method: 'post',
      url,
      data:stringify({
        token: store.get('token'),
        ...data,
      }),
      responseType:'blob',
      timeout: 10000 * 3 * 10,
      ...config,
    })
    .then((response) => {
      resolve(response)
    })
    .catch((error) => {
      reject(error)
    })
  })
}

/* 统一封装超时show  */
export const delayPost = (url, data, config) => {
  return new Promise((resolve, reject) => {
    instance({
      method: 'post',
      url,
      data:stringify({
        token: store.get('token'),
        ...data,
      }),
      timeout: 1000 * 10 * 6 * 5,
      ...config,
    })
    .then((response) => {
      resolve(response)
    })
    .catch((error) => {
      reject(error)
    })
  })
}

/* 统一封装delete请求  */
export const Delete = (url, data, config = {}) => {
  return new Promise((resolve, reject) => {
    instance({
      method: 'delete',
      url,
      data,
      ...config,
    })
    .then((response) => {
      resolve(response)
    })
    .catch((error) => {
      reject(error)
    })
  })
}
