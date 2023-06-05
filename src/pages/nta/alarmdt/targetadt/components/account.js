import React, { useRef, useState, useEffect } from 'react'
import { Row, Space, Form, Input, Button, Col, Table, Select, DatePicker, Modal } from 'antd'
import { timestampToTime } from '@/utils/helper'
import './index.less'
import { post, Delete } from '@/services/https'
import { language } from '@/utils/language';
import '@/utils/index.less'
import moment from 'moment';
import { TableLayout } from '@/components';
const { ProtableModule } = TableLayout;
const { Search } = Input
const { RangePicker } = DatePicker;

let H = document.body.clientHeight - 333
var clientHeight = H

const Account = () => {

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      align: 'left',
      ellipsis: true,
      width: 80,
    },
    {
      title: language('alarmdt.timestamp'),
      dataIndex: 'timestamp',
      key: 'timestamp',
      align: 'left',
      ellipsis: true,
      width: 160,
      render: (text, record) => {
        return timestampToTime(record.timestamp)
      }
    },
    {
      title: language('alarmdt.risk'),
      dataIndex: 'risk',
      key: 'risk',
      align: 'left',
      ellipsis: true,
      width: 120,
      render: (text, record) => {
        if(record.risk == '-1') {
          return <span>{language('alarmdt.risk.all')}</span>
        } else if(record.risk == '0') {
          return <span>{language('alarmdt.risk.safe')}</span>
        } else if(record.risk == '1') {
          return <span>{language('alarmdt.risk.kind')}</span>
        } else if(record.risk == '2') {
          return <span>{language('alarmdt.risk.follow')}</span>
        } else if(record.risk == '3') {
          return <span>{language('alarmdt.risk.serious')}</span>
        } else if(record.risk == '4') {
          return <span>{language('alarmdt.risk.urgent')}</span>
        }
      }
    },
    {
      title: language('alarmdt.sip'),
      dataIndex: 'sip',
      key: 'sip',
      align: 'left',
      ellipsis: true,
      width: 140,
    },
    {
      title: language('alarmdt.smac'),
      dataIndex: 'smac',
      key: 'smac',
      align: 'left',
      ellipsis: true,
      width: 140,
    },
    {
      title: language('alarmdt.sport'),
      dataIndex: 'sport',
      key: 'sport',
      align: 'left',
      ellipsis: true,
      width: 120,
    },
    {
      title: language('alarmdt.targetip'),
      dataIndex: 'dip',
      key: 'dip',
      align: 'left',
      ellipsis: true,
      width: 140,
    },
    {
      title: language('alarmdt.targetmac'),
      dataIndex: 'dmac',
      key: 'dmac',
      align: 'left',
      ellipsis: true,
      width: 140,
    },
    {
      title: language('alarmdt.targetport'),
      dataIndex: 'dport',
      key: 'dport',
      align: 'left',
      ellipsis: true,
      width: 120,
    },
    {
      title: language('alarmdt.details'),
      align: 'left',
      dataIndex: 'details',
      width: 160,
      ellipsis: true,
    }
  ];

  const dateFormat = 'YYYY/MM/DD HH:mm:ss';
  const [olddate, setOlddate] = useState(moment().subtract(1, "months").format(dateFormat));
  const [newdate, setNewdate] = useState(moment().format(dateFormat));
  const [type, setType] = useState('1')
  const [queryVal, setQueryVal] = useState();//首个搜索框的值
  const apishowurl = type == '1' ? '/cfg.php?controller=ntaAlarmLog&action=showSMTPAlarm' : '/cfg.php?controller=ntaAlarmLog&action=showFTPAlarm';
  let searchVal = { queryVal: queryVal, queryType: 'fuzzy', startTime: olddate, endTime: newdate };//顶部搜索框值 传入接口
  const [incID, setIncID] = useState(0);//递增的id 删除/添加的时候增加触发刷新
  const tableKey = 'account';
  const rowkey = (record => record.id)
  const downloadButton = false;
  const columnvalue = 'acountcolumnvalue'
  const concealColumns = {
    id: { show: false },
  }

  const tableTopSearch = () => {
    return (
      <Space className='accounTabtle'>
        <Search allowClear
          placeholder={language('alarmdt.searchtext')}
          style={{ width: 250 }}
          onSearch={(queryVal) => {
            setQueryVal(queryVal)
            setIncID(incID + 1)
          }}
        />
        <RangePicker showTime={{ format: 'HH:mm:ss' }}
          defaultValue={[moment(olddate, dateFormat),
          moment(newdate, dateFormat)]}
          format={dateFormat}
          onChange={(val, time) => {
            setNewdate(time[1])
            setOlddate(time[0])
            setIncID(incID + 1)
          }}
        />
        <Select name='type' defaultValue={'1'} style={{ width: 80 }}
          options={[{ value: '1', label: 'SMTP' }, { value: '2', label: 'FTP' }]}
          onChange={(key, value) => {
            setType(key)
            setIncID(incID => incID + 1)
        }}/>
      </Space>
    )
  };

  return (<>
    <ProtableModule columnvalue={columnvalue} tableKey={tableKey} rowkey={rowkey} concealColumns={concealColumns} rowSelection={false} clientHeight={clientHeight} columns={columns} apishowurl={apishowurl} searchText={tableTopSearch()} searchVal={searchVal} incID={incID} downloadButton={downloadButton} />
  </>)
}

export default Account
