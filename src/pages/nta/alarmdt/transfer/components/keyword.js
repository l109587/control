import React, { useRef, useState, useEffect } from 'react'
import { Row, Space, Form, Input, Button, Col, Table, Select, DatePicker, Modal } from 'antd'
import { timestampToTime, modalFormLayout } from '@/utils/helper'
import { ModalForm, ProFormItem, ProForm, ProFormText } from '@ant-design/pro-components';
import { ProTabler } from '@/components'
import './index.less'
import { post, Delete } from '@/services/https'
import '@/utils/index.less'
import moment from 'moment';
import { language } from '@/utils/language';
import { TableLayout } from '@/components';
const { ProtableModule } = TableLayout;
const { Search } = Input
const { Option } = Select;
const { RangePicker } = DatePicker;

let H = document.body.clientHeight - 333
var clientHeight = H

const Keyword = () => {

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
      title: language('alarmdt.protocol'),
      width: 120,
      dataIndex: 'protocol',
      key: 'protocol',
      ellipsis: true,
      align: 'left'
    },
    {
      title: language('alarmdt.ruleID'),
      dataIndex: 'ruleID',
      key: 'ruleID',
      ellipsis: true,
      width: 140,
      align: 'left'
    },
    {
      title: language('alarmdt.smSummary'),
      dataIndex: 'smSummary',
      key: 'smSummary',
      ellipsis: true,
      width: 140,
      align: 'left'
    },
    {
      title: language('alarmdt.sip'),
      dataIndex: 'sip',
      key: 'sip',
      ellipsis: true,
      width: 140,
      align: 'left'
    },
    {
      title: language('alarmdt.dip'),
      dataIndex: 'dip',
      key: 'dip',
      ellipsis: true,
      width: 140,
      align: 'left'
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
  const [queryVal, setQueryVal] = useState();//首个搜索框的值
  const apishowurl = '/cfg.php?controller=ntaAlarmLog&action=showTransferAlarm';
  let searchVal = { queryVal: queryVal, queryType: 'fuzzy', startTime: olddate, endTime: newdate, class: 2 };//顶部搜索框值 传入接口
  const [incID, setIncID] = useState(0);//递增的id 删除/添加的时候增加触发刷新
  const tableKey = 'keyword';
  const rowkey = (record => record.id);
  const columnvalue = 'keywordcolumnvalue';
  const concealColumns = {
    id: { show: false },
  }

  const tableTopSearch = () => {
    return (
      <Space>
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
      </Space>
    )
  };


  return (<>
    <ProtableModule columns={columns} rowkey={rowkey} columnvalue={columnvalue} concealColumns={concealColumns} clientHeight={clientHeight} apishowurl={apishowurl} searchText={tableTopSearch()} rowSelection={false} searchVal={searchVal} incID={incID} tableKey={tableKey}/>
  </>)
}

export default Keyword
