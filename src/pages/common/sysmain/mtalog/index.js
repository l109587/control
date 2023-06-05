import React, { useRef, useState, useEffect } from 'react';
import { LoadingOutlined, DownloadOutlined, SaveOutlined } from '@ant-design/icons';
import { ProTable, ProCard } from '@ant-design/pro-components';
import ProForm, { ProFormText, ProFormDatePicker, ProFormDigit } from '@ant-design/pro-form';
import { formleftLayout, formfieldTable } from "@/utils/helper";
import { Button, Modal, Col, Popconfirm, message, Divider, Spin } from 'antd';
import { language } from '@/utils/language';
import moment from 'moment';
import '@/utils/index.less';
import './mtalog.less';
import { post, postAsync } from '@/services/https';
import WebUploadr from '@/components/Module/webUploadr';
import DateRangePicker from '@/components/DateRangePicker';
import download from '@/utils/downnloadfile'
import { fetchAuth } from '@/utils/common';

export default () => {
  const writable = fetchAuth()
  const columns = [
    {
      title: language('sysmain.filename'),
      dataIndex: 'name',
      width: '250px',
    },
    {
      title: language('sysmain.filesize'),
      dataIndex: 'size',
      width: '120px',
    },
    {
      title: language('sysmain.filetime'),
      dataIndex: 'date',
      width: '170px',
    },
    {
      title: language('project.operate'),
      valueType: 'option',
      align: 'center',
      width: '75px',
      hideInTable:!writable,
      render: (text, record) => [
        <Popconfirm title={language('sysmain.download')} onConfirm={() => {
          download('/cfg.php?controller=mtaOPlog&action=downloadFile', {}, setLoading, false, {file: record.name})
        }}>
          <DownloadOutlined style={{ color: '#12C189' }} />
        </Popconfirm>
      ]
    },
  ]

  const exporttext = language('project.exporttext');
  const importtext = language('project.importtext');
  let format = 'YYYY-MM-DD';
  const backformRef = useRef();
  const mlogexptformRef = useRef();
  const mlogimpotformRef = useRef();
  const stateRef = useRef();
  const [loading, setLoading] = useState(false);
  const [loadtip, setLoadtip] = useState('');
  const [tabledata, setTabledata] = useState([]);
  const [submitType, setSubmitType] = useState('');
  const [mlogexpSmt, setMlogexpSmt] = useState('');
  const [paraValue, setParaValue] = useState('');
  const loadIcon = (
    <LoadingOutlined spin />
  )

  useEffect(() => {
    stateRef.current = paraValue;
  }, [paraValue])

  useEffect(() => {
    getlogData();
  },[])

  // 操作日志备份数据回显
  const getlogData = () => {
    post('/cfg.php?controller=mtaOPlog&action=showBackupConf').then((res) => {
      if(!res.success) {
        message.error(res.msg);
        return false;
      }
      backformRef.current.setFieldsValue(res);
      setTabledata(res.data)
    }).catch(() => {
      console.log('mistake')
    })
  }

  /* 操作日志备份 保存设置 */
  const saveConfig = () => {
    let obj = backformRef.current.getFieldsValue(['minday', 'dspace']);
    let data = {};
    data.minday = obj.minday;
    data.dspace = obj.dspace;
    post('/cfg.php?controller=mtaOPlog&action=setBackupConf', data).then((res) => {
      if(!res.success) {
        message.error(res.msg);
        return false;
      }
      message.success(res.msg);
    }).catch(() => {
      console.log('mistake')
    })
  }

  /* 上传检测接口 */
  let logimportTimer = '';
  const logimport = () => {
    clearInterval(logimportTimer,)
    post('/cfg.php?controller=mtaOPlog&action=checkImportFinished').then((res) => {
      setLoading(true)
      setLoadtip(importtext)
      if(res.code === 202) {
        logimportTimer = setTimeout(() => {
          logimport()
        }, 1000);
      } else if (res.code === 200) {
        clearInterval(logimportTimer)
        setLoading(false)
        Modal.success({
          className: 'mtadatupModal',
          title: language('project.prompt'),
          content: res.msg,
          okText: language('project.determine'),
        })
      } else {
        setLoading(false)
        Modal.error({
          className: 'mtadatupModal',
          title: language('project.prompt'),
          content: res.msg,
          okText: language('project.determine'),
        })
        return false
      }
    }).catch(() => {
      console.log('mistake')
    })
  }

  const upbutext = language('sysmain.mtalog.mtalogcheck')
  const upurl = '/cfg.php?controller=mtaOPlog&action=importData'; // 接口
  const accept = '.zip, .tar'; 
  const isShowUploadList = true; // 是否展示进度条及上传列表
  const maxSize = 400; // 上传大小限制
  const maxCount = 1;
  const showModal = true;
  const isCheck = true;
  const modalText = language('sysmain.mtalog.upmodcontext'); 
  const isRequired = true;
  let parameter = {
    'impPawd' : paraValue,
  }
  const isReqmsg = language('sysmain.mtalog.requmsg')

  const valiCompare = (value, callback, minVal, maxVal) => {
    if (value < minVal || value > maxVal) {
      callback(language('project.number.minAndMax',{ min: minVal, max: maxVal}))
    } else {
      callback()
    }
  }

  const testFn = (value) => {
    if (value.length < 3 || value.length > 30) {
      return false
    } else {
      return true
    }
  }

  return (<>
    <Spin tip={loadtip} spinning={loading} indicator={loadIcon} size='large' style={{ height: '100%', position: 'absolute', top: '20%', fontSize: '24px' }}>
      <ProCard ghost className='mtalogCard' direction='column' gutter={[13, 13]}>
        <ProCard className='mtalogbackup' ghost title={language('sysmain.mtalog.mtalogbackup')}>
          <ProForm className='logbackForm' {...formleftLayout} formRef={backformRef} autoFocusFirstInput submitter={{
            render: (props, doms) => {
              return (
                <Col offset={6} style={{ marginTop: 15 }}>
                  <Button type='primary' key='subment'
                    style={{ borderRadius: 5 }}
                    onClick={() => {
                      setSubmitType('finsh')
                      backformRef.current.submit();
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
              saveConfig(values)
            }
          }}>
            <ProFormDigit 
              width="200px" 
              name='minday' 
              fieldProps={{ precision: 0, controls: false, }} 
              label={language('sysmain.minshelflife')} 
              addonAfter={language('sysmain.aftertext')} 
              rules={[
                {
                  required: true,
                  message:language('project.mandatory')
                },
                {
                  validator: (rule, value, callback) => {
                    valiCompare(value, callback, 7, 90)
                  }
                }
              ]} 
            />
            <ProFormDigit 
              width="200px" 
              name='dspace' 
              fieldProps={{ precision: 0, controls: false, }} 
              label={language('sysmain.mtalog.occupancy')}
              addonAfter={'%'} 
              rules={[
                {
                  required: true,
                  message:language('project.mandatory')
                },
                {
                  validator: (rule, value, callback) => {
                    valiCompare(value, callback, 20, 80)
                  }
                }
              ]}
             />
            <ProFormText name='data' {...formfieldTable} label={language('sysmain.filelist')}>
              <ProTable className='mtalogTable'
                size='small'
                columns={columns}
                rowKey="index"
                dataSource={tabledata}
                scroll={{ y: 150 }}
                bordered={true}
                search={false}
                options={false}
                pagination={false}
              />
            </ProFormText>
          </ProForm>
        </ProCard>
        <Divider className='mtalogDivider' />
        <ProCard className='mtalogexprot' ghost title={language('sysmain.mtalog.mtalogexprot')}>
          <ProForm className='mlogexptForm' formRef={mlogexptformRef} {...formleftLayout} autoFocusFirstInput
           initialValues={{
            begDate:Date.now() -1000 * 60*60*24*30,
            endDate:Date.now()
           }}
          submitter={{
            render: (props, doms) => {
              return (
                <Col offset={6}>
                  <Button type='primary'
                    style={{ borderRadius: 5 }}
                    icon={<DownloadOutlined />}
                    disabled={!writable}
                    onClick={() => {
                      setLoadtip(exporttext)
                      setMlogexpSmt('submit')
                      mlogexptformRef.current.submit();
                    }}>
                    {language('sysmain.mtalog.expoconfig')}
                  </Button>
                </Col>
              )
            }
          }} onFinish={async (values) => {
            if(mlogexpSmt == 'submit') {
              let obj = mlogexptformRef.current.getFieldsValue(['expPawd', 'begDate', 'endDate']);
              let data = {};
              data.expPawd = obj.expPawd;
              data.begDate = moment(obj.begDate).format(format);
              data.endDate = moment(obj.endDate).format(format);
              download('/cfg.php?controller=mtaOPlog&action=exportData', data, setLoading)
            }
          }}>
            <ProFormText hidden />
            <ProFormText.Password rules={[{required: true,message:language('project.mandatory')},{min:3},{max:30}]} name='expPawd' label={language('sysmain.mtalog.paswodexp')} width="200px" />
            <DateRangePicker labelText={language('sysmain.mtalog.startdate')} formName='begDate' width='200px' disabledDateFn={
              (current) => {
                let obj = mlogexptformRef.current.getFieldsValue(['endDate'])
                return current > obj.endDate
              }
            } />
            <DateRangePicker labelText={language('sysmain.mtalog.enddate')} formName='endDate' width='200px' disabledDateFn={
              (current) => {
                let obj = mlogexptformRef.current.getFieldsValue(['begDate'])
                return current < obj.begDate
              }
            } />
          </ProForm>
        </ProCard>
        <Divider className='mtalogDivider' />
        <ProCard className='mtalogimport' ghost title={language('sysmain.mtalog.mtalogimport')}>
          <ProForm formRef={mlogimpotformRef} {...formleftLayout} autoFocusFirstInput submitter={false}>
            <ProFormText hidden/>
            <ProFormText.Password 
              rules={[
                {
                  required: true,
                  message:language('project.mandatory')
                },
                {
                  min: 3
                },
                { 
                  max: 30
                }
              ]} 
              name='impPawd' 
              width="200px" 
              label={language('sysmain.mtalog.paswodimp')} 
            />
            <ProFormText label={language('sysmain.mtalog.mtalogfileimp')}>
              <button className='mtalogupDiv' htmlType='submit' onClick={() => {
                let obj = mlogimpotformRef.current.getFieldsValue(['impPawd']);
                setParaValue(obj.impPawd)
              }}>
                <WebUploadr parameter={parameter} paramValue={stateRef} isRequired={isRequired} isReqmsg={isReqmsg} isAuto={false} upbutext={upbutext} upurl={upurl} accept={accept} isShowUploadList={isShowUploadList} maxSize={maxSize} maxCount={maxCount} showModal={showModal} modalText={modalText} isCheck={isCheck} checkFun={logimport} handBtnType='primary' ruleFn={testFn} />
              </button>
            </ProFormText>
          </ProForm>
        </ProCard>
      </ProCard>
    </Spin>
  </>);
};
