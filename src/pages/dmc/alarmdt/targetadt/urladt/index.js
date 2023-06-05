import { useState } from 'react'
import { Input, Space, Tag, Popover, Typography } from 'antd'
import { language } from '@/utils/language'
const { Search } = Input
import { TableLayout } from '@/components'
const { ProtableModule } = TableLayout
import moment from 'moment'
import { Link } from '@icon-park/react'
import DateTimeRangePicker from '@/components/Common/dtRangePicker'

let clientHeight = document.body.clientHeight - 336
const dateFormat = 'YYYY-MM-DD HH:mm:ss'

export default function Trojan() {
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
    server: { show: false },
    referpage: { show: false },
  }
  const levelMap = {
    NoRisk: language('alarmdt.risk.safe'),
    Normal: language('alarmdt.risk.kind'),
    Attention: language('alarmdt.risk.follow'),
    Serious: language('alarmdt.risk.serious'),
    Emergent: language('alarmdt.risk.urgent'),
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
      title: language('alarmdt.targetadt.visitUrl'),
      dataIndex: 'url',
      key: 'url',
      width: '130px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('alarmdt.targetadt.method'),
      dataIndex: 'method',
      key: 'method',
      width: '80px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('alarmdt.targetadt.statuscode'),
      dataIndex: 'statuscode',
      key: 'statuscode',
      width: '80px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: 'UserAgent',
      dataIndex: 'useragent',
      key: 'useragent',
      width: '140px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: 'Cookie',
      dataIndex: 'cookie',
      key: 'cookie',
      width: '100px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('alarmdt.targetadt.server'),
      dataIndex: 'server',
      key: 'server',
      width: '120px',
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('alarmdt.targetadt.referpage'),
      dataIndex: 'referpage',
      key: 'referpage',
      width: '100px',
      ellipsis: true,
      align: 'left',
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
        apishowurl="/cfg.php?controller=logAlarm&action=showURLAuditAlarm"
        clientHeight={clientHeight}
        columnvalue="trojanColumnvalue"
        tableKey="trojanTable"
        rowkey={'id'}
        incID={incID}
        searchText={tableTopSearch()}
        searchVal={searchVal}
        concealColumns={concealColumns}
      />
    </>
  )
}
