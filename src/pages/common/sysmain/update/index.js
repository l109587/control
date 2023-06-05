import React, { useRef, useState, useEffect, } from 'react';
import { ProCard, ProDescriptions } from '@ant-design/pro-components';
import ProForm, { ProFormItem } from '@ant-design/pro-form';
import { formItemLayout, } from '@/utils/helper';
import { connect, useDispatch } from 'umi'
import { language } from '@/utils/language';
import { Divider, Col, Button, message, Progress, Spin, Modal } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { post, postAsync } from '@/services/https';
import { regList, regIpList } from '@/utils/regExp';
import '@/utils/index.less';
import './index.less';
import WebUploadr from '@/components/Module/webUploadr';

const Upgrade = () => {
  const formRef = useRef();
  const dispatch = useDispatch()
  const [loading, setLoading] = useState('');
  const [fileList, setFileList] = useState([]);
  const [percent, setPercent] = useState(0);
  const [svrexpired, setSvrexpired] = useState(0);
  const [version, setVersion] = useState('');
  const [builder, setBuilder] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [ismsgVisible, setIsmsgVisible] = useState(false)
  const [msgtext, setMsgtext] = useState('')

  useEffect(() => {
    getData()
  }, [])

  const getData = () => {
    let data = {
      key: 'system',
    }
    post('/cfg.php?controller=sys&action=showSystemVersion', data).then((res) => {
      if(res.success) {
        setVersion(res.version)
        setBuilder(res.builder)
      } else {
      }
    })
  }

  const handleCancel = () => {
    setIsModalVisible(false);
    setPercent(0)
  }
  const handleOk = () => {
    setIsModalVisible(false);
    setIsmsgVisible(true)
    setPercent(0)
  }
  const msgmodalCancel = () => {
    setIsmsgVisible(false)
    setPercent(0)
  }
  const msgmodalOk = () => {
    post('/cfg.php?controller=sys&action=systemUpdate', {}).then((res) => {
      if(res.success) {
        message.success(res.msg)
        setIsmsgVisible(false)
      } else {
      }
    })
    setLoading(true)
    setIsmsgVisible(false)
    setTimeout(function () {
      checkRebootFinish()
    }, 2000)
  }

  let timer = ''
  const checkRebootFinish = () => {
    timer = setInterval(() => {
      post('/cfg.php?controller=sys&action=checkRebootFinish', {}).then(
        (res) => {
          if(res.success) {
            setLoading(false)
            clearInterval(timer)
            // dispatch({ type: 'app/signOut' })
          } else {
          }
        }
      )
    }, 2000)
  }

  const isAuto = true;
  const upbutext = language('project.upload');
  const maxSize = 300;
  const accept = '.tgz, .tar, .zip';
  const upurl = '/cfg.php?controller=sys&action=systemUpload';
  const isShowUploadList = true;
  const maxCount = 1;
  const isUpsuccess = true;

  const onSuccess = (res) => {
    if(res.success) {
      setIsModalVisible(true);
      setMsgtext(res.msg);
      setPercent(0);
    } else {
      setPercent(0);
      Modal.warning({
        className: 'upwarningmda',
        title: language('project.title'),
        content: res.msg,
        okText: language('project.determine'),
      })
    }
  }

  return (<>
    {loading == true ? (
      <div className='Spin_div'>
        <Spin
          spinning={loading}
          size="large"
          style={{ position: "absolute", zIndex: '100', left: '50%', top: '40%', fontSize: '24px' }}
          tip={language('sysmain.update.loadingtip')}
        />
      </div>
    ) : (
      ''
    )}
    <ProCard title={language('sysmain.update.cardtitle')}>
      <ProForm formRef={formRef} {...formItemLayout} autoFocusFirstInput
        submitter={false}>
        <ProFormItem label={language('sysmain.update.sysversion')}>{version ? version : ''}</ProFormItem>
        <ProFormItem label={language('sysmain.update.produversion')}>{builder ? builder : ''}</ProFormItem>
        <ProFormItem label={language('sysmain.update.sysversion')}>
          <div className='sysupDiv'>
            <WebUploadr isUpsuccess={isUpsuccess} isAuto={isAuto} upbutext={upbutext} maxSize={maxSize} accept={accept} upurl={upurl} onSuccess={onSuccess} isShowUploadList={isShowUploadList} maxCount={maxCount} />
          </div>
        </ProFormItem>
      </ProForm>
      <Modal
        className='upmodal'
        title={language('sysmain.update.upgrade')}
        visible={isModalVisible}
        onOk={() => { handleOk() }}
        onCancel={() => { handleCancel() }}
        maskClosable={false}
        keyboard={false}
      >
        <p>{msgtext}</p>
      </Modal>
      <Modal
        className='messagemodal'
        title={language('project.title')}
        visible={ismsgVisible}
        onOk={() => { msgmodalOk() }}
        onCancel={() => { msgmodalCancel() }}
        maskClosable={false}
        keyboard={false}
      >
        <p>{language('sysmain.update.upgrademodaltext')}</p>
      </Modal>
    </ProCard>
  </>)
}
export default Upgrade;
