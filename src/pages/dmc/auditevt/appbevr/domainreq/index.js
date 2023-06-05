import React, { useState } from 'react'
import { Space, Input, DatePicker, Dropdown, Menu } from 'antd'
import moment from 'moment';
import '@/utils/index.less'
import { language } from '@/utils/language';
import { TableLayout } from '@/components';
import { InfoCircleOutlined } from '@ant-design/icons';
import DateTimeRangePicker from '@/components/Common/dtRangePicker';
const { ProtableModule } = TableLayout;
const { Search } = Input
const { RangePicker } = DatePicker;

let clientHeight = document.body.clientHeight - 336
const dateFormat = 'YYYY-MM-DD HH:mm:ss'

const Domainreq = () => {
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
      width: '130px',
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
      title: language('netaudit.connect.protocol'),
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
      width: '100px',
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
      width: '100px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('alarmdt.targetip'),
      dataIndex: 'dip',
      key: 'dip',
      width: '100px',
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
      width: '100px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('netaudit.dnsreq.request'),
      dataIndex: 'request',
      key: 'request',
      width: '130px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('netaudit.dnsreq.response'),
      dataIndex: 'response',
      key: 'response',
      width: '130px',
      ellipsis: true,
      align: 'left',
      render: (text, record, index) => {
        let arr = record?.response?.split(';');
        let menuData = [];
        arr?.map((item, index) => {
          menuData.push({
            key: index,
            label: item
          })
        })
        return <Dropdown overlay={<Menu items={menuData}/>} placement='bottomLeft'  trigger={['hover']} >
          <div>{record.response}</div>
        </Dropdown>
      }
    }
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

  return (
    <>
      <ProtableModule
        columns={columns}
        apishowurl="/cfg.php?controller=logAudit&action=showDNSRequest"
        clientHeight={clientHeight}
        columnvalue="domainreqColumnvalue"
        tableKey="domainreqTable"
        rowkey={'id'}
        incID={incID}
        searchText={tableTopSearch()}
        searchVal={searchVal}
        concealColumns={concealColumns}
      />
    </>
  )
}

export default Domainreq
