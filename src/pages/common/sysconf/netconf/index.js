import React, { useRef, useState, useEffect } from 'react';
import { formleftLayout, violationitem } from "@/utils/helper";
import ProForm, { ProFormRadio, ProFormSelect, ProFormText } from '@ant-design/pro-form';
import { SaveOutlined } from '@ant-design/icons';
import { Button, Row, Col, Radio, message, Spin } from 'antd';
import { post, postAsync } from '@/services/https';
import { ProCard } from '@ant-design/pro-components';
import { language } from '@/utils/language';
import './netconf.less';
import { fetchAuth } from '@/utils/common';
import { regIpList, regList } from '@/utils/regExp'

export default () => {
  const writable = fetchAuth()
  const formRef = useRef();
  const dnsformRef = useRef();
  const [loading, setLoading] = useState(false);
  const [formsub, setFormsub] = useState('');
  const [dnssub, setDnssub] = useState('');
  const [nameData, setNameData] = useState([])

  useEffect(() => {
    setLoading(true)
    getData();
    getDnsdata();
    getNameData()
  }, [])

  const getData = () => {
    post('/cfg.php?controller=netSetting&action=showSingleMGT').then((res) => {
      if(!res.success) {
        message.error(res.msg);
        return false;
      }
      formRef.current.setFieldsValue(res.data);
      setLoading(false);
    }).catch(() => {
      console.log('mistake')
    })
  }

  const getNameData = () => {
    post('/cfg.php?controller=netSetting&action=showInterface').then((res) => {
      if (!res.success) {
        message.error(res.msg);
        return false
      }
      let arr = [];
      res?.data?.map((item, index) => {
        arr.push({
          label: item.name,
          value: item.name
        })
      })
      setNameData(arr)
    })
  }

  const setForm = () => {
    let obj = formRef.current.getFieldsValue(['name', 'ipv4', 'mkv4', 'gwv4', 'modev6', 'ipv6', 'mkv6', 'gwv6'])
    let data = {};
    data.name = obj.name;
    data.ipv4 = obj.ipv4;
    data.mkv4 = obj.mkv4;
    data.gwv4 = obj.gwv4;
    data.modev6 = 'manual';
    data.ipv6 = obj.ipv6;
    data.mkv6 = obj.mkv6;
    data.gwv6 = obj.gwv6;
    post('/cfg.php?controller=netSetting&action=setSingleMGT', data).then((res) => {
      if(!res.success) {
        message.error(res.msg);
        return false;
      }
      message.success(res.msg);
      getData()
    })
  }

  const getDnsdata = () => {
    post('/cfg.php?controller=netSetting&action=showDNS').then((res) => {
      if(!res.success) {
        message.error(res.msg);
        return false;
      }
      dnsformRef.current.setFieldsValue(res.data);
      setLoading(false);
    }).catch(() => {
      console.log('mistake')
    })
  }

  const setDns = () => {
    let obj = dnsformRef.current.getFieldsValue(['dns1', 'dns2'])
    let data = {};
    data.dns1 = obj.dns1;
    data.dns2 = obj.dns2;
    post('/cfg.php?controller=netSetting&action=setDNS', data).then((res) => {
      if(!res.success) {
        message.error(res.msg);
        return false;
      }
      message.success(res.msg);
    })
  }

  return (
    <Spin spinning={loading}>
      <ProCard direction='column' ghost gutter={[13, 13]} >
        <ProCard title={language('sysconf.netconf.manconf')}>
          <ProForm initialValues={{
            'modev6': 'manual'
          }} className='netconfForm' {...formleftLayout} formRef={formRef} submitter={{
            render: () => {
              return [<Row>
                <Col span={14} offset={6}>
                  <Button type='primary' key='subment'
                    style={{ marginTop: "5px", borderRadius: 5, }}
                    disabled={!writable}
                    onClick={() => {
                      setFormsub('submit')
                      formRef.current.submit();
                    }}><SaveOutlined />{language('project.savesettings')}
                  </Button>
                </Col>
              </Row>]
            }
          }} autoFocusFirstInput
            submitTimeout={2000} onFinish={async (values) => {
              if(formsub == 'submit') {
                setForm(values)
              }
            }}>
            <ProFormSelect name='name' width='240px' label={language('sysconf.netconf.manname')} placeholder='' rules={[{ required: true, message: language('project.messageselect') }]} options={nameData} />
            <ProFormText name='ipv4' width='240px' label={language('sysconf.netconf.ipv4')} placeholder='' rules={[
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
            <ProFormText name='mkv4' width='240px' label={language('sysconf.netconf.mkv4')} placeholder='' rules={[
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
              <ProFormText name='gwv4' width='240px' label={language('sysconf.netconf.gwv4')} placeholder='' rules={[
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
            <div className='IPv6RadioButton'>
              <ProFormRadio.Group hidden name='modev6' width='240px' label={language('sysconf.netconf.modev6')} radioType="button" initialValue='manual' options={[
                {
                  label: language('sysconf.netconf.manual'),
                  value: 'manual'
                },
                {
                  label: language('sysconf.netconf.dhcp'),
                  value: 'dhcp'
                }
              ]} />
            </div>
            <ProFormText name='ipv6' width='240px' label={language('sysconf.netconf.ipv6')} placeholder='' 
              rules={[
                {
                  pattern: regIpList.ipv6.regex,
                  message: regIpList.ipv6.alertText
                }
              ]}
            />
            <ProFormText name='mkv6' width='240px' label={language('sysconf.netconf.mkv6')} placeholder=''
              rules={[
                {
                  pattern: regList.onlyNum.regex,
                  message: language('sysconf.network.mkv6Msg')
                },
                {
                  validator: (rule, value) => {
                    if (Number(value) > 128 || Number(value) < 0) {
                      return Promise.reject(new Error(language('sysconf.network.mkv6Msg')))
                    } else {
                      return Promise.resolve()
                    }
                  }
                }
              ]}
            />
            <ProFormText name='gwv6' width='240px' label={language('sysconf.netconf.gwv6')} placeholder=''
               rules={[
                {
                  pattern: regIpList.ipv6.regex,
                  message: regIpList.ipv6.alertText
                }
              ]}
            />
          </ProForm>
        </ProCard>
        <ProCard title={language('sysconf.netconf.dnsconf')}>
          <ProForm {...formleftLayout} formRef={dnsformRef} submitter={{
            render: () => {
              return [<Row>
                <Col span={14} offset={6}>
                  <Button type='primary' key='subment'
                    style={{ marginTop: "5px", borderRadius: 5, }}
                    disabled={!writable}
                    onClick={() => {
                      setDnssub('finish')
                      dnsformRef.current.submit()
                    }}><SaveOutlined />{language('project.savesettings')}
                  </Button>
                </Col>
              </Row>]
            }
          }} autoFocusFirstInput
            submitTimeout={2000} onFinish={async (values) => {
              if(dnssub == 'finish') {
                setDns(values)
              }
            }}>
            <ProFormText name='dns1' width='240px' label={language('sysconf.netconf.dns1')} rules={[
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
            <ProFormText name='dns2' width='240px' label={language('sysconf.netconf.dns2')}
              rules={[
                {
                  pattern: regIpList.ipv4.regex,
                  message: regIpList.ipv4.alertText,
                }
              ]}
            />
          </ProForm>
        </ProCard>
      </ProCard>
    </Spin>
  )

}