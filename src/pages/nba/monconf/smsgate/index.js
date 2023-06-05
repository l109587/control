import React, { useRef, useState, useEffect } from 'react';
import { formleftLayout, violationitem } from "@/utils/helper";
import ProForm, { ProFormRadio, ProFormItem, ProFormText, ProFormSelect } from '@ant-design/pro-form';
import { SaveOutlined } from '@ant-design/icons';
import { post, postAsync } from '@/services/https';
import { Button, Row, Col, message, Tooltip } from 'antd';
import { ProCard } from '@ant-design/pro-components';
import { language } from '@/utils/language';
import { regList, regPortList, regIpList } from '@/utils/regExp';
import { valiCompare } from '@/utils/common'
import { InfoCircleOutlined } from '@ant-design/icons'
import './smsgate.less'

export default () => {

  const formRef = useRef();
  const alaformRef = useRef();
  const [typeList, setTypelist] = useState([]); 
  const [renderType, setRenderType] = useState(0);

  useEffect(() => {
    getSmsConf();
    getWarnConf();
    getSmsTypeList()
  }, [])

  const getSmsConf = () => {
    post('/cfg.php?controller=warnConf&action=showSmsConf').then((res) => {
      if(!res.success) {
        message.error(res.msg);
        return false;
      }
      if (res.smsType == '1') {
        setRenderType(1)
      } else if (res.smsType == '2') {
        setRenderType(2)
      } else if (res.smsType == '3') {
        setRenderType(3)
      }
      formRef.current.setFieldsValue(res);
    }).catch(() => {
      console.log('mistake')
    })
  }

  const getWarnConf = () => {
    post('/cfg.php?controller=warnConf&action=showWarnConf').then((res) => {
      if(!res.success) {
        message.error(res.msg);
        return false;
      }
      alaformRef.current.setFieldsValue(res);
    }).catch(() => {
      console.log('mistake')
    })
  }

  const getSmsTypeList = () => {
    post('/cfg.php?controller=warnConf&action=showSmsTypeList').then((res) => {
        let typeData = [];
        res.data.map((item) => {
            let tmp = [];
            tmp['label'] = item.text;
            tmp['value'] = item.id;
            typeData.push(tmp);
        })
        setTypelist(typeData)
    }).catch(() => {
        console.log('mistake')
    })
}

  const setSmsConf = () => {
    let obj = formRef.current.getFieldsValue(['smsType', 'host', 'code', 'pw', 'sign', 'temId']);
    let data = {};
    data.smsType = obj.smsType;
    data.host = obj.host;
    data.code = obj.code;
    data.pw = obj.pw;
    data.sign = obj.sign;
    data.temId = obj.temId;
    post('/cfg.php?controller=warnConf&action=setSmsConf', data).then((res) => {
      if(!res.success) {
        message.error(res.msg);
        return false;
      }
      message.success(res.msg);
    }).catch(() => {
      console.log('mistake')
    })
  }

  const setWarnConf = () => {
    let obj = alaformRef.current.getFieldsValue(['frequency', 'dayLimit', 'monthLimit']);
    let data = {};
    data.frequency = obj.frequency;
    data.dayLimit = obj.dayLimit;
    data.monthLimit = obj.monthLimit;
    post('/cfg.php?controller=warnConf&action=setWarnConf', data).then((res) => {
      if(!res.success) {
        message.error(res.msg);
        return false;
      }
      message.success(res.msg);
    }).catch(() => {
      console.log('mistake')
    })
  }

  return (
    <ProCard direction='column' ghost gutter={[13, 13]}>
      <ProCard title={language('monconf.smsgate.smaconfig')}>
        <ProForm className='smswayfForm' {...formleftLayout} formRef={formRef} submitter={{
          render: (props) => {
            return [<Row>
              <Col span={14} offset={6}>
                <Button type='primary' key='subment'
                  style={{ marginTop: "5px", borderRadius: 5, }}
                  onClick={() => {
                    formRef.current.submit()
                  }}><SaveOutlined />{language('project.savesettings')}
                </Button>
              </Col>
            </Row>]
          }
        }}
          submitTimeout={2000} onFinish={async (values) => {
            setSmsConf()
          }}>
          <ProFormSelect label={language('monconf.smsgate.smsType')} name='smsType' options={typeList} onChange={(key, value) => {
            setRenderType(key)
          }} rules={[
            {
              required: true,
              message: language('project.messageselect')
            }
          ]} />
          {renderType == '1' ? <>
            <ProFormText label={language('monconf.smsgate.code')} name='code' rules={[
              {
                required: true,
                message: language('project.mandatory')
              },
              {
                pattern: regList.wordOrNum.regex,
                message: regList.wordOrNum.alertText,
              },
              {
                max: 64
              }
            ]} />
            <ProFormText.Password label={language('monconf.smsgate.pw')} name='pw' rules={[
              {
                required: true,
                message: language('project.mandatory')
              },
              {
                max: 32
              },
            ]} />
          </> : 
          renderType == '3' ? 
            <ProFormText label={language('monconf.smsgate.code')} name='code' rules={[
              {
                required: true,
                message: language('project.mandatory')
              },
              {
                pattern: regList.wordOrNum.regex,
                message: regList.wordOrNum.alertText,
              },
              {
                max: 64
              }
            ]} /> : 
          renderType == '2' ? <>
            <ProFormText label={language('monconf.smsgate.host')} name='host'  rules={[
              {
                required: true,
                message: language('project.mandatory')
              },
              {
                pattern: regIpList.domainName.regex,
                message: regIpList.domainName.alertText,
              },
              {
                max: 64
              }
            ]} />
            <ProFormText label={language('monconf.smsgate.code')} name='code' rules={[
                {
                  required: true,
                  message: language('project.mandatory')
                },
                {
                  pattern: regList.wordOrNum.regex,
                  message: regList.wordOrNum.alertText,
                },
                {
                  max: 64
                }
             ]} />
            <ProFormText.Password label={language('monconf.smsgate.pw')} name='pw' rules={[
              {
                required: true,
                message: language('project.mandatory')
              },
              {
                max: 32
              }
            ]} />
          </> : <></>}
          <ProFormText label={language('monconf.smsgate.sign')} name='sign' hidden />
          <ProFormText label={language('monconf.smsgate.temId')} name='temId' hidden />
        </ProForm>
      </ProCard>
      <ProCard title={language('monconf.smsgate.smsalacon')}>
        <ProForm className='smsalafForm' {...formleftLayout} formRef={alaformRef} submitter={{
          render: (props, dom) => {
            return [<Row>
              <Col span={14} offset={6}>
                <Button type='primary' key='subment'
                  style={{ marginTop: "5px", borderRadius: 5, }}
                  onClick={() => {
                    props.submit()
                  }}><SaveOutlined />{language('project.savesettings')}
                </Button>
              </Col>
            </Row>]
          }
        }}
          submitTimeout={2000} onFinish={async (values) => {
            setWarnConf()
          }}>
          <ProFormText label={language('monconf.smsgate.frequency')} name='frequency'rules={[
            {
              required: true,
              message: language('project.mandatory')
            },
            {
              pattern: regList.positiveInteger.regex,
              message: regList.positiveInteger.alertText,
            },
            {
              validator: (rule, value, callback) => {
                valiCompare(value, callback, Number(0), Number(120))
              }
            }
          ]} addonAfter={language('monconf.smsgate.minuet')} tooltip={language('monconf.smsgate.minuet.tooltip')} />
          <ProFormText label={language('monconf.smsgate.dayLimit')}  name='dayLimit'rules={[
            {
              required: true,
              message: language('project.mandatory')
            },
            {
              pattern: regList.positiveInteger.regex,
              message: regList.positiveInteger.alertText,
            },
            {
              validator: (rule, value, callback) => {
                valiCompare(value, callback, Number(0), Number(500))
              }
            }
          ]} addonAfter={language('monconf.smsgate.strap')} tooltip={language('monconf.smsgate.dayLimit.tooltip')} />
          <ProFormText label={language('monconf.smsgate.monthLimit')}  name='monthLimit' rules={[
            {
              required: true,
              message: language('project.mandatory')
            },
            {
              pattern: regList.positiveInteger.regex,
              message: regList.positiveInteger.alertText,
            },
            {
              validator: (rule, value, callback) => {
                valiCompare(value, callback, Number(0), Number(16000))
              }
            }
          ]} addonAfter={language('monconf.smsgate.strap')} tooltip={language('monconf.smsgate.monthLimit.tooltip')}/>
        </ProForm>
      </ProCard>
    </ProCard>
  )
}