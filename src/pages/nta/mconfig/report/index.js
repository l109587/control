import React, { useEffect, useState, useRef } from 'react'
import {
  Button,
  Switch,
  Modal,
  Menu,
  Dropdown,
  message,
  Tooltip,
} from 'antd'
import ProTable from '@/components/Module/ProtableModule'
import {
  ModalForm,
  ProFormText,
  ProFormDigit,
  ProFormSwitch,
  ProFormSelect,
} from '@ant-design/pro-form'
import { modalFormLayout } from '@/utils/helper'
import { post } from '@/services/https'
import '@/utils/index.less'
let tableHeight = document.body.clientHeight - 295

const confirm = Modal.confirm

const Report = () => {
  const [typeList, setTypeList] = useState([])
  const [modalStatus, setModalStatus] = useState(false)
  const [record, setRecord] = useState({})
  const [incID, setIncID] = useState(0)

  const formRef = useRef()

  const fetchOptions = () => {
    let options = []
    typeList?.forEach((item) => {
      options.push({ label: item.text, value: item.value })
    })
    return options
  }

  useEffect(() => {
    showLogTypeList()
  }, [])
  const addClick = () => {
    setModalStatus(true)
  }
  const save = (values) => {
    if (!record.id) {
      values.op = 'add'
    } else {
      values.op = 'mod'
      values.id = record.id
    }
    values.status = values.status ? Number(values.status) : 0
    post('/cfg.php?controller=confReport&action=setReport', values).then(
      (res) => {
        if (res.success) {
          res.msg && message.success(res.msg)
          setModalStatus(false)
          setIncID(incID+1)
        } else {
          res.msg && message.error(res.msg)
        }
      }
    )
  }

  const showLogTypeList = () => {
    post('/cfg.php?controller=confReport&action=showLogTypeList', {}).then(
      (res) => {
        res.success && setTypeList(res.data)
      }
    )
  }
  const editReport = (values) => {
    setModalStatus(true)
    setRecord(values)
    setTimeout(function () {
      formRef.current.setFieldsValue(values)
    }, 100)
  }
  const SwitchBtn = (status, value) => {
    value.op = 'mod'
    value.status = status
    post('/cfg.php?controller=confReport&action=setReport', value).then(
      (res) => {
        if (res.success) {
          res.msg && message.success(res.msg)
        } else {
          res.msg && message.error(res.msg)
        }
      }
    )
  }
  //删除
  const deleteReport = (record) => {
    const data = { id: record.id, name: record.name, type: record.type }
    post('/cfg.php?controller=confReport&action=delReport', data).then(
      (res) => {
        if (res.success) {
          res.msg && message.success(res.msg)
          setIncID(incID+1)
        } else {
          res.msg && message.error(res.msg)
        }
      }
    )
  }
  const enableAll = (i) => {
    const data = i.key == 1 ? { op: 'start' } : { op: 'stop' }
    post('/cfg.php?controller=confReport&action=enableAll', data).then(
      (res) => {
        if (res.success) {
          res.msg && message.success(res.msg)
          setIncID(incID+1)
        } else {
          res.msg && message.error(res.msg)
        }
      }
    )
  }
  const menu = () => (
    <Menu onClick={enableAll}>
      <Menu.Item key="1">全部启用</Menu.Item>
      <Menu.Item key="2">全部禁用</Menu.Item>
    </Menu>
  )

  const otherOperate = () => {
    return (
      <Dropdown overlay={menu}>
        <Button>操作</Button>
      </Dropdown>
    )
  }
  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      align: 'center',
      fixed: 'left',
      width: 200,
    },
    {
      title: '状态',
      dataIndex: 'status',
      align: 'center',
      fixed: 'left',
      width: 100,
      render: (text, record) => {
        if (text == 0) {
          return (
            <Switch
              checkedChildren="开启"
              unCheckedChildren="关闭"
              onClick={() => SwitchBtn(1, record)}
            />
          )
        } else {
          return (
            <Switch
              checkedChildren="开启"
              unCheckedChildren="关闭"
              defaultChecked
              onClick={() => SwitchBtn(0, record)}
            />
          )
        }
      },
    },
    {
      title: '类型',
      dataIndex: 'type',
      align: 'center',
      width: 100,
      render: (text, record) => {
        return typeList.map((item) => {
          if (item.value == text) {
            return item.text
          }
        })
      },
    },
    {
      title: 'URL',
      dataIndex: 'url',
      align: 'center',
      width: 300,
      render: (text, record) => {
        return (
          <Tooltip title={text}>
            <span
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {text}
            </span>
          </Tooltip>
        )
      },
    },
    {
      title: '地址',
      dataIndex: 'addr',
      align: 'center',
      width: 140,
    },
    {
      title: '端口',
      dataIndex: 'port',
      align: 'center',
      width: 80,
    },
    {
      title: '数据包限制',
      dataIndex: 'size',
      align: 'center',
      width: 120,
    },
    {
      title: '上报间隔',
      dataIndex: 'interval',
      key: 'interval',
      align: 'center',
      width: 100,
    },
    {
      title: '操作',
      dataIndex: 'id',
      align: 'center',
      fixed: 'right',
      width: 180,
      render: (text, record) => {
        return (
          <>
            <Button type="link" onClick={() => editReport(record)}>
              修改
            </Button>
            <Button
              type="link"
              style={{ color: 'red' }}
              onClick={() => {
                confirm({
                  title: '你确定要删除这条数据吗？ ',
                  content: '请注意，该操作不可逆',
                  onOk() {
                    deleteReport(record)
                  },
                })
              }}
            >
              删除
            </Button>
          </>
        )
      },
    },
  ]
  return (
    <>
      <ProTable
        columns={columns}
        apishowurl="/cfg.php?controller=confReport&action=showReport"
        clientHeight={tableHeight}
        tableKey="report"
        setcolumnKey="pro-table-singe-demos-report"
        columnvalue="reportColumnvalue "
        addButton={true}
        addClick={addClick}
        rowkey={(record) => record.id}
        otherOperate={otherOperate}
        incID={incID}
      />
      <ModalForm
        {...modalFormLayout}
        formRef={formRef}
        title="日志配置"
        visible={modalStatus}
        modalProps={{
          maskClosable: false,
          destroyOnClose: true,
          onCancel: () => {
            setModalStatus(false)
            setRecord({})
          },
          okText: '设置',
        }}
        onFinish={async (values) => {
          save(values)
        }}
      >
        <ProFormSwitch
          label="状态"
          name="status"
          fieldProps={{ checkedChildren: '开启', unCheckedChildren: '关闭' }}
        />
        <ProFormText
          label="名称"
          name="name"
          rules={[
            {
              required: true,
            },
          ]}
        />
        <ProFormSelect label="类型" name="type" options={fetchOptions()} />
        <ProFormText label="URL" name="url"></ProFormText>
        <ProFormText label="地址" name="addr" />
        <ProFormDigit
          label="端口"
          name="port"
          min={1}
          max={65535}
          width={100}
        />
        <ProFormDigit label="数据包限制" name="size" min={1} width={100} />
        <ProFormDigit label="上报间隔" name="interval" min={1} width={100} />
      </ModalForm>
    </>
  )
}

export default Report
