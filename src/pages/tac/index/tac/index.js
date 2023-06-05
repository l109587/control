import React, { useEffect, useState } from 'react'
import { Row, Col, Skeleton, Card, Tooltip, Button, Menu } from 'antd'
import { ProCard, StatisticCard } from '@ant-design/pro-components';
import { TrademarkCircleFilled } from '@ant-design/icons';
import '@/utils/index.less'
import { get, post } from '@/services/https'
import { TopArea, Pie, Area, TinyArea } from './components'
import Smile from '@/assets/sys-god.png'
import { language } from '@/utils/language';
import Notice from '@/assets/tac/notice.svg';
import './index.less'

export default () => {
  const active = false;
  const [infodata, setInfodata] = useState({});
  const [checkStats, setCheckStats] = useState([]);
  const [checkStatsList, setCheckStatsList] = useState([{ "type": "net-flow", "name": "" }, { "type": "net-port", "name": "" }, { "type": "edp-ply", "name":"" }, { "type": "sysflaw", "name": ""}, { "type": "remote", "name": ""}]);
  const [incID, setIncID] = useState(0);//递增的id 删除/添加的时候增加触发刷新
  useEffect(() => {
    getStatusData();
    //违规统计
    getShowCheckStats();
  }, [])

  /*顶部状态图  */
  const getStatusData = () => {
    post('/cfg.php?controller=sysHeader&action=showSysInfo', {}).then((res) => {
      setInfodata(res)
    }).catch(() => {
      console.log('mistask')
    })
  }

  /* 违规统计 */
  const getShowCheckStats = () => {
    post('/cfg.php?controller=sysHeader&action=showCheckStats', {}).then((res) => {
      setCheckStats(res);
      if(res.data.length > 0 ){
        setCheckStatsList(res.data);
      }
    }).catch(() => {
      console.log('mistask')
    })
  }



  return (
    <div className='tacindexbox'>
      <TopArea incID={incID} active={active} />
      <Row gutter={16} style={{ marginTop: '15px' }}>
        <Col span={12}>
          <Area incID={incID} active={active} style={{ width: '100%' }} />
        </Col>
        <Col span={12}>
          <div>
            <Pie incID={incID} active={active} />
          </div>
        </Col>
      </Row>
      <ProCard style={{ marginTop: '15px' }} className='violationstatistcscard' gutter={16} ghost>
        <StatisticCard.Group>
          <StatisticCard className='indextaccard' colSpan="15%" statistic={{
            title: <div className='cardtitle'>{checkStats.title ? checkStats.title : <Skeleton.Input active={active} shape='default' style={{ height: '60px'}} block={true} />}</div>,
            prefix: <img src={Notice} style={{ width: 24, height: 24, marginTop: '-4px' }} />,
            value: checkStats.total,
            valueStyle: {
              display: checkStats.title ? '' : 'none',
            },
          }} />

          {checkStatsList.map((item, index) => {
            return (
              <StatisticCard colSpan="17%" className='tacresstabox' layout='left' statistic={{
                title: item.name ? <div className='resstatitle'>{item.name}</div> : <Skeleton.Input active={active} shape='default' style={{ height: '60px',minWidth:'20px'}}  block={true}  />,
                value: item.value,
                valueStyle: {
                  display: item.name ? '' : 'none',
                },
              }} chart={
                item.name ?<TrademarkCircleFilled size='48px' style={{ fontSize: '48px', color: '#FCCA00' }} />
                : <Skeleton.Avatar active={active} size='default' shape='circle' style={{ width: '48px', height: '48px' }} />
              } chartPlacement="left" />
            )
          })
          }
        </StatisticCard.Group>
      </ProCard>
      <Row gutter={16} style={{ marginTop: '15px' }}>
        <Col span={8}>
          <Card style={{ width: '100%' }}>
            <Row>
              <Col span={12}>
                <div className='dip_flex' style={{ height: '59px' }}>
                  <div
                    style={{
                      width: '60px',
                      textAlign: 'center',
                    }}
                  >
                    <img alt="logo" style={{ width: '40px' }} src={Smile} />
                  </div>
                  <div>
                    <div className='font_16'>{infodata.state ? infodata.state.value : ''}</div>
                    <div>{infodata.state ? infodata.state.name : ''}</div>
                  </div>
                </div>
              </Col>
              <Col span={12}>
                <div
                  className='dip_flex'
                  style={{ height: '59px', justifyContent: 'flex-end' }}
                >
                  <div></div>
                  <div>
                    <div className='font_16'>{infodata.dtime ? infodata.dtime.week : ''}</div>
                    <div>{infodata.dtime ? infodata.dtime.date : ''}</div>
                  </div>
                </div>
              </Col>
            </Row>
            <div style={{ height: '67px', padding: ' 8px 0px 0px 10px' }}>
              <Row className='margin_shi'>
                <Col span={12}>
                  <div className='Font_col'>{language('index.nbg.promodel')}</div>
                </Col>
                <Col span={12}>
                  <div className='Bang_color'>{infodata.sinfo ? infodata.sinfo.pmodel : ''}</div>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <div className='Font_col'>{language('index.nbg.runtime')}</div>
                </Col>
                <Col span={12}>
                  <div className='Bang_color'>{infodata.sinfo ? infodata.sinfo.runtime : ''}</div>
                </Col>
              </Row>
            </div>
          </Card>
        </Col>
        {/* cpu状态图 */}
        <Col span={16}>
          <TinyArea />
        </Col>
      </Row>
    </div>
  )

}