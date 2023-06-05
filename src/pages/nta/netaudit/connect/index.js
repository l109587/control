import React, { useState } from 'react'
import { Space, Input, DatePicker } from 'antd'
import moment from 'moment';
import '@/utils/index.less'
import { language } from '@/utils/language';
import { TableLayout } from '@/components';
import DateTimeRangePicker from '@/components/Common/dtRangePicker'
const { ProtableModule } = TableLayout;
const { Search } = Input
const { RangePicker } = DatePicker;

let clientHeight = document.body.clientHeight - 295
const dateFormat = 'YYYY-MM-DD HH:mm:ss'

const Connect = () => {
  const [incID, setIncID] = useState(0) //表格刷新
  const [queryVal, setQueryVal] = useState('') //搜索框的值
  const [starttime, setStarttime] = useState(
    moment().subtract(1, 'months').format(dateFormat)
  ) //搜索框的值
  const [endtime, setEndtime] = useState(moment().format(dateFormat)) //搜索框的值
  let searchVal = {
    queryVal: queryVal,
    queryType: 'fuzzy',
    startTime: starttime,
    endTime: endtime,
  } //顶部搜索框值 传入接口

  const concealColumns = {
    smac: { show: false },
    dmac: { show: false },
    tcp_flag: { show: false },
  }
  const columns = [
    {
      title: language('netaudit.connect.start_time'),
      dataIndex: 'start_time',
      key: 'start_time',
      width: '160px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('netaudit.connect.end_time'),
      dataIndex: 'end_time',
      key: 'end_time',
      width: '150px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('netaudit.connect.app'),
      dataIndex: 'app',
      key: 'app',
      width: '100px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('netaudit.connect.protocol'),
      dataIndex: 'protocol',
      key: 'protocol',
      width: '100px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('alarmdt.sip'),
      dataIndex: 'sip',
      key: 'sip',
      width: '130px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('alarmdt.sport'),
      dataIndex: 'sport',
      key: 'sport',
      width: '100px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('alarmdt.smac'),
      dataIndex: 'smac',
      key: 'smac',
      width: '130px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('alarmdt.targetip'),
      dataIndex: 'dip',
      key: 'dip',
      width: '130px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('alarmdt.targetport'),
      dataIndex: 'dport',
      key: 'dport',
      width: '100px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('alarmdt.dstmac'),
      dataIndex: 'dmac',
      key: 'dmac',
      width: '130px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('netaudit.connect.tcp_flag'),
      dataIndex: 'tcp_flag',
      key: 'tcp_flag',
      width: '100px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('netaudit.connect.in_bytes'),
      dataIndex: 'in_bytes',
      key: 'in_bytes',
      width: '100px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('netaudit.connect.out_bytes'),
      dataIndex: 'out_bytes',
      key: 'out_bytes',
      width: '100px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('netaudit.connect.in_pkts'),
      dataIndex: 'in_pkts',
      key: 'in_pkts',
      width: '100px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('netaudit.connect.out_pkts'),
      dataIndex: 'out_pkts',
      key: 'out_pkts',
      width: '100px',
      ellipsis: true,
      align: 'left',
    },
  ]

  const changeTime = (time) =>{
    setStarttime(time[0])
    setEndtime(time[1])
    setIncID(incID + 1)
  }

  const apishowurl = "/cfg.php?controller=logAudit&action=showTraffic"

  const tableTopSearch = () => {
    return(
      <Space>
        <Search
          placeholder={language('netaudit.searchtext')}
          style={{ width: 200 }}
          onSearch={(queryVal) => {
            setQueryVal(queryVal)
            setIncID(incID + 1)
          }}
          allowClear
        />
        <DateTimeRangePicker changeTime={changeTime}/>
      </Space>
    )
  }

  return (<>
    <ProtableModule
      tableKey={'connectTable'} 
      columnvalue={'connectColumnvalue'} 
      rowkey={'id'} 
      concealColumns={concealColumns} 
      rowSelection={false} 
      clientHeight={clientHeight} 
      columns={columns} 
      apishowurl={apishowurl} 
      searchText={tableTopSearch()} 
      searchVal={searchVal} 
      incID={incID}
    />
  </>)
}

export default Connect
