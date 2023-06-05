import React, { useRef, useState, useEffect } from 'react'
import { formleftLayout, violationitem } from '@/utils/helper'
import ProForm, { ProFormText } from '@ant-design/pro-form'
import { SaveOutlined } from '@ant-design/icons'
import { Button, Row, Col, Radio, message, Spin } from 'antd'
import { post, postAsync } from '@/services/https'
import { ProCard } from '@ant-design/pro-components'
import { language } from '@/utils/language'
import { fetchAuth } from '@/utils/common'
import { regIpList } from '@/utils/regExp'

export default () => {
  const writable = fetchAuth()
  const dnsformRef = useRef()
  const [loading, setLoading] = useState(false)
  const [dnssub, setDnssub] = useState('')
  useEffect(() => {
    setLoading(true)
    getDnsdata()
  }, [])

  const getDnsdata = () => {
    post('/cfg.php?controller=netSetting&action=showDNS')
      .then((res) => {
        if (!res.success) {
          message.error(res.msg)
          return false
        }
        dnsformRef.current.setFieldsValue(res.data)
        setLoading(false)
      })
      .catch(() => {
        console.log('mistake')
      })
  }

  const setDns = () => {
    let obj = dnsformRef.current.getFieldsValue(['dns1', 'dns2'])
    let data = {}
    data.dns1 = obj.dns1
    data.dns2 = obj.dns2
    post('/cfg.php?controller=netSetting&action=setDNS', data).then((res) => {
      if (!res.success) {
        message.error(res.msg)
        return false
      }
      message.success(res.msg)
    })
  }

  return (
    <Spin spinning={loading}>
      <ProCard>
        <ProForm
          {...formleftLayout}
          formRef={dnsformRef}
          submitter={{
            render: () => {
              return [
                <Row>
                  <Col span={14} offset={6}>
                    <Button
                      type="primary"
                      key="subment"
                      disabled={!writable}
                      style={{ marginTop: '5px', borderRadius: 5 }}
                      onClick={() => {
                        setDnssub('finish')
                        dnsformRef.current.submit()
                      }}
                    >
                      <SaveOutlined />
                      {language('project.savesettings')}
                    </Button>
                  </Col>
                </Row>,
              ]
            },
          }}
          autoFocusFirstInput
          submitTimeout={2000}
          onFinish={async (values) => {
            if (dnssub == 'finish') {
              setDns(values)
            }
          }}
        >
          <ProFormText
            name="dns1"
            width="240px"
            label={language('sysconf.netconf.dns1')}
            rules={[
              { 
                required: true, 
                message: language('project.mandatory') 
              },
              {
                pattern: regIpList.ipv4.regex,
                message: regIpList.ipv4.alertText,
              }
            ]}
          />
          <ProFormText
            name="dns2"
            width="240px"
            label={language('sysconf.netconf.dns2')}
            rules={[
              {
                pattern: regIpList.ipv4.regex,
                message: regIpList.ipv4.alertText,
              }
            ]}
          />
        </ProForm>
      </ProCard>
    </Spin>
  )
}
