// 协议分析
import React from 'react'
import { connect } from 'umi'
import { withI18n } from '@lingui/react'
import { Card, Row, Col, Radio } from 'antd'
import styles from './index.less'
import '@/utils/index.less'
import { post } from '@/services/https'
import Area from '@/components/Charts/Area/Area'
import AppsTable from './components/AppsTable'
import DemoPie from '@/components/Charts/Pie/Pie'

let H = document.body.clientHeight - 320
var clientHeight = H - H / 2.5

@withI18n()
@connect(({ post, loading }) => ({ post, loading }))
class Agreement extends React.Component {
  formRef = React.createRef()
  state = {
    dataPie: [],
    dataPlint: [],
    dataPlint1: [],
    interval: 'hour',
    chartype: 'all',
    Pietitle: '最近1小时双向流量占比图',
    linttitle: '最近1小时双向流量趋势图',
  }
  componentDidMount() {
    this.getData(this.state.interval, this.state.chartype)
  }
  getDataval = (interval) => {
    this.getData(interval, this.state.chartype)
  }
  getDatatype = (chartype) => {
    this.getData(this.state.interval, chartype)
  }
  getData = (interval, chartype) => {
    this.AppsTable.getUser(interval)
    let data = {
      interval: interval,
      chartype: chartype,
    }
    post('/cfg.php?controller=sysAnalysis&action=showAppsChart', data).then(
      (res) => {
        res.pie?.data.map((item) => {
          item.bytes = item.bytes * 1
        })
        this.setState({
          dataPie: res.pie?.data,
          Pietitle: res.pie?.title,
          dataPlint: res.run?.lines,
          dataPlint1: res.run?.lines,
          linttitle: res.run?.title,
          chartype: chartype,
          interval: interval,
        })
      }
    )
  }
  compare = (v1, v2) => {
    if (v1.value < v2.value) return -1
    //返回-1,v1排在前面
    else if (v1.value > v2.value) return 1
    //返回1,v2排在前面
    else return 0 //返回0,默认排序
  }
  Pie = (val) => {
    let data = this.state.dataPlint1
    let dataPlint = []
    if (val.length > 0) {
      this.setState({ dataPlint: [] })
      data.map((item, index) => {
        if (item.name == val[0].data.apps) {
          dataPlint.push(item)
        }
      })
      this.setState({ dataPlint: dataPlint })
    } else {
      this.setState({ dataPlint: data })
    }
  }
  tooltipFormat = (value) => {
    if (value.value < 1000) return { name: value.appcn, value: value.value }
    if (value.value < 1000000)
      return { name: value.appcn, value: (value.value / 1000).toFixed(0) + ' K' }
    if (value.value < 1000000000)
      return {
        name: value.appcn,
        value: `${(value.value / 1000000).toFixed(0)} M`,
      }
    if (value.value < 1000000000000)
      return {
        name: value.appcn,
        value: `${(value.value / 1000000000).toFixed(0)} G`,
      }
  }
  Line = (val) => {}
  render() {
    const { dataPie, dataPlint, interval, chartype, Pietitle, linttitle } =
      this.state
    return (
      <div>
        <Row className="Row_c">
          <Col span={8}>
            <span>统计周期:</span>
            <Radio.Group
              size="small"
              style={{ marginBottom: '5px', marginLeft: '15px' }}
              onChange={(e) => this.getDataval(e.target.value)}
              defaultValue={interval}
            >
              <Radio.Button value="hour">最近一小时</Radio.Button>
              <Radio.Button value="day">最近一天</Radio.Button>
              <Radio.Button value="week">最近一周</Radio.Button>
            </Radio.Group>
          </Col>
          <Col span={6}>
            <span>过滤条件:</span>
            <Radio.Group
              size="small"
              style={{ marginBottom: '5px', marginLeft: '15px' }}
              onChange={(e) => this.getDatatype(e.target.value)}
              defaultValue={chartype}
            >
              <Radio.Button value="all">双向</Radio.Button>
              <Radio.Button value="sent">上行</Radio.Button>
              <Radio.Button value="recv">下行</Radio.Button>
            </Radio.Group>
          </Col>
        </Row>
        <Card className={styles.Po_bt}>
          <Row gutter={16}>
            <Col span={8}>
              <div
                style={{
                  textAlign: 'center',
                  margin: '18px auto',
                  fontSize: '14px',
                }}
              >
                {Pietitle}
              </div>
                <DemoPie
                  data={dataPie}
                  clientHeight={clientHeight}
                  angleField="bytes"
                  colorField="appcn"
                  innerRadius={0}
                  legend={false}
                  minHeight={180}
                />
            </Col>
            <Col span={16}>
              <div
                style={{
                  textAlign: 'center',
                  margin: '18px auto',
                  fontSize: '14px',
                }}
              >
                {linttitle}
              </div>
                <Area
                  data={dataPlint}
                  xField="time"
                  yField="value"
                  seriesField="appcn"
                  clientHeight={clientHeight}
                  tooltipFormat={this.tooltipFormat}
                />
            </Col>
          </Row>
        </Card>
        <Row>
          <Col span={24}>
            <AppsTable
              interval={interval}
              ref={(node) => (this.AppsTable = node)}
            ></AppsTable>
          </Col>
        </Row>
      </div>
    )
  }
}
export default Agreement
