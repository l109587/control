import React, { useState, useEffect } from 'react'
import ProCard from '@ant-design/pro-card'
import { Space, Form, Button, Divider, Input, Switch, message } from 'antd'
import { SaveOutlined } from '@ant-design/icons'
import { regIpList } from '@/utils/regExp'
import { language } from '@/utils/language'
import { post, get } from '@/services/https'
import { formleftLayout } from '@/utils/helper'
import styles from './index.less'
import { fetchAuth } from '@/utils/common';

export default function Remote() {
  const writable = fetchAuth()
  const [form] = Form.useForm()
  const [status, setStatus] = useState(false)
  useEffect(() => {
    fetchRemoteConf()
  }, [])
  const fetchRemoteConf = () => {
    post('/cfg.php?controller=mtaDebug&action=showRemoteConf')
      .then((res) => {
        if (res.success) {
          const state = res.data.status === 'Y' ? true : false
          setStatus(state)
          const port = res.data.port
          const permit = res.data.permit
          const initialValues = { port: port, permit: permit }
          form.setFieldsValue(initialValues)
        } else if (!res.success) {
          res.msg && message.error(res.msg)
        } else {
          return false
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }
  const saveConfig = () => {
    const datas = form.getFieldsValue(true)
    const state = status ? 'Y' : 'N'
    const data = { ...datas, status: state }
    post('/cfg.php?controller=mtaDebug&action=setRemoteConf', data)
      .then((res) => {
        if (res.success) {
          res.msg && message.success(res.msg)
        } else if (!res.success) {
          res.msg && message.error(res.msg)
        } else {
          return false
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }
  return (
    <ProCard title={language('project.sysdebug.remote.title')}>
      <div>
        <div>
          <Form form={form} {...formleftLayout} onFinish={saveConfig}>
            <Form.Item
              label={language('project.sysdebug.remote.manremote')}
              name="status"
              valuePropName="checked"
            >
              <Switch
                checked={status}
                onChange={(e) => {
                  console.log(e)
                  setStatus(e)
                }}
              />
              <span
                style={{
                  fontSize: '13px',
                  color: '#000',
                  height: '22.5px',
                  lineHeight: '22.5px',
                  display: 'inline-block',
                  marginLeft: '8px',
                }}
              >
                {language('project.sysdebug.remote.manremotetip')}
              </span>
            </Form.Item>
            <Form.Item
              label={language('project.sysdebug.remote.serveport')}
              name="port"
              rules={[
                {
                  required: true,
                  message: language('project.sysdebug.export.mustip'),
                },
                {
                  pattern: regIpList.singleport.regex,
                  message: regIpList.singleport.alertText,
                },
              ]}
            >
              <Input
                placeholder={language(
                  'project.sysdebug.remote.serveport.placeholder'
                )}
                style={{ width: '220px' }}
              />
            </Form.Item>
            <Form.Item
              label={language('project.sysdebug.remote.allowedip')}
              name="permit"
              style={{ marginBottom: 0 }}
              rules={[
                {
                  pattern: regIpList.ipv4s.regex,
                  message:regIpList.ipv4s.alertText
                },
                {
                  max: 1000
                }
              ]}
            >
              <Input.TextArea style={{ width: '350px', height: '120px' }} />
            </Form.Item>
            <Form.Item
              wrapperCol={{
                offset: 6,
                span: 16,
              }}
            >
              <Button type="primary" htmlType="submit" disabled={!writable} icon={<SaveOutlined />}>
                {language('project.sysdebug.remote.saveconfig')}
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </ProCard>
  )
}
