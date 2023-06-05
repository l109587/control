import React, { PureComponent, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Menu, Layout } from 'antd'
import { NavLink, withRouter, history, Link, useLocation } from 'umi'
import { pathToRegexp } from 'path-to-regexp'
import { arrayToTree, queryAncestors } from 'utils'
import iconMap from 'utils/iconMap'
import store from 'store'

const { SubMenu } = Menu

@withRouter
class TopMenu extends PureComponent {
  constructor(props) {
    super(props)
    this.menuRef = React.createRef()  //create Ref to get DOM
  } 
  state = {
    openKeys: [],
    routeName: [],
    operate:'',
  }

  //递归
  wirelessVal = (arr, value) => {
    arr.forEach((each, index) => {
      if (each.route == value) {
        if (each.pId != 0) {
          return each.route;
        } else {
          this.wirelessVal([], 999);
        }
      }
    })
  }
  componentDidMount = () => {  
    this.props.history.listen(location => {
      if(this.state.operate!=='click'){
        try {
          this.props.menus.forEach((item, index) => {
            if (item.route == location.pathname) {
              if (this.state.openKeys[0] != item.zh.name) {
                this.setState({
                  openKeys: [item.zh.name],
                })
              }
              this.setState({
                routeName: [item.zh.name],
              })
              throw new Error('defaultselected');
            } else {
              if (item.children) {
                item.children.forEach((cItem, cIndex) => {
                  if (cItem.route == location.pathname) {
                    if (this.state.openKeys[0] != item.zh.name) {
                      this.setState({
                        openKeys: [item.zh.name],
                      })
                    }
                    this.setState({
                      routeName: [cItem.zh.name],
                    })
                    return false;
                  }
                });
              }
            }
          })
        } catch (e) {
  
        }
      }
     
    })
  }
  onOpenChange = (openKeys) => {
    const lastOpenKey = openKeys[openKeys.length - 1]
    if (!store.get('collapsed')) {
      this.setState({
        openKeys
      })
      setTimeout(() => {
        this.setState({
          openKeys: [lastOpenKey]
        })
      }, 100)
    }
  }
  onSelect = (value)=>{
    this.setState({
      routeName:value.key,
      operate:'click'
    })
    setTimeout(()=>{
    this.setState({
      operate:''
    })
    },1000)
    if(value.key==='首页'){
      this.setState({
        openKeys:[]
      })
    }
  }

  changeRoute = (router) => {
    history.push('/loading')
    history.push(router)
  }
  generateMenus = (data) => {
    return data.map((item, index) => {
      if (item.name != 'index') {
        if (item.children) {
          return (
            <SubMenu
              key={item.name}
              title={
                <Fragment>
                  {item.icon && iconMap[item.icon]}
                  <span>{item.name}</span>
                </Fragment>
              }
            >
              {this.generateMenus(item.children)}
            </SubMenu>
          )
        }
        return (
          <Menu.Item onClick={() => this.changeRoute(item.route)} key={item.name}>
            <Link>
              {item.icon && iconMap[item.icon]}
              <span>{item.name}</span>
            </Link>
          </Menu.Item>
        )
      }
    })
  }

  render() {
    const { collapsed, theme, menus, location, isMobile, onCollapseChange, openKeys } = this.props
    const menuTree = menus
    const menuProps = collapsed ? {} : { openKeys: this.state.openKeys }
    const routeName = this.state.routeName;
    return (
      <div>
        <Menu
          mode="horizontal"
          theme='dark'
          onOpenChange={this.onOpenChange}
          openKeys={openKeys}
          onClick={isMobile ? () => { onCollapseChange(true) } : undefined}
          selectedKeys={routeName}
          onSelect = {this.onSelect}
          ref = {this.menuRef}
        >
          {this.generateMenus(menuTree)}
        </Menu>
      </div>
    )
  }
}

TopMenu.propTypes = {
  menus: PropTypes.array,
  theme: PropTypes.string,
  isMobile: PropTypes.bool,
  onCollapseChange: PropTypes.func,
}

export default TopMenu
