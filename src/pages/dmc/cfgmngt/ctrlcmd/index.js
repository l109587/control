import React, { useRef, useState, useEffect } from 'react'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import {
  ModalForm,
  ProFormText,
  ProFormSelect,
  ProFormRadio,
  ProFormDateTimePicker,
} from '@ant-design/pro-components'
import { Input, message, Space, Tag, Modal, Row, Col, Divider } from 'antd'
import { post } from '@/services/https'
import { language } from '@/utils/language'
import WebUploadr from '@/components/Module/webUploadr'
import PolicyTable from '@/components/Module/policyTable'
const { Search } = Input
const { confirm } = Modal
import { TableLayout } from '@/components'
const { ProtableModule } = TableLayout
import { modalFormLayout } from '@/utils/helper'
import styles from './index.less'
import { LinkTwo } from '@icon-park/react'
import { regList } from '@/utils/regExp'

let clientHeight = document.body.clientHeight - 296

export default function Ctrlcmd() {
  const rowKey = (record) => record.id //列表唯一值
  const [incID, setIncID] = useState(0) //递增的id 删除/添加的时候增加触发刷新
  const [modalStatus, setModalStatus] = useState(false) //model 添加弹框状态
  const [queryVal, setQueryVal] = useState('') //搜索框的值
  const [devqueryVal, setDevQueryVal] = useState('') //设备搜索搜索框的值
  const [orderType, setOrderType] = useState('') //表单中命令类型
  const [checkMethod, setCheckMethod] = useState('get_file') //检查方法
  const [ruleType, setRuleType] = useState('') //规则类型
  const [rowRecord, setRowRecord] = useState({}) //关联设备数据
  const [ids, setIds] = useState([]) //保存选中id
  const [updateRes, setUpdateRes] = useState({}) //获取固件升级返回信息
  const [ruleRes, setRuleRes] = useState({}) //获取规则文件返回信息
  const [modulesall, setModulesall] = useState([]) //获取规则文件返回信息
  const [modules, setModules] = useState([]) //获取所有模块信息
  const [submodules, setSubmodules] = useState([]) //获取子模块信息
  const [submoduleall, setSubmoduleall] = useState([]) //获取所有子模块信息
  let searchVal = { queryVal: queryVal, queryType: 'fuzzy' } //顶部搜索框值 传入接口
  let devSearchVal = { queryVal: devqueryVal, queryType: 'fuzzy' } //设备搜索传入的值
  const formRef = useRef()

  /**关联设备 start  */
  const sRef = useRef(null)
  //调用子组件接口判断弹框状态
  const disModal = (op = '', record = {}) => {
    setRowRecord(record)
    modMethod(op)
    if (sRef.current) {
      sRef.current.openEdModal('Y')
    }
  }
  const [modalVal, setModalVal] = useState() //当前点击弹框类型 distrbute | revoke | assocTable
  const recordFind = rowRecord //当前行id
  const assocshowurl = '/cfg.php?controller=confRemoteCmd&action=getCmdStatus' //设备列表接口路径
  const tableKeyVal = 'blickdevl' //列表唯一key
  const assocType = 2

  const modMethod = (type) => {
    setModalVal(type)
  }
  /**关联设备 end  */

  /* 顶部左侧搜索框*/
  const tableTopSearch = () => {
    return (
        <Search
          placeholder={language('project.cfgmngt.ctrlcmd.puzzysearch')}
          style={{ width: 200 }}
          onSearch={(queryVal) => {
            setQueryVal(queryVal)
            setIncID(incID + 1)
          }}
        />
    )
  }
  /* 顶部左侧搜索框*/
  const devSearch = () => {
    return (
      <Search
        placeholder={language('project.cfgmngt.ctrlcmd.searchplace')}
        style={{ width: 150 }}
        onSearch={(value) => {
          setDevQueryVal(value)
          setIncID(incID + 1)
        }}
      />
    )
  }
  //删除弹框
  const delClick = (selectedRowKeys) => {
    let sum = selectedRowKeys.length
    confirm({
      icon: <ExclamationCircleOutlined />,
      title: language('project.delconfirm'),
      content: language('project.cancelcon', { sum: sum }),
      onOk() {
        delList(selectedRowKeys)
      },
    })
  }
  //删除功能
  const delList = (selectedRowKeys) => {
    let data = {}
    data.ids = selectedRowKeys.join(',')
    post('/cfg.php?controller=confRemoteCmd&action=del', data)
      .then((res) => {
        if (res.success) {
          setIncID(incID + 1)
          res.msg && message.success(res.msg)
        } else {
          res.msg && message.error(res.msg)
        }
      })
      .catch(() => {
        console.log('mistake')
      })
  }

  //新建命令
  const addClick = () => {
    setModalStatus(true)
    fetchModudleNames()
  }

  const Transmit = (selectedRows) => {
    const ids = []
    selectedRows.map((item) => {
      ids.push(item.devid)
    })
    setIds(ids)
  }

  //下发命令
  const save = (values) => {
    if (ids.length > 0) {
      let param = {}
      const refdev = ids.join(',')
      switch (orderType) {
        case 'startm':
          param = { module: values.module, submodule: values.submodule }
          break
        case 'startm':
          param = { module: values.module, submodule: values.submodule }
          break
        case 'stopm':
          param = { module: values.module, submodule: values.submodule }
          break
        case 'sync_time':
          param = { time: values.time }
          break
        case 'inner_policy_update':
          param = { filename: ruleRes.filename, md5: ruleRes.md5 }
          break
        case 'update':
          param = {
            filename: updateRes?.filename,
            md5: updateRes?.md5,
            soft_version: updateRes?.version,
          }
          break
        case 'version_check':
          if (values.method === 'ls') {
            param = {
              method: values.method,
              path: values.path,
            }
          } else {
            param = {
              method: values.method,
              offset: values.offset,
              length: values.length,
              filename: values.filename,
            }
          }
          break
        case 'passwd':
          param = { user: values.user, passwd: values.passwd }
          break
        case 'dropdata':
          param = {
            submodule: values.submoduledel,
            rule_id: values.ruleId === 2 ? values.id : values.ruleId,
            time: values.overtime,
          }
          break
        default:
          break
      }
      const params = {
        type: orderType,
        desc: values.desc,
        refdev: refdev,
        param: JSON.stringify(param),
      }
      post('/cfg.php?controller=confRemoteCmd&action=add', params).then(
        (res) => {
          if (res.success) {
            setModalStatus(false)
            setIncID(incID + 1)
            res.msg && message.success(res.msg)
            setOrderType('')
            setRuleRes({})
            setUpdateRes({})
            setIds([])
          } else {
            res.msg && message.error(res.msg)
          }
        }
      )
    } else {
      message.error(language('project.cfgmngt.ctrlcmd.selector'))
    }
  }

  const typeMap = {
    reboot: language('project.cfgmngt.ctrlcmd.reboot'),
    shutdown: language('project.cfgmngt.ctrlcmd.shutdown'),
    startm: language('project.cfgmngt.ctrlcmd.startm'),
    stopm: language('project.cfgmngt.ctrlcmd.stopm'),
    sync_time: language('project.cfgmngt.ctrlcmd.sync_time'),
    update: language('project.cfgmngt.ctrlcmd.update'),
    version_check: language('project.cfgmngt.ctrlcmd.version_check'),
    inner_policy_update: language('project.cfgmngt.ctrlcmd.ruleupdate'),
    passwd: language('project.cfgmngt.ctrlcmd.passwd'),
    dropdata: language('project.cfgmngt.ctrlcmd.dropdata'),
  }

  const srcMap = {
    local: language('project.cfgmngt.ctrlcmd.local'),
    remote: language('project.cfgmngt.ctrlcmd.remote'),
  }

  const columns = [
    {
      title: language('project.cfgmngt.ctrlcmd.time'),
      dataIndex: 'time',
      key: 'time',
      width: '100px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('project.cfgmngt.ctrlcmd.order'),
      dataIndex: 'type',
      key: 'type',
      width: '80px',
      align: 'center',
      filterMultiple: false,
      filters: [
        { text: language('project.cfgmngt.ctrlcmd.reboot'), value: 'reboot' },
        {
          text: language('project.cfgmngt.ctrlcmd.shutdown'),
          value: 'shutdown',
        },
        { text: language('project.cfgmngt.ctrlcmd.startm'), value: 'startm' },
        { text: language('project.cfgmngt.ctrlcmd.stopm'), value: 'stopm' },
        {
          text: language('project.cfgmngt.ctrlcmd.sync_time'),
          value: 'sync_time',
        },
        { text: language('project.cfgmngt.ctrlcmd.update'), value: 'update' },
        {
          text: language('project.cfgmngt.ctrlcmd.version_check'),
          value: 'version_check',
        },
        {
          text: language('project.cfgmngt.ctrlcmd.ruleupdate'),
          value: 'inner_policy_update',
        },
        { text: language('project.cfgmngt.ctrlcmd.passwd'), value: 'passwd' },
        {
          text: language('project.cfgmngt.ctrlcmd.dropdata'),
          value: 'dropdata',
        },
      ],
      render: (text) => {
        let color = 'processing'
        switch (text) {
          case 'reboot':
            color = 'processing'
            break
          case 'shutdown':
            color = 'error'
            break
          case 'startm':
            color = 'processing'
            break
          case 'stopm':
            color = 'error'
            break
          case 'sync_time':
            color = 'processing'
            break
          case 'update':
            color = 'processing'
            break
          case 'version_check':
            color = 'processing'
            break
          case 'inner_policy_update':
            color = 'processing'
            break
          case 'passwd':
            color = 'error'
            break
          case 'dropdata':
            color = 'error'
            break
          default:
            break
        }
        return <Tag color={color}>{typeMap[text]}</Tag>
      },
    },
    {
      title: language('project.cfgmngt.ctrlcmd.param'),
      dataIndex: 'param',
      key: 'param',
      width: '220px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('project.cfgmngt.ctrlcmd.desc'),
      dataIndex: 'desc',
      key: 'desc',
      width: '130px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('project.cfgmngt.ctrlcmd.src'),
      dataIndex: 'from',
      key: 'from',
      width: '80px',
      align: 'center',
      render: (text) => {
        let color = 'success'
        switch (text) {
          case 'local':
            color = 'success'
            break
          case 'remote':
            color = 'warning'
            break
          default:
            break
        }
        return <Tag color={color}>{srcMap[text]}</Tag>
      },
      filterMultiple: false,
      filters: [
        { text:  language('project.cfgmngt.ctrlcmd.local'), value: 'local' },
        { text:  language('project.cfgmngt.ctrlcmd.remote'), value: 'remote' },
      ],
    },
    {
      title: language('project.cfgmngt.ctrlcmd.refdevCnt'),
      dataIndex: 'refDevCnt',
      key: 'refDevCnt',
      width: '80px',
      align: 'center',
      render: (text, record) => {
        return (
          <Space align="left">
            <div>{text}</div>
            {text >= 1 ? (
              <div style={{ marginLeft: '8px' }}>
                <LinkTwo
                  theme="outline"
                  size="20"
                  fill="#FF7429"
                  strokeWidth={3}
                  onClick={() => {
                    disModal('assoc', record)
                  }}
                />
              </div>
            ) : (
              <div style={{ marginLeft: '8px' }}>
                <LinkTwo
                  theme="outline"
                  size="20"
                  fill="#8E8D8D"
                  strokeWidth={3}
                />
              </div>
            )}
          </Space>
        )
      },
    },
  ]
  const devColumns = [
    {
      title: language('project.cfgmngt.ctrlcmd.devid'),
      dataIndex: 'devid',
      key: 'devId',
      width: '120px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('project.cfgmngt.ctrlcmd.devname'),
      dataIndex: 'name',
      key: 'name',
      width: '120px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('project.cfgmngt.ctrlcmd.devip'),
      dataIndex: 'ip',
      key: 'ip',
      width: '120px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('project.cfgmngt.ctrlcmd.division'),
      dataIndex: 'division',
      key: 'division',
      width: '120px',
      ellipsis: true,
      align: 'left',
    },
  ]
  const orderTypes = [
    {
      label: language('project.cfgmngt.ctrlcmd.reboot'),
      value: 'reboot',
    },
    {
      label: language('project.cfgmngt.ctrlcmd.shutdown'),
      value: 'shutdown',
    },
    {
      label: language('project.cfgmngt.ctrlcmd.startm'),
      value: 'startm',
    },
    {
      label: language('project.cfgmngt.ctrlcmd.stopm'),
      value: 'stopm',
    },
    {
      label: language('project.cfgmngt.ctrlcmd.sync_time'),
      value: 'sync_time',
    },
    {
      label: language('project.cfgmngt.ctrlcmd.update'),
      value: 'update',
    },
    {
      label: language('project.cfgmngt.ctrlcmd.version_check'),
      value: 'version_check',
    },
    {
      label: language('project.cfgmngt.ctrlcmd.ruleupdate'),
      value: 'inner_policy_update',
    },
    {
      label: language('project.cfgmngt.ctrlcmd.passwd'),
      value: 'passwd',
    },
    {
      label: language('project.cfgmngt.ctrlcmd.dropdata'),
      value: 'dropdata',
    },
  ]
  const versionTypes = [
    { label: language('project.cfgmngt.ctrlcmd.get_file'), value: 'get_file' },
    { label: language('project.cfgmngt.ctrlcmd.ls'), value: 'ls' },
    { label: language('project.cfgmngt.ctrlcmd.md5sum'), value: 'md5sum' },
  ]

  const ruleIds = [
    { label: '全部规则', value: -1 },
    { label: '内置规则', value: 0 },
    { label: '指定规则', value: 2 },
  ]
  //获取固件更新返回值
  const fetchUpdateRes = (res) => {
    if (res.success) {
      setUpdateRes(res)
      res.msg && message.success(res.msg)
    } else {
      res.msg && message.error(res.msg)
    }
  }
  //获取规则更新返回值
  const fetchRuleRes = (res) => {
    if (res.success) {
      setRuleRes(res)
      res.msg && message.success(res.msg)
    } else {
      res.msg && message.error(res.msg)
    }
  }

  //模块选择
  const changeModules = (value) => {
    const submodules = []
    const module = modulesall.filter((item) => item.name === value)
    module[0]?.submodules.map((item) => {
      submodules.push({ value: item.name, label: item.title })
    })
    setSubmodules(submodules)
  }

  //获取所有模块和子模块名称
  const fetchModudleNames = () => {
    post('/cfg.php?controller=confRemoteCmd&action=getModuleNames').then(
      (res) => {
        if (res.success) {
          const names = []
          let subModules = []
          const subModuleall = []
          const modulesAll = [...res.data]
          setModulesall(modulesAll)
          res.data.map((item) => {
            names.push({ value: item.name, label: item.title })
            subModules = subModules.concat(item.submodules)
          })
          setModules(names)
          subModules.map((item) => {
            subModuleall.push({ value: item.name, label: item.title })
          })
          setSubmoduleall(subModuleall)
        }
      }
    )
  }
  return (
    <>
      <ProtableModule
        columns={columns}
        apishowurl="/cfg.php?controller=confRemoteCmd&action=show"
        clientHeight={clientHeight}
        columnvalue="ctrlcmdColumnvalue"
        tableKey="ctrlcmdTable"
        rowkey={rowKey}
        incID={incID}
        searchText={tableTopSearch()}
        searchVal={searchVal}
        delButton={true}
        delClick={delClick}
        addButton={true}
        addClick={addClick}
        rowSelection={true}
      />
      <ModalForm
        {...modalFormLayout}
        width="650px"
        onFinish={(values) => {
          save(values)
        }}
        initialValues={{ start: 0, rule: 'rule' }}
        formRef={formRef}
        title={language('project.cfgmngt.ctrlcmd.addtitle')}
        visible={modalStatus}
        autoFocusFirstInput
        modalProps={{
          maskClosable: false,
          destroyOnClose: true,
          okText: language('project.cfgmngt.ctrlcmd.add'),
          onCancel: () => {
            setModalStatus(false)
            setOrderType('')
            setRuleRes({})
            setUpdateRes({})
            setIds([])
          },
          bodyStyle: { paddingBottom: 0 },
        }}
        className={styles.devModal}
        onVisibleChange={setModalStatus}
      >
        <ProFormSelect
          label={language('project.cfgmngt.ctrlcmd.ordertype')}
          name="type"
          options={orderTypes}
          fieldProps={{
            onChange: (value) => {
              setOrderType(value)
              formRef.current.resetFields()
              formRef.current.setFieldsValue({ type: value })
            },
          }}
          width={280}
          rules={[
            {
              required: true,
              message: language('project.cfgmngt.ctrlcmd.required'),
            },
          ]}
        />

        <ProFormSelect
          options={modules}
          hidden={!(orderType === 'startm' || orderType === 'stopm')}
          name="module"
          label={language('project.cfgmngt.ctrlcmd.module')}
          width={280}
          fieldProps={{
            onChange: (value) => {
              changeModules(value)
              formRef.current.setFieldsValue({ submodule: [] })
            },
          }}
          rules={[
            {
              required: orderType === 'startm' || orderType === 'stopm',
              message: language('project.cfgmngt.ctrlcmd.required'),
            },
          ]}
        />
        <ProFormSelect
          options={submodules}
          hidden={!(orderType === 'startm' || orderType === 'stopm')}
          name="submodule"
          label={language('project.cfgmngt.ctrlcmd.submodule')}
          fieldProps={{
            showArrow: true,
            mode: 'multiple',
          }}
          width={280}
          rules={[
            {
              required: orderType === 'startm' || orderType === 'stopm',
              message: language('project.cfgmngt.ctrlcmd.required'),
            },
          ]}
        />
        <ProFormDateTimePicker
          hidden={!(orderType === 'sync_time')}
          label={language('project.cfgmngt.ctrlcmd.systime')}
          name="time"
          width={280}
          className={styles.systime}
          rules={[
            {
              required: orderType === 'sync_time',
              message: language('project.cfgmngt.ctrlcmd.required'),
            },
          ]}
        />
        <ProFormText
          hidden={!(orderType === 'update')}
          label={language('project.cfgmngt.ctrlcmd.updatetxt')}
          width={280}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: 280,
            }}
          >
            <span>{updateRes?.filename}</span>
            <span className={styles.uploadButton}>
              <WebUploadr
                isAuto={true}
                upbutext={language('project.sysconf.syscert.upload')}
                maxSize={30000000}
                upurl="/cfg.php?controller=confRemoteCmd&action=storeFirmware"
                isShowUploadList={false}
                maxCount={1}
                name={true}
                isUpsuccess={true}
                onSuccess={fetchUpdateRes}
              />
            </span>
          </div>
        </ProFormText>
        <ProFormText
          hidden={!(orderType === 'update')}
          label={language('project.cfgmngt.ctrlcmd.code')}
          width={280}
        >
          <span>{updateRes?.md5}</span>
        </ProFormText>
        <ProFormText
          hidden={!(orderType === 'update')}
          label={language('project.cfgmngt.ctrlcmd.version')}
          width={280}
        >
          <span>{updateRes?.version}</span>
        </ProFormText>
        <ProFormRadio.Group
          options={versionTypes}
          hidden={!(orderType === 'version_check')}
          label={language('project.cfgmngt.ctrlcmd.method')}
          radioType="button"
          name="method"
          initialValue="get_file"
          fieldProps={{
            buttonStyle: 'solid',
            onChange: (value) => {
              console.log(value.target.value)
              const method = value.target.value
              setCheckMethod(method)
              formRef.current.resetFields([
                'filename',
                'path',
                'offset',
                'length',
              ])
            },
          }}
          rules={[
            {
              required: true,
              message: language('project.cfgmngt.ctrlcmd.required'),
            },
          ]}
        />
        <ProFormText
          hidden={!(orderType === 'version_check' && checkMethod === 'ls')}
          name="path"
          label={language('project.cfgmngt.ctrlcmd.path')}
          width={280}
          rules={[
            {
              required: orderType === 'version_check' && checkMethod === 'ls',
              message: language('project.cfgmngt.ctrlcmd.required'),
            },
          ]}
        />
        <ProFormText
          hidden={
            !(
              orderType === 'version_check' &&
              (checkMethod === 'get_file' || checkMethod === 'md5sum')
            )
          }
          name="filename"
          label={language('project.cfgmngt.ctrlcmd.path')}
          width={280}
          rules={[
            {
              required:
                orderType === 'version_check' &&
                (checkMethod === 'get_file' || checkMethod === 'md5sum'),
              message: language('project.cfgmngt.ctrlcmd.required'),
            },
          ]}
        />
        <ProFormText
          label={language('project.cfgmngt.ctrlcmd.offset')}
          className={styles.offset}
          hidden={
            !(
              orderType === 'version_check' &&
              (checkMethod === 'get_file' || checkMethod === 'md5sum')
            )
          }
          rules={[
            {
              required: true,
              message: language('project.cfgmngt.ctrlcmd.required'),
            },
          ]}
          name="start"
        >
          <Row gutter={4}>
            <Col>
              <ProFormText
                hidden={
                  !(
                    orderType === 'version_check' &&
                    (checkMethod === 'get_file' || checkMethod === 'md5sum')
                  )
                }
                name="offset"
                width={100}
                rules={[
                  {
                    required:
                      orderType === 'version_check' &&
                      (checkMethod === 'get_file' || checkMethod === 'md5sum'),
                    message: language('project.cfgmngt.ctrlcmd.required'),
                  },
                  {
                    pattern: regList.numPattern.regex,
                    message: regList.numPattern.alertText,
                  },
                ]}
              />
            </Col>
            <Col>
              <ProFormText
                name="length"
                label={language('project.cfgmngt.ctrlcmd.readlength')}
                width={100}
                rules={[
                  {
                    required:
                      orderType === 'version_check' &&
                      (checkMethod === 'get_file' || checkMethod === 'md5sum'),
                    message: language('project.cfgmngt.ctrlcmd.required'),
                  },
                  {
                    pattern: regList.numPattern.regex,
                    message: regList.numPattern.alertText,
                  },
                ]}
              />
            </Col>
          </Row>
        </ProFormText>
        <ProFormText
          hidden={!(orderType === 'inner_policy_update')}
          label={language('project.cfgmngt.ctrlcmd.ruletxt')}
          width={280}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: 280,
            }}
          >
            <span>{ruleRes?.filename}</span>
            <span className={styles.uploadButton}>
              <WebUploadr
                isAuto={true}
                accept=".zip"
                upbutext={language('project.sysconf.syscert.upload')}
                maxSize={30000000}
                upurl="/cfg.php?controller=confRemoteCmd&action=storePolicyFile"
                isShowUploadList={false}
                maxCount={1}
                name={true}
                isUpsuccess={true}
                onSuccess={fetchRuleRes}
              />
            </span>
          </div>
        </ProFormText>
        <ProFormText
          hidden={!(orderType === 'inner_policy_update')}
          label={language('project.cfgmngt.ctrlcmd.code')}
          width={280}
        >
          <span>{ruleRes?.md5}</span>
        </ProFormText>
        <ProFormText
          hidden={!(orderType === 'passwd')}
          name="user"
          label={language('project.cfgmngt.ctrlcmd.user')}
          width={280}
          rules={[
            {
              required: orderType === 'passwd',
              message: language('project.cfgmngt.ctrlcmd.required'),
            },
          ]}
        />
        <ProFormText.Password
          hidden={!(orderType === 'passwd')}
          name="passwd"
          label={language('project.cfgmngt.ctrlcmd.password')}
          width={280}
          rules={[
            {
              required: orderType === 'passwd',
              message: language('project.cfgmngt.ctrlcmd.required'),
            },
          ]}
        />
        <ProFormSelect
          hidden={!(orderType === 'dropdata')}
          name="submoduledel"
          label={language('project.cfgmngt.ctrlcmd.submodulename')}
          options={submoduleall}
          width={280}
          rules={[
            {
              required: orderType === 'dropdata',
              message: language('project.cfgmngt.ctrlcmd.required'),
            },
          ]}
        />
        <ProFormText
          label={language('project.cfgmngt.ctrlcmd.ruleid')}
          hidden={!(orderType === 'dropdata')}
          className={styles.offset}
          name="rule"
          rules={[
            {
              required: orderType === 'dropdata',
              message: language('project.cfgmngt.ctrlcmd.required'),
            },
          ]}
        >
          <Row gutter={10}>
            <Col>
              <ProFormSelect
                name="ruleId"
                options={ruleIds}
                width="100px"
                width={100}
                fieldProps={{
                  onChange: (value) => {
                    setRuleType(value)
                  },
                }}
                rules={[
                  {
                    required: orderType === 'dropdata',
                    message: language('project.cfgmngt.ctrlcmd.required'),
                  },
                ]}
              />
            </Col>
            {ruleType === 2 && (
              <Col>
                <ProFormText
                  name="id"
                  width={170}
                  rules={[
                    {
                      required: ruleType === 2,
                      message: language('project.cfgmngt.ctrlcmd.required'),
                    },
                  ]}
                />
              </Col>
            )}
          </Row>
        </ProFormText>
        <ProFormDateTimePicker
          hidden={!(orderType === 'dropdata')}
          label={language('project.cfgmngt.ctrlcmd.overtime')}
          name="overtime"
          width={280}
          rules={[
            {
              required: orderType === 'dropdata',
              message: language('project.cfgmngt.ctrlcmd.required'),
            },
          ]}
        />

        <ProFormText
          name="desc"
          label={language('project.cfgmngt.ctrlcmd.desc')}
          width={280}
        />
        <Divider orientation="left" style={{ marginBottom: 0 }}>
          {language('project.cfgmngt.ctrlcmd.dev')}
        </Divider>
        <div className={styles.devTable}>
          <ProtableModule
            columns={devColumns}
            apishowurl="/cfg.php?controller=confDevice&action=showSynclist"
            clientHeight={150}
            columnvalue="devColumnvalue"
            tableKey="devTable"
            rowkey={(record) => record.devid}
            incID={incID}
            rowSelection={true}
            searchText={devSearch()}
            searchVal={devSearchVal}
            Transmit={Transmit}
          />
        </div>
      </ModalForm>
      <PolicyTable
        ref={sRef}
        tableKeyVal={tableKeyVal}
        modalVal={modalVal}
        recordFind={recordFind}
        assocshowurl={assocshowurl}
        setIncID={setIncID}
        incID={incID}
        assocType={assocType}
      />
    </>
  )
}
