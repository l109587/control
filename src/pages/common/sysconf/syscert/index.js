import React, { useRef, useState, useEffect } from 'react'
import { formleftLayout, formfieldTable } from '@/utils/helper'
import ProForm, { ProFormItem, ProFormText } from '@ant-design/pro-form'
import { ProCard, ProTable } from '@ant-design/pro-components'
import { language } from '@/utils/language'
import { connect, useDispatch } from 'umi'
import { Button, Row, Col, Modal, message, Spin, Alert, Space } from 'antd'
import WebUploadr from '@/components/Module/webUploadr'
import { post, postAsync } from '@/services/https'
import './syscert.less'
import { QuestionCircleFilled, StarOutlined } from '@ant-design/icons'
import { GrCertificate } from 'react-icons/gr'
import { MdStars } from 'react-icons/md'
import { Certificate } from '@icon-park/react'
const { confirm } = Modal
import { fetchAuth } from '@/utils/common';

let clientHeight = document.body.clientHeight - 2400

export default () => {
  const writable = fetchAuth()
  const columns = [
    {
      title: language('sysconf.syscert.algm'),
      dataIndex: 'algm',
      align: 'left',
      width: 50,
      ellipsis: true,
    },
    {
      title: language('project.sysconf.syscert.issuer'),
      dataIndex: 'issuer',
      align: 'left',
      width: 100,
      ellipsis: true,
    },
    {
      title: language('project.sysconf.syscert.subject'),
      dataIndex: 'subject',
      align: 'left',
      width: 120,
      ellipsis: true,
    },
    {
      title: language('project.sysconf.syscert.expire'),
      dataIndex: 'expire',
      align: 'left',
      width: 110,
      ellipsis: true,
    },
    {
      title: language('project.sysconf.syscert.serial'),
      dataIndex: 'serial',
      align: 'left',
      width: 220,
      ellipsis: true,
    },
    {
      title: language('project.sysconf.syszone.type'),
      dataIndex: 'type',
      align: 'left',
      width: 80,
      ellipsis: true,
    },
  ]

  const formRef = useRef()
  const [certData, setCertData] = useState([])
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()

  const isAuto = true
  const upbutext = language('sysconf.syscert.upbutext')
  const upurl = '/cfg.php?controller=sysDeploy&action=uploadSysCert' // 接口
  const accept = '.zip'
  const isShowUploadList = true
  const maxSize = 1
  const maxCount = 1
  const isUpsuccess = true
  const isIcon = true

  useEffect(() => {
    setLoading(true)
    getData()
  }, [])

  const getData = () => {
    setLoading(true)
    post('/cfg.php?controller=sysDeploy&action=showSysCert')
      .then((res) => {
        if (!res.success) {
          message.error(res.msg)
          return false
        }
        setCertData(res.data)
        setLoading(false)
      })
      .catch(() => {
        console.log('mistake')
      })
  }

  const onSuccess = (res) => {
    setLoading(true)
    if (res.success) {
      setTimeout(() => {
        setLoading(false)
        setCertData(res.data)
      }, 1500);
    } else {
      setLoading(false)
      message.error(res.msg)
    }
  }

  const handleAck = (val) => {
    post('/cfg.php?controller=sysDeploy&action=setSysCert', { opcode: val })
      .then((res) => {
        if (!res.success) {
          message.error(res.msg)
        } else {
          message.success(res.msg)
        }
        setTimeout(() => {
          dispatch({ type: 'app/signOut' })
        }, 3100);
      })
      .catch(() => {
        console.log('mistake')
      })
  }

  const showRecvModal = () => {
    confirm({
      className: 'certackModal',
      icon: <QuestionCircleFilled />,
      title: language('sysconf.syscert.recvModalTitle'),
      content: language('sysconf.syscert.recvModalContent'),
      okText: language('project.mconfig.devices.ok'),
      cancelText: language('project.mconfig.devices.cancel'),
      onOk() {
        return new Promise((resolve, reject) => {
          handleAck('recover')
          setTimeout(Math.random() > 0.5 ? resolve : reject, 3000)
        }).catch(() => {})
      },
    })
  }

  const showUseModal = () => {
    confirm({
      className: 'certackModal',
      icon: <QuestionCircleFilled />,
      title: language('sysconf.syscert.useModalTitle'),
      content: language('sysconf.syscert.useModalContent'),
      okText: language('project.mconfig.devices.ok'),
      cancelText: language('project.mconfig.devices.cancel'),
      onOk() {
        return new Promise((resolve, reject) => {
          handleAck('replace')
          setTimeout(Math.random() > 0.5 ? resolve : reject, 3000)
        }).catch(() => {})
      },
    })
  }

  return (
    <ProCard
      className="syscertCard"
      title={language('sysconf.syscert.certconf')}
    >
      <div className="msgDiv">
        <Col className="certMsgCol" span={10} offset={5}>
          <Alert
            className="certAlert"
            showIcon
            type="warning"
            message={language('sysconf.syscert.msgTitle')}
            description={
              <div>
                <div>
                  <MdStars className="statIcon" />
                  {language('sysconf.syscert.firstalertext')}
                </div>
                <div>
                  <MdStars className="statIcon" />
                  {language('sysconf.syscert.secondalertext')}
                </div>
                <div>
                  <MdStars className="statIcon" />
                  {language('sysconf.syscert.thirdalertext')}
                </div>
              </div>
            }
          />
        </Col>
      </div>
      <ProForm
        className="syscertForm"
        {...formleftLayout}
        formRef={formRef}
        autoFocusFirstInput
        submitTimeout={2000}
        submitter={{
          render: (props, doms) => {
            return [
              <Row>
                <Col offset={6}>
                  <Space>
                    <Button
                      type="primary"
                      className="certRecovBut"
                      icon={
                        <i className="ri-device-recover-fill certRecovIcon" />
                      }
                      disabled={!writable}
                      onClick={showRecvModal}
                    >
                      <span className="certRecovText">
                        {language('sysconf.syscert.certRecovText')}
                      </span>
                    </Button>
                    <Button
                      type="danger"
                      className="useCertButton"
                      onClick={showUseModal}
                      disabled={!writable}
                    >
                      <p className="certIconDiv">
                        <Certificate
                          className="certIcon"
                          theme="outline"
                          size="16"
                        />
                      </p>
                      <span className="useCertButText">
                        {language('sysconf.syscert.useCertButText')}
                      </span>
                    </Button>
                  </Space>
                </Col>
              </Row>,
            ]
          },
        }}
        onFinish={async (values) => {}}
      >
        <ProFormText label={language('sysconf.syscert.uploadcert')}>
          <div className="certimpDiv" key={Math.random()}>
            <WebUploadr
              isAuto={isAuto}
              upbutext={upbutext}
              upurl={upurl}
              accept={accept}
              isShowUploadList={isShowUploadList}
              maxSize={maxSize}
              maxCount={maxCount}
              isUpsuccess={isUpsuccess}
              onSuccess={onSuccess}
              isIcon={isIcon}
            />
          </div>
        </ProFormText>
        <ProFormItem
          label={language('sysconf.syscert.certInfo')}
          name="data"
          wrapperCol={{
            xs: { span: 14 },
            sm: { span: 14 },
          }}
        >
          <ProTable
            className="certTable"
            size="small"
            rowKey="index"
            bordered={true}
            columns={columns}
            loading={loading}
            dataSource={certData}
            search={false}
            options={false}
            pagination={false}
          />
        </ProFormItem>
      </ProForm>
    </ProCard>
  )
}
