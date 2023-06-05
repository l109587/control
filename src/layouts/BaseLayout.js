import React, { PureComponent, Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'umi'
import { Helmet } from 'react-helmet'
import { Loader } from 'components'
import { queryLayout } from 'utils'
import NProgress from 'nprogress'
import config from 'utils/config'
import { withRouter } from 'umi'
import PublicLayout from './PublicLayout'
import PrimaryLayout from './PrimaryLayout'
import store from 'store'
import './BaseLayout.less'
import { post, postAsync } from '@/services/https'

const LayoutMap = {
  primary: PrimaryLayout,
  public: PublicLayout,
}

@withRouter
@connect(({app,loading }) => ({app, loading }))

class BaseLayout extends PureComponent {
  state={
    logoPath:''
  }
  previousPath = ''
  getPageTitle = (pathname) => {
    const Permission = store.get('Permission') || []
    if (Permission.length == 0 || pathname == '/login') {
      return '登录';
    }

    var list = Permission;
    for (var k in list) {
      if (list[k].route == pathname) {
        return list[k].zh.name;
      }

      if (list[k].children) {
        var chi = list[k].children;
        for(var i in chi) {
          if (chi[i].route == pathname) {
            return chi[i].zh.name;
          }
        }
      }
    }
    return '';
  }
  componentDidMount() {
    this.fetchLogo()
  }
  fetchLogo = ()=>{
    post('/login.php?action=logoroute').then((res)=>{
      if(res.success){
        this.setState({logoPath:res.route})
      }
    })
  }
  render() {
    const { app,loading, children, location } = this.props
    const { siteName } = app
    const Container = LayoutMap[queryLayout(config.layouts, location.pathname)]
    const currentPath = location.pathname + location.search
    if (currentPath !== this.previousPath) {
      NProgress.start()
    }
    if (!loading.global) {
      NProgress.done()
      this.previousPath = currentPath
    }
    const siteTile = store.get('siteName')?store.get('siteName'):siteName

    const title =  siteTile + '-' + this.getPageTitle(location.pathname);
    return (
      <Fragment>
        <Helmet>
          <link rel="icon" type="image/x-icon" href={this.state.logoPath} />
          <title>{title}</title>
          <meta name="description" content={title} />
        </Helmet>
        <Container>{children}</Container>
      </Fragment>
    )
  }
}

BaseLayout.propTypes = {
  loading: PropTypes.object,
}

export default BaseLayout

