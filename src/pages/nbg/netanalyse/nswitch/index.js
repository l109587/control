import React, { useRef, useState, useEffect } from 'react'
import { FormattedMessage, history, useSelector } from 'umi'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import {
  ModalForm,
  ProFormText,
  ProFormSelect,
} from '@ant-design/pro-components'
import { modalFormLayout } from '@/utils/helper'
import { Modal, Input, Tag, Select } from 'antd'
import { language } from '@/utils/language'
import { post, get } from '@/services/https'
import { msg } from '@/utils/fun'
import { regList, regIpList } from '@/utils/regExp'
import { TableLayout } from '@/components'
import { Flashlamp } from '@icon-park/react'
import { fetchAuth } from '@/utils/common';
const { ProtableModule } = TableLayout
const { confirm } = Modal
const { Search } = Input
const { Option } = Select

export default function NSwitch() {
  const contentHeight = useSelector(({ app }) => app.contentHeight)
  let clientHeight = contentHeight - 220
  const writable = fetchAuth()
  const addButton = true //增加按钮  与 addClick 方法 组合使用
  const delButton = true //删除按钮 与 delClick 方法 组合使用
  const rowSelection = true //是否开启多选框
  const concealColumns = { }
  const [queryVal, setQueryVal] = useState('') //首个搜索框的值
  const [editRecord, setEditRecord] = useState({})
  const [modalStatus, setModalStatus] = useState(false) //控制添加/编辑弹窗
  const [incID, setIncID] = useState(0) //递增的id 删除/添加的时候增加触发刷新
  const [switchType, setSwitchType] = useState([]) //存储设备厂商
  const [snmpModelList, setSnmpModelList] = useState([]) //存储SNMP模板
  const [state, setState] = useState(0) //网络设备状态
  const [snmpOption, setSnmpOption] = useState([]) //select snmp模板选项
  const [snmp, setSnmp] = useState(0) //snmp模板

  const formRef = useRef()
  let searchVal = {
    value: queryVal,
    type: 'fuzzy',
    state: state,
    snmp: snmp,
  } //顶部搜索框值 传入接口

  useEffect(() => {
    getSwitchTypeList()
    getSnmpModelList()
  }, [])
  const coreMap = {
    0: language('netanalyse.nswitch.converge'),
    1: language('netanalyse.nswitch.heart'),
    2: language('netanalyse.nswitch.access'),
  }
  const stateMap = {
    0: language('netanalyse.nswitch.error'),
    1: language('netanalyse.nswitch.success'),
    2: language('netanalyse.nswitch.accerror'),
    3: language('netanalyse.nswitch.accerror'),
    4: language('netanalyse.nswitch.accerror'),
    5: language('netanalyse.nswitch.noacc'),
    6: language('netanalyse.nswitch.parsfail'),
    7: language('netanalyse.nswitch.ignore'),
    8: language('netanalyse.nswitch.abnormal'),
    9: language('netanalyse.nswitch.abnormal')
  }
  const getSwitchTypeList = () => {
    post('/cfg.php?controller=assetMapping&action=getSwitchVenderList')
      .then((res) => {
        const arr = []
        res.data?.map((e) => arr.push({ lable: e.name, value: e.value }))
        setSwitchType(arr)
      })
      .catch(() => {
        console.log('mistake')
      })
  }
  const getSnmpModelList = () => {
    post('/cfg.php?controller=assetMapping&action=getSnmpModelList')
      .then((res) => {
        setSnmpOption(res.data)
        const arr = []
        res.data?.map((e) => arr.push({ lable: e.name, value: e.value }))
        setSnmpModelList(arr)
      })
      .catch(() => {
        console.log('mistake')
      })
  }
  const columnsList = [
    {
      title: language('project.sysconf.network.state'),
      width: 80,
      dataIndex: 'state',
      key: 'state',
      align: 'center',
      // ellipsis: true,
      // render: (val) => <Tag color="default">{stateMap[val]}</Tag>,
      render: (val) => {
        let color = 'default'
        switch (val) {
          case '0':
            color = 'default'
            break
          case '1':
            color = '#87d068'
            break
          case '2':
            color = 'default'
            break
          case '3':
            color = 'default'
            break
          case '4':
            color = 'default'
            break
          case '5':
            color = 'default'
            break
          case '6':
            color = 'default'
            break
          case '7':
            color = 'default'
            break
          case '8':
            color = '#cd201f'
            break
            case '9':
              color = '#cd201f'
              break
        }
        return (
          <Tag style={{ border: 0, marginRight: 0 }} color={color}>
            {stateMap[val]}
          </Tag>
        )
      },
    },
    {
      title: language('netanalyse.nswitch.core'),
      width: 80,
      dataIndex: 'core',
      key: 'core',
      align: 'center',
      // ellipsis: true,
      // render: (val) => coreButtonmap[val],
      render: (val) => {
        let color = 'default'
        switch (val) {
          case '0':
            color = '#55acee'
            break
          case '1':
            color = '#cd201f'
            break
          case '2':
            color = '#87d068'
            break
        }
        return (
          <Tag style={{ border: 0, marginRight: 0 }} color={color}>
            {coreMap[val]}
          </Tag>
        )
      },
    },
    {
      title: language('project.devname'),
      width: 120,
      dataIndex: 'name',
      key: 'name',
      align: 'left',
      ellipsis: true,
    },
    {
      title: language('netanalyse.nswitch.ip'),
      width: 160,
      dataIndex: 'ip',
      key: 'ip',
      align: 'left',
      ellipsis: true,
    },
    {
      title: language('netanalyse.nswitch.vender'),
      width: 80,
      dataIndex: 'vender',
      key: 'vender',
      align: 'left',
      ellipsis: true,
    },
    {
      title: language('netanalyse.nswitch.model'),
      width: 80,
      dataIndex: 'model',
      key: 'model',
      align: 'left',
      ellipsis: true,
    },
    {
      title: language('netanalyse.nswitch.ifNum'),
      width: 80,
      dataIndex: 'ifNum',
      key: 'ifNum',
      align: 'left',
      render: (val, record) => {
        return val == '0' ? (
          val
        ) : (
          <a
            onClick={() => {
              history.push({
                pathname: '/netanalyse/nswitch/port',
                query: {
                  ip: record.ip,
                },
              })
            }}
          >
            {val}
          </a>
        )
      },
    },
    {
      title: language('netanalyse.nswitch.termNum'),
      width: 80,
      dataIndex: 'termNum',
      key: 'termNum',
      align: 'left',
      ellipsis: true,
    },
    {
      title: language('netanalyse.nswitch.cpu'),
      width: 110,
      dataIndex: 'cpu',
      key: 'cpu',
      align: 'left',
      ellipsis: true,
    },
    {
      title: language('netanalyse.nswitch.mem'),
      width: 110,
      dataIndex: 'mem',
      key: 'mem',
      align: 'left',
      ellipsis: true,
    },
    {
      title: language('monitor.devtmpl.DiscoverConfig'),
      width: 100,
      dataIndex: 'snmp',
      key: 'snmp',
      align: 'left',
      ellipsis: true,
    },
    {
      title: language('alarmdt.details'),
      width: 180,
      dataIndex: 'detail',
      key: 'detail',
      align: 'center',
      render: (val, record) => {
        if (record.detail) {
          return (
            <Tag style={{ border: 0 }} color="#cd201f ">
              {val}
            </Tag>
          )
        } else {
          return <>-</>
        }
      },
    },
    {
      title: language('project.updateTime'),
      width: 150,
      dataIndex: 'updatetime',
      key: 'updatetime',
      align: 'left',
      ellipsis: true,
    },

    {
      title: language('project.operate'),
      key: 'option',
      width: 120,
      valueType: 'option',
      align: 'center',
      ellipsis: true,
      fixed: 'right',
      hideInTable: !writable,
      render: (_, record) => [
        <a key="1" onClick={() => editConfig(record)}>
          {language('project.alter')}
        </a>,
      ],
    },
  ]

  /* 顶部左侧搜索框*/
  const tableTopSearch = () => {
    return (
      <div  className='nswitchSearch'>
        <Search
          placeholder={language('netanalyse.nettopo.swIp')}
          onSearch={(queryVal) => {
            setQueryVal(queryVal)
            setIncID(incID + 1)
          }}
        />
        <Select
          defaultValue="0"
          style={{
            width: 130,
            marginLeft: '24px',
          }}
          onChange={(e) => {
            setSnmp(e)
            setIncID(incID + 1)
          }}
        >
          <Option value="0">{language('monitor.devtmpl.DiscoverConfig')}</Option>
          {snmpOption?.map((item) => (
            <Option value={item.value}>{item.name}</Option>
          ))}
        </Select>
        <Select
          defaultValue="0"
          style={{
            width: 100,
            marginLeft: '24px',
          }}
          onChange={(e) => {
            setState(e)
            setIncID(incID + 1)
          }}
        >
          <Option value="0">{language('project.sysconf.network.status')}</Option>
          <Option value="1">{language('netanalyse.nswitch.success')}</Option>
          <Option value="2">{language('netanalyse.nswitch.abnormal')}</Option>
          <Option value="3">{language('netanalyse.nswitch.ignore')}</Option>
          <Option value="4">{language('netanalyse.nswitch.noacc')}</Option>
        </Select>
      </div>
    )
  }

  //打开添加弹窗
  const addConfig = () => {
    setEditRecord({})
    setModalStatus(true)
  }
  //打开编辑弹窗
  const editConfig = (record) => {
    const newRecord = {
      ...record,
      venderValue: record.vender,
      modelValue: record.model,
      snmpValue: record.snmp,
    }
    setEditRecord(newRecord)
    setModalStatus(true)
  }

  //点击删除按钮
  const delClick = (selectedRowKeys, dataList, selectedRows) => {
    let sum = selectedRowKeys.length
    confirm({
      className: 'addrplanbox',
      icon: <ExclamationCircleOutlined />,
      title: language('project.delconfirm'),
      content: language('project.cancelcon', { sum: sum }),
      onOk() {
        delList(selectedRows)
      },
    })
  }
  const delList = (selectedRows) => {
    const idsArr = selectedRows?.map((e) => e.id)
    const ids = idsArr.join(',') + ','
    const namesArr = selectedRows?.map((e) => e.name)
    const names = namesArr.join(',') + ','
    const ipsArr = selectedRows?.map((e) => e.ip)
    const ips = ipsArr.join(',') + ','
    post('/cfg.php?controller=assetMapping&action=delSwitch', {
      ids,
      names,
      ips,
    })
      .then((res) => {
        setIncID(incID + 1)
        msg(res)
      })
      .catch(() => {
        console.log('mistake')
      })
  }

  //创建编辑确认
  const Save = () => {
    if (editRecord.id) {
      const data = formRef.current.getFieldsValue(true)
      post('/cfg.php?controller=assetMapping&action=modifySwitch', data)
        .then((res) => {
          if (!res.success) {
            return false
          }
          setModalStatus(false)
          setIncID(incID + 1)
          msg(res)
        })
        .catch(() => {
          console.log('mistake')
        })
    } else {
      const datas = formRef.current.getFieldsValue(true)
      const defaultValue = {
        switchType: '',
        venderValue: '',
        core: '',
        modelValue: '',
        telnetValue: '',
      }
      const data = { ...defaultValue, ...datas }
      post('/cfg.php?controller=assetMapping&action=addSwitch', data)
        .then((res) => {
          if (!res.success) {
            return false
          }
          setModalStatus(false)
          setIncID(incID + 1)
          msg(res)
        })
        .catch(() => {
          console.log('mistake')
        })
    }
  }
  return (
    <div>
      <ProtableModule
        columns={columnsList}
        className="tablelist"
        tableKey="nSwitch"
        rowkey={(record) => record.id}
        apishowurl="/cfg.php?controller=assetMapping&action=getSwitchlist"
        rowSelection={rowSelection}
        searchVal={searchVal}
        addButton={addButton}
        delButton={delButton}
        addClick={addConfig}
        delClick={delClick}
        searchText={tableTopSearch()}
        concealColumns={concealColumns}
        columnvalue={'nswitchTable'}
        incID={incID}
        clientHeight={clientHeight}
      />
      <ModalForm
        onFinish={async (values) => {
          Save(values)
        }}
        initialValues={editRecord}
        modalProps={{
          destroyOnClose: true,
          maskClosable: false,
        }}
        formRef={formRef}
        visible={modalStatus}
        onVisibleChange={setModalStatus}
        {...modalFormLayout}
        title={
          Object.keys(editRecord).length === 0 ? (
            <FormattedMessage id="project.add" />
          ) : (
            <FormattedMessage id="project.alter" />
          )
        }
      >
        <ProFormText
          label={language('project.devname')}
          name="name"
          rules={[
            {
              required: true,
              message: language('project.mandatory'),
            },
            {
              pattern: regList.strmax.regex,
              message: regList.strmax.alertText,
            },  
          ]}
        />
        <ProFormText
          label={language('netanalyse.nswitch.ip')}
          name="ip"
          rules={[
            {
              required: true,
              message: language('project.mandatory'),
            },
            {
              pattern: regIpList.ipv6oripv4.regex,
              message: regIpList.ipv6oripv4.alertText,
            },
          ]}
        />
        <ProFormSelect
          label={language('netanalyse.nswitch.swphyMacitchType')}
          name="switchType"
          placeholder={language('project.select')}
          // fieldProps={{
          //   defaultValue: '0',
          // }}
          options={[
            { label: language('netanalyse.nswitch.exchange'), value: 0 },
            { label: language('netanalyse.nswitch.router'), value: 1 },
            { label: language('netanalyse.nswitch.2NAT'), value: 2 },
          ]}
        />
        <ProFormSelect
          label={language('netanalyse.nswitch.vender')}
          name="venderValue"
          placeholder={language('project.select')}
          options={switchType}
        />
        <ProFormText 
          label={language('netanalyse.nswitch.model')} 
          name="modelValue" 
          rules={[
            {
              pattern: regList.strmax.regex,
              message: regList.strmax.alertText,
            },
          ]}
        />
        <ProFormSelect
          label={language('monitor.devtmpl.DiscoverConfig')}
          name="snmpValue"
          placeholder={language('project.select')}
          options={snmpModelList}
        />
        <ProFormSelect
          label={language('netanalyse.nswitch.core')}
          name="core"
          placeholder={language('project.select')}
          options={[
            { label: language('netanalyse.nswitch.converge.change'), value: '0' },
            { label: language('netanalyse.nswitch.heart.change'), value: '1' },
            { label: language('netanalyse.nswitch.access.change'), value: '2' },
          ]}
        />
      </ModalForm>
    </div>
  )
}
