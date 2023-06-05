import React, { useRef, useState, useEffect } from 'react'
import store from 'store'
import { withI18n } from '@lingui/react'
import { Col, Button, message, Spin } from 'antd'
import { formItemLayout, formleftLayout } from '@/utils/helper'
import './adminset.less'
import styles from './adminset.less'
import '@/utils/index.less'
import {
  ProTable,
  ProFormText,
  ProCard,
  ProFormSelect,
  ProFormDigit,
  ProForm,
  ProFormSwitch,
  ProFormCheckbox,
} from '@ant-design/pro-components'
import WebUploadr from '@/components/Module/webUploadr'
import { get, post } from '@/services/https'
import { language } from '@/utils/language'
import { regList } from '@/utils/regExp'
import { QuestionCircleOutlined, SaveOutlined } from '@ant-design/icons'
import { fetchAuth, valiCompare } from '@/utils/common';
import classNames from 'classnames'

export default () => {
  const writable = fetchAuth()
  const columns = [
    {
      title: language('sysconf.syscert.algm'),
      dataIndex: 'algm',
      width: 80,
      ellipsis: true,
    },
    {
      title: language('sysconf.syscert.issue'),
      dataIndex: 'issuer',
      width: 80,
      ellipsis: true,
    },
    {
      title: language('sysconf.syscert.user'),
      dataIndex: 'subject',
      width: 80,
      ellipsis: true,
    },
    {
      title: language('sysconf.syscert.expire'),
      dataIndex: 'expire',
      width: 140,
      ellipsis: true,
    },
    {
      title: language('project.sysconf.syscert.serial'),
      dataIndex: 'serial',
      width: 100,
      ellipsis: true,
    },
    {
      title: language('project.sysconf.syszone.type'),
      dataIndex: 'type',
      width: 80,
      ellipsis: true,
    },
  ]

  const restrcRef = useRef()
  const paswdRef = useRef()
  const adminCertRef = useRef()
  const [loading, setLoading] = useState(false)
  const [crtList, setCrtList] = useState([])
  const [tableData, setTableData] = useState([])
  const [isOpenPL, setIsOpenPL] = useState(false) // 是否开启密码长度检查
  const maxSize = 10
  const accept = '.pem' // 限制文件上传类型
  const upurl = '/cfg.php?controller=adminSet&action=upload2FACert' // 上传接口
  const isShowUploadList = false // 是否回显文件名与进度条
  const maxCount = 1 // 最大上传文件数量
  const isUpsuccess = true

  const afterUnit = (unit) => {
    return <div className="unitDiv">{unit}</div>
  }

  useEffect(() => {
    getConfig()
  }, [])

  const getConfig = () => {
    setLoading(true)
    post('/cfg.php?controller=adminSet&action=showAdminConf')
      .then((res) => {
        if (!res.success) {
          setLoading(false)
          message.error(res.msg)
          return false
        }
        setLoading(false)
        restrcRef.current?.setFieldsValue(res?.login_control)
        paswdRef.current?.setFieldsValue(res?.admin_pwdctrl)
        let enable = res?.login_2faauth.enable == 'Y' ? true : false
        const crtype = res?.login_2faauth.crtype
        adminCertRef.current?.setFieldsValue({ enable: enable, crtype: crtype })
        let crtData = []
        res?.login_2faauth?.crtlist?.map((item, index) => {
          crtData.push({ label: item.text, value: item.key })
        })
        setCrtList(crtData)
        setTableData(res?.login_2faauth?.rootcrt)
        setIsOpenPL(
          res?.admin_pwdctrl?.length_check == 1 ||
            res?.admin_pwdctrl?.length_check == 'Y' ||
            res?.admin_pwdctrl?.length_check === true
            ? false
            : true
        )
      })
      .catch(() => {
        console.log('mistake')
      })
  }

  const onSuccess = (res) => {
    setTableData(res?.data)
  }

  const setLoginConf = (data) => {
    data.limited = data.limited === true || data.limited == 1 ? 1 : 0
    post('/cfg.php?controller=adminSet&action=setLoginConf', data)
      .then((res) => {
        if (!res.success) {
          message.error(res.msg)
          return false
        }
        message.success(res.msg)
        getConfig()
      })
      .catch(() => {
        console.log('mistake')
      })
  }

  const setPasswdConf = (data) => {
    data.firstmod = data.firstmod === true || data.firstmod == 1 ? 1 : 0
    data.strength = data.strength === true || data.strength == 1 ? 1 : 0
    data.complex_check =
      data.complex_check === true || data.complex_check == 1 ? 1 : 0
    data.length_check =
      data.length_check === true || data.length_check == 1 ? 1 : 0
    post('/cfg.php?controller=adminSet&action=setPasswdConf', data)
      .then((res) => {
        if (!res.success) {
          message.error(res.msg)
          return false
        }
        message.success(res.msg)
        getConfig()
      })
      .catch(() => {
        console.log('mistake')
      })
  }

  const setFAConf = (data) => {
    data.enable = data.enable == 'Y' || data.enable === true ? 'Y' : 'N'
    data.rootcrt = JSON.stringify(tableData)
    post('/cfg.php?controller=adminSet&action=set2FAConf', data)
      .then((res) => {
        if (!res.success) {
          message.error(res.msg)
          return false
        }
        message.success(res.msg)
        getConfig()
      })
      .catch(() => {
        console.log('mistake')
      })
  }

  return (
    <Spin spinning={loading}>
      <ProCard className="adSetCard" ghost direction="column" gutter={[13, 13]}>
        <ProCard title={language('sysconf.adminset.adminlog')}>
          <ProForm
            formRef={restrcRef}
            layout="horizontal"
            autoFocusFirstInput
            submitter={{
              render: (props, doms) => {
                return (
                  <Col offset={6} style={{ marginTop: 15 }}>
                    <Button
                      type="primary"
                      key="subment"
                      style={{ borderRadius: 5 }}
                      onClick={() => {
                        props.submit()
                      }}
                      disabled={!writable}
                      icon={<SaveOutlined />}
                    >
                      {language('project.savesettings')}
                    </Button>
                  </Col>
                )
              },
            }}
            onFinish={async (values) => {
              setLoginConf(values)
            }}
          >
            <ProFormSwitch
              labelCol={{ xs: { span: 8 }, sm: { span: 6 } }}
              wrapperCol={{ xs: { span: 12 }, sm: { span: 10 } }}
              label={language('sysconf.adminset.admin.limited')}
              name="limited"
              checkedChildren={language('project.open')}
              unCheckedChildren={language('project.close')}
            />
            <Col offset={6}>
              <div className="verticalLayout">
                <ProFormDigit
                  label={language('sysconf.adminset.admin.trytimes')}
                  allowClear
                  name="trytimes"
                  width="120px"
                  rules={[
                    {
                      validator: (rule, value, callback) => {
                        valiCompare(value, callback, 3, 15)
                      }
                    }
                  ]}
                  fieldProps={{ precision: 0, controls: false }}
                  addonAfter={afterUnit(
                    language('sysconf.adminset.admin.times')
                  )}
                />
                <ProFormDigit
                  label={language('sysconf.adminset.admin.locktime')}
                  name="locktime"
                  width="120px"
                  addonAfter={afterUnit(
                    language('sysconf.adminset.admin.seconed')
                  )}
                  fieldProps={{ precision: 0, controls: false }}
                  rules={[
                    {
                      validator: (rule, value, callback) => {
                        valiCompare(value, callback, 3, 60)
                      }
                    }
                  ]}
                />
              </div>
            </Col>
            <ProFormText
              labelCol={{ xs: { span: 8 }, sm: { span: 6 } }}
              wrapperCol={{ xs: { span: 12 }, sm: { span: 10 } }}
              label={language('sysconf.adminset.admin.timeout')}
              name="timeout"
              width="120px"
              allowClear={false}
              addonAfter={afterUnit(language('sysconf.adminset.admin.seconed'))}
              rules={[
                {
                  pattern: regList.onlyNum.regex,
                  message: regList.onlyNum.alertText,
                },
                {
                  validator: (rule, value) => {
                    if (!value || value < 0 || value > 1440) {
                      return Promise.reject(new Error(language('sysconf.adminset.timeout.numMsg')))
                    } else {
                      return Promise.resolve()
                    }
                  }
                }
              ]}
            />
          </ProForm>
        </ProCard>
        <ProCard title={language('sysconf.adminset.admin.paswordask')}>
          <ProForm
            formRef={paswdRef}
            {...formleftLayout}
            autoFocusFirstInput
            submitter={{
              render: (props, doms) => {
                return (
                  <Col offset={6} style={{ marginTop: 15 }}>
                    <Button
                      type="primary"
                      key="subment"
                      style={{ borderRadius: 5 }}
                      onClick={() => {
                        props.submit()
                      }}
                      disabled={!writable}
                      icon={<SaveOutlined />}
                    >
                      {language('project.savesettings')}
                    </Button>
                  </Col>
                )
              },
            }}
            onFinish={async (values) => {
              setPasswdConf(values)
            }}
          >
            <ProFormSwitch
              label={language('sysconf.adminset.admin.firstmod')}
              name="firstmod"
              checkedChildren={language('project.open')}
              unCheckedChildren={language('project.close')}
            />
            <ProFormSwitch
              label={language('sysconf.adminset.admin.strength')}
              name="strength"
              checkedChildren={language('project.open')}
              unCheckedChildren={language('project.close')}
            />
            <div className="noLabelDiv">
              <ProFormCheckbox label=" " name="complex_check">
                <>{language('sysconf.adminset.admin.openstrength')}</>
              </ProFormCheckbox>
              <ProFormCheckbox
                label=" "
                name="length_check"
                onChange={(e) => {
                  setIsOpenPL(e.target.checked === true ? false : true)
                }}
              >
                <span className="psdLenghtSpan">
                  {language('sysconf.adminset.admin.psdLenghtSpan')}&ensp;
                  <div className="smallNumInput">
                    <div className={classNames({[styles.numNoError]:isOpenPL})}>
                      <ProFormDigit
                        allowClear
                        name="length_value"
                        width={70}
                        placeholder=" "
                        addonAfter={afterUnit(
                          language('sysconf.adminset.admin.digit')
                        )}
                        disabled={isOpenPL}
                        fieldProps={{ precision: 0, controls: false }}
                        rules={!isOpenPL ? [
                          {
                            validator: (rule, value, callback) => {
                              valiCompare(value, callback, 8, 30)
                            }
                          }
                        ] : false}
                      />
                    </div>
                  </div>
                </span>
              </ProFormCheckbox>
            </div>
            <ProFormText
              label={language('sysconf.adminset.admin.change_period')}
              width="120px"
              name="change_period"
              allowClear={false}
              rules={[
                {
                  pattern: regList.onlyNum.regex,
                  message: regList.onlyNum.alertText,
                },
                {
                  validator: (rule, value) => {
                    if (value === '' || Number(value) < 0 || Number(value) > 90) {
                      return Promise.reject(new Error(language('project.number.minAndMax',{ min: 0, max: 90})))
                    } else {
                      return Promise.resolve()
                    }
                  }
                }
              ]}
              addonAfter={
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    color: '#909399',
                  }}
                >
                  <div className="unitDiv">
                    {language('sysconf.adminset.admin.days')}
                  </div>
                  &ensp;{language('sysconf.adminset.admin.rangedays')}
                </div>
              }
            ></ProFormText>
          </ProForm>
        </ProCard>
        <ProCard title={language('sysconf.adminset.admin.2faauth')}>
          <ProForm
            formRef={adminCertRef}
            {...formleftLayout}
            autoFocusFirstInput
            submitter={{
              render: (props, doms) => {
                return (
                  <Col offset={6} style={{ marginTop: 15 }}>
                    <Button
                      type="primary"
                      key="subment"
                      style={{ borderRadius: 5 }}
                      onClick={() => {
                        props.submit()
                      }}
                      disabled={!writable}
                      icon={<SaveOutlined />}
                    >
                      {language('project.savesettings')}
                    </Button>
                  </Col>
                )
              },
            }}
            onFinish={async (values) => {
              setFAConf(values)
            }}
          >
            <ProFormSwitch
              label={language('sysconf.adminset.admin.certenable')}
              name="enable"
              checkedChildren={language('project.open')}
              unCheckedChildren={language('project.close')}
            />
            <ProFormSelect
              name="crtype"
              width={200}
              label={language('sysconf.adminset.admin.crtype')}
              options={crtList}
              addonAfter={
                <WebUploadr
                  autoBtnType="primary"
                  isAuto={true}
                  upbutext={language('sysconf.adminset.admin.upcert')}
                  upurl={upurl}
                  accept={accept}
                  isShowUploadList={isShowUploadList}
                  maxSize={maxSize}
                  maxCount={maxCount}
                  isUpsuccess={isUpsuccess}
                  onSuccess={onSuccess}
                />
              }
            />
            <ProFormText
              label={language('sysconf.adminset.admin.rootcrt')}
              name="rootcrt"
            >
              <ProTable
                className="adminCertTable"
                size="small"
                columns={columns}
                cardBordered={false}
                rowKey="index"
                dataSource={tableData}
                tableStyle={{ width: 600, maxWidth: 600 }}
                scroll={{ y: 150 }}
                bordered={false}
                search={false}
                options={false}
                pagination={false}
              />
            </ProFormText>
          </ProForm>
        </ProCard>
      </ProCard>
    </Spin>
  )
}
