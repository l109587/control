import React, { useRef, useState, useEffect } from 'react'
import { InfoCircleOutlined } from '@ant-design/icons'
import ProCard from '@ant-design/pro-card'
import { Space, message, Tag, Input, Spin } from 'antd'
import { post, get } from '@/services/https'
import '@/utils/box.less'
import './series.less'
import store, { set } from 'store'
import { language } from '@/utils/language'
import { TableLayout } from '@/components'
import download from '@/utils/downnloadfile'
import { useSelector } from 'umi'
const { Search } = Input
const { ProtableModule } = TableLayout

export default () => {
  const contentHeight = useSelector(({ app }) => app.contentHeight)
  let clientHeight = contentHeight - 220
  const columnlist = [
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
      width: 80,
      key: 'online',
      render: (text, record, index) => {
        let color = 'success'
        if (text == 1) {
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
      width: 120,
      title: language('project.analyse.series.net'),
      dataIndex: 'net',
      key: 'net',
      ellipsis: true,
    },
    {
      title: language('project.analyse.series.ip'),
      width: 130,
      dataIndex: 'devIP',
      key: 'devIP',
      ellipsis: true,
      sorter: true,
    },
    {
      title: language('project.analyse.series.mac'),
      dataIndex: 'devMac',
      width: 240,
      key: 'devMac',
      ellipsis: true,
    },
    {
      title: language('project.analyse.series.dev'),
      width: 120,
      dataIndex: 'vendor',
      key: 'vendor',
      ellipsis: true,
    },
    {
      title: language('project.analyse.series.covery'),
      width: 120,
      dataIndex: 'type',
      key: 'type',
      ellipsis: true,
    },
    {
      title: language('project.analyse.series.num'),
      width: 90,
      dataIndex: 'cnt',
      key: 'cnt',
      sorter: true,
      ellipsis: true,
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

  const apishowurl = '/cfg.php?controller=assetMapping&action=showVioNetcross'
  const concealColumns = {
    id: { show: false },
  }
  const tableKey = 'series'
  const setcolumnKey = 'pro-table-singe-demos-series'
  const [columns, setColumns] = useState(columnlist)
  const [queryVal, setQueryVal] = useState() //首个搜索框的值
  let searchVal = { value: queryVal, type: 'fuzzy' } //顶部搜索框值 传入接口
  const [loading, setLoading] = useState(false) //加载
  const [incID, setIncID] = useState(0) //递增的id 删除/添加的时候增加触发刷新
  const columnvalue = 'sercolumnvalue'
  const downloadButton = true;
  const [downLoading, setDownLoading] = useState(false)
  //导出按钮
  const downloadClick = () => {
    download('/cfg.php?controller=assetMapping&action=exportVioNetcross', '', setDownLoading)
  }

  useEffect(() => {
    getfillter()
  }, [])

  const getfillter = () => {
    post('/cfg.php?controller=assetMapping&action=filterVioNetcross')
      .then((res) => {
        if (res.data) {
          let onlinefillter = []
          let typefillter = []
          let vendorfillter = []
          res.data.map((item) => {
            if (item.filterName == 'type') {
              item.info.map((each) => {
                typefillter.push({ text: each.text, value: each.text })
              })
            } else if (item.filterName == 'online') {
              item.info.map((each) => {
                onlinefillter.push({ text: each.text, value: each.id })
              })
            } else if (item.filterName == 'vendor') {
              item.info.map((each) => {
                vendorfillter.push({ text: each.text, value: each.text })
              })
            } else {
            }
          })
          columnlist.map((item) => {
            if (item.dataIndex == 'type') {
              item.filters = typefillter
              item.filterMultiple = false
            } else if (item.dataIndex == 'online') {
              item.filters = onlinefillter
              item.filterMultiple = false
            } else if (item.dataIndex == 'vendor') {
              item.filters = vendorfillter
              item.filterMultiple = false
            } else {
            }
          })
        } else {
        }
        setColumns([...columnlist])
      })
      .catch(() => {
        console.log('mistake')
      })
  }

  const tableTopSearch = () => {
    return (
      <Search
        placeholder={language('analyse.series.searchText')}
        className='seriesSearch'
        style={{ width: 200 }}
        allowClear
        onSearch={(queryVal) => {
          setLoading(true)
          setQueryVal(queryVal)
          setIncID(incID + 1)
        }}
      />
    )
  }

  return (
    <Spin spinning={downLoading} tip={language('project.exporting')}>
      <ProtableModule
        incID={incID}
        columnvalue={columnvalue}
        clientHeight={clientHeight}
        tableKey={tableKey}
        loading={loading}
        searchText={tableTopSearch()}
        searchVal={searchVal}
        apishowurl={apishowurl}
        setcolumnKey={setcolumnKey}
        concealColumns={concealColumns}
        columns={columns}
        downloadButton={downloadButton}
        downloadClick={downloadClick}
      />
    </Spin>
  )
}
