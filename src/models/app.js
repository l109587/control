/* global window */

import { history } from 'umi'
import { stringify } from 'qs'
import store from 'store'

const { pathToRegexp } = require('path-to-regexp')
import { CANCEL_REQUEST_MESSAGE } from 'utils/constant'
import { post } from '@/services/https'

const goDashboard = (route) => {
  if (pathToRegexp(['/', '/login']).exec(window.location.pathname)) {
    history.push({
      pathname: route,
    })
  }
}
const bodyHeight = document.body.clientHeight

//初始化时自调用一次，用于请求借口数据
export default {
  namespace: 'app',
  state: {
    routeList: '',
    locationPathname: '',
    locationQuery: {},
    theme: store.get('theme') || 'light',
    collapsed: store.get('collapsed') || false,
    notifications: [
      {
        title: 'New User is registered.',
        date: new Date(Date.now() - 10000000),
      },
      {
        title: 'Application has been approved.',
        date: new Date(Date.now() - 50000000),
      },
    ],
    list: [],
    siteName:'',
    authsList:[],
    contentHeight:store.get('layout')==='top'?bodyHeight-48:bodyHeight-72,
    layout:store.get('layout') || 'sider'
  },
  subscriptions: {
    setup({ dispatch }) {
      dispatch({ type: 'query' })
    },
    setupHistory({ dispatch, history }) {
      history.listen((location) => {
        dispatch({
          type: 'updateState',
          payload: {
            locationPathname: location.pathname,
            locationQuery: location.query,
          },
        })
      })
    },
    setupRequestCancel({ history }) {
      history.listen(() => {
        const { cancelRequest = new Map() } = window
        cancelRequest.forEach((value, key) => {
          if (value.pathname !== window.location.pathname) {
            value.cancel(CANCEL_REQUEST_MESSAGE)
            cancelRequest.delete(key)
          }
        })
      })
    },
  },
  effects: {
    *query({ payload }, { call, put, select }) {
      const isInit = store.get('isInit')
      if (isInit) {
        goDashboard()
        return
      }
      const isLogin = store.get('login')
      if (window.location.pathname !== '/404') {
        if (window.location.pathname !== '/glogin') {
          if (isLogin) {
            let routeIndex = store.get('routeIndex')
            goDashboard(routeIndex)
          } else {
            history.push({
              pathname: '/login',
              search: stringify({
                from: {},
              }),
            })
          }
        }
      } else {
        history.push({
          pathname: '/404',
        })
      }
    },

    *signOut({ payload }, { call, put }) {
      post('/login.php?action=logout')
      store.each((value,key)=>{
        if(key.indexOf('columnvalue')  == -1 && key.indexOf('timeout')  == -1 ){
          store.remove(key)
        }
      })
      yield put({ type: 'query' })
    },

    *getSiteName({ payload }, { put }){
      const { siteName } = payload

      yield put({
        type: 'changeSiteName',
        payload: {
          siteName
        },
      })
    }
  },
  reducers: {
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },

    handleThemeChange(state, { payload }) {
      store.set('theme', payload)
      state.theme = payload
    },

    handleCollapseChange(state, { payload }) {
      store.set('collapsed', payload)
      state.collapsed = payload
    },

    allNotificationsRead(state) {
      state.notifications = []
    },

    changeSiteName(state,{ payload }){
      state.siteName = payload.siteName
    },

    changeAuths(state,{ payload }){
      state.authsList = payload.authsList
    },

    changeLayout(state,{ payload }){
      state.layout = payload.layout
      state.contentHeight = payload.layout==='top'?bodyHeight-48:bodyHeight-72
    }
  }
}
