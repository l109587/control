import React, { useEffect, useRef, useState } from 'react';
import { history } from 'umi';
import { Skeleton } from 'antd';
import { Progress, TinyArea, TinyColumn } from '@ant-design/plots';
import { get, post } from '@/services/https';
import { LinkOutlined } from '@ant-design/icons';
import { HourglassFull, LinkInterrupt } from '@icon-park/react';
import Checked from '@/assets/tac/if-checked.svg';
import '../index.less';
import { language } from '@/utils/language';
import { ProCard, StatisticCard } from '@ant-design/pro-components';
const TopArea = (props) => {
  let active = props.active;
  const [devTitle, setDevTitle] = useState({ title: '', value: 0 });
  const [devList, setDevList] = useState([]);
  const [assetData, setAssetData] = useState([]);//资产信息
  const [assetTitle, setAssetTitle] = useState({ title: '', count: 0 });//资产标题
  //资产
  const areaConfig = {
    height: 43,
    autoFit: true,
    data: assetData,
    smooth: true,
    areaStyle: {
      fill: '#F8E3DE',
      shadowColor: '#D97458'
    },
    line: {
      color: '#D97458'
    },
    appendPadding: [0, 0, 0, -3],
  };
  const [assetsCtrlTitle, setAssetsCtrlTitle] = useState({ title: '', count: 0 });//管控
  const [assetsCtrlData, setAssetsCtrlData] = useState([]);//管控
  const ctrlConfig = {
    height: 43,
    autoFit: true,
    data: assetsCtrlData,
    yAxis: {
      min: 10,
    },
  };
  const [devReglData, setDevReglData] = useState([]);//注册

  useEffect(() => {
    showCascadeState();
    showAssetsChart();//资产
    showAssetsCtrlChart();//管控
    showDevRegStats();//注册
  }, [props.incID])

  const showCascadeState = () => {
    post('/cfg.php?controller=sysHeader&action=showCascadeState').then((res) => {
      let tArr = {
        title: res.title,
      }
      res.data?.map((item) => {
        if (item.type === 'total') {
          tArr.value = item.value;
        }
      })
      setDevTitle(tArr);
      setDevList(res.data);
    })
  }

  //资产总数趋势图
  const showAssetsChart = () => {
    post('/cfg.php?controller=sysHeader&action=showAssetsChart').then((res) => {
      let list = []
      res.lines?.map((item, index) => {
        list.push(parseInt(item.value))
      })
      let tArr = {
        title: res.title,
        total: res.total
      }
      setAssetTitle(tArr);
      setAssetData(list);

    })
  }

  //管控总数趋势图
  const showAssetsCtrlChart = () => {
    post('/cfg.php?controller=sysHeader&action=showAssetsCtrlChart').then((res) => {
      let list = []
      res.lines?.map((item, index) => {
        list.push(parseInt(item.value))
      })
      let tArr = {
        title: res.title,
        total: res.total
      }
      setAssetsCtrlTitle(tArr);
      setAssetsCtrlData(list);
    })
  }

  //注册总数趋势图
  const showDevRegStats = () => {
    post('/cfg.php?controller=sysHeader&action=showDevRegStats').then((res) => {
      if (res.title) {
        res.data.title = res.title;
        res.data.percent = (parseInt(res.data.regnum) / parseInt(res.data.total)).toFixed(2);
        res.data.ucount = Math.floor((parseInt(res.data.regnum) / parseInt(res.data.total)) * 100)+ '%';
        setDevReglData(res.data);
      }
    })
  }

  const jHref = (url = '/cfgmngt/cascdevc', type = '') => {
    if (!url) {
      url = '/cfgmngt/cascdevc';
    }
    history.push({ pathname: url, state: { type: type } })
  }

  return (
    <div className='toptitlebox'>
      <ProCard ghost gutter={16}>
        <ProCard colSpan='25%' className='topcard' ghost style={{ width: '100%' }}>
          {devTitle.title ? <StatisticCard chartPlacement="buttom" statistic={{
            title: devTitle.title ? devTitle.title : <Skeleton.Button active={active} size='small' shape='default' block={false} style={{ height: '20px', width: '80px' }} />,
            prefix: <LinkOutlined style={{ fontSize: "30px", color: "#0083FF " }} />,
            value: devTitle.value ? devTitle.value : 0,
            valueStyle: {
              display: 'none',
            },
            suffix: language('index.tac.platform'),
            description:
              <>
                <div style={{ fontSize: '20px' }}><LinkOutlined style={{ fontSize: "30px", color: "#0083FF " }} /><span onClick={() => {
                  if (devTitle?.value > 0) {
                    jHref();
                  }
                }} className={ devTitle.value > 0 ? 'mousehand' : 'notmousehand'} style={{ marginLeft: '3px', marginRight: '4px' }}>{devTitle.value ? devTitle.value : 0}</span>{language('index.tac.platform')}</div>
                <div className='devstatebox'>
                  {devList?.length > 0 ? devList.map((item, index) => {
                    if (item.type !== 'total') {
                      let icon = '';
                      let type = '';
                      if (item.type == 'connect') {
                        type = 'online'
                        icon = <img src={Checked} style={{ fontSize: "20px", color: "#101010 " }} />;
                      } else if (item.type == 'disconnect') {
                        type = 'offline'
                        icon = <LinkInterrupt theme="outline" style={{ fontSize: "20px", color: "#FF0000 ", paddingTop: '3px' }} />;
                      } else {
                        type = 'verifyWait'
                        icon = <HourglassFull theme="outline" style={{ fontSize: "20px", color: "#FFC478 " }} />;
                      }
                      return (
                        <div>{icon}<span>{item.name}<span onClick={() => {
                          if (item.value > 0) {
                            jHref('', type);
                          }
                        }} className={ item.value > 0 ? 'mousehand' : 'notmousehand'} >{item.value}</span></span></div>
                      )
                    }
                  })
                    : <Skeleton.Input active={active} size='small' shape='default' block={false} style={{ height: '53px', width: '100%' }} />
                  }
                </div>
              </>,
          }} style={{ maxWidth: 584 }} />
            : <div style={{ height: '98px' }}><Skeleton active={active} paragraph={{ rows: 2, width: '100%' }} size='small' >
            </Skeleton>
            </div>
          }

        </ProCard>
        <ProCard colSpan='25%' className='topcard' ghost style={{ width: '100%' }}>
          {assetTitle.title ?
            <StatisticCard chartPlacement="buttom" statistic={{
              title: assetTitle.title,
              value: assetTitle.total,
              valueStyle: {
                display: 'none',
              },
            }} style={{ maxWidth: 584 }} chart={<div style={{ width: '105%' }}><div onClick={() => {
              if (assetTitle.total > 0) {
                jHref('/central/assets');
              }
            }} className={ assetTitle.total > 0 ? 'mousehand' : 'notmousehand'} >{assetTitle.total}</div><TinyArea {...areaConfig} /></div>} />
            : <div style={{ height: '98px' }}><Skeleton active={active} paragraph={{ rows: 2, width: '100%' }} size='small' >
            </Skeleton>
            </div>}

        </ProCard>
        <ProCard colSpan='25%' className='topcard' ghost style={{ width: '100%' }}>
          {assetsCtrlTitle.title ?
            <StatisticCard chartPlacement="buttom" statistic={{
              title: assetsCtrlTitle.title,
              value: assetsCtrlTitle.total,
              valueStyle: {
                display: 'none',
              },
            }} style={{ maxWidth: 584 }} chart={<div><div onClick={() => {
              if (assetsCtrlTitle.total > 0) {
                jHref('/central/assctl');
              }
            }} className={ assetsCtrlTitle.total > 0 ? 'mousehand' : 'notmousehand'} >{assetsCtrlTitle.total}</div><TinyColumn {...ctrlConfig} /></div>} />
            : <div style={{ height: '98px' }}><Skeleton active={active} paragraph={{ rows: 2, width: '100%' }} size='small' >
            </Skeleton>
            </div>}
        </ProCard>
        <ProCard colSpan='25%' className='topcard' ghost style={{ width: '100%' }}>
          {devReglData.title ?
            <StatisticCard chartPlacement="buttom" statistic={{
              title: devReglData.title,
              value: devReglData.regnum,
              valueStyle: {
                display: 'none',
              },
            }} style={{ maxWidth: 584 }} chart={<div className='topindexproress'><div onClick={() => {
              if (devReglData.regnum > 0) {
                jHref('/central/assctl','reg');
              }
            }} className={ devReglData.regnum > 0 ? 'mousehand' : 'notmousehand'} >{devReglData.regnum}</div><Progress  {...{
              height: 20,
              autoFit: false,
              percent: parseFloat(devReglData.percent),
              barWidthRatio: 0.3,
              color: ['#F4664A', '#E8EDF3'],
            }} />
              <div style={{ width: "100%", display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>{language('index.tac.utilizationrate')}</div>
                <div>{devReglData.ucount}</div>
              </div> </div>} />
            : <div style={{ height: '98px' }}><Skeleton active={active} paragraph={{ rows: 2, width: '100%' }} size='small' >
            </Skeleton>
            </div>}
        </ProCard>
      </ProCard>
    </div>
  )

}
export default TopArea