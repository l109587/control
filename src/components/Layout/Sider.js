import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Switch, Layout } from 'antd'
import { withI18n, Trans } from '@lingui/react'
import {
  BulbOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons'
import ScrollBar from '../ScrollBar'
import { config } from 'utils'
import SiderMenu from './Menu'
import styles from './Sider.less'
import imgURL from '@/assets/logo.png'
@withI18n()
class Sider extends PureComponent {
  render() {
    const {
      i18n,
      menus,
      theme,
      isMobile,
      collapsed,
      onCollapseChange,
    } = this.props

    return (
      <Layout.Sider
        width={200}
        theme={theme}
        breakpoint="lg"
        trigger={null}
        collapsible
        collapsed={collapsed}
        onBreakpoint={!isMobile && onCollapseChange}
        className={styles.sider}
        collapsedWidth={44}
      >
        <div className={styles.brand}>
          <div className={styles.logo}>
          </div>
        </div>
        <div className={styles.menuContainer}>
          <ScrollBar
            options={{
              suppressScrollX: true,
            }}
          >
            <SiderMenu
              menus={menus}
              theme={theme}
              isMobile={isMobile}
              collapsed={collapsed}
              onCollapseChange={onCollapseChange}
            />
          </ScrollBar>
        </div>
        <div className={styles.switchTheme}>
          <div
            className={styles.switchTheme}
            onClick={onCollapseChange.bind(this, !collapsed)}
          >
            {collapsed ? (
              <MenuUnfoldOutlined style={{ color: '#000' }} />
            ) : (
              <MenuFoldOutlined style={{ color: '#000' }} />
            )}
          </div>
        </div>
      </Layout.Sider>
    )
  }
}

Sider.propTypes = {
  menus: PropTypes.array,
  theme: PropTypes.string,
  isMobile: PropTypes.bool,
  collapsed: PropTypes.bool,
  onCollapseChange: PropTypes.func,
}

export default Sider
