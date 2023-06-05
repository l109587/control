import React, { useRef } from 'react'
import {
  LockOutlined,
  UserOutlined,
  KeyOutlined,
  ExclamationCircleFilled,
} from '@ant-design/icons'
import {
  LoginForm,
  ProFormText,
  ProFormFieldSet,
  ProFormSelect,
} from '@ant-design/pro-components'
import { Form, Input, message, Space, Spin, Button } from 'antd'
import { useState, useEffect } from 'react'
import { FormattedMessage, history, useDispatch, useSelector } from 'umi'
import { pathToRegexp } from 'path-to-regexp'
import { get, getAsync, post, postAsync } from '@/services/https'
import config from 'utils/config'
import store from 'store'
import md5 from 'js-md5'
import sty from './index.less'
import { token, _Base64encode } from './lmukeyindex'
import { language } from '@/utils/language'

import bjtpTAC from '@/assets/bg-tac.png'
import bjtpNBG from '@/assets/bg-nbg.png'
import bjtpNBA from '@/assets/bg-nba.png'
import bjtpNTA from '@/assets/bg-nta.png'
import bjtpDMC from '@/assets/bg-dmc.png'
import bjtpNMD from '@/assets/bg-nmd.png'
import bjtpNFD from '@/assets/bg-nfd.png'
import bjtpNBGT from '@/assets/bg-nbg-top.png'

const { NODE_ENV } = process.env

const goDashboard = (menu) => {
  let route = menu.route ? menu.route : menu.children[0].route
  let name = menu.children ? menu.children[0].zh.name : menu.zh.name
  let priMenuName = menu.zh.name
  store.set('routeIndex', route)
  store.set('routeName', name)
  store.set('priMenuName', priMenuName)
  if (pathToRegexp(['/', '/login']).exec(window.location.pathname)) {
    history.push({
      pathname: route,
    })
  }
}

export default () => {
  const [captchaShow, setCaptchaShow] = useState(false)
  const [captchaFile, setCaptchaFile] = useState('')
  const [prodInfo, setProdInfo] = useState({ name: '', vers: '', bjtp: '' })
  const [bgFile, setBgFile] = useState('')
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('') //错误信息
  const [islogin, setIslogin] = useState(false) //身份验证是否成功
  const [enable, setEnable] = useState(false) //是否开启双因认证
  const [devNameOpts, setDevNameOpts] = useState([]) //Ukey列表
  const [certListOpts, setCertListOpts] = useState([]) //证书列表
  const [randnum, setRandnum] = useState('') //数字证书名称
  const [bgType, setBgType] = useState('') //背景类型
  const dispatch = useDispatch()
  const loginRef = useRef()
  const tokenRef = useRef()
  let timer1

  useEffect(() => {
    getInitInfo()
  }, [])

  const getInitInfo = async () => {
    let res

    res = await getAsync('/login.php?action=token')
    if (res && res.success) store.set('token', res.token)

    res = await postAsync('/login.php?action=config')
    if (res && res.success) {
      if (res.loginfail) {
        setCaptchaShow(true)
        captchaRequest()
      }
      store.set('siteName', res.site)
      dispatch({
        type: 'app/getSiteName',
        payload: {
          siteName: res.site,
        },
      })
      const layoutype = res.bjtp.includes('top') ? 'top' : 'sider'
      store.set('layout',layoutype)
      dispatch({
        type: 'app/changeLayout',
        payload: {
          layout : layoutype
        },
      })
      setProdInfo({ name: res.prod, vers: res.vers, bjtp: res.bjtp })
      setBgType(res.bjtp)

      postAsync(
        '/login.php?action=background',
        { bjtp: res.bjtp },
        { responseType: 'arraybuffer' }
      ).then((res) => {
        if (res.byteLength) {
          const data =
            'data:image/png;base64,' +
            btoa(
              new Uint8Array(res).reduce(
                (data, byte) => data + String.fromCharCode(byte),
                ''
              )
            )
          setBgFile(data)
          setLoading(false)
        }
      })
      setTimeout(() => {
        setLoading(false)
      }, 600)
    }
  }

  const fetToken = async () => {
    const res = await getAsync('/login.php?action=token')
    if (res && res.success) store.set('token', res.token)
  }

  const onSubmit = (values) => {
    values.password = md5(values.password)
    if (values.captcha) {
      values.captcha = values.captcha[0]
    }
    let res
    setErrorMsg('')

    post('/login.php?action=login', values).then((res) => {
      if (res.success) {
        store.set('token', res.token)
        store.set('utype', res.userType)
        store.set('luser', values.username)
        config.logout = false
        if (res?.enable === 'Y') {
          setRandnum(res.random)
          setErrorMsg('口令认证成功，请进行UKEY认证')
          setEnable(true)
          timer1 = window.setTimeout(getUserList, 2000)
        } else {
          fetchTimeout()
          store.set('login', true)
          message.success(language('project.login.success'))
          fetchMenuList()
        }
      } else if (res.msg == '请刷新页面后重新登录') {
        const values = loginRef.current.getFieldsValue(true)
        fetToken()
        setTimeout(() => {
          onSubmit(values)
        }, 500)
      } else {
        setCaptchaShow(true)
        captchaRequest()
        setErrorMsg(res.msg)
      }
    })
  }
  //超时配置
  const fetchTimeout = async () => {
    const res = await postAsync(
      '/cfg.php?controller=adminSet&action=showAdminConf'
    )
    if (res.success) {
      store.set('timeout', res.login_control.timeout)
    } else {
      store.set('timeout', 10)
    }
  }

  //获取菜单权限
  const fetchMenuList = async () => {
    const menuParams = NODE_ENV === 'development' ? { env: SYSTEM ?? '' } : {}
    const res = await postAsync(
      '/cfg.php?controller=menu&action=menuTree',
      menuParams
    )
    if (res.success) {
      res.data.map((item, index) => {
        item.key = 'sub1' + index
        if (item.children)
          item.children.map((child, index) => (child.key = item.key + index))
      })
      store.set('Permission', res.data)
      goDashboard(res.data[0])
    } else {
      setErrorMsg(res.msg)
      return false
    }
  }

  const captchaRequest = () => {
    post('/login.php?action=captcha', {}, { responseType: 'arraybuffer' }).then(
      (res) => {
        const data =
          'data:image/png;base64,' +
          btoa(
            new Uint8Array(res).reduce(
              (data, byte) => data + String.fromCharCode(byte),
              ''
            )
          )
        setCaptchaFile(data)
      }
    )
  }

  const showBJ = () => {
    if (process.env.NODE_ENV === 'production') {
      return bgFile
    } else {
      switch (bgType) {
        case 'tac':
          return bjtpTAC
        case 'nbg':
          return bjtpNBG
        case 'nba':
          return bjtpNBA
        case 'nta':
          return bjtpNTA
        case 'dmc':
          return bjtpDMC
        case 'nmd':
          return bjtpNMD
        case 'nfd':
          return bjtpNFD
        case 'nbg-top':
          return bjtpNBGT
      }
      return bjtpTAC
    }
  }

  //证书key验证 start

  //获取证书列表  TODO
  function getUserList() {
    let ret = 0
    let slectType = 'GM3000'
    if (slectType == 'GM3000PCSC') ret = token.SOF_LoadLibrary(token.GM3000PCSC)
    else if (slectType == 'GM3000') ret = token.SOF_LoadLibrary(token.GM3000)
    else if (slectType == 'K7') ret = token.SOF_LoadLibrary(token.K7)
    else if (slectType == 'TF') ret = token.SOF_LoadLibrary(token.TF)
    else ret = token.SOF_LoadLibrary(token.K5)
    if (ret != 0) {
      setErrorMsg('加载控件失败,请安装证书环境后重试')
      return false
    }
    const deviceName = token.SOF_EnumDevice()

    if (deviceName == null) {
      setErrorMsg('未找到任何Key，请更换UKey认证')
      return false
    }
    let devArray = []
    deviceName.map((item) => {
      devArray.push({ label: item, value: item })
    })
    setDevNameOpts(devArray)
    tokenRef.current.setFieldsValue({ devname: deviceName[0] || '' })

    let rest = token.SOF_GetDeviceInstance(deviceName[0], '')
    if (rest != 0) {
      setErrorMsg(
        `绑定应用失败，确定是否初始化Key,错误码:${token.SOF_GetLastError()}`
      )
      return false
    }

    const cerList = token.SOF_GetUserList()
    let certlist = []
    cerList.map((item) => {
      certlist.push({ label: item[0], value: item[1] })
    })
    setCertListOpts(certlist)
    tokenRef.current.setFieldsValue({ name: cerList[0][1] || '' })
    window.clearInterval(timer1)
  }
  const UekyLogin = () => {
    const status = token.SOF_LoadLibrary(token.GM3000)
    if (status != 0) {
      setErrorMsg('加载控件失败,请安装证书环境后重试')
      return false
    }
    const values = tokenRef.current.getFieldsValue(['devname', 'pass', 'name'])

    const certname = values.devname
    const pass = values.pass
    const container = values.name
    let containerName = ''
    certListOpts.map((item) => {
      if (item.value === container) {
        containerName = item.label
      }
    })

    //导出 签名证书
    const cert = token.SOF_ExportUserCert(container, 1)
    if (cert == null || cert == '' || cert == '-3') {
      setErrorMsg('导出证书失败，请重试')
      return false
    }

    let ret = 0
    let strRes = ''
    //获取UKey的类型，并按UKey类型来提示验证身份
    const hwType = token.SOF_GetHardwareType()
    if (hwType == token.TYPE_FPKEY) {
      //验证用户指纹
      //请在这里，替换更友善的用户提示...
      //开始“用户验证指纹”的提示
      setErrorMsg('当指纹KEY上的指示灯开始闪烁时，请按压手指以验证指纹......')

      ret = token.SOF_VerifyFingerprint()

      //结束“用户验证指纹”的提示

      if (ret == 0) {
        strRes = '验证用户指纹成功。'
      } else {
        strRes = '验证用户指纹失败。'
      }
    } else {
      //验证用户密码
      ret = token.SOF_Login(pass)
      if (ret == 0) {
        strRes = '验证用户密码成功。'
      } else {
        strRes = '验证用户密码失败。'
      }
    }

    if (ret != 0) {
      const lastErr = token.SOF_GetLastError()
      const retryCount = token.SOF_GetPinRetryCount()
      setErrorMsg(`${strRes}错误码:${lastErr}。剩余次数：${retryCount}`)
      return
    } else {
      // 随机数签名，SGD_SM3 ,签名证书
      let resp = token.SOF_SetDigestMethod(1) // 设置加密方法  SGD_SM3
      resp = token.SOF_SetUserID('1234567812345678')
      const signed = token.SOF_SignData(
        container,
        1,
        _Base64encode(randnum),
        randnum.length
      )
      const params = {
        certname: containerName,
        certdata: cert,
        signdata: signed,
        certsn: certname,
      }
      post('login.php?action=login2FA', params)
        .then((res) => {
          if (res.success) {
            fetchTimeout()
            store.set('login', true)
            fetchMenuList()
            res.msg && message.success(res.msg)
          } else {
            res.msg && setErrorMsg(res.msg)
          }
        })
        .catch(() => {
          setErrorMsg('认证失败，请重试')
        })
    }
  }

  //改变设备名
  const changeDevName = (value) => {
    let res = token.SOF_GetDeviceInstance(value, '')
    if (res != 0) {
      setErrorMsg(
        `绑定应用失败，确定是否初始化Key,错误码:${token.SOF_GetLastError()}`
      )
      return false
    }

    const cerList = token.SOF_GetUserList()
    let certlist = []
    cerList.map((item) => {
      certlist.push({ label: item[0], value: item[1] })
    })
    setCertListOpts(certlist)
    tokenRef.current.setFieldsValue({ name: cerList[0][1] || '' })
  }

  return (
    <>
      <div className={sty.spin}>
        <Spin spinning={loading} size="large" delay={1200}>
          {!loading && (
            <div>
              <img
                alt="logo"
                src={showBJ()}
                style={{ width: '100%', height: '100vh' }}
              />
              <div className={sty.formRight}>
                <div className={sty.logo}>
                  <span>{prodInfo.name}</span>
                </div>
                {!enable ? (
                  <LoginForm
                    className={sty.loginForm}
                    logo=""
                    title=""
                    subTitle=""
                    onFinish={onSubmit}
                    formRef={loginRef}
                    submitter={{
                      render: () => {
                        return (
                          <Button
                            type="primary"
                            size="large"
                            onClick={() => {
                              loginRef.current.submit()
                            }}
                          >
                            {language('project.login.btnlogin')}
                          </Button>
                        )
                      },
                    }}
                  >
                    {errorMsg && (
                      <div className={sty.errortip}>
                        <ExclamationCircleFilled
                          style={{
                            color: '#e6a23c',
                            fontSize: 18,
                            marginRight: 10,
                          }}
                        />
                        <span>{errorMsg}</span>
                      </div>
                    )}

                    <ProFormText
                      name="username"
                      placeholder={language('project.login.placeusername')}
                      fieldProps={{ size: 'large', prefix: <UserOutlined /> }}
                      rules={[
                        {
                          required: true,
                          message: language('project.login.entername'),
                        },
                      ]}
                    />
                    <ProFormText.Password
                      name="password"
                      placeholder={language('project.login.placepawdin')}
                      fieldProps={{ size: 'large', prefix: <LockOutlined /> }}
                      rules={[
                        {
                          required: true,
                          message: language('project.login.enterpawd'),
                        },
                      ]}
                    />
                    {captchaShow ? (
                      <ProFormFieldSet name="captcha">
                        <ProFormText
                          width="sm"
                          name="captcha"
                          placeholder={language('project.login.placecode')}
                          fieldProps={{
                            size: 'large',
                            prefix: <KeyOutlined />,
                          }}
                          rules={[
                            {
                              required: true,
                              message: language('project.login.entercode'),
                            },
                          ]}
                        />
                        <img
                          src={captchaFile}
                          style={{
                            height: '37px',
                            width: '103px',
                            marginTop: '1px',
                          }}
                          onClick={() => {
                            captchaRequest()
                          }}
                        />
                      </ProFormFieldSet>
                    ) : (
                      ''
                    )}
                  </LoginForm>
                ) : (
                  <LoginForm
                    className={sty.loginForm}
                    logo=""
                    title=""
                    subTitle=""
                    formRef={tokenRef}
                    onFinish={UekyLogin}
                    submitter={{
                      render: () => {
                        return (
                          <Button
                            type="primary"
                            size="large"
                            onClick={() => {
                              
                              tokenRef.current.submit()
                            }}
                          >
                            {language('project.login.ukeylogin')}
                          </Button>
                        )
                      },
                    }}
                  >
                    {errorMsg && (
                      <div className={sty.errortip}>
                        <ExclamationCircleFilled
                          style={{
                            color:
                              errorMsg == '口令认证成功，请进行UKEY认证'
                                ? '#289fff'
                                : '#e6a23c',
                            fontSize: 18,
                            marginRight: 10,
                          }}
                        />
                        <span>{errorMsg}</span>
                      </div>
                    )}
                    <ProFormSelect
                      name="devname"
                      options={devNameOpts}
                      fieldProps={{
                        size: 'large',
                        prefix: null,
                        allowClear: false,
                        onChange: (value) => {
                          changeDevName(value)
                        },
                      }}
                      rules={[
                        {
                          required: true,
                          message: language('project.mandatory'),
                        },
                      ]}
                    />
                    <ProFormSelect
                      name="name"
                      options={certListOpts}
                      fieldProps={{
                        size: 'large',
                        prefix: null,
                        allowClear: false,
                      }}
                      rules={[
                        {
                          required: true,
                          message: language('project.mandatory'),
                        },
                      ]}
                    />
                    <ProFormText.Password
                      name="pass"
                      placeholder={language('project.login.ukeypass')}
                      fieldProps={{ size: 'large', prefix: <LockOutlined /> }}
                      rules={[
                        {
                          required: true,
                          message: language('project.login.ukeypass'),
                        },
                      ]}
                    />
                  </LoginForm>
                )}

                {config.logout ? (
                  <div>
                    <p
                      style={{
                        margin: '10px auto',
                        display: 'block',
                        color: '#ec5451',
                        fontSize: '14px',
                      }}
                    >
                      由于您在 {store.get('timeout')} 分钟内没有任何操作
                    </p>
                    <p
                      style={{
                        margin: '10px auto',
                        display: 'block',
                        color: '#ec5451',
                        fontSize: '14px',
                      }}
                    >
                      系统已经在 {store.get('outtime')} 自动退出
                    </p>
                  </div>
                ) : (
                  ''
                )}
              </div>
              <div
                style={{
                  color: '#fff',
                  position: 'absolute',
                  left: '49%',
                  bottom: '20px',
                  marginLeft: '-110px',
                }}
              >
                {prodInfo.vers}
              </div>
            </div>
          )}
        </Spin>
      </div>
    </>
  )
}
