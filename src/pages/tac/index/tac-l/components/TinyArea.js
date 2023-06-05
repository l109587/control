import React, { useRef } from 'react'
import { connect, history } from 'umi'
import { Card, Row, Col } from 'antd'
import { language } from '@/utils/language'
import { TinyLine } from '@ant-design/plots'
import { get, post } from '@/services/https'
import styles from '../index.less'

var tinyLineCPUTimer = '';
class TinyArea extends React.Component {
  formRef = React.createRef()
  state = {
    cpulist: [],
    usagecpu: '',
    title:language('index.tac.cpustatus'),
  }

  //初始化时自调用一次，用于请求借口数据
  componentDidMount() {
    history.listen((location, action) => {
      clearInterval(tinyLineCPUTimer)
      if (location.pathname == '/index/tac-l') {
        this.getSysChart()
      }
    })
  }

  getSysChart = () => {
    tinyLineCPUTimer = setInterval(() => {
      post('/cfg.php?controller=sysHeader&action=showSysChart', {chartype: 'cpu'}).then((res) => {
        let cpulist = []
        res.lines.map((item, index) => {
          cpulist.push(item.value)
        })
        this.setState({ cpulist: cpulist, usagecpu: res.usage, title: res.title})
      })
    }, 2000)
  }

  render() {
    const { cpulist, xstep, usagecpu,title } = this.state
    const config = {
      autoFit: false,
      data: cpulist,
      smooth: true,
      color: '#ffffff',
      yAxis: {
        min: 0,
        max: 100,
      },
    }
    return (
      <div>
        <Card style={{ width: '100%' }}>
          <Row>
            <Col span={24}>
              <div className={styles.Cpu_bold}>{title}</div>
            </Col>
          </Row>
          <Row className={styles.margin_shi}>
            <Col span={12}>
              <div className={styles.Font_col}>{language('index.tac.currentusage')}</div>
            </Col>
            <Col span={12}>
              <div
                className={styles.Font_col}
                style={{
                  float: 'right',
                  fontSize: '20px',
                  position: 'absolute',
                  right: '0px',
                  top: '-4px',
                }}
              >
                {usagecpu}
              </div>
            </Col>
          </Row>
          <div style={{ margin: '12px -12px -12px' }}>
            <TinyLine
              {...config}
              className={styles.canva}
              style={{
                height: 75,
                backgroundImage: 'linear-gradient(to bottom right, #7c9efc,#64b4fd,#4fc7fc,#40d4fc)',
              }}
            />
          </div>
        </Card>
      </div>
    )
  }
}
export default TinyArea
