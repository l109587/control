import React, { useRef } from 'react'
import { Card } from 'antd'
import Column from '@/components/Charts/Column/Column'
import { get, post } from '@/services/https'
import styles from '../index.less'

let H = document.body.clientHeight - 450
var clientHeight = H - H / 4

class Cpu extends React.Component {
  formRef = React.createRef()
  state = {
    Columnlist: [],
    Columntitle: '日志排名',
    Columnsubtitle: '最近1周日志总量排名',
    interval: 'hour',
  }
  //初始化时自调用一次，用于请求借口数据
  componentDidMount() {
    this.LogPie(this.state.interval)
  }
  LogPie = (interval) => {
    let data = {
      interval: interval,
    }
    post('/cfg.php?controller=sysAnalysis&action=showRptLogBarChart', data).then(
      (res) => {
        this.setState({
          Columnlist: res.data,
          Columntitle: res.title,
          Columnsubtitle: res.subtitle,
        })
      }
    )
  }
  render() {
    const { Columnlist, Columnsubtitle, Columntitle } = this.state
    
    return (
      <div>
        <Card style={{ width: '100%' }}>
          <div className={styles.fon_16}>{Columntitle}</div>
          <div className={styles.fon_12c}>{Columnsubtitle}</div>
          <Column
          data={Columnlist}
          xField="name"
          yField="value"
          seriesField="type"
          isGroup={true}
          clientHeight={clientHeight}
        />
        </Card>
      </div>
    )
  }
}
export default Cpu
