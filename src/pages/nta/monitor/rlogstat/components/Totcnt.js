import React, { useRef } from 'react'
import { Card, Row, Col } from 'antd'
import styles from '../index.less'
import { post } from '@/services/https'
import Jl from '@/assets/nta/jl.png'
import lint from '@/assets/nta/lint.png'
import Secc from '@/assets/nta/secc.png'
import Errer from '@/assets/nta/errer.png'
class Totcnt1 extends React.Component {
  formRef = React.createRef()
  state = {
    from: [],
    interval: 'hour',
  }
  componentDidMount() {
    this.LogPie(this.state.interval)
  }
  LogPie = (interval) => {
    let data = {
      interval: interval,
    }
    post('/cfg.php?controller=sysAnalysis&action=showRptLogCard', data).then(
      (res) => {
        this.setState({ from: res.data })
      }
    )
  }
  render() {
    const { from } = this.state
    return (
      <div>
        <Row gutter={16}>
          {from?.map((item, index) => {
            if (item.type == 'totcnt') {
              return (
                <Col span={6}>
                  <Card className={styles.Bang_div} style={{ width: '100%' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div>
                        <img alt="logo" style={{ width: '40px' }} src={lint} />
                      </div>
                      <div className={styles.fon_si20}>{item.value}</div>
                      <div className={styles.col_c2}>{item.name}</div>
                    </div>
                  </Card>
                </Col>
              )
            } else if (item.type == 'tbytes') {
              return (
                <Col span={6}>
                  <Card className={styles.Bang_div} style={{ width: '100%' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div>
                        <img alt="logo" style={{ width: '40px' }} src={Jl} />
                      </div>
                      <div className={styles.fon_si20}>{item.value}</div>
                      <div className={styles.col_c3}>{item.name}</div>
                    </div>
                  </Card>
                </Col>
              )
            } else if (item.type == 'rptcnt') {
              return (
                <Col span={6}>
                  <Card className={styles.Bang_div} style={{ width: '100%' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div>
                        <img alt="logo" style={{ width: '40px' }} src={Secc} />
                      </div>
                      <div className={styles.fon_si20}>{item.value}</div>
                      <div className={styles.col_c4}>{item.name}</div>
                    </div>
                  </Card>
                </Col>
              )
            } else if (item.type == 'errcnt') {
              return (
                <Col span={6}>
                  <Card className={styles.Bang_div} style={{ width: '100%' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div>
                        <img alt="logo" style={{ width: '40px' }} src={Errer} />
                      </div>
                      <div className={styles.fon_si20}>{item.value}</div>
                      <div className={styles.col_c5}>{item.name}</div>
                    </div>
                  </Card>
                </Col>
              )
            }
          })}
        </Row>
      </div>
    )
  }
}
export default Totcnt1
