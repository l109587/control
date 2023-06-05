import React, { useState } from 'react'
import { Space, Input, DatePicker } from 'antd'
import moment from 'moment';
import '@/utils/index.less'
import { language } from '@/utils/language';
import { TableLayout } from '@/components';
import DateTimeRangePicker from '@/components/Common/dtRangePicker';
const { ProtableModule } = TableLayout;
const { Search } = Input
const { RangePicker } = DatePicker;

let clientHeight = document.body.clientHeight - 295
const dateFormat = 'YYYY-MM-DD HH:mm:ss'

const Webhttp = () => {
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
    sport: { show: false },
    smac: { show: false },
    dport: { show: false },
    dmac: { show: false },
  }
  const columns = [
    {
      title: language('netaudit.dnsreq.time'),
      dataIndex: 'time',
      key: 'time',
      width: '160px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('netaudit.connect.app'),
      dataIndex: 'app',
      key: 'app',
      width: '80px',
      ellipsis: true,
      align: 'left',
    },
    {
      title:  language('netaudit.connect.protocol'),
      dataIndex: 'protocol',
      key: 'protocol',
      width: '80px',
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
      title: language('netaudit.webhttp.domain'),
      dataIndex: 'domain',
      key: 'domain',
      width: '100px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('netaudit.webhttp.url'),
      dataIndex: 'url',
      key: 'url',
      width: '120px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('netaudit.webhttp.method'),
      dataIndex: 'method',
      key: 'method',
      width: '100px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('netaudit.webhttp.ret_code'),
      dataIndex: 'ret_code',
      key: 'ret_code',
      width: '100px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: 'UserAgent',
      dataIndex: 'user_agent',
      key: 'user_agent',
      width: '100px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: 'Cookie',
      dataIndex: 'cookie',
      key: 'cookie',
      width: '120px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('netaudit.webhttp.refer'),
      dataIndex: 'refer',
      key: 'refer',
      width: '120px',
      ellipsis: true,
      align: 'center',
    },
  ]
  
  const changeTime = (time) =>{
    setStarttime(time[0])
    setEndtime(time[1])
    setIncID(incID + 1)
  }

  // 顶部左侧搜索框
  const tableTopSearch = () => {
    return (
      <Space>
        <Search
          style={{ width: 200 }}
          onSearch={(queryVal) => {
            setQueryVal(queryVal)
            setIncID(incID + 1)
          }}
          allowClear
          placeholder={language('netaudit.searchtext')}
        />
        <DateTimeRangePicker changeTime={changeTime}/>
      </Space>
    )
  }

  return (<>
    <ProtableModule
        columns={columns}
        apishowurl="/cfg.php?controller=logAudit&action=showWebVisit"
        clientHeight={clientHeight}
        columnvalue="webvisitColumnvalue"
        tableKey="webvisitTable"
        rowkey={'id'}
        incID={incID}
        searchText={tableTopSearch()}
        searchVal={searchVal}
        concealColumns={concealColumns}
      />
  </>)

}

export default Webhttp
