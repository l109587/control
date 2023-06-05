// 流量统计
import React from 'react'
import { connect } from 'umi'
import { withI18n } from '@lingui/react'
import { Card, Form, Row, Col, Tooltip, Button } from 'antd'
import { formItemLayout } from '@/utils/helper'
import styles from './index.less'
import { UploadOutlined } from '@ant-design/icons'
import '@/utils/index.less'
import { get, post } from '@/services/https'
import Z from '@/assets/nta/rl.png'
import Z1 from '@/assets/nta/rl1.png'
import skype from '@/assets/nta/skype.png'

import DGB from '@/assets/nta/DGB.png'
import USDT from '@/assets/nta/USDT.png'
import QTUM from '@/assets/nta/QTUM.png'
import jieru from '@/assets/nta/jieru.png'

import DualAxes from './components/DualAxes'
import TinyColumn from '@/components/Charts/TinyColumn/TinyColumn'
import TinyArea from '@/components/Charts/TinyArea/TinyArea'
@withI18n()
@connect(({ post, loading }) => ({ post, loading }))
class Traffic extends React.Component {
  formRef = React.createRef()
  state = {
    avgmx: {},
    bytes: {},
    sflow: {},
    lists: [],
    ipv4: {},
    ipv6: {},
    tcp: {},
    udp: {},
    ipv4list: [],
    ipv6list: [],
    tcplist: [],
    udplist: [],
    lab: '报文个数',
    num: 'M',
  }
  componentDidMount() {
    this.getData()
  }
  getData = () => {
    post('/cfg.php?controller=sysAnalysis&action=showFlowTotalStat', {}).then(
      (res) => {
        let lists = []
        res.bytes?.lines.map((item, index) => {
          lists.push(item.value)
        })
        this.setState({
          avgmx: res.avgmx,
          bytes: res.bytes,
          sflow: res.sflow,
          lists: lists,
        })
      }
    ).catch((error)=>{
      console.log(error);
    })
    post('/cfg.php?controller=sysAnalysis&action=showFlowPktsStat', {}).then(
      (res) => {
        let ipv4list = []
        let ipv6list = []
        let tcplist = []
        let udplist = []
        res.ipv4?.bar.map((item, index) => {
          ipv4list.push(item.value)
        })
        res.tcp?.bar.map((item, index) => {
          tcplist.push(item.value)
        })
        res.ipv6?.bar.map((item, index) => {
          ipv6list.push(item.value)
        })
        res.udp?.bar.map((item, index) => {
          udplist.push(item.value)
        })
        this.setState({
          ipv4: res.ipv4,
          ipv6: res.ipv6,
          tcp: res.tcp,
          udp: res.udp,
          ipv4list: ipv4list,
          ipv6list: ipv6list,
          tcplist: tcplist,
          udplist: udplist,
        })
      }
    )
  }
  //迷你柱状图tooltip格式化
  customContentIpv4 = (data) => {
    return (
      this.state.ipv4?.label +
      ' : ' +
      parseFloat(`${data[0]?.data?.y}`).toLocaleString() +
      this.state.ipv4?.unit
    )
  }
  customContentIpv6 = (data) => {
    return (
      this.state.ipv6?.label +
      ' : ' +
      parseFloat(`${data[0]?.data?.y}`).toLocaleString() +
      this.state.ipv6?.unit
    )
  }
  customContentTcp = (data) => {
    return (
      this.state.tcp?.label +
      ' : ' +
      parseFloat(`${data[0]?.data?.y}`).toLocaleString() +
      this.state.tcp?.unit
    )
  }
  customContentUdp = (data) => {
    return (
      this.state.udp?.label +
      ' : ' +
      parseFloat(`${data[0]?.data?.y}`).toLocaleString() +
      this.state.udp?.unit
    )
  }
  render() {
    const {
      avgmx,
      bytes,
      sflow,
      lists,
      ipv4,
      ipv6,
      tcp,
      udp,
      udplist,
      tcplist,
      ipv6list,
      ipv4list,
      lab,
      num,
    } = this.state
    return (
      <div>
        <Row gutter={16}>
          <Col span={10}>
            <Card>
              <div className={styles.dis_flex}>
                <div className={styles.flex_s}>
                  <div
                    style={{
                      width: '50px',
                      textAlign: 'center',
                    }}
                  >
                    <img alt="logo" style={{ width: '40px' }} src={Z} />
                  </div>
                  <div>
                    <div className={styles.font_16}>{bytes?.title}</div>
                    <div>{bytes?.subtitle}</div>
                  </div>
                </div>
                <div>
                  <div className={styles.dis_end} style={{ fontSize: '26px' }}>
                    {bytes?.bytes}
                  </div>
                  <div className={styles.dis_end}>
                    <span> {bytes?.pktscn}</span>: {bytes?.pktsval}{' '}
                    <span style={{ padding: '0 12px' }}>{bytes?.errscn}: </span>
                    {bytes?.errsval}
                  </div>
                </div>
              </div>
              <div style={{ margin: '12px 0 -7.5px 0' }}>
                <TinyArea data={lists} color='#13dafe' height={62}></TinyArea>
              </div>
            </Card>
          </Col>
          <Col span={7}>
            <Card>
              <div className={styles.ma_12} style={{}}>
                <div className={styles.flex_s}>
                  <div
                    style={{
                      width: '50px',
                      textAlign: 'center',
                    }}
                  >
                    <img alt="logo" style={{ width: '40px' }} src={Z1} />
                  </div>
                  <div style={{ color: '#fff' }}>
                    <div className={styles.font_16}>{sflow?.title}</div>
                    <div>{sflow?.subtitle}</div>
                  </div>
                </div>
              </div>
              <div
                className={styles.dis_flex}
                style={{
                  marginTop: '12px',
                  color: '#31b5f4',
                  fontSize: '14px',
                }}
              >
                <div>
                  <div className={styles.font_bold}>{sflow?.tcpval}</div>
                  <div>{sflow?.tcpcn}</div>
                </div>
                <div>
                  <div
                    className={styles.font_bold}
                    style={{ display: 'flex', justifyContent: 'flex-end' }}
                  >
                    {sflow?.udpval}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    {sflow?.udpcn}
                  </div>
                </div>
              </div>
            </Card>
          </Col>
          <Col span={7}>
            <Card>
              <div
                className={styles.ma_12}
                style={{
                  background: '#465a64',
                  color: '#465a64',
                }}
              >
                <div className={styles.flex_s}>
                  <div
                    style={{
                      width: '50px',
                      textAlign: 'center',
                    }}
                  >
                    <img alt="logo" style={{ width: '40px' }} src={skype} />
                  </div>
                  <div style={{ color: '#fff' }}>
                    <div className={styles.font_16}>{avgmx?.title}</div>
                    <div>{avgmx?.subtitle}</div>
                  </div>
                </div>
              </div>
              <div className={styles.dis_flex} style={{ marginTop: '12px' }}>
                <div>
                  <div className={styles.font_bold}>{avgmx?.avgval}</div>
                  <div>{avgmx?.avgcn}</div>
                </div>
                <div>
                  <div
                    className={styles.font_bold}
                    style={{ display: 'flex', justifyContent: 'flex-end' }}
                  >
                    {avgmx?.maxval}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    {avgmx?.maxcn}
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
        <Row gutter={16} style={{ marginTop: '15px' }}>
          <Col span={24}>
            <DualAxes ref="getSwordButton"></DualAxes>
          </Col>
        </Row>
        <Row gutter={16} style={{ marginTop: '15px' }}>
          <Col span={6}>
            <Card>
              <div className={styles.Bao_wen}>
                <div className={styles.flex_s}>
                  <div
                    style={{
                      width: '50px',
                      textAlign: 'center',
                    }}
                  >
                    <img alt="logo" style={{ width: '40px' }} src={jieru} />
                  </div>
                  <div>
                    <div className={styles.font_16}>{ipv4?.title}</div>
                    <div>{ipv4?.subtitle}</div>
                  </div>
                </div>
                <div style={{ fontSize: '28px' }}>{ipv4?.value}</div>
              </div>
              <div
                style={{
                  marginTop: '12px',
                  height: '60px',
                }}
              >
                <TinyColumn
                  data={ipv4list}
                  lab={ipv4}
                  color="#13dafe"
                  customContent={this.customContentIpv4}
                  height={60}
                ></TinyColumn>
              </div>
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <div className={styles.Bao_wen}>
                <div className={styles.flex_s}>
                  <div
                    style={{
                      width: '50px',
                      textAlign: 'center',
                    }}
                  >
                    <img alt="logo" style={{ width: '40px' }} src={QTUM} />
                  </div>
                  <div>
                    <div className={styles.font_16}>{ipv6?.title}</div>
                    <div>{ipv6?.subtitle}</div>
                  </div>
                </div>
                <div style={{ fontSize: '28px' }}>{ipv6?.value}</div>
              </div>
              <div
                style={{
                  marginTop: '12px',
                }}
              >
                <TinyColumn
                  data={ipv6list}
                  lab={ipv6}
                  color="#13dafe"
                  customContent={this.customContentIpv6}
                  height={60}
                ></TinyColumn>
              </div>
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <div className={styles.Bao_wen}>
                <div className={styles.flex_s}>
                  <div
                    style={{
                      width: '50px',
                      textAlign: 'center',
                    }}
                  >
                    <img alt="logo" style={{ width: '40px' }} src={USDT} />
                  </div>
                  <div>
                    <div className={styles.font_16}>{tcp?.title}</div>
                    <div>{tcp?.subtitle}</div>
                  </div>
                </div>
                <div style={{ fontSize: '28px' }}>{tcp?.value}</div>
              </div>
              <div
                style={{
                  marginTop: '12px',
                }}
              >
                <TinyColumn
                  data={tcplist}
                  lab={tcp}
                  color="#13dafe"
                  customContent={this.customContentTcp}
                  height={60}
                ></TinyColumn>
              </div>
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <div className={styles.Bao_wen}>
                <div className={styles.flex_s}>
                  <div
                    style={{
                      width: '50px',
                      textAlign: 'center',
                    }}
                  >
                    <img alt="logo" style={{ width: '40px' }} src={DGB} />
                  </div>
                  <div>
                    <div className={styles.font_16}>{udp?.title}</div>
                    <div>{udp?.subtitle}</div>
                  </div>
                </div>
                <div style={{ fontSize: '28px' }}>{udp?.value}</div>
              </div>
              <div
              style={{ marginTop: '12px' }}
              >
                <TinyColumn
                  data={udplist}
                  lab={udp}
                  color="#13dafe"
                  customContent={this.customContentUdp}
                  height={60}
                ></TinyColumn>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}
export default Traffic
