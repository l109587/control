import React, { useRef, useState, useEffect, Children } from 'react'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { Modal, Input } from 'antd'
import { post, get } from '@/services/https'
import {
  ModalForm,
  ProFormText,
  ProFormSelect,
} from '@ant-design/pro-components'
import '@/utils/box.less'
import store from 'store'
import { language } from '@/utils/language'
import { msg } from '@/utils/fun'
import { modalFormLayout } from '@/utils/helper'
import { TableLayout } from '@/components'
import { regList } from '@/utils/regExp'
import { useSelector } from 'umi'
const { ProtableModule } = TableLayout
const { Search } = Input

export default () => {
  const contentHeight = useSelector(({ app }) => app.contentHeight)
  const clientHeight = contentHeight - 264
  const flagMap = {
    1: language('netanalyse.nettopo.handop'),
    2: 'CDP',
    3: 'MAC',
    4: language('netanalyse.nettopo.route'),
  }

  const columns = [
    {
      title: language('project.devname'),
      dataIndex: 'name',
      align: 'left',
      width: '20%',
      key: 'name',
      ellipsis: true,
    },
    {
      title: language('netanalyse.nettopo.swIp'),
      align: 'left',
      width: '20%',
      dataIndex: 'swIp',
      key: 'swIp',
      ellipsis: true,
    },
    {
      title: language('netanalyse.nettopo.swPort'),
      dataIndex: 'swPort',
      align: 'left',
      width: '20%',
      key: 'swPort',
      ellipsis: true,
    },
    {
      title: language('netanalyse.nettopo.linkIp'),
      align: 'left',
      width: '20%',
      dataIndex: 'linkIp',
      key: 'linkIp',
      ellipsis: true,
    },
    {
      title: language('netanalyse.nettopo.linkPort'),
      align: 'left',
      width: '20%',
      dataIndex: 'linkPort',
      key: 'linkPort',
      ellipsis: true,
    },
    {
      title: language('netanalyse.nettopo.flag'),
      align: 'left',
      width: '10%',
      dataIndex: 'flag',
      key: 'flag',
      ellipsis: true,
      render: (val, record) => {
        return flagMap[record.flag]
      },
    },
    // {
    // 	title: language('project.operate'),
    // 	align: 'center',
    // 	width: '10%',
    // 	valueType: 'option',
    // 	key: 'option',
    // 	render: (text, record, _, action) => [
    // 		<a key="editable"
    // 			onClick={() => {
    // 				mod(record, 'mod');
    // 			}}>
    // 			{language('project.revise')}</a>,
    // 	],
    // },
  ]

  const formRef = useRef()
  const [switchip, setSwitchip] = useState([])
  const [swPort, setSwPort] = useState([])
  const [linkport, setLinkport] = useState([])
  const [modalStatus, setModalStatus] = useState(false) //model 添加弹框状态
  const [op, setop] = useState('add') //选中状态
  const [queryVal, setQueryVal] = useState() //首个搜索框的值
  const { confirm } = Modal
  const tableKey = 'topotable'
  let searchVal = { value: queryVal, type: 'fuzzy' } //顶部搜索框值 传入接口
  // const columnvalue = 'maccolumnvalue'
  const setcolumnKey = 'pro-table-singe-demos-topotable'
  const apishowurl = '/cfg.php?controller=assetMapping&action=showTopoList'
  const concealColumns = {
    id: { show: false },
  }
  const rowKey = (record) => record.name //列表唯一值
  const tableHeight = clientHeight  //列表高度
  const rowSelection = true //是否开启多选框
  const addButton = true //增加按钮  与 addClick 方法 组合使用
  const delButton = true //删除按钮 与 delClick 方法 组合使用
  const [incID, setIncID] = useState(0) //递增的id 删除/添加的时候增加触发刷新

  const tableTopSearch = () => {
    return (
      <Search
        placeholder={language('project.search')}
        style={{ width: 200 }}
        allowClear
        onSearch={(queryVal) => {
          setQueryVal(queryVal)
          setIncID(incID + 1)
        }}
      />
    )
  }

  useEffect(() => {
    getSwitch()
  }, [])

  // 获取交换机列表
  const getSwitch = () => {
    let data = {}
    post('/cfg.php?controller=assetMapping&action=getSwitchip', data)
      .then((res) => {
        if (res.success) {
          setSwitchip(res.data)
        }
      })
      .catch(() => {
        console.log('mistake')
      })
  }

  // 获取端口列表
  const getPort = (values) => {
    let data = {}
    data.swIp = values
    data.noVlan = 1
    data.start = 0
    post('/cfg.php?controller=assetMapping&action=getPortName', data)
      .then((res) => {
        if (res.success) {
          let pdata = []
          res.data.map((item) => {
            // 2在线 0关闭 1空闲
            let statusMap = {
              0: language('netanalyse.nettopo.colSta'),
              1: language('netanalyse.nettopo.idleSta'),
              2: language('netanalyse.nettopo.onlineSta'),
            }
            switch (item.ifStatus) {
              case 0:
                break
              case 1:
                break
              case 2:
            }
            let swportlist = {}
            swportlist.label = statusMap[item.ifStatus] + item.ifName
            swportlist.value = item.ifName
            swportlist.key = item.ifName
            pdata.push(swportlist)
          })
          setSwPort(pdata)
        }
      })
      .catch(() => {
        console.log('mistake')
      })
  }

  // 获取端口列表
  const getLinkPort = (value) => {
    let data = {}
    data.swIp = value
    data.noVlan = 1
    data.start = 0
    post('/cfg.php?controller=assetMapping&action=getPortName', data)
      .then((res) => {
        if (res.success) {
          let pdata = []
          res.data.map((item) => {
            // 2在线 0关闭 1空闲
            let statusMap = {
              0: language('netanalyse.nettopo.colSta'),
              1: language('netanalyse.nettopo.idleSta'),
              2: language('netanalyse.nettopo.onlineSta'),
            }
            switch (item.ifStatus) {
              case 0:
                break
              case 1:
                break
              case 2:
            }
            let swportlist = {}
            swportlist.label = statusMap[item.ifStatus] + item.ifName
            swportlist.value = item.ifName
            swportlist.key = item.ifName
            pdata.push(swportlist)
          })
          setLinkport(pdata)
        }
      })
      .catch(() => {
        console.log('mistake')
      })
  }

  //删除弹框
  const showDeleteConfirm = (selectedRowKeys, dataList, record) => {
    let sum = selectedRowKeys.length
    confirm({
      className: 'topoDelModal',
      icon: <ExclamationCircleOutlined />,
      title: language('project.delconfirm'),
      content: language('project.cancelcon', { sum: sum }),
      onOk() {
        delList(selectedRowKeys, dataList, record)
      },
      bodyStyle: {
        padding: '32px 32px 24px'
      }
    })
  }

  const delList = (selectedRowKeys, dataList, record) => {
    let arr = []
    record.map((item, index) => {
      arr.push(item.swIp + '-' + item.linkIp)
    })
    let data = {}
    data.swIp = arr.join(',')
    post('/cfg.php?controller=assetMapping&action=delTopo', data)
      .then((res) => {
        if (!res.success) {
          msg(res)
          return false
        }
        setIncID(incID + 1)
        msg(res)
      })
      .catch(() => {
        console.log('mistake')
      })
  }

  //添加按钮点击触发
  const addClick = () => {
    getModal(1, 'add')
  }

  //弹出编辑model
  const getModal = (status, op) => {
    setop(op)
    if (status == 1) {
      setModalStatus(true)
    } else {
      formRef.current.resetFields()
      setModalStatus(false)
    }
  }

  const closeModal = () => {
    formRef.current.resetFields()
    getModal(2)
  }

  //赋值编辑表格
  const mod = (obj) => {
    let initialValues = obj
    setTimeout(function () {
      formRef.current.setFieldsValue(initialValues)
    }, 100)
    getModal(1, 'mod')
  }

  // 修改编辑
  const Save = (info) => {
    let url =
      op == 'add'
        ? '/cfg.php?controller=assetMapping&action=addTopo'
        : '/cfg.php?controller=assetMapping&action=setTopo'
    let data = {}
    data.name = info.name
    data.swIp = info.swIp
    data.ifIndex = info.ifIndex
    data.linkIp = info.linkIp
    data.linkIfIndex = info.linkIfIndex
    post(url, data)
      .then((res) => {
        if (!res.success) {
          msg(res)
          return false
        }
        closeModal() //关闭modal弹框
        setIncID(incID + 1)
      })
      .catch(() => {
        console.log('mistake')
      })
  }

  return (
    <div>
      <ProtableModule
        concealColumns={concealColumns}
        columns={columns}
        apishowurl={apishowurl}
        incID={incID}
        clientHeight={tableHeight}
        tableKey={tableKey}
        searchText={tableTopSearch()}
        searchVal={searchVal}
        rowkey={rowKey}
        delButton={delButton}
        delClick={showDeleteConfirm}
        addButton={addButton}
        addClick={addClick}
        columnvalue={'nettopoTable'}
        rowSelection={rowSelection}
      />
      <ModalForm
        className="topoform"
        onFinish={async (values) => {
          Save(values)
        }}
        formRef={formRef}
        {...modalFormLayout}
        title={
          op == 'add' ? language('project.add') : language('project.alter')
        }
        visible={modalStatus}
        autoFocusFirstInput
        modalProps={{
          maskClosable: false,
          onCancel: () => {
            getModal(2)
          },
        }}
        onVisibleChange={setModalStatus}
        submitTimeout={2000}
      >
        <ProFormText
          label={language('project.devname')}
          name="name"
          rules={[
            { 
              required: true, 
              message: language('project.mandatory') 
            },
            {
              pattern: regList.strmax.regex,
              message: regList.strmax.alertText,
            },    
          ]}
        />
        <ProFormSelect
          label={language('netanalyse.nettopo.swIp')}
          name="swIp"
          request={async () => {
            let res = []
            switchip.map((item) => {
              let switchlist = []
              switchlist['label'] = item.swIp
              switchlist['value'] = item.swIp
              res.push(switchlist)
            })
            return res
          }}
          onChange={(values) => {
            getPort(values)
          }}
        />
        <ProFormSelect
          label={language('netanalyse.nettopo.swPort')}
          name="ifIndex"
          options={swPort}
          fieldProps={{
            placeholder: language('project.select'),
          }}
        />
        <ProFormSelect
          label={language('netanalyse.nettopo.linkIp')}
          request={async () => {
            let res = []
            switchip.map((item) => {
              let switchlist = []
              switchlist['label'] = item.swIp
              switchlist['value'] = item.swIp
              switchlist['key'] = item.ifNum
              res.push(switchlist)
            })
            return res
          }}
          fieldProps={{
            placeholder: language('project.select'),
          }}
          onChange={(values) => {
            getLinkPort(values)
          }}
          name="linkIp"
        />
        <ProFormSelect
          label={language('netanalyse.nettopo.linkPort')}
          name="linkIfIndex"
          options={linkport}
          fieldProps={{
            placeholder: language('project.select'),
          }}
        />
      </ModalForm>
    </div>
  )
}
