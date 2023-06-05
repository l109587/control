import React, { useRef, useState, useEffect } from 'react';
import { history } from 'umi'
import { SaveOutlined } from '@ant-design/icons';

import { Col, Alert, message, Row, Button } from 'antd'
import { post } from '@/services/https';
import ProForm, { ProFormText } from '@ant-design/pro-form';
import { ProFormRadio, ProCard, ProFormSwitch, ProFormCheckbox } from '@ant-design/pro-components';
import { formhorizCard, } from "@/utils/helper";
import { language } from '@/utils/language';
import '@/utils/index.less';
import './index.less';
import { AmTag } from '@/components';
import { fetchAuth } from '@/utils/common';
import { regIpList } from '../../../../utils/regExp';

let H = document.body.clientHeight - 285
var clientHeight = H
export default (props) => {
  const writable = fetchAuth()
  const formRef = useRef();
  const [initialValue, setInitialValue] = useState([]);
  useEffect(() => {
    show();
  }, []);

  //回显接口
  const show = () => {
    let data = {};
    post('/cfg.php?controller=confHA&action=show', data).then((res) => {
      if (!res.success) {
        message.error(res.msg);
        return false;
      }
      let initialValue = res.data[0];
      initialValue.enable = initialValue.enable == 'Y' || initialValue.enable == true ? true : false;
      initialValue.ext = initialValue.ext == 'Y' ? ['Y'] : [];
      setInitialValue(initialValue);
      setTimeout(function () {
        formRef.current.setFieldsValue(initialValue)
      }, 100)
    }).catch(() => {
      console.log('mistake')
    })
  }

  const save = () => {
    let value = formRef.current.getFieldsValue(['enable', 'ext', 'role', 'vip']);
    let data = {};
    data.enable = value.enable == true || value.enable == 'Y' ? 'Y' : 'N'
    data.ext = value.ext?.length < 1 ? 'N' : 'Y' ;
    data.role = value.role
    data.vip = value.vip
    post('/cfg.php?controller=confHA&action=set', data).then((res) => {
      if (!res.success) {
        message.error(res.msg);
        return false;
      }
      show();
      message.success(res.msg);
    }).catch(() => {
      console.log('mistake')
    })
  }

  const enablePort = [
    { label: language('sysconf.standby.enableheartbeatport'), value: 'Y' },
  ];
  const doubleClickRole = [
    { label: language('sysconf.standby.host'), value: 'master' },
    { label: language('sysconf.standby.standbymachine'), value: 'standby' },
  ];
  return (
    <>
      <ProCard title={language('sysconf.standby.doubleclickconfiguration')}>
        <Col offset={5} style={{ marginBottom: '20px' }}>
          <Alert
            style={{
              width: '600px',
              marginLeft: document.body.clientWidth < 1920 ? '-20px' : '',
            }}
            type="info"
            showIcon
            description={
              <div>
                <div>{language('sysconf.standby.pleaseconfigurehostbeforeconfiguringstandbymachine')}</div>
                <div>{language('sysconf.standby.afterfirstconfigurationhostwillprovideexternalservices')}</div>
                <div>{language('sysconf.standby.serviceipaddressexternalaccessaddress')}</div>
              </div>
            }
            message={language('sysconf.standby.helpinfo')}
          ></Alert>
        </Col>
        <ProForm className='standbyfrombox' {...formhorizCard}
          submitter={{
            render: (props, doms) => {
              return [<Row>
                <Col span={12} offset={6}>
                  <Button type='primary' key='subment'
                    style={{ borderRadius: 5, marginBottom: '24px' }}
                    onClick={() => {
                      props.submit()
                    }}
                    disabled={!writable}
                    icon={<SaveOutlined />}>
                    {language('project.savesettings')}
                  </Button>
                </Col>
              </Row>
              ]
            }
          }}
          formRef={formRef}
          onFinish={(values) => {
            save();
          }}
          >
          <ProFormSwitch label={language('sysconf.standby.qstatus')} name='enable' checkedChildren={language('project.open')} unCheckedChildren={language('project.close')} />
          <ProFormCheckbox.Group
            name='ext'
            label={language('sysconf.standby.doubleclickmode')}
            options={enablePort}
          />
          <ProFormRadio.Group
            options={doubleClickRole}
            label={language('sysconf.standby.doubleclickrole')}
            radioType="button"
            name="role"
            fieldProps={{
              buttonStyle: 'solid',
              defaultValue: 'master',
            }}
          />
          <ProFormText width='280px' name='vip' label={language('sysconf.standby.serviceipaddress')} rules={[
            {
              pattern: regIpList.ipv4.regex,
              message: regIpList.ipv4.alertText,
            }
          ]} />
          <ProFormText width='260px' label={language('sysconf.standby.servicestatus')} >
            <AmTag name={initialValue.state == 'close' ? language('sysconf.standby.notenabled') : initialValue.state == 'wait' ? language('sysconf.standby.waitingservice') : language('sysconf.standby.servicing')}
              color={initialValue.state == 'close' ? 'default' : initialValue.state == 'wait' ? 'error' : 'success'} />
          </ProFormText>
        </ProForm>
      </ProCard>
    </>
  )

}