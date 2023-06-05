import React, { useRef, useState, useEffect } from 'react'
import { InfoCircleOutlined } from '@ant-design/icons'
import ProCard from '@ant-design/pro-card'
import { Space, message, Tag, Input, Spin } from 'antd'
import { post, get } from '@/services/https'
import '@/utils/box.less'
import './illout.less'
import store from 'store'
import osIconList from '@/utils/osiconType.js'
import { TableLayout } from '@/components'
import { language } from '@/utils/language'
import download from '@/utils/downnloadfile'
import { useSelector } from 'umi'
const { ProtableModule } = TableLayout
const { Search } = Input

export default () => {
  const contentHeight = useSelector(({ app }) => app.contentHeight)
  const clientHeight = contentHeight - 220
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
        let name = language('project.central.online')
        if (text == '1') {
          color = 'success'
          name = language('project.sysconf.analysis.online')
        } else {
          color = 'default'
          name = language('project.sysconf.analysis.noline')
        }
        return (
          <Space>
            <Tag style={{ marginRight: 0 }} color={color} key={record.online}>
              {name}
            </Tag>
          </Space>
        )
      },
    },
    {
      width: 120,
      title: language('project.analyse.illout.ip'),
      dataIndex: 'addr',
      key: 'addr',
      sorter: true,
      ellipsis: true,
    },
    {
      width: 120,
      title: language('project.analyse.illout.host'),
      dataIndex: 'devName',
      key: 'devName',
      ellipsis: true,
    },
    {
      title: language('project.analyse.illout.mac'),
      dataIndex: 'mac',
      width: 160,
      key: 'mac',
      ellipsis: true,
    },
    {
      title: language('project.analyse.illout.covery'),
      width: 130,
      dataIndex: 'type',
      key: 'type',
      ellipsis: true,
      render: (text, record, index) => {
        if (record.type == 'script') {
          return language('analyse.illout.script')
        } else if (record.type == 'gw') {
          return language('illevent.illoutline.selfCheck')
        } else if (record.type == 'scan') {
          return language('analyse.illout.scan')
        } else {
          return language('analyse.illout.flow')
        }
      },
    },
    {
      title: language('project.analyse.illout.os'),
      width: 120,
      dataIndex: 'os',
      key: 'os',
      ellipsis: true,
      render: (text, record, _, action) => {
        return [osIconList(record.os), record.os]
      },
    },
    {
      title: language('project.analyse.illout.browser'),
      width: 150,
      dataIndex: 'browser',
      key: 'browser',
      ellipsis: true,
    },
    {
      title: language('project.analyse.illout.outAddr'),
      width: 140,
      dataIndex: 'outAddr',
      key: 'outAddr',
      ellipsis: true,
    },
    {
      title: language('project.analyse.illout.num'),
      width: 80,
      dataIndex: 'count',
      key: 'count',
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

  const [columns, setColumns] = useState(columnlist)
  useEffect(() => {
    getfillter()
  }, [])

  const getfillter = () => {
    post('/cfg.php?controller=assetMapping&action=filterVioOutline')
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
        columnlist.map((item) => {
          if (item.dataIndex == 'type') {
            item.filters = typefillter
            item.filterMultiple = false
          } else if (item.dataIndex == 'online') {
            item.filters = onlinefillter
            item.filterMultiple = false
          } else {
          }
        })
        setColumns([...columnlist])
      })
      .catch(() => {
        console.log('mistake')
      })
  }

  const [queryVal, setQueryVal] = useState() //首个搜索框的值
  let searchVal = { value: queryVal, type: 'fuzzy' } //顶部搜索框值 传入接口
  const apishowurl = '/cfg.php?controller=assetMapping&action=showVioOutline'
  const concealColumns = {
    id: { show: false },
  }
  const tableKey = 'illout'
  const setcolumnKey = 'pro-table-singe-demos-illout'
  const columnvalue = 'outcolumnvalue'
  const [incID, setIncID] = useState(0) //递增的id 删除/添加的时候增加触发刷新
  const downloadButton = true
  const [downLoading, setDownLoading] = useState(false)
  //导出按钮
  const downloadClick = () => {
    download(
      '/cfg.php?controller=assetMapping&action=exportVioOutline',
      '',
      setDownLoading
    )
  }

  const tableTopSearch = () => {
    return (
      <Search
        placeholder={language('analyse.illout.searchText')}
        allowClear
        className='illoutSearch'
        onSearch={(queryVal) => {
          setQueryVal(queryVal)
          setIncID(incID + 1)
        }}
      />
    )
  }

  return (
    <div>
      <Spin spinning={downLoading} tip={language('project.exporting')}>
        <ProtableModule
          incID={incID}
          columnvalue={columnvalue}
          columns={columns}
          tableKey={tableKey}
          clientHeight={clientHeight}
          setcolumnKey={setcolumnKey}
          apishowurl={apishowurl}
          searchText={tableTopSearch()}
          searchVal={searchVal}
          concealColumns={concealColumns}
          downloadButton={downloadButton}
          downloadClick={downloadClick}
        />
      </Spin>
    </div>
  )
}
