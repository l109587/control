import React, { useRef, useState, useEffect } from 'react';
import { formItemLayout, procardgutter } from '@/utils/helper'
import ProCard from '@ant-design/pro-card'
import { SaveOutlined } from '@ant-design/icons';
import ProForm, { ProFormUploadButton, ProFormDateTimePicker } from '@ant-design/pro-form';
import {
  Card,
  Form,
  Input,
  Button,
  message,
  DatePicker,
  Checkbox,
  Tooltip,
  Row,
  Col,
} from 'antd'
import { post, get } from '@/services/https'
import moment from 'moment'
import styles from './index.less'
import '@/utils/index.less'
import { InfoCircleOutlined } from '@ant-design/icons'
import { regIpList } from '@/utils/regExp'
import { language } from '@/utils/language';
import { fetchAuth } from '@/utils/common';


const System = () => {
  const writable = fetchAuth()
  const formRef = useRef();
  const nptformRef = useRef();
  const [sysTime, setSysTime] = useState();
  const getData = () => {
    post('/cfg.php?controller=sysSetting&action=getSystime').then((res) => {
      let initialValues = {
        date: moment(res.date)
      }
      formRef.current.setFieldsValue(initialValues)
    })
    post('/cfg.php?controller=sysSetting&action=getNTP').then((res) => {
      if(res.success) {
        let initialValues = res
        initialValues.ntp_status = Boolean(initialValues.ntp_status)
        nptformRef.current.setFieldsValue(initialValues)
      }
    })
  }

  useEffect(() => {
    getData();
  }, []);

  const setTimeout = () => {
    let obj = formRef.current.getFieldsValue(['date']);
    let data = {};
    if(sysTime) {
      data.date = sysTime;
    } else {
      data.date = obj.date._i;
    }
    post('/cfg.php?controller=sysSetting&action=setSystime', data).then((res) => {
      if(!res.success) {
        message.error(res.msg);
        return false;
      }
      message.success(res.msg);
    }).catch(() => {
      console.log('mistake')
    })
  }
  const ntpSave = () => {
    let data = nptformRef.current.getFieldsValue(['ntp_server', 'ntp_status']);
    if(data.ntp_server == '') {
      message.error(language('sysconf.systime.NTPeromsg'))
      return
    }
    data.ntp_status = data.ntp_status ? 1 : 0
    post('/cfg.php?controller=sysSetting&action=setNTP', data).then((res) => {
      if(res.success) {
        message.success(res.msg)
        getData()
      } else {
        message.error(res.msg)
      }
    })
  }

  return (
    <ProCard ghost {...procardgutter}>
      <ProCard title={language('sysconf.systime.setsys')} >
        <ProForm {...formItemLayout} formRef={formRef} submitter={false}>
          <Form.Item label={language('sysconf.systime.sysdate')} name="date"><ProFormDateTimePicker onChange={(key, val) => {
            setSysTime(val)
          }} /></Form.Item>
          <Row>
            <Col offset={6}>
              <Form.Item>
                <Button type='primary' key='button'
                  style={{ borderRadius: 5 }}
                  onClick={() => {
                    setTimeout();
                  }}
                  disabled={!writable}
                  icon={<SaveOutlined />}>
                  {language('project.savesettings')}
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </ProForm>
      </ProCard>
      <ProCard title="NTP">
        <ProForm {...formItemLayout} formRef={nptformRef} submitter={false}>
          <Form.Item
            label={language('sysconf.systime.sysntpser')}
            name="ntp_server"
            rules={[
              {
                required: true,
              },
              {
                pattern: regIpList.ipOrHttp.regex,
                message: regIpList.ipOrHttp.alertText,
              },
            ]}
          >
            <Input
              className="Ip_40"
              suffix={
                <Tooltip title={language('sysconf.systime.ntpsertip')}>
                  <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                </Tooltip>
              }
            />
          </Form.Item>
          <Form.Item
            label={language('sysconf.systime.ntpstatus')}
            name="ntp_status"
            valuePropName="checked"
          >
            <Checkbox></Checkbox>
          </Form.Item>
          <Row>
            <Col offset={6}>
              <Form.Item>
                <Button type='primary' key='subment'
                  style={{ borderRadius: 5 }}
                  onClick={() => {
                    ntpSave();
                  }}
                  disabled={!writable}
                  icon={<SaveOutlined />}>
                  {language('project.savesettings')}
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </ProForm>
      </ProCard>
    </ProCard>
  )
};

export default System
