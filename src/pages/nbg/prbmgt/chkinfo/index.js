import React, { useRef, useState, useEffect } from 'react'
import { language } from '@/utils/language'
import { Button, Popconfirm, Space, Tag, message, Input, Tooltip } from 'antd'
import { TableLayout } from '@/components'
import { post, get } from '@/services/https'
import { useSelector } from 'umi'
const { ProtableModule } = TableLayout
const { Search } = Input

export default () => {
  const contentHeight = useSelector(({ app }) => app.contentHeight)
  const clientHeight = contentHeight - 220

  const columnslist = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 120,
      ellipsis: true,
      align: 'center',
    },
    {
      title: language('monitor.montask.status'),
      dataIndex: 'online',
      key: 'online',
      width: 80,
      ellipsis: true,
      align: 'center',
      render: (text, record, index) => {
        let color = 'success'
        if (record.online == 1) {
          color = 'success'
          text = language('project.sysconf.analysis.online')
        } else {
          color = 'default'
          text = language('project.sysconf.analysis.noline')
        }
        return (
          <Space>
            <Tag style={{ marginRight: 0 }} color={color} key={record.type}>
              {text}
            </Tag>
          </Space>
        )
      },
    },
    {
      title: language('analyse.resmap.addr'),
      dataIndex: 'addr',
      key: 'addr',
      width: 140,
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('project.analyse.illout.mac'),
      dataIndex: 'mac',
      key: 'mac',
      width: 200,
      ellipsis: true,
      align: 'left',
    },
    {
      title: 'VLAN',
      dataIndex: 'vlanID',
      key: 'vlanID',
      width: 120,
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('analyse.resmap.findTM'),
      dataIndex: 'lastDiscoverTM',
      key: 'lastDiscoverTM',
      width: 200,
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('prbmgt.chkinfo.lastCheckTM'),
      dataIndex: 'lastCheckTM',
      key: 'lastCheckTM',
      width: 260,
      ellipsis: true,
      align: 'left',
    }
  ]

  const concealColumns = {
    id: { show: false },
  }
  const [queryVal, setQueryVal] = useState() //首个搜索框的值
  const [incID, setIncID] = useState(0)
  const [columns, setColumns] = useState(columnslist)
  const tableKey = 'chkinfoTable'
  const apishowurl = '/cfg.php?controller=probeManage&action=showHrdprbAssets'
  let searchVal = { queryVal: queryVal, type: 'fuzzy',} //顶部搜索框值 传入接口

  const tableTopSearch = () => {
    return (
      <Search
        placeholder='IP/MAC'
        allowClear
        style={{ width: 200 }}
        onSearch={(queryVal) => {
          setQueryVal(queryVal)
          setIncID(incID + 1)
        }}
      />
    )
  }

  useEffect(() => {
    getFilters()
  }, [])

  const getFilters = () => {
    post('/cfg.php?controller=probeManage&action=filterHrdprbAssets').then((res) => {
      let onlinefillter = []
      res.data.map((item) => {
        if (item.filterName == 'online') {
          item.info.map((each) => {
            onlinefillter.push({ text: each.text, value: each.id })
          })
        } else {
        }
      })
      columnslist.map((item) => {
        if (item.dataIndex == 'online') {
          item.filters = onlinefillter
          item.filterMultiple = false
        } else {
        }
      })
      setColumns([...columnslist])
    })
  }

  return (
    <>
      <ProtableModule
       incID={incID}
       tableKey={tableKey}
       columns={columns}
       apishowurl={apishowurl}
       clientHeight={clientHeight}
       concealColumns={concealColumns}
       searchText={tableTopSearch()}
       searchVal={searchVal}
       columnvalue={'chkinfoTable'}
      />
    </>
  )
}
