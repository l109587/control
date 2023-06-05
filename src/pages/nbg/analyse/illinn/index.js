import React, { useRef, useState, useEffect } from 'react'
import ProCard from '@ant-design/pro-card'
import { StatisticCard } from '@ant-design/pro-components'
import { post, get } from '@/services/https'
import ReactDOM from 'react-dom'
import { RingProgress } from '@ant-design/plots'
import { Space, message, Tag, Tooltip, Input, Spin } from 'antd'
import '@/utils/box.less'
import './index.less'
import osIconList from '@/utils/osiconType.js'
import { language } from '@/utils/language'
import NmilcardImg from '@/assets/nfd/nbg-analyse-illinn-nmilcard.svg'
import NetcardImg from '@/assets/nfd/nbg-analyse-illinn-netcard.svg'
import { TableLayout } from '@/components'
import { Resizable } from 'react-resizable'
import download from '@/utils/downnloadfile'
import { useSelector } from 'umi'
const { ProtableModule } = TableLayout
const { Statistic, Divider } = StatisticCard
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
  const clientHeight = contentHeight - 370
  const [summary, setSummary] = useState([])
  const [mulinum, setMulinum] = useState(0)
  const [netInum, setNetInum] = useState(0)
  const [muliCount, setMuliCount] = useState(0)
  const [netCount, setNetCount] = useState(0)
  const [mPercen, setMPercen] = useState(0)
  const [nPercen, setNPercen] = useState(0)
  const [incID, setIncID] = useState(0) //递增的id 删除/添加的时候增加触发刷新

  const columnslist = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80,
      key: 'id',
      align: 'center',
    },
    {
      title: language('project.analyse.status'),
      dataIndex: 'online',
      align: 'center',
      width: 100,
      key: 'online',
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
      width: 160,
      title: language('project.analyse.illout.host'),
      dataIndex: 'devName',
      ellipsis: true,
      key: 'devName',
    },
    {
      width: 150,
      title: language('project.analyse.illinn.addr'),
      dataIndex: 'addr',
      ellipsis: true,
      key: 'addr',
      sorter: true,
    },
    {
      title: language('project.analyse.illout.mac'),
      width: 130,
      dataIndex: 'mac',
      ellipsis: true,
      key: 'mac',
    },
    {
      title: language('project.analyse.illout.os'),
      dataIndex: 'os',
      width: 110,
      key: 'os',
      ellipsis: true,
      render: (text, record, _, action) => {
        return [osIconList(record.os), record.os]
      },
    },
    {
      title: language('project.analyse.illinn.info'),
      width: 260,
      dataIndex: 'type',
      key: 'type',
      render: (text, record, index) => {
        if (record.info.type == 'netIn') {
          return (
            <div className="infobox">
              <Tag color="#79B8F3">
                {' '}
                <img
                  src={NetcardImg}
                  style={{ marginBottom: 2, marginRight: 2 }}
                />
                <span style={{ marginBottom: 2 }}>网中网</span>
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
        } else if (record.info.type == 'multiCard') {
          return (
            <div className="infobox">
              <Tag
                style={{ textAlign: 'center' }}
                icon={
                  <img
                    src={NmilcardImg}
                    style={{ marginBottom: 2, marginRight: 2 }}
                  />
                }
                color="#79B8F3"
              >
                <span style={{ marginBottom: 2 }}>多网卡</span>
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
      width: 150,
      dataIndex: 'lastTM',
      key: 'lastTM',
      ellipsis: true,
    },
    {
      title: language('project.analyse.series.firstime'),
      width: 150,
      dataIndex: 'firstTM',
      key: 'firstTM',
      ellipsis: true,
    },
  ]
  useEffect(() => {
    getSummary()
    getfillter()
  }, [])

  // 表格列
  const [cols, setCols] = useState(columnslist)
  const [columns, setColumns] = useState([])

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

  const concealColumns = {
    id: { show: false },
  }
  const tableKey = 'illinn'
  const apishowurl = '/cfg.php?controller=assetMapping&action=showVioInline'
  const [queryVal, setQueryVal] = useState() //首个搜索框的值
  const [filterValue, setFilterValue] = useState({})
  const downloadButton = true
  let searchVal = { value: queryVal, type: 'fuzzy' } //顶部搜索框值 传入接口
  const [downLoading, setDownLoading] = useState(false)
  //导出按钮
  const downloadClick = () => {
    download(
      '/cfg.php?controller=assetMapping&action=exportVioInline',
      '',
      setDownLoading
    )
  }
  const tableTopSearch = () => {
    return (
      <Search
        placeholder={language('analyse.illinn.searchText')}
        allowClear
        className="illinnSearch"
        style={{ width: 200 }}
        onSearch={(queryVal) => {
          setQueryVal(queryVal)
          setIncID(incID + 1)
        }}
      />
    )
  }

  const getfillter = (info) => {
    post('/cfg.php?controller=assetMapping&action=filterVioInline')
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
          } else {
          }
        })
        setCols([...columnslist])
      })
      .catch(() => {
        console.log('mistake')
      })
  }

  /* 顶部概要数据 */
  const getSummary = () => {
    post('/cfg.php?controller=assetMapping&action=showVioInSummary')
      .then((res) => {
        setSummary(res)
        let mCount = res?.multiCard?.count.toLocaleString()
        let NCount = res?.netIn?.count.toLocaleString()
        let mulipercen = res.multiCard.percent * 100
        let netInpercen = res.netIn.percent * 100
        setMPercen(mulipercen.toFixed(2) + '%')
        setNPercen(netInpercen.toFixed(2) + '%')
        setMuliCount(mCount)
        setNetCount(NCount)
        setMulinum(res.multiCard)
        setNetInum(res.netIn)
      })
      .catch(() => {
        console.log('mistake')
      })
  }

  const maliconfig = {
    height: 70,
    width: 70,
    autoFit: false,
    percent: mulinum.percent,
    color: ['#12C189', '#E8EDF3'],
  }

  const config = {
    height: 70,
    width: 70,
    autoFit: false,
    percent: netInum.percent,
    color: ['#1684FC', '#E8EDF3'],
    tooltip: {
      customContent: (title, data) => {
        return `<div>${0.7}</div>`
      },
    },
  }
  const setcolumnKey = 'pro-table-singe-demos-illinn'
  const columnvalue = 'illcolumnvalue'

  const clickFilter = (info) => {
    setFilterValue(info)
    getfillter(info)
    setIncID(incID + 1)
  }

  return (
    <Spin spinning={downLoading} tip={language('project.exporting')}>
      <ProCard direction="column" ghost gutter={[13, 13]}>
        <ProCard className="innSumCard" ghost>
          <ProCard colSpan="24%" ghost>
            <StatisticCard
              className="illinncard"
              style={{ paddingLeft: '30px' }}
              statistic={{
                title: (
                  <div className="cardtitle">
                    {language('analyse.illinn.viotitle')}
                  </div>
                ),
                value: summary?.totalChk,
              }}
            />
          </ProCard>
          <Divider type="vertical" color="black" />
          {/* 多网卡 */}
          <ProCard colSpan="37%" ghost>
            <div className="nmilcard">
              <div className="leftDiv">
                <RingProgress className="mailpie" {...maliconfig} />
              </div>
              <div className="rightDiv">
                <div className="cardtitle">
                  {language('analyse.illinn.mniltitle')}
                </div>
                <div
                  className="countDiv"
                  onClick={() => {
                    clickFilter({
                      type: [language('monitor.illegal.multiNic')],
                    })
                  }}
                >
                  {muliCount}
                </div>
                <Statistic
                  title={language('analyse.illinn.proportion')}
                  value={mPercen}
                />
              </div>
            </div>
          </ProCard>
          {/* 网中网 */}
          <ProCard colSpan="37%" ghost>
            <div className="netcard">
              <div className="leftDiv">
                <RingProgress className="netinpie" {...config} />
              </div>
              <div className="rightDiv">
                <div className="cardtitle">
                  {language('analyse.illinn.nettitle')}
                </div>
                <div
                  className="countDiv"
                  onClick={() => {
                    clickFilter({ type: [language('monitor.mapping.ckWiw')] })
                  }}
                >
                  {netCount}
                </div>
                <Statistic
                  title={language('analyse.illinn.proportion')}
                  value={nPercen}
                />
              </div>
            </div>
          </ProCard>
        </ProCard>
        <ProCard className="inntable" ghost>
          <ProtableModule
            incID={incID}
            columnvalue={columnvalue}
            setcolumnKey={setcolumnKey}
            clientHeight={clientHeight}
            tableKey={tableKey}
            searchText={tableTopSearch()}
            searchVal={searchVal}
            apishowurl={apishowurl}
            concealColumns={concealColumns}
            columns={columns}
            components={components}
            filterValue={filterValue}
            downloadButton={downloadButton}
            downloadClick={downloadClick}
          />
        </ProCard>
      </ProCard>
    </Spin>
  )
}
