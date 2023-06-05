import React, { useEffect, useState } from 'react';
import { history } from 'umi';
import { Row, Skeleton } from 'antd';
import { Radar, RingProgress } from '@ant-design/plots';
import { StatisticCard, ProCard } from '@ant-design/pro-components';
import { get, post } from '@/services/https';
import { language } from '@/utils/language';
import blackIcon from '@/assets/tac/black.svg';
import whiteIcon from '@/assets/tac/whites.svg';
import controlIcon from '@/assets/tac/control.svg';
import '../index.less';
const { Statistic, Divider } = StatisticCard;
let H = document.body.clientHeight - 862
var clientHeight = H > 0 ? H : 0

const Trendcharts = (props) => {
  let accessPaddingBox = clientHeight > 0 ? (clientHeight) % 6 : 0;
  let skeletonAccess = clientHeight + 268;
  let accessPadding = clientHeight > 0 ? Math.floor((clientHeight) / 6) + 'px 0px' : 0 + 'px 0px';
  const active = props.active;
  const [policyData, setPolicyData] = useState([]);
  const [policyList, setPolicyList] = useState([]);
  const [policyCount, setPolicyCount] = useState(0);
  const [policyTitle, setPolicyTitle] = useState({ title: '', count: 0 });

  useEffect(() => {
    showPolicyStats();
  }, [props.incID])

  //资产总数趋势图
  const showPolicyStats = () => {
    post('/cfg.php?controller=sysHeader&action=showPolicyStats').then((res) => {
      if (res.lines) {
        res.lines.map((item) => {
          item.value = parseInt(item.value)
        })
      }
      setPolicyData(res.lines);
      setPolicyList(res.data);
      let tArr = {
        title: res.title,
        total: res.total
      }
      setPolicyTitle(tArr);
      setPolicyCount(res.total);
    })
  }

  const jHref = (url = '', type = '') => {
    history.push({ pathname: url, state: { type: type } })
  }

  return (
    <div className='radarbox' >
      <ProCard gutter={[8, 13]} title={policyTitle.title ? policyTitle.title : <Skeleton.Button active={active} size={23} shape='default' style={{ width: '80px' }} block={true} />}>
        <Row gutter={16} ghost style={{ marginTop: '15px' }}>
          <div style={{ display: 'flex', width: "100%", paddingTop: accessPaddingBox }}>
            <StatisticCard chartPlacement="right" statistic={{
              value: '',
              valueStyle: {
                display: 'none',
              },
              description: <div className='strategyradar'>
                {policyTitle.title ? policyList.map((item, index) => {
                  let icon = '';
                  let color = '';
                  let pType = '';
                  if (item.type === 'white') {
                    color = '#0083FF';
                    pType = 'white';
                    icon = <img src={whiteIcon} />
                  } else if (item.type === 'black') {
                    color = '#FF0000';
                    pType = 'black';
                    icon = <img src={blackIcon} />
                  } else {
                    color = '#FCCA00';
                    pType = 'nocontrol';
                    icon = <img src={controlIcon} />
                  }
                  return (
                    <div className='strapadding' style={{ padding: accessPadding }}>
                      <StatisticCard layout='center' statistic={{
                        title: <div className='resstatitle'>{item.name}</div>,
                        value: item.value,
                        valueStyle: {
                          display: 'none',
                        },
                        description: <div>
                          <div onClick={() => {
                            if (item.value > 0) {
                              jHref('/central/assctl', pType);
                            }
                          }}  className={ item.value > 0 ? 'mousehand' : 'notmousehand'} >{item.value}</div>
                          <Statistic title={language('project.central.ressta.proportion')} value={(parseInt(policyTitle.total) < 1 ? 0 : ((parseInt(item.value) / parseInt(policyTitle.total)) * 100).toFixed(2)) + '%'} />
                        </div>,
                      }} chart={<RingProgress className='ressta' {...{
                        height: 70,
                        width: 70,
                        autoFit: false,
                        percent: parseFloat((parseInt(item.value) / parseInt(policyTitle.total)).toFixed(2)),
                        color: [color, '#E8EDF3'],
                        statistic: {
                          title: {
                            customHtml: () => {
                              return <div>
                                {icon}
                              </div>
                            },
                          },
                          content: false,
                        },
                      }} />} chartPlacement="left" />
                    </div>
                  )
                })
                  : <Skeleton.Input active={active} size='default' shape='circle' style={{ width: '83%', height: skeletonAccess }} />}
              </div>
            }} chart={policyTitle.title ? <Radar className='radarcanvas' {...{
              data: policyData,
              height: skeletonAccess,
              autoFit: true,
              xField: 'name',
              yField: 'value',
              appendPadding: [10, 10, 50, 10],
              meta: {
                value: {
                  alias: language('index.tac.terminalnum'),
                  min: 0,
                  max: policyCount < 1 ? 1 : parseInt(policyCount),
                  nice: true,
                },
              },
              xAxis: {
                line: null,
                tickLine: null,
              },
              yAxis: {
                line: null,
                label: false,
                position: false,
                grid: {
                  line: {
                    type: 'line',
                    style: {
                      // lineDash: null,
                    },
                  },
                },
              },
              // 开启辅助点
              point: {
                size: 2,
              },
            }}

            /> :
              <Skeleton.Avatar active={active} size='default' shape='circle' style={{ width: '83%', height: skeletonAccess }} />} />
          </div>
        </Row>
      </ProCard>
    </div>
  )
}

export default Trendcharts