import React, { useRef, useState, useEffect } from 'react'
import {
  Button,
  Col,
  Input,
  Alert,
  message,
  Form,
  Popconfirm,
  Tooltip,
  Space,
} from 'antd'
import ProForm, {
  ProFormSwitch,
  ProFormCheckbox,
  ProFormRadio,
  ProFormText,
} from '@ant-design/pro-form'
import { ProCard } from '@ant-design/pro-components'
import { language } from '@/utils/language'
import { formleftLayout } from '@/utils/helper'
import { post, get } from '@/services/https'
import { regPortList, regIpList } from '@/utils/regExp'
import { fetchAuth } from '@/utils/common'
import {
  SaveOutlined,
  DeleteOutlined,
  EditOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons'
// import EditTable from '@/components/Module/tinyEditTable/tinyEditTable';
import EditTable from '../mapping/components/assetIdentification/editTable'
import './riskperce.less'

export default () => {
  const writable = fetchAuth()
  const fromcolumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      align: 'center',
      hideInTable: true,
    },
    {
      title: language('monitor.riskperce.addr'),
      dataIndex: 'addr',
      align: 'center',
      width: '70%,',
      formItemProps: (form, { rowIndex }) => {
        return {
          rules: [
            {
              required: true,
              message: language('project.mandatory'),
            },
            {
              validator: (rule, value) => {
                // 自定义函数校验
                let list = []
                dataSource?.forEach((item) => {
                  list.push(item?.addr)
                })
                list.push(value)
                let isSame = isRepeat(list)
                setIsEqual(isSame)
                if (isSame) {
                  return Promise.reject(language('monitor.riskperce.ipissame'))
                } else if (!isSave) {
                  // 判断当前数据是否已保存
                  return Promise.reject(language('project.pleasesavedata'))
                } else {
                  return Promise.resolve()
                }
              },
            },
            {
              pattern: regIpList.singleipv4Mask.regex,
              message: regIpList.singleipv4Mask.alertText,
            },
          ],
        }
      },
    },
    {
      title: language('project.mconfig.operate'),
      valueType: 'option',
      width: '25%',
      align: 'center',
      render: (text, record, _, action) => [
        <Tooltip placement="top" title={language('project.edit')}>
          <a
            key="editable"
            onClick={() => {
              setIsSave && setIsSave(false)
              if (!delButDis) {
                action?.startEditable?.(record.id)
              } else {
              }
            }}
          >
            <EditOutlined
              style={{
                color: delButDis ? 'rgba(0,0,0,.25)' : '#1890ff',
                cursor: delButDis ? 'not-allowed' : 'pointer',
              }}
            />
          </a>
        </Tooltip>,
        <Popconfirm
          disabled={delButDis}
          title={language('project.delconfirm')}
          okText={language('project.yes')}
          cancelText={language('project.no')}
          onConfirm={() => {
            setDataSource(dataSource.filter((item) => item.id !== record.id))
          }}
        >
          <Tooltip placement="top" title={language('project.del')}>
            <a key="delete">
              <DeleteOutlined
                style={{
                  color: delButDis ? 'rgba(0,0,0,.25)' : 'red',
                  cursor: delButDis ? 'not-allowed' : 'pointer',
                }}
              />
            </a>
          </Tooltip>
        </Popconfirm>,
      ],
    },
  ]

  const formRef = useRef()
  const [editForm] = Form.useForm()
  const [isDisabled, setIsDisabled] = useState(false)
  const [dataSource, setDataSource] = useState([])
  const [addButDis, setAddButDis] = useState(false)
  const [delButDis, setDelButDis] = useState(false)
  const [isSave, setIsSave] = useState(true)
  const [isSubmit, setIsSubmit] = useState('')
  const [isEqual, setIsEqual] = useState('')

  useEffect(() => {
    getPerceConf()
  }, [])

  /* 获取数据 */
  const getPerceConf = () => {
    post('/cfg.php?controller=assetMapping&action=showRiskPercepCfg')
      .then((res) => {
        if (!res.success) {
          message.error(res.msg)
          return false
        }
        if (res.assetRange == '0') {
          setAddButDis(true)
          setDelButDis(true)
        }
        if (res.detectInfo.indexOf('port') == -1) {
          setIsDisabled(true)
        }
        let initValue = res
        let checked = false
        if (res.switch == 'Y') {
          checked = true
        }
        initValue.switch = checked
        let ipRangeArr = []
        let rowKey = []
        if (res.ipRange.length > 0) {
          res.ipRange.map((item, index) => {
            ipRangeArr.push({ id: index + 1, addr: item })
            rowKey.push(index + 1)
          })
          setDataSource(ipRangeArr)
        }
        formRef.current.setFieldsValue(initValue)
      })
      .catch(() => {
        console.log('mistake')
      })
  }

  /* 下发数据 */
  const setPerceConf = () => {
    let initVal = formRef.current.getFieldsValue([
      'switch',
      'detectInfo',
      'denyPorts',
      'assetRange',
      'ipRange',
    ])
    let data = {}
    data.switch = initVal.switch ? 'Y' : 'N'
    data.detectInfo = initVal.detectInfo
    data.denyPorts = initVal.denyPorts
    data.assetRange = initVal.assetRange
    if (dataSource && dataSource.length > 0) {
      let ipRange = []
      dataSource.map((item) => {
        ipRange.push(item.addr)
      })
      data.ipRange = ipRange.join(';')
    } else {
      data.ipRange = ''
    }
    post('/cfg.php?controller=assetMapping&action=setRiskPercepCfg', data)
      .then((res) => {
        if (!res.success) {
          message.error(res.msg)
          return false
        }
        message.success(res.msg)
      })
      .catch(() => {
        console.log('mistake')
      })
  }

  /* 判断新值与旧值是否相同 */
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

  return (
    <ProCard
      className="riskperceDiv"
      title={language('monitor.riskperce.cardTitle')}
    >
      <ProForm
        className="riskperceForm"
        {...formleftLayout}
        formRef={formRef}
        autoFocusFirstInput
        submittimeout={2000}
        submitter={{
          render: (props, doms) => {
            return [
              <Col offset={6}>
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
                    lineHeight: 1.5,
                  }}
                  onClick={() => {
                    if (editForm.getFieldsError().length > 0) {
                      message.error(language('project.enterAndSaveMsg'))
                      return false
                    }
                    if (isEqual) {
                      message.error(language('monitor.riskperce.isSametext'))
                    } else if (!isSave) {
                      message.error(language('project.pleasesavedata'))
                    } else {
                      setIsSubmit('finish')
                      formRef.current.submit()
                    }
                  }}
                >
                  <SaveOutlined />
                  {language('project.set')}
                </Button>
              </Col>,
            ]
          },
        }}
        onFinish={(values) => {
          if (isSubmit == 'finish') {
            setPerceConf()
          }
        }}
      >
        <ProFormSwitch
          name="switch"
          label={language('monitor.riskperce.riskperceswitch')}
          addonAfter={
            <div style={{ marginBottom: -3 }}>
              {language('monitor.riskperce.riskpertext')}
            </div>
          }
          checkedChildren={language('project.open')}
          unCheckedChildren={language('project.close')}
        />
        <ProFormCheckbox.Group
          name="detectInfo"
          label={language('monitor.riskperce.detectInfo')}
          options={[
            {
              label: language('monitor.riskperce.detectInfo.weakPass'),
              value: 'weakPass',
            },
            {
              label: language('monitor.riskperce.detectInfo.vul'),
              value: 'vul',
            },
            // { label: language('monitor.riskperce.detectInfo.soft'), value: 'soft' },
            {
              label: language('monitor.riskperce.detectInfo.port'),
              value: 'port',
            },
          ]}
          onChange={(key) => {
            if (key.indexOf('port') == -1) {
              setIsDisabled(true)
            } else {
              setIsDisabled(false)
            }
          }}
        />
        <Col
          className={
            isDisabled == false ? 'denyPortsDiv' : 'denyPortsDiv nopmsgDiv'
          }
          offset={6}
        >
          <Space>
            <div className="noopenDiv">
              {language('monitor.riskperce.noopenport')}
            </div>
            <ProFormText
              name="denyPorts"
              disabled={isDisabled}
              width="180px"
              addonAfter={
                <Tooltip title={language('monitor.riskperce.denyPortsMsg')}>
                  <QuestionCircleOutlined
                    style={{ fontSize: 18, marginTop: 3 }}
                  />
                </Tooltip>
              }
              rules={
                isDisabled == true
                  ? false
                  : [
                      {
                        pattern: regPortList.Uports.regex,
                        message: regPortList.Uports.alertText,
                      },
                      {
                        required: isDisabled == true ? false : true,
                        message: language('project.mandatory'),
                      },
                    ]
              }
            />
          </Space>
        </Col>
        <ProFormRadio.Group
          name="assetRange"
          label={language('monitor.riskperce.assetRange')}
          options={[
            {
              label: language('monitor.riskperce.assetRange.scope'),
              value: '0',
            },
            {
              label: language('monitor.riskperce.assetRange.speciscope'),
              value: '1',
            },
          ]}
          onChange={(key) => {
            if (key.target.value == '0') {
              setAddButDis(true)
              setDelButDis(true)
            } else {
              setAddButDis(false)
              setDelButDis(false)
            }
          }}
        />
        <Col offset={6}>
          <div style={{ marginLeft: 24 }}>
            <EditTable
              columns={fromcolumns}
              tableHeight={130}
              tableWidth={400}
              addButPosition="bottom"
              deleteButShow={false}
              dataSource={dataSource}
              setDataSource={setDataSource}
              addButDisable={addButDis}
              setIsSave={setIsSave}
              editForm={editForm}
            />
          </div>
        </Col>
      </ProForm>
    </ProCard>
  )
}
