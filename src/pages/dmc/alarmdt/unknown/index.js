import { useState } from 'react'
import { Input, Space, Tag, Popover, Typography } from 'antd'
import { language } from '@/utils/language'
import { TableLayout } from '@/components'
const { ProtableModule } = TableLayout
import moment from 'moment'
import { Link } from '@icon-park/react'
import DateTimeRangePicker from '@/components/Common/dtRangePicker'

const { Search } = Input

let clientHeight = document.body.clientHeight - 336
const dateFormat = 'YYYY-MM-DD HH:mm:ss'

export default function Transfer() {
  const [incID, setIncID] = useState(0) //表格刷新
  const [queryVal, setQueryVal] = useState('') //搜索框的值
  const [startTime, setStarttime] = useState(
    moment().subtract(1, 'months').format(dateFormat)
  ) //搜索框的值
  const [endTime, setEndtime] = useState(moment().format(dateFormat)) //搜索框的值
  let searchVal = {
    queryVal: queryVal,
    queryType: 'fuzzy',
    startTime: startTime,
    endTime: endTime,
  } //顶部搜索框值 传入接口

  const concealColumns = {
    srcport: { show: false },
    srcmac: { show: false },
    dstport: { show: false },
    dstmac: { show: false },
  }
  const levelMap = {
    NoRisk: language('alarmdt.risk.safe'),
    Normal: language('alarmdt.risk.kind'),
    Attention: language('alarmdt.risk.follow'),
    Serious: language('alarmdt.risk.serious'),
    Emergent: language('alarmdt.risk.urgent'),
  }
  const attachtypeMap = {
    keepalive: language('alarmdt.unknown.keepalive'),
    remotectrl: language('alarmdt.unknown.remotectrl'),
    abnormalproto: language('alarmdt.unknown.abnormalproto'),
    abnormalproxy: language('alarmdt.unknown.abnormalproxy'),
  }
  const columns = [
    {
      title: language('alarmdt.timestamp'),
      dataIndex: 'time',
      key: 'time',
      width: '140px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('alarmdt.risk'),
      dataIndex: 'level',
      key: 'level',
      width: '80px',
      align: 'center',
      render: (text) => {
        return <Tag color="orange">{levelMap[text]}</Tag>
      },
    },
    {
      title: language('alarmdt.ruleID'),
      dataIndex: 'ruleID',
      key: 'ruleID',
      width: '100px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('alarmdt.unknown.attachtype'),
      dataIndex: 'attachtype',
      key: 'attachtype',
      width: '80px',
      align: 'center',
      render: (text) => {
        return <Tag color="red">{attachtypeMap[text]}</Tag>
      },
    },
    {
      title: language('alarmdt.sip'),
      dataIndex: 'srcip',
      key: 'srcip',
      width: '100px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('alarmdt.sport'),
      dataIndex: 'srcport',
      key: 'srcport',
      width: '100px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('alarmdt.smac'),
      dataIndex: 'srcmac',
      key: 'srcmac',
      width: '100px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('alarmdt.dip'),
      dataIndex: 'dstip',
      key: 'dstip',
      width: '100px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('alarmdt.dstport'),
      dataIndex: 'dstport',
      key: 'dstport',
      width: '100px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('alarmdt.dstmac'),
      dataIndex: 'dstmac',
      key: 'dstmac',
      width: '100px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('alarmdt.unknown.reason'),
      dataIndex: 'reason',
      key: 'reason',
      width: '100px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('alarmdt.desc'),
      dataIndex: 'desc',
      key: 'desc',
      width: '100px',
      ellipsis: true,
      align: 'center',
    },
    {
      title: language('alarmdt.transfer.relfile'),
      dataIndex: 'file',
      key: 'file',
      width: '80px',
      align: 'center',
      render: (_, record) => {
        return (
          <Popover
            content={fileContent(record)}
            placement="leftTop"
            title={language('alarmdt.transfer.relfile')}
            trigger="click"
            arrowPointAtCenter
          >
            <Link
              theme="outline"
              size="20"
              fill="#37C3FC"
              strokeWidth={3}
              style={{ cursor: 'pointer' }}
            />
          </Popover>
        )
      },
    },
  ]

  const fileContent = (record) => {
    return (
      <>
        {record.filename && (
          <div>
            {language('alarmdt.unknown.filename')}
            {record.filename}
          </div>
        )}
        {record.filetype && (
          <div>
            {language('alarmdt.unknown.filetype')}
            {record.filetype}
          </div>
        )}
        {record.filetime && (
          <div>
            {language('alarmdt.unknown.filetime')}
            {record.filetime}
          </div>
        )}
        {record.checksum && (
          <div>
            {language('alarmdt.unknown.checksum')}
            <Typography.Text
              style={{
                maxWidth: '160px',
              }}
              ellipsis={{ tooltip: record.checksum }}
            >
              {record.checksum}
            </Typography.Text>
          </div>
        )}
      </>
    )
  }
  const changeTime = (time) => {
    setStarttime(time[0])
    setEndtime(time[1])
    setIncID(incID + 1)
  }
  /* 顶部左侧搜索框*/
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
        />
        <DateTimeRangePicker changeTime={changeTime} />
      </Space>
    )
  }
  return (
    <>
      <ProtableModule
        columns={columns}
        apishowurl="/cfg.php?controller=logAlarm&action=showUnknowAttackAlarm"
        clientHeight={clientHeight}
        columnvalue="unknownColumnvalue"
        tableKey="unknownTable"
        rowkey={'id'}
        incID={incID}
        searchText={tableTopSearch()}
        searchVal={searchVal}
        concealColumns={concealColumns}
      />
    </>
  )
}
