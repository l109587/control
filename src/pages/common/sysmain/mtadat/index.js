import React, { useRef, useState, useEffect } from 'react';
import { DownloadOutlined, QuestionCircleFilled, LoadingOutlined, SaveOutlined, UploadOutlined } from '@ant-design/icons';
import { ProTable, EditableProTable, ProCard, ProFormDateTimePicker } from '@ant-design/pro-components';
import ProForm, { ProFormText, ProFormDatePicker, ProFormDigit } from '@ant-design/pro-form';
import { formleftLayout, formfieldTable } from "@/utils/helper";
import { Progress, Button, Row, Col, Popconfirm, message, Spin, Modal, Divider, Upload, Space } from 'antd';
import { language } from '@/utils/language';
import './index.less';
import moment from 'moment';
import { post, postAsync } from '@/services/https';
import { set } from 'store';
import axios from 'axios';
import WebUploadr from '@/components/Module/webUploadr';
import DateRangePicker from '@/components/DateRangePicker';
import download from '@/utils/downnloadfile'
import { fetchAuth } from '@/utils/common';
const { confirm } = Modal;


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
      render: (text, record) => [
        <Popconfirm title={language('sysmain.download')} onConfirm={() => {
          download('/cfg.php?controller=mtaData&action=downloadFile', {}, setLoading, false, {file: record.name})
        }}>
          <DownloadOutlined style={{ color: '#12C189' }} />
        </Popconfirm>
      ]
    },
  ]

  const exporttext = language('project.exporttext');
  const importtext = language('project.importtext');
  let format = 'YYYY-MM-DD';
  const formRef = useRef();
  const exportformRef = useRef();
  const impoetformRef = useRef();
  const [loading, setLoading] = useState(false);
  const [loadtip, setLoadtip] = useState('');
  const [tabledata, setTabledata] = useState([]);

  useEffect(() => {
    getbackData();
  }, [])

  // 日志数据备份回显
  const getbackData = () => {
    post('/cfg.php?controller=mtaData&action=showBackupConf').then((res) => {
      if(!res.success) {
        message.error(res.msg);
        return false;
      }
      formRef.current.setFieldsValue(res);
      setTabledata(res.data)
    }).catch(() => {
      console.log('mistake')
    })
  }

  /* 日志数据备份保存设置 */
  const saveConfig = () => {
    let obj = formRef.current.getFieldsValue(['minday']);
    let data = {};
    data.minday = obj.minday;
    post('/cfg.php?controller=mtaData&action=setBackupConf', data).then((res) => {
      if(!res.success) {
        message.error(res.msg);
        return false;
      }
      message.success(res.msg);
    }).catch(() => {
      console.log('mistake')
    })
  }

  const loadIcon = (
    <LoadingOutlined spin />
  )

  /* 上传检测接口 */
  let deteimportTimer = '';
  const deteimport = () => {
    clearInterval(deteimportTimer)
    post('/cfg.php?controller=mtaData&action=checkImportFinished').then((res) => {
      setLoading(true)
      setLoadtip(importtext)
      if(res.code === 202) {
        deteimportTimer = setInterval(() => {
          deteimport()
        }, 1000);
      } else if (res.code === 200) {
        clearInterval(deteimportTimer)
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
      }
    }).catch(() => {
      console.log('mistake')
    })
  }


  const upbutext = language('sysmain.mtadat.uploadfile')
  const upurl = '/cfg.php?controller=mtaData&action=importData'; // 接口
  const accept = '.tgz';
  const isShowUploadList = true; // 是否展示进度条及上传列表
  const maxSize = 1024; // 上传大小限制
  const maxCount = 1;
  const showModal = true;
  const isCheck = true;
  const modalText = language('sysmain.mtadat.upmodcontext');

  return (<>
    <Spin tip={loadtip} spinning={loading} indicator={loadIcon} size='large' style={{ height: '100%', position: 'absolute', top: '10%', fontSize: '24px' }}>
      <ProCard ghost className='mtadatCard' direction='column' gutter={[13, 13]}>
        <ProCard ghost className='datatenanceCard' title={language('sysmain.logbackuptitle')}>
          <ProForm formRef={formRef} {...formleftLayout} className='logbackupForm' autoFocusFirstInput submitter={{
            render: (props, doms) => {
              return (
                <Col offset={6}>
                  <Button type='primary' key='subment'
                    style={{ borderRadius: 5 }}
                    onClick={() => {
                      props.submit();
                    }}
                    disabled={!writable}
                    icon={<SaveOutlined />}>
                    {language('project.savesettings')}
                  </Button>
                </Col>
              )
            }
          }} onFinish={(values) => {
            saveConfig()
          }}>
            <div className='textformfield'>
              <ProFormText 
                width="200px" 
                name='minday'
                label={language('sysmain.minshelflife')}
                addonAfter={language('sysmain.aftertext')}
                rules={[
                  {
                    validator: (rule, value) => {
                      if (Number(value) < 7 || 90 < Number(value)) {
                        return Promise.reject(new Error(language('sysmain.mtadat.mindayRules')))
                      } else {
                        return Promise.resolve()
                      }
                    }
                  }
                ]}
              />
            </div>
            <Col className='textbox' offset={6}>
              <span className='logbackupText'>{language('sysmain.mtadat.shelflifetext')}</span>
            </Col>
            <ProFormText {...formfieldTable} name='data' label={language('sysmain.filelist')}>
              <ProTable className='mtadatTable'
                size='small'
                columns={writable? columns:columns.slice(0,columns.length-1)}
                rowKey="index"
                scroll={{ y: 140 }}
                dataSource={tabledata}
                bordered={true}
                search={false}
                options={false}
                pagination={false}
              />
            </ProFormText>
          </ProForm>
        </ProCard>
        <Divider className='mtadatdivider' />
        <ProCard className='datatenanceCard' ghost title={language('sysmain.mtadat.logexport')}>
          <ProForm className='exportlogForm' {...formleftLayout} formRef={exportformRef} autoFocusFirstInput  initialValues={{
            begDate:Date.now() -1000 * 60*60*24*30,
            endDate:Date.now()
           }} submitter={{
            render: (props, doms) => {
              return (
                <Col offset={6}>
                  <Button type='primary'
                    style={{ borderRadius: 5 }}
                    onClick={() => {
                      setLoadtip(exporttext)
                      let obj = exportformRef.current.getFieldsValue(['begDate', 'endDate']);
                      let data = {};
                      data.begDate = moment(obj.begDate).format(format);
                      data.endDate = moment(obj.endDate).format(format);
                      download('/cfg.php?controller=mtaData&action=exportData', data, setLoading)
                    }}
                    disabled={!writable}
                    icon={<DownloadOutlined />}>
                    {language('sysmain.mtadat.exportdata')}
                  </Button>
                </Col>
              )
            }
          }}>
            <DateRangePicker labelText={language('sysmain.mtalog.startdate')} formName='begDate' width='200px' disabledDateFn={
              (current) => {
                let obj = exportformRef.current.getFieldsValue(['endDate'])
                return current > obj.endDate
              }
            } />
            <DateRangePicker labelText={language('sysmain.mtalog.enddate')} formName='endDate' width='200px' disabledDateFn={
              (current) => {
                let obj = exportformRef.current.getFieldsValue(['begDate'])
                return current < obj.begDate
              }
            } />
          </ProForm>
        </ProCard>
        <Divider className='mtadatdivider' />
        <ProCard className='datatenanceCard' ghost title={language('sysmain.mtadat.logimport')}>
          <ProForm className='importForm' {...formleftLayout} autoFocusFirstInput submitter={false} formRef={impoetformRef} >
            <ProFormText name='upload' label={language('sysmain.mtadat.dataimport')}>
              <div className='mtadatupDiv'>
                <WebUploadr isAuto={false} upbutext={upbutext} upurl={upurl} accept={accept} isShowUploadList={isShowUploadList} maxSize={maxSize} maxCount={maxCount} showModal={showModal} isCheck={isCheck} checkFun={deteimport} modalText={modalText} handBtnType='primary' />
              </div>
            </ProFormText>
          </ProForm>
        </ProCard>
      </ProCard>
    </Spin>
  </>);
};
