import React, { useRef, useState, useEffect } from 'react'
import {
  ProCard,
  ProForm,
  ProFormCheckbox,
  ProFormText,
  ProFormSelect,
  ProFormTextArea,
} from '@ant-design/pro-components'
import { fetchAuth } from '@/utils/common';
import { SaveOutlined } from '@ant-design/icons'
import { formleftLayout, violationitem } from '@/utils/helper'
import { language } from '@/utils/language'
import { Button, Col, Spin } from 'antd'
import { post, get } from '@/services/https'
import { regIpList } from '@/utils/regExp'
import { msg } from '@/utils/fun'
import { regList } from '../../../../../../utils/regExp';

export default function SwtichScan() {
  const writable = fetchAuth()
  const [snmpModelList, setSnmpModelList] = useState([]) //存储SNMP模板
  const [loading, setLoading] = useState(false)

  const formRef = useRef()

  useEffect(() => {
    getSnmpDiscovery()
  }, [])

  const getSnmpModelList = () => {
    post('/cfg.php?controller=assetMapping&action=getSnmpModelList')
      .then((res) => {
        const arr = []
        res.data.map((e) => arr.push({ lable: e.name, value: e.value }))
        // arr.unshift({ label: '不使用', value: '' })
        setSnmpModelList(arr)
      })
      .catch(() => {
        console.log('mistake')
      })
  }

  const getSnmpDiscovery = () => {
    setLoading(true)
    post('/cfg.php?controller=assetMapping&action=showSwitchDiscovery')
      .then((res) => {
        const datas = res.data[0]
        if (datas.switchScan == 'Y') {
          datas.switchScan = true
        } else {
          datas.switchScan = false
        }
        formRef.current.setFieldsValue({ ...datas })
        setLoading(false)
      })
      .catch(() => {
        console.log('mistake')
      })
  }

  // select下拉回调
  const onDropdownVisibleChange = () => {
    getSnmpModelList()
  }

  const Save = (values) => {
    if (values.switchScan == 'Y' || values.switchScan == true) {
      values.switchScan = 'Y'
    } else {
      values.switchScan = 'N'
    }
    post('/cfg.php?controller=assetMapping&action=setSwitchDiscovery', values)
      .then((res) => {
        msg(res)
        getSnmpDiscovery()
      })
      .catch(() => {
        console.log('mistake')
      })
  }

  const validatorFn = (value, callback) => {
    if (value) {
        let reg = regList.strmax.regex;
        let values = value.split(';');
        let isCheck = []
        values.map((item, index) => {
            isCheck.push(reg.test(item))  
        })
        if (isCheck.indexOf(false) != -1) {
            callback(regList.strmax.alertText + '，' + language('monitor.devtmpl.swtrapPwd.tooltip'))
        } else {
            callback()
        }
    } else {
        callback()
    }
}

  return (
    <ProCard style={{ padding: '24px' }}>
      <Spin spinning={loading}>
        <ProForm
          formRef={formRef}
          {...formleftLayout}
          submitter={{
            render: (props, doms) => {
              return [
                <Col offset={6}>
                  <Button
                    type="primary"
                    key="submit"
                    disabled={!writable}
                    style={{
                      paddingLeft: 0,
                      paddingRight: 0,
                      borderRadius: 5,
                      width: '90px',
                      lineHeight: 1.6,
                    }}
                    onClick={() => props.form?.submit?.()}
                  >
                    <SaveOutlined />
                    {language('project.set')}
                  </Button>
                </Col>,
              ]
            },
          }}
          onFinish={async (values) => {
            Save(values)
          }}
        >
          <ProFormCheckbox label={language('monitor.devtmpl.isswitchScan')} name="switchScan" />
          {/* <ProFormCheckbox
          label="自动添加交换机:"
          name="auto_add_switch"
        ></ProFormCheckbox> */}
          <ProFormText
            label={language('monitor.devtmpl.ipAddr')}
            name="ipAddr"
            width={250}
            rules={[
              {
                message: regIpList.ipv4oripv6.alertText,
                pattern: regIpList.ipv4oripv6.regex,
              },
            ]}
          />
          <ProFormSelect
            width={250}
            label={language('monitor.devtmpl.DiscoverConfig')}
            name="snmpNameValue"
            placeholder={language('project.select')}
            options={snmpModelList}
            fieldProps={{
              onDropdownVisibleChange: () => onDropdownVisibleChange(),
            }}
          />
          <ProFormTextArea
            width={250}
            colProps={{ span: 16 }}
            name="swIprange"
            label={language('monitor.devtmpl.swIprange')}
            tooltip={regIpList.ipv4oripv6Mask.alertText}
            rules={[
              {
                message: regIpList.ipv4oripv6Mask.alertText,
                pattern: regIpList.ipv4oripv6Mask.regex,
              },
            ]}
          />
          <ProFormTextArea
            colProps={{ span: 16 }}
            width={250}
            name="termIprange"
            label={language('monitor.devtmpl.termIprange')}
            tooltip={regIpList.ipv4oripv6Mask.alertText}
            rules={[
              {
                message: regIpList.ipv4oripv6Mask.alertText,
                pattern: regIpList.ipv4oripv6Mask.regex,
              },
            ]}
          />
          <ProFormText
            label={language('monitor.devtmpl.swtrapPwd')}
            width={250}
            name="swtrapPwd"
            tooltip={language('monitor.devtmpl.swtrapPwd.tooltip')}
            rules={[
              {
                validator: (rule, value, callback) => {
                  validatorFn(value, callback)
                }
              }
            ]}
          />
          <ProFormSelect
            label={language('monitor.devtmpl.hubMacNum')}
            width={150}
            name="hubMacNum"
            placeholder={language('project.select')}
            addonAfter={<div style={{ width: '60px' }}>{language('monitor.devtmpl.hubMacNum.hub')}</div>}
            options={[
              { label: 1, value: 1 },
              { label: 2, value: 2 },
              { label: 3, value: 3 },
            ]}
          />
        </ProForm>
      </Spin>
    </ProCard>
  )
}
