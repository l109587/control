import React, { useRef, useState, useEffect } from 'react';
import { ProCard, ProDescriptions } from '@ant-design/pro-components';
import ProForm, { ProFormText, ProFormRadio, ProFormSwitch, ProFormTextArea, ProFormItem } from '@ant-design/pro-form';
import { formItemLayout,formleftLayout } from '@/utils/helper';
import { language } from '@/utils/language';
import { Divider, Col, Button, message, Alert, Row } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { post, postAsync } from '@/services/https';
import { regList, regIpList } from '@/utils/regExp';
import '@/utils/index.less';
import { fetchAuth } from '@/utils/common';

const SNMP = () => {
  const writable = fetchAuth()
  const formRef = useRef();
  const [level, setLevel] = useState('');
  const [encrypt, setEncrypt] = useState('');
  const [proto, setProto] = useState('');
  const [submitType, setSubmitType] = useState('');
  const [snmprev, setSnmprev] = useState('');

  useEffect(() => {
    getData()
  }, [])

  const getData = () => {
    post('/cfg.php?controller=sysSetting&action=getSNMP', {}).then((res) => {
      if(!res.success) {
        message.error(res.msg);
        return false;
      }
      formRef.current.setFieldsValue(res);
      setSnmprev(res.version);
      setLevel(res.level);
      setEncrypt(res.encrypt);
      setProto(res.proto);
    }).catch(() => {
      console.log('mistake')
    })
  };

  const handleSaveBtn = (values) => {
    values.status = values.status ? 1 : 0;
    post('/cfg.php?controller=sysSetting&action=setSNMP', values).then((res) => {
      if(res.success) {
        message.success(res.msg)
        getData()
      } else {
        message.success(res.msg)
      }
    }).catch(() => {
      console.log('mistake')
    })
  }

  return (<>
    {/* <div>
        <p>{language('sysconf.sysserv.explain')}</p>
        <div>
          <ul style={{ lineHeight: '22px', }}>
            <li>{language('sysconf.sysserv.Snpminfo')}</li>
            <li>{language('sysconf.sysserv.publicvrv')}</li>
            <li>{language('sysconf.sysserv.authpriv')}</li>
            <li>{language('sysconf.sysserv.iprange')}</li>
          </ul>
        </div>
      </div> */}
    <ProCard>
      <Row>
        <Col span={5}></Col>
        <Col >
          <div style={{ display: 'flex', flexDirection: 'column', marginBottom:'20px' }}>
            <Alert style={{ width: '500px' }} banner message={language('sysconf.sysserv.Snpminfo')} type="info" showIcon />
            <Alert style={{ width: '500px' }} banner message={language('sysconf.sysserv.publicvrv')} type="info" showIcon />
            <Alert style={{ width: '500px' }} banner message={language('sysconf.sysserv.authpriv')} type="info" showIcon />
            <Alert style={{ width: '500px' }} banner message={language('sysconf.sysserv.iprange')} type="info" showIcon />
          </div>
        </Col>
      </Row>
      <ProForm formRef={formRef} {...formleftLayout} className='sysservform' autoFocusFirstInput
        submitter={{
          render: (props, doms) => {
            return (
              <Col offset={6}>
                <Button type='primary' key='subment'
                  style={{ borderRadius: 5 }}
                  onClick={() => {
                    setSubmitType('finsh')
                    formRef.current.submit();
                  }}
                  disabled={!writable}
                  icon={<SaveOutlined />}>
                  {language('project.savesettings')}
                </Button>
              </Col>
            )
          }
        }} onFinish={async (values) => {
          if(submitType == 'finsh') {
            handleSaveBtn(values)
          }
        }}>
        <ProFormSwitch label={language('sysconf.sysserv.switch')} name='status' checkedChildren={language('project.enable')} unCheckedChildren={language('project.disable')} />
        <ProFormRadio.Group label={language('sysconf.sysserv.SNMP')} name='version' options={[{ value: '2c', label: language('sysconf.sysserv.SNMP2c') }, { value: 'v3', label: language('sysconf.sysserv.SNMPv3') }]} onChange={(e) => {
          setSnmprev(e.target.value)
        }} />
        <ProFormTextArea width='350px' label={language('sysconf.sysserv.allowiprange')} name='iprange'
          rules={[{
            pattern: regIpList.multipv4Mask.regex,
            message: regIpList.multipv4Mask.alertText,
          }, { max: 1000 }]}
          extra={language('sysconf.sysserv.allowipextra')}
        />
        {snmprev == 'v3' ? (<><ProFormItem label={language('sysconf.sysserv.level')} name='level'>{level ? level : ''}</ProFormItem>
          <ProFormItem label={language('sysconf.sysserv.proto')} name='proto'>{proto ? proto : ''}</ProFormItem>
          <ProFormItem label={language('sysconf.sysserv.encrypt')} name='encrypt'>{encrypt ? encrypt : ''}</ProFormItem>
          <ProFormText 
            width='350px' 
            name='usname' 
            label={language('sysconf.sysserv.user')} 
            rules={[
              { 
                required: true, 
                message: language('project.mandatory') 
              },
              {
                pattern: regList.strmax.regex,
                message: regList.strmax.alertText,
              },
              {
                max: 64
              }
            ]} 
          />
          <ProFormText.Password width='350px' name='passwd' label={language('project.login.placepawd')} rules={[
            {
              required: true,
              message: language('project.mandatory')
            },
            {
              pattern: regList.USERPWDChan.regex,
              message: regList.USERPWDChan.alertText,
            },
          ]} /></>) : (
          <></>
        )}
      </ProForm>
    </ProCard>
  </>)
}
export default SNMP;
