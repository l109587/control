import React, { useEffect } from 'react'
import { postAsync, postGcert } from '@/services/https'
import { Alert, message } from 'antd'
import store from 'store'
import { ProCard } from '@ant-design/pro-components'
import { history } from 'umi'
const { NODE_ENV } = process.env

const Glogin = () => {
  useEffect(() => {
    getToken()
  }, [])

  const getToken = async () => {
    const res = await postGcert('/login.php?action=loginCert ', {
      psd:
        Math.random(20).toString(36).slice(-10) +
        Math.random().toString(36).slice(-10),
    })
    if (res && res.success) {
      store.set('login', res.success)
      store.set('token', res.token)
      store.set('utype', res.userType)
      store.set('luser', res.username)
      store.set('timeout', res.timeout)
      getMenuTree()
    } else {
      history.push({
        pathname: '/404',
      })
    }
  }

  const getMenuTree = async () => {
    let res
    const menuParams = NODE_ENV === 'development' ? { env: SYSTEM ?? '' } : {}
    res = await postAsync(
      '/cfg.php?controller=menu&action=menuTree',
      menuParams
    )
    if (res.success) {
      res.data?.map((item, index) => {
        item.key = 'sub1' + index
        if (item.children)
          item.children.map((child, index) => (child.key = item.key + index))
      })
      goDashboard(res.data[0])
      store.set('Permission', res.data)
    } else {
      message.error(res.msg)
      return false
    }
  }

  const goDashboard = (menu) => {
    let route = menu.route ? menu.route : menu.children[0].route
    let name = menu.children ? menu.children[0].zh.name : menu.zh.name
    let priMenuName = menu.zh.name
    store.set('routeIndex', route)
    store.set('routeName', name)
    store.set('priMenuName', priMenuName)
    history.push({
      pathname: route,
    })
  }

  return <div></div>
}

export default Glogin
