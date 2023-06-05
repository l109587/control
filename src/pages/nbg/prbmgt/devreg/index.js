import React, { useRef, useState, useEffect } from 'react'
import { language } from '@/utils/language'
import {
  ProCard,
  ProForm,
  ProFormItem,
  ProFormText,
} from '@ant-design/pro-components'
import {
  Button,
  Row,
  Col,
  Spin,
  Space,
  Tag,
  message,
} from 'antd'
import { formleftLayout } from '@/utils/helper'
import { post, get } from '@/services/https'
import { BiRegistered } from 'react-icons/bi'
import './devreg.less'
import { fetchAuth } from '@/utils/common';
import { regIpList, regList } from '../../../../utils/regExp'

export default () => {
  const writable = fetchAuth()
  const formRef = useRef()
  const [loading, setLoading] = useState(true)
  const [formValue, setFormValue] = useState({})
  const [confloading, setConfloading] = useState(false)

  useEffect(() => {
    setLoading(true)
    getConfig()
  }, [])

  const getConfig = () => {
    post('/cfg.php?controller=probeManage&action=showRegisterCfg').then(
      (res) => {
        if (!res.success) {
          message.error(res.msg)
          setLoading(false)
          return false
        }
        setLoading(false)
        setFormValue(res)
        formRef.current.setFieldsValue(res)
      }
    )
  }

  const setConfig = () => {
    setConfloading(true)
    let data = formRef.current.getFieldsValue(['serial','name', 'registerAddr', 'desc', 'registerStatus', 'connectStatus'])
    post('/cfg.php?controller=probeManage&action=setRegisterCfg', data).then((res) => {
      if (res.success) {
        syncRegister()
      } else if (!res.success) {
        syncRegister()
        message.error(res.msg)
      } else {
        return false
      }
    })
  }

  let registerTimer = ''
  const syncRegister = () => {
    post('/cfg.php?controller=probeManage&action=syncRegister').then((res) => {
      if (res.state === 'loading') {
        registerTimer = setTimeout(() => {
          syncRegister()
        }, 2000)
      } else if (res.state === 'success') {
        message.success(res.msg)
        setConfloading(false)
        clearTimeout(registerTimer)
        getConfig()
      } else {
        message.error(res.msg)
        clearTimeout(registerTimer)
        setConfloading(false)
        getConfig()
        return false
      }
    })
  }

  return (
    <Spin spinning={loading}>
      <ProCard className="devregCard" title={language('project.sysconf.syscert.regTitle')}>
        <ProForm
          {...formleftLayout}
          formRef={formRef}
          autoFocusFirstInput
          submitTimeout={2000}
          submitter={{
            render: (props, doms) => {
              return [
                <Row>
                  <Col offset={6}>
                    <Button className='regiButton'
                      type="primary"
                      loading={confloading}
                      onClick={() => [
                        props.submit()
                      ]}
                      disabled={!writable}
                      icon={<BiRegistered style={{ 
                        fontSize: 16, 
                        marginRight: 5
                       }} />}
                    >
                      <p style={{ marginTop: 14 }}>{language('project.sysconf.syscert.devReg')}</p>
                    </Button>
                  </Col>
                </Row>,
              ]
            },
          }} onFinish={() => {
            setConfig()
          }}
        >
          <ProFormItem label={language('project.sysconf.syscert.deviceID')} name="serial">
            {formValue?.serial}
          </ProFormItem>
          <ProFormText label={language('project.mconfig.equipmentname')} name="name" rules={[
            {
              pattern: regList.strmax.regex,
              message: regList.strmax.alertText,
            }
          ]} />
          <ProFormText label={language('project.sysconf.syscert.regAddr')} name="registerAddr" rules={[
            {
              pattern: regIpList.ipv4.regex,
              message: regIpList.ipv4.alertText
            }
          ]} />
          <ProFormText label={language('project.remark')} name="desc" rules={[
            {
              pattern: regList.notesLenght.regex,
              message: regList.notesLenght.alertText,
            }
          ]} />
          <ProFormText label={language('project.sysconf.syscert.regStatus')} name="registerStatus">
            <Space>
              <Tag color={formValue?.registerStatus == 0 ? 'default' : formValue?.registerStatus == 1 ? 'success' : 'error'}>
                {formValue?.registerStatus == 0 ? language('project.sysconf.syscert.unregistered') : formValue?.registerStatus == 1 ? language('project.sysconf.syscert.registered') : language('prbmgt.devreg.regerror')}
              </Tag>
              {formValue?.registerStatus == 2 ? <div className='errorDiv'>{formValue?.error}</div> : <></>}
            </Space>
          </ProFormText>
          <ProFormText label={language('prbmgt.devreg.connectStatus')} name="connectStatus">
            <Tag color={formValue?.connectStatus == 0 ? 'error' : 'success'}>
              {formValue?.connectStatus == 0 ? language('prbmgt.devreg.connectStatus.error') : language('prbmgt.devreg.connectStatus.success')}
            </Tag>
          </ProFormText>
        </ProForm>
      </ProCard>
    </Spin>
  )
}
