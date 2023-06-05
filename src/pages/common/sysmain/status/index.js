import React, { useRef, useState, useEffect } from 'react';
import { ProCard } from '@ant-design/pro-components';
import ProForm, { ProFormItem } from '@ant-design/pro-form';
import { formItemLayout, } from '@/utils/helper';
import { language } from '@/utils/language';
import { connect, useDispatch } from 'umi'
import { Row, Col, Button, message, Modal } from 'antd';
import { ExclamationCircleOutlined, UploadOutlined } from '@ant-design/icons';
import { post, get } from '@/services/https';
import { regList, regIpList } from '@/utils/regExp';
import '@/utils/index.less';
import './index.less';
import WebUploadr from '@/components/Module/webUploadr';
const { confirm } = Modal;

const SystemState = () => {
  // 100m 10m 100k  
  const formRef = useRef();
  const authformRef = useRef();
  const dispatch = useDispatch();
  const [fileList, setFileList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [prdinfodata, setPrdinfodata] = useState({});
  const [licinfodata, setLicinfodata] = useState({});
  const [msgtext, setMsgtext] = useState('')
  const [confirmLoading, setConfirmLoading] = useState(false)

  const onSuccess = (res) => {
    if(res.success) {
      setIsModalVisible(true);
      setMsgtext(res.msg);
    } else {
      Modal.warning({
        className: 'upwarningmda',
        title: language('project.title'),
        content: res.msg,
        okText: language('project.determine'),
      })
    }
  }

  useEffect(() => {
    getData()
  }, [])

  const getData = () => {
    post('/cfg.php?controller=sys&action=showSystemState',).then((res) => {
      if(res.success) {
        setPrdinfodata(res.prdInfo)
        setLicinfodata(res.licInfo)
      } else {
      }
    })
  }

  const handleOk = () => {
    setConfirmLoading(true)
    post('/cfg.php?controller=sys&action=licenseUpdate', {}).then((res) => {
      if(res.success) {
        message.success(res.msg)
        setTimeout(() => {
          setConfirmLoading(false);
          setIsModalVisible(false);
          dispatch({ type: 'app/signOut' })
        }, 2000);
      } else {
        message.error(res.msg)
      }
    })
  }

  //关机，重启
  const clickButQt = (id) => {
    let title = '';
    if(id == 1) {
      title = language('sysmain.ststus.shutdownmtext')
    } else if(id == 2) {
      title = language('sysmain.ststus.restartmtext')
    }
    confirm({
      className: 'statustitle',
      title: language('sysmain.ststus.info'),
      icon: <ExclamationCircleOutlined />,
      content: title,
      onOk() {
        onSelectChange(id)
      },
      onCancel() { },
    })
  }

  const onSelectChange = (id) => {
    if(id == 1) {
      get('/admin/cfg.php').then((res) => { })
    } else if(id == 2) {
      get('/systemmanage/maintain_operation?operation=shutdown').then((res) => { })
    }
  }

  const isAuto = true;
  const upbutext = language('sysmain.ststus.uploadauth');
  const maxSize = 1;
  const accept = '.lic';
  const upurl = '/cfg.php?controller=sys&action=licenseUpload';
  const isShowUploadList = false; // 是否回显文件名与进度条
  const maxCount = 1;
  const isUpsuccess = true;

  return (<>
    <ProCard ghost direction='column' gutter={[13, 13]}>
      <ProCard title={language('sysmain.ststus.produinfo')}>
        <ProForm {...formItemLayout} formRef={formRef} className='produform' autoFocusFirstInput submitter={false}>
          <ProFormItem label={language('sysmain.ststus.pmodel')}>{prdinfodata.pmodel}</ProFormItem>
          <ProFormItem label={language('sysmain.ststus.hwuuid')}>{prdinfodata.hwuuid}</ProFormItem>
          <ProFormItem label={language('sysmain.ststus.uptime')}>{prdinfodata.uptime}</ProFormItem>
          <ProFormItem label={language('sysmain.ststus.hwinfo')}>{prdinfodata.hwinfo}</ProFormItem>
        </ProForm>
      </ProCard>
      <ProCard title={language('sysmain.ststus.authoinfo')}>
        <ProForm {...formItemLayout} formRef={authformRef} className='authform' autoFocusFirstInput submitter={false}>
          <ProFormItem label={language('sysmain.ststus.serial')}>{licinfodata.serial}</ProFormItem>
          <ProFormItem label={language('sysmain.ststus.authstatus')}>{licinfodata.status}</ProFormItem>
          <ProFormItem label={language('sysmain.ststus.ahzusr')}>{licinfodata.ahzusr}</ProFormItem>
          <ProFormItem label={language('sysmain.ststus.lictype')}>{licinfodata.lic_type}</ProFormItem>
          <ProFormItem label={language('sysmain.ststus.useexpi')}>{licinfodata.use_expi}</ProFormItem>
          <ProFormItem label={language('sysmain.ststus.svrexpi')}>{licinfodata.svr_expi}</ProFormItem>
          <ProFormItem label={language('sysmain.ststus.svrtele')}>{licinfodata.svr_tele}</ProFormItem>
          <ProFormItem label={language('sysmain.ststus.uploadauth')}>
            <div className='statusupDiv'>
              <WebUploadr isUpsuccess={isUpsuccess} isAuto={isAuto} upbutext={upbutext} maxSize={maxSize} accept={accept} upurl={upurl} onSuccess={onSuccess} isShowUploadList={isShowUploadList} maxCount={maxCount} />
            </div>
          </ProFormItem>
        </ProForm>
      </ProCard>
      {/* <ProCard title={language('sysmain.ststus.sysopertion')}>
        <Row>
          <Col offset={6}>
            <Button type="primary" style={{ marginRight: '30px' }} onClick={() => {
              clickButQt(2)
            }}>
              {language('sysmain.ststus.shutdown')}
            </Button>
            <Button type="primary" style={{ marginRight: '15px' }}onClick={() => {
              clickButQt(1)
            }}>
              {language('sysmain.ststus.restart')}
            </Button>
          </Col>
        </Row>
      </ProCard> */}
      <Modal title={language('sysmain.ststus.isauth')}
        visible={isModalVisible}
        confirmLoading={confirmLoading}
        className='statusisauth'
        onOk={handleOk}
        onCancel={() => {
          setIsModalVisible(false)
        }}
        maskClosable={false}
        keyboard={false}>
        <p>{msgtext}</p>
      </Modal>
    </ProCard>
  </>)
}
export default SystemState;
