import React, { PureComponent } from 'react'
import { Link, getIntl, useIntl, FormattedMessage } from 'umi';
import PropTypes from 'prop-types'
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { Menu, Layout, Avatar, Dropdown, message } from 'antd'
import ProForm, { ModalForm, ProFormText } from '@ant-design/pro-form';
import store from 'store'
import { Trans, withI18n } from '@lingui/react'
import classnames from 'classnames'
import styHdr from './HeaderwithMenu.less'
import { post, postAsync } from '@/services/https'
import TopMenu from '@/components/Layout/TopMenu'

const trans = (msg) => {
  return getIntl().formatMessage(msg);
}

const handleUptPwd = async (fields) => {
  console.log('handleUptPwd=>', fields)
  try {
    let res = await postAsync('/cfg.php?controller=adminAcc&action=updatePasswd', fields);
    if (res.success)
      message.success(res.msg);
    else
      message.error(res.msg);
    return res.success;
  } catch (error) {
    message.error(trans({id:"adminacc.message.post.error"}));
    return false;
  }
};

const ModalPassMod = (props) => {
  return (
    <ModalForm width={460} layout="horizontal" labelCol={{ span: 6 }} wrapperCol={{ span: 15 }} 
      title={props.title} visible={props.status} onVisibleChange={props.onChange} 
      onFinish={props.onSubmit} modalProps={{destroyOnClose: true, maskClosable: false}}
    >
      <ProFormText.Password width="sm" name="oldpwd" label={<FormattedMessage id="adminacc.password.modify.oldpwd" />}
        rules={[{
          required: true,
          message: trans({id:"adminacc.required.field"})
        }]}
      />
      <ProFormText.Password width="sm" name="newpwd" label={<FormattedMessage id="adminacc.password.modify.newpwd" /> }
        rules={[{
          required: true,
          message: <FormattedMessage id="adminacc.required.field"/>
        }]}
      />
      <ProFormText.Password width="sm" name="cfmpwd" label={<FormattedMessage id="adminacc.password.modify.cfmpwd" />}
        rules={[{
          required: true,
          message: <FormattedMessage id="adminacc.required.field"/>
        },
        ({ getFieldValue }) => ({
          validator(_, value) {
            if (!value || getFieldValue('newpwd') === value) {
              return Promise.resolve()
            }
            return Promise.reject(new Error(trans({id:"adminacc.password.modify.nomatch"})));
          },
        })]}
      />
    </ModalForm>
  )
}

class Header extends PureComponent {

  state = {
    userName: store.get('luser'),
    userType: store.get('utype'),
    redirect: false,
    closable: false,
    routers: '', 
    logoFile:'',
    prodName:''
  }

  handleClickMenu = (e) => {
    if (e.key == 'passMod') {
      this.setState({ title: <FormattedMessage id='adminacc.password.modify.title' />, 
        redirect: true, closable: true })
    } else if (e.key === 'signOut') {
      this.props.onSignOut()
    }
  }

  //获取产品名称
  fetchName = ()=>{
    post('/login.php?action=config').then((res)=>{
    this.setState({ prodName:res.prod })
  })
}

  componentDidMount() {
      console.log(this.props,'props');
    post('/login.php?action=redirect', {}).then((res) => {
      if (res.success) {
        if (res.redirect == 1 || res.redirect == 2) {
          this.setState({ title: res.redirectMsg, redirect: true })
        } else {
          this.setState({ title: res.redirectMsg, redirect: false })
        }
      }

      this.setState({ routers: store.get('routerIndex') });
    })
    this.fetchLogo()
    this.fetchName()
  }
  fetchLogo = ()=>{
    post('/login.php?action=logo', {},{responseType: 'arraybuffer'}).then((res)=>{
      if(res.byteLength){
        const data = 'data:image/png;base64,' +
        btoa(new Uint8Array(res).reduce((data, byte) => data + String.fromCharCode(byte), ''))
        this.setState({ logoFile:data })
      }
    })
  }

  render() {
    const { userName, userType, redirect, title, closable, routers,logoFile,prodName} = this.state;
    const { fixed, collapsed,menus,isMobile } = this.props;
    const userTAvatar = userType == 'sys' ? '系' : (userType == 'sec' ? '安' : '审');

    const menuHeaderDropdown = (
      <Menu className={styHdr.menu} selectedKeys={[]} onClick={this.handleClickMenu}>
        <Menu.Item key="passMod" icon={<UserOutlined />}>
          <FormattedMessage id='adminacc.password.modify.title' />
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="signOut" icon={<LogoutOutlined />}>
          <FormattedMessage id='project.signout' />
        </Menu.Item>
      </Menu>
    );
    const siderProps = {
      menus,
      isMobile,
      collapsed,
    }

    return (
      <div>
        <Layout.Header className={classnames(styHdr.header,{[styHdr.fixed]:fixed,[styHdr.collapsed]:collapsed})} style={{background:'#001529'}}>
          <div className={styHdr.brand}>
            <div className={styHdr.logo} >
              <img alt="logo" src={logoFile||'/logo.png'} />
              <h1>{prodName}</h1>
            </div>
            <TopMenu {...siderProps}/>
          </div>
          <div className={styHdr.rightContainer}>
            <div className={styHdr.right}>
              <Dropdown overlay={menuHeaderDropdown}>
                <span className={`${styHdr.action} ${styHdr.account}`}>
                  <Avatar className={styHdr.avatar} style={{color:'#001529'}}>{userTAvatar}</Avatar>
                  <span className={`${styHdr.name} anticon`}>{userName}</span>
                </span>
              </Dropdown>
            </div>
          </div>

          
        </Layout.Header>
        <ModalPassMod title={title} status={redirect} 
            onChange={(visible) => {
              this.setState({redirect: visible})
            }}
            onSubmit={async (value) => {
              const success = await handleUptPwd(value);
              if (success) { this.props.onSignOut() }
            }}
          />
      </div>
    )
  }
}

Header.propTypes = {
  fixed: PropTypes.bool,
  user: PropTypes.object,
  menus: PropTypes.array,
  collapsed: PropTypes.bool,
  onSignOut: PropTypes.func,
}

export default Header
