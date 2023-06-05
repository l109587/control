import React, { useRef, useState, useEffect } from 'react'
import ProCard from '@ant-design/pro-card'
import { post, get, postAsync } from '@/services/https'
import { Space, message, Tag, Tooltip, Input, Spin, Pagination } from 'antd'
import { ProTable } from '@ant-design/pro-components'
import { DownloadOutlined } from '@ant-design/icons'
import '@/utils/box.less'
import './index.less'
import store from 'store'
import moment from 'moment'
import ProxyServicesImg from '@/assets/nfd/analys-illser-proxyservices.svg'
import LocationImg from '@/assets/nfd/nbg-analyse-illsvr-location.svg'
import AnonyouServicesImg from '@/assets/nfd/analys-illser-anonyouservices.svg'
import RemoteServesImg from '@/assets/nfd/analys-illser-remote.svg'
import AnonSummaryImg from '@/assets/nfd/analys-illser-anonsummary.svg'
import ProxySummaryImg from '@/assets/nfd/analys-illser-proxysummary.svg'
import RemoteSummaryImg from '@/assets/nfd/analys-illser-remotesummary.svg'
import LocationSummaryImg from '@/assets/nfd/analys-illser-locationsummary.svg'
import { language } from '@/utils/language'
import { TableLayout } from '@/components'
import { Resizable } from 'react-resizable'
import { fetchAuth } from '@/utils/common'
import { FaSlack } from 'react-icons/fa'
import download from '@/utils/downnloadfile'
import { stringify } from 'qs'
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

export default () => {
  const contentHeight = useSelector(({ app }) => app.contentHeight)
  let clientHeight = contentHeight - 383
  const columnslist = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80,
      align: 'center',
      key: 'id',
    },
    {
      title: language('project.analyse.status'),
      dataIndex: 'online',
      align: 'center',
      key: 'online',
      width: 100,
      render: (text, record, index) => {
        let color = ' '
        if (text == '0') {
          color = 'purple'
          text = language('analyse.illinn.done')
        } else if (text == '1') {
          color = 'orange'
          text = language('analyse.illinn.firfind')
        } else if (text == '2') {
          color = 'red'
          text = language('analyse.illinn.finds')
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
      width: 100,
      title: language('project.analyse.illout.host'),
      dataIndex: 'devName',
      ellipsis: true,
      key: 'devName',
    },
    {
      width: 120,
      title: language('analyse.illsvr.addr'),
      dataIndex: 'addr',
      ellipsis: true,
      key: 'addr',
      sorter: true,
    },
    {
      title: language('analyse.illsvr.mac'),
      width: 120,
      dataIndex: 'mac',
      ellipsis: true,
      key: 'mac',
    },
    {
      title: language('analyse.illsvr.port'),
      dataIndex: 'port',
      width: 80,
      ellipsis: true,
      key: 'port',
      sorter: true,
    },
    {
      title: language('project.analyse.illinn.info'),
      width: 430,
      dataIndex: 'type',
      key: 'type',
      ellipsis: true,
      render: (text, record, index) => {
        if (record.info.type == 'anon') {
          return (
            <div className="infobox">
              <Tag color="#FAAD15">
                <img
                  src={AnonyouServicesImg}
                  className="infostyle"
                  style={{ marginRight: -2 }}
                />{' '}
                <span className="infotext">
                  {language('analyse.illsvr.anonser')}
                </span>
              </Tag>
              <Tag color="cyan">{record.info.basic}</Tag>
              {record.info.detail != '' ? (
                <Tooltip title={record.info.detail}>
                  <Tag color="volcano">{record.info.detail}</Tag>
                </Tooltip>
              ) : (
                <></>
              )}
            </div>
          )
        } else if (record.info.type == 'proxy') {
          return (
            <div className="infobox">
              <Tag style={{ textAlign: 'center' }} color="#BD3124">
                <img src={ProxyServicesImg} className="infostyle" />
                <span className="infotext">
                  {language('analyse.illsvr.proxyser')}
                </span>
              </Tag>
              <Tag color="cyan">{record.info.basic}</Tag>
              {record.info.detail != '' ? (
                <Tooltip title={record.info.detail}>
                  <Tag color="volcano">{record.info.detail}</Tag>
                </Tooltip>
              ) : (
                <></>
              )}
            </div>
          )
        } else if (record.info.type == 'remote') {
          return (
            <div className="infobox">
              <Tag color="#FF7429">
                {' '}
                <img src={RemoteServesImg} className="infostyle" />
                <sapn className="infotext">
                  {language('analyse.illsvr.remoteser')}
                </sapn>
              </Tag>
              <Tag color="cyan">{record.info.basic}</Tag>
              {record.info.detail != '' ? (
                <Tooltip title={record.info.detail}>
                  <Tag color="volcano">{record.info.detail}</Tag>
                </Tooltip>
              ) : (
                <></>
              )}
            </div>
          )
        } else {
          return (
            <div className="infobox">
              <Tag style={{ textAlign: 'center' }} color="#79B8F3">
                <img src={LocationImg} className="infostyle" />
                <span className="infotext">
                  {language('analyse.illsvr.locationser')}
                </span>
              </Tag>
              <Tag color="cyan">{record.info.basic}</Tag>
              {record.info.detail != '' ? (
                <Tooltip title={record.info.detail}>
                  <Tag color="volcano">{record.info.detail}</Tag>
                </Tooltip>
              ) : (
                <></>
              )}
            </div>
          )
        }
      },
    },
    {
      title: language('project.analyse.series.lasttime'),
      width: 140,
      dataIndex: 'lastTM',
      ellipsis: true,
      key: 'lastTM',
    },
    {
      title: language('project.analyse.series.firstime'),
      width: 140,
      dataIndex: 'firstTM',
      ellipsis: true,
      key: 'firstTM',
    },
  ]

  const writable = fetchAuth()
  const concealColumns = {
    id: { show: false },
  }
  let concealColumnList = concealColumns
  const dateFormat = 'YYYY/MM/DD HH:mm:ss'
  const tableKey = 'illsvr'
  const columnvalue = 'svrcolumnvalue'
  const [columnsHide, setColumnsHide] = useState(
    store.get(columnvalue) ? store.get(columnvalue) : concealColumns
  ) // 设置默认列
  const [loading, setLoading] = useState(true) //加载
  const [anoncount, setAnoncount] = useState([])
  const [proxycount, setProxycount] = useState([])
  const [remotecount, setRemotecount] = useState([])
  const [addrcount, setAddrcount] = useState([])
  const initLtVal = store.get(tableKey) ? store.get(tableKey) : 20
  const [limitVal, setLimitVal] = useState(initLtVal) // 每页条目
  const [currPage, setCurrPage] = useState(1) // 当前页码
  const [totEntry, setTotEntry] = useState(2) // 总条数
  const [queryVal, setQueryVal] = useState(null) //首个搜索框的值
  // 表格列
  const [cols, setCols] = useState(columnslist)
  const [columns, setColumns] = useState([])
  const [filters, setFilters] = useState({})
  const [sortOrder, setSortOrder] = useState('') // 排序顺序
  const [sortText, setSorttext] = useState('') // 排序字段
  const [data, setData] = useState([])
  const [filterValue, setFilterValue] = useState({})
  const [downLoading, setDownLoading] = useState(false)
  const searchArr = [currPage, queryVal, sortText, sortOrder]
  const [densitySize, setDensitySize] = useState('middle')
  const [fvalue, setFValue] = useState({})
  const [isTotal, setIsTotal] = useState('')
  const downloadClick = () => {
    download('/cfg.php?controller=assetMapping&action=exportVioService', '', setDownLoading)
  }


  useEffect(() => {
    getSummary()
    getfillter()
    showTableConf()
  }, [])

  useEffect(() => {
    setLoading(true)
    getListdata()
  }, searchArr)

  useEffect(() => {
    setFilters(JSON.stringify(filterValue))
    setCurrPage(1)
  }, [filterValue])

  useEffect(() => {
    setCurrPage(1)
    getListdata()
  }, [limitVal])

  useEffect(() => {
    setCurrPage(1)
    getListdata()
  }, [filters])

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

  /* 顶部概要数据 */
  const getSummary = () => {
    post('/cfg.php?controller=assetMapping&action=showVioSrvSummary')
      .then((res) => {
        setAnoncount(res.anon)
        setProxycount(res.proxy)
        setRemotecount(res.remote)
        setAddrcount(res.addr)
      })
      .catch(() => {
        console.log('mistake')
      })
  }

  const getfillter = (info) => {
    post('/cfg.php?controller=assetMapping&action=filterVioService')
      .then((res) => {
        let onlinefillter = []
        let typefillter = []
        res.data.map((item) => {
          if (item.filterName == 'type') {
            item.info.map((each) => {
              typefillter.push({ text: each.text, value: each.text })
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
            item.filteredValue = info?.type
          } else if (item.dataIndex == 'online') {
            item.filters = onlinefillter
            item.filterMultiple = false
            item.filteredValue = info?.online
          } else {
          }
        })
        setCols([...columnslist])
      })
      .catch(() => {
        console.log('mistake')
      })
  }

  const getListdata = (value) => {
    let data = {}
    data.start = limitVal * (currPage - 1)
    data.limit = limitVal
    data.filters = value ? value : filters
    data.sort = sortText
    data.value = queryVal
    data.type = 'fuzzy'
    if (sortOrder == 'ascend') {
      data.order = 'asc'
    } else if (sortOrder == 'descend') {
      data.order = 'desc'
    } else {
      data.order = ' '
    }
    post('/cfg.php?controller=assetMapping&action=showVioService', data)
      .then((res) => {
        setTotEntry(res.total)
        setData([...res.data])
        setLoading(false)
      })
      .catch(() => {
        console.log('mistake')
      })
  }

  const tableTopSearch = () => {
    return (
      <Search
        placeholder={language('analyse.illsvr.searchText')}
        style={{ width: 200 }}
        className="illsvrSearch"
        allowClear
        onSearch={(queryVal) => {
          setQueryVal(queryVal)
          setCurrPage(1)
        }}
      />
    )
  }

  const clickFilter = (info, isToday) => {
    if (isToday == 'today') {
      info.time = true
    } else {
      info.time = false
    }
    let value = {}
    let val = {}
    if (fvalue != {}) {
      val = Object.assign(fvalue, info)
      value = Object.assign(fvalue, info)
    }
    setFilterValue(value)
    getfillter(val)
    getListdata(JSON.stringify(value))
  }


  /* 回显表格密度列设置 */
  const showTableConf = async () => {
    let data = []
    data.module = columnvalue
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
          showCon.show = true
          concealColumnList[item.dataIndex] = showCon
        }
      })
      let data = []
      data.module = columnvalue
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

  /* 表格列设置配置 */
  const columnsTableChange = (value) => {
    let data = []
    data.module = columnvalue
    data.value = JSON.stringify(value)
    post('/cfg.php?controller=confTableHead&action=setTableHead', data)
      .then((res) => {
        if (!res.success) {
          message.error(res.msg)
          return false
        }
        setColumnsHide(value)
      })
      .catch(() => {
        console.log('mistake')
      })
  }

  /* 表格密度设置 */
  const sizeTableChange = (sizeType) => {
    let data = []
    data.module = columnvalue
    data.density = sizeType
    post('/cfg.php?controller=confTableHead&action=setTableHead', data)
      .then((res) => {
        if (!res.success) {
          message.error(res.msg)
          return false
        }
        setDensitySize(sizeType)
      })
      .catch(() => {
        setDensitySize(sizeType)
        console.log('mistake')
      })
  }

  return (
    <Spin spinning={downLoading} tip={language('project.exporting')}>
      <ProCard direction="column" ghost gutter={[13, 13]}>
        <ProCard gutter={[13, 13]} ghost>
          <ProCard colSpan="25%" bordered className="svrSumCard">
            <div className="srvcard">
              <div className="image">
                <img src={AnonSummaryImg} />
              </div>
              <div className="svrcontent">
                <div className="mitytitle">
                  <sapn>{language('analyse.illsvr.anonser')}</sapn>
                </div>
                <div className="svrbot">
                  <div className="svrtext">
                    <div>{language('analyse.illsvr.today')}</div>
                    <div>{language('analyse.illsvr.total')}</div>
                  </div>
                  <div className="svrvalue">
                    <div
                      className="filterDiv"
                      onClick={() => {
                        clickFilter(
                          { type: [language('analyse.illsvr.anonser')] },
                          'today'
                        )
                        setIsTotal('today')
                      }}
                    >
                      {anoncount?.today}
                    </div>
                    <div
                      className="filterDiv"
                      onClick={() => {
                        clickFilter({
                          type: [language('analyse.illsvr.anonser')],
                        })
                        setIsTotal('')
                      }}
                    >
                      {anoncount?.total}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ProCard>
          <ProCard colSpan="25%" bordered className="svrSumCard">
            <div className="srvcard">
              <div className="image">
                <img src={ProxySummaryImg} />
              </div>
              <div className="svrcontent">
                <div className="brokertitle">
                  <sapn>{language('analyse.illsvr.proxyser')}</sapn>
                </div>
                <div className="svrbot">
                  <div className="svrtext">
                    <div>{language('analyse.illsvr.today')}</div>
                    <div>{language('analyse.illsvr.total')}</div>
                  </div>
                  <div className="svrvalue">
                    <div
                      className="filterDiv"
                      onClick={() => {
                        clickFilter(
                          { type: [language('analyse.illsvr.proxyser')] },
                          'today'
                        )
                        setIsTotal('today')
                      }}
                    >
                      {proxycount?.today}
                    </div>
                    <div
                      className="filterDiv"
                      onClick={() => {
                        clickFilter({
                          type: [language('analyse.illsvr.proxyser')],
                        })
                        setIsTotal('')
                      }}
                    >
                      {proxycount?.total}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ProCard>
          <ProCard colSpan="25%" bordered className="svrSumCard">
            <div className="srvcard">
              <div className="image">
                <img src={RemoteSummaryImg} />
              </div>
              <div className="svrcontent">
                <div className="remotetitle">
                  <sapn>{language('analyse.illsvr.remoteser')}</sapn>
                </div>
                <div className="svrbot">
                  <div className="svrtext">
                    <div>{language('analyse.illsvr.today')}</div>
                    <div>{language('analyse.illsvr.total')}</div>
                  </div>
                  <div className="svrvalue">
                    <div
                      className="filterDiv"
                      onClick={() => {
                        clickFilter(
                          { type: [language('analyse.illsvr.remoteser')] },
                          'today'
                        )
                        setIsTotal('today')
                      }}
                    >
                      {remotecount?.today}
                    </div>
                    <div
                      className="filterDiv"
                      onClick={() => {
                        clickFilter({
                          type: [language('analyse.illsvr.remoteser')],
                        })
                        setIsTotal('')
                      }}
                    >
                      {remotecount?.total}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ProCard>
          <ProCard colSpan="25%" bordered className="svrSumCard">
            <div className="srvcard">
              <div className="image">
                <img src={LocationSummaryImg} />
              </div>
              <div className="svrcontent">
                <div className="addrtitle">
                  <sapn>{language('analyse.illsvr.locationser')}</sapn>
                </div>
                <div className="svrbot">
                  <div className="svrtext">
                    <div>{language('analyse.illsvr.today')}</div>
                    <div>{language('analyse.illsvr.total')}</div>
                  </div>
                  <div className="svrvalue">
                    <div
                      className="filterDiv"
                      onClick={() => {
                        clickFilter(
                          { type: [language('analyse.illsvr.locationser')] },
                          'today'
                        )
                        setIsTotal('today')
                      }}
                    >
                      {addrcount?.today}
                    </div>
                    <div
                      className="filterDiv"
                      onClick={() => {
                        clickFilter({
                          type: [language('analyse.illsvr.locationser')],
                        })
                        setIsTotal('')
                      }}
                    >
                      {addrcount?.total}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ProCard>
        </ProCard>
        <ProCard className="ilsvtableCard" ghost>
          <ProTable
            search={false}
            editable={{
              type: 'multiple',
            }}
            bordered={true}
            scroll={{ y: clientHeight + 16 }}
            loading={loading}
            size={densitySize}
            columnEmptyText={false}
            //设置选中提示消失
            tableAlertRender={false}
            rowKey="id"
            columns={columns}
            rowSelection={false}
            dataSource={data}
            components={components}
            headerTitle={tableTopSearch()}
            onSizeChange={(e) => {
              sizeTableChange(e);
            }}
            toolBarRender={() => [
              !writable ? null : (
                <Tooltip title={language('project.export')} placement="top">
                  <DownloadOutlined
                    onClick={() => downloadClick()}
                    style={{ fontSize: '15px' }}
                  />
                </Tooltip>
              ),
            ]}
            options={{
              setting: true,
              reload: () => {
                setLoading(true)
                setCurrPage(1)
                getListdata()
              },
            }}
            columnsState={{
              value: columnsHide,
              persistenceType: 'localStorage',
              onChange: (value, key) => {
                columnsTableChange(value)
                // setColumnsHide(value)
                store.set(columnvalue, value)
              },
            }}
            onChange={(paging, filters, sorter) => {
              setLoading(true)
              if (filterValue.type && filters.type) {
                if (filterValue.type[0] != filters.type[0]) {
                  setIsTotal('')
                  if (filters.type[1]) {
                    filters.time = false
                  } else {
                    filters.time = false
                  }
                }
              }
              if (isTotal == 'today' && filters.type) {
                if (filters.type) {
                  if (filters.type[1]) {
                    filters.time = true
                  } else {
                    filters.time = true
                  }
                }
              } else {
                if (filters.type) {
                  if (filters.type[1]) {
                    filters.time = false
                  } else {
                    filters.time = false
                  }
                }
              }
              setFValue(filters)
              setFilters(JSON.stringify(filters))
              getfillter(JSON.stringify(filters))
              setSortOrder(sorter.order)
              setSorttext(sorter.field)
              store.set(tableKey, paging.pageSize)
            }}
            pagination={false}
          />
          <Pagination
            size="small"
            showSizeChanger
            current={currPage}
            defaultPageSize={limitVal}
            total={totEntry}
            showTotal={(total) => language('project.page', { total: total })}
            onChange={(current, pageSize) => {
              setLoading(true)
              setCurrPage(current)
              setLimitVal(pageSize)
            }}
          />
        </ProCard>
      </ProCard>
    </Spin>
  )
}
