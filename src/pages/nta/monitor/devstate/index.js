// 设备状态
import React from 'react'
import { connect } from 'umi'
import { withI18n } from '@lingui/react'
import { Card, Form, Tabs, Radio, Row, Col, Tooltip, Button } from 'antd'
import { formItemLayout } from '@/utils/helper'
import styles from './index.less'
import '@/utils/index.less'
import { get, post } from '@/services/https'
import Line from '@/components/Charts/Line/Line'

const H = document.body.clientHeight - 260
const clientHeight = (H / 2).toFixed(0) * 1

@withI18n()
@connect(({ post, loading }) => ({ post, loading }))
class Equipment extends React.Component {
  formRef = React.createRef()
  state = {
    memeory: [],
    Workcpu: [],
    recv: [],
    sent: [],
    cputitle: '',
    memtitle: '',
    recvtitle: '',
    senttitle: '',
    interval: 'min',
    xstepCpu: '',
    xstepmem: '',
    xsteprecv: '',
    xstepsent: '',
    yAMaxCpu: '',
    yAMaxmem: '',
  }
  componentDidMount() {
    this.getData('min')
  }
  useTipFormat = (value) => {
    return { name: '使用率', value: value.value + '%' }
  }
  flowTipFormat = (value) => {
    if (value.value < 1000) return { name: value.name, value: value.value }
    if (value.value < 1000000)
      return { name: value.name, value: (value.value / 1000).toFixed(0) + ' K' }
    if (value.value < 1000000000)
      return {
        name: value.name,
        value: `${(value.value / 1000000).toFixed(0)} M`,
      }
    if (value.value < 1000000000000)
      return {
        name: value.name,
        value: `${(value.value / 1000000000).toFixed(0)} G`,
      }
  }
  getData = (interval) => {
    //cpu
    let cpu = {
      interval: interval,
      chartype: 'cpu',
    }
    post('/cfg.php?controller=sysMonitor&action=showChartStat', cpu).then(
      (res) => {
        res.lines?.map((item) => {
          item.value = Number(item.value)
        })
        this.setState({
          Workcpu: res.lines,
          cputitle: res.title,
          xstepCpu: res.xstep,
          yAMaxCpu: res.yAMax,
        })
      }
    )
    let mem = {
      interval: interval,
      chartype: 'mem',
    }
    post('/cfg.php?controller=sysMonitor&action=showChartStat', mem).then(
      (res) => {
        res.lines?.map((item) => {
          item.value = Number(item.value)
        })
        this.setState({
          memeory: res.lines,
          memtitle: res.title,
          xstepmem: res.xstep,
          yAMaxmem: res.yAMax,
        })
      }
    )
    let recv = {
      interval: interval,
      chartype: 'recv',
    }
    post('/cfg.php?controller=sysMonitor&action=showChartFlow', recv).then(
      (res) => {
        res.lines?.map((item) => {
          item.value = Number(item.value)
        })
        this.setState({
          recv: res.lines,
          recvtitle: res.title,
          xsteprecv: res.xstep,
        })
      }
    )
    let sent = {
      interval: interval,
      chartype: 'sent',
    }
    post('/cfg.php?controller=sysMonitor&action=showChartFlow', sent).then(
      (res) => {
        res.lines?.map((item) => {
          item.value = Number(item.value)
        })
        this.setState({
          sent: res.lines,
          senttitle: res.title,
          xstepsent: res.xstep,
        })
      }
    )
  }
  render() {
    const {
      Workcpu,
      memeory,
      recv,
      sent,
      cputitle,
      memtitle,
      recvtitle,
      senttitle,
      xstepCpu,
      xstepmem,
      xsteprecv,
      xstepsent,
      yAMaxCpu,
      yAMaxmem,
    } = this.state
    return (
      <div>
        <Form {...formItemLayout}>
          <Row className="Row_c">
            <Col span={14}>
              <span>统计周期:</span>
              <Radio.Group
                style={{ marginBottom: '5px', marginLeft: '15px' }}
                size="small"
                onChange={(e) => this.getData(e.target.value)}
                defaultValue="min"
              >
                <Radio.Button value="min">最近十分钟</Radio.Button>
                <Radio.Button value="hour">最近一小时</Radio.Button>
                <Radio.Button value="day">最近一天</Radio.Button>
                <Radio.Button value="week">最近一周</Radio.Button>
                <Radio.Button value="month">最近一个月</Radio.Button>
              </Radio.Group>
            </Col>
            <Col span={10} className="Col_flex_end">
            </Col>
          </Row>
          <div className={styles.Fiex}>
            <div className={styles.Card} style={{ padding: '0px 7px 5px 0px' }}>
              <Card style={{ width: '100%' }}>
                <div className={styles.fon_16}>{cputitle}</div>
                <Line
                  data={Workcpu}
                  xstep={xstepCpu}
                  tickInterval={20}
                  yAMax={yAMaxCpu}
                  xField="time"
                  yField="value"
                  clientHeight={clientHeight}
                  tooltipFormat={this.useTipFormat}
                />
              </Card>
            </div>
            <div className={styles.Card} style={{ padding: '0px 0 5px 7px' }}>
              <Card style={{ width: '100%' }}>
                <div className={styles.fon_16}>{memtitle}</div>
                <Line
                  data={memeory}
                  xstep={xstepmem}
                  tickInterval={20}
                  yAMax={yAMaxmem}
                  xField="time"
                  yField="value"
                  clientHeight={clientHeight}
                  tooltipFormat={this.useTipFormat}
                />
              </Card>
            </div>
            <div className={styles.Card} style={{ padding: '10px 7px 0 0' }}>
              <Card style={{ width: '100%' }}>
                <div className={styles.fon_16}>{recvtitle}</div>
                <Line
                  data={recv}
                  xstep={xsteprecv}
                  xField="time"
                  yField="value"
                  seriesField="name"
                  clientHeight={clientHeight}
                  tooltipFormat={this.flowTipFormat}
                />
              </Card>
            </div>
            <div className={styles.Card} style={{ padding: '10px 0 0 7px' }}>
              <Card style={{ width: '100%' }}>
                <div className={styles.fon_16}>{senttitle}</div>
                <Line
                  data={sent}
                  xstep={xstepsent}
                  xField="time"
                  yField="value"
                  seriesField="name"
                  clientHeight={clientHeight}
                  tooltipFormat={this.flowTipFormat}
                />
              </Card>
            </div>
          </div>
        </Form>
      </div>
    )
  }
}
export default Equipment
