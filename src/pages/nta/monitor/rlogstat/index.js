// 流量统计
import React from 'react'
import { connect } from 'umi'
import { withI18n } from '@lingui/react'
import { Card, Row, Col } from 'antd'
import Piecol from './Piecol'
import { Line } from './components'
@withI18n()
@connect(({ post, loading }) => ({ post, loading }))
class Traffic extends React.Component {
 
  render() {
    return (
      <div>
        <Piecol></Piecol>
        <Row style={{ marginTop: '15px' }} gutter={16}>
          <Col span={24}>
            <Card style={{ width: '100%' }}>
              <Line></Line>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}
export default Traffic
