import React, { useRef, useState, useEffect, useMemo } from 'react'
import { Link, useLocation, history,useSelector} from 'umi'
import { Tooltip, Input, Tag, Row, Col, Tabs } from 'antd'
import PortTable from './table'
import { msg } from '@/utils/fun'
import { CloseOutlined } from '@ant-design/icons'
import portlgt from '../../../../assets/switch/portlgt.png' //绿色端口
import portgt from '../../../../assets/switch/portgt.png' //灰色
import portot from '../../../../assets/switch/portot.png' //橙黄色
import portbt from '../../../../assets/switch/portbt.png' //蓝色
import portdgt from '../../../../assets/switch/portdgt.png' //暗绿色
import portlg from '../../../../assets/switch/portlg.png' //绿色
import portg from '../../../../assets/switch/portg.png' //灰色
import porto from '../../../../assets/switch/porto.png' //橙黄色
import portb from '../../../../assets/switch/portb.png' //蓝色
import portdg from '../../../../assets/switch/portdg.png' //暗绿色
import huawei from '../../../../assets/switch/logo_huawei.png' //huawei图标
import cisco from '../../../../assets/switch/logo_cisco.png' //cisco图标
import h3c from '../../../../assets/switch/logo_h3c.png' //hsc图标
import ruijie from '../../../../assets/switch/logo_ruijie.png' //ruijie图标
import { language } from '@/utils/language'
import { post, get } from '@/services/https'
import styles from './port.less'
import store from 'store'
import { TableLayout } from '@/components'
const { ProtableModule } = TableLayout
const { Search } = Input
const { TabPane } = Tabs

export default function Prot() {
  const contentHeight = useSelector(({ app }) => app.contentHeight)
  const location = useLocation()
  const { query } = location
  const [opacity, setOpacity] = useState(1.0)
  const [queryVal, setQueryVal] = useState('') //网络设备页面搜索框的值
  const [portQueryVal, setPortQueryVal] = useState('') //端口列表页面搜索框的值
  const [switchDetails, setSwitchDetails] = useState({}) //返回数据
  const [isShow, setIsShow] = useState(-1) //点击数字添加背景
  const scanButton = true //删除按钮 与 scanClick 方法 组合使用
  const [activeKey, setActiveKey] = useState('nswitch') //tabKey
  const [panes, setPanes] = useState([])
  const newTabIndex = useRef(0)
  const tableHeight = { y: contentHeight - 420, x: 'max-content' } //列表高度和宽度
  const [ifInVAl, setIfInVAl] = useState(0)
  const [incID, setIncID] = useState(0)

  const statusMap = {
    0: language('netanalyse.nettopo.colSta'),
    1: language('netanalyse.nettopo.idleSta'),
    2: language('netanalyse.nettopo.onlineSta'),
  }
  const linkMap = {
    0: '',
    1: 'Trunk',
    2: 'Access',
    3: 'Hybrid',
  }
  let searchVal = { swip: query.ip } //顶部搜索框值 传入接口
  let portSearchVal = {
    ifindex: isShow,
    queryVal: portQueryVal,
    swip: query.ip,
  }
  // useEffect(() => {
  //   setInterval(() => {
  //     var opacitys = opacity
  //     opacitys -= 0.7
  //     if (opacitys < 0.3) {
  //       opacitys = 1.0
  //     }
  //     setOpacity(opacitys)
  //   }, 100)
  // }, [opacity])

  useEffect(() => {
    switchDetail()
  }, [])

  //获取端口详细信息
  const switchDetail = () => {
    post('/cfg.php?controller=assetMapping&action=showSwitchDetail', {
      start: 0,
      limit: 50,
      swip: query.ip,
    })
      .then((res) => {
        setSwitchDetails(res.data)
        msg(res)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const columnsList = [
    {
      title: language('netanalyse.nswitch.ifName'),
      dataIndex: 'ifName',
      key: 'ifName',
      align: 'left',
      ellipsis: true,
      width: 150,
    },
    {
      title: language('project.sysconf.network.status'),
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      width: 80,
      render: (val) => {
        let color = '#5cb85c'
        switch (val) {
          case '0':
            color = '#777'
            break
          case '1':
            color = '#5cb85c'
            break
          case '2':
            color = '#337ab7'
        }
        return (
          <Tag style={{ border: 0 }} color={color}>
            {statusMap[val]}
          </Tag>
        )
      },
    },
    {
      title: language('netanalyse.nswitch.link'),
      dataIndex: 'link',
      key: 'link',
      align: 'center',
      width: 80,
      render: (val) => {
        let color = '#5cb85c'
        switch (val) {
          case '1':
            color = '#337ab7'
            break
          case '2':
            color = '#5cb85c'
            break
          case '3':
            color = '#FFA500'
            break
        }
        return (
          <Tag style={{ border: 0 }} color={color}>
            {linkMap[val]}
          </Tag>
        )
      },
    },
    {
      title: language('netanalyse.nswitch.phyMac'),
      dataIndex: 'phyMac',
      key: 'phyMac',
      align: 'left',
      ellipsis: true,
      width: 150,
    },
    {
      title: language('netanalyse.nswitch.entertermNum'),
      dataIndex: 'termNum',
      key: 'termNum',
      align: 'left',
      width: 100,
      render: (test, record) =>
        test > 0 ? (
          <a
            onClick={() => {
              ckickPort(record.ifIndex, 1) //传1就返回port
              store.set('ifIndex', record.ifIndex)
            }}
          >
            {test}
          </a>
        ) : (
          test
        ),
    },
    {
      title: language('netanalyse.nswitch.macCnt'),
      dataIndex: 'macCnt',
      key: 'macCnt',
      align: 'left',
      width: 100,
      render: (val, record) =>
        val > 0 ? (
          <a
            onClick={() => {
              setIfInVAl(record.ifIndex)
              store.set('ifIndex', record.ifIndex)
              ckickPort(record.ifIndex, 2) //传2就返回mac
            }}
          >
            {val}
          </a>
        ) : (
          val
        ),
    },
    {
      title: language('netanalyse.nswitch.initVlan'),
      dataIndex: 'initVlan',
      key: 'initVlan',
      align: 'left',
      ellipsis: true,
      width: 100,
    },
    {
      title: language('netanalyse.nswitch.currentVlan'),
      dataIndex: 'currentVlan',
      key: 'currentVlan',
      align: 'left',
      ellipsis: true,
      width: 100,
    },
    {
      title: language('netanalyse.nswitch.inBps'),
      dataIndex: 'inBps',
      key: 'inBps',
      align: 'left',
      ellipsis: true,
      width: 100,
    },
    {
      title: language('netanalyse.nswitch.outBps'),
      dataIndex: 'outBps',
      key: 'outBps',
      align: 'left',
      ellipsis: true,
      width: 100,
    },
  ]
  const termColumnsList = [
    {
      title: language('project.analyse.illinn.addr'),
      dataIndex: 'ip',
      key: 'ip',
      align: 'left',
      ellipsis: true,
      width: 130,
    },
    {
      title: language('project.analyse.illout.mac'),
      dataIndex: 'mac',
      key: 'mac',
      align: 'left',
      ellipsis: true,
      width: 180,
    },
    {
      title: language('netanalyse.nswitch.swphyMacitchType'),
      dataIndex: 'devType',
      key: 'devType',
      align: 'left',
      ellipsis: true,
      width: 130,
    },
    {
      title: language('netanalyse.nswitch.sysType'),
      dataIndex: 'sysType',
      key: 'sysType',
      align: 'left',
      ellipsis: true,
      width: 130,
    },
    {
      title: language('project.sysconf.analysis.macOUI'),
      dataIndex: 'macVendorAbbr',
      key: 'macVendorAbbr',
      align: 'left',
      ellipsis: true,
      width: 250,
    },
  ]

  /* 顶部左侧搜索框*/
  let num = 0
  const tableTopSearch = () => {
    return (
      <Search
        placeholder="IP/MAC"
        allowClear
        defaultValue={store.get('PortQueryVal')}
        style={{ width: 200 }}
        onSearch={(queryVal) => {
          setPortQueryVal(queryVal)
          store.set('PortQueryVal', queryVal)
          num++
          add(store.get('ifIndex'), 1, num, queryVal)
        }}
      />
    )
  }

  const macSearch = () => {
    return (
      <Search
        placeholder="IP/MAC"
        allowClear
        style={{ width: 200 }}
        defaultValue={store.get('PortQueryVal')}
        onSearch={(queryVal) => {
          setPortQueryVal(queryVal)
          store.set('PortQueryVal', queryVal)
          num++
          setPortQueryVal(queryVal)
          add(store.get('ifIndex'), 2, num, queryVal)
        }}
      />
    )
  }

  //重新扫描
  const scanClick = () => {
    post('/cfg.php?controller=assetMapping&action=reScan', {
      swip: query.ip,
    })
      .then((res) => {
        msg(res)
      })
      .catch(() => {
        console.log('mistake')
      })
  }
  const switchIcon = () => {
    if (switchDetails?.icon === '/resource/images/topology/logo_huawei.png') {
      return <img src={huawei}></img>
    } else if (
      switchDetails?.icon === '/resource/images/topology/logo_h3c.png'
    ) {
      return <img src={h3c}></img>
    } else if (
      switchDetails?.icon === '/resource/images/topology/logo_cisco.png'
    ) {
      return <img src={cisco}></img>
    } else if (
      switchDetails?.icon === '/resource/images/topology/logo_ruijie.png'
    ) {
      return <img src={ruijie}></img>
    } else {
      return <div></div>
    }
  }
  const ckickPort = (ifIndex, portOrmac) => {
    setIsShow(ifIndex)
    add(ifIndex, portOrmac)
  }
  function handleFootState(ifIndex, ifname, state, term_num, link, portid) {
    if (state === '0')
      return (
        <div>
          <div style={{ width: '24px', height: '24px' }}>
            <img src={portg} style={{ width: '100%', height: '100%' }}></img>
          </div>
          <Tooltip
            className={styles.portid}
            title={
              <div>
                <div>{ifname}</div>
                <div>
                  {language('project.netanalyse.nettopo.terminalnum')}:
                  {term_num}
                </div>
              </div>
            }
          >
            <div
              className={isShow === ifIndex ? styles.portBground : ''}
              // onClick={() => ckickPort(ifIndex, 1)}
              style={{
                display: 'flex',
                justifyContent: 'center',
                fontWeight: 800,
                color: '#999999',
                height: '24px',
                lineHeight: '24px',
              }}
            >
              {portid}
            </div>
          </Tooltip>
        </div>
      )
    if (link === '1')
      return (
        <div>
          <div style={{ width: '24px', height: '24px' }}>
            <img src={portb} style={{ width: '100%', height: '100%' }}></img>
          </div>
          <Tooltip
            className={styles.portid}
            title={
              <div>
                <div>{ifname}</div>
                <div>
                  {language('project.netanalyse.nettopo.terminalnum')}:
                  {term_num}
                </div>
              </div>
            }
          >
            <div
              className={isShow === ifIndex ? styles.portBground : ''}
              onClick={() => ckickPort(ifIndex, 1)}
              style={{
                display: 'flex',
                justifyContent: 'center',
                fontWeight: 800,
                color: '#337ab7',
                height: '24px',
                lineHeight: '24px',
              }}
            >
              {portid}
            </div>
          </Tooltip>
        </div>
      )
    if (term_num === 0) {
      return (
        <div>
          <div style={{ width: '24px', height: '24px' }}>
            <img src={portlg} style={{ width: '100%', height: '100%' }}></img>
          </div>
          <Tooltip
            className={styles.portid}
            title={
              <div>
                <div>{ifname}</div>
                <div>
                  {language('project.netanalyse.nettopo.terminalnum')}:
                  {term_num}
                </div>
              </div>
            }
          >
            <div
              className={isShow === ifIndex ? styles.portBground : ''}
              // onClick={() => ckickPort(ifIndex, 1)}
              style={{
                display: 'flex',
                justifyContent: 'center',
                fontWeight: 800,
                color: '#03ce03',
                height: '24px',
                lineHeight: '24px',
              }}
            >
              {portid}
            </div>
          </Tooltip>
        </div>
      )
    } else if (term_num === 1) {
      return (
        <div>
          <div style={{ width: '24px', height: '24px' }}>
            <img src={portdg} style={{ width: '100%', height: '100%' }}></img>
          </div>
          <Tooltip
            className={styles.portid}
            title={
              <div>
                <div>{ifname}</div>
                <div>
                  {language('project.netanalyse.nettopo.terminalnum')}:
                  {term_num}
                </div>
              </div>
            }
          >
            <div
              className={isShow === ifIndex ? styles.portBground : ''}
              onClick={() => ckickPort(ifIndex, 1)}
              style={{
                opacity: opacity,
                display: 'flex',
                justifyContent: 'center',
                color: '#228B22',
                fontWeight: 800,
                height: '24px',
                lineHeight: '24px',
              }}
            >
              {portid}
            </div>
          </Tooltip>
        </div>
      )
    } else {
      return (
        <div>
          <div style={{ width: '24px', height: '24px' }}>
            <img src={porto} style={{ width: '100%', height: '100%' }}></img>
          </div>
          <Tooltip
            className={styles.portid}
            title={
              <div>
                <div>{ifname}</div>
                <div>
                  {language('project.netanalyse.nettopo.terminalnum')}:
                  {term_num}
                </div>
              </div>
            }
          >
            <div
              className={isShow === ifIndex ? styles.portBground : ''}
              onClick={() => ckickPort(ifIndex, 1)}
              style={{
                opacity: opacity,
                display: 'flex',
                justifyContent: 'center',
                fontWeight: 800,
                color: '#FFA500',
                height: '24px',
                lineHeight: '24px',
              }}
            >
              {portid}
            </div>
          </Tooltip>
        </div>
      )
    }
  }
  function handleTopState(ifIndex, ifname, state, term_num, link, portid) {
    if (state == '0')
      return (
        <div>
          <Tooltip
            className={styles.portid}
            title={
              <div>
                <div>{ifname}</div>
                <div>
                  {language('project.netanalyse.nettopo.terminalnum')}:
                  {term_num}
                </div>
              </div>
            }
          >
            <div
              className={isShow === ifIndex ? styles.portBground : ''}
              // onClick={() => ckickPort(ifIndex, 1)}
              style={{
                display: 'flex',
                justifyContent: 'center',
                fontWeight: 800,
                color: '#999999',
                height: '24px',
                lineHeight: '24px',
              }}
            >
              {portid}
            </div>
          </Tooltip>
          <div style={{ width: '24px', height: '24px' }}>
            <img src={portgt} style={{ width: '100%', height: '100%' }}></img>
          </div>
        </div>
      )
    if (link == '1')
      return (
        <div>
          <Tooltip
            className={styles.portid}
            title={
              <div>
                <div>{ifname}</div>
                <div>
                  {language('project.netanalyse.nettopo.terminalnum')}:
                  {term_num}
                </div>
              </div>
            }
          >
            <div
              className={isShow === ifIndex ? styles.portBground : ''}
              onClick={() => ckickPort(ifIndex, 1)}
              style={{
                display: 'flex',
                justifyContent: 'center',
                fontWeight: 800,
                color: '#337ab7',
                height: '24px',
                lineHeight: '24px',
              }}
            >
              {portid}
            </div>
          </Tooltip>
          <div style={{ width: '24px', height: '24px' }}>
            <img src={portbt} style={{ width: '100%', height: '100%' }}></img>
          </div>
        </div>
      )
    if (term_num == 0) {
      return (
        <div>
          <Tooltip
            className={styles.portid}
            title={
              <div>
                <div>{ifname}</div>
                <div>
                  {language('project.netanalyse.nettopo.terminalnum')}:
                  {term_num}
                </div>
              </div>
            }
          >
            <div
              className={isShow === ifIndex ? styles.portBground : ''}
              // onClick={() => ckickPort(ifIndex, 1)}
              style={{
                display: 'flex',
                justifyContent: 'center',
                fontWeight: 800,
                color: '#03ce03',
                height: '24px',
                lineHeight: '24px',
              }}
            >
              {portid}
            </div>
          </Tooltip>
          <div style={{ width: '24px', height: '24px' }}>
            <img src={portlgt} style={{ width: '100%', height: '100%' }}></img>
          </div>
        </div>
      )
    } else if (term_num == 1) {
      return (
        <div>
          <Tooltip
            className={styles.portid}
            title={
              <div>
                <div>{ifname}</div>
                <div>
                  {language('project.netanalyse.nettopo.terminalnum')}:
                  {term_num}
                </div>
              </div>
            }
          >
            <div
              className={isShow === ifIndex ? styles.portBground : ''}
              onClick={() => ckickPort(ifIndex, 1)}
              style={{
                opacity: opacity,
                display: 'flex',
                justifyContent: 'center',
                color: '#228B22',
                fontWeight: 800,
                height: '24px',
                lineHeight: '24px',
              }}
            >
              {portid}
            </div>
          </Tooltip>
          <div style={{ width: '24px', height: '24px' }}>
            <img src={portdgt} style={{ width: '100%', height: '100%' }}></img>
          </div>
        </div>
      )
    } else {
      return (
        <div>
          <Tooltip
            className={styles.portid}
            title={
              <div>
                <div>{ifname}</div>
                <div>
                  {language('project.netanalyse.nettopo.terminalnum')}:
                  {term_num}
                </div>
              </div>
            }
          >
            <div
              className={isShow === ifIndex ? styles.portBground : ''}
              onClick={() => ckickPort(ifIndex, 1)}
              style={{
                opacity: opacity,
                display: 'flex',
                justifyContent: 'center',
                fontWeight: 800,
                color: '#FFA500',
                height: '24px',
                lineHeight: '24px',
              }}
            >
              {portid}
            </div>
          </Tooltip>
          <div style={{ width: '24px', height: '24px' }}>
            <img src={portot} style={{ width: '100%', height: '100%' }}></img>
          </div>
        </div>
      )
    }
  }

  //tab切换回调
  const onChange = (key) => {
    setActiveKey(key)
  }
  //tab的增加和删除
  const onEdit = (targetKey, action) => {
    if (action === 'add') {
      add()
    } else {
      remove(targetKey)
    }
  }

  //删除tab
  const remove = (targetKey) => {
    let newActiveKey = activeKey
    let lastIndex = -1
    panes.forEach((pane, i) => {
      if (pane.key === targetKey) {
        lastIndex = i - 1
      }
    })
    const newPanes = panes.filter((pane) => pane.key !== targetKey)

    if (newPanes.length && newActiveKey === targetKey) {
      if (lastIndex >= 0) {
        newActiveKey = newPanes[lastIndex].key
      } else {
        newActiveKey = newPanes[0].key
      }
    }

    setPanes(newPanes)
    setActiveKey('nswitch')
    setIsShow(-1)
  }

  //添加tab
  const add = (ifIndex, portOrmac, num, value) => {
    const newActiveKey = `newTab${newTabIndex.current++}`
    const newPanes = [...panes]
    portSearchVal.queryVal = value
    const newportSearchVal = { ...portSearchVal, ifindex: ifIndex }
    newPanes.pop()
    newPanes.push({
      title:
        portOrmac === 1
          ? language('netanalyse.nswitch.port.accessterm')
          : language('netanalyse.nswitch.port.accessmac'),
      content: (
        <ProtableModule
          clientHeight={contentHeight - 455}
          columnvalue={portOrmac === 1 ? 'switChcolumnvalue' : 'macColumnvalue'}
          tableKey={portOrmac === 1 ? 'switchTable' : 'macTable'}
          columns={termColumnsList}
          searchVal={newportSearchVal}
          incID={num}
          searchText={portOrmac === 1 ? tableTopSearch() : macSearch()}
          concealColumns={{}}
          apishowurl={
            portOrmac === 1
              ? '/cfg.php?controller=assetMapping&action=showPortTerm'
              : '/cfg.php?controller=assetMapping&action=showPortMAC'
          }
          rowkey={(record) => record.id}
        />
      ),
      key: newActiveKey,
    })
    setPanes(newPanes)
    setActiveKey(newActiveKey)
    store.set('PortQueryVal', '')
  }
  const MemoTable = useMemo(
    () => (
      <PortTable
        columns={columnsList}
        className="tablelist"
        tableKey="portTbale"
        rowkey={(record) => record.id}
        columnvalue={'switchPortTable'}
        concealColumns={{}}
        searchVal={searchVal}
        // searchText={tableTopSearch()}
        apishowurl="/cfg.php?controller=assetMapping&action=showSwitchDetail"
        scanButton={scanButton}
        scanClick={scanClick}
        clientHeight={tableHeight}
      />
    ),
    [searchVal]
  )
  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          padding: '12px 12px 0 0 ',
        }}
        onClick={() => history.goBack()}
      >
        <CloseOutlined />
      </div>
      <div style={{ padding: '12px' }}>
        <div
          style={{
            padding: '12px',
            backgroundColor: '#414141',
            height: '143px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              height: '98px',
            }}
          >
            <div style={{ cursor: 'pointer' }}>
              <Row gutter={10}>
                {switchDetails?.term
                  ?.filter((item, index) => index % 2 === 0)
                  .map((e) => (
                    <Col key={e.portId}>
                      {handleTopState(
                        e.ifIndex,
                        e.ifName,
                        e.status,
                        e.termNum,
                        e.link,
                        e.portId
                      )}
                    </Col>
                  ))}
              </Row>
              <Row gutter={10}>
                {switchDetails?.term
                  ?.filter((item, index) => index % 2 !== 0)
                  .map((e) => (
                    <Col key={e.portid}>
                      {handleFootState(
                        e.ifIndex,
                        e.ifName,
                        e.status,
                        e.termNum,
                        e.link,
                        e.portId
                      )}
                    </Col>
                  ))}
              </Row>
            </div>
            <div>
              {switchIcon()}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  paddingTop: '12px',
                }}
              >
                <p
                  style={{
                    fontSize: '18px',
                    fontWeight: 700,
                    color: '#fff',
                  }}
                >
                  {switchDetails?.model}
                </p>
              </div>
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              height: '20px',
            }}
          >
            <div style={{ color: '#fff', fontWeight: 500 }}>
              <span style={{ display: 'inline-block', width: '120px' }}>
                IP:{switchDetails?.ip}
              </span>
              <span>
                {language('project.netanalyse.nettopo.portnum')}:
                {switchDetails?.ifNum}
              </span>
            </div>
            <div style={{ color: '#fff' }}>
              <Row gutter={10}>
                <Col style={{ color: '#999999', fontSize: '20px' }}>*</Col>
                <Col style={{ display: 'flex', alignItems: 'center' }}>
                  {language('netanalyse.nettopo.colSta')}
                </Col>
                <Col style={{ color: '#03ce03', fontSize: '20px' }}>*</Col>
                <Col style={{ display: 'flex', alignItems: 'center' }}>
                  {language('netanalyse.nettopo.idleSta')}
                </Col>
                <Col
                  style={{
                    color: '#228B22',
                    fontSize: '20px',
                    opacity: opacity,
                  }}
                >
                  *
                </Col>
                <Col style={{ display: 'flex', alignItems: 'center' }}>
                  {language('netanalyse.nswitch.port.term')}
                </Col>
                <Col
                  style={{
                    color: '#FFA500',
                    fontSize: '20px',
                    opacity: opacity,
                  }}
                >
                  *
                </Col>
                <Col style={{ display: 'flex', alignItems: 'center' }}>
                  {language('netanalyse.nswitch.port.terms')}
                </Col>
                <Col style={{ color: '#337ab7', fontSize: '20px' }}>*</Col>
                <Col style={{ display: 'flex', alignItems: 'center' }}>
                  {language('netanalyse.nswitch.port.thunk')}
                </Col>
              </Row>
            </div>
          </div>
        </div>
      </div>

      <Tabs
        hideAdd
        onChange={onChange}
        activeKey={activeKey}
        type="editable-card"
        onEdit={onEdit}
        style={{ marginLeft: '12px' }}
        className={styles.tab}
      >
        <TabPane
          tab={language('netanalyse.nswitch.port.nettrem')}
          key="nswitch"
          closable={false}
        >
          {MemoTable}
        </TabPane>
        {panes.map((pane) => (
          <TabPane tab={pane.title} key={pane.key}>
            {pane.content}
          </TabPane>
        ))}
      </Tabs>
    </div>
  )
}
