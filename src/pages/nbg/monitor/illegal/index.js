import React, { useRef, useState, useEffect } from 'react'
import {
  SaveOutlined,
  QuestionCircleOutlined,
  DeleteOutlined,
  EditOutlined,
} from '@ant-design/icons'
import { EditableProTable, ProCard } from '@ant-design/pro-components'
import ProForm, {
  ProFormDigit,
  ProFormRadio,
  ProFormCheckbox,
  ProFormSelect,
  ProFormText
} from '@ant-design/pro-form'
// import EditTable from '@/components/Module/tinyEditTable/tinyEditTable'
import EditTable from '../mapping/components/assetIdentification/editTable'
import { formleftLayout, violationitem } from '@/utils/helper'
import { Button, Row, Col, Popconfirm, message, Tooltip, Form } from 'antd'
import { post, get } from '@/services/https'
import store, { set } from 'store'
import { language } from '@/utils/language'
import '@/utils/index.less'
import styles from './index.less'
import './index.less'
import { regList, regUrlList } from '../../../../utils/regExp'
import { object } from 'prop-types'
import { fetchAuth } from '@/utils/common'
import classNames from 'classnames'

export default () => {
  const writable = fetchAuth()
  /* 校验值是否相等 */
  const isRepeat = (ary) => {
    let hash = {}
    for (var i in ary) {
      if (hash[ary[i]]) {
        return true
      }
      hash[ary[i]] = true
    }
    return false
  }
  const fromcolumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      align: 'center',
      hideInTable: true,
    },
    {
      title: language('project.devname'),
      dataIndex: 'name',
      align: 'center',
      width: '20%',
      ellipsis: true,
      formItemProps: () => {
        return {
          rules: [
            { required: true, message: language('project.mandatory') },
            {
              max: 64,
            },
            {
              pattern: regList.strmax.regex,
              message: regList.strmax.alertText,
            },
            {
              validator: (rule, value) => {
                if (!isSave) {
                  return Promise.reject(language('project.pleasesavedata'))
                } else {
                  return Promise.resolve()
                }
              },
            },
          ],
        }
      },
    },
    {
      title: language('project.monitor.illegal.url'),
      dataIndex: 'url',
      align: 'center',
      width: '30%',
      ellipsis: true,
      formItemProps: (form, {rowKey}) => {
        return {
          rules: [
            {
              required: true,
              message: language('project.mandatory')
            },
            {
              pattern: regUrlList.httptUrl.regex,
              message: regUrlList.httptUrl.alertText,
            },
            {
              max: 255,
            },
            {
              validator: (rule, value) => {
                let list = []
							  dataSource.forEach((item) => {
							    list.push(item?.url)
							  })
							  const dataindex = list.findIndex((item)=>item===value)
							  // setIsEqual(rowKey!==dataSource[dataindex]?.id&&dataindex>=0)
							  if (rowKey!=dataSource[dataindex]?.id&&dataindex>=0) {
							    return Promise.reject(new Error(language('monitor.illegal.urlissame.msg')))
							  } else {
							    return Promise.resolve();
							  }
              },
            },
          ],
        }
      },
    },
    {
      title: language('project.monitor.illegal.jsNum'),
      dataIndex: 'jsNum',
      align: 'center',
      readonly: true,
      width: '20%',
      formItemProps: {
        rules: [
          {
            validator: (rule, value) => {
              if (!isSave) {
                return Promise.reject(language('project.pleasesavedata'))
              } else {
                return Promise.resolve()
              }
            },
          },
        ],
      },
    },
    {
      title: language('project.mconfig.operate'),
      valueType: 'option',
      width: '15%',
      align: 'center',
      render: (text, record, _, action) => [
        <Tooltip placement="top" title={language('project.edit')}>
          <a
            key="editable"
            onClick={moniterUrl ? () => {} : () => {
              action?.startEditable?.(record.id)
            }}
            style={{
              color: moniterUrl ? 'rgba(0,0,0,.25)' : '#1890ff',
              cursor: moniterUrl ? 'not-allowed' : 'pointer',
            }}
          >
            <EditOutlined />
          </a>
        </Tooltip>,
        <Popconfirm
          disabled={showmodal}
          title={language('project.delconfirm')}
          okText={language('project.yes')}
          cancelText={language('project.no')}
          onConfirm={() => {
            setDataSource(dataSource.filter((item) => item.id !== record.id))
          }}
        >
          <Tooltip placement="top" title={language('project.del')}>
            <a
              key="delete"
              style={{
                color: moniterUrl ? 'rgba(0,0,0,.25)' : 'red',
                cursor: moniterUrl ? 'not-allowed' : 'pointer',
              }}
            >
              <DeleteOutlined />
            </a>
          </Tooltip>
        </Popconfirm>,
      ],
    },
  ]

  const formRef = useRef()
  const actionRef = useRef()
  const [editForm] = Form.useForm()
  const [moniterUrl, setMoniterUrl] = useState(false)
  const [showmodal, setShowmodal] = useState(false)
  const [oldCfgName, setOldCfgName] = useState([])
  const [dataSource, setDataSource] = useState([])
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [initialValue, setInitialValue] = useState()
  const [selectdata, setSelectdata] = useState([])
  const [loading, setLoading] = useState(true)
  const [isSave, setIsSave] = useState(true) // 未保存当前数据不可下发
  const [checked, setChecked] = useState(false)
  const [editableKeys, setEditableRowKeys] = useState(() =>
    dataSource.map((item) => item.id)
  ) //每行编辑的id

  useEffect(() => {
    getselect()
  }, [])

  const getFind = (outlineVal) => {
    post('/cfg.php?controller=monitorManage&action=showMonitorCfg')
      .then((res) => {
        if (!res.success) {
          message.error(res.msg)
          return false
        }
        setLoading(false)
        if (res.violaOutline.indexOf('moniterUrl') == '-1') {
          setMoniterUrl(true)
          setShowmodal(true)
        }
        if (res.violaInline.indexOf('inNet') == '-1') {
          setChecked(false)
        } else {
          setChecked(true)
        }
        setDataSource(res.urlList)
        let obj = res
        if (!res.outlineCfgName && outlineVal.length > 0) {
          obj.outlineCfgName = outlineVal[0].value
        } else if (res.outlineCfgName) {
          obj.outlineCfgName = res.outlineCfgName
        } else {
          obj.outlineCfgName = ''
        }
        setOldCfgName(obj.outlineCfgName) /* 修改前的外联配置 */
        formRef.current.setFieldsValue(obj)
      })
      .catch(() => {
        console.log('mistake')
      })
  }

  const getselect = () => {
    post('/cfg.php?controller=monitorManage&action=getOutlineAllCfg')
      .then((res) => {
        setSelectdata(res.data)
        getFind(res.data)
      })
      .catch(() => {
        console.log('mistake')
      })
  }

  const setForm = () => {
    let obj = formRef.current.getFieldsValue([
      'rate',
      'outlineCfgName',
      'violaService',
      'violaInline',
      'violaOutline',
      'timeRange',
      'difference',
      'urlList',
    ])
    setOldCfgName(obj.outlineCfgName) /* 修改前的外联配置 */
    let outlineCfgName = '' /* 修改后的外联配置*/
    selectdata.map((item) => {
      if (item.value == obj.outlineCfgName) {
        outlineCfgName = item.value
      }
    })
    let data = {}
    data.rate = obj.rate
    data.oldCfgName = oldCfgName
    data.outlineCfgName =
      outlineCfgName.length === 0 ? oldCfgName : outlineCfgName
    data.violaService = obj.violaService
    data.violaInline = obj.violaInline
    data.violaOutline = obj.violaOutline
    data.timeRange = obj.timeRange
    data.difference = obj.difference
    data.urlList = dataSource
    post('/cfg.php?controller=monitorManage&action=setMonitorCfg', data)
      .then((res) => {
        if (!res.success) {
          message.error(res.msg)
          return false
        }
        message.success(res.msg)
        getselect()
      })
      .catch(() => {
        console.log('mistake')
      })
  }

  return (
    <div className="illegalContent">
      <ProCard
        className="illegalCard"
        title={language('project.monitor.illegal.cardtitle')}
      >
        <ProForm
          {...formleftLayout}
          initialValue={initialValue}
          className="violform"
          formRef={formRef}
          submitter={{
            render: (props, doms) => {
              return [
                <Row>
                  <Col span={14} offset={6}>
                    <Button
                      type="primary"
                      key="subment"
                      disabled={!writable}
                      style={{
                        marginTop: '20px',
                        paddingLeft: 0,
                        paddingRight: 0,
                        borderRadius: 5,
                        width: '90px',
                        lineHeight: 1.6,
                      }}
                      onClick={() => {
                        if (editForm.getFieldsError().length > 0) {
                          message.error(language('project.enterAndSaveMsg'))
                          return false
                        }
                        let list = []
                        dataSource.map((item, index) => {
                          list.push(item.url)
                        })
                        let isSame = isRepeat(list)
                        if (!isSave) {
                          message.error(language('project.pleasesavedata'))
                          return false
                        } else if (isSame) {
                          message.error(language('monitor.illegal.urlissame.msg'))
                          return false
                        } else {
                          props.submit()
                        }
                      }}
                    >
                      <SaveOutlined />
                      {language('project.set')}
                    </Button>
                  </Col>
                </Row>,
              ]
            },
          }}
          autoFocusFirstInput
          submitTimeout={2000}
          onFinish={async (values) => {
            setForm()
            // return true;
          }}
        >
          <div className="monButton">
            <ProFormRadio.Group
              className="radiobutton"
              name="rate"
              label={language(
                'project.sysconf.illegal.identificationfrequency'
              )}
              // value={scanRateTypeRadio}
              initialValue={0}
              radioType="button"
              options={[
                {
                  label: language('project.sysconf.assetmapping.extremelyslow'),
                  value: 0,
                },
                {
                  label: language('project.sysconf.assetmapping.slow'),
                  value: 1,
                },
                {
                  label: language('project.sysconf.assetmapping.mediumspeed'),
                  value: 2,
                },
                {
                  label: language('project.sysconf.assetmapping.fast'),
                  value: 3,
                },
              ]}
            />
          </div>
          <Col className="rateCol" offset={6}>
            <span className="spanword">
              {language(
                'project.sysconf.assetmapping.differentfrequencybroadband'
              )}
            </span>
          </Col>
          <ProFormSelect
            className="radiobutton"
            width="240px"
            name="outlineCfgName"
            label={language('project.monitor.illegal.outlinecfgname')}
            options={selectdata}
          />
          <div className="violaSerDiv">
            <ProFormCheckbox.Group
              name="violaService"
              id="serve"
              label={language('project.monitor.illegal.lllegalservice')}
              options={[
                { label: 'FTP', value: 'ftp' },
                { label: 'DNS', value: 'dns' },
                { label: 'DHCP', value: 'dhcp' },
                { label: 'REDIS', value: 'redis' },
                { label: 'PROXY', value: 'proxy' },
                { label: 'VNC', value: 'vnc' },
                { label: 'RDP', value: 'rdp' },
                { label: 'HFS', value: 'hfs' },
                {
                  label: language('monitor.illegal.SunLogin'),
                  value: 'SunLogin',
                },
                { label: 'Todesk', value: 'Todesk' },
                { label: 'TeamViewer', value: 'TeamViewer' },
              ]}
            />
          </div>
          <div className="inlinebox">
            <ProFormCheckbox.Group
              name="violaInline"
              {...violationitem}
              className="inline"
              label={language('project.monitor.illegal.inline')}
              onChange={(value) => {
                value.map((item) => {
                  if (item == 'inNet') {
                    setChecked(true)
                  } else {
                    setChecked(false)
                  }
                })
              }}
              options={[
                {
                  label: language('monitor.illegal.multiNic'),
                  value: 'multiNic',
                },
                { label: language('monitor.illegal.ap'), value: 'ap' },
                {
                  label: (
                    <div className={classNames({[styles.numNoError]:!checked})}>
                      <div className="numbox">
                        网中网发现，当&ensp;
                        <ProFormText
                          name="timeRange"
                          width="40px"
                          placeholder=''
                          style={{ marginTop: 10 }}
                          allowClear={false}
                          rules={checked ? [
                            {
                              pattern: regList.onlyNum.regex,
                              message: regList.onlyNum.alertText
                            },
                            {
                              validator:  (rule, value) => {
                                if (Number(value) < 3 || Number(value) > 60) {
                                  return Promise.reject(new Error(language('monitor.illegal.timeRange.msg')))
                                } else {
                                  return Promise.resolve()
                                }
                              }
                            }
                          ] : false}
                        />
                        &ensp;
                        <div
                          style={{
                            marginLeft: 5,
                            marginRight: 5,
                            marginTop: 2,
                          }}
                        >
                          秒{language('project.monitor.illegal.large')}
                        </div>
                        <ProFormText
                          name="difference"
                          className="formnum"
                          placeholder=''
                          allowClear={false}
                          width="60px"
                          min={3}
                          max={65535}
                          rules={checked ? [
                            {
                              pattern: regList.onlyNum.regex,
                              message: regList.onlyNum.alertText
                            },
                            {
                              validator:  (rule, value) => {
                                if (Number(value) < 3 || Number(value) > 65535) {
                                  return Promise.reject(new Error(language('monitor.illegal.difference.msg')))
                                } else {
                                  return Promise.resolve()
                                }
                              }
                            }
                          ] : false}
                        />
                        <div style={{ marginLeft: 5, marginTop: 2 }}>差值</div>
                        <Tooltip
                          title={language('project.monitor.illegal.tooltip')}
                        >
                          <QuestionCircleOutlined
                            style={{ fontSize: 18, marginLeft: 5 }}
                          />
                        </Tooltip>
                      </div>
                    </div>
                  ),
                  value: 'inNet',
                },
              ]}
            />
          </div>
          <div className="violaDiv">
            <ProFormCheckbox.Group
              name="violaOutline"
              onChange={(checked) => {
                if (checked.indexOf('moniterUrl') == '-1') {
                  setMoniterUrl(true)
                  setShowmodal(true)
                } else {
                  setMoniterUrl(false)
                  setShowmodal(false)
                }
              }}
              label={language('project.monitor.illegal.outline')}
              options={[
                {
                  label: language('monitor.illegal.inExtranet'),
                  value: 'inExtranet',
                },
                {
                  label: language('monitor.illegal.documentLeak'),
                  value: 'documentLeak',
                },
                {
                  label: language('monitor.illegal.moniterUrl'),
                  value: 'moniterUrl',
                },
              ]}
            />
          </div>
          <Col span={16} offset={6}>
            <div style={{ marginLeft: 20 }}>
              <EditTable
                setIsSave={setIsSave}
                columns={fromcolumns}
                tableHeight={130}
                tableWidth={500}
                addButPosition="top"
                dataSource={dataSource}
                deleteButShow={false}
                setDataSource={setDataSource}
                addButShow={true}
                addButDisable={moniterUrl}
                editForm={editForm}
              />
            </div>
          </Col>
        </ProForm>
      </ProCard>
    </div>
  )
}
