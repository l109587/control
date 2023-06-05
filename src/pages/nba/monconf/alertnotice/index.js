import React, { useRef, useState, useEffect } from 'react';
import { formleftLayout } from "@/utils/helper";
import ProForm, { ProFormText } from '@ant-design/pro-form';
import { DeleteOutlined, SaveOutlined, SaveFilled, DeleteFilled, EditFilled, LoadingOutlined } from '@ant-design/icons';
import EditTable from '@/components/Module/tinyEditTable/tinyEditTable'
import { post } from '@/services/https';
import { Button, Row, Col, message, Checkbox, Spin, Popconfirm, Space,Tooltip } from 'antd';
import { ProCard, EditableProTable } from '@ant-design/pro-components';
import { language } from '@/utils/language';
import styles from './alertnotice.less'
import { SendEmail } from '@icon-park/react';
import { regList, regIpList } from '@/utils/regExp';
import classNames from 'classnames'

export default () => {

  const formRef = useRef();
  const phonesformRef = useRef();
  const [loading, setLoading] = useState(true);
  const [buloading, setBuloading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [checked, setChecked] = useState(true);
  const [editableKeys, setEditableRowKeys] = useState(() => dataSource.map((item) => item.id));//每行编辑的id
  const [phoneData, setPhoneData] = useState([]);
  const [pheditableKeys, setPhEditableRowKeys] = useState(() => phoneData.map((item) => item.id));//每行编辑的id
  const [submitType, setSubmitType] = useState('');
  const [phoSubmit, setPhoSubmit] = useState('')
  const [emailDateSource, setEmailDateSource] = useState([])
  const [msgDateSource, setMsgDateSource] = useState([])
  const [isSave, setIsSave] = useState(true) // 未保存当前数据不可下发
  const [isPSave, setIsPsave] = useState(true)

  const fromcolumns = [
    {
      title: language('monconf.alertnotice.email'),
      dataIndex: 'email',
      align: 'center',
      width: '80%',
      formItemProps: {
        rules: [
          {
            required: true,
            message: language('project.mandatory'),
          },
          {
            pattern: regList.strictEmail.regex,
            message: regList.strictEmail.alertText,
          },
          { validator: (rule, value) => {
              if(!isSave) {
                return Promise.reject(language('project.pleasesavedata'));
              } else {
                return Promise.resolve();
              }
            }
          },
        ],
      },
    },
    {
      title: language('project.mconfig.operate'),
      valueType: 'option',
      width: '25%',
      align: 'center',
      render: (text, record, _, action) => [
        <Tooltip placement="top" title={language('project.sysconf.syscert.edit')}>
          <a key="editable" onClick={() => {
          var _a;
          (_a = action === null || action === void 0 ? void 0 : action.startEditable) === null || _a === void 0 ? void 0 : _a.call(action, record.id);
        }}>
          <EditFilled />
          </a>
        </Tooltip>,
        <Popconfirm okText={language('project.yes')} cancelText={language('project.no')}
          title={language('project.delconfirm')}
          onConfirm={() => {
            setEmailDateSource(emailDateSource.filter((item) => item.id !== record.id));
          }}>
            <Tooltip placement="top" title={language('project.del')}>
              <DeleteOutlined style={{ color: 'red' }} />
            </Tooltip>
        </Popconfirm>
      ]
    },
  ]


  const phcolumns = [
    {
      title: language('monconf.alertnotice.phonenum'),
      dataIndex: 'phone',
      align: 'center',
      width: '80%',
      formItemProps: {
        rules: [
          {
            required: true,
            message: language('project.mandatory'),
          },
          {
            pattern: regList.phoneorlandline.regex,
            message: regList.phoneorlandline.alertText,
          },
          { validator: (rule, value) => {
              if(!isPSave) {
                return Promise.reject(language('project.pleasesavedata'));
              } else {
                return Promise.resolve();
              }
            }
          },
        ],
      },
    },
    {
      title: language('project.mconfig.operate'),
      valueType: 'option',
      width: '25%',
      align: 'center',
      render: (text, record, _, action) => [
        <Tooltip placement="top" title={language('project.sysconf.syscert.edit')}>
        <a key="magEditable" onClick={() => {
        var _a;
        (_a = action === null || action === void 0 ? void 0 : action.startEditable) === null || _a === void 0 ? void 0 : _a.call(action, record.id);
      }}>
        <EditFilled />
        </a>
      </Tooltip>,
      <Popconfirm okText={language('project.yes')} cancelText={language('project.no')}
        title={language('project.delconfirm')}
        onConfirm={() => {
          setMsgDateSource(msgDateSource.filter((item) => item.id !== record.id));
        }}>
          <Tooltip placement="top" title={language('project.del')}>
            <DeleteOutlined style={{ color: 'red' }} />
          </Tooltip>
      </Popconfirm>
      ]
    },
  ]

  useEffect(() => {
    setLoading(true)
    getData();
  }, [])

  const getData = () => {
    post('/cfg.php?controller=warnConf&action=showMailConf').then((res) => {
      if(!res.success) {
        message.error(res.msg);
        return false;
      }
      if(res.mailSSL === 'Y') {
        setChecked(true);
      } else if(res.mailSSL === 'N') {
        setChecked(false);
      }
      let tabledata = [];
      let rowKey = [];
      let sendMails = res.sendMails
      let info = sendMails?sendMails.split(';'):[]
      info.map((item, index) => {
        tabledata.push({ id: (index + 1), email: item })
        rowKey.push(index + 1);
      })
      res.sendMails = tabledata;
      setEmailDateSource(res.sendMails)
      let phdata = [];
      let sendPhones = res.sendPhones;
      let phlist = sendPhones?sendPhones.split(';'):[]
      phlist.map((item, index) => {
        phdata.push({ id: (index + 1), phone: item })
      })
      res.sendPhones = phdata;
      setMsgDateSource(phdata)
      res.sendPhones=[]
      res.sendMails=[]
      let initialValues = res;
        formRef.current.setFieldsValue(initialValues);
        phonesformRef.current.setFieldsValue(initialValues);
        setLoading(false);
    })
  }

  const handleSend = () => {
    let obj = formRef.current.getFieldsValue(['smtpServer', 'mailSSL', 'mailCount', 'mailPd', 'testMail'])
    let data = {};
    data.smtpServer = obj.smtpServer;
    data.mailSSL = checked == true ? 'Y' : 'N';
    data.mailCount = obj.mailCount;
    data.mailPd = obj.mailPd;
    data.testMail = obj.testMail;
    setBuloading(true);
    post('/cfg.php?controller=warnConf&action=testMailSend', data).then((res) => {
      if(!res.success) {
        setBuloading(false)
        message.error(res.msg);
        return false;
      }
      setBuloading(false)
      message.success(res.msg);
    })
  }

  const setMailconf = () => {
    let obj = formRef.current.getFieldsValue(['smtpServer', 'mailSSL', 'mailCount', 'mailPd', 'sendMails'])
    let data = {};
    data.smtpServer = obj.smtpServer;
    data.mailSSL = checked == true ? 'Y' : 'N';
    data.mailCount = obj.mailCount;
    data.mailPd = obj.mailPd;
    let arr = []
    if(emailDateSource.length>0) {
      emailDateSource.map((item) => {
        arr.push(item.email)
      })
    }
    data.sendMails = arr.join(';');
    post('/cfg.php?controller=warnConf&action=setMailConf', data).then((res) => {
      if(!res.success) {
        message.error(res.msg);
        return false;
      }
      message.success(res.msg);
    })
  }

  const setPhoneconf = () => {
    let data = {};
    let arr = []
    if(msgDateSource.length>0) {
      msgDateSource.map((item) => {
        arr.push(item.phone)
      })
    }
    data.sendPhones = arr.join(';');
    post('/cfg.php?controller=warnConf&action=setSmsPhonesConf', data).then((res) => {
      if(!res.success) {
        message.error(res.msg);
        return false;
      }
      message.success(res.msg);
    })
  }

  return (
    <Spin spinning={loading}>
      <ProCard direction='column' ghost gutter={[13, 13]}>
        <ProCard title={language('monconf.alertnotice.emailconfig')} style={{paddingBottom:8}}>
          <ProForm  {...formleftLayout} formRef={formRef} submitTimeout={2000} submitter={{
            render: () => {
              return [<Row>
                <Col span={14} offset={6}>
                  <Button type='primary' style={{ borderRadius: 5 }}
                    onClick={() => {
                      if (!isSave) {
                        message.error(language('project.pleasesavedata'))
                      } else {
                        setSubmitType('finish')
                        formRef.current.submit();
                      }
                    }}
                  ><SaveOutlined />{language('project.savesettings')}</Button>
                </Col>
              </Row>]
            }
          }} onFinish={(values) => {
            if(submitType == 'finish') {
              setMailconf(values);
            }
          }}>
            <div>
              <ProFormText label={language('monconf.alertnotice.smtpServer')} name='smtpServer' rules={[
                {
                  pattern: regIpList.ipOrRealm.regex,
                  message: regIpList.ipOrRealm.alertText,
                },
                {
                  required: true,
                  message: language('project.mandatory')
                }
              ]} width='280px' addonAfter={<Checkbox checked={checked} name='mailSSL' onChange={(e) => {
                setChecked(e.target.checked);
              }} >SSL</Checkbox>} />
            </div>
            <ProFormText rules={[
              {
                pattern: regList.strictEmail.regex,
                message: regList.strictEmail.alertText,
              },
              {
                required: true,
                message: language('project.mandatory')
              }
            ]} width='280px' label={language('monconf.alertnotice.mailCount')} name='mailCount' />
            <ProFormText.Password rules={[
              {
                required: true,
                message: language('project.mandatory')
              },
              {
                pattern: regList.wordOrNum.regex,
                message: regList.wordOrNum.alertText,
              }
            ]} width='280px' label={language('monconf.alertnotice.mailPd')} name='mailPd' />
            <div className={styles.sendMailDiv}>
              <ProFormText width='280px' label={language('monconf.alertnotice.testMail')} placeholder={language('monconf.alertnotice.testMailplace')} name='testMail'  rules={[
              {
                pattern: regList.strictEmail.regex,
                message: regList.strictEmail.alertText,
              }
            ]} addonAfter={<Button type='primary' disabled={buloading} onClick={handleSend} >{buloading === false ? <div className={styles.mailbuDiv}><SendEmail style={{ marginTop: 5 }} size='16' fill='#fff' /><span style={{ marginLeft: 10 }}>{language('monconf.alertnotice.test')}</span></div> : <div className='mailbuDiv'><LoadingOutlined style={{ marginRight: 10, fontSize: 16 }} /><span style={{ marginTop: '3px' }}>{language('monconf.alertnotice.test')}</span></div>}</Button>} />
            </div>
            <div className={classNames({[styles.emailItemNoError]:emailDateSource.length>0})}>
            <ProFormText style={{ width: '377px' }} label={language('monconf.alertnotice.sendMails')} name='sendMails' trigger="onValuesChange" rules={[
              {
                required: emailDateSource.length>0?false:true,
                message: language('project.mandatory')
              }
            ]}>
              <EditTable setIsSave={setIsSave} columns={fromcolumns}  tableHeight={130} tableWidth={377} maxLength={5} dataSource={emailDateSource} setDataSource={setEmailDateSource} deleteButShow={false}/>
            </ProFormText>
            </div>
          </ProForm>
        </ProCard>
        <ProCard title={language('monconf.alertnotice.smsalarm')} style={{paddingBottom:8}}>
          <ProForm  {...formleftLayout} formRef={phonesformRef} submitTimeout={2000} submitter={{
            render: () => {
              return [<Row>
                <Col span={14} offset={6}>
                  <Button type='primary' style={{ borderRadius: 5 }}
                    onClick={() => {
                      if (!isPSave) {
                        message.error(language('project.pleasesavedata'))
                      } else {
                        setPhoSubmit('submit')
                        phonesformRef.current.submit();
                      }
                    }}
                  ><SaveOutlined />{language('project.savesettings')}</Button>
                </Col>
              </Row>]
            }
          }} onFinish={(values) => {
            if(phoSubmit == 'submit') {
              setPhoneconf()
            }
          }}>
             <div className={classNames({[styles.phoneItemNoError]:msgDateSource.length>0})}>
            <ProFormText rules={[
              {
                required: msgDateSource.length>0?false:true,
                message: language('project.mandatory')
              }
            ]} label={language('monconf.alertnotice.sendPhones')} name='sendPhones' style={{ width: '377px' }}>
              <EditTable setIsSave={setIsPsave} columns={phcolumns}  tableHeight={170} tableWidth={377} maxLength={3} dataSource={msgDateSource} setDataSource={setMsgDateSource} deleteButShow={false}/>
            </ProFormText>
            </div>
          </ProForm>
        </ProCard>
      </ProCard>
    </Spin>
  )
}
