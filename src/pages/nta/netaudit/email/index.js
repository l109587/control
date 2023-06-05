import React, { useState } from 'react'
import { Space, Input, DatePicker, Dropdown, Menu } from 'antd'
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

const Email = () => {
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
    domain: { show: false },
    authinfo: { show: false }
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
      width: '140px',
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
      width: '140px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('netaudit.email.sender'),
      dataIndex: 'sender',
      key: 'sender',
      width: '120px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('netaudit.email.receiver'),
      dataIndex: 'receiver',
      key: 'receiver',
      width: '120px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('netaudit.email.cc'),
      dataIndex: 'cc',
      key: 'cc',
      width: '100px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('netaudit.email.bcc'),
      dataIndex: 'bcc',
      key: 'bcc',
      width: '100px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('netaudit.email.subject'),
      dataIndex: 'subject',
      key: 'subject',
      width: '100px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('netaudit.email.attachment'),
      dataIndex: 'attachment',
      key: 'attachment',
      width: '180px',
      ellipsis: true,
      align: 'left',
      render: (text, record, index) => {
        let arr = record?.attachment?.split(';');
        let menuData = [];
        arr?.map((item, index) => {
          menuData.push({
            key: index,
            label: item
          })
        })
        return <Dropdown overlay={<Menu items={menuData}/>} placement='bottomLeft'  trigger={['hover']} >
        <div>{record.attachment}</div>
      </Dropdown>
      }
    },
    {
      title: language('netaudit.email.domain'),
      dataIndex: 'domain',
      key: 'domain',
      width: '130px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('netaudit.email.authinfo'),
      dataIndex: 'authinfo',
      key: 'authinfo',
      width: '150px',
      ellipsis: true,
      align: 'left',
    },
  ]

  const changeTime = (time) =>{
    setStarttime(time[0])
    setEndtime(time[1])
    setIncID(incID + 1)
  }

  const apishowurl = "/cfg.php?controller=logAudit&action=showEMail"

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

export default Email
