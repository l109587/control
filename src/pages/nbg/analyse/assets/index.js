import React, { useRef, useState, useEffect } from 'react'
import {
  Input,
  message,
  Modal,
  Tree,
  Space,
  Tag,
  Tooltip,
  Spin,
  Typography,
} from 'antd'
import { get, post, postAsync } from '@/services/https'
import { ProTable } from '@ant-design/pro-components'
import {
  FileOutlined,
  UnorderedListOutlined,
  DownloadOutlined,
  LoadingOutlined,
} from '@ant-design/icons'
import { ModalForm, ProFormTextArea, ProFormText } from '@ant-design/pro-form'
import { modalFormLayout } from '@/utils/helper'
import ProCard from '@ant-design/pro-card'
import { Resizable } from 'react-resizable'
import './index.less'
import store from 'store'
import { language } from '@/utils/language'
import iconTypeList from '@/utils/IconType.js'
import osIconList from '@/utils/osiconType.js'
import { convertLegacyProps } from 'antd/lib/button/button'
import download from '@/utils/downnloadfile'
import { fetchAuth } from '@/utils/common'
import { Button } from 'antd/lib/radio'
import { useSelector } from 'umi'
const { Search } = Input

// 调整table表头
const ResizeableTitle = (props) => {
  const { onResize, width, ...restProps } = props

  if (!width) {
    return <th {...restProps} />
  }
  return (
    <Resizable
      width={width}
      height={0}
      onResize={onResize}
      draggableOpts={{ enableUserSelectHack: false }}
    >
      <th {...restProps} />
    </Resizable>
  )
}

export default (tprops) => {
  const contentHeight = useSelector(({ app }) => app.contentHeight)
  const clientHeight = contentHeight - 214
  const writable = fetchAuth()
  const columnslist = [
    {
      title: language('project.sysconf.analysis.idenid'),
      dataIndex: 'id',
      align: 'center',
      width: 80,
      key: 'id',
    },
    {
      title: language('project.mconfig.ectstu'),
      dataIndex: 'online',
      align: 'center',
      width: 80,
      key: 'online',
      render: (text, record, index) => {
        let color = 'success'
        if (record.online == '1') {
          color = 'success'
          text = language('project.sysconf.analysis.online')
        } else {
          color = 'default'
          text = language('project.sysconf.analysis.noline')
        }
        return (
          <Space>
            <Tag style={{ marginRight: 0 }} color={color} key={record.online}>
              {text}
            </Tag>
          </Space>
        )
      },
    },
    {
      title: language('project.sysconf.analysis.idenip'),
      dataIndex: 'ip',
      align: 'left',
      width: 160,
      key: 'ip',
      ellipsis: true,
      sorter: true,
      // sorter: (a,b) => a.ip.length-b.ip.length
    },
    {
      title: language('project.sysconf.analysis.mac'),
      dataIndex: 'mac',
      align: 'left',
      width: 140,
      key: 'mac',
      ellipsis: true,
    },
    {
      title: language('project.sysconf.analysis.macOUI'),
      dataIndex: 'macOUI',
      align: 'left',
      width: 100,
      key: 'macOUI',
      ellipsis: true,
    },
    {
      title: language('project.sysconf.analysis.name'),
      dataIndex: 'name',
      align: 'left',
      width: 160,
      key: 'name',
      ellipsis: true,
    },

    {
      title: language('project.sysconf.analysis.vendor'),
      dataIndex: 'vendor',
      align: 'left',
      key: 'vendor',
      width: 100,
      ellipsis: true,
    },
    {
      title: language('project.sysconf.analysis.identype'),
      dataIndex: 'type',
      align: 'left',
      key: 'type',
      width: 120,
      ellipsis: true,
      render: (text, record, _, action) => {
        return [
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div className="typeIcon" style={{ marginTop: 1 }}>
              {iconTypeList(record.icon)}
            </div>
            <div style={{ width: 5 }}></div>
            <>{record.type}</>
          </div>,
        ]
      },
    },
    {
      title: language('analyse.assets.model'),
      dataIndex: 'model',
      align: 'center',
      width: 100,
      key: 'model',
      ellipsis: true,
    },
    {
      title: language('project.sysconf.analysis.idenstatus'),
      dataIndex: 'identify',
      align: 'center',
      width: 100,
      key: 'identify',
      ellipsis: true,
      valueType: 'select',
      valueEnum: {
        1: {
          text: language('project.sysconf.analysis.idenstaing'),
          status: 'Warning',
        },
        2: {
          text: language('project.sysconf.analysis.idenstaed'),
          status: 'Success',
        },
        0: {
          text: language('project.sysconf.analysis.idenstawill'),
          status: 'Error',
        },
      },
    },
    {
      title: language('project.sysconf.analysis.idensystem'),
      dataIndex: 'os',
      key: 'os',
      align: 'left',
      ellipsis: true,
      width: 140,
      render: (text, record, _, action) => {
        return (
          <Tooltip title={record.os}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div className="typeIcon">{osIconList(record.os)}</div>
              <div>{record.os}</div>
            </div>
          </Tooltip>
        )
      },
    },
    {
      title: language('project.sysconf.analysis.app'),
      dataIndex: 'app',
      align: 'left',
      ellipsis: true,
      key: 'app',
      width: 300,
      render: (text, record, _, action) => {
        let list = record.app.split(',')
        if (record.app == '') {
          return <></>
        } else {
          return list.map((item) => {
            return (
              <Tooltip title={item}>
                {' '}
                <Tag color="blue">{item}</Tag>
              </Tooltip>
            )
          })
        }
      },
    },
    {
      title: language('project.sysconf.analysis.middle'),
      dataIndex: 'middle',
      align: 'left',
      key: 'middle',
      width: 200,
      ellipsis: true,
    },
    {
      title: language('project.sysconf.analysis.idenports'),
      dataIndex: 'port',
      align: 'left',
      key: 'port',
      width: 160,
      ellipsis: true,
    },
    {
      title: language('project.sysconf.analysis.idenment'),
      dataIndex: 'protocol',
      align: 'left',
      key: 'protocol',
      width: 160,
      render: (text, record, index, event, item) => {
        let num = (record.protocol.split(',').length - 1) * 3
        if ((record.protocol.length - num - 1) * 13 > item.width) {
          return (
            <Tooltip placement="top" title={record.protocol}>
              <div className="protoDiv">{record.protocol}</div>
            </Tooltip>
          )
        } else {
          return (
            <>
              <div className="protoDiv">{record.protocol}</div>
            </>
          )
        }
      },
    },
    {
      title: language('netanalyse.nettopo.swIp'),
      dataIndex: 'switchIP',
      align: 'left',
      key: 'switchIP',
      width: 160,
      ellipsis: true,
    },
    {
      title: language('netanalyse.nettopo.swPort'),
      dataIndex: 'switchINF',
      align: 'left',
      key: 'switchINF',
      width: 160,
      ellipsis: true,
    },
    {
      title: 'VLAN',
      dataIndex: 'VLAN',
      align: 'left',
      key: 'VLAN',
      width: 120,
      ellipsis: true,
    },
    {
      title: language('project.sysconf.analysis.idenuptime'),
      dataIndex: 'lasttime',
      align: 'left',
      key: 'lasttime',
      width: 160,
      ellipsis: true,
      // sorter: (a, b) => {
      //     const aTime = new Date(a.lasttime).getTime();
      //     const bTime = new Date(b.lasttime).getTime();
      //     return aTime - bTime
      // }
    },
    // {
    //     title: language('project.mconfig.operate'),
    //     align: 'center',
    //     fixed: 'right',
    //     key: 'operate',
    //     valueType: 'option',
    //     width: 120,
    //     render: (text, record, _) => {
    //         const renderRemoveUser = (text) => (<Popconfirm onConfirm={() => { identify(record, text) }} key="popconfirm" title={language('project.mconfig.operate')}
    //             okButtonProps={{
    //                 loading: confirmLoading,
    //             }} okText={language({'project.yes')} cancelText={language('project.no')}>
    //             <a>{text}</a>
    //         </Popconfirm>);
    //         let node = renderRemoveUser(language("project.sysconf.analysis.identify"));
    //         return [
    //             //  <a key="editable"
    //             //     onClick={() => {
    //             //         // mod(record,'mod');
    //             //     }}>
    //             //     {language("project.deit")}
    //             // </a>,
    //             node];
    //     },
    // },
  ]

  let AsstypeValue
  const formRef = useRef()
  const [columns, setColumns] = useState([])
  const [treelistKey, setTreelistKey] = useState([1]) //设置默认展开节点
  const [modalStatus, setModalStatus] = useState(false) //model 添加弹框状态
  const [dataList, setList] = useState([]) //model 添加弹框状态
  const [selectedRowKeys, setSelectedRowKeys] = useState([]) //选中id数组
  const [delStatus, setipDelStatus] = useState(true) //选中id数组
  const [op, setop] = useState('add') //选中id数组
  const [typeVal, setTypeVal] = useState('-1') //列表搜索参数
  const [queryVal, setQueryVal] = useState('') //搜索值
  const [totEntry, setTotEntry] = useState(0) // 总条数
  const [currPage, setCurrPage] = useState(1) // 当前页码
  const [treelist, setTreelist] = useState([])
  const [loading, setLoading] = useState(false) //加载
  const [sortOrder, setSortOrder] = useState('') // 排序顺序
  const [sortText, setSorttext] = useState('') // 排序字段
  const startVal = 1
  const initLtVal = store.get('pageSize') ? store.get('pageSize') : 50
  const [limitVal, setLimitVal] = useState(initLtVal) // 每页条目
  const queryType = 'fuzzy' //默认模糊查找
  const [zoneId, setZoneId] = useState()
  const { confirm } = Modal
  let concealColumnList = {
    id: { show: false },
    mac: { show: false },
    macOUI: { show: false },
    switchIP: { show: false },
    switchINF: { show: false },
    VLAN: { show: false },
  }
  const [columnsHide, setColumnsHide] = useState(
    store.get('assetscolumnvalue')
      ? store.get('assetscolumnvalue')
      : concealColumnList
  ) //设置默认列
  const [netaddrVal, setNetaddrVal] = useState()
  const [sliderValue, setSliderValue] = useState(16)
  //列表数据
  const actionRef = useRef()
  const [treeValue, setTreeValue] = useState()
  const [treekey, setTreekey] = useState([])
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [filters, setFilters] = useState({})
  // 表头
  const [cols, setCols] = useState(columnslist)
  const [downLoading, setDownLoading] = useState(false)
  const [densitySize, setDensitySize] = useState('middle')
  AsstypeValue = tprops.location?.state?.id

  const searchArr = [currPage, limitVal, queryVal, filters, sortText, sortOrder]
  
  useEffect(() => {
    setLoading(true)
    clearTimeout(window.timer)
    window.timer = setTimeout(function () {
      getList(AsstypeValue)
    }, 100)
  }, searchArr)

  useEffect(() => {
    columnsTablel()
  }, [])

  useEffect(() => {
    setLoading(true)
    clearTimeout(window.timer)
    window.timer = setTimeout(function () {
      getTree()
      getfillter()
    }, 100)
  }, [])

  const getfillter = () => {
    post('/cfg.php?controller=assetMapping&action=filterAssetList')
      .then((res) => {
        let typefillter = []
        let osfillter = []
        let onlinefillter = []
        res.data.map((item) => {
          if (item.filterName == 'type') {
            item.info.map((each) => {
              typefillter.push({ text: each.text, value: each.text })
            })
          } else if (item.filterName == 'os') {
            item.info.map((each) => {
              osfillter.push({ text: each.text, value: each.text })
            })
          } else if (item.filterName == 'online') {
            item.info.map((each) => {
              onlinefillter.push({ text: each.text, value: each.id })
            })
          } else {
          }
        })
        columnslist.map((item) => {
          if (item.dataIndex == 'type') {
            item.filters = typefillter
            item.filterMultiple = false
          } else if (item.dataIndex == 'os') {
            item.filters = osfillter
            item.filterMultiple = false
          } else if (item.dataIndex == 'online') {
            item.filters = onlinefillter
            item.filterMultiple = false
          } else {
          }
        })
        setCols([...columnslist])
      })
      .catch(() => {
        console.log('mistake')
      })
  }

  const columnsTablel = async () => {
    let data = []
    data.module = 'assetsTable'
    let res
    res = await postAsync(
      '/cfg.php?controller=confTableHead&action=showTableHead',
      data
    )
    if (res.density) {
      setDensitySize(res.density)
    }
    if (!res.success || res.data.length < 1) {
      columns?.map((item) => {
        if (!concealColumnList[item.dataIndex] && item.hideInTable != true) {
          let showCon = {}
          showCon.show = true;
          concealColumnList[item.dataIndex] = showCon;
        }
      })
      let data = []
      data.module = 'assetsTable'
      data.value = JSON.stringify(concealColumnList)
      res = await postAsync(
        '/cfg.php?controller=confTableHead&action=setTableHead',
        data
      )
      if (res.success) {
        setColumnsHide(concealColumnList)
      }
    } else {
      setColumnsHide(res.data ? res.data : {})
    }
  }

  const columnsTableChange = (value) => {
    let data = [];
    data.module = 'assetsTable';
    data.value = JSON.stringify(value);
    post('/cfg.php?controller=confTableHead&action=setTableHead', data).then((res) => {
      if (!res.success) {
        message.error(res.msg);
        return false;
      }
      setColumnsHide(value);
    }).catch(() => {
      console.log('mistake')
    })
  }

  const sizeTableChange = (sizeType) => {
    let data = [];
    data.module = 'assetsTable';
    data.density = sizeType;
    post('/cfg.php?controller=confTableHead&action=setTableHead', data).then((res) => {
      if (!res.success) {
        message.error(res.msg);
        return false;
      }
      setDensitySize(sizeType);
    }).catch(() => {
      setDensitySize(sizeType);
      console.log('mistake')
    })
  }

  // 定义头部组件
  const components = {
    header: {
      cell: ResizeableTitle,
    },
  }

  // 处理拖拽
  const handleResize =
    (index) =>
    (e, { size }) => {
      const nextColumns = [...cols]
      // 拖拽时调整宽度
      nextColumns[index] = {
        ...nextColumns[index],
        width: size.width < 75 ? 75 : size.width,
      }

      setCols(nextColumns)
    }

  useEffect(() => {
    setColumns(
      (cols || []).map((col, index) => ({
        ...col,
        onHeaderCell: (column) => ({
          width: column.width,
          onResize: handleResize(index),
        }),
      }))
    )
  }, [cols])

  //资产类型处理
  const getTree = (id = 0) => {
    // let page = pagestart != ''?pagestart:startVal;
    let data = {}
    data.id = id
    post('/cfg.php?controller=assetMapping&action=showAssetClassify', data)
      .then((res) => {
        let totalCount = 0
        let key = []
        if (res.data.length > 0) {
          key.push(res.data[0].id)
          res.data.map((item) => {
            totalCount += item.count - 0
          })
        }
        setZoneId(res.data.id)
        const treeInfo = [
          {
            title: `资产分类 (${totalCount})`,
            key: 'type',
            icon: <UnorderedListOutlined />,
          },
        ]
        let info = []
        if (res.data.length > 0) {
          res.data.map((item) => {
            let isLeaf = false
            let icon = <FileOutlined />
            if (item.isLeaf == 1) {
              isLeaf = false
            }
            info.push({
              key: item.id,
              icon: iconTypeList(item.icon),
              title: item.name + `(${item.count})`,
              isLeaf: 1,
            })
          })
        }
        if (info.length > 0) {
          treeInfo[0].children = info
        }
        setTreelist(treeInfo)
        setTreelistKey(['type'])
        setTypeVal(AsstypeValue || AsstypeValue == 0 ? AsstypeValue : 'type')
        getList(
          startVal,
          limitVal,
          '',
          AsstypeValue || AsstypeValue == 0 ? AsstypeValue : 'type'
        )
      })
      .catch(() => {
        console.log('mistake')
      })
  }

  //地资产类型处理二次请求
  const updateTreeData = (list, key, children) =>
    list.map((node) => {
      if (node.key === key) {
        return { ...node, children }
      }
      if (node.children) {
        return {
          ...node,
          children: updateTreeData(node.children, key, children),
        }
      }
      return node
    })

  //区域管理侧边展开
  const onExpand = (expandedkeysValue) => {
    setTreelistKey(expandedkeysValue)
  }

  //资产类型处理二次请求
  const onLoadDataLeft = ({ key, children }) =>
    new Promise((resolve) => {
      if (children) {
        resolve()
        return
      }
      let info = []
      post('cfg.php?controller=assetMapping&action=showAssetClassify', {
        id: key,
      }).then((res) => {
        if (res.children) {
          res.children.map((item) => {
            let isLeaf = true
            let icon = <FileOutlined />
            if (item.leaf == 'N') {
              isLeaf = false
              icon = <UnorderedListOutlined />
            }
            info.push({
              key: item.id,
              title: item.name,
              isLeaf: isLeaf,
              icon: icon,
            })
          })
        } else {
        }
        setTreelist((origin) => updateTreeData(origin, key, info))
        resolve()
      })
    })
  // 地址规划侧边点击id处理
  const onSelectLeft = (selectedKeys, info) => {
    if (!selectedKeys[0] && selectedKeys[0] != 0) {
      selectedKeys[0] = typeVal == '-1' ? AsstypeValue : typeVal
    }
    setTypeVal(selectedKeys[0]) //更新选中地址id
    setCurrPage(1)
    getList(startVal, limitVal, '', selectedKeys[0])
  }
  //start  数据起始值   limit 每页条数
  const getList = (typeId, pagelimit = '', value = '', type = '') => {
    let data = {}
    data.queryVal = value != '' ? value : queryVal
    data.limit = pagelimit != '' ? pagelimit : limitVal
    data.type =
      type !== ''
        ? type === 'type'
          ? ''
          : type
        : typeVal === 'type'
        ? ''
        : typeVal
    data.start = limitVal * (currPage - 1)
    data.filters = filters
    data.sort = sortText
    if (sortOrder == 'ascend') {
      data.order = 'asc'
    } else if (sortOrder == 'descend') {
      data.order = 'desc'
    } else {
      data.order = ' '
    }
    setLoading(true)
    post('/cfg.php?controller=assetMapping&action=showAssetList', data)
      .then((res) => {
        if (res.data.length > 0) {
          res.data.forEach((each, index) => {
            res.data[index].port = each.port.join(' , ')
            res.data[index].protocol = each.protocol.join(' , ')
            res.data[index].middle = each.middle.join(' , ')
            res.data[index].app = each.app.join(' , ')
          })
        }
        setLoading(false)
        setTotEntry(res.total)
        setList([...res.data])
      })
      .catch(() => {
        console.log('mistake')
      })
  }

  //判断是否弹出添加model
  const getModal = (status, op) => {
    if (status == 1) {
      setop(op)
      setModalStatus(true)
    } else {
      setNetaddrVal()
      setTreeValue() //区域地址名称
      setTreekey([]) //区域地址key
      formRef.current.resetFields()
      setModalStatus(false)
    }
  }

  //添加修改接口
  const save = (info) => {
    //判断选中地址id
    if (treekey.length < 1) {
      message.error(language('project.sysconf.addrplan.choiceregion'))
      return false
    }
    let tVal = treeValue.split('/')
    //判断选中地址名称
    if (tVal.length < 1) {
      message.error(language('project.sysconf.addrplan.choiceregion'))
      return false
    }
    let data = {}
    data.op = op
    data.id = info.id
    data.masksize = sliderValue
    data.netaddr = netaddrVal //区域编号
    data.notes = info.notes
    data.zoneID = treekey[treekey.length - 1] //上级部门ID
    data.zone = tVal[tVal.length - 1] //上级部门名称
    data.gpZoneIDPath = treekey.join('.') //上级部门id 路径
    post('/cfg.php?controller=confIPAddrManage&action=setPlanIPNetAddr', data)
      .then((res) => {
        if (!res.success) {
          message.error(res.msg)
          return false
        }
        getModal(2)
        if (!res.success) {
          message.error(res.msg)
          return false
        }
        setTreeValue('')
        setTreekey([])
        getList()
      })
      .catch(() => {
        console.log('mistake')
      })
  }

  //选中触发
  const onSelectedRowKeysChange = (selectedRowKeys, selectedRows) => {
    // setRecord(record)//选中行重新赋值
    setSelectedRowKeys(selectedRowKeys)
    let deletestatus = true
    if (selectedRowKeys != false) {
      deletestatus = false
    }
    setipDelStatus(deletestatus) //添加删除框状态
  }

  //手动识别处理
  const identify = (record) => {
    let data = {}
    data.id = record.id
    data.ip = record.ip
    post('/cfg.php?controller=assetMapping&action=assetIdentify', data)
      .then((res) => {
        if (!res.success) {
          message.error(res.msg)
          return false
        }
        message.success(language('project.sysconf.analysis.steadsuccess'))
        getList()
        setConfirmLoading(false)
      })
      .catch(() => {
        console.log('mistake')
      })
  }

  //编辑
  const mod = (obj, op) => {
    setTreeValue(obj.gpZonePath) //区域地址名称
    setNetaddrVal(obj.netaddr) //netaddrVal
    let initialValues = obj
    getModal(1, op)
    setTimeout(function () {
      formRef.current.setFieldsValue(initialValues)
    }, 500)
  }

  const loadIcon = <LoadingOutlined spin />

  return (
    <div className="assetConten">
      <Spin spinning={loading}>
        <Spin
          spinning={downLoading}
          tip={language('project.sysdebug.wireshark.loading')}
          indicator={loadIcon}
        >
          <ProCard ghost gutter={[13, 13]}>
            <ProCard
              className="treecard"
              style={{ height: clientHeight + 182 }}
              colSpan="238px"
              title={language('project.sysconf.analysis.cardtitle')}
            >
              <Tree
                loading={loading}
                defaultExpandAll
                showIcon
                onExpand={onExpand}
                expandedKeys={treelistKey}
                loadData={onLoadDataLeft}
                onSelect={onSelectLeft}
                treeData={treelist}
                defaultSelectedKeys={[
                  AsstypeValue || AsstypeValue == 0 ? AsstypeValue : 'type',
                ]}
              />
            </ProCard>
            <ProCard
              colSpan="calc(100% - 238px)"
              ghost
              style={{ height: clientHeight + 182, backgroundColor: 'white' }}
            >
              <div className="components-table-resizable-column">
                <ProTable
                  className="assetsTable"
                  scroll={{ y: clientHeight + 6 }}
                  columnEmptyText={false}
                  size={densitySize}
                  /* 头部组件 */
                  components={components}
                  //边框
                  bordered={true}
                  rowkey="id"
                  //单选框选中变化
                  rowSelection={{
                    selectedRowKeys,
                    onChange: onSelectedRowKeysChange,
                    getCheckboxProps: (record) => ({}),
                  }}
                  //设置选中提示消失
                  tableAlertRender={false}
                  columns={columns}
                  actionRef={actionRef}
                  //页面数据信息
                  dataSource={dataList}
                  editable={{
                    type: 'multiple',
                  }}
                  columnsState={{
                    value: columnsHide,
                    persistenceType: 'sessionStorage',
                    onChange: (value) => {
                      columnsTableChange(value)
                      store.set('assetscolumnvalue', value)
                    },
                  }}
                  rowKey="id"
                  //头部搜索框关闭
                  search={false}
                  onSizeChange={(e) => {
                    sizeTableChange(e);
                  }}
                  form={{
                    // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
                    syncToUrl: (values, type) => {
                      if (type === 'get') {
                        return Object.assign(Object.assign({}, values), {
                          created_at: [values.startTime, values.endTime],
                        })
                      }
                      return values
                    },
                  }}
                  toolBarRender={() => [
                    !writable ? (
                      false
                    ) : (
                      <Tooltip
                        title={language('project.export')}
                        placement="top"
                      >
                        <DownloadOutlined
                          style={{ fontSize: '15px', cursor: 'pointer' }}
                          onClick={() => {
                            download(
                              '/cfg.php?controller=assetMapping&action=exportAssetList',
                              {},
                              setDownLoading
                            )
                          }}
                        />
                      </Tooltip>
                    ),
                  ]}
                  onChange={(paging, filters, sorter) => {
                    setLoading(true)
                    setSortOrder(sorter.order)
                    setSorttext(sorter.field)
                    setFilters(JSON.stringify(filters))
                    setCurrPage(paging.current)
                    setLimitVal(paging.pageSize)
                    store.set('pageSize', paging.pageSize)
                  }}
                  pagination={{
                    showSizeChanger: true,
                    pageSize: limitVal,
                    current: currPage,
                    total: totEntry,
                    showTotal: (total) =>
                      language('project.page', { total: total }),
                  }}
                  options={{
                    reload: function () {
                      setLoading(true)
                      getTree()
                      getfillter()
                    },
                    setting: true,
                  }}
                  dateFormatter="string"
                  headerTitle={
                    <Search
                      allowClear
                      placeholder={language('analyse.assets.searchtext')}
                      className="assetsSearch"
                      onSearch={(queryVal) => {
                        setCurrPage(1)
                        setQueryVal(queryVal)
                      }}
                    />
                  }
                />
              </div>

              <ModalForm
                {...modalFormLayout}
                formRef={formRef}
                title={
                  op == 'add'
                    ? language('project.sysconf.addrplan.newplan')
                    : language('project.sysconf.addrplan.modplan')
                }
                visible={modalStatus}
                autoFocusFirstInput
                modalProps={{
                  maskClosable: false,
                  onCancel: () => {
                    getModal(2)
                  },
                }}
                submitTimeout={2000}
                onFinish={async (values) => {
                  save(values)
                }}
              >
                <ProFormText hidden={true} type="hidden" name="id" label="IP" />
                <ProFormText
                  hidden={true}
                  name="op"
                  label={language('project.sysconf.syszone.opcode')}
                  initialValue={op}
                />
                <ProFormText
                  name="gpname"
                  label={language('project.sysconf.addrplan.area')}
                ></ProFormText>

                <ProFormText
                  rules={[
                    { required: true, message: language('project.fillin') },
                  ]}
                  name="netaddr"
                  label={language('project.sysconf.addrplan.netaddress')}
                  data-value={sliderValue}
                  onChange={(e) => {
                    setNetaddrVal(e.target.value)
                  }}
                />

                <ProFormText
                  name="masksize"
                  label={language('project.sysconf.addrplan.netmask')}
                ></ProFormText>
                <ProFormText
                  name="startIPAddr"
                  label={language('project.sysconf.addrplan.startaddress')}
                ></ProFormText>
                <ProFormText
                  name="endIPAddr"
                  label={language('project.sysconf.addrplan.endaddress')}
                ></ProFormText>
                <ProFormTextArea
                  width="xl"
                  name="notes"
                  label={language('project.remark')}
                />
              </ModalForm>
            </ProCard>
          </ProCard>
        </Spin>
      </Spin>
    </div>
  )
}
