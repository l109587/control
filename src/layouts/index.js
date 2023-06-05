import React, { Component } from 'react'
import { setLocale, getAllLocales, withRouter } from 'umi'
import 'remixicon/fonts/remixicon.less';
import { getLocale } from 'utils'
import BaseLayout from './BaseLayout'
import 'remixicon/fonts/remixicon.css';
import 'font-awesome/less/font-awesome.less';
import 'material-design-icons/iconfont/material-icons.css';
import '@/assets/alibaba/iconfontalibaba.css';
// import '@/assets/fonts/remixicon/remixicon.less'
import moment from 'moment';
const { i18n } = require('../utils/config')
const { defaultLanguage } = i18n

@withRouter
class Layout extends Component {
  state = {
    catalogs: {},
  }

  language = defaultLanguage

  componentDidMount () {
    const language = getLocale();
    this.language = language
  }

  shouldComponentUpdate (nextProps, nextState) {
    const language = getLocale()
    const preLanguage = this.language
    const { catalogs } = nextState

    if (preLanguage !== language && !catalogs[language]) {
      this.language = language
      return false
    }
    this.language = language
    return true
  }

  render () {
    const { children } = this.props
    const { catalogs } = this.state
    let language = getLocale()
    if (!catalogs[language]) language = defaultLanguage

    return (
      <div>
        <BaseLayout>{children}</BaseLayout>
      </div>
    )
  }
}

export default Layout
