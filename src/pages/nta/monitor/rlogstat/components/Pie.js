import React, { useRef } from 'react'
// import { Line } from '@ant-design/charts'
import { Card } from 'antd'
// import { Pie, G2 } from '@ant-design/plots'
import { get, post } from '@/services/https'
import DemoPie from '@/components/Charts/Pie/Pie'
import styles from '../index.less'

let H = document.body.clientHeight - 450
var clientHeight = H-(H/4)

class Cpu extends React.Component {
  formRef = React.createRef()
  state = {
    Pielist: [],
    Pietitle: '日志占比',
    Piesubtitle: '最近1周日志总量占比',
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
    post('/cfg.php?controller=sysAnalysis&action=showRptLogPieChart', data).then(
      (res) => {
        res.data?.map((item) => {
          item.totcnt = item.totcnt * 1
        })
        this.setState({
          Pielist: res.data,
          Pietitle: res.title,
          Piesubtitle: res.subtitle,
        })
      }
    )
  }
  render() {
    const { Pielist, Pietitle, Piesubtitle } = this.state
    return (
      <div>
        <Card style={{ width: '100%' }}>
          <div className={styles.fon_16}>{Pietitle}</div>
          <div className={styles.fon_12c}>{Piesubtitle}</div>
          <DemoPie data = {Pielist} clientHeight = {clientHeight} angleField = 'totcnt' colorField = 'name' innerRadius = {0.6}/>
        </Card>
      </div>
    )
  }
}
export default Cpu
