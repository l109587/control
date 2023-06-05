import React, { useRef, useState, useEffect } from 'react';
import { DrawerForm, ModalForm, ProCard, StatisticCard, ProFormItem } from '@ant-design/pro-components';
import NetworkSta from '@/assets/nfd/anresmap-network.svg';
import HandleC from '@/assets/nfd/anresmap-handle-c.svg';
import Radal from '@/assets/nfd/anresmap-radal.svg';
import './resmap.less'
import { LoadingOutlined, WarningOutlined } from '@ant-design/icons';
import { fileDown, post } from '@/services/https';
import { Divider, Space, Input, Tooltip, Tag, Alert, Button, Spin } from 'antd';
import { AllApplication, Caution, FileQuestion, CheckOne, ScanningTwo } from '@icon-park/react';
import { language } from '@/utils/language';
import { TableLayout } from '@/components';
import iconTypeList from '@/utils/IconType.js';
import { modalFormLayout, drawFormLayout } from "@/utils/helper";
import { CheckCircleFilled, CheckCircleOutlined, CloseOutlined, ExclamationCircleFilled, WarningTwoTone, StarFilled } from '@ant-design/icons';
import Blweb from '@/assets/nfd/blueif-web.png';
import Grweb from '@/assets/nfd/garyif-web.png'
import BlSver from '@/assets/nfd/blueservers.svg';
import GrSver from '@/assets/nfd/grayservers.svg';
import BlAssem from '@/assets/nfd/blue-assembly.svg';
import GrAssem from '@/assets/nfd/gray-assembly.svg';
import Blv6 from '@/assets/nfd/bluev6.png';
import Grv6 from '@/assets/nfd/grayv6.png';
import download from '@/utils/downnloadfile'
import { Resizable } from 'react-resizable';
import { useSelector } from 'umi'
import { RiRadarFill } from 'react-icons/ri'
const { ProtableModule } = TableLayout;
const { Search } = Input;
let Width = document.body.clientWidth - 220
let clientWidth = Width

// 调整table表头
const ResizeableTitle = (props) => {
  const { onResize, width, ...restProps } = props;
  if(!width) {
    return <th {...restProps} />;
  }

  return (
    <Resizable
      width={width}
      height={0}
      onResize={onResize}
      draggableOpts={{ enableUserSelectHack: false }}
    >
      <th {...restProps} />
    </Resizable>
  );
};

export default () => {
  const contentHeight = useSelector(({ app }) => app.contentHeight)
  const clientHeight = contentHeight - 127
  const formRef = useRef();
  const drawformRef = useRef();
  const [modalStatus, setModalStatus] = useState(false);//model 添加弹框状态
  const [matrix, setMatrix] = useState([]);
  const [drawLeftStatus, setDrawLeftStatus] = useState(false);//draw   添加左侧弹框状态
  const [prbdetail, setPrbdetail] = useState();
  const [sumaydata, setSumaydata] = useState({});
  const [netvalue, setNetval] = useState('');
  const [downLoading, setDownLoading] = useState(false);

  const columnslist = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80,
      align: 'center',
      key: 'id',
      ellipsis: true
    },
    {
      title: language('analyse.resmap.net'),
      dataIndex: 'net',
      width: 160,
      key: 'net',
      align: 'left',
      ellipsis: true,
      render: (text, record, _, action) => {
        return (
          <div className='netipDiv'>
            <Tooltip title={language('analyse.resmap.showmatrix')}>
              <AllApplication className='matriIcon' style={{ height: '18px' }} theme="outline" size="18" fill="#12C189" onClick={() => {
                setNetval(record.net)
                getModal(1, record.net)
              }} />
            </Tooltip>
            <div style={{ marginLeft:5 }}>{record.net}</div>
          </div>
        )
      }
    },
    {
      title: language('analyse.resmap.usingTotal'),
      dataIndex: 'usingTotal',
      width: 120,
      key: 'usingTotal',
      align: 'left',
      ellipsis: true
    },
    {
      title: language('analyse.resmap.assetTotal'),
      dataIndex: 'assetTotal',
      width: 180,
      key: 'assetTotal',
      align: 'left',
      ellipsis: true,
      render: (text, record, _, action) => {
        return (<div className='assetTotDiv'>
          <div className='identDiv'>
            <div><ScanningTwo theme='outline' size='20' fill='#12C189' /></div>
            <div className='assetext'>{record.assetTotal.ident}</div>
          </div>
          <div className='disidentDiv'>
            <div><FileQuestion theme="multi-color" size="20" fill={['#DE868F', '#DE868F', '#FFF', '#fff']} /></div>
            <div className='assetext'>{record.assetTotal.disIdent}</div>
          </div>
        </div>)
      }
    },
    {
      title: language('analyse.resmap.vioTotal'),
      dataIndex: 'vioTotal',
      width: 130,
      key: 'vioTotal',
      align: 'left',
      ellipsis: true,
      render: (text, record, action) => {
        if(record.vioTotal == '0') {
          return (<div className='flexDiv'>
            <div className='assicon'><CheckOne theme="filled" fill='#12C189' size="20" /></div>
            <div className='resmaptext'>{language('analyse.resmap.vioNormal')}</div>
          </div>)
        } else if(record.vioTotal !== '0') {
          return (<div className='flexDiv'>
            <div className='assicon'><Caution theme="outline" size="18" fill='#FF0000' /></div>
            <div className='resmaptext'>{language('analyse.resmap.violation')} {record.vioTotal}</div>
          </div>)
        }
      }
    },
    {
      title: language('analyse.resmap.probeDeploy'),
      dataIndex: 'probeDeploy',
      width: 430,
      key: 'probeDeploy',
      align: 'left',
      ellipsis: true,
      render: (text, record, action) => {
        if(record.probeDeploy.deployStatus == 'Y') {
          let addr = record.net?.substr(0, record.net?.lastIndexOf('.'));
          let Arr = [];
          let color = '';
          Arr.push(<Tag color='#79B8F3' style={{ width: '70px' }}>
            <div className='probstaDiv'>
              <i className='ri-radar-fill' />
              <span style={{ marginLeft: 5, marginRight: 5 }}>{language('analyse.resmap.arrange')}</span>
            </div>
          </Tag>)
          record.probeDeploy?.info?.map((item, index) => {
            if(item.online == "1") {
              let ip = item.ip.substr(item.ip?.lastIndexOf('.'));
              let ipaddr = addr + ip;
              color = 'success';
              Arr.push(<div className='iconTagFa'><Tag className='iconTag' color={color} onClick={() => {
                getDraw(1, ipaddr)
              }} >{item.os == "chs" ? <i className='ri-shield-star-line'></i> : <i className='fa fa-windows'></i>}<span style={{ marginLeft: 5 }}>{item.ip}</span></Tag></div>)
            } else if(item.online == "0") {
              let ip = item.ip.substr(item.ip?.lastIndexOf('.'));
              let ipaddr = addr + ip;
              color = 'default';
              Arr.push(<div className='iconTagFa'><Tag className='iconTag' color={color} onClick={() => {
                getDraw(1, ipaddr)
              }}>{item.os == "chs" ? <i className='ri-shield-star-line'></i> : <i className='fa fa-windows'></i>}<span style={{ marginLeft: 5 }}>{item.ip}</span></Tag></div>)
            }
          })
          return <div className='probeDeployDiv'>{Arr}</div>
        } else if(record.probeDeploy.deployStatus == 'N') {
          let addr = record.net?.substr(0, record.net?.lastIndexOf('.'));
          let noArr = [];
          noArr.push(<Tag color='#FF7429' style={{ width: '70px' }}>
            <div className='probstaDiv'>
              <ExclamationCircleFilled style={{ fontSize: 14 }} />
              <span style={{ marginLeft: 5, marginRight: 5 }}>{language('analyse.resmap.noarrange')}</span>
            </div>
          </Tag>)
          record.probeDeploy?.info?.map((item, index) => {
            let ip = item.ip.substr(item.ip?.lastIndexOf('.'));
            let ipaddr = addr + ip;
            let color = 'orange';
            noArr.push(<div className='starTaFa'><Tag className='starTag' color={color} onClick={() => {
              getDraw(1, ipaddr)
            }}>{item.os == "chs" ? <i className='ri-shield-star-line'></i> : <i className='fa fa-windows'></i>}<span style={{ marginLeft: 5, marginRight: 5 }}>{item.ip}</span>{iconmap(item)}</Tag></div>)
          })
          return <div className='probeDeployDiv'>{noArr}</div>
        }
      }
    },
    {
      title: language('analyse.resmap.findCnt'),
      dataIndex: 'findCnt',
      width: 140,
      key: 'findCnt',
      align: 'left',
      ellipsis: true
    },
    {
      title: language('analyse.resmap.findTM'),
      dataIndex: 'findTM',
      width: 150,
      key: 'findTM',
      align: 'left',
      ellipsis: true
    },
  ]

  // 表格列
  const [cols, setCols] = useState(columnslist);
  const [columns, setColumns] = useState([])

  // 定义头部组件
  const components = {
    header: {
      cell: ResizeableTitle,
    },
  };

  // 处理拖拽
  const handleResize = (index) => (e, { size }) => {
    const nextColumns = [...cols];
    // 拖拽时调整宽度
    nextColumns[index] = {
      ...nextColumns[index],
      width: size.width < 120? 120 : size.width,
    };
    setCols(nextColumns);
  };

  useEffect(() => {
    setColumns((cols || []).map((col, index) => ({
      ...col,
      onHeaderCell: (column) => ({
        width: column.width,
        onResize: handleResize(index),
      }),
    })))
  }, [cols])

  const iconmap = (item) => {
    let arr = [];
    for(let i = 0; i < item.recommend; i++) {
      arr.push(<i className='ri-star-fill' style={{ color: '#FAAD15' }} />);
    }
    return arr;
  }

  useEffect(() => {
    getSummary()
  }, [])

  const getSummary = () => {
    post('/cfg.php?controller=assetMapping&action=showResourceSummary').then((res) => {
      setSumaydata(res)
    })
  }

  let census = [
    {
      title: language('analyse.resmap.netsumTitle'),
      direction: language('analyse.resmap.netsumTDirec'),
      imgsrc: NetworkSta,
      fircount: sumaydata?.netCount?.classA,
      firexplain: language('analyse.resmap.classA'),
      seccount: sumaydata?.netCount?.classB,
      secexplain: language('analyse.resmap.classB'),
      thicount: sumaydata?.netCount?.classC,
      thiexplain: language('analyse.resmap.classC'),
    },
    {
      title: language('analyse.resmap.usRateTitle'),
      direction: language('analyse.resmap.usRateDirec'),
      imgsrc: HandleC,
      fircount: sumaydata?.usingRate?.higher,
      firexplain: language('analyse.resmap.higher'),
      seccount: sumaydata?.usingRate?.equal,
      secexplain: language('analyse.resmap.equal'),
      thicount: sumaydata?.usingRate?.lower,
      thiexplain: language('analyse.resmap.lower'),
    },
    {
      title: language('analyse.resmap.probeTitle'),
      direction: language('analyse.resmap.probeDirec'),
      imgsrc: Radal,
      fircount: sumaydata?.probeCount?.probeTotal,
      firexplain: language('analyse.resmap.probeTotal'),
      seccount: sumaydata?.probeCount?.alreadyTotal,
      secexplain: language('analyse.resmap.alreadyTotal'),
      thicount: sumaydata?.probeCount?.disTotal,
      thiexplain: language('analyse.resmap.disTotal'),
    },
  ]

  const apishowurl = '/cfg.php?controller=assetMapping&action=showResource';
  const concealColumns = {
    id: { show: false },
  };
  const [queryVal, setQueryVal] = useState('');
  const [type, setType] = useState('');
  let searchVal = { queryVal: queryVal, type: type };//顶部搜索框值 传入接口
  const [incID, setIncID] = useState(0);
  const [pageCount, setPageCount] = useState(false);
  const downloadButton = true;

  //导出按钮
  const downloadClick = () => {
    download('/cfg.php?controller=assetMapping&action=exportResource', '', setDownLoading)
  }

  const tableTopSearch = () => {
    return (
      <Space>
        <Search
          allowClear
          placeholder='IP'
          style={{ width: 200 }}
          onSearch={(queryVal) => {
            setQueryVal(queryVal)
            setIncID(incID + 1)
          }}
        />
      </Space>
    )
  }

  //判断是否弹出添加model
  const getModal = (status, value) => {
    if(status == 1) {
      getMatrdata(value)
      setModalStatus(true);
    } else {
      formRef.current.resetFields();
      setModalStatus(false);
    }
  }

  /* 矩阵接口 */
  const getMatrdata = (value) => {
    let data = {};
    data.net = value;
    post('/cfg.php?controller=assetMapping&action=showMatrix', data).then((res) => {
      setMatrix(res.data);
    })
  }

  /* 矩阵按钮 */
  const showMatrix = () => {
    if(matrix.length < 1) {
      return <></>;
    }
    return matrix.map((item, index) => {
      let className
      if(item.status == "2") {
        className = 'retainButton'
      } else if(item.status == "1") {
        className = 'onlineButton'
      } else if(item.status == "0") {
        className = 'offlineButton'
      }
      if(!item.recommend) {
        if(parseInt((index) % 16) == 0 && index != 0) {
          return (<>
            <br />
            <div key={item.id} className={(className) + ' matrixButton'}>
              <div className='mabuDiv'>
                <div className='icontopDiv'><div>{item.id}</div><div className='rtIcon'>{!item.type ? '' : iconTypeList(item.type)}</div></div>
                <div className='iconbotDiv'>
                  {item.probeOnline == "1" ? <i className='ri-radar-fill' style={{ color: '#75F9FD' }} /> : item.probeOnline == "0" ? <i className='ri-radar-fill' /> : !item.probeOnline ? <></> : <></>}
                  {item.vioResource == "0" ? <></> : <Caution theme="outline" size="14" fill='#FF0000' style={{ marginTop: '6px' }} />}
                </div>
              </div>
            </div>
          </>)
        } else {
          return (<>
            <div key={item.id} className={(className) + ' matrixButton'}>
              <div className='mabuDiv'>
                <div className='icontopDiv'><div>{item.id}</div><div className='rtIcon'>{!item.type ? '' : iconTypeList(item.type)}</div></div>
                <div className='iconbotDiv'>
                  {item.probeOnline == "1" ? <i className='ri-radar-fill' style={{ color: '#75F9FD' }} /> : item.probeOnline == "0" ? <i className='ri-radar-fill' /> : !item.probeOnline ? <></> : <></>}
                  {item.vioResource == "0" ? <></> : <Caution theme="outline" size="14" fill='#FF0000' style={{ marginTop: '6px' }} />}
                </div>
              </div>
            </div>
          </>)
        }
      } else if(item.recommend) {
        if(parseInt((index) % 16) == 0 && index != 0) {
          return (<>
            <br />
            <div key={item.id} className={(className) + ' matrixButton'}>
              <div className='mabuDiv'>
                <div className='icontopDiv'>
                  <div>{item.id}</div>
                  <div className='rtIcon'>{!item.type ? '' : iconTypeList(item.type)}</div>
                </div>
                <div className='iconbotDiv'>
                  {item.probeOnline == "1" ? <i className='ri-radar-fill' style={{ color: '#75F9FD' }} /> : item.probeOnline == "0" ? <i className='ri-radar-fill' /> : !item.probeOnline ? <div>&emsp;</div> : <div>&emsp;</div>}
                  <div className='starbotDiv'>
                    {item.recommend == "1" ? <i className='ri-star-fill' style={{ color: '#FAAD15' }} /> : item.recommend == "2" ?
                      <><i className='ri-star-fill' style={{ color: '#FAAD15' }} /><i className='ri-star-fill' style={{ color: '#FAAD15' }} /></> : item.recommend == "3" ?
                        <><i className='ri-star-fill' style={{ color: '#FAAD15' }} /><i className='ri-star-fill' style={{ color: '#FAAD15' }} /><i className='ri-star-fill' style={{ color: '#FAAD15' }} /></> : <></>}
                  </div>
                </div>
              </div>
            </div>
          </>)
        } else {
          return (<>
            <div key={item.id} className={(className) + ' matrixButton'}>
              <div className='mabuDiv'>
                <div className='icontopDiv'>
                  <div>{item.id}</div>
                  <div className='rtIcon'>{!item.type ? '' : iconTypeList(item.type)}</div>
                </div>
                <div className='iconbotDiv'>
                  {item.probeOnline == "1" ? <i className='ri-radar-fill' style={{ color: '#75F9FD' }} /> : item.probeOnline == "0" ? <i className='ri-radar-fill' /> : !item.probeOnline ? <div>&emsp;</div> : <div>&emsp;</div>}
                  <div className='starbotDiv'>
                    {item.recommend == "1" ? <i className='ri-star-fill' style={{ color: '#FAAD15' }} /> : item.recommend == "2" ? <><i className='ri-star-fill' style={{ color: '#FAAD15' }} /><i className='ri-star-fill' style={{ color: '#FAAD15' }} /></> : item.recommend == "3" ? <><i className='ri-star-fill' style={{ color: '#FAAD15' }} /><i className='ri-star-fill' style={{ color: '#FAAD15' }} /><i className='ri-star-fill' style={{ color: '#FAAD15' }} /></> : <></>}
                  </div>
                </div>
              </div>
            </div>
          </>)
        }
      }
    })
  }

  //判断是否弹出添加model
  const getDraw = (state, value) => {
    if(state == 1) {
      setDrawLeftStatus(true);
      showDetails(value)
    } else {
      drawformRef.current.resetFields();
      setDrawLeftStatus(false);
    }
  }

  /* 探针详情接口 */
  const showDetails = (value) => {
    let data = {};
    data.addr = value;
    post('/cfg.php?controller=assetMapping&action=showProbeDetail', data).then((res) => {
      setPrbdetail(res.data);
    })
  }

  const confList = () => {
    let Ifweb = '';
    let Sverver = '';
    let Assem = '';
    let V6avatar = '';
    if(prbdetail?.detail.indexOf("ckInOut") != -1) {
      Ifweb = Blweb;
    }
    if(prbdetail?.detail.indexOf("ckInOut") == -1) {
      Ifweb = Grweb;
    }
    if(prbdetail?.detail.indexOf("vioSrv") != -1) {
      Sverver = BlSver;
    }
    if(prbdetail?.detail.indexOf("vioSrv") == -1) {
      Sverver = GrSver;
    }
    if(prbdetail?.detail.indexOf("vioDev") != -1) {
      Assem = BlAssem;
    }
    if(prbdetail?.detail.indexOf("vioDev") == -1) {
      Assem = GrAssem;
    }
    if(prbdetail?.detail.indexOf("IPV6AssetRpt") != -1) {
      V6avatar = Blv6;
    }
    if(prbdetail?.detail.indexOf("IPV6AssetRpt") == -1) {
      V6avatar = Grv6;
    }
    return (<Space>
      <Tooltip title={language('probers.teprobe.ckInOut')}><img src={Ifweb} style={{ width: '18px', height: '18px' }} /></Tooltip>
      <Tooltip title={language('probers.teprobe.vioSrv')}><img src={Sverver} style={{ width: '18px', height: '18px' }} /></Tooltip>
      <Tooltip title={language('probers.teprobe.vioDev')}><img src={Assem} style={{ width: '18px', height: '18px' }} /></Tooltip>
      <Tooltip title={language('probers.teprobe.IPv6mon')}><img src={V6avatar} style={{ width: '18px', height: '18px' }} /></Tooltip>
    </Space>)
  }

  return (<Spin spinning={downLoading} tip={language('project.sysdebug.wireshark.loading')} indicator={<LoadingOutlined spin />}>
    <ProCard direction='column' ghost gutter={[13, 13]} >
      <ProCard gutter={[13, 13]} ghost className='resumCard'>
        {census.map((item, index) => {
          return (<ProCard className='netwidCard' direction='column' style={{ paddingBottom: 0 }}>
            <StatisticCard className='networkCard' ghost statistic={{
              title: (<div style={{ fontSize: 16, color: '#000000' }}>{item.title}</div>),
              description: item.direction,
              valueStyle: { display: 'none' },
              icon: (
                <img src={item.imgsrc} />
              )
            }} />
            <Divider className='netwder' dashed />
            <ProCard className='netvalCard' gutter={[13, 13]} style={{ paddingTop: 0 }}>
              <div className='botomsumDiv'>
                <div>
                  <div style={index == 2 ? { fontSize: 20, color: '#101010' } : { cursor:'pointer', fontSize: 20, color: '#101010' }} onClick={() => {
                    if(index == 0) {
                      setType('classA')
                      setIncID(incID + 1)
                    } else if(index == 1) {
                      setType('higher')
                      setIncID(incID + 1)
                    }
                  }}>{item.fircount}</div>
                  <div>{item.firexplain}</div>
                </div>
                <div>
                  <div className='netCountDiv' onClick={() => {
                    if(index == 0) {
                      setType('classB')
                    } else if(index == 1) {
                      setType('equal')
                    } else if(index == 2) {
                      setType('alreadyTotal')
                    }
                    setIncID(incID + 1)
                  }}>{item.seccount}</div>
                  <div>{item.secexplain}</div>
                </div>
                <div>
                  <div className='netCountDiv' onClick={() => {
                    if(index == 0) {
                      setType('classC')
                    } else if(index == 1) {
                      setType('lower')
                    } else if(index == 2) {
                      setType('disTotal')
                    }
                    setIncID(incID + 1)
                  }}>{item.thicount}</div>
                  <div>{item.thiexplain}</div>
                </div>
              </div>
            </ProCard>
          </ProCard>)
        })}
      </ProCard>
      <ProCard ghost className='resmapCard'>
        <ProtableModule columns={columns} apishowurl={apishowurl} concealColumns={concealColumns} searchVal={searchVal} searchText={tableTopSearch()} incID={incID} downloadButton={downloadButton} downloadClick={downloadClick} components={components} clientHeight={clientHeight - 236} tableKey={'resmapTabale'} columnvalue={'resmapColumnvalue'} />
      </ProCard>
      <ModalForm width={clientWidth} className='matrixForm' submitter={false} formRef={formRef}
        visible={modalStatus}
        modalProps={{
          maskClosable: false,
          onCancel: () => {
            getModal(2)
          },
          closeIcon: <CloseOutlined style={{ marginTop: 28 }} />,
          style: {
            top: 72
          },
          bodyStyle: {
            padding: 10,
            // height: clientHeight
          },
        }} onVisibleChange={setModalStatus}
        submitTimeout={2000} onFinish={async (values) => {
        }}
        title={<Space className='mattixTitle'>
          <Alert className='resmapAlert' showIcon type='info' message={language('analyse.resmap.Alertmsg', { netvalue: netvalue })} /> 
          <div className='shretaButton'>{language('analyse.resmap.retain')}</div>
          <div className='shonliButton showButton'>{language('analyse.resmap.online')}</div>
          <div className='shoffliButton'>{language('analyse.resmap.offline')}</div>
          <div className='shonliButton' >
            <div className='lengenDiv'>
              <RiRadarFill style={{ color: '#75F9FD', marginRight: 3, fontSize: '15px'}} />
              {language('analyse.resmap.probeonline')}
            </div>
          </div>
          <div className='shonliButton'>
            <div className='lengenDiv'>
            <RiRadarFill style={{ marginRight: 3, fontSize: '15px' }} />
              {language('analyse.resmap.probeoffline')}
            </div>
          </div>
          <div className='shonliButton'>
            <div className='lengenDiv'>
              <WarningOutlined style={{ color: 'rgb(255, 0, 0)', marginRight: 3 }} />
              {language('analyse.resmap.violasset')}
            </div>
          </div>
          <div className='shonliButton'>
            <div className='lengenDiv'>
              <StarFilled style={{ color: 'rgb(250, 173, 21)', marginRight: 3 }} />
              {language('analyse.resmap.proberecommend')}
            </div>
          </div>
        </Space>}
      >
        {showMatrix()}
      </ModalForm>
      <DrawerForm title={language('analyse.resmap.probeinfo')}  {...drawFormLayout}
        formRef={drawformRef}
        submitter={false}
        visible={drawLeftStatus}
        onVisibleChange={setDrawLeftStatus}
        drawerProps={{
          placement: 'left',
          closable: false
        }}
        autoFocusFirstInput
        submitTimeout={2000}
      >
        <Divider orientation='left' >{language('analyse.resmap.assteTitle')}</Divider>
        <ProFormItem label={language('analyse.resmap.addr')}>{prbdetail?.addr}</ProFormItem>
        <ProFormItem label={language('analyse.resmap.alonenet')} >{prbdetail?.net}</ProFormItem>
        <ProFormItem label={language('analyse.resmap.name')} >{prbdetail?.name}</ProFormItem>
        <ProFormItem label={language('analyse.resmap.probeos')} >{prbdetail?.os}</ProFormItem>
        <ProFormItem label={language('analyse.resmap.onlineRate')} >{prbdetail?.onlineRate}</ProFormItem>
        <ProFormItem label={language('analyse.resmap.mac')} >{prbdetail?.mac}</ProFormItem>
        <ProFormItem label={language('analyse.resmap.recomcount')} >{prbdetail?.recommend == "1" ? <i className='ri-star-fill' style={{ color: '#FAAD15' }} /> : prbdetail?.recommend == "2" ? <><i className='ri-star-fill' style={{ color: '#FAAD15' }} /><i className='ri-star-fill' style={{ color: '#FAAD15' }} /></> : prbdetail?.recommend == "3" ? <> <i className='ri-star-fill' style={{ color: '#FAAD15' }} /><i className='ri-star-fill' style={{ color: '#FAAD15' }} /><i className='ri-star-fill' style={{ color: '#FAAD15' }} /></> : <></>}</ProFormItem>
        <Divider orientation='left' >{language('analyse.resmap.probeinfo')}</Divider>
        <ProFormItem label={language('analyse.resmap.probeID')} >{prbdetail?.probeID}</ProFormItem>
        <ProFormItem label={language('analyse.resmap.pbversion')} >{prbdetail?.version}</ProFormItem>
        <ProFormItem label={language('analyse.resmap.probestatus')} >
          {prbdetail?.probeOnline == "1" ? <Tag color='success'>{language('project.sysconf.analysis.online')}</Tag> : prbdetail?.probeOnline == "0" ? <Tag color='default' >{language('project.sysconf.analysis.noline')}</Tag> : ''}
        </ProFormItem>
        <ProFormItem label={language('analyse.resmap.configcontent')} >{confList()}</ProFormItem>
        <ProFormItem label={language('analyse.resmap.deployTime')} >{prbdetail?.deployTM}</ProFormItem>
      </DrawerForm>
    </ProCard>
  </Spin>)
}
