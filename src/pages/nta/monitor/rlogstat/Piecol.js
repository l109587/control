// 流量统计
import React from 'react'
import { connect } from 'umi'
import { withI18n } from '@lingui/react'
import { Row, Col, Radio } from 'antd'
import Column from './components/Column'
import Pie from './components/Pie'
import Totcnt from './components/Totcnt'

@withI18n()
@connect(({ post, loading }) => ({ post, loading }))
class Traffic extends React.Component {
  formRef = React.createRef()
  state = {
    interval: 'hour',
  }
  componentDidMount() {}
  getDataval = (interval) => {
    this.Totcnt.LogPie(interval)
    this.Pie.LogPie(interval)
    this.Column.LogPie(interval)
  }
  render() {
    const { interval } = this.state
    return (
      <div>
        <Row className="Row_c">
          <Col span={14}>
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
          <Col span={10} className="Col_flex_end"></Col>
        </Row>
        <Totcnt ref={(node) => (this.Totcnt = node)}></Totcnt>
        {/* </Card> */}
        <Row style={{ marginTop: '15px' }} gutter={16}>
          <Col span={8}>
            <Pie ref={(node) => (this.Pie = node)}></Pie>
          </Col>
          <Col span={16}>
            <Column ref={(node) => (this.Column = node)}></Column>
          </Col>
        </Row>
      </div>
    )
  }
}
export default Traffic
