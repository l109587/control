import React, { useEffect, useState } from 'react'
import { useHistory } from 'umi'
import { Row, Col, Card } from 'antd'
import { ProCard, StatisticCard } from '@ant-design/pro-components';
import styles from './index.less'
import './index.less'
import '@/utils/index.less'
import { get, post } from '@/services/https'
import { TinyArea, Pie, Area } from './components'
import Cry from '@/assets/sys-bad.png'
import Smile from '@/assets/sys-god.png'
import NetworkAssetsImg from '@/assets/nfd/nbg-index-computer.svg'
import IllInnImg from '@/assets/nfd/nbg-index-illinn.svg'
import IllSvrImg from '@/assets/nfd/nbg-index-illsvr.svg'
import SerIesImg from '@/assets/nfd/nbg-index-series.svg'
import { language } from '@/utils/language';
import AuthCard from '../../../../components/Index/AuthCard/AuthCard';

export default () => {

  const imgArr = [NetworkAssetsImg, IllInnImg, IllSvrImg, SerIesImg];
  const [infodata, setInfodata] = useState({});
  const [areadata, setAreadata] = useState({});
  const [pielist, setPielist] = useState([]);
  const [pietitle, setPietitle] = useState('');
  const [pietdata, setPietdata] = useState([]);
  const [summarylist, setSummarylist] = useState([]);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);//加载
  let history = useHistory();
  const linkArr = ['/analyse/assets', '/analyse/illinn', '/analyse/illsvr', '/analyse/series'];

  useEffect(() => {
    getStatusData();
    getDTrafficData();
    getPieData();
    getSummaryData();
  }, [])

  /*顶部状态图  */
  const getStatusData = () => {
    post('/cfg.php?controller=sysHeader&action=showSysInfo', {}).then((res) => {
      setInfodata(res)
    }).catch(() => {
      console.log('mistask')
    })
  }

  /* 监测统计面积图数据 */
  const getDTrafficData = () => {
    post('/cfg.php?controller=sysHeader&action=showMFlowChart', {}).then((res) => {
      setAreadata(res);
      setList(res.lines)
    }).catch(() => {
      console.log('mistask')
    })
  }

  /* 饼图 */
  const getPieData = () => {
    post('/cfg.php?controller=sysHeader&action=showAssetChart', {}).then((res) => {
      setPielist(res.data);
      setPietitle(res.title)
      setPietdata(res.list);
    }).catch(() => {
      console.log('mistask')
    })
  }

  /* 概要信息 */
  const getSummaryData = () => {
    post('/cfg.php?controller=sysHeader&action=showDataStats', {}).then((res) => {
      setSummarylist(res.data)
    }).catch(() => {
      console.log('mistask')
    })
  }

  return (
    <>
      <Row gutter={16}>
        <Col span={8}>
          <AuthCard infodata={infodata}/>
        </Col>
        {/* cpu状态图 */}
        <Col span={16}>
          <TinyArea />
        </Col>
      </Row>
      <Row gutter={16} style={{ marginTop: '15px' }}>
        <Col span={16}>
          <Area areadata={areadata} data={list} style={{ width: '100%' }}></Area>
        </Col>
        <Col span={8}>
          <Card className='piedatacard' title={pietitle ? pietitle : ''} style={{ width: '100%' }}>
            <div>
              <Pie list={pielist ? pielist : ''} tlist={pietdata ? pietdata : ''} ></Pie>
            </div>
          </Card>
        </Col>
      </Row>
      <ProCard style={{ marginTop: '15px' }} gutter={16} ghost>
        {summarylist.map((item, index) => {
          return (
            <StatisticCard ghost className='briefcard' colSpan="25%" statistic={{
              title: item.name,
              value: item.value,
              icon: (<img src={imgArr[index]} />)
            }} onClick={() => {
              let pagename = '/analyse/' + item.type;
              linkArr.map((each) => {
                if(pagename == each) {
                  history.push({ pathname: each, state: { id: 'type' } })
                }
              })
            }} />
          )
        })}
      </ProCard>
    </>
  )


}