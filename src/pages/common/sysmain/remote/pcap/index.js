import React, { useState, useEffect } from 'react'
import ProCard from '@ant-design/pro-card'
import {
  Form,
  Button,
  Input,
  Alert,
  Radio,
  Checkbox,
  Progress,
  Tooltip,
  message,
  Modal,
  Spin
} from 'antd'
import {
  CaretRightOutlined,
  PoweroffOutlined,
  DownloadOutlined,
  PauseCircleOutlined,
  DeleteOutlined,
  CheckOutlined,
  ExclamationCircleOutlined,
  LoadingOutlined
} from '@ant-design/icons'
import ProTable from '@ant-design/pro-table'
import styles from './index.less'
import { regIpList } from '@/utils/regExp'
import { language } from '@/utils/language'
import { post, fileDown } from '@/services/https'
import { formleftLayout } from '@/utils/helper'
import download from '@/utils/downnloadfile'
import { fetchAuth } from '@/utils/common';

export default function Wireshark() {
  const writable = fetchAuth()
  const [form] = Form.useForm() //form表单
  const [pcapList, setPcapList] = useState([]) //抓包回显数据
  const [netPortOptions, setNetPortOptions] = useState([]) //网口选择options
  const [status, setStatus] = useState(true) //是否可以抓包
  const [tableLoading,setTableLoading] = useState(false) //是否可以抓包
  const [exLoading,setExLoading] = useState(false) //是否可以抓包

  useEffect(() => {
    getIface()
    // fetchStatus()
    showPcapList()
  }, [])

  const getIface = () => {
    post('/cfg.php?controller=netSetting&action=showInterface')
      .then((res) => {
        if (res.success) {
          console.log(res, 'res')
          const newArr = []
          if (res.data.length <= 7) {
            res.data.forEach((item) => {
              newArr.push({
                label: item.name,
                value: item.name,
                disabled: item.status === 'N' ? true : false,
              })
            })
          } else {
            const newData = res.data.filter((item) => {
              return item.status === 'Y'
            })
            const newDataN = res.data.filter((item) => {
              return item.status === 'N'
            })
            newDataN.forEach((item)=>{
              if(newData.length<7){
                newData.push(item)
              }
            })
            newData.forEach((item) => {
              newArr.push({ label: item.name, value: item.name,disabled:item.status ==='Y'?false:true })
            })
          }
          setNetPortOptions(newArr)
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }
  const start = () => {
    const formDatas = form.getFieldsValue(true)

    const ifaces = formDatas.iface ? formDatas.iface.join(';') : ''
    const protocols = formDatas.protocol ? formDatas.protocol.join(';') : ''

    const datas = { ...formDatas, iface: ifaces, protocol: protocols }
    const defaultParams = { limit: '', ipaddr: '', filter: '' }

    const data = { ...defaultParams, ...datas }

    post('/cfg.php?controller=mtaDebug&action=startPcap', data)
      .then((res) => {
        if (res.success) {
          setTimeout(()=>{
            showPcapList()
          },800)
        } else if (!res.success) {
          message.error(res.msg)
        } else {
          return false
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }
  let sharkTimer = ''
  const showPcapList = () => {
    post('/cfg.php?controller=mtaDebug&action=showPcapList')
      .then((res) => {
        if (res.success) {
          setStatus(res.status === 'Y' ? true : false)
          setPcapList(res.data)
          if (res.status === 'N') {
            sharkTimer = setTimeout(() => {
              showPcapList()
            }, 3000)
          } else if (res.status === 'Y') {
            clearTimeout(sharkTimer)
          }
        } else {
          return false
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }
  const stopShark = (params) => {
    setTableLoading(true)
    post('/cfg.php?controller=mtaDebug&action=stopPcap', { id: params })
      .then((res) => {
        if (res.success) {
          setTimeout(()=>{
            setTableLoading(false)
            showPcapList()
          },1000)
        } else if (!res.success) {
          message.error(res.msg)
        } else {
          return false
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const deletePcap = (record) => {
    setTableLoading(true)
    post('/cfg.php?controller=mtaDebug&action=deletePcap', { id: record })
      .then((res) => {
        if (res.success) {
          setTableLoading(false)
          showPcapList()
        } else if (!res.success) {
          res.msg && message.error(res.msg)
        } else {
          return false
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }
  const agreementOptions = [
    {
      label: 'TCP',
      value: 'TCP',
    },
    {
      label: 'UDP',
      value: 'UDP',
    },
    {
      label: 'ICMP',
      value: 'ICMP',
    },
    {
      label: 'DHCP',
      value: 'DHCP',
    },
    {
      label: 'DNS',
      value: 'DNS',
    },
    {
      label: 'HTTP',
      value: 'HTTP',
    },
    {
      label: 'HTTPS',
      value: 'HTTPS',
    },
  ]
  const columns = [
    {
      title: language('project.sysdebug.wireshark.Interface'),
      dataIndex: 'iface',
      align: 'left',
      width: 80,
      ellipsis: true,
    },
    {
      title: language('project.sysdebug.wireshark.name'),
      dataIndex: 'name',
      align: 'left',
      width: 130,
      ellipsis: true,
    },
    {
      title: language('project.sysdebug.wireshark.size'),
      dataIndex: 'size',
      align: 'left',
      width: 80,
      ellipsis: true,
    },
    {
      title: language('project.sysdebug.wireshark.number'),
      dataIndex: 'count',
      align: 'left',
      width: 80,
      ellipsis: true,
    },
    {
      title: language('project.sysdebug.wireshark.state'),
      dataIndex: 'progress',
      align: 'center',
      width: 80,
      render: (val) => (
        <Progress
          type="circle"
          width={30}
          percent={val}
          format={(percent) =>
            percent == '100' ? (
              <CheckOutlined />
            ) : (
              <span className={styles.percent}>{Math.trunc(percent)}%</span>
            )
          }
        />
      ),
    },
    {
      title: language('project.sysdebug.wireshark.operation'),
      dataIndex: 'index',
      align: 'center',
      fixed: 'right',
      hideInTable:!writable,
      width: 100,
      render: (_, record) => (
        <div>
          {record.state === 'N' ? (
            <Tooltip title={language('project.sysdebug.wireshark.download')}>
              <Button
                type="link"
                icon={<DownloadOutlined />}
                onClick={() => download('/cfg.php?controller=mtaDebug&action=downloadPcap', {}
                ,setExLoading, false, { id: record.id,file: record.name })}
              />
            </Tooltip>
          ) : (
            <Tooltip title={language('project.sysdebug.wireshark.pause')}>
              <Button
                type="link"
                icon={<PauseCircleOutlined />}
                style={{ color: '#101010' }}
                onClick={() => stopShark(record.id)}
              />
            </Tooltip>
          )}
          <Tooltip title={language('project.sysdebug.wireshark.delete')}>
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              // onClick={() => deletePcap(record.id)}
              onClick={() => {
                Modal.confirm({
                  title: '是否确认删除？',
                  okText: '删除',
                  okButtonProps: {
                    danger: true,
                  },
                  onOk: () => {
                    deletePcap(record.id)
                  },
                })
              }}
            />
          </Tooltip>
        </div>
      ),
    },
  ]
  return (
    <Spin
      tip={language('project.sysdebug.wireshark.loading')}
      spinning={exLoading}
      indicator={<LoadingOutlined spin />}
    >
      <ProCard
        bodyStyle={{
          display: 'block',
          paddingBottom: '12px',
          paddingTop: '12px',
        }}
      >
        <ProCard
          bodyStyle={{ padding: 0, display: 'flex', justifyContent: 'center' }}
          colSpan={{xs:24,xxl:22}}
        >
          <div>
            <Alert
              style={{ width: '885px' }}
              type="warning"
              showIcon
              description={language('project.sysdebug.wireshark.tip')}
              message={language('project.sysdebug.wireshark.message')}
            ></Alert>
          </div>
        </ProCard>
        <ProCard bodyStyle={{ paddingBottom: 0 }}>
          <Form
            form={form}
            {...formleftLayout}
            onFinish={start}
            initialValues={{ iface: ['mgt'], limit: '1W' }}
          >
            <Form.Item
              label={language('project.sysdebug.wireshark.netPort')}
              name="iface"
              style={{ marginBottom: '8px' }}
              wrapperCol= {{
                sm: { span: 16 },
                xxl: { span: 16 }
              }}
            >
              <Checkbox.Group options={netPortOptions} className={styles.checkbox}/>
            </Form.Item>
            <Form.Item
              label={language('project.sysdebug.wireshark.agreement')}
              name="protocol"
              style={{ marginBottom: '8px' }}
              wrapperCol= {{
                sm: { span: 16 },
                xxl: { span: 16 }
              }}
            >
              <Checkbox.Group options={agreementOptions} className={styles.checkbox}/>
            </Form.Item>
            <Form.Item
              label={language('project.sysdebug.wireshark.limit')}
              name="limit"
              style={{ marginBottom: '8px' }}
              wrapperCol= {{
                sm: { span: 16 },
                xxl: { span: 16 }
              }}
            >
              <Radio.Group>
                <Radio value="1K">
                  {language('project.sysdebug.wireshark.onemsg')}
                </Radio>
                <Radio value="1W">
                  {language('project.sysdebug.wireshark.thousandmsg')}
                </Radio>
                <Radio value="10W">
                  {language('project.sysdebug.wireshark.tenthousandmsg')}
                </Radio>
                <Radio value="50W">
                  {language('project.sysdebug.wireshark.fiftythousandmsg')}
                </Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item label={language('project.sysdebug.wireshark.filterIP')} className={styles.filterIP}>
              <Form.Item
                noStyle
                name="ipaddr"
                style={{ marginBottom: '16px' }}
                
                rules={[
                  {
                    pattern: regIpList.ipv4.regex,
                  },
                ]}
              >
                <Input style={{ width: '220px' }} />
              </Form.Item>
              <ExclamationCircleOutlined style={{ marginLeft: '8px' }} />
              <span style={{ color: '#606060', fontSize: '12px' }}>
                {language('project.sysdebug.wireshark.filterIPtip')}
              </span>
            </Form.Item>
            <Form.Item
              label={language('project.sysdebug.wireshark.filterSenior')}
              name="filter"
              style={{ marginBottom: '16px' }}
              rules={[
                {
                  max: 4096
                }
              ]}
            >
              <Input.TextArea style={{ width: '400px', height: '100px' }} />
            </Form.Item>
            <Form.Item
              wrapperCol={{
                //   offset: 2,
                span: 16,
              }}
              label={language('project.sysdebug.wireshark.buttonlist')}
              style={{ marginBottom: '16px' }}
            >
              <Button
                type="primary"
                htmlType="submit"
                icon={<CaretRightOutlined />}
                disabled={!writable||!status}
                className={styles.disabled}
              >
                {language('project.sysdebug.wireshark.startgrab')}
              </Button>
              <Button
                type="primary"
                style={{
                  marginLeft: '12px',
                  backgroundColor: 'gray',
                  color:'#fff', 
                  border:'1px solid gray'
                }}
                onClick={() => stopShark('all')}
                disabled={status}
              >
                <div style={{marginTop:'-2px',display:'inline-block'}}>
                <i className='iconfont icon-stopcircle' style={{ color:'#fff', fontSize: '15px', marginRight: '5px'}}></i>
                </div>
                {language('project.sysdebug.wireshark.stopall')}
              </Button>
            </Form.Item>
            <Form.Item
              wrapperCol= {{
                sm: { span: 16 ,offset: 4},
                xxl: { span: 16 ,offset: 5}
              }}
            >
              {pcapList?.length > 0 ? (
                <ProTable
                  tableStyle={{ width: '550px',marginLeft:document.body.clientWidth < 1920?'20px':'' }}
                  rowKey="id"
                  toolBarRender={false}
                  search={false}
                  pagination={false}
                  columns={columns}
                  dataSource={pcapList}
                  className={styles.table}
                  loading={tableLoading}
                />
                ) : (
                  ''
                )}
            </Form.Item>
          </Form>
        </ProCard>
      </ProCard>
    </Spin>
  )
}
