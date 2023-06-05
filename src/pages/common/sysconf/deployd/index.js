import React, { useRef, useState, useEffect } from 'react'
import { formleftLayout } from '@/utils/helper'
import {
  EditableProTable,
  ProForm,
  ProFormText,
  ProFormSelect,
  ProCard,
  ProDescriptions,
  ProTable,
} from '@ant-design/pro-components'
import {
  SaveOutlined,
  EditOutlined,
  DeleteOutlined,
  SaveFilled,
  TrademarkOutlined,
  UploadOutlined,
} from '@ant-design/icons'
import { post, postAsync } from '@/services/https'
import {
  Button,
  Row,
  Col,
  message,
  Checkbox,
  Spin,
  Popconfirm,
  Space,
  Tag,
  Tooltip,
} from 'antd'
import classNames from 'classnames'
import { language } from '@/utils/language'
import styles from './index.less'
import WebUploadr from '@/components/Module/webUploadr'
import EditTable from '@/components/Module/tinyEditTable/tinyEditTable'
import { regIpList } from '@/utils/regExp'
import { fetchAuth } from '@/utils/common';
import { regList } from '../../../../utils/regExp'

export default function Deployd() {
  const writable = fetchAuth()
  const [regStatus, setRegStatus] = useState('') //注册状态
  const [deviceID, setDeviceID] = useState(0) //注册状态
  const [certStatus, setCertStatus] = useState(false) //是否启用证书
  const [regDataSource, setDateSource] = useState([]) //注册表格
  const [regReason, setRegReason] = useState('') //拒绝愿因
  const [color, setColor] = useState('#C8C6C6') //注tag颜色
  const [regButLoading, setRegButLoading] = useState(false) //注册按钮loading状态
  const [dataSource, setDataSource] = useState([]) //可编辑表格数据
  const [pageContent, setPageContent] = useState([]) //注册信息页面显示内容
  const deployFormRef = useRef()
  const registFormRef = useRef()

  useEffect(() => {
    fetchDepartment()
    fetchRegistPageContent()
    fetchDevRegist()
  }, [])

  const fetchRegistPageContent = () => {
    post('/cfg.php?controller=sysDeploy&action=getRegistPageContent').then(
      (res) => {
        if (res.success) {
          setPageContent(res.data)
        }
      }
    )
  }

  const fetchDepartment = () => {
    post('/cfg.php?controller=sysDeploy&action=showDepartment').then((res) => {
      if (res.success) {
        const newData = { ...res }
        newData?.contacts?.forEach((item, index, arr) => {
          arr[index] = { ...item, id: (Math.random() * 1000000).toFixed(0) }
        })
        setDataSource(res.contacts)
        res.contacts = []
        deployFormRef.current.setFieldsValue(res)
      }
    })
  }
  const fetchDevRegist = () => {
    post('/cfg.php?controller=sysDeploy&action=showDevRegist').then((res) => {
      if (res.success) {
        const { regStatus, cert, regReason, deviceID,crtStatus } = res
        registFormRef.current.setFieldsValue(res)
        setDeviceID(deviceID)
        setRegStatus(regStatus?.text||'')
        setColor(regStatus?.color||'')
        setDateSource(cert)
        setRegReason(regReason)
        setCertStatus(crtStatus=='Y'?true:false)
      }
    })
  }
  const saveConfig = () => {
    const datas = deployFormRef.current.getFieldsValue(true)
    const { company, govcode, location } = datas
    dataSource.forEach((item) => {
      delete item.id
    })
    const params = {
      company: company,
      govcode: govcode,
      location: location,
      contacts: JSON.stringify(dataSource),
    }
    post('/cfg.php?controller=sysDeploy&action=setDepartment', params).then(
      (res) => {
        if (res.success) {
          res.msg && message.success(res.msg)
        } else {
          res.msg && message.error(res.msg)
        }
      }
    )
  }
  const setRegist = (values) => {
    setRegButLoading(true)
    const datas = { certStatus: certStatus ? 'Y' : 'N', ...values }
    post('/cfg.php?controller=sysDeploy&action=setDevRegist', datas).then(
      (res) => {
        if (res.success) {
          res.msg && message.success(res.msg)
          setRegButLoading(false)
        } else {
          res.msg && message.error(res.msg)
          setRegButLoading(false)
        }
      }
    )
  }
  const setChecked = (e) => {
    setCertStatus(e.target.checked)
  }

  // const checkSymbols = (value, callback) => {
  //   let symbols = ['!', '@','~', '`', '#', '.', '#', '$', '%', '^', '&', '*', '(', ')', '-', '_', '=', '+', ';', ':', '|', '[', ']', '{', '}', '<', ]
  // }

  const columns = [
    {
      title: language('project.sysconf.syscert.name'),
      dataIndex: 'name',
      width: 120,
      ellipsis: true,
      formItemProps: (form, { rowIndex }) => {
        return {
          rules: [
            {
              required: true,
              message: language('project.sysconf.syscert.required'),
            },
            {
              pattern: regList.chWordNum.regex,
              message: regList.chWordNum.alertText,
            }
          ],
        }
      },
    },
    {
      title: language('project.sysconf.syscert.position'),
      dataIndex: 'position',
      width: 120,
      ellipsis: true,
      formItemProps: () => {
        return {
          rules: [
            {
              required: true,
              message: language('project.sysconf.syscert.required'),
            },
            {
              pattern: regList.chWordNum.regex,
              message: regList.chWordNum.alertText,
            }
          ],
        }
      },
    },
    {
      title: language('project.sysconf.syscert.email'),
      dataIndex: 'email',
      width: 200,
      ellipsis: true,
      formItemProps: () => {
        return {
          rules: [
            {
              required: true,
              message: language('project.sysconf.syscert.required'),
            },
            {
              pattern: regList.strictEmail.regex,
              message: regList.strictEmail.alertText
            }
          ],
        }
      },
    },
    {
      title: language('project.sysconf.syscert.telephone'),
      dataIndex: 'phone',
      width: 140,
      ellipsis: true,
      formItemProps: () => {
        return {
          rules: [
            {
              required: true,
              message: language('project.sysconf.syscert.required'),
            },
            {
              pattern: regList.phone.regex,
              message: regList.phone.alertText,
            }
          ],
        }
      },
    },
    {
      title: language('project.operate'),
      valueType: 'option',
      width: 120,
      align: 'center',
      render: (text, record, _, action) => [
        <Tooltip
          placement="top"
          title={language('project.sysconf.syscert.edit')}
        >
          <a
            key="editable"
            onClick={() => {
              action?.startEditable?.(record.id)
            }}
          >
            <EditOutlined />
          </a>
        </Tooltip>,
        <Popconfirm
          title={language('project.sysconf.syscert.deleteTitle')}
          okText={language('project.sysconf.syscert.okText')}
          cancelText={language('project.sysconf.syscert.cancelText')}
          onConfirm={() => {
            setDataSource(dataSource.filter((item) => item.id !== record.id))
          }}
        >
          <Tooltip
            placement="top"
            title={language('project.sysconf.syscert.delete')}
          >
            <a key="delete" style={{ color: 'red' }}>
              <DeleteOutlined />
            </a>
          </Tooltip>
        </Popconfirm>,
      ],
    },
  ]
  const regColumns = [
    {
      title: language('project.sysconf.syscert.issuer'),
      dataIndex: 'issuer',
      width: 100,
      ellipsis: true,
    },
    {
      title: language('project.sysconf.syscert.subject'),
      dataIndex: 'subject',
      width: 150,
      ellipsis: true,
    },
    {
      title: language('project.sysconf.syscert.expire'),
      dataIndex: 'expire',
      width: 150,
      ellipsis: true,
    },
    {
      title: language('project.sysconf.syscert.serial'),
      dataIndex: 'serial',
      width: 200,
      ellipsis: true,
    },
  ]
  const updateFinish = (params) =>{
      if(params.success){
        params.msg&&message.success(params.msg)
        fetchDevRegist()
      }else{
        params.msg&&message.error(params.msg)
      }
  }
  return (
    <>
      <div style={{ marginBottom: 15 }}>
        <ProCard
          title={language('project.sysconf.syscert.devTitle')}
          bodyStyle={{ paddingBottom: 0,paddingTop:6 }}
        >
          <ProForm
            {...formleftLayout}
            formRef={deployFormRef}
            submitter={false}
            onFinish={() => {
              saveConfig()
            }}
          >
            <ProFormText
              label={language('project.sysconf.syscert.company')}
              name="company"
              width={300}
              rules={[
                {
                  required: true,
                  message: language('project.sysconf.syscert.required'),
                },
                {
                  pattern: regList.strmax.regex,
                  message: regList.strmax.alertText
                }
              ]}
            />
            <ProFormText
              label={language('project.sysconf.syscert.govcode')}
              name="govcode"
              width={300}
              rules={[
                {
                  required: true,
                  message: language('project.sysconf.syscert.required'),
                },
                {
                  pattern: regList.onlyNum.regex,
                  message: language('project.deployd.govcode')
                },
                {
                  min: 6,
                },
                {
                  max: 12,
                }
              ]}
            />
            <ProFormText
              label={language('project.sysconf.syscert.location')}
              name="location"
              width={300}
              rules={[
                {
                  required: true,
                  message: language('project.sysconf.syscert.required'),
                },
                {
                  pattern: regList.strmax.regex,
                  message: regList.strmax.alertText
                }
              ]}
            />
            <div
              className={classNames(styles.contactsItem, {
                [styles.contactsItemNoError]: dataSource.length > 0,
              })}
            >
              <ProFormText
                label={language('project.sysconf.syscert.contacts')}
                name="contacts"
                wrapperCol={{
                  sm: { span: 16 },
                  xm: { span: 24 },
                }}
                style={{ marginBottom: 0 }}
                rules={[
                  {
                    required: dataSource.length > 0 ? false : true,
                    message:
                      dataSource.length > 0
                        ? ''
                        : language('project.sysconf.syscert.required'),
                  },
                ]}
              >
                <EditTable
                  columns={columns}
                  maxLength={5}
                  tableWidth={700}
                  dataSource={dataSource}
                  setDataSource={setDataSource}
                  deleteButShow={false}
                />
              </ProFormText>
            </div>

            <Row style={{ marginBottom: '16px' }}>
              <Col span={6}></Col>
              <Col>
                <Button
                  icon={<SaveOutlined />}
                  type="primary"
                  htmlType="submit"
                  disabled={!writable}
                >
                  {language('project.sysconf.syscert.saveConf')}
                </Button>
              </Col>
            </Row>
          </ProForm>
        </ProCard>
      </div>

      <ProCard
        title={language('project.sysconf.syscert.regTitle')}
        bodyStyle={{ paddingBottom: 0,paddingTop:6 }}
      >
        <ProForm
          {...formleftLayout}
          formRef={registFormRef}
          onFinish={(values) => {
            setRegist(values)
          }}
          submitter={false}
        >
          <ProFormText
            label={language('project.sysconf.syscert.deviceID')}
            width={300}
          >
            <div style={{ color: '#000' }}>{deviceID}</div>
          </ProFormText>
          {pageContent.map((item) => {
            return (
              <ProFormText
                label={item.title}
                name={item.name}
                width={300}
                rules={[
                  {
                    required: true,
                    message: language('project.sysconf.syscert.required'),
                  },
                  // {
                  //   pattern: (item.name==='regIPAddr'||item.name==='regAddr')&& regIpList.ipv4andpart.regex,
                  //   message: regIpList.ipv4andpart.alertText,
                  // },
                  {
                    pattern: item.name==='regIPAddr'||item.name==='regAddr' ? regIpList.ipv4andpart.regex : regList.englishOrnum.regex,
                    message: item.name==='regIPAddr'||item.name==='regAddr' ? regIpList.ipv4andpart.alertText : regList.englishOrnum.alertText,
                  },
                ]}
              />
            )
          })}
          <ProFormText
            label={language('project.sysconf.syscert.regStatus')}
            width={300}
          >
            <div>
              <Tag color={color}>{regStatus}</Tag>
              {regReason&& <span>{regReason}</span>}
            </div>
          </ProFormText>
          <ProFormText
            label={language('project.sysconf.syscert.signStatus')}
            wrapperCol={{
              sm: { span: 16 },
              xm: { span: 24 },
            }}
          >
            <div>
              <div style={{marginTop:5}}>
                <Checkbox checked={certStatus} onChange={setChecked}>
                  {language('project.sysconf.syscert.signStatusTip')}
                </Checkbox>
                <span className={styles.uploadButton}>
                  <WebUploadr
                    isAuto={true}
                    upbutext={language('project.sysconf.syscert.upload')}
                    maxSize={3000}
                    upurl="/cfg.php?controller=sysDeploy&action=uploadRegCert"
                    isShowUploadList={false}
                    maxCount={1}
                    onSuccess={updateFinish}
                    isUpsuccess={true}
                    autoBtnType='primary'
                  />
                </span>
              </div>
              <ProTable
                size="small"
                columns={regColumns}
                tableStyle={{ width: 700 }}
                className={styles.regTable}
                tableAlertRender={false}
                search={false}
                options={false}
                dataSource={regDataSource}
                pagination={false}
                rowKey="id"
              ></ProTable>
              <Row style={{ marginTop: 12, marginBottom: 4 }}>
                <Col>
                  <Button
                    icon={<TrademarkOutlined />}
                    type="primary"
                    // onClick={setRegist}
                    loading={regButLoading}
                    htmlType="submit"
                    disabled={!writable}
                  >
                    {language('project.sysconf.syscert.devReg')}
                  </Button>
                </Col>
              </Row>
            </div>
          </ProFormText>
        </ProForm>
      </ProCard>
    </>
  )
}
