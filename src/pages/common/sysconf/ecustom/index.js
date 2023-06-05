import React, { useRef, useState, useEffect } from 'react'
import {
  ProForm,
  ProCard,
  ProFormText,
  ProFormUploadButton,
  ProFormUploadDragger,
} from '@ant-design/pro-components'
import { formleftLayout } from '@/utils/helper'
import { Alert, Row, Col, Upload, Button, message, Space } from 'antd'
import { UploadOutlined, SaveOutlined } from '@ant-design/icons'
import logo from '@/assets/logo.png'
import bjtpTAC from '@/assets/bg-tac.png'
import bjtpNFD from '@/assets/bg-nfd.png'
import bjtpNBG from '@/assets/bg-nbg.png'
import { post } from '@/services/https'
import { msg } from '@/utils/fun'
import { language } from '@/utils/language'
import styles from './index.less'
import store from 'store'
import { fetchAuth } from '@/utils/common';
import { regList } from '../../../../utils/regExp'

export default function Ecustom() {
  const writable = fetchAuth()
  const formRef = useRef()
  const [logoFile, setLogoFile] = useState('')
  const [bgFile, setBgFile] = useState('')

  useEffect(() => {
    showEnCustom()
    fetchBg()
  }, [])

  //获取背景logo
  const fetchBg = ()=>{
    post('/login.php?action=background', {bjtp:SYSTEM},{responseType: 'arraybuffer'}).then((res)=>{
      const data = 'data:image/png;base64,' +
      btoa(new Uint8Array(res).reduce((data, byte) => data + String.fromCharCode(byte), ''))
      setBgFile(data)
    })
    post('/login.php?action=logo', {},{responseType: 'arraybuffer'}).then((res)=>{
      const data = 'data:image/png;base64,' +
      btoa(new Uint8Array(res).reduce((data, byte) => data + String.fromCharCode(byte), ''))
      setLogoFile(data)
    })
  }

  //产品基础信息回显
  const showEnCustom = () => {
    post('/cfg.php?controller=sysDeploy&action=showEnCustom').then((res) => {
      if (res.success) {
        const { product, company } = res
        formRef.current.setFieldsValue({ product: product, company: company })
      }
    })
  }

  const logoHandleUpload = (info) => {
    console.log(info.file,'event');
    if (info.file.status === 'done') {
      console.log(info.file.response,'response');
      const {success,msg} = info.file.response
      if(success){
        msg&&message.success(msg)
        fetchBg()
      }else{
        msg&&message.error(msg)
      }
    }
  }

  const bgHandleUpload = (info) => {
    if (info.file.status === 'done') {
      const {success,msg} = info.file.response
      if(success){
        msg&&message.success(msg)
        fetchBg()
      }else{
        msg&&message.error(msg)
      }
    }
  }
  const logoUpdateProps = {
    accept: '.png',
    action: '/cfg.php?controller=sysDeploy&action=imageUpload',
    name: 'file',
    data: { token:store.get('token'),type: 'logo'},
    listType: 'picture-card',
    beforeUpload: (file, fileList) => LogoBeforeUpload(file, fileList),
    style: {
      display: 'inline-block',
    },
    maxCount: 1,
    onChange: (info, fileList) => logoHandleUpload(info, fileList),
    showUploadList:false
  }

  const bgUpdateProps = {
    accept: '.png',
    action: '/cfg.php?controller=sysDeploy&action=imageUpload',
    name: 'file',
    data: { token:store.get('token'),type: 'bg',bjtp:SYSTEM },
    listType: 'picture-card',
    beforeUpload: (file, fileList) => bgBeforeUpload(file, fileList),
    style: {
      display: 'inline-block',
    },
    maxCount: 1,
    onChange: (info) => bgHandleUpload(info),
    showUploadList:false
  }

  const LogoBeforeUpload = (file, fileList) => {
    let name = file.name
    let suffix = name.substr(name.lastIndexOf("."))
    if (suffix != '.png') {
      message.error(language('sysconf.ecustom.uploaderror'))
      return false
    }
    return new Promise((resolve, reject) => {
      const islogo1M = file.size / 1024 / 1024 < 1
      let filereader = new FileReader()
      filereader.onload = (e) => {
        let src = e.target.result
        const image = new Image()
        image.onerror = reject
        image.src = src
        image.onload = function () {
          if (!islogo1M) {
            message.error(language('project.sysconf.ecustom.logosizefault'))
            return reject(false)
          } else if (image.width !== 72 || image.height !== 72) {
            message.error(language('project.sysconf.ecustom.whfault'))
            return reject(false)
          } else {
            return resolve(true)
          }
        }
      }
      filereader.readAsDataURL(file)
    })
  }

  const bgBeforeUpload = (file, fileList) => {
    let name = file.name
    let suffix = name.substr(name.lastIndexOf("."))
    if (suffix != '.png') {
      message.error(language('sysconf.ecustom.uploaderror'))
      return false
    }
    return new Promise((resolve, reject) => {
      const islogo5M = file.size / 1024 / 1024 < 5
      let filereader = new FileReader()
      filereader.onload = (e) => {
        let src = e.target.result
        const image = new Image()
        image.onerror = reject
        image.src = src
        image.onload = function () {
          if (!islogo5M) {
            message.error(language('project.sysconf.ecustom.bgsizefault'))
            return reject(false)
          } else if (image.width !== 1920 || image.height !== 1080) {
            message.error(language('project.sysconf.ecustom.whfault'))
            return reject(false)
          } else {
            return resolve(true)
          }
        }
      }
      filereader.readAsDataURL(file)
    })
  }

  //设置产品基础信息
  const saveConfig = (values) => {
    const data = { product: '', company: '' }
    const params = { ...data, ...values }
    console.log(params, 'params')
    post('/cfg.php?controller=sysDeploy&action=setEnCustom', params).then(
      (res) => {
        if (res.success) {
          msg(res)
        } else {
          msg(res)
        }
      }
    )
    console.log(values)
  }
  const showBJ = () => {
    switch (SYSTEM) {
      case 'nfd': return bjtpNFD;
      case 'tac': return bjtpTAC;
      case 'nbg': return bjtpNBG;
    }
    return bjtpTAC;
  }

  return (
    <>
      <ProCard
        direction="column"
        gutter={[13, 13]}
        style={{ paddingBottom: 0 }}
      >
        <div style={{ fontSize: '16px', color: '#101010' }}>
          {language('project.sysconf.ecustom.title')}
        </div>
        <ProForm
          formRef={formRef}
          {...formleftLayout}
          onFinish={saveConfig}
          submitter={{
            // 配置按钮的属性
            resetButtonProps: {
              style: {
                // 隐藏重置按钮
                display: 'none',
              },
            },
            submitButtonProps: {
              style: {
                // 隐藏提交按钮
                display: 'none',
              },
            },
          }}
        >
          <ProFormText
            width= { 300 }
            name="product"
            label={language('project.sysconf.ecustom.product')}
            rules={[
              {
                max: 64
              },
              {
                pattern: regList.strmax.regex,
                message: regList.strmax.alertText
              }
            ]}
          />
          <ProFormText
            width= { 300 }
            name="company"
            label={language('project.sysconf.ecustom.company')}
            rules={[
              {
                max: 64
              },
              {
                pattern: regList.strmax.regex,
                message: regList.strmax.alertText
              }
            ]}
          />
          <Col offset={6} style={{ marginBottom: 12 }}>
            <Button icon={<SaveOutlined />} type="primary" htmlType="submit" disabled={!writable}>
              {language('project.sysconf.ecustom.saveconfig')}
            </Button>
          </Col>
          <ProFormText
            label={language('project.sysconf.ecustom.logo')}
            wrapperCol={{
              xs: { span: 7 },
              sm: { span: 12 },
            }}
          >
            <Row>
              <Col>
                <Space
                  style={{ width: 113 }}
                  direction="horizontal"
                  wrap={true}
                >
                    <div className={styles.logo}>
                      <img
                        src={logoFile||'/logo.png'}
                        style={{ width:36 }}
                      />
                    </div>
                  <div className={styles.uploadButton}>
                    <Upload {...logoUpdateProps}>
                      <Button icon={<UploadOutlined />} type="primary" disabled={!writable}>
                        {language('project.sysconf.ecustom.changepic')}
                      </Button>
                    </Upload>
                  </div>
                </Space>
              </Col>
              <Col>
                <Alert
                  style={{ height: 112, width: 367 }}
                  message={language('project.sysconf.ecustom.helpmsg')}
                  description={language('project.sysconf.ecustom.logmsg')}
                  type="info"
                  showIcon
                />
              </Col>
            </Row>
          </ProFormText>
          <div style={{position:'relative'}}>
            <ProFormText
              label={language('project.sysconf.ecustom.bg')}
              wrapperCol={{
                xs: { span: 7 },
                sm: { span: 10 },
              }}
            >
              <Space style={{ width: 500 }} direction="horizontal" wrap={true}>
                  <div style={{ width: 480, height: 270 }}>
                    <img
                      src={bgFile}
                      style={{ width: '100%', height: '100%' }}
                    />
                  </div>
                <div className={styles.uploadBg}>
                  <Row>
                    <Col>
                      <Upload {...bgUpdateProps}>
                        <Button icon={<UploadOutlined />} type="primary" disabled={!writable}>
                          {language('project.sysconf.ecustom.changepic')}
                        </Button>
                      </Upload>
                    </Col>
                  </Row>
                </div>
              </Space>
              <div style={{position:'absolute' ,bottom:'8px',left:'113px'}}>
                <Alert
                  style={{ height: 32, width: 368 }}
                  message={language('project.sysconf.ecustom.bgmsg')}
                  type="info"
                  showIcon
                />
              </div>
            </ProFormText>
          </div>
        </ProForm>
      </ProCard>
    </>
  )
}
