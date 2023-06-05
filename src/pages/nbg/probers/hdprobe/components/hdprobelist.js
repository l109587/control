import React, { useRef, useState, useEffect } from 'react'
import { language } from '@/utils/language'
import { TableLayout } from '@/components'
import {
  DrawerForm,
  ProCard,
  ProForm,
  ProFormItem,
  ProFormCheckbox,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components'
import {
  Button,
  Col,
  Space,
  Tag,
  message,
  Alert,
  Input,
  Tooltip,
  Spin,
} from 'antd'
import { drawFormLayout } from '@/utils/helper'
import store from 'store'
import { EthernetOff, Cpu, User, Tool } from '@icon-park/react'
import Blweb from '@/assets/nfd/blueif-web.png'
import Grweb from '@/assets/nfd/garyif-web.png'
import BlSver from '@/assets/nfd/blueservers.svg'
import GrSver from '@/assets/nfd/grayservers.svg'
import BlAssem from '@/assets/nfd/blue-assembly.svg'
import GrAssem from '@/assets/nfd/gray-assembly.svg'
import { post, get } from '@/services/https'
import { LoadingOutlined } from '@ant-design/icons'
import { fetchAuth } from '@/utils/common';
import { useSelector } from 'umi'
const { ProtableModule } = TableLayout
const { Search } = Input

let getMonInfoTimer
const Hdprobelist = () => {
  const contentHeight = useSelector(({ app }) => app.contentHeight)
  const clientHeight = contentHeight - 264
  const writable = fetchAuth()
  const [drawLeftStatus, setDrawLeftStatus] = useState(false)
  const columnlist = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: language('project.mconfig.ectstu'),
      dataIndex: 'state',
      width: 80,
      align: 'center',
      render: (text, record, index) => {
        let color = 'success'
        if (record.state == 1) {
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
      title: language('probers.hdprobe.hdprobelist.serial'),
      dataIndex: 'serial',
      key: 'serial',
      width: 120,
      ellipsis: true,
      align: 'left',
    },
    {
      title: language('project.temporary.terminal.devName'),
      dataIndex: 'devName',
      width: 140,
      key: 'devName',
      ellipsis: true,
    },
    {
      title: language('project.temporary.terminal.addr'),
      dataIndex: 'ipAddr',
      width: 130,
      key: 'ipAddr',
      ellipsis: true,
    },
    {
      title: language('project.temporary.terminal.mac'),
      dataIndex: 'mac',
      width: 140,
      key: 'mac',
      ellipsis: true,
    },
    {
      title: language('project.temporary.terminal.listversion'),
      dataIndex: 'version',
      key: 'version',
      width: 150,
      ellipsis: true,
    },
    {
      title: language('probers.hdprobe.hdprobelist.cpu'),
      dataIndex: 'cpu',
      key: 'cpu',
      width: 120,
      ellipsis: true,
    },
    {
      title: language('probers.hdprobe.hdprobelist.mem'),
      dataIndex: 'mem',
      key: 'mem',
      width: 120,
      ellipsis: true,
    },
    {
      title: language('project.temporary.terminal.conf'),
      dataIndex: 'vioInfo',
      width: 140,
      key: 'vioInfo',
      align: 'center',
      ellipsis: true,
      render: (text, record, _, action) => {
        let Ifweb
        let Sverver
        let Assem
        if (record.vioInfo.indexOf('ckInOut') !== -1) {
          Ifweb = Blweb
        }
        if (record?.vioInfo?.indexOf('ckInOut') === -1) {
          Ifweb = Grweb
        }
        if (record?.vioInfo?.indexOf('vioSrv') !== -1) {
          Sverver = BlSver
        }
        if (record?.vioInfo?.indexOf('vioSrv') === -1) {
          Sverver = GrSver
        }
        if (record?.vioInfo?.indexOf('vioDev') !== -1) {
          Assem = BlAssem
        }
        if (record?.vioInfo?.indexOf('vioDev') === -1) {
          Assem = GrAssem
        }
        return (
          <Space>
            <Tooltip title={language('probers.teprobe.ckInOut')}>
              <img src={Ifweb} style={{ width: '18px', height: '18px' }} />
            </Tooltip>
            <Tooltip title={language('probers.teprobe.vioSrv')}>
              <img src={Sverver} style={{ width: '18px', height: '18px' }} />
            </Tooltip>
            <Tooltip title={language('probers.teprobe.vioDev')}>
              <img src={Assem} style={{ width: '18px', height: '18px' }} />
            </Tooltip>
          </Space>
        )
      },
    },
    {
      title: language('project.temporary.terminal.registTM'),
      dataIndex: 'registerTM',
      key: 'registerTM',
      width: 160,
      ellipsis: true,
    },
    {
      title: language('project.mconfig.operate'),
      valueType: 'option',
      width: 120,
      align: 'center',
      hideInTable: !writable,
      fixed: 'right',
      render: (text, record, _, action) => {
        let disable
        if (record.state == 1) {
          disable = false
        } else {
          disable = true
        }
        return (
          <>
            <Button
              type="link"
              size="small"
              disabled={disable}
              onClick={() => {
                setPbViewIp(record.ipAddr)
                showDraw('open', record.ipAddr)
              }}
            >
              {language('project.see')}
            </Button>
            <Button
              type="link"
              size="small"
              disabled={disable}
              onClick={() => {
                showNewPage(record.ipAddr)
              }}
            >
              {language('probers.hdprobe.hdprobelist.historyPush')}
            </Button>
          </>
        )
      },
    },
  ]

  const cfgColumns = [
    {
      title: 'VLAN',
      dataIndex: 'vlanID',
      align: 'left',
      width: '25%',
      ellipsis: true,
    },
    {
      title: language('project.monitor.crossed.addr'),
      dataIndex: 'netAddr',
      align: 'left',
      width: '35%',
      ellipsis: true,
    },
    {
      title: language('project.monitor.crossed.netmask'),
      dataIndex: 'netMask',
      align: 'left',
      width: '20%',
      ellipsis: true,
    },
  ]

  const monColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      align: 'center',
      width: 80,
      ellipsis: true,
      hideInTable: true,
    },
    {
      title: language('monitor.montask.status'),
      dataIndex: 'state',
      align: 'center',
      width: 80,
      ellipsis: true,
      render: (text, record, index) => {
        let color = 'success'
        if (record.state == 1) {
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
      title: 'IP',
      dataIndex: 'addr',
      align: 'left',
      width: 120,
      ellipsis: true,
    },
    {
      title: 'MAC',
      dataIndex: 'mac',
      align: 'left',
      width: 140,
      ellipsis: true,
    },
    {
      title: 'VLAN',
      dataIndex: 'vlanID',
      align: 'left',
      width: 120,
      ellipsis: true,
    },
    {
      title: language('prbmgt.chkinfo.lastCheckTM'),
      dataIndex: 'lastCheckTM',
      align: 'left',
      width: 160,
      ellipsis: true,
    },
  ]

  const tableKey = 'hdprobelist'
  const concealColumns = {
    id: { show: false },
  }
  const drawformRef = useRef()
  const cfgFormRef = useRef()
  const [queryVal, setQueryVal] = useState() //首个搜索框的值
  const [incID, setIncID] = useState(0) //递增的id 删除/添加的时候增加触发刷新
  const apishowurl = '/cfg.php?controller=probeManage&action=showHrdprbList'
  let searchVal = { queryVal: queryVal, type: 'fuzzy' } //顶部搜索框值 传入接口
  const [baseInfo, setBaseInfo] = useState({})
  const [cfgDataSource, setCfgDataSource] = useState([])
  const [monDataSource, setMonDataSource] = useState([])
  const [totEntry, setTotEntry] = useState(0) // 总条数
  const [monTableLoading, setMonTableLoading] = useState(true)
  const [cfgLoading, setCfgLoading] = useState(true)
  const [pbViewIp, setPbViewIp] = useState('')
  const initLtVal = store.get('hdprbMonTable') ? store.get('hdprbMonTable') : 20
  const [limitVal, setLimitVal] = useState(initLtVal) // 每页条目
  const [currPage, setCurrPage] = useState(1) // 当前页码

  const tableTopSearch = () => {
    return (
      <Search
        placeholder={language('probers.hdprobe.hdprobelist.searchText')}
        allowClear
        className='hdprobeListSearch'
        onSearch={(queryVal) => {
          setQueryVal(queryVal)
          setIncID(incID + 1)
        }}
      />
    )
  }

  const showDraw = (state, ip) => {
    if (state == 'open') {
      setDrawLeftStatus(true)
      setCurrPage(1)
      getBaseInfo(ip)
      getCfgInfo(ip)
      getMonData(ip)
    } else {
      drawformRef.current.resetFields()
      setDrawLeftStatus(false)
    }
  }

  const showNewPage = (ip) => {
    post('/cfg.php?controller=probeManage&action=showAutoLoginInfo', {
      ipAddr: ip,
    }).then((res) => {
      if (!res.success) {
        message.error(res.msg)
        return false
      }
      if (res.data.url) {
        window.open(res.data.url, '_blank')
      }
    })
  }

  const getBaseInfo = (ip) => {
    post('/cfg.php?controller=probeManage&action=showHrdprbBasic', {
      ipAddr: ip,
    }).then((res) => {
      if (!res.success) {
        message.error(res.msg)
        return false
      }
      setBaseInfo(res)
    })
  }

  const getCfgInfo = (ip) => {
    post('/cfg.php?controller=probeManage&action=showHrdprbConfInfo', {
      ipAddr: ip,
    }).then((res) => {
      if (!res.success) {
        message.error(res.msg)
        setCfgLoading(false)
        return false
      }
      setCfgLoading(false)
      cfgFormRef.current.setFieldsValue(res)
      setCfgDataSource(res.netRange)
    })
  }

  let num = 1
  const getMonData = (ip, current, pageSize) => {
    setMonTableLoading(true)
    let data = {}
    data.ipAddr = ip ? ip : pbViewIp
    data.start = current ? pageSize * (current - 1) : 0
    data.limit = pageSize ? pageSize : limitVal
    data.cnt = num
    post(
      '/cfg.php?controller=probeManage&action=showHrdprbMonitorInfo',
      data
    ).then((res) => {
      if (res.result === 'loading') {
        getMonInfoTimer = setTimeout(() => {
          num++
          if (num > 30) {
            message.error(res.msg)
            setMonTableLoading(false)
            clearTimeout(getMonInfoTimer)
            return false
          } else {
            getMonData(ip)
          }
        }, 1000)
      } else if (res.result === 'ready') {
        clearTimeout(getMonInfoTimer)
        num = 1
        setMonTableLoading(false)
        setTotEntry(res?.total)
        setMonDataSource(res?.data)
      } else {
        message.error(res.msg)
        clearTimeout(getMonInfoTimer)
        setMonTableLoading(false)
        return false
      }
    })
  }

  const showInterfaces = () => {
    return baseInfo?.interfaces?.map((item, index) => {
      return (
        <div className="ernetColDiv">
          <EthernetOff theme="two-tone" size="24" fill={['#12c189', '#fff']} />
          <div className="interfaces">{item.toUpperCase()}</div>
        </div>
      )
    })
  }

  const showOccupy = () => {
    let cpuColor
    let memCOlor
    if (baseInfo.cpu <= 60) {
      cpuColor = '#12C189'
    } else if (60 < baseInfo.cpu && baseInfo.cpu < 80) {
      cpuColor = '#FFFF00'
    } else if (baseInfo.cpu >= 80) {
      cpuColor = '#FF0000'
    }
    if (baseInfo.mem <= 60) {
      memCOlor = '#12C189'
    } else if (60 < baseInfo.mem && baseInfo.mem < 80) {
      memCOlor = '#FFFF00'
    } else if (baseInfo.mem >= 80) {
      memCOlor = '#FF0000'
    }
    return (
      <Space>
        <Cpu theme="two-tone" size="24" fill={[cpuColor, '#fff']} />
        <span>
          {baseInfo.cpu ? (
            baseInfo?.cpu + '%'
          ) : (
            <>
              <LoadingOutlined
                style={{
                  color: '#1890ff',
                  fontSize: 18,
                }}
              />{' '}
              %
            </>
          )}
        </span>
        <i
          className="fa fa-microchip"
          style={{
            color: memCOlor,
            fontSize: 24,
          }}
        />
        <span>
          {baseInfo.mem ? (
            baseInfo?.mem + '%'
          ) : (
            <>
              <LoadingOutlined
                style={{
                  color: '#1890ff',
                  fontSize: 18,
                }}
              />{' '}
              %
            </>
          )}
        </span>
      </Space>
    )
  }

  return (
    <>
      <ProtableModule
        incID={incID}
        tableKey={tableKey}
        columns={columnlist}
        apishowurl={apishowurl}
        clientHeight={clientHeight}
        concealColumns={concealColumns}
        searchText={tableTopSearch()}
        columnvalue={'hdprobelistTable'}
        searchVal={searchVal}
      />
      <DrawerForm
        {...drawFormLayout}
        formRef={drawformRef}
        width="55%"
        submitter={false}
        visible={drawLeftStatus}
        onVisibleChange={setDrawLeftStatus}
        drawerProps={{
          placement: 'right',
          closable: false,
          onClose: () => {
            clearTimeout(getMonInfoTimer)
            return false
          },
        }}
        autoFocusFirstInput
        submitTimeout={2000}
      >
        <ProCard ghost direction="column">
          <ProCard
            ghost
            title={
              <div className="drawCardTitle">
                {language('probers.hdprobe.hdprobelist.baseInfo')}
              </div>
            }
          >
            <Col offset={1}>
              <ProForm
                className="baseInfoForm"
                layout="inline"
                submitter={false}
              >
                <ProFormItem
                  label={language('probers.hdprobe.hdprobelist.devName')}
                >
                  <Tooltip placement="topLeft" title={baseInfo.devName}>
                    <div className="baseInfoItem">{baseInfo.devName}</div>
                  </Tooltip>
                </ProFormItem>
                <ProFormItem
                  label={language('probers.hdprobe.hdprobelist.addr')}
                >
                  <Tooltip placement="topLeft" title={baseInfo.addr}>
                    <div className="baseInfoItem">{baseInfo.addr}</div>
                  </Tooltip>
                </ProFormItem>
                <ProFormItem
                  label={language('probers.hdprobe.hdprobelist.mac')}
                >
                  <Tooltip placement="topLeft" title={baseInfo.mac}>
                    <div className="baseInfoItem">{baseInfo.mac}</div>
                  </Tooltip>
                </ProFormItem>
                <ProFormItem
                  label={language('probers.hdprobe.hdprobelist.serial')}
                >
                  <Tooltip placement="topLeft" title={baseInfo.serial}>
                    <div className="baseInfoItem">{baseInfo.serial}</div>
                  </Tooltip>
                </ProFormItem>
                <ProFormItem
                  label={language('probers.hdprobe.hdprobelist.model')}
                >
                  <Tooltip placement="topLeft" title={baseInfo.model}>
                    <div className="baseInfoItem">{baseInfo.model}</div>
                  </Tooltip>
                </ProFormItem>
                <ProFormItem
                  label={language('probers.hdprobe.hdprobelist.type')}
                >
                  <Tooltip placement="topLeft" title={baseInfo.type}>
                    <div className="baseInfoItem">{baseInfo.type}</div>
                  </Tooltip>
                </ProFormItem>
                <ProFormItem
                  label={language('probers.hdprobe.hdprobelist.sysVersion')}
                >
                  <Tooltip placement="topLeft" title={baseInfo.sysVersion}>
                    <div className="baseInfoItem">{baseInfo.sysVersion}</div>
                  </Tooltip>
                </ProFormItem>
                <ProFormItem
                  label={language('probers.hdprobe.hdprobelist.sysTM')}
                >
                  <Tooltip placement="topLeft" title={baseInfo.sysTM}>
                    <div className="baseInfoItem">{baseInfo.sysTM}</div>
                  </Tooltip>
                </ProFormItem>
                <ProFormItem
                  label={language('probers.hdprobe.hdprobelist.onlineTM')}
                >
                  <Tooltip placement="topLeft" title={baseInfo.onlineTM}>
                    <div className="baseInfoItem">{baseInfo.onlineTM}</div>
                  </Tooltip>
                </ProFormItem>
                <ProFormItem
                  label={language('probers.hdprobe.hdprobelist.showInterfaces')}
                >
                  <div className="interfacesDiv">{showInterfaces()}</div>
                </ProFormItem>
                <ProFormItem
                  label={language('probers.hdprobe.hdprobelist.showOccupy')}
                >
                  {showOccupy()}
                </ProFormItem>
              </ProForm>
            </Col>
          </ProCard>
          <ProCard
            ghost
            title={
              <div className="drawCardTitle">
                {language('probers.hdprobe.hdprobelist.cfgInfo')}
              </div>
            }
          >
            <Col offset={1}>
              <ProForm
                className="cfgForm"
                layout="horizontal"
                submitter={false}
                formRef={cfgFormRef}
              >
                <ProFormCheckbox.Group
                  name="vioInfo"
                  label={language('prbmgt.chkconf.vioInfo')}
                  options={[
                    {
                      label: language('project.monitor.illegal.outline'),
                      value: 'vioOutline',
                    },
                    {
                      label: language('project.monitor.illegal.lllegalservice'),
                      value: 'vioServer',
                    },
                    {
                      label: language('probers.teprobe.vioDev'),
                      value: 'vioDevice',
                    },
                  ]}
                />
                <ProFormText
                  label={language('probers.hdprobe.hdprobelist.netRange')}
                  name="netRange"
                >
                  <ProTable
                    size="small"
                    rowKey="index"
                    scroll={{ y: 130 }}
                    loading={cfgLoading}
                    tableStyle={{ width: '70%' }}
                    bordered={true}
                    columns={cfgColumns}
                    dataSource={cfgDataSource}
                    search={false}
                    options={false}
                    pagination={false}
                  />
                </ProFormText>
              </ProForm>
            </Col>
          </ProCard>
          <ProCard
            ghost
            title={
              <div className="drawCardTitle">
                {language('probers.hdprobe.hdprobelist.monInfo')}
              </div>
            }
          >
            <Col offset={1}>
              <ProTable
                className="hdpbmonTable"
                size="small"
                rowKey="index"
                scroll={{ y: 160 }}
                tableStyle={{ width: '100%' }}
                bordered={true}
                columns={monColumns}
                loading={monTableLoading}
                dataSource={monDataSource}
                search={false}
                options={false}
                onChange={(paging, filters, sorter) => {
                  setCurrPage(paging.current)
                  setLimitVal(paging.pageSize)
                  getMonData(pbViewIp, paging.current, paging.pageSize)
                  store.set('hdprbMonTable', paging.pageSize)
                }}
                pagination={{
                  showSizeChanger: true,
                  pageSize: limitVal,
                  current: currPage,
                  total: totEntry,
                  showTotal: (total) =>
                    language('project.page', { total: total }),
                }}
              />
            </Col>
          </ProCard>
        </ProCard>
      </DrawerForm>
    </>
  )
}

export default Hdprobelist
