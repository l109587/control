import React, { useRef } from 'react'
import { connect, history } from 'umi'
// import { Line } from '@ant-design/charts'
import { Card, Row, Col } from 'antd'
import { TinyLine } from '@ant-design/plots'
import { language } from '@/utils/language'
import { get, post } from '@/services/https'
import styles from '../index.less'

var tinyLineMEMTimer = '';
class TinyAreae extends React.Component {
  formRef = React.createRef()
  state = {
    memlist: [],
    usagemem: '',
    title: language('index.tac.memorystatus'),
  }
  //初始化时自调用一次，用于请求借口数据
  componentDidMount() {
    history.listen((location, action) => {
      clearInterval(tinyLineMEMTimer)
      if (location.pathname == '/index/tac-l') {
        this.getSysChart()
      }
    })
  }
  getSysChart = () => {
    tinyLineMEMTimer = setInterval(() => {
      post('/cfg.php?controller=sysHeader&action=showSysChart', {chartype: 'mem'}).then((res) => {
        let memlist = []
        res.lines.map((item, index) => {
          memlist.push(item.value)
        })
        this.setState({
          memlist: memlist,
          usagemem: res.usage,
          title: res.title,
        })
      })
    }, 2000)
  }
  render() {
    // const { data, xstep } = this.props
    const { memlist, xstep, usagemem, title } = this.state
    const config = {
      autoFit: false,
      data: memlist,
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
                {usagemem}
              </div>
            </Col>
          </Row>
          <div style={{ margin: '12px -12px -12px' }}>
            <div style={{ width: '100%' }}>
              <TinyLine
                {...config}
                className={styles.canva}
                style={{
                  height: 75,
                  backgroundImage:
                    'linear-gradient(to bottom right, #7c9efc,#64b4fd,#4fc7fc,#40d4fc)',
                }}
              />
            </div>
          </div>
        </Card>
      </div>
    )
  }
}
export default TinyAreae
